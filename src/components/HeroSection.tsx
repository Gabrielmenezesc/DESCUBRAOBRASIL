"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, MapPin, Compass } from "lucide-react";
import Globe from "./Globe";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-background">
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-60">
        <Globe />
      </div>
      
      {/* Content wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-[-10vh]">
        {/* ── Badge: Turismo ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-300/40 shadow-sm mb-4"
        >
          <MapPin className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-extrabold text-emerald-700 tracking-wide">
            27 Estados • Milhares de Destinos • 100% Gratuito
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-200 shadow-sm mb-8"
        >
          <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span className="text-sm font-bold text-emerald-700">Destinos, Cultura, Estados e Notícias de Turismo</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900"
        >
          Descubra o Brasil <br />
          <span className="text-gradient">De Norte a Sul</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-10 font-medium leading-relaxed"
        >
          Explore os melhores destinos de viagem, conheça a cultura de cada estado, encontre lugares gratuitos para visitar e acompanhe notícias de turismo atualizadas em tempo real.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a 
            href="#noticias"
            className="group flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] w-full sm:w-auto justify-center shadow-lg shadow-emerald-500/30"
          >
            <Compass className="w-5 h-5" />
            Ver Notícias de Turismo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          
          <a href="#turismo" className="group flex items-center gap-2 glass text-slate-800 hover:bg-slate-50 hover:shadow-lg px-8 py-4 rounded-full font-bold text-lg transition-all w-full sm:w-auto justify-center">
            Ver Destinos
            <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
