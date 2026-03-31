"use client";

import Navbar from "@/components/Navbar";
import CollaboratorsSection from "@/components/CollaboratorsSection";
import FooterSection from "@/components/FooterSection";
import MayaChat from "@/components/MayaChat";
import LGPDBanner from "@/components/LGPDBanner";
import { motion } from "framer-motion";
import { Building2, Calendar, Award, Target, Globe, Briefcase, GraduationCap, Clapperboard, Megaphone } from "lucide-react";

const timeline = [
  { year: "2021", title: "Fundação", desc: "Abertura da Rede Brasília News com foco inicial em turismo e comunicação descentralizada." },
  { year: "2022", title: "Expansão Nacional", desc: "Mapeamento dos primeiros roteiros e planejamento de uma central do turismo digital." },
  { year: "2023", title: "Turismo Integrado", desc: "Início do mapeamento de atrações gratuitas e econômicas em todos os estados do Brasil." },
  { year: "2024", title: "Descubra o Brasil App", desc: "Lançamento do aplicativo com Maya AI e guias interativos focados no turista." },
  { year: "2025", title: "Portal Premium", desc: "Lançamento da plataforma atual com experiência imersiva e roteiros em tempo real." },
];

const activities = [
  { icon: Globe, label: "Portais e Provedores de Conteúdo na Internet" },
  { icon: Briefcase, label: "Operadores Turísticos e Agências de Viagens" },
  { icon: Calendar, label: "Organização de Feiras, Congressos e Exposições" },
  { icon: Megaphone, label: "Agências de Publicidade e Consultoria" },
  { icon: GraduationCap, label: "Treinamento em Desenvolvimento Profissional" },
  { icon: Clapperboard, label: "Produção de Espetáculos e Eventos Culturais" },
];

export default function QuemSomosPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-4"
          >
            QUEM SOMOS
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-4"
          >
            Rede Brasília <span className="text-gradient">News</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-3xl mx-auto"
          >
            Focada no Turismo Nacional — Desde 2021 transformando a forma como o Brasil é descoberto e vivenciado pelos viajantes.
          </motion.p>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-2xl bg-emerald-50 border border-emerald-100"
            >
              <Building2 className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 mb-1">Situação</h3>
              <p className="text-emerald-600 font-bold text-lg">Ativa</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center p-6 rounded-2xl bg-blue-50 border border-blue-100"
            >
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 mb-1">Fundação</h3>
              <p className="text-blue-600 font-bold text-lg">20/08/2021</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center p-6 rounded-2xl bg-amber-50 border border-amber-100"
            >
              <Award className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 mb-1">Natureza</h3>
              <p className="text-amber-600 font-bold text-lg">LTDA</p>
            </motion.div>
          </div>

          {/* Institutional Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
          >
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-emerald-500" />
                Nossa Missão
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                A <strong>Rede Brasília News</strong>, fundada por <strong>Valdir (CEO)</strong>, <strong>Georgiane (Diretora)</strong> e <strong>Gabriel Menezes (TI)</strong>, é uma empresa inovadora que atua focado inteiramente no ecossistema do turismo nacional. Nosso objetivo é democratizar o acesso à informação turística do Brasil, oferecendo ferramentas digitais de ponta para que os viajantes planejem suas rotas com eficiência e economia.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                Através do portal <strong>Descubra o Brasil</strong> e do aplicativo com a inteligência artificial <strong>Maya AI</strong>, nós conectamos você aos destinos mais surpreendentes, desde roteiros gratuitos até belezas naturais escondidas por todos os 26 estados mais o Distrito Federal.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Acreditamos que o Brasil possui um potencial turístico imensurável e trabalhamos diariamente para tornar cada viagem incrível. Nossa paixão é ser o melhor companheiro de viagem na tela do seu celular.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CNPJ Activities */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10 text-center">
            Atividades <span className="text-gradient">Econômicas</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map((act, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 bg-white rounded-xl p-4 border border-slate-100 shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <act.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">{act.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-12 text-center">
            Nossa <span className="text-gradient">Trajetória</span>
          </h2>
          <div className="space-y-0 relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-emerald-200" />
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-16 pb-10"
              >
                <div className="absolute left-3.5 w-5 h-5 rounded-full bg-emerald-500 border-4 border-white shadow" />
                <span className="text-emerald-600 font-bold text-sm">{item.year}</span>
                <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CollaboratorsSection />
      <FooterSection />
      <MayaChat />
      <LGPDBanner />
    </main>
  );
}
