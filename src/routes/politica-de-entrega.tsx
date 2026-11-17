import { createFileRoute } from "@tanstack/react-router";
import { ContactBlock, LegalPage, LegalSection } from "@/components/site/LegalPage";

export const Route = createFileRoute("/politica-de-entrega")({
  head: () => ({
    meta: [
      { title: "Política de Entrega — BTV Stick" },
      { name: "description", content: "Frete grátis para todo o Brasil: prazos, rastreio e regras de entrega da BTV Stick." },
      { property: "og:title", content: "Política de Entrega — BTV Stick" },
      { property: "og:description", content: "Frete grátis, prazos de envio e como acompanhar seu pedido." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ShippingPage,
});

function ShippingPage() {
  return (
    <LegalPage title="Política de Entrega" intro="Entregamos em todo o Brasil com frete grátis. Veja como funciona.">
      <LegalSection title="1. Frete grátis">
        <p>Todos os pedidos têm frete grátis para qualquer endereço do Brasil.</p>
      </LegalSection>
      <LegalSection title="2. Prazos">
        <ul>
          <li>O pedido é preparado e postado em até 2 dias úteis após a confirmação do pagamento.</li>
          <li>O prazo de entrega depende da região, em geral de 3 a 12 dias úteis após a postagem.</li>
          <li>Pagamentos por Pix são confirmados em instantes; por cartão, em até 2 dias úteis.</li>
        </ul>
      </LegalSection>
      <LegalSection title="3. Rastreio">
        <p>Assim que o pedido for postado, enviamos o código de rastreio pelo WhatsApp ou e-mail informado na compra.</p>
      </LegalSection>
      <LegalSection title="4. Endereço e recebimento">
        <ul>
          <li>Confira o endereço antes de pagar. Mudanças só podem ser feitas antes da postagem.</li>
          <li>Se a transportadora não encontrar ninguém após as tentativas, o pedido volta para nós e combinamos um novo envio sem custo.</li>
          <li>Ao receber, confira a embalagem. Se estiver violada ou danificada, recuse o recebimento e fale com a gente.</li>
        </ul>
      </LegalSection>
      <LegalSection title="5. Atrasos">
        <p>Se o pedido não chegar no prazo informado, entre em contato. Acompanhamos o caso até a entrega ou devolvemos o valor pago.</p>
        <ContactBlock />
      </LegalSection>
    </LegalPage>
  );
}
