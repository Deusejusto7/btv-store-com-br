import type { ReactNode } from "react";
import { SITE } from "@/lib/site";

export function LegalPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">Políticas BTV Stick</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Última atualização: {SITE.policiesUpdatedAt}</p>
      <p className="mt-6 text-muted-foreground">{intro}</p>
      <div className="legal-content mt-8 space-y-8">{children}</div>
    </main>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="space-y-3 leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-foreground">
        {children}
      </div>
    </section>
  );
}

export function ContactBlock() {
  return (
    <p>
      E-mail: <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> · WhatsApp: {SITE.whatsappDisplay}
    </p>
  );
}
