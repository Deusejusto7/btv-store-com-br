import { Link, createFileRoute } from "@tanstack/react-router";
import { ContactBlock, LegalPage, LegalSection } from "@/components/site/LegalPage";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/termos-de-uso")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — BTV Stick" },
      { name: "description", content: "Regras de uso do site e condições de compra dos produtos BTV Stick." },
      { property: "og:title", content: "Termos de Uso — BTV Stick" },
      { property: "og:description", content: "Condições de compra, pagamento, preços e responsabilidades na loja BTV Stick." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage
      title="Termos de Uso"
      intro={`Ao usar este site e comprar nossos produtos, você concorda com estes termos. Eles seguem o Código de Defesa do Consumidor (Lei nº 8.078/1990) e o Decreto nº 7.962/2013 sobre comércio eletrônico.`}
    >
      <LegalSection title="1. Quem somos">
        <p>
          A loja é operada por <strong>{SITE.legalName}</strong>
          {SITE.legalDocument ? `, ${SITE.legalDocument}` : ""}. Atendimento: <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> e
          WhatsApp {SITE.whatsappDisplay}.
        </p>
      </LegalSection>

      <LegalSection title="2. Produtos">
        <p>
          O BTV Stick é um aparelho que se conecta à entrada HDMI da TV e permite acessar aplicativos pela internet. É necessário ter TV com
          entrada HDMI, tomada ou porta USB para energia e conexão Wi‑Fi. Os aplicativos de streaming podem exigir assinatura própria, que não
          está incluída no preço do aparelho. As imagens do site são ilustrativas.
        </p>
      </LegalSection>

      <LegalSection title="3. Preços e pagamento">
        <ul>
          <li>Os preços estão em reais (R$) e podem mudar sem aviso; vale o preço exibido no momento da compra.</li>
          <li>O pagamento é feito pelo Mercado Pago, por cartão de crédito em até 10x sem juros ou por Pix, conforme as opções exibidas na página de pagamento.</li>
          <li>O pedido só é confirmado depois que o Mercado Pago aprova o pagamento. Após a aprovação, você recebe o número do pedido e um código secreto exclusivo para confirmar o pedido com o nosso atendimento.</li>
          <li>Pedidos com indício de fraude ou dados incorretos podem ser cancelados, com devolução integral do valor.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Entrega, trocas e garantia">
        <p>
          O frete é grátis para todo o Brasil. Veja os detalhes na <Link to="/politica-de-entrega">Política de Entrega</Link>, na{" "}
          <Link to="/trocas-e-devolucoes">Política de Trocas e Devoluções</Link> e na página de <Link to="/garantia">Garantia</Link>.
        </p>
      </LegalSection>

      <LegalSection title="5. Uso correto">
        <p>
          O produto deve ser usado apenas para acessar conteúdos legais e autorizados. Não nos responsabilizamos pelo uso de aplicativos ou
          conteúdos de terceiros instalados pelo cliente que violem direitos autorais ou a legislação.
        </p>
      </LegalSection>

      <LegalSection title="6. Seus dados">
        <p>
          O tratamento dos seus dados segue a <Link to="/politica-de-privacidade">Política de Privacidade</Link> e a{" "}
          <Link to="/politica-de-cookies">Política de Cookies</Link>.
        </p>
      </LegalSection>

      <LegalSection title="7. Foro">
        <p>Fica eleito o foro do domicílio do consumidor para resolver qualquer questão relacionada a estes termos.</p>
        <ContactBlock />
      </LegalSection>
    </LegalPage>
  );
}
