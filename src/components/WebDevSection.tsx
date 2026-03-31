"use client";

import { motion } from "framer-motion";
import { Monitor, CreditCard, Layers, Zap, CheckCircle2 } from "lucide-react";

const webServices = [
  {
    title: "Sites Institucionais",
    desc: "A vitrine digital perfeita para sua empresa. Design moderno, foco em autoridade e totalmente responsivo para todos os dispositivos.",
    icon: Monitor,
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=1169&auto=format&fit=crop",
    reverse: false
  },
  {
    title: "Landing Pages",
    desc: "Páginas de alta conversão focadas em transformar visitantes em leads e vendas reais. Ideal para campanhas de tráfego pago.",
    icon: CreditCard,
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1064&auto=format&fit=crop",
    reverse: true
  },
  {
    title: "Sistemas Personalizados",
    desc: "Desenvolvemos painéis administrativos, áreas de membros e automações sob medida para as necessidades do seu negócio.",
    icon: Layers,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1170&auto=format&fit=crop",
    reverse: false
  },
  {
    title: "Otimização e Performance",
    desc: "Sites extremamente rápidos que rankeiam no Google. Focamos em SEO técnico e performance impecável (Lighthouse 100).",
    icon: Zap,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1115&auto=format&fit=crop",
    reverse: true
  }
];

export default function WebDevSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6"
          >
            Criação de <span className="text-gradient">Sites Profissionais</span>
          </motion.h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Criamos sites modernos, rápidos e profissionais que geram resultados reais para sua marca no ambiente digital.
          </p>
        </div>

        <div className="space-y-32">
          {webServices.map((svc, i) => (
            <div key={i} className={`flex flex-col ${svc.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 lg:gap-24`}>
              {/* Image Block */}
              <motion.div 
                initial={{ opacity: 0, x: svc.reverse ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex-1 relative"
              >
                <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100 group">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
                    style={{ backgroundImage: `url(${svc.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {/* Decorative Elements */}
                <div className={`absolute -bottom-6 ${svc.reverse ? '-left-6' : '-right-6'} w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full z-0`} />
              </motion.div>

              {/* Text Block */}
              <motion.div 
                initial={{ opacity: 0, x: svc.reverse ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex-1 space-y-6"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg group-hover:glow-primary">
                  <svc.icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{svc.title}</h3>
                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                  {svc.desc}
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <li className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Design Exclusivo
                  </li>
                  <li className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Foco em Conversão
                  </li>
                  <li className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Suporte VIP
                  </li>
                  <li className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    SEO Otimizado
                  </li>
                </ul>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
