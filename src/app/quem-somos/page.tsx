"use client";

import Navbar from "@/components/Navbar";
import CollaboratorsSection from "@/components/CollaboratorsSection";
import FooterSection from "@/components/FooterSection";
import MayaChat from "@/components/MayaChat";
import LGPDBanner from "@/components/LGPDBanner";
import { Building2, Calendar, Award, Target } from "lucide-react";

const timeline = [
  { year: "2021", title: "Fundação", desc: "Abertura da Rede Brasília News com foco inicial em turismo e comunicação descentralizada." },
  { year: "2022", title: "Expansão Nacional", desc: "Mapeamento dos primeiros roteiros e planejamento de uma central do turismo digital." },
  { year: "2023", title: "Turismo Integrado", desc: "Início do mapeamento de atrações gratuitas e econômicas em todos os estados do Brasil." },
  { year: "2024", title: "Descubra o Brasil App", desc: "Lançamento do aplicativo com Maya AI e guias interativos focados no turista." },
  { year: "2025", title: "Portal Completo", desc: "Lançamento da plataforma atual com experiência imersiva e roteiros em tempo real." },
];

export default function QuemSomosPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-28 pb-16 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm font-bold mb-4">QUEM SOMOS</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">Rede Brasília <span className="text-gradient">News</span></h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">Focada no Turismo Nacional — Desde 2021 transformando a forma como o Brasil é descoberto e vivenciado pelos viajantes.</p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
              <Building2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Situação</h3>
              <p className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">Ativa</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
              <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Fundação</h3>
              <p className="text-blue-600 dark:text-blue-400 font-bold text-lg">20/08/2021</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
              <Award className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Natureza</h3>
              <p className="text-amber-600 dark:text-amber-400 font-bold text-lg">LTDA</p>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-100 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Target className="w-6 h-6 text-emerald-500" /> Nossa Missão</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">A <strong>Rede Brasília News</strong>, fundada por <strong>Valdir (CEO)</strong>, <strong>Georgiane (Diretora)</strong> e <strong>Gabriel Menezes (TI)</strong>, é uma empresa inovadora que atua focado inteiramente no ecossistema do turismo nacional. Nosso objetivo é democratizar o acesso à informação turística do Brasil.</p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">Através do portal <strong>Descubra o Brasil</strong> e do aplicativo com a inteligência artificial <strong>Maya AI</strong>, nós conectamos você aos destinos mais surpreendentes, desde roteiros gratuitos até belezas naturais escondidas por todos os 26 estados mais o Distrito Federal.</p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">Acreditamos que o Brasil possui um potencial turístico imensurável e trabalhamos diariamente para tornar cada viagem incrível.</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">Nossa <span className="text-gradient">Trajetória</span></h2>
          <div className="space-y-0 relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-emerald-200 dark:bg-emerald-800" />
            {timeline.map((item, i) => (
              <div key={i} className="relative pl-16 pb-10">
                <div className="absolute left-3.5 w-5 h-5 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 shadow" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{item.year}</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{item.desc}</p>
              </div>
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
