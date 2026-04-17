"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Star, CheckCircle2, Download, BookOpen, Crown } from "lucide-react";

export default function PremiumPage() {
  const plans = [
    {
      name: "FREE",
      price: "R$ 0",
      period: "/sempre",
      popular: false,
      features: [
        "Notícias públicas",
        "10 favoritos",
        "5 mensagens Maya por dia",
        "Preview de eBooks"
      ],
      buttonText: "Plano Atual"
    },
    {
      name: "PREMIUM MENSAL",
      price: "R$ 19,90",
      period: "/mês",
      popular: true,
      features: [
        "120 mensagens Maya/mês",
        "4 eBooks IA/mês",
        "Biblioteca completa",
        "5 mapas offline",
        "Alertas personalizados",
        "Cupons de parceiros locais",
        "Favoritos ilimitados"
      ],
      buttonText: "Testar Premium"
    },
    {
      name: "PREMIUM ANUAL",
      price: "R$ 179",
      period: "/ano",
      popular: false,
      features: [
        "Tudo do plano mensal",
        "2 eBooks bônus premium",
        "Atendimento com prioridade máxima",
        "Sem limites de mapas locais"
      ],
      buttonText: "Assinar Agora"
    }
  ];

  const ebooks = [
    "Rio de Janeiro em 4 dias", "Brasília além do básico", "Gramado romântico",
    "Salvador cultural", "Bonito sem erro", "Foz em família",
    "Fernando de Noronha premium", "Lençóis na melhor época",
    "Chapada aventura leve", "Brasil econômico"
  ];

  return (
    <main className="min-h-screen bg-background text-foreground scroll-smooth transition-colors duration-700 pt-20">
      <Navbar />
      
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-slate-50/50 dark:bg-[#0B1120] -z-10" />
        <div className="absolute top-[-20%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl animate-pulse" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold text-sm mb-6 border border-emerald-200 dark:border-emerald-800/50"
            >
              <Crown className="w-5 h-5 fill-emerald-600 dark:fill-emerald-400" />
              Assinaturas para Viajantes
            </motion.div>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-6xl font-black mb-6 text-slate-900 dark:text-white"
            >
              Viaje de forma <span className="text-gradient">inteligente</span>.
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 dark:text-slate-400"
            >
              Desbloqueie o potencial máximo da Maya, baixe roteiros em PDF e tenha suporte premium offline.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
            {plans.map((plan, idx) => (
              <motion.div 
                key={plan.name}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + (idx * 0.1) }}
                className={`glass-card p-8 flex flex-col relative ${plan.popular ? 'border-emerald-500 shadow-xl shadow-emerald-500/20 scale-105 z-10 bg-white/90 dark:bg-slate-900/90' : 'bg-white/60 dark:bg-slate-800/60'}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                    Mais Popular
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{plan.name}</h3>
                <div className="mb-8">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">{plan.period}</span>
                </div>
                
                <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-700 dark:text-slate-200">
                  {plan.features.map(feat => (
                    <li key={feat} className="flex flex-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 rounded-xl font-bold transition-all ${plan.popular ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:scale-105 shadow-md shadow-emerald-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'}`}>
                  {plan.buttonText}
                </button>
              </motion.div>
            ))}
          </div>

          <hr className="border-slate-200 dark:border-slate-800 mb-16" />

          {/* Biblioteca Premium Ebooks */}
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Biblioteca Premium de Ebooks</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Roteiros elaborados por IA e checados por guias, liberados em PDF para você consultar offline durante toda a sua viagem.</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {ebooks.map((title, i) => (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.05 }}
                 key={title}
                 className="glass-card p-4 flex flex-col group hover:-translate-y-2 transition-transform cursor-pointer"
               >
                  <div className="h-32 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/20 mb-4 flex items-center justify-center">
                     <BookOpen className="w-8 h-8 text-emerald-500/50 group-hover:text-emerald-500 group-hover:scale-110 transition-all" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2 leading-tight flex-1">{title}</h4>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                     <span className="text-[10px] uppercase font-bold text-slate-400">PDF Premium</span>
                     <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
               </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
