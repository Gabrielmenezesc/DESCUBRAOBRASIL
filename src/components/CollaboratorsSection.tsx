"use client";

import { motion } from "framer-motion";

const team = [
  {
    name: "Valdir",
    role: "CEO & Fundador",
    initials: "VD",
    gradient: "from-amber-400 to-amber-600",
  },
  {
    name: "Georgiane",
    role: "Diretora",
    initials: "GE",
    gradient: "from-blue-400 to-blue-600",
  },
  {
    name: "Gabriel Menezes",
    role: "TI",
    initials: "GM",
    gradient: "from-emerald-400 to-emerald-600",
  },
];

export default function CollaboratorsSection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-4">
            NOSSA EQUIPE
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            Quem Faz o Brasil <span className="text-gradient">Acontecer</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Uma equipe multidisciplinar apaixonada por tecnologia, turismo e transformação digital.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative text-center"
            >
              <div className="relative mx-auto w-32 h-32 mb-6">
                {/* Glow ring */}
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.gradient} opacity-20 group-hover:opacity-40 blur-xl transition-opacity duration-500`} />
                {/* Avatar */}
                <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500 ring-4 ring-white`}>
                  <span className="text-3xl font-extrabold text-white">{member.initials}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{member.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
