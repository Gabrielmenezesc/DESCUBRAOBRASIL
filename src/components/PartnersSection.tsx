"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield } from "lucide-react";

const partners = [
  {
    name: "Rede Brasília News",
    category: "Comunicação & Notícias",
    icon: "📡",
    gradient: "from-blue-500 to-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-100",
    text: "text-blue-700",
    desc: "O principal portal de notícias e comunicação de Brasília e região.",
  },
  {
    name: "Rádio Esperança FM",
    category: "Rádio & Entretenimento",
    icon: "📻",
    gradient: "from-emerald-500 to-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    text: "text-emerald-700",
    desc: "A voz que conecta comunidades com música, fé e informação local.",
  },
  {
    name: "Drogaria São Pedro",
    category: "Saúde & Bem-Estar",
    icon: "💊",
    gradient: "from-amber-500 to-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-100",
    text: "text-amber-700",
    desc: "Cuidado e saúde para a sua família com atendimento de confiança.",
  },
];

export default function PartnersSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-100 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-4 tracking-wider">
            <Shield className="w-4 h-4" />
            ECOSSISTEMA DE PARCEIROS OFICIAIS
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Quem Caminha{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
              Conosco
            </span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Organizações e empresas que apoiam o turismo nacional e a democratização da informação no Brasil.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {partners.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className={`group relative rounded-2xl p-8 border-2 ${p.border} ${p.bg} shadow-sm hover:shadow-xl transition-all duration-300 cursor-default`}
            >
              {/* Official Partner badge */}
              <div className="absolute top-4 right-4">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${p.bg} ${p.text} border ${p.border}`}>
                  <Shield className="w-3 h-3" /> PARCEIRO OFICIAL
                </span>
              </div>

              {/* Glowing icon */}
              <div className="relative mb-6">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-10 blur-xl rounded-full group-hover:opacity-20 transition-opacity`}
                />
                <div
                  className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${p.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <span className="text-3xl">{p.icon}</span>
                </div>
              </div>

              {/* Category badge */}
              <span
                className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold ${p.bg} ${p.text} border ${p.border} mb-3`}
              >
                {p.category}
              </span>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{p.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{p.desc}</p>

              {/* Bottom shine line */}
              <div
                className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${p.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-slate-400 text-sm mt-10"
        >
          Quer fazer parte do nosso ecossistema?{" "}
          <Link
            href="/contato"
            className="text-emerald-600 font-bold hover:underline hover:text-emerald-500 transition-colors"
          >
            Torne-se parceiro oficial →
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
