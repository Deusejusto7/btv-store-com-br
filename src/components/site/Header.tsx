import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function Logo({ className = "text-xl" }: { className?: string }) {
  return (
    <span className={`font-display font-extrabold tracking-tight ${className}`}>
      BTV<span className="text-primary">STICK</span>
    </span>
  );
}

export function Header() {
  const { count, setOpen } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" aria-label="BTV Stick — página inicial">
          <Logo />
        </Link>
        <nav className="flex items-center gap-2 sm:gap-6">
          <Link to="/" hash="beneficios" className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block">
            Benefícios
          </Link>
          <Link to="/" hash="produtos" className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block">
            Produtos
          </Link>
          <a
            href={whatsappLink("Olá! Quero saber mais sobre o BTV Stick.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2 text-sm font-semibold text-whatsapp-foreground transition-opacity hover:opacity-90"
          >
            <WhatsAppIcon className="size-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`Abrir carrinho (${count} ${count === 1 ? "item" : "itens"})`}
            className="relative inline-flex size-10 items-center justify-center rounded-full border border-border bg-card transition-colors hover:border-primary/60"
          >
            <ShoppingCart className="size-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
