"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, Lock, Sparkles } from "lucide-react";
import { getGamificationStats, ACHIEVEMENTS, type Achievement } from "@/lib/gamification";

export default function Achievements() {
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    const stats = await getGamificationStats();
    setUnlocked(stats.unlockedAchievements);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();

    // Listen to updates
    const handleUnlock = () => {
      fetchStats();
    };
    window.addEventListener("achievement_unlocked", handleUnlock);
    window.addEventListener("xp_gained", handleUnlock);
    return () => {
      window.removeEventListener("achievement_unlocked", handleUnlock);
      window.removeEventListener("xp_gained", handleUnlock);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const progressPercent = Math.round((unlocked.length / ACHIEVEMENTS.length) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 rounded-[2rem] border border-white/10 bg-slate-900/50 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      {/* Decorative inner gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-emerald-500/5 pointer-events-none" />

      {/* Progress Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-6 border-b border-white/5">
        <div className="flex-1">
          <h3 className="text-2xl font-black text-white flex items-center gap-2">
            <span>Conquistas & Proezas</span>
            <span className="text-xs px-2.5 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full">
              {unlocked.length} de {ACHIEVEMENTS.length} Desbloqueadas
            </span>
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Realize façanhas no portal e no app para desbloquear conquistas secretas e provar que você é um desbravador nato.
          </p>
        </div>
        
        {/* Progress Bar Container */}
        <div className="w-full md:w-64 flex flex-col gap-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-400">Progresso Geral</span>
            <span className="text-indigo-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Achievements List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {ACHIEVEMENTS.map((ach) => {
          const isUnlocked = unlocked.includes(ach.id);
          return (
            <motion.div
              key={ach.id}
              whileHover={{ y: -3 }}
              className={`flex items-start gap-4 p-5 rounded-2xl border transition-all ${
                isUnlocked
                  ? "bg-slate-950/60 border-indigo-500/20 shadow-md shadow-indigo-500/5"
                  : "bg-slate-950/10 border-white/5 opacity-55"
              }`}
            >
              {/* Badge Icon container */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 relative ${
                isUnlocked
                  ? "bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 border border-indigo-500/30"
                  : "bg-slate-900 border border-white/5"
              }`}>
                {isUnlocked ? (
                  <span>{ach.icon}</span>
                ) : (
                  <>
                    <span className="grayscale opacity-25">{ach.icon}</span>
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/30 rounded-2xl">
                      <Lock className="w-4 h-4 text-slate-500" />
                    </div>
                  </>
                )}
              </div>

              {/* Text content */}
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className={`font-extrabold text-base leading-none ${isUnlocked ? "text-white" : "text-slate-500"}`}>
                    {ach.title}
                  </h4>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                    isUnlocked ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-600"
                  }`}>
                    +{ach.xpReward} XP
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {ach.description}
                </p>
                
                {isUnlocked && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-2">
                    <Sparkles className="w-2.5 h-2.5" />
                    Desbloqueado!
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
