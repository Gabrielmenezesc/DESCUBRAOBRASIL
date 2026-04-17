"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { MapPin, Star, Calendar, Info, Map as MapIcon, Utensils, Bed, Camera, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function GramadoPage() {
  return (
    <main className="min-h-screen bg-background text-foreground scroll-smooth pt-20">
      <Navbar />

      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
          Gramado
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
            4.9 (8k+ avaliações)
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Rio Grande do Sul, Brasil
          </span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            Destino Romântico Premium
          </span>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
         {/* Galeria fake / placeholders para Gramado */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
            <span className="text-slate-400 font-bold col-span-full text-center">Imagens de Gramado (Via CDN/CMS amanhã)</span>
         </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
           <div>
             <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Sobre o Destino</h2>
             <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-6">
               O charme europeu no sul do Brasil. Famosa por seus chocolates artesanais, arquitetura bávara e o clima de aconchego, Gramado é ideal para casais e famílias em busca de um roteiro especial de inverno ou festas de fim de ano (Natal Luz).
             </p>
             <div className="flex gap-4 flex-wrap">
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-semibold">
                 <Calendar className="w-4 h-4 text-emerald-500" />
                 Melhor Época: Junho a Agosto (Inverno) / Dezembro (Natal Luz)
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-semibold">
                 <Info className="w-4 h-4 text-blue-500" />
                 Clima: Temperado
               </div>
             </div>
           </div>

           <hr className="border-slate-200 dark:border-slate-800" />

           <div>
             <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Destaques</h2>
             <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { icon: Camera, title: "Lago Negro", desc: "Perfeito para caminhadas e pedalinhos." },
                  { icon: MapIcon, title: "Rua Coberta", desc: "Lojas, restaurantes e música ao vivo." },
                  { icon: MapPin, title: "Snowland", desc: "Primeiro parque de neve indoor das Américas." },
                  { icon: Utensils, title: "Fábricas de Chocolate", desc: "Degustação em tours especializados." }
                ].map(item => (
                  <div key={item.title} className="flex gap-4 p-4 rounded-2xl glass-card transition-shadow hover:shadow-lg hover:shadow-emerald-500/5">
                    <div className="bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-xl h-fit">
                       <item.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
             </div>
           </div>
        </div>

        <div className="relative">
          <div className="sticky top-28 glass-card border-slate-200 dark:border-slate-700 p-6 shadow-xl rounded-3xl z-10">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Planejando ir?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Organize sua viagem romântica hoje com conforto.</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <button onClick={() => document.getElementById('maya-chat-button')?.click()} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                Criar Roteiro
              </button>
              <Link href="/premium" className="w-full block text-center glass bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 dark:text-emerald-400 font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform border border-emerald-500/20">
                Baixar eBook Gramado
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
