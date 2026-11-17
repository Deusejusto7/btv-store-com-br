import { createFileRoute } from "@tanstack/react-router";

// O Mercado Pago avisa aqui quando um pagamento muda. Nunca confiamos no corpo do aviso:
// o pagamento é sempre reconsultado na API do Mercado Pago com o token da loja.
export const Route = createFileRoute("/api/public/mercadopago/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        let type = url.searchParams.get("type") ?? url.searchParams.get("topic");
        let paymentId = url.searchParams.get("data.id") ?? url.searchParams.get("id");
        try {
          const body = (await request.json().catch(() => null)) as
            | { type?: string; action?: string; data?: { id?: string | number } }
            | null;
          if (body?.type) type = body.type;
          if (body?.data?.id) paymentId = String(body.data.id);
        } catch {
          // corpo vazio
        }
        if (type !== "payment" || !paymentId || !/^\d+$/.test(paymentId)) {
          return new Response("ignored", { status: 200 });
        }
        const mp = await import("@/lib/mercadopago.server");
        try {
          const payment = await mp.getPayment(paymentId);
          await mp.applyPaymentToOrder(payment);
          return new Response("ok", { status: 200 });
        } catch (e) {
          console.error("Webhook Mercado Pago falhou", e);
          return new Response("error", { status: 500 });
        }
      },
    },
  },
});
