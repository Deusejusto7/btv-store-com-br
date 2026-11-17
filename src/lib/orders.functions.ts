import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { MAX_INSTALLMENTS, MAX_QTY_PER_ITEM, computeOrderTotals } from "./pricing";

const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
] as const;

export const checkoutSchema = z.object({
  customer: z.object({
    fullName: z.string().trim().min(3, "Informe seu nome completo").max(120),
    email: z.string().trim().toLowerCase().email("E-mail inválido").max(160),
    phone: z
      .string()
      .trim()
      .transform((v) => v.replace(/\D/g, ""))
      .refine((v) => v.length === 10 || v.length === 11, "Telefone com DDD inválido"),
  }),
  address: z.object({
    cep: z
      .string()
      .transform((v) => v.replace(/\D/g, ""))
      .refine((v) => v.length === 8, "CEP inválido"),
    street: z.string().trim().min(2, "Informe a rua").max(160),
    number: z.string().trim().min(1, "Informe o número").max(20),
    complement: z.string().trim().max(80).optional().default(""),
    neighborhood: z.string().trim().min(2, "Informe o bairro").max(80),
    city: z.string().trim().min(2, "Informe a cidade").max(80),
    state: z.enum(UFS, { errorMap: () => ({ message: "UF inválida" }) }),
  }),
  items: z
    .array(z.object({ productId: z.string().uuid(), quantity: z.number().int().min(1).max(MAX_QTY_PER_ITEM) }))
    .min(1, "Carrinho vazio")
    .max(10),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: "Aceite os termos para continuar" }) }),
});

export type CheckoutInput = z.input<typeof checkoutSchema>;

export const createCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => checkoutSchema.parse(data))
  .handler(async ({ data }) => {
    const { getMercadoPagoToken, createPreference } = await import("./mercadopago.server");
    if (!getMercadoPagoToken()) {
      throw new Error("O pagamento online ainda está sendo configurado. Fale com a gente pelo WhatsApp.");
    }
    const { getRequestUrl } = await import("@tanstack/react-start/server");
    const origin = getRequestUrl({ xForwardedHost: true }).origin;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const ids = [...new Set(data.items.map((i) => i.productId))];
    const { data: products, error: pErr } = await supabaseAdmin
      .from("products")
      .select("id, name, price_cents")
      .in("id", ids)
      .eq("is_active", true);
    if (pErr) throw new Error("Não foi possível carregar os produtos");
    const totals = computeOrderTotals(data.items, products ?? []);

    const { data: customer, error: cErr } = await supabaseAdmin
      .from("customers")
      .upsert(
        { email: data.customer.email, full_name: data.customer.fullName, phone: data.customer.phone },
        { onConflict: "email" },
      )
      .select("id")
      .single();
    if (cErr || !customer) throw new Error("Não foi possível registrar seus dados");

    const { data: order, error: oErr } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_id: customer.id,
        payment_method: "mercado_pago",
        subtotal_cents: totals.subtotalCents,
        shipping_cents: totals.shippingCents,
        total_cents: totals.totalCents,
        shipping_cep: data.address.cep,
        shipping_street: data.address.street,
        shipping_number: data.address.number,
        shipping_complement: data.address.complement || null,
        shipping_neighborhood: data.address.neighborhood,
        shipping_city: data.address.city,
        shipping_state: data.address.state,
      })
      .select("id, order_number")
      .single();
    if (oErr || !order) throw new Error("Não foi possível criar o pedido");

    const { error: iErr } = await supabaseAdmin.from("order_items").insert(
      totals.lines.map((l) => ({
        order_id: order.id,
        product_id: l.productId,
        product_name: l.name,
        unit_price_cents: l.unitCents,
        quantity: l.quantity,
        line_total_cents: l.lineCents,
      })),
    );
    if (iErr) throw new Error("Não foi possível salvar os itens do pedido");

    const preference = await createPreference({
      orderId: order.id,
      orderNumber: order.order_number,
      origin,
      payer: { name: data.customer.fullName, email: data.customer.email, phone: data.customer.phone },
      items: totals.lines.map((l) => ({ id: l.productId, title: l.name, quantity: l.quantity, unitCents: l.unitCents })),
      maxInstallments: MAX_INSTALLMENTS,
    });
    await supabaseAdmin.from("orders").update({ mp_preference_id: preference.id }).eq("id", order.id);

    return { orderId: order.id, orderNumber: order.order_number, paymentUrl: preference.init_point };
  });

export type PublicOrder = {
  id: string;
  orderNumber: number;
  status: string;
  paid: boolean;
  totalCents: number;
  createdAt: string;
  firstName: string;
  items: { name: string; quantity: number; lineCents: number }[];
  secretCode: string | null;
};

/** Consulta pública do pedido pelo identificador (aleatório, só o comprador recebe). Não expõe endereço nem e-mail. */
export const getOrder = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ orderId: z.string().uuid() }).parse(data))
  .handler(async ({ data }): Promise<PublicOrder | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const mp = await import("./mercadopago.server");

    const load = () =>
      supabaseAdmin
        .from("orders")
        .select("id, order_number, status, total_cents, created_at, secret_code, customers(full_name), order_items(product_name, quantity, line_total_cents)")
        .eq("id", data.orderId)
        .maybeSingle();

    let { data: order } = await load();
    if (!order) return null;

    if ((order.status === "pendente" || order.status === "confirmado") && mp.getMercadoPagoToken()) {
      try {
        const payments = await mp.findPaymentsForOrder(order.id);
        const approved = payments.find((p) => p.status === "approved");
        const latest = approved ?? payments[0];
        if (latest) {
          await mp.applyPaymentToOrder(latest);
          ({ data: order } = await load());
          if (!order) return null;
        }
      } catch (e) {
        console.error("Falha ao consultar pagamento", e);
      }
    }

    const paid = ["pago", "enviado", "entregue"].includes(order.status);
    const customer = order.customers as unknown as { full_name: string } | null;
    return {
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      paid,
      totalCents: order.total_cents,
      createdAt: order.created_at,
      firstName: (customer?.full_name ?? "").split(" ")[0] ?? "",
      items: (order.order_items ?? []).map((i) => ({
        name: i.product_name,
        quantity: i.quantity,
        lineCents: i.line_total_cents,
      })),
      secretCode: paid ? order.secret_code : null,
    };
  });
