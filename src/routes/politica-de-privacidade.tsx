import { Link, createFileRoute } from "@tanstack/react-router";
import { ContactBlock, LegalPage, LegalSection } from "@/components/site/LegalPage";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — BTV Stick" },
      { name: "description", content: "Como a BTV Stick coleta, usa e protege seus dados pessoais, conforme a LGPD." },
      { property: "og:title", content: "Política de Privacidade — BTV Stick" },
      { property: "og:description", content: "Saiba quais dados coletamos, para quê e como exercer seus direitos pela LGPD." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage
      title="Política de Privacidade"
      intro={`Esta política explica como a ${SITE.legalName} trata os dados pessoais de quem visita e compra em nosso site, de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).`}
    >
      <LegalSection title="1. Quem é o responsável pelos seus dados">
        <p>
          O controlador dos dados é <strong>{SITE.legalName}</strong>
          {SITE.legalDocument ? `, ${SITE.legalDocument}` : ""}. Para qualquer assunto sobre dados pessoais, fale com o nosso encarregado
          pelo e-mail <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.
        </p>
      </LegalSection>

      <LegalSection title="2. Quais dados coletamos">
        <ul>
          <li><strong>Dados de cadastro e entrega:</strong> nome completo, e-mail, celular e endereço (CEP, rua, número, complemento, bairro, cidade e UF), informados por você ao finalizar a compra.</li>
          <li><strong>Dados do pedido:</strong> produtos, quantidades, valores, número do pedido, situação do pagamento e o código secreto gerado após a confirmação do pagamento.</li>
          <li><strong>Dados de pagamento:</strong> o pagamento é feito diretamente no Mercado Pago. Nós <strong>não recebemos nem guardamos</strong> número de cartão, código de segurança ou senha bancária; recebemos apenas a confirmação e o identificador do pagamento.</li>
          <li><strong>Dados de navegação:</strong> descritos no item 5.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Para que usamos seus dados e com qual base legal">
        <ul>
          <li>Processar o pedido, confirmar o pagamento, emitir documentos e entregar o produto — execução de contrato (art. 7º, V, LGPD).</li>
          <li>Atender você no suporte, trocas, devoluções e garantia — execução de contrato e exercício regular de direitos.</li>
          <li>Cumprir obrigações legais e fiscais, como guardar registros de vendas — obrigação legal (art. 7º, II).</li>
          <li>Prevenir fraudes e garantir a segurança das compras — legítimo interesse (art. 7º, IX).</li>
          <li>Medir como o site é usado para melhorá-lo — legítimo interesse e, para a medição de cliques, o seu consentimento.</li>
        </ul>
        <p>Não vendemos seus dados e não enviamos mensagens de marketing sem a sua autorização.</p>
      </LegalSection>

      <LegalSection title="4. Com quem compartilhamos">
        <ul>
          <li><strong>Mercado Pago:</strong> recebe nome, e-mail, telefone e itens do pedido para processar o pagamento. O tratamento feito por ele segue a política de privacidade do Mercado Pago.</li>
          <li><strong>Transportadoras e Correios:</strong> recebem nome, telefone e endereço para realizar a entrega.</li>
          <li><strong>Lovable:</strong> hospeda o site e o banco de dados onde guardamos pedidos e clientes.</li>
          <li><strong>ViaCEP:</strong> ao digitar o CEP no checkout, seu navegador consulta o serviço ViaCEP para preencher o endereço automaticamente; só o CEP é enviado.</li>
          <li><strong>Google Fonts:</strong> as fontes do site são carregadas dos servidores do Google, que recebem o endereço IP do seu navegador para entregar os arquivos.</li>
          <li><strong>WhatsApp:</strong> quando você toca em um botão de WhatsApp, abre uma conversa no aplicativo da Meta; as mensagens que você enviar seguem a política do WhatsApp.</li>
          <li><strong>Autoridades:</strong> quando houver obrigação legal ou ordem judicial.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Estatísticas de visitas">
        <p>
          Usamos as estatísticas de visitas da Lovable. Elas não usam cookies, não guardam nada no seu aparelho, não mantêm endereços IP e não
          identificam quem você é. A Lovable coleta esses dados para nós. A{" "}
          <a href="https://lovable.dev/privacy" target="_blank" rel="noreferrer">política de privacidade da Lovable</a> explica como ela os trata.
        </p>
        <p>
          Neste site são registrados: as páginas visitadas, de onde o visitante veio, o país, o navegador, o sistema operacional e o tipo de
          aparelho, quanto tempo a pessoa fica, a velocidade de carregamento das páginas, erros e os cliques em botões e links. Os dados
          detalhados ficam guardados por 90 dias e os resumos diários por um ano.
        </p>
        <p>
          <strong>Cliques:</strong> para visitantes da União Europeia/EEE, do Reino Unido, da Suíça e de todo o Canadá, só são registrados
          depois que você aceita a análise no aviso de cookies. Para os demais visitantes, incluindo o Brasil, são registrados a menos que você
          os recuse no aviso ou nas configurações de cookies, ou que o seu navegador envie o sinal Global Privacy Control. Com esse sinal ativo,
          os cliques nunca são registrados, mesmo que você aceite. Sua escolha fica salva no seu navegador por até 12 meses.
        </p>
        <p>
          Páginas visitadas, tempo na página, velocidade e erros são registrados para todos os visitantes, sem cookies e sem identificar
          ninguém. Veja também a <Link to="/politica-de-cookies">Política de Cookies</Link>.
        </p>
      </LegalSection>

      <LegalSection title="6. Por quanto tempo guardamos">
        <p>
          Guardamos os dados de pedidos e clientes pelo tempo necessário para cumprir o contrato, a garantia e as obrigações legais e fiscais
          (em geral, 5 anos após a compra). Depois disso, os dados são excluídos ou anonimizados.
        </p>
      </LegalSection>

      <LegalSection title="7. Seus direitos">
        <p>Pela LGPD (art. 18), você pode, a qualquer momento e gratuitamente:</p>
        <ul>
          <li>confirmar se tratamos seus dados e ter acesso a eles;</li>
          <li>corrigir dados incompletos, inexatos ou desatualizados;</li>
          <li>pedir a anonimização, o bloqueio ou a exclusão de dados desnecessários;</li>
          <li>pedir a portabilidade dos dados;</li>
          <li>saber com quem compartilhamos seus dados;</li>
          <li>revogar o consentimento, quando ele for a base do tratamento;</li>
          <li>reclamar à Autoridade Nacional de Proteção de Dados (ANPD).</li>
        </ul>
        <p>Para exercer seus direitos, escreva para o contato abaixo. Respondemos em até 15 dias.</p>
        <ContactBlock />
      </LegalSection>

      <LegalSection title="8. Segurança">
        <p>
          O site usa conexão criptografada (HTTPS). Os dados de clientes e pedidos ficam em banco de dados com acesso restrito ao sistema da
          loja, e o pagamento é feito em ambiente seguro do Mercado Pago.
        </p>
      </LegalSection>

      <LegalSection title="9. Alterações">
        <p>Podemos atualizar esta política. A data da última atualização aparece no topo da página.</p>
      </LegalSection>
    </LegalPage>
  );
}
