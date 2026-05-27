"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Map, Layers, Award, Sparkles } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const STATS = [
  {
    value: 27,
    suffix: "",
    label: "Estados & DF",
    description: "Cada unidade federativa representada com dados locais detalhados.",
    icon: Map,
    color: "text-emerald-500 bg-emerald-500/10"
  },
  {
    value: 5,
    suffix: " Regiões",
    label: "Diversidade Regional",
    description: "Do calor do Nordeste ao inverno do Sul, explore cada riqueza cultural.",
    icon: Layers,
    color: "text-blue-500 bg-blue-500/10"
  },
  {
    value: 100,
    suffix: "%",
    label: "Plataforma Aberta",
    description: "Acesso total a todas as funcionalidades de forma gratuita e sem anúncios.",
    icon: Award,
    color: "text-amber-500 bg-amber-500/10"
  },
  {
    value: 200,
    suffix: "+",
    label: "Missões & Conquistas",
    description: "Roteiros gamificados criados e validados por IA para sua próxima aventura.",
    icon: Sparkles,
    color: "text-indigo-500 bg-indigo-500/10"
  }
];

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 15);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration, isInView]);

  return <span ref={ref}>{count}</span>;
}

export default function StatsSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-950">
      {/* Decorative Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-4 uppercase tracking-widest">
            Nosso Alcance
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
            O Maior Ecossistema de <br />
            <span className="text-gradient">Turismo Digital</span> do Brasil
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Unindo tecnologia, gamificação e dados reais para transformar a forma como você planeja e vivencia suas viagens pelo país.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, idx) => (
            <ScrollReveal
              key={idx}
              delay={idx * 0.1}
              className="relative p-8 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-md hover:border-emerald-500/30 transition-all duration-300 hover:translate-y-[-4px] group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none" />
              
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              
              <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                <AnimatedCounter value={stat.value} />
                <span className="text-emerald-400">{stat.suffix}</span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-200 mb-2">{stat.label}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{stat.description}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
