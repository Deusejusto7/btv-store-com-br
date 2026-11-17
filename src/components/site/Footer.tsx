import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { SITE, openCookieSettings, whatsappLink } from "@/lib/site";
import { Logo } from "./Header";

const policyLinks = [
  { to: "/politica-de-privacidade", label: "Política de Privacidade" },
  { to: "/termos-de-uso", label: "Termos de Uso" },
  { to: "/trocas-e-devolucoes", label: "Trocas e Devoluções" },
  { to: "/politica-de-entrega", label: "Política de Entrega" },
  { to: "/garantia", label: "Garantia" },
  { to: "/politica-de-cookies", label: "Política de Cookies" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <Logo className="text-lg" />
          <p className="text-sm text-muted-foreground">
            Transforme sua TV comum em Smart TV pela entrada HDMI. Frete grátis para todo o Brasil.
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" />
            Pagamentos processados com segurança pelo Mercado Pago
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Políticas</h2>
          <ul className="space-y-2 text-sm">
            {policyLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted-foreground transition-colors hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <button type="button" onClick={openCookieSettings} className="text-muted-foreground transition-colors hover:text-primary">
                Configurações de cookies
              </button>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Atendimento</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              WhatsApp:{" "}
              <a href={whatsappLink("Olá! Tenho uma dúvida sobre o BTV Stick.")} target="_blank" rel="noreferrer" className="hover:text-primary">
                {SITE.whatsappDisplay}
              </a>
            </li>
            <li>
              E-mail:{" "}
              <a href={`mailto:${SITE.supportEmail}`} className="hover:text-primary">
                {SITE.supportEmail}
              </a>
            </li>
            <li>Segunda a sábado, 9h às 18h</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} {SITE.legalName}
          {SITE.legalDocument ? ` — ${SITE.legalDocument}` : ""}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
