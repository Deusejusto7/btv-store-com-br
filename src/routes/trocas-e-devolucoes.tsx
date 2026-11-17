import { createFileRoute } from "@tanstack/react-router";
import { ContactBlock, LegalPage, LegalSection } from "@/components/site/LegalPage";

export const Route = createFileRoute("/trocas-e-devolucoes")({
  head: () => ({
    meta: [
      { title: "Trocas e Devoluções — BTV Stick" },
      { name: "description", content: "Direito de arrependimento em 7 dias, trocas por defeito e reembolso na loja BTV Stick." },
      { property: "og:title", content: "Trocas e Devoluções — BTV Stick" },
      { property: "og:description", content: "Como devolver, trocar ou pedir reembolso do seu BTV Stick." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReturnsPage,
});

function ReturnsPage() {
  return (
    <LegalPage
      title="Trocas e Devoluções"
      intro="Queremos que você fique satisfeito com sua compra. Veja como funcionam devoluções, trocas e reembolsos."
    >
      <LegalSection title="1. Direito de arrependimento (7 dias)">
        <p>
          Conforme o art. 49 do Código de Defesa do Consumidor, você pode desistir da compra em até <strong>7 dias corridos</strong> a partir do
          recebimento do produto, sem precisar justificar. O frete de devolução é por nossa conta e o valor pago é devolvido integralmente.
        </p>
      </LegalSection>

      <LegalSection title="2. Produto com defeito">
        <p>
          Se o produto apresentar defeito, você pode pedir a troca dentro do prazo de garantia. Analisamos o aparelho em até 30 dias; se o
          defeito não for resolvido nesse prazo, você pode escolher entre a troca por outro igual, a devolução do valor pago ou o abatimento
          proporcional do preço (art. 18 do CDC).
        </p>
      </LegalSection>

      <LegalSection title="3. Como solicitar">
        <ul>
          <li>Fale com a gente pelo WhatsApp ou e-mail informando o número do pedido e o motivo.</li>
          <li>Enviaremos as instruções e a autorização de postagem sem custo para você.</li>
          <li>Envie o produto com acessórios (controle, cabo e fonte) e, se possível, na embalagem original.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Reembolso">
        <ul>
          <li><strong>Cartão de crédito:</strong> o estorno é solicitado ao Mercado Pago em até 5 dias úteis após recebermos o produto e pode aparecer em até duas faturas, conforme o banco.</li>
          <li><strong>Pix:</strong> devolução para a mesma conta de origem em até 5 dias úteis após recebermos o produto.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Quando a troca não se aplica">
        <p>
          Danos causados por mau uso, quedas, contato com líquidos, ligação em voltagem errada ou abertura do aparelho por terceiros não são
          cobertos como defeito, mas não afetam o seu direito de arrependimento em 7 dias.
        </p>
      </LegalSection>

      <LegalSection title="6. Contato">
        <ContactBlock />
      </LegalSection>
    </LegalPage>
  );
}
