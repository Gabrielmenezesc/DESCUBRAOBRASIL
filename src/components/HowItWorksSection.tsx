"use client";

import { motion } from "framer-motion";
import { Download, Compass, Sparkles } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      title: "Baixe o App",
      desc: "Instale no celular ou abra a versão Web. É rápido, leve e intuitivo.",
      icon: <Download className="w-6 h-6 text-emerald-600" />,
      delay: 0.2
    },
    {
      title: "Fale com a Maya",
      desc: "Nossa IA cria seu roteiro personalizado e recomenda os melhores locais e hotéis.",
      icon: <Sparkles className="w-6 h-6 text-emerald-600" />,
      delay: 0.4
    },
    {
      title: "Modo Uber",
      desc: "Navegue pela cidade com rotas diretas, preços calculados e reservas instantâneas.",
      icon: <Compass className="w-6 h-6 text-emerald-600" />,
      delay: 0.6
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            Como <span className="text-gradient">Funciona?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-100 via-emerald-300 to-emerald-100 -translate-y-1/2 z-0 opacity-50" />

          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: step.delay, duration: 0.5 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6 border border-emerald-100 group-hover:scale-110 transition-transform duration-300 glow-primary">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">{step.title}</h3>
              <p className="text-slate-600 max-w-sm">
                {step.desc}
              </p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}
