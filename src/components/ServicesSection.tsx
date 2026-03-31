"use client";

import { motion } from "framer-motion";
import { Megaphone, Search, Users, Cpu, Rocket, LineChart } from "lucide-react";

const services = [
  {
    title: "Anúncios Premium",
    desc: "Destaque seu negócio local, hotel ou restaurante para milhares de turistas diretamente no aplicativo.",
    icon: Megaphone,
    delay: 0.1
  },
  {
    title: "SEO para Turismo",
    desc: "Otimizamos a presença digital do seu negócio para que você seja encontrado por quem planeja viagens.",
    icon: Search,
    delay: 0.2
  },
  {
    title: "Gestão de Leads",
    desc: "Receba contatos qualificados diretamente de usuários do app interagindo com o seu perfil premium.",
    icon: Users,
    delay: 0.3
  },
  {
    title: "API de Integração",
    desc: "Integre nossa tecnologia inteligente de roteiros (Maya AI) no seu próprio site de turismo ou agência.",
    icon: Cpu,
    delay: 0.4
  },
  {
    title: "Impulsionamento",
    desc: "Apareça como recomendação oficial em Roteiros Gerados por IA para os viajantes.",
    icon: Rocket,
    delay: 0.5
  },
  {
    title: "Dashboards VIP",
    desc: "Acompanhe visualizações, taxa de clique e conversões do seu negócio em tempo real.",
    icon: LineChart,
    delay: 0.6
  }
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 relative overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-slate-900"
          >
            Acelere os Seus <span className="text-gradient">Negócios</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600"
          >
            O Descubra o Brasil não é só para o turista. É a principal plataforma para decolar o marketing da sua empresa no setor.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: svc.delay }}
              className="glass-card p-8 group hover:-translate-y-2 transition-all duration-300 bg-white shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-6 border border-emerald-200 group-hover:scale-110 transition-transform">
                <svc.icon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{svc.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {svc.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
