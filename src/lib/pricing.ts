/** Regras de preço da loja: frete grátis, até 10x sem juros, no máximo 10 unidades por item. */
export const FREE_SHIPPING_CENTS = 0;
export const MAX_INSTALLMENTS = 10;
export const MAX_QTY_PER_ITEM = 10;

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatBRL(cents: number): string {
  return brl.format(cents / 100).replace(/\u00a0/g, " ");
}

/** Valor de cada parcela sem juros, arredondado para baixo no centavo. */
export function installmentCents(priceCents: number, installments = MAX_INSTALLMENTS): number {
  return Math.floor(priceCents / installments);
}

export type PricedProduct = { id: string; name: string; price_cents: number };
export type CartLine = { productId: string; quantity: number };

export type OrderTotals = {
  lines: { productId: string; name: string; unitCents: number; quantity: number; lineCents: number }[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
};

/** Calcula o pedido sempre a partir dos preços oficiais dos produtos, nunca dos preços enviados pelo navegador. */
export function computeOrderTotals(cart: CartLine[], products: PricedProduct[]): OrderTotals {
  if (cart.length === 0) throw new Error("Carrinho vazio");
  const byId = new Map(products.map((p) => [p.id, p]));
  const merged = new Map<string, number>();
  for (const line of cart) {
    merged.set(line.productId, (merged.get(line.productId) ?? 0) + line.quantity);
  }
  const lines = [...merged.entries()].map(([productId, quantity]) => {
    const product = byId.get(productId);
    if (!product) throw new Error("Produto indisponível");
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY_PER_ITEM) {
      throw new Error(`Quantidade inválida (máximo ${MAX_QTY_PER_ITEM} por modelo)`);
    }
    return {
      productId,
      name: product.name,
      unitCents: product.price_cents,
      quantity,
      lineCents: product.price_cents * quantity,
    };
  });
  const subtotalCents = lines.reduce((sum, l) => sum + l.lineCents, 0);
  const shippingCents = FREE_SHIPPING_CENTS;
  return { lines, subtotalCents, shippingCents, totalCents: subtotalCents + shippingCents };
}
