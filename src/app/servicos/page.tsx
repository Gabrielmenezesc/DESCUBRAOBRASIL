"use client";

import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import MayaChat from "@/components/MayaChat";
import LGPDBanner from "@/components/LGPDBanner";
import { motion } from "framer-motion";
import { Globe, Map, Compass, Shield, ArrowRight, ExternalLink } from "lucide-react";

export default function ServicosPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-4"
          >
            SERVIÇOS TURÍSTICOS
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6"
          >
            Sua Experiência <span className="text-gradient">Completa</span> no Brasil
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            Oferecemos suporte especializado para que sua viagem seja inesquecível, do planejamento à execução.
          </motion.p>
        </div>
      </section>

      {/* Tourism Services Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Map,
                title: "Roteiros Personalizados",
                desc: "Planejamos sua rota dia a dia, focando nos seus interesses e no seu orçamento.",
                color: "text-blue-600",
                bg: "bg-blue-50"
              },
              {
                icon: Compass,
                title: "Guia de Destinos",
                desc: "Acesso a informações exclusivas sobre atrações gratuitas e tesouros escondidos.",
                color: "text-emerald-600",
                bg: "bg-emerald-50"
              },
              {
                icon: Shield,
                title: "Apoio ao Viajante",
                desc: "Suporte via WhatsApp para emergências e dúvidas durante sua estadia no Brasil.",
                color: "text-amber-600",
                bg: "bg-amber-50"
              }
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:shadow-xl transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center mb-6`}>
                  <s.icon className={`w-8 h-8 ${s.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h3>
                <p className="text-slate-600 mb-6">{s.desc}</p>
                <a href="https://wa.me/5538991621135" className="text-sm font-bold text-blue-600 hover:text-blue-500 flex items-center gap-2">
                  Saiba mais <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketing Redirect Section */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-bold mb-6">
                <Globe className="w-4 h-4" /> B2B & PARCERIAS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 italic">
                Quer anunciar sua empresa ou destino?
              </h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                A gestão de publicidade, marketing e parcerias comerciais do ecossistema Descubra o Brasil é realizada com exclusividade pela <strong className="text-blue-400">Rede Brasília News</strong>.
              </p>
              <a
                href="https://redebrasilianews.com.br/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all hover:scale-105"
              >
                Ir para Rede Brasília News
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
            <div className="w-full md:w-1/3 aspect-video rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-8 shadow-2xl relative">
               <div className="text-center">
                  <p className="text-xs font-mono text-blue-200 mb-2 uppercase tracking-widest">Publicidade Digital</p>
                  <p className="text-2xl font-black text-white leading-tight">SOLUÇÕES EM<br/>COMUNICAÇÃO</p>
               </div>
               <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
      <MayaChat />
      <LGPDBanner />
    </main>
  );
}
