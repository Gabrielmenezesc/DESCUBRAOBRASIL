"use client";

import { Sparkles, MapPin, Compass } from "lucide-react";
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
        {/* Badge: Turismo */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-300/40 shadow-sm mb-4">
          <MapPin className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300 tracking-wide">
            27 Estados • Milhares de Destinos • 100% Gratuito
          </span>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-200 shadow-sm mb-8">
          <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Destinos, Cultura, Estados e Notícias de Turismo</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white">
          Descubra o Melhor <br />
          <span className="text-gradient">do Brasil</span>
        </h1>

        <p className="mt-6 text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8 font-medium leading-relaxed">
          Destinos, viagens, experiências e dicas em um só lugar.
        </p>
        
        <div className="max-w-2xl mx-auto mb-10 relative">
          <div className="glass flex items-center p-2 rounded-full shadow-lg border border-emerald-200/50 dark:border-emerald-500/30 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md">
            <MapPin className="w-6 h-6 text-emerald-500 ml-4 hidden sm:block" />
            <input 
              type="text" 
              placeholder="Buscar cidade, estado ou destino..." 
              className="w-full bg-transparent border-none outline-none px-4 py-3 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 font-medium text-lg"
            />
            <button className="bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-6 py-3 rounded-full font-bold shadow-md shadow-emerald-500/20 hover:scale-105 transition-transform flex items-center gap-2">
              Buscar
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="#turismo"
            className="group flex items-center gap-2 glass-card border border-emerald-300 text-emerald-800 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 w-full sm:w-auto justify-center"
          >
            <Compass className="w-5 h-5" />
            Explorar destinos
          </a>
          
          <button 
             onClick={() => document.getElementById('maya-chat-button')?.click()}
             className="group flex items-center gap-2 bg-slate-900 dark:bg-slate-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 w-full sm:w-auto justify-center shadow-xl shadow-slate-900/20"
          >
            Falar com Maya
            <Sparkles className="w-5 h-5 ml-1 text-emerald-400" />
          </button>
        </div>
      </div>
    </section>
  );
}
