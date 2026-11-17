import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ContactBlock, LegalPage, LegalSection } from "@/components/site/LegalPage";
import { openCookieSettings } from "@/lib/site";

export const Route = createFileRoute("/politica-de-cookies")({
  head: () => ({
    meta: [
      { title: "Política de Cookies — BTV Stick" },
      { name: "description", content: "O que o site BTV Stick guarda no seu navegador e como mudar suas preferências de cookies." },
      { property: "og:title", content: "Política de Cookies — BTV Stick" },
      { property: "og:description", content: "Saiba o que guardamos no seu navegador e como escolher o que podemos medir." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <LegalPage
      title="Política de Cookies"
      intro="Cookies e armazenamento local são pequenos dados que um site guarda no seu navegador. Aqui explicamos o que usamos e como você controla isso."
    >
      <LegalSection title="1. O que guardamos no seu navegador">
        <p>Não usamos cookies de publicidade nem de rastreamento. Guardamos apenas o necessário para o site funcionar:</p>
        <ul>
          <li><strong>Carrinho de compras</strong> (btv_cart): lembra os produtos que você adicionou. Fica no seu navegador até você finalizar a compra ou limpar os dados.</li>
          <li><strong>Suas escolhas de privacidade</strong> (cookie_consent_analytics): lembra se você aceitou ou recusou a medição de cliques, por até 12 meses.</li>
        </ul>
        <p>Esses itens são necessários e não podem ser desligados, mas você pode apagá-los nas configurações do seu navegador.</p>
      </LegalSection>

      <LegalSection title="2. Estatísticas de visitas">
        <p>
          As estatísticas de visitas da Lovable não usam cookies e não guardam nada no seu aparelho. Páginas visitadas, tempo na página,
          velocidade e erros são contados para todos, sem identificar ninguém. A medição de cliques depende da sua escolha, como explicado na{" "}
          <Link to="/politica-de-privacidade">Política de Privacidade</Link>.
        </p>
      </LegalSection>

      <LegalSection title="3. Serviços de terceiros">
        <ul>
          <li><strong>Mercado Pago:</strong> ao ir para o pagamento, você entra na página do Mercado Pago, que usa os próprios cookies conforme a política dele.</li>
          <li><strong>Google Fonts:</strong> carrega as fontes do site; não grava cookies do nosso site.</li>
          <li><strong>WhatsApp:</strong> só é acionado quando você toca em um botão de WhatsApp.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Como mudar suas preferências">
        <p>Você pode aceitar ou recusar a medição de cliques a qualquer momento:</p>
        <Button onClick={openCookieSettings} variant="secondary" className="rounded-full">
          Abrir configurações de cookies
        </Button>
        <p>Se o seu navegador enviar o sinal Global Privacy Control, respeitamos esse sinal e a medição de cliques fica desligada.</p>
      </LegalSection>

      <LegalSection title="5. Contato">
        <ContactBlock />
      </LegalSection>
    </LegalPage>
  );
}
