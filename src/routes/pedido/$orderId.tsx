import { useEffect } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, Copy, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { useCart } from "@/lib/cart";
import { getOrder } from "@/lib/orders.functions";
import { formatBRL } from "@/lib/pricing";
import { whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/pedido/$orderId")({
  head: () => ({
    meta: [
      { title: "Seu pedido — BTV Stick" },
      { name: "description", content: "Acompanhe o pagamento do seu pedido BTV Stick." },
      { property: "og:title", content: "Seu pedido — BTV Stick" },
      { property: "og:description", content: "Acompanhe o pagamento do seu pedido BTV Stick." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { orderId } = Route.useParams();
  const { clear } = useCart();
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrder({ data: { orderId } }),
    refetchInterval: (q) => (q.state.data && !q.state.data.paid && q.state.data.status !== "cancelado" ? 8000 : false),
  });

  useEffect(() => {
    if (order) clear();
  }, [order, clear]);

  if (isLoading) {
    return (
      <main className="flex justify-center px-4 py-32">
        <Loader2 className="size-8 animate-spin text-primary" />
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Pedido não encontrado</h1>
        <p className="mt-3 text-muted-foreground">Confira o link ou fale com a gente pelo WhatsApp.</p>
        <Button asChild className="mt-8 rounded-full">
          <Link to="/">Voltar ao início</Link>
        </Button>
      </main>
    );
  }

  const cancelled = order.status === "cancelado";
  const message = order.secretCode
    ? `Olá! Meu pagamento foi aprovado.\nPedido nº ${order.orderNumber}\nCódigo secreto: ${order.secretCode}`
    : "";

  return (
    <main className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="rounded-3xl border border-border bg-card p-8 text-center">
        {order.paid ? (
          <CheckCircle2 className="mx-auto size-14 text-whatsapp" />
        ) : cancelled ? (
          <XCircle className="mx-auto size-14 text-destructive" />
        ) : (
          <Clock className="mx-auto size-14 text-highlight" />
        )}
        <h1 className="mt-4 text-3xl font-bold">
          {order.paid ? "Pagamento aprovado!" : cancelled ? "Pedido cancelado" : "Aguardando pagamento"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Pedido nº <strong className="text-foreground">{order.orderNumber}</strong>
          {order.firstName ? ` · ${order.firstName}` : ""}
        </p>

        {order.paid && order.secretCode ? (
          <div className="mt-8 space-y-5">
            <div className="rounded-2xl border border-primary/40 bg-background/60 p-5">
              <p className="text-sm text-muted-foreground">Seu código secreto do pedido</p>
              <p className="mt-2 font-display text-2xl font-bold tracking-wider text-primary">{order.secretCode}</p>
              <button
                type="button"
                className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                onClick={() => {
                  void navigator.clipboard.writeText(order.secretCode ?? "");
                  toast.success("Código copiado");
                }}
              >
                <Copy className="size-4" /> Copiar código
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              Envie o número do pedido e o código secreto pelo WhatsApp para confirmarmos o envio. Não compartilhe este código com outras pessoas.
            </p>
            <a
              href={whatsappLink(message)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3 font-semibold text-whatsapp-foreground transition-opacity hover:opacity-90"
            >
              <WhatsAppIcon className="size-5" /> Enviar código pelo WhatsApp
            </a>
          </div>
        ) : cancelled ? (
          <p className="mt-6 text-muted-foreground">Se tiver dúvidas, fale com a gente pelo WhatsApp.</p>
        ) : (
          <p className="mt-6 text-muted-foreground">
            Assim que o Mercado Pago confirmar o pagamento, esta página mostra seu código secreto e o botão para enviar pelo
            WhatsApp. Pagamentos por Pix costumam ser confirmados em instantes.
          </p>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card/60 p-6">
        <h2 className="font-display font-semibold">Itens</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {order.items.map((i) => (
            <li key={i.name} className="flex justify-between">
              <span>
                {i.quantity}× {i.name}
              </span>
              <span>{formatBRL(i.lineCents)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-border pt-4">
          <span className="text-muted-foreground">Total (frete grátis)</span>
          <span className="font-display text-xl font-bold">{formatBRL(order.totalCents)}</span>
        </div>
      </div>
    </main>
  );
}
