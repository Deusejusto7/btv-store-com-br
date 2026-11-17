import { describe, expect, it } from "vitest";
import { computeOrderTotals, formatBRL, installmentCents } from "./pricing";

const products = [
  { id: "lite", name: "BTV Stick Lite", price_cents: 19990 },
  { id: "4k", name: "BTV Stick 4K", price_cents: 29990 },
  { id: "max", name: "BTV Stick 4K Max", price_cents: 39990 },
];

describe("regras de preço", () => {
  it("BTV Stick 4K sai em 10x de R$ 29,99", () => {
    expect(formatBRL(installmentCents(29990))).toBe("R$ 29,99");
  });

  it("BTV Stick Lite sai em 10x de R$ 19,99", () => {
    expect(formatBRL(installmentCents(19990))).toBe("R$ 19,99");
  });

  it("frete é grátis", () => {
    const totals = computeOrderTotals([{ productId: "max", quantity: 1 }], products);
    expect(totals.shippingCents).toBe(0);
    expect(totals.totalCents).toBe(39990);
  });

  it("usa o preço oficial e soma itens repetidos", () => {
    const totals = computeOrderTotals(
      [
        { productId: "4k", quantity: 1 },
        { productId: "4k", quantity: 1 },
        { productId: "lite", quantity: 1 },
      ],
      products,
    );
    expect(totals.subtotalCents).toBe(29990 * 2 + 19990);
  });

  it("recusa mais de 10 unidades do mesmo modelo", () => {
    expect(() => computeOrderTotals([{ productId: "lite", quantity: 11 }], products)).toThrow();
  });

  it("recusa produto que não existe", () => {
    expect(() => computeOrderTotals([{ productId: "x", quantity: 1 }], products)).toThrow();
  });
});
