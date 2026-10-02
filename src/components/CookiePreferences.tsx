"use client";

import { useEffect, useState } from "react";

type Preferences = {
  necessary: true;
  analytics: boolean;
  personalization: boolean;
  updatedAt: string;
};

const storageKey = "dob-cookie-preferences";

function readPreferences(): Preferences | null {
  try {
    const saved = window.localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) as Preferences : null;
  } catch {
    return null;
  }
}

export default function CookiePreferences() {
  const [ready, setReady] = useState(false);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [personalization, setPersonalization] = useState(false);

  useEffect(() => {
    const saved = readPreferences();
    setPreferences(saved);
    setAnalytics(Boolean(saved?.analytics));
    setPersonalization(Boolean(saved?.personalization));
    setReady(true);
  }, []);

  const save = (next: Omit<Preferences, "necessary" | "updatedAt">) => {
    const value: Preferences = {
      necessary: true,
      analytics: next.analytics,
      personalization: next.personalization,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(storageKey, JSON.stringify(value));
    setPreferences(value);
    setAnalytics(value.analytics);
    setPersonalization(value.personalization);
    setOpen(false);
  };

  if (!ready) return null;

  return (
    <>
      {!preferences && !open && (
        <section className="cookie-banner" aria-label="Preferências de cookies">
          <div>
            <strong>Sua privacidade importa</strong>
            <p>Usamos somente recursos necessários até você escolher as categorias opcionais. Esta escolha não substitui os Termos de Uso.</p>
          </div>
          <div className="cookie-banner-actions">
            <button className="cookie-button cookie-button--quiet" onClick={() => setOpen(true)}>Escolher preferências</button>
            <button className="cookie-button cookie-button--outline" onClick={() => save({ analytics: false, personalization: false })}>Somente necessários</button>
            <button className="cookie-button cookie-button--primary" onClick={() => save({ analytics: true, personalization: true })}>Aceitar todos</button>
          </div>
        </section>
      )}

      {preferences && (
        <button className="cookie-manage" onClick={() => setOpen(true)} aria-label="Gerenciar preferências de cookies">
          Cookies
        </button>
      )}

      {open && (
        <div className="cookie-backdrop" role="presentation">
          <section className="cookie-dialog" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
            <button className="cookie-close" onClick={() => setOpen(false)} aria-label="Fechar preferências">×</button>
            <p className="cookie-eyebrow">PRIVACIDADE</p>
            <h2 id="cookie-title">Escolha seus cookies</h2>
            <p>Você pode aceitar somente o que é necessário para o site funcionar. Recursos opcionais permanecem desligados até sua autorização.</p>

            <label className="cookie-choice cookie-choice--required">
              <span><strong>Necessários</strong><small>Segurança, tema e funcionamento básico.</small></span>
              <input type="checkbox" checked disabled aria-label="Cookies necessários sempre ativos" />
            </label>
            <label className="cookie-choice">
              <span><strong>Medição de uso</strong><small>Ajuda a entender quais páginas precisam melhorar.</small></span>
              <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} />
            </label>
            <label className="cookie-choice">
              <span><strong>Personalização</strong><small>Guarda preferências para deixar a experiência mais relevante.</small></span>
              <input type="checkbox" checked={personalization} onChange={(event) => setPersonalization(event.target.checked)} />
            </label>

            <div className="cookie-dialog-actions">
              <button className="cookie-button cookie-button--outline" onClick={() => save({ analytics: false, personalization: false })}>Somente necessários</button>
              <button className="cookie-button cookie-button--primary" onClick={() => save({ analytics, personalization })}>Salvar escolhas</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
