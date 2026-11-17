import type { Database } from "@/integrations/supabase/types";

type OrderStatus = Database["public"]["Enums"]["order_status"];

const MP_API = "https://api.mercadopago.com";

export function getMercadoPagoToken(): string | null {
  const token = process.env["MERCADOPAGO_ACCESS_TOKEN"];
  return token && token.trim().length > 0 ? token.trim() : null;
}

async function mpFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getMercadoPagoToken();
  if (!token) throw new Error("Pagamento online ainda não configurado");
  const res = await fetch(`${MP_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const body = await res.text();
  if (!res.ok) {
    console.error(`Mercado Pago ${path} falhou [${res.status}]: ${body}`);
    throw new Error(`Mercado Pago recusou a solicitação (${res.status})`);
  }
  return JSON.parse(body) as T;
}

export type MpPreferenceInput = {
  orderId: string;
  orderNumber: number;
  origin: string;
  payer: { name: string; email: string; phone: string };
  items: { id: string; title: string; quantity: number; unitCents: number }[];
  maxInstallments: number;
};

export async function createPreference(input: MpPreferenceInput) {
  const returnUrl = `${input.origin}/pedido/${input.orderId}`;
  const isPublicHttps = input.origin.startsWith("https://") && !input.origin.includes("localhost");
  const digits = input.payer.phone.replace(/\D/g, "");
  const body: Record<string, unknown> = {
    external_reference: input.orderId,
    statement_descriptor: "BTVSTICK",
    items: input.items.map((i) => ({
      id: i.id,
      title: i.title,
      quantity: i.quantity,
      unit_price: i.unitCents / 100,
      currency_id: "BRL",
    })),
    payer: {
      name: input.payer.name,
      email: input.payer.email,
      phone: { area_code: digits.slice(0, 2), number: digits.slice(2) },
    },
    payment_methods: { installments: input.maxInstallments },
    back_urls: { success: returnUrl, pending: returnUrl, failure: returnUrl },
    metadata: { order_number: input.orderNumber },
  };
  if (isPublicHttps) {
    body["auto_return"] = "approved";
    body["notification_url"] = `${input.origin}/api/public/mercadopago/webhook`;
  }
  return mpFetch<{ id: string; init_point: string }>("/checkout/preferences", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export type MpPayment = {
  id: number;
  status: string;
  status_detail: string;
  external_reference: string | null;
  transaction_amount: number;
  currency_id: string;
};

export function getPayment(paymentId: string) {
  return mpFetch<MpPayment>(`/v1/payments/${encodeURIComponent(paymentId)}`);
}

export async function findPaymentsForOrder(orderId: string): Promise<MpPayment[]> {
  const data = await mpFetch<{ results: MpPayment[] }>(
    `/v1/payments/search?external_reference=${encodeURIComponent(orderId)}&sort=date_created&criteria=desc`,
  );
  return data.results ?? [];
}

function statusFromPayment(payment: MpPayment): OrderStatus | null {
  switch (payment.status) {
    case "approved":
      return "pago";
    case "refunded":
    case "charged_back":
      return "cancelado";
    default:
      return null;
  }
}

/** Aplica um pagamento confirmado pelo Mercado Pago ao pedido. O código secreto é gerado pelo banco ao virar "pago". */
export async function applyPaymentToOrder(payment: MpPayment): Promise<void> {
  const orderId = payment.external_reference;
  if (!orderId) return;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("id, status, total_cents")
    .eq("id", orderId)
    .maybeSingle();
  if (error) throw error;
  if (!order) return;

  let next = statusFromPayment(payment);
  if (next === "pago") {
    const paidCents = Math.round(payment.transaction_amount * 100);
    if (payment.currency_id !== "BRL" || paidCents < order.total_cents) {
      console.error(`Pagamento ${payment.id} com valor divergente para o pedido ${orderId}`);
      next = null;
    }
    // Pedido já pago/enviado/entregue não volta atrás.
    if (order.status !== "pendente" && order.status !== "confirmado") next = null;
  }

  const update: Database["public"]["Tables"]["orders"]["Update"] = {
    mp_payment_id: String(payment.id),
    payment_status_detail: `${payment.status}:${payment.status_detail}`,
  };
  if (next) update.status = next;
  const { error: upErr } = await supabaseAdmin.from("orders").update(update).eq("id", orderId);
  if (upErr) throw upErr;
}
