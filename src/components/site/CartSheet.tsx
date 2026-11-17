import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { MAX_INSTALLMENTS, MAX_QTY_PER_ITEM, formatBRL, installmentCents } from "@/lib/pricing";

export function CartSheet() {
  const { items, open, setOpen, setQuantity, remove, subtotalCents } = useCart();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col border-border bg-card sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display">Seu carrinho</SheetTitle>
          <SheetDescription>Frete grátis para todo o Brasil.</SheetDescription>
        </SheetHeader>
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
            <ShoppingCart className="size-10" />
            <p>Seu carrinho está vazio.</p>
            <Button variant="outline" onClick={() => setOpen(false)} asChild>
              <Link to="/" hash="produtos">Ver modelos</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto px-4">
              {items.map((item) => (
                <li key={item.productId} className="rounded-xl border border-border bg-background/60 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{formatBRL(item.priceCents)}</p>
                    </div>
                    <button type="button" onClick={() => remove(item.productId)} aria-label={`Remover ${item.name}`} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Button size="icon" variant="outline" className="size-8" onClick={() => setQuantity(item.productId, item.quantity - 1)} aria-label="Diminuir quantidade">
                      <Minus />
                    </Button>
                    <span className="w-8 text-center font-semibold" aria-live="polite">{item.quantity}</span>
                    <Button size="icon" variant="outline" className="size-8" disabled={item.quantity >= MAX_QTY_PER_ITEM} onClick={() => setQuantity(item.productId, item.quantity + 1)} aria-label="Aumentar quantidade">
                      <Plus />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-border p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span className="font-semibold text-highlight">Grátis</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-muted-foreground">Total</span>
                <div className="text-right">
                  <p className="font-display text-2xl font-bold">{formatBRL(subtotalCents)}</p>
                  <p className="text-xs text-muted-foreground">
                    ou até {MAX_INSTALLMENTS}x de {formatBRL(installmentCents(subtotalCents))} sem juros
                  </p>
                </div>
              </div>
              <Button asChild size="lg" className="w-full rounded-full bg-gradient-primary font-semibold shadow-glow" onClick={() => setOpen(false)}>
                <Link to="/checkout">Finalizar compra</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
