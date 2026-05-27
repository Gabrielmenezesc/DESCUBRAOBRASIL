"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, HelpCircle, CheckCircle, AlertCircle } from "lucide-react";
import { getGamificationStats, completeMission, MISSIONS, type Mission } from "@/lib/gamification";

export default function Missions() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, { type: "success" | "error"; message: string }>>({});
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    const stats = await getGamificationStats();
    setCompleted(stats.completedMissions);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
    
    // Listen to updates
    const handleUpdate = () => {
      fetchStats();
    };
    window.addEventListener("mission_completed", handleUpdate);
    return () => window.removeEventListener("mission_completed", handleUpdate);
  }, []);

  const handleAnswerSubmit = async (missionId: string) => {
    const userAnswer = (answers[missionId] || "").trim().toLowerCase();
    const mission = MISSIONS.find(m => m.id === missionId);
    
    if (!mission) return;

    if (userAnswer === mission.answer.toLowerCase()) {
      const result = await completeMission(missionId);
      if (result.success) {
        setFeedback(prev => ({
          ...prev,
          [missionId]: { type: "success", message: `Resposta Correta! Você ganhou +${mission.xpReward} XP! 🎉` }
        }));
        fetchStats();
      } else {
        setFeedback(prev => ({
          ...prev,
          [missionId]: { type: "success", message: "Você já completou esta missão anteriormente!" }
        }));
      }
    } else {
      setFeedback(prev => ({
        ...prev,
        [missionId]: { type: "error", message: "Resposta incorreta. Tente novamente! 🤔" }
      }));
    }
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
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-amber-500/5 pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-6 border-b border-white/5">
        <div>
          <h3 className="text-2xl font-black text-white flex items-center gap-2">
            <span>Desafios da Maya (Charadas)</span>
            <span className="text-xs px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">
              {completed.length} de {MISSIONS.length} Concluídas
            </span>
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Resolva as charadas formuladas pela Maya para testar seus conhecimentos geográficos e provar que você conhece o Brasil!
          </p>
        </div>
      </div>

      {/* Missions List */}
      <div className="space-y-6">
        {MISSIONS.map((mission) => {
          const isDone = completed.includes(mission.id);
          const currentFeedback = feedback[mission.id];
          
          return (
            <div
              key={mission.id}
              className={`p-6 rounded-2xl border transition-all ${
                isDone
                  ? "bg-slate-950/60 border-emerald-500/20 shadow-lg shadow-emerald-500/5"
                  : "bg-slate-950/30 border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDone ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-amber-400"
                  }`}>
                    {isDone ? <Trophy className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-lg">{mission.title}</h4>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      Estado: {mission.stateCode} • Missão Local
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    isDone ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-800 text-slate-400"
                  }`}>
                    +{mission.xpReward} XP
                  </span>
                </div>
              </div>

              {/* Riddle card */}
              <div className="p-4 rounded-xl bg-slate-950/50 border border-white/5 mb-4 relative">
                <span className="absolute top-2 right-3 text-[10px] font-bold text-amber-400/40 uppercase tracking-widest">Enigma</span>
                <p className="text-slate-200 text-sm md:text-base italic leading-relaxed font-semibold">
                  &ldquo;{mission.riddle}&rdquo;
                </p>
              </div>

              {/* Action area */}
              {!isDone ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Sua resposta (ex: Corcovado, Acarajé)..."
                      value={answers[mission.id] || ""}
                      onChange={(e) => setAnswers(prev => ({ ...prev, [mission.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && handleAnswerSubmit(mission.id)}
                      className="flex-1 bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 font-bold focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <button
                      onClick={() => handleAnswerSubmit(mission.id)}
                      className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 px-6 py-3 rounded-xl font-black transition-all hover:scale-105 active:scale-95 shadow-md shadow-amber-500/10"
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Desbloqueado! Resposta correta: <span className="uppercase text-white">{mission.answer}</span>.</span>
                </div>
              )}

              {/* Feedback Message */}
              <AnimatePresence>
                {currentFeedback && !isDone && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-3 flex items-center gap-2 text-sm font-bold ${
                      currentFeedback.type === "success" ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {currentFeedback.type === "success" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span>{currentFeedback.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
