import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/lib/cart";
import { createCheckout } from "@/lib/orders.functions";
import { MAX_INSTALLMENTS, formatBRL, installmentCents } from "@/lib/pricing";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Finalizar compra — BTV Stick" },
      { name: "description", content: "Informe seus dados de entrega e pague com segurança pelo Mercado Pago: cartão em até 10x sem juros ou Pix." },
      { property: "og:title", content: "Finalizar compra — BTV Stick" },
      { property: "og:description", content: "Pagamento seguro pelo Mercado Pago e frete grátis para todo o Brasil." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

type Form = {
  fullName: string;
  email: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
};

const empty: Form = { fullName: "", email: "", phone: "", cep: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "" };

function CheckoutPage() {
  const { items, subtotalCents } = useCart();
  const checkout = useServerFn(createCheckout);
  const [form, setForm] = useState<Form>(empty);
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const lookupCep = async () => {
    const cep = form.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = (await res.json()) as { erro?: boolean; logradouro?: string; bairro?: string; localidade?: string; uf?: string };
      if (data.erro) return;
      setForm((f) => ({
        ...f,
        street: f.street || data.logradouro || "",
        neighborhood: f.neighborhood || data.bairro || "",
        city: data.localidade || f.city,
        state: data.uf || f.state,
      }));
    } catch {
      // preenchimento manual
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!accepted) {
      setError("Aceite os Termos de Uso e a Política de Privacidade para continuar.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await checkout({
        data: {
          customer: { fullName: form.fullName, email: form.email, phone: form.phone },
          address: {
            cep: form.cep,
            street: form.street,
            number: form.number,
            complement: form.complement,
            neighborhood: form.neighborhood,
            city: form.city,
            state: form.state.toUpperCase() as "RJ",
          },
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          acceptTerms: true,
        },
      });
      window.location.href = result.paymentUrl;
    } catch (err) {
      const message = readError(err);
      setError(message);
      toast.error(message);
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Seu carrinho está vazio</h1>
        <p className="mt-3 text-muted-foreground">Escolha um modelo para continuar.</p>
        <Button asChild className="mt-8 rounded-full bg-gradient-primary">
          <Link to="/" hash="produtos">Ver modelos</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px]">
      <form onSubmit={onSubmit} className="space-y-8" noValidate>
        <div>
          <h1 className="text-3xl font-bold">Finalizar compra</h1>
          <p className="mt-2 text-muted-foreground">Preencha seus dados. O pagamento é feito na página segura do Mercado Pago.</p>
        </div>

        <fieldset className="space-y-4 rounded-2xl border border-border bg-card/60 p-6">
          <legend className="px-1 font-display font-semibold">Seus dados</legend>
          <Field id="fullName" label="Nome completo" value={form.fullName} onChange={set("fullName")} autoComplete="name" required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="email" label="E-mail" type="email" value={form.email} onChange={set("email")} autoComplete="email" required />
            <Field id="phone" label="Celular com DDD" type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" placeholder="(21) 99999-9999" required />
          </div>
        </fieldset>

        <fieldset className="space-y-4 rounded-2xl border border-border bg-card/60 p-6">
          <legend className="px-1 font-display font-semibold">Endereço de entrega</legend>
          <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
            <Field id="cep" label="CEP" value={form.cep} onChange={set("cep")} onBlur={lookupCep} autoComplete="postal-code" inputMode="numeric" placeholder="00000-000" required />
            <Field id="street" label="Rua" value={form.street} onChange={set("street")} autoComplete="address-line1" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
            <Field id="number" label="Número" value={form.number} onChange={set("number")} required />
            <Field id="complement" label="Complemento (opcional)" value={form.complement} onChange={set("complement")} autoComplete="address-line2" />
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_1fr_100px]">
            <Field id="neighborhood" label="Bairro" value={form.neighborhood} onChange={set("neighborhood")} required />
            <Field id="city" label="Cidade" value={form.city} onChange={set("city")} autoComplete="address-level2" required />
            <Field id="state" label="UF" value={form.state} onChange={set("state")} maxLength={2} autoComplete="address-level1" required />
          </div>
        </fieldset>

        <div className="flex items-start gap-3">
          <Checkbox id="accept" checked={accepted} onCheckedChange={(v) => setAccepted(v === true)} className="mt-0.5" />
          <Label htmlFor="accept" className="text-sm font-normal leading-relaxed text-muted-foreground">
            Li e aceito os{" "}
            <Link to="/termos-de-uso" target="_blank" className="text-primary underline">Termos de Uso</Link>, a{" "}
            <Link to="/politica-de-privacidade" target="_blank" className="text-primary underline">Política de Privacidade</Link> e a{" "}
            <Link to="/trocas-e-devolucoes" target="_blank" className="text-primary underline">Política de Trocas e Devoluções</Link>.
          </Label>
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" disabled={submitting} className="h-12 w-full rounded-full bg-gradient-primary text-base font-semibold shadow-glow sm:w-auto sm:px-10">
          {submitting ? <Loader2 className="animate-spin" /> : <Lock />}
          {submitting ? "Abrindo pagamento..." : "Ir para o pagamento"}
        </Button>
      </form>

      <aside className="h-fit space-y-4 rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-lg font-semibold">Resumo do pedido</h2>
        <ul className="space-y-3 text-sm">
          {items.map((i) => (
            <li key={i.productId} className="flex justify-between gap-3">
              <span>
                {i.quantity}× {i.name}
              </span>
              <span className="font-semibold">{formatBRL(i.priceCents * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Frete</span>
            <span className="font-semibold text-highlight">Grátis</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-muted-foreground">Total</span>
            <span className="font-display text-2xl font-bold">{formatBRL(subtotalCents)}</span>
          </div>
          <p className="text-right text-xs text-muted-foreground">
            ou até {MAX_INSTALLMENTS}x de {formatBRL(installmentCents(subtotalCents))} sem juros · Pix
          </p>
        </div>
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-3.5 text-primary" /> Pagamento processado pelo Mercado Pago. Não guardamos dados do seu cartão.
        </p>
      </aside>
    </main>
  );
}

function Field({ id, label, ...props }: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} className="h-11 bg-background/60" {...props} />
    </div>
  );
}

function readError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  try {
    const issues = JSON.parse(raw) as { message?: string }[];
    if (Array.isArray(issues) && issues[0]?.message) return issues[0].message;
  } catch {
    // não é erro de validação
  }
  return raw || "Não foi possível finalizar. Tente novamente.";
}
