"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Lock, Star, Map, Book } from "lucide-react";
import Link from "next/link";

export default function PremiumPage() {
  return (
    <main className="min-h-screen bg-background text-foreground scroll-smooth transition-colors duration-700 pt-20">
      <Navbar />
      
      <section className="relative overflow-hidden py-24">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl saturate-150 animate-pulse" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-3xl saturate-150 animate-pulse delay-1000" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold text-sm mb-6 border border-emerald-200 dark:border-emerald-800/50"
            >
              <Star className="w-4 h-4 fill-emerald-600 dark:fill-emerald-400" />
              Área de Membros Premium
            </motion.div>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-5xl font-black mb-6 text-slate-900 dark:text-white"
            >
              Sua viagem, <span className="text-gradient">perfeita</span>.
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 dark:text-slate-400"
            >
              Acesso exclusivo a roteiros personalizados pela Maya, biblioteca de eBooks, mapas offline e cupons de parceiros locais.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
            {/* Login Card */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-8 flex flex-col justify-center items-center text-center shadow-emerald-500/5"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-100">Já sou Premium</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">Acesse sua conta para visualizar roteiros e favoritos.</p>
              <button className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white dark:bg-slate-900 text-white dark:text-slate-900 dark:text-white font-bold hover:scale-[1.02] transition-transform">
                Fazer Login
              </button>
            </motion.div>

            {/* Subscribe Card */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-8 flex flex-col justify-center items-center text-center border-emerald-500/30 shadow-emerald-500/10"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                <Book className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-100">Seja Premium</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">Desbloqueie o máximo da nossa plataforma hoje.</p>
              <Link 
                href="/anuncie"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-emerald-500/30"
              >
                Conhecer Planos
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
