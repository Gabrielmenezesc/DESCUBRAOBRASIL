"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Landmark, Lock, Sparkles } from "lucide-react";
import { getGamificationStats, visitState } from "@/lib/gamification";

const ALL_STATES = [
  { code: "RJ", name: "Rio de Janeiro", color: "from-blue-500 to-cyan-500", icon: "🏖️" },
  { code: "BA", name: "Bahia", color: "from-orange-500 to-amber-500", icon: "🥁" },
  { code: "AM", name: "Amazonas", color: "from-green-600 to-emerald-500", icon: "🐆" },
  { code: "SP", name: "São Paulo", color: "from-indigo-600 to-purple-500", icon: "🏙️" },
  { code: "DF", name: "Distrito Federal", color: "from-yellow-500 to-amber-600", icon: "🏛️" },
  { code: "GO", name: "Goiás", color: "from-teal-500 to-emerald-600", icon: "🏞️" },
  { code: "MG", name: "Minas Gerais", color: "from-red-500 to-rose-600", icon: "☕" },
  { code: "PR", name: "Paraná", color: "from-emerald-700 to-green-600", icon: "🌲" },
  { code: "RS", name: "Rio Grande do Sul", color: "from-red-600 to-yellow-500", icon: "🧉" },
  { code: "SC", name: "Santa Catarina", color: "from-blue-600 to-indigo-500", icon: "🌉" },
  { code: "PE", name: "Pernambuco", color: "from-yellow-400 to-red-500", icon: "🎭" },
  { code: "CE", name: "Ceará", color: "from-orange-400 to-amber-500", icon: "⛵" },
];

export default function Passport() {
  const [visited, setVisited] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    const stats = await getGamificationStats();
    setVisited(stats.visitedStates);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();

    // Listen to visits
    const handleVisit = () => {
      fetchStats();
    };
    window.addEventListener("state_visited", handleVisit);
    return () => window.removeEventListener("state_visited", handleVisit);
  }, []);

  const simulateVisit = async (code: string) => {
    if (visited.includes(code)) return;
    await visitState(code);
    fetchStats();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 rounded-[2rem] border border-white/10 bg-slate-900/50 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      {/* Decorative inner gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-6 border-b border-white/5">
        <div>
          <h3 className="text-2xl font-black text-white flex items-center gap-2">
            <span>Passaporte Digital do Viajante</span>
            <span className="text-xs px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
              {visited.length} Carimbos
            </span>
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Visite as páginas dos estados ou desvende missões para receber carimbos oficiais e acumular XP.
          </p>
        </div>
      </div>

      {/* Grid of Stamps */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {ALL_STATES.map((state) => {
          const isStamped = visited.includes(state.code);
          return (
            <motion.div
              key={state.code}
              whileHover={{ scale: isStamped ? 1.05 : 1 }}
              onClick={() => !isStamped && simulateVisit(state.code)}
              className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border transition-all cursor-pointer select-none ${
                isStamped
                  ? "bg-slate-950/60 border-emerald-500/30 shadow-lg shadow-emerald-500/5"
                  : "bg-slate-950/20 border-white/5 hover:border-white/10 opacity-60 hover:opacity-80"
              }`}
            >
              {/* Stamp Circle Emblem */}
              <div className="relative w-20 h-20 rounded-full flex items-center justify-center mb-4">
                {/* Stamp Outer ring */}
                <div className={`absolute inset-0 rounded-full border-2 border-dashed ${
                  isStamped ? "border-emerald-500/50 animate-spin-slow" : "border-slate-700"
                }`} />
                
                {/* Inner Filled Emblem */}
                <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center text-xl font-black shadow-inner transition-all ${
                  isStamped 
                    ? `bg-gradient-to-br ${state.color} text-white shadow-emerald-500/20 scale-100 rotate-[-10deg]`
                    : "bg-slate-800 text-slate-500 scale-95"
                }`}>
                  <span>{state.icon}</span>
                  <span className="text-[10px] font-black tracking-tighter uppercase">{state.code}</span>
                </div>

                {/* Stamped visual indicator */}
                {isStamped && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-[10px] shadow-md border border-slate-900 animate-bounce">
                    ✓
                  </div>
                )}

                {/* Locked indicator */}
                {!isStamped && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 backdrop-blur-[1px] rounded-full">
                    <Lock className="w-4 h-4 text-slate-600" />
                  </div>
                )}
              </div>

              {/* State Name */}
              <span className={`text-sm font-bold text-center ${isStamped ? "text-white" : "text-slate-500"}`}>
                {state.name}
              </span>
              
              {/* Action hints */}
              {!isStamped && (
                <span className="text-[9px] font-bold text-emerald-400 mt-2 hover:underline">
                  Carimbar via visita
                </span>
              )}
              {isStamped && (
                <span className="text-[9px] font-bold text-slate-500 mt-2">
                  +150 XP Obtido
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-8 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
        <span>Todos os outros 15 estados brasileiros serão adicionados em breve ao passaporte digital!</span>
      </div>
    </div>
  );
}
