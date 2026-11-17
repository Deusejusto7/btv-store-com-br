import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { needsAnswer, onConsentChange, readChoice, saveChoices, type Purpose } from "@/lib/consent";
import { OPEN_COOKIE_SETTINGS_EVENT } from "@/lib/site";

const PURPOSES: Purpose[] = ["analytics"];

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [gpc, setGpc] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setGpc((navigator as unknown as { globalPrivacyControl?: boolean }).globalPrivacyControl === true);
    let active = true;
    void needsAnswer(PURPOSES).then((needed) => {
      if (active && needed) setShowBanner(true);
    });
    const unsubscribe = onConsentChange(() => setAnalytics(readChoice("analytics") === "granted"));
    const openSettings = () => {
      setAnalytics(readChoice("analytics") === "granted");
      setSettingsOpen(true);
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    return () => {
      active = false;
      unsubscribe();
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    };
  }, []);

  useEffect(() => {
    if (showBanner) bannerRef.current?.focus();
  }, [showBanner]);

  const decideAll = (choice: "granted" | "denied") => {
    saveChoices({ analytics: choice });
    setShowBanner(false);
    setSettingsOpen(false);
  };

  const saveSettings = () => {
    saveChoices({ analytics: analytics ? "granted" : "denied" });
    setSettingsOpen(false);
    setShowBanner(false);
  };

  return (
    <>
      {showBanner && (
        <div
          ref={bannerRef}
          tabIndex={-1}
          role="region"
          aria-label="Aviso de cookies"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-border bg-card/95 p-5 shadow-2xl backdrop-blur outline-none sm:inset-x-6"
        >
          <h2 className="font-display text-base font-semibold">Sua privacidade</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Contamos as visitas sem cookies. Se você aceitar, também medimos os cliques. Saiba mais na nossa{" "}
            <Link to="/politica-de-privacidade" className="text-primary underline underline-offset-2">
              Política de Privacidade
            </Link>{" "}
            e na{" "}
            <Link to="/politica-de-cookies" className="text-primary underline underline-offset-2">
              Política de Cookies
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="grid flex-1 grid-cols-2 gap-2">
              <Button onClick={() => decideAll("granted")} variant="secondary" className="rounded-full">
                Aceitar todos
              </Button>
              <Button onClick={() => decideAll("denied")} variant="secondary" className="rounded-full">
                Rejeitar todos
              </Button>
            </div>
            <Button
              variant="ghost"
              className="rounded-full"
              onClick={() => {
                setAnalytics(readChoice("analytics") === "granted");
                setSettingsOpen(true);
              }}
            >
              Configurações de cookies
            </Button>
          </div>
        </div>
      )}

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-display">Configurações de cookies</DialogTitle>
            <DialogDescription>Escolha o que podemos medir durante a sua visita.</DialogDescription>
          </DialogHeader>
          {gpc && (
            <p className="rounded-lg border border-border bg-background/60 p-3 text-sm text-muted-foreground">
              Seu navegador envia o sinal de privacidade (Global Privacy Control). Respeitamos esse sinal, por isso a
              medição opcional fica desligada.
            </p>
          )}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4 rounded-xl border border-border p-4">
              <div>
                <p className="font-semibold">Necessários</p>
                <p className="text-sm text-muted-foreground">
                  Guardam seu carrinho e suas escolhas de privacidade neste navegador. Sempre ativos.
                </p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-primary">Sempre ativos</span>
            </div>
            <div className="flex items-start justify-between gap-4 rounded-xl border border-border p-4">
              <div>
                <label htmlFor="consent-analytics" className="font-semibold">
                  Análise, fornecida pela Lovable
                </label>
                <p className="text-sm text-muted-foreground">Mede os cliques para entendermos como o site é usado.</p>
              </div>
              <Switch
                id="consent-analytics"
                checked={!gpc && analytics}
                disabled={gpc}
                onCheckedChange={setAnalytics}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveSettings} className="rounded-full">
              Salvar preferências
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
