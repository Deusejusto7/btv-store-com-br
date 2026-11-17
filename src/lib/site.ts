export const SITE = {
  name: "BTV Stick",
  whatsappNumber: "5521973231992",
  whatsappDisplay: "(21) 97323-1992",
  supportEmail: "btvconectsupport@gmail.com",
  // Atualize com a razão social e o CNPJ/CPF oficiais quando disponíveis.
  legalName: "BTV Stick",
  legalDocument: "",
  policiesUpdatedAt: "17 de novembro de 2026",
} as const;

export function whatsappLink(message: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const OPEN_COOKIE_SETTINGS_EVENT = "open-cookie-settings";

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}
