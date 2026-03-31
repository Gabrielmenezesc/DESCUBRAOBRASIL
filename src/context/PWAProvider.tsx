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
          .register("/DESCUBRAOBRASIL/sw.js")
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

    // Case 2: iOS Safari — show instructions
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isIOS || isSafari) {
      alert(
        "📱 Para instalar o app no seu iPhone/iPad:\n\n" +
        "1. Toque no botão de Compartilhar (ícone ⬆️) na barra inferior do Safari.\n" +
        "2. Role para baixo e toque em \"Adicionar à Tela de Início\".\n" +
        "3. Toque em \"Adicionar\".\n\n" +
        "Pronto! O app aparecerá na sua tela inicial como um app nativo."
      );
      return;
    }

    // Case 3: Fallback — open the web app directly
    window.open("/DESCUBRAOBRASIL/app/index.html", "_blank");
  };

  return (
    <PWAContext.Provider value={{ deferredPrompt, showInstallPrompt, isInstallable }}>
      {children}
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
