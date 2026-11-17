import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Check, CreditCard, Headphones, ShieldCheck, ShoppingCart, Truck, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { useCart } from "@/lib/cart";
import { productsQuery, type Product } from "@/lib/products.functions";
import { MAX_INSTALLMENTS, formatBRL, installmentCents } from "@/lib/pricing";
import { SITE, whatsappLink } from "@/lib/site";
import poster from "@/assets/btv-stick-poster.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BTV Stick — Sua TV comum vira Smart TV | Frete grátis" },
      {
        name: "description",
        content: "Transforme sua TV em Smart TV pela entrada HDMI. BTV Stick Lite, 4K e 4K Max com frete grátis e até 10x sem juros no cartão.",
      },
      { property: "og:title", content: "BTV Stick — Sua TV comum vira Smart TV" },
      { property: "og:description", content: "Filmes, séries, esportes e apps na sua TV em segundos. Frete grátis e até 10x sem juros." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: Index,
});

const highlights = [
  { title: "4K", text: "Imagem ultra nítida" },
  { title: "Plug & Play", text: "Instala em 1 minuto" },
  { title: "1 ano", text: "De garantia" },
];

const trust = [
  { icon: Truck, text: "Frete grátis para todo o Brasil" },
  { icon: CreditCard, text: "Até 10x sem juros no cartão" },
  { icon: ShieldCheck, text: "Pagamento seguro Mercado Pago" },
  { icon: Headphones, text: "Suporte pelo WhatsApp" },
];

function Index() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const featured = products.find((p) => p.is_featured) ?? products[0];

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-highlight/40 bg-highlight/10 px-3 py-1 text-xs font-semibold text-highlight">
              <Truck className="size-3.5" /> Frete grátis para todo o Brasil
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Sua TV comum vira <span className="text-gradient-primary">Smart TV</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Conecte na entrada HDMI e assista filmes, séries, esportes e apps em segundos.
            </p>
            {featured && (
              <div className="mt-8 inline-flex items-center gap-4 rounded-2xl border border-primary/40 bg-card/70 px-5 py-4 shadow-glow">
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
                  <CreditCard className="size-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Leve o seu parcelado</p>
                  <p className="font-display text-2xl font-bold">
                    {MAX_INSTALLMENTS}x de <span className="text-primary">{formatBRL(installmentCents(featured.price_cents))}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">sem juros no cartão de crédito</p>
                </div>
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 rounded-full bg-gradient-primary px-7 text-base font-semibold shadow-glow">
                <a href="#produtos">Ver modelos</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full bg-transparent px-7 text-base">
                <a href={whatsappLink("Olá! Quero comprar o BTV Stick.")} target="_blank" rel="noreferrer">
                  <WhatsAppIcon className="text-whatsapp" /> Falar no WhatsApp
                </a>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-primary/30 shadow-glow">
            <img
              src={poster.url}
              alt="BTV Stick com controle remoto: transforme sua TV em Smart TV"
              width={1254}
              height={1254}
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      <section id="beneficios" className="mx-auto max-w-6xl scroll-mt-20 px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {highlights.map((h) => (
            <div key={h.title} className="rounded-2xl border border-border bg-card/60 p-6 text-center">
              <p className="font-display text-3xl font-bold text-primary">{h.title}</p>
              <p className="mt-1 text-muted-foreground">{h.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/40 px-4 py-4 text-sm text-muted-foreground">
              <Icon className="size-5 shrink-0 text-primary" /> {text}
            </div>
          ))}
        </div>
      </section>

      <section id="produtos" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
        <div className="text-center">
          <h2 className="text-4xl font-bold sm:text-5xl">Escolha seu BTV Stick</h2>
          <p className="mt-3 text-muted-foreground">
            Todos com frete grátis, 1 ano de garantia e parcelamento em até 10x sem juros.
          </p>
        </div>
        <div className="mt-14 grid items-start gap-6 md:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-primary/30 bg-card/60 p-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-3xl font-bold">Ficou com alguma dúvida?</h2>
            <p className="mt-2 text-muted-foreground">Fale com a gente no WhatsApp e escolha o modelo ideal para sua TV.</p>
          </div>
          <a
            href={whatsappLink("Olá! Tenho uma dúvida sobre o BTV Stick.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3 font-semibold text-whatsapp-foreground transition-opacity hover:opacity-90"
          >
            <WhatsAppIcon className="size-5" /> {SITE.whatsappDisplay}
          </a>
        </div>
      </section>
    </main>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const featured = product.is_featured;
  return (
    <article
      className={`relative rounded-3xl border p-7 ${
        featured ? "border-primary/60 bg-card shadow-glow md:-mt-4 md:pb-10" : "border-border bg-card/60"
      }`}
    >
      {featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-4 py-1 text-xs font-bold text-primary-foreground">
          MAIS VENDIDO
        </span>
      )}
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex size-12 items-center justify-center rounded-full ${
            featured ? "bg-gradient-primary text-primary-foreground" : "bg-secondary text-primary"
          }`}
        >
          <Tv className="size-5" />
        </span>
        <div>
          <h3 className="text-xl font-bold">{product.name}</h3>
          <p className="text-xs tracking-[0.25em] text-muted-foreground">{product.tier}</p>
        </div>
      </div>
      <p className="mt-6 font-display text-4xl font-bold">{formatBRL(product.price_cents)}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        ou até {product.max_installments}x de{" "}
        <strong className="text-foreground">{formatBRL(installmentCents(product.price_cents, product.max_installments))}</strong> sem juros
      </p>
      <ul className="mt-6 space-y-3 text-sm">
        {product.features.map((f) => (
          <li key={f} className="flex items-center gap-3">
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Check className="size-3" />
            </span>
            {f}
          </li>
        ))}
        <li className="flex items-center gap-3 text-highlight">
          <span className="inline-flex size-5 items-center justify-center rounded-full bg-highlight/15">
            <Check className="size-3" />
          </span>
          Frete grátis
        </li>
      </ul>
      <Button
        size="lg"
        variant={featured ? "default" : "outline"}
        className={`mt-8 h-12 w-full rounded-full text-base font-semibold ${featured ? "bg-gradient-primary shadow-glow" : "bg-transparent"}`}
        onClick={() => add({ productId: product.id, name: product.name, priceCents: product.price_cents })}
      >
        <ShoppingCart /> Adicionar ao carrinho
      </Button>
    </article>
  );
}
