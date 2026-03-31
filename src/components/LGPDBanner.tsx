"use client";

import { useState, useEffect } from "react";
import { Shield, X } from "lucide-react";

export default function LGPDBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("lgpd-consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("lgpd-consent", "accepted");
    setVisible(false);
  }

  function reject() {
    localStorage.setItem("lgpd-consent", "rejected");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Shield className="w-8 h-8 text-emerald-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">Política de Privacidade (LGPD)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência. 
              Ao continuar navegando, você concorda com nossa política de privacidade 
              em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={accept}
            className="px-5 py-2 bg-emerald-500 text-white rounded-full text-sm font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
          >
            Aceitar
          </button>
          <button
            onClick={reject}
            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors"
          >
            Recusar
          </button>
          <button onClick={reject} className="p-1 text-slate-400 hover:text-slate-600" aria-label="Fechar">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
