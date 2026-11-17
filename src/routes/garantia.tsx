import { createFileRoute } from "@tanstack/react-router";
import { ContactBlock, LegalPage, LegalSection } from "@/components/site/LegalPage";

export const Route = createFileRoute("/garantia")({
  head: () => ({
    meta: [
      { title: "Garantia de 1 ano — BTV Stick" },
      { name: "description", content: "Todos os modelos BTV Stick têm 1 ano de garantia. Veja o que está coberto e como acionar." },
      { property: "og:title", content: "Garantia de 1 ano — BTV Stick" },
      { property: "og:description", content: "O que a garantia cobre e como acionar o suporte BTV Stick." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WarrantyPage,
});

function WarrantyPage() {
  return (
    <LegalPage
      title="Garantia"
      intro="Todos os modelos BTV Stick (Lite, 4K e 4K Max) têm 1 ano de garantia contra defeitos de fabricação, contados a partir do recebimento."
    >
      <LegalSection title="1. Prazo">
        <p>
          São 12 meses no total: 90 dias de garantia legal (art. 26 do Código de Defesa do Consumidor) mais 9 meses de garantia oferecida pela
          loja.
        </p>
      </LegalSection>
      <LegalSection title="2. O que está coberto">
        <ul>
          <li>Defeitos de fabricação do aparelho, do controle remoto e da fonte de energia.</li>
          <li>Falhas de funcionamento em uso normal, conforme as instruções.</li>
        </ul>
      </LegalSection>
      <LegalSection title="3. O que não está coberto">
        <ul>
          <li>Quedas, batidas, contato com líquidos, ligação em voltagem errada ou descargas elétricas.</li>
          <li>Aparelho aberto ou consertado por terceiros.</li>
          <li>Funcionamento de aplicativos, conteúdos ou serviços de terceiros e problemas na internet do cliente.</li>
          <li>Desgaste natural, como pilhas do controle.</li>
        </ul>
      </LegalSection>
      <LegalSection title="4. Como acionar">
        <p>
          Fale com a gente pelo WhatsApp ou e-mail com o número do pedido e uma descrição do problema. Primeiro tentamos resolver à distância;
          se for preciso, enviamos a autorização de postagem sem custo e fazemos o reparo ou a troca.
        </p>
        <ContactBlock />
      </LegalSection>
    </LegalPage>
  );
}
