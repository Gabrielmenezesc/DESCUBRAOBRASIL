"use client";

import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import MayaChat from "@/components/MayaChat";
import LGPDBanner from "@/components/LGPDBanner";
import { motion } from "framer-motion";
import { Megaphone, ArrowRight } from "lucide-react";

export default function ServicosPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="flex-grow pt-32 pb-24 bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold mb-6"
          >
            <Megaphone className="w-4 h-4" />
            PARCERIAS E PUBLICIDADE
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8"
          >
            Seja destaque no <span className="text-gradient">Descubra o Brasil</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            A gestão de publicidade, marketing e parcerias comerciais exclusivas do aplicativo e site é realizada pela <strong className="text-emerald-600">Rede Brasília News</strong>. 
            Conecte sua pousada, restaurante ou atração a milhares de turistas.
          </motion.p>
          
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            href="https://wa.me/5538991621135?text=Ol%C3%A1!%20Gostaria%20de%20anunciar%20meu%20neg%C3%B3cio%20no%20Descubra%20o%20Brasil%20atrav%C3%A9s%20da%20Rede%20Bras%C3%ADlia%20News."
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-10 py-5 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 transition-all"
          >
            Falar com a Equipe Comercial
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </div>
      </section>

      <FooterSection />
      <MayaChat />
      <LGPDBanner />
    </main>
  );
}
