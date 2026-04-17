"use client";

import { motion } from "framer-motion";
import { Compass, Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";

const WA_NUMBER = "5538991621135";
const WA_B2C = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Olá! Preciso de suporte para minha viagem pelo Brasil!")}`;
const WA_B2B = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Olá! Quero modernizar meu negócio e ter um site com o Descubra o Brasil.")}`;

export default function AudienceBifurcation() {
  function pick(audience: "b2c" | "b2b") {
    if (typeof window !== "undefined") {
      localStorage.setItem("audience", audience);
    }
  }

  return (
    <section id="bifurcacao" className="py-24 relative overflow-hidden bg-slate-50 dark:bg-slate-800/50">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-200 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-200 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold mb-4">
            O TURISMO ENCONTRA A TECNOLOGIA
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Qual o seu foco no{" "}
            <span className="text-gradient">Brasil?</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-lg">
            Seja você um desbravador de destinos ou um empresário buscando escala, temos a solução ideal.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* B2C — Viajante */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 group"
          >
            <div className="h-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-1 shadow-2xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all">
              <div className="h-full bg-gradient-to-br from-emerald-50 to-white rounded-[2.3rem] p-8 md:p-12 flex flex-col">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/30">
                  <Compass className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Sou Viajante</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg leading-relaxed">
                  Quero descobrir roteiros autênticos, usar a inteligência da <strong>Maya</strong> para planejar minha viagem e navegar pelo mapa 3D.
                </p>
                <div className="mt-auto flex flex-col gap-4">
                  <Link
                    href="#turismo"
                    onClick={() => pick("b2c")}
                    className="flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Ativar Modo Desbravador
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <a
                    href={WA_B2C}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center text-emerald-700 font-bold hover:underline"
                  >
                    Falar com suporte via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Central Divider (Visual Only) */}
          <div className="hidden lg:flex flex-col items-center justify-center px-4">
            <div className="w-px h-full bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-200 flex items-center justify-center font-bold text-slate-400 shadow-sm my-4">
              OU
            </div>
            <div className="w-px h-full bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
          </div>

          {/* B2B — Empresa */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 group"
          >
            <div className="h-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-1 shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all">
              <div className="h-full bg-gradient-to-br from-blue-50 to-white rounded-[2.3rem] p-8 md:p-12 flex flex-col">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-8 shadow-lg shadow-blue-500/30">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Sou Empresa</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg leading-relaxed">
                  Quero modernizar meu negócio com <strong>Marketing 3D</strong>, criação de sites profissionais e ganhar destaque para turistas.
                </p>
                <div className="mt-auto flex flex-col gap-4">
                  <a
                    href={WA_B2B}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => pick("b2b")}
                    className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-blue-500/20"
                  >
                    Crescer meu Negócio
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <Link
                    href="#servicos-b2b"
                    className="text-center text-blue-700 font-bold hover:underline"
                  >
                    Conhecer nossos serviços B2B
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
