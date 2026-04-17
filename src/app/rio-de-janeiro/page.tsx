"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { MapPin, Star, Calendar, Info, Map as MapIcon, Utensils, Bed, Camera, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function RioDeJaneiroPage() {
  return (
    <main className="min-h-screen bg-background text-foreground scroll-smooth pt-20">
      <Navbar />

      {/* Hero Header Estilo Airbnb */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
          Rio de Janeiro
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
            4.9 (12k+ avaliações)
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Estado do Rio de Janeiro, Brasil
          </span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            Destino Premium
          </span>
        </div>
      </header>

      {/* Galeria Premium Estilo Airbnb (Bento Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl">
          <div className="md:col-span-2 h-full relative group">
            <img src="https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070&auto=format&fit=crop" alt="Cristo Redentor" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>
          <div className="hidden md:grid grid-rows-2 gap-2 h-full">
             <div className="h-full relative group">
               <img src="https://images.unsplash.com/photo-1516315720917-231fd9cae475?q=80&w=2069&auto=format&fit=crop" alt="Pão de Açúcar" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
             </div>
             <div className="h-full relative group">
               <img src="https://images.unsplash.com/photo-1590401037593-9c8cbcc03ce0?q=80&w=2070&auto=format&fit=crop" alt="Copacabana" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
             </div>
          </div>
          <div className="hidden md:grid grid-rows-2 gap-2 h-full">
             <div className="h-full relative group">
               <img src="https://images.unsplash.com/photo-1560067645-a4f6bb99f0ce?q=80&w=2078&auto=format&fit=crop" alt="Arcos da Lapa" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
             </div>
             <div className="h-full relative group">
               <img src="https://images.unsplash.com/photo-1512411516805-4c0efd06c747?q=80&w=2070&auto=format&fit=crop" alt="Ipanema" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
             </div>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 grid md:grid-cols-3 gap-12">
        
        {/* Coluna Esquerda: Descrição e Informações */}
        <div className="md:col-span-2 space-y-12">
           <div>
             <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Sobre o Destino</h2>
             <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-6">
               O Rio de Janeiro, conhecido mundialmente como a "Cidade Maravilhosa", oferece uma mistura perfeita entre natureza exuberante, praias icônicas e uma vida cultural vibrante. De trilhas espetaculares na Mata Atlântica até noites boêmias na Lapa, o Rio tem atrações para todos os estilos de viagem.
             </p>
             <div className="flex gap-4 flex-wrap">
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-semibold">
                 <Calendar className="w-4 h-4 text-emerald-500" />
                 Melhor Época: Março a Maio
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-semibold">
                 <Info className="w-4 h-4 text-blue-500" />
                 Clima: Tropical
               </div>
             </div>
           </div>

           <hr className="border-slate-200 dark:border-slate-800" />

           <div>
             <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">O que fazer (Destaques)</h2>
             <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { icon: Camera, title: "Cristo Redentor", desc: "Uma das Sete Maravilhas do Mundo." },
                  { icon: MapIcon, title: "Pão de Açúcar", desc: "Pôr do sol inesquecível pelo bondinho." },
                  { icon: MapPin, title: "Praia de Ipanema", desc: "Cultura praiana e esportes na areia." },
                  { icon: Utensils, title: "Santa Teresa", desc: "Gastronomia, bondinho e arte na rua." }
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

           <hr className="border-slate-200 dark:border-slate-800" />

           {/* Onde Ficar e Onde Comer */}
           <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                  <Bed className="w-6 h-6 text-indigo-500" /> Onde ficar
                </h2>
                <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                  <li><strong>Zona Sul (Copacabana/Ipanema):</strong> Ideal para primeira vez. Perto de tudo e praias.</li>
                  <li><strong>Santa Teresa:</strong> Perfil romântico e mais rústico/artístico.</li>
                  <li><strong>Barra da Tijuca:</strong> Resorts modernos e praias tranquilas.</li>
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                  <Utensils className="w-6 h-6 text-orange-500" /> Onde comer
                </h2>
                <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                  <li><strong>Leblon:</strong> Alta gastronomia e bistrôs premiados.</li>
                  <li><strong>Botafogo:</strong> Pólo gastronômico criativo e agitado.</li>
                  <li><strong>Lapa:</strong> Bares tradicionais e comida de boteco raiz.</li>
                </ul>
              </div>
           </div>
        </div>

        {/* Coluna Direita: Sticky Card Call-to-action (estilo Booking) */}
        <div className="relative">
          <div className="sticky top-28 glass-card border-slate-200 dark:border-slate-700 p-6 shadow-xl rounded-3xl z-10">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Planejando ir?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Organize sua viagem hoje com o Descubra O Brasil e economize em passeios.</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <button onClick={() => document.getElementById('maya-chat-button')?.click()} className="w-full bg-slate-900 dark:bg-white dark:bg-slate-900 text-white dark:text-slate-900 dark:text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                Criar Roteiro com a Maya
              </button>
              
            <div className="text-center">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Acesse nosso Aplicativo</span>
              <p className="text-xs mt-2 text-slate-500 dark:text-slate-400">Tenha mapas offline, cupons e a biblioteca completa no seu celular.</p>
            </div>
          </div>
        </div>

      </section>

      {/* Seção FAQ */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl font-bold text-center mb-10 text-slate-900 dark:text-white">Dúvidas Frequentes</h2>
           <div className="space-y-4">
              <details className="group glass-card p-4 rounded-2xl cursor-pointer">
                 <summary className="font-bold text-slate-800 dark:text-slate-200 list-none flex justify-between items-center">
                    É seguro visitar o Rio de Janeiro?
                    <span className="transition group-open:rotate-180">↓</span>
                 </summary>
                 <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                   Como em qualquer grande metrópole, é necessário ter precauções básicas: evite andar com objetos de muito valor visíveis nas ruas, utilize aplicativos de transporte à noite e priorize os pontos turísticos oficiais. A rota turística tradicional tem policiamento reforçado.
                 </p>
              </details>
              <details className="group glass-card p-4 rounded-2xl cursor-pointer">
                 <summary className="font-bold text-slate-800 dark:text-slate-200 list-none flex justify-between items-center">
                    Quantos dias são ideais?
                    <span className="transition group-open:rotate-180">↓</span>
                 </summary>
                 <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                   Recomendamos no mínimo 4 dias para conhecer o essencial (Cristo, Pão de Açúcar, Praias principais e Centro Histórico). Se quiser estender para Búzios ou Arraial do Cabo, considere de 7 a 10 dias.
                 </p>
              </details>
           </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
