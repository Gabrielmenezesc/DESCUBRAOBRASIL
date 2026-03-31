"use client";

import { motion } from "framer-motion";
import { Palette, Video, Share2, Zap, ArrowRight } from "lucide-react";

const marketingServices = [
  {
    title: "Artes para Redes Sociais",
    items: ["Criação de posts profissionais", "Identidade visual", "Conteúdo estratégico"],
    icon: Palette,
    delay: 0.1,
    color: "emerald"
  },
  {
    title: "Vídeos Promocionais",
    items: ["Edição de vídeos curtos", "Conteúdo para Instagram e TikTok", "Intros e reels"],
    icon: Video,
    delay: 0.2,
    color: "blue"
  },
  {
    title: "Gestão de Redes Sociais",
    items: ["Planejamento de conteúdo", "Postagens diárias", "Crescimento de audiência"],
    icon: Share2,
    delay: 0.3,
    color: "emerald"
  },
  {
    title: "Tráfego e Divulgação",
    items: ["Estratégias para mais clientes", "Campanhas pagas", "Alcance segmentado"],
    icon: Zap,
    delay: 0.4,
    color: "blue"
  }
];

export default function MarketingSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-widest mb-4 border border-emerald-100"
          >
            Marketing e Estratégia
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6"
          >
            Divulgação <span className="text-gradient">Impactante</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Sua marca em outro nível. Combinamos criatividade e tecnologia para atrair o público certo para o seu negócio.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {marketingServices.map((svc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: svc.delay, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-card group p-8 rounded-3xl bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col h-full"
            >
              <div className={`w-14 h-14 rounded-2xl ${svc.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-slate-50 group-hover:glow-primary`}>
                <svc.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight group-hover:text-emerald-600 transition-colors">{svc.title}</h3>
              <ul className="space-y-3 flex-grow">
                {svc.items.map((item, idx) => (
                  <li key={idx} className="text-sm text-slate-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://wa.me/5538991621135"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            Quero divulgar meu negócio
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}
