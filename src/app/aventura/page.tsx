"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import ScrollReveal from "@/components/ScrollReveal";
import Passport from "@/components/Passport";
import Achievements from "@/components/Achievements";
import Missions from "@/components/Missions";
import TreasureHunt from "@/components/TreasureHunt";
import Leaderboard from "@/components/Leaderboard";
import ShareButton from "@/components/ShareButton";
import { getGamificationStats, getXPProgress, getLevelFromXP, type UserStats } from "@/lib/gamification";
import { Sparkles, Trophy, Shield, Compass, MapPin } from "lucide-react";

export default function AventuraPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [activeTab, setActiveTab] = useState<"passport" | "missions" | "treasures" | "achievements" | "leaderboard">("passport");
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    const s = await getGamificationStats();
    setStats(s);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();

    // Listen to all gamification actions
    const handleUpdate = () => {
      fetchStats();
    };
    window.addEventListener("xp_gained", handleUpdate);
    window.addEventListener("achievement_unlocked", handleUpdate);
    window.addEventListener("state_visited", handleUpdate);
    window.addEventListener("mission_completed", handleUpdate);
    window.addEventListener("treasure_found", handleUpdate);

    return () => {
      window.removeEventListener("xp_gained", handleUpdate);
      window.removeEventListener("achievement_unlocked", handleUpdate);
      window.removeEventListener("state_visited", handleUpdate);
      window.removeEventListener("mission_completed", handleUpdate);
      window.removeEventListener("treasure_found", handleUpdate);
    };
  }, []);

  if (loading || !stats) {
    return (
      <main className="min-h-screen bg-slate-950 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        </div>
        <FooterSection />
      </main>
    );
  }

  const { percentage, nextLevelXP } = getXPProgress(stats.xp);
  
  // Determine traveler rank name
  let rankName = "Recruta de Viagem";
  if (stats.level === 2) rankName = "Mochileiro Iniciante";
  if (stats.level === 3) rankName = "Navegador de Chapadas";
  if (stats.level === 4) rankName = "Explorador da Selva";
  if (stats.level >= 5) rankName = "Mochileiro Lendário";

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      <Navbar />
      
      {/* Top Banner section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Glow behind stats */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal direction="down" className="text-center mb-10">
            <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              Central de Aventura do Descubra
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mt-4 tracking-tight leading-none">
              Sua <span className="text-gradient">Jornada</span> Gamificada
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto mt-3 text-sm md:text-base">
              Acompanhe seu avanço de mochileiro, carimbe estados, complete missões arqueológicas e seja o maior aventureiro do país.
            </p>
          </ScrollReveal>

          {/* Traveler HUD Profile Card */}
          <ScrollReveal direction="up" delay={0.1} className="max-w-4xl mx-auto mb-16">
            <div className="p-6 md:p-8 rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl flex flex-col md:flex-row items-center gap-8 shadow-2xl">
              
              {/* Left Column: Avatar & Level */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 p-1 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                  <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">NÍVEL</span>
                    <span className="text-3xl font-black text-emerald-400 leading-none">{stats.level}</span>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-indigo-500 border border-slate-900 rounded-full p-1.5 shadow-md">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Right Column: Progress bar & Rank info */}
              <div className="flex-1 w-full space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase block tracking-wider">Patente de Viajante</span>
                    <h2 className="text-2xl font-black text-white">{rankName}</h2>
                  </div>
                  
                  {/* Share button next to stats */}
                  <div className="flex flex-col sm:items-end gap-1.5">
                    <ShareButton />
                    <span className="text-[10px] text-slate-400 font-bold uppercase">XP Total: <strong className="text-emerald-400">{stats.xp}</strong></span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="w-full h-4 rounded-full bg-slate-950 border border-white/5 p-0.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 transition-all duration-500" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-400 px-1">
                    <span>Próximo nível</span>
                    <span>{stats.xp} / {nextLevelXP} XP ({percentage}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Navigation Tabs bar */}
          <ScrollReveal direction="up" delay={0.2} className="max-w-4xl mx-auto mb-10">
            <div className="flex flex-wrap gap-2 justify-center p-2 rounded-2xl bg-slate-950/80 border border-white/5 max-w-3xl mx-auto">
              <button
                onClick={() => setActiveTab("passport")}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === "passport"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Passaporte</span>
              </button>

              <button
                onClick={() => setActiveTab("missions")}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === "missions"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Missões</span>
              </button>

              <button
                onClick={() => setActiveTab("treasures")}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === "treasures"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Caça ao Tesouro</span>
              </button>

              <button
                onClick={() => setActiveTab("achievements")}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === "achievements"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Conquistas</span>
              </button>

              <button
                onClick={() => setActiveTab("leaderboard")}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === "leaderboard"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Ranking</span>
              </button>
            </div>
          </ScrollReveal>

          {/* Active Tab View */}
          <ScrollReveal direction="up" delay={0.3} className="w-full">
            <div className="w-full">
              {activeTab === "passport" && <Passport />}
              {activeTab === "missions" && <Missions />}
              {activeTab === "treasures" && <TreasureHunt />}
              {activeTab === "achievements" && <Achievements />}
              {activeTab === "leaderboard" && <Leaderboard />}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
