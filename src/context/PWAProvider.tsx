"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface PWAContextType {
  deferredPrompt: any;
  showInstallPrompt: () => void;
  isInstallable: boolean;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent browser default prompt
      e.preventDefault();
      // Store event and set installable
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log("[PWA] Install prompt detected and deferred.");
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Register Service Worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => console.log("[PWA] SW Registered:", reg.scope))
          .catch((err) => console.error("[PWA] SW Registration failed:", err));
      });
    }

    window.addEventListener("appinstalled", () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      console.log("[PWA] App installed successfully.");
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const showInstallPrompt = () => {
    // Case 1: Native install prompt available (Chrome/Edge/Samsung)
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice: any) => {
        if (choice.outcome === "accepted") {
          console.log("[PWA] User accepted installation.");
        }
        setDeferredPrompt(null);
        setIsInstallable(false);
      });
      return;
    }

    // Case 2: iOS Safari — show styled modal with instructions
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isIOS || isSafari) {
      setShowIOSModal(true);
      return;
    }

    // Case 3: Fallback — open the web app directly
    window.open("/app/index.html", "_blank");
  };

  return (
    <PWAContext.Provider value={{ deferredPrompt, showInstallPrompt, isInstallable }}>
      {children}

      {/* iOS Installation Modal */}
      {showIOSModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            padding: "16px",
          }}
          onClick={() => setShowIOSModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              borderRadius: "24px",
              padding: "32px 24px",
              maxWidth: "380px",
              width: "100%",
              color: "white",
              textAlign: "center",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {/* Icon */}
            <div style={{ marginBottom: "16px" }}>
              <img
                src="/icon-192.png"
                alt="Descubra o Brasil"
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "16px",
                  margin: "0 auto",
                  display: "block",
                  boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
                }}
              />
            </div>

            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "8px" }}>
              Instalar Descubra o Brasil
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "24px", lineHeight: 1.5 }}>
              Adicione o app à sua tela inicial para uma experiência completa, rápida e sem navegador.
            </p>

            {/* Steps */}
            <div style={{ textAlign: "left", marginBottom: "24px" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                background: "rgba(255,255,255,0.05)", borderRadius: "12px",
                padding: "12px", marginBottom: "8px",
              }}>
                <span style={{ fontSize: "1.5rem" }}>1️⃣</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>
                    Toque no botão <span style={{ fontSize: "1.2rem" }}>⬆️</span> Compartilhar
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    Na barra inferior do Safari
                  </div>
                </div>
              </div>

              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                background: "rgba(255,255,255,0.05)", borderRadius: "12px",
                padding: "12px", marginBottom: "8px",
              }}>
                <span style={{ fontSize: "1.5rem" }}>2️⃣</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>
                    Toque em &quot;Adicionar à Tela de Início&quot;
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    Role o menu para encontrar a opção
                  </div>
                </div>
              </div>

              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                background: "rgba(16,185,129,0.15)", borderRadius: "12px",
                padding: "12px", border: "1px solid rgba(16,185,129,0.3)",
              }}>
                <span style={{ fontSize: "1.5rem" }}>✅</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#10b981" }}>
                    Pronto! O app aparece na tela inicial
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    Abre como um app nativo, sem barra do navegador
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                border: "none",
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "white",
                fontWeight: 800,
                fontSize: "0.95rem",
                cursor: "pointer",
              }}
            >
              Entendi! 👍
            </button>
          </div>
        </div>
      )}
    </PWAContext.Provider>
  );
}

export function usePWA() {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error("usePWA must be used within a PWAProvider");
  }
  return context;
}
