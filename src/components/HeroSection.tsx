"use client";

import { motion } from "framer-motion";
import { ArrowRight, Smartphone, Sparkles, Zap } from "lucide-react";
import Globe from "./Globe";

import { usePWA } from "@/context/PWAProvider";

export default function HeroSection() {
  const { showInstallPrompt } = usePWA();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-background">
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-60">
        <Globe />
      </div>
      
      {/* Content wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-[-10vh]">
        {/* ── Marketing Banner: Escassez & Novidade ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-300/40 shadow-sm mb-4"
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-extrabold text-amber-700 tracking-wide">
            Nova Versão 2026: Experiência 8D Liberada
          </span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-200 shadow-sm mb-8"
        >
          <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span className="text-sm font-bold text-emerald-700">A Nova Geração do Turismo Digital</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900"
        >
          Descubra o Brasil <br />
          <span className="text-gradient">Como Você Nunca Viu</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-10 font-medium leading-relaxed"
        >
          O mapa 3D mais inteligente do Brasil. A IA Maya planeja sua viagem, encontra os melhores destinos e monta o roteiro perfeito — tudo em tempo real.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button 
            onClick={showInstallPrompt}
            className="group flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] w-full sm:w-auto justify-center shadow-lg shadow-emerald-500/30"
          >
            <Smartphone className="w-5 h-5" />
            Explorar Agora
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <a href="#turismo" className="group flex items-center gap-2 glass text-slate-800 hover:bg-slate-50 hover:shadow-lg px-8 py-4 rounded-full font-bold text-lg transition-all w-full sm:w-auto justify-center">
            Ver Destinos
            <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
