"use client";

import { Download } from "lucide-react";
import { usePWA } from "@/context/PWAProvider";

export default function FloatingAppButton() {
  const { showInstallPrompt } = usePWA();

  return (
    <button
      onClick={showInstallPrompt}
      id="floating-download-app"
      aria-label="Baixar App"
      className="fixed right-4 bottom-24 z-[9998] group"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "linear-gradient(135deg, #10b981, #059669)",
        color: "white",
        border: "none",
        borderRadius: "50px",
        padding: "14px 20px",
        fontWeight: 800,
        fontSize: "0.85rem",
        cursor: "pointer",
        boxShadow: "0 8px 32px rgba(16,185,129,0.4), 0 0 0 4px rgba(16,185,129,0.15)",
        transition: "all 0.3s ease",
        animation: "pulse-glow 2s infinite",
      }}
    >
      <Download className="w-5 h-5" />
      <span className="hidden sm:inline">Baixar App</span>
      <span className="sm:hidden">App</span>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 8px 32px rgba(16,185,129,0.4), 0 0 0 4px rgba(16,185,129,0.15);
          }
          50% {
            box-shadow: 0 8px 32px rgba(16,185,129,0.6), 0 0 0 8px rgba(16,185,129,0.1);
          }
        }
      `}</style>
    </button>
  );
}
