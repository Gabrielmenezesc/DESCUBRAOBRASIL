"use client";

import { motion } from "framer-motion";
import { Check, Star, Zap, Rocket, ShieldCheck } from "lucide-react";

const plans = [
  {
    name: "Básico",
    price: "R$ 1.497",
    desc: "A porta de entrada para sua presença online profissional.",
    features: ["Site simples (One Page)", "Design responsivo", "Otimização SEO Básica", "Botão WhatsApp Direct", "Hospedagem inclusa (1 ano)"],
    icon: Zap,
    popular: false,
    delay: 0.1
  },
  {
    name: "Profissional",
    price: "R$ 2.997",
    desc: "O plano completo para empresas que querem dominar seu mercado.",
    features: ["Site completo (Multi-pages)", "Design Moderno & Exclusivo", "Integração Maya AI Básica", "Gestão de Conteúdo", "Suporte Prioritário"],
    icon: Rocket,
    popular: true,
    delay: 0.2
  },
  {
    name: "Premium",
    price: "Sob Consulta",
    desc: "Sistemas complexos e experiências digitais sob medida.",
    features: ["Sistema Personalizado", "Painel Administrativo", "Área do Cliente VIP", "API Maya AI Completa", "Suporte 24/7 Dedicado"],
    icon: ShieldCheck,
    popular: false,
    delay: 0.3
  }
];

export default function PlansSection() {
  return (
    <section id="plans" className="py-24 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6"
          >
            Invista no seu <span className="text-gradient">Sucesso Digital</span>
          </motion.h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Planos flexíveis que acompanham o crescimento do seu negócio. Escolha o ideal para você.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-12">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: plan.delay, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className={`relative flex flex-col p-8 rounded-[2.5rem] transition-all duration-500 ${
                plan.popular 
                ? "bg-slate-900 text-white scale-105 shadow-2xl shadow-emerald-500/20 z-10 ring-4 ring-emerald-500/20" 
                : "bg-white text-slate-900 border border-slate-100 shadow-xl shadow-slate-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 inset-x-0 -translate-y-1/2 flex justify-center">
                  <div className="bg-emerald-500 text-white text-xs font-black px-6 py-2 rounded-full uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-500/40">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    Mais Escolhido
                  </div>
                </div>
              )}

              <div className="mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${
                  plan.popular ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"
                }`}>
                  <plan.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                <p className={`text-sm leading-relaxed ${plan.popular ? "text-slate-400" : "text-slate-500"}`}>
                  {plan.desc}
                </p>
              </div>

              <div className="mb-10 flex items-baseline gap-1">
                <span className="text-4xl font-black">{plan.price}</span>
                {plan.price !== "Sob Consulta" && <span className={`text-sm ${plan.popular ? "text-slate-500" : "text-slate-400"}`}>/projeto</span>}
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.popular ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600"
                    }`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className={`text-sm font-medium ${plan.popular ? "text-slate-300" : "text-slate-700"}`}>{feat}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-2xl font-bold transition-all transform active:scale-95 ${
                plan.popular 
                ? "bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/30" 
                : "bg-slate-900 text-white hover:bg-slate-800"
              }`}>
                Começar Agora
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
