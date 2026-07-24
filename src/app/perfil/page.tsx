"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/lib/supabase";
import { getGamificationStats, getXPProgress, type UserStats } from "@/lib/gamification";
import { User, LogIn, LogOut, Compass, Shield, Award, Calendar, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function PerfilPage() {
  const [session, setSession] = useState<any>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  const loadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      const s = await getGamificationStats();
      setStats(s);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      loadData();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleMockLogin = async () => {
    setAuthError("Para demonstração estática, as conquistas e passaporte são salvos localmente de forma permanente no seu navegador. Crie uma conta no app para sincronização em nuvem completa!");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    loadData();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        </div>
        <FooterSection />
      </main>
    );
  }

  const { percentage, nextLevelXP } = stats ? getXPProgress(stats.xp) : { percentage: 0, nextLevelXP: 100 };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between">
      <Navbar />

      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <ScrollReveal direction="down" className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Seu Perfil de Viajante</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">Sua identidade e progresso de exploração no Descubra o Brasil.</p>
          </ScrollReveal>

          {/* Profile Card & Session check */}
          <ScrollReveal direction="up" delay={0.1} className="space-y-8">
            <div className="p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl relative overflow-hidden shadow-2xl">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* User avatar/icon */}
                <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-950 border-2 border-emerald-500 flex items-center justify-center text-4xl shadow-lg relative">
                  {session?.user?.user_metadata?.avatar_url ? (
                    <img 
                      src={session.user.user_metadata.avatar_url} 
                      alt="User Avatar" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-emerald-400" />
                  )}
                </div>

                {/* User info details */}
                <div className="flex-1 text-center md:text-left space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    {session?.user?.email || "Explorador Anônimo"}
                  </h2>
                  <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">
                    {session ? "Conta Conectada via Supabase" : "Perfil Local (Visitante)"}
                  </span>
                  
                  {session && (
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 justify-center md:justify-start">
                      <Calendar className="w-3.5 h-3.5" />
                      Membro desde: {new Date(session.user.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                </div>

                {/* Auth button actions */}
                <div>
                  {session ? (
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-3 rounded-full font-bold text-sm transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair da Conta
                    </button>
                  ) : (
                    <button
                      onClick={handleMockLogin}
                      className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 px-6 py-3 rounded-full font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-md shadow-emerald-500/10"
                    >
                      <LogIn className="w-4 h-4" />
                      Conectar Conta
                    </button>
                  )}
                </div>
              </div>

              {/* Demonstrative Alert Box */}
              {authError && (
                <div className="mt-6 flex items-start gap-2.5 bg-slate-100 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-slate-400">
                  <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}
            </div>

            {/* Travel Stats HUD Dashboard */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Stat 1: Nível */}
                <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Nível Atual</span>
                    <span className="text-xl font-extrabold text-white">Nível {stats.level}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{stats.xp} XP acumulados</span>
                  </div>
                </div>

                {/* Stat 2: Carimbos */}
                <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Estados Visitados</span>
                    <span className="text-xl font-extrabold text-white">{stats.visitedStates.length} / 27</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Carimbos no passaporte</span>
                  </div>
                </div>

                {/* Stat 3: Conquistas */}
                <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Conquistas</span>
                    <span className="text-xl font-extrabold text-white">{stats.unlockedAchievements.length} desbloqueadas</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Emblemas desbloqueados</span>
                  </div>
                </div>

              </div>
            )}

            {/* Quick Actions to Aventura Hub */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 border border-emerald-500/20 text-center">
              <h3 className="font-extrabold text-lg text-white mb-2">Pronto para sua próxima conquista?</h3>
              <p className="text-slate-400 text-xs md:text-sm mb-4">Acesse a central de aventuras para resolver charadas e encontrar tesouros no mapa do Brasil.</p>
              <Link 
                href="/aventura"
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black px-6 py-3 rounded-full text-sm hover:scale-105 active:scale-95 transition-all shadow-md shadow-emerald-500/10"
              >
                <span>Ir para Central de Aventuras</span>
                <Compass className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
