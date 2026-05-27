"use client";

import { useState } from "react";
import { Share2, Check, Copy, MessageCircle } from "lucide-react";
import { getGamificationStats } from "@/lib/gamification";

const XIcon = () => (
  <svg className="w-4 h-4 text-slate-200 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function ShareButton() {
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleShare = async () => {
    const stats = await getGamificationStats();
    const shareText = `🎒 Estou explorando o Brasil no "Descubra o Brasil"! Já carimbei ${stats.visitedStates.length} estados e cheguei ao Nível ${stats.level} (${stats.xp} XP)! 🧭\nVenha desbravar também: https://descubraobrasil.com.br`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Descubra o Brasil Turismo",
          text: shareText,
          url: "https://descubraobrasil.com.br"
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      setShowOptions(!showOptions);
    }
  };

  const copyToClipboard = async () => {
    const stats = await getGamificationStats();
    const shareText = `🎒 Estou explorando o Brasil no "Descubra o Brasil"! Já carimbei ${stats.visitedStates.length} estados e cheguei ao Nível ${stats.level} (${stats.xp} XP)! 🧭\nVenha desbravar também: https://descubraobrasil.com.br`;

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 px-6 py-3.5 rounded-full font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20"
      >
        <Share2 className="w-4 h-4" />
        Compartilhar Progresso
      </button>

      {showOptions && (
        <div className="absolute top-full right-0 mt-3 p-3 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl flex flex-col gap-2 min-w-[200px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-white/5 text-slate-200 text-xs font-bold w-full transition-colors text-left"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copiar texto formatado</span>
              </>
            )}
          </button>
          
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              `🎒 Estou explorando o Brasil no "Descubra o Brasil"! Venha desbravar também: https://descubraobrasil.com.br`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-white/5 text-slate-200 text-xs font-bold w-full transition-colors text-left"
          >
            <XIcon />
            <span>Compartilhar no X</span>
          </a>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `🎒 Estou explorando o Brasil no "Descubra o Brasil"! Venha desbravar também: https://descubraobrasil.com.br`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-white/5 text-slate-200 text-xs font-bold w-full transition-colors text-left"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Enviar no WhatsApp</span>
          </a>
        </div>
      )}
    </div>
  );
}
