"use client";

import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { MapPin, Star, Calendar, Info, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function FozDoIguacuPage() {
  return (
    <main className="min-h-screen bg-background text-foreground scroll-smooth pt-20">
      <Navbar />

      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
          Foz do Iguaçu
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1"><Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />5.0 (20k+ avaliações)</span>
          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />Paraná, Brasil</span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="w-4 h-4" />Maravilha do Mundo</span>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
         <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
            <span className="text-slate-400 font-bold">Imagens das Cataratas... (Em breve)</span>
         </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
           <div>
             <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Sobre o Destino</h2>
             <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-6">
               Lar de uma das Sete Maravilhas da Natureza. Foz do Iguaçu é um destino internacional, garantindo infraestrutura e compras na fronteira.
             </p>
           </div>
        </div>

        <div className="relative">
          <div className="sticky top-28 glass-card p-6 shadow-xl rounded-3xl z-10">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Planeje-se</h3>
            <button onClick={() => document.getElementById('maya-chat-button')?.click()} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-xl mb-4">
              Falar com Maya
            </button>
            <div className="text-center mt-6">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Acesse nosso Aplicativo</span>
              <p className="text-xs mt-2 text-slate-500 dark:text-slate-400">Tenha mapas offline, cupons e a biblioteca completa no seu celular.</p>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
