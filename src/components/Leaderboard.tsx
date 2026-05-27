"use client";

import { useEffect, useState } from "react";
import { getGamificationStats, type UserStats } from "@/lib/gamification";
import { Trophy, Medal, Award, Flame } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface LeaderboardUser {
  name: string;
  level: number;
  xp: number;
  isCurrentUser: boolean;
  avatar: string;
}

const MOCK_LEADERS: LeaderboardUser[] = [
  { name: "Gabriel Siqueira", level: 8, xp: 6400, isCurrentUser: false, avatar: "👨‍💻" },
  { name: "Beatriz Mello", level: 6, xp: 3600, isCurrentUser: false, avatar: "👩‍🌾" },
  { name: "Lucas Albuquerque", level: 5, xp: 2500, isCurrentUser: false, avatar: "🧗" },
  { name: "Mariana Souza", level: 4, xp: 1800, isCurrentUser: false, avatar: "🏕️" }
];

export default function Leaderboard() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [leaders, setLeaders] = useState<LeaderboardUser[]>(MOCK_LEADERS);

  useEffect(() => {
    const loadLeaders = async () => {
      const userStats = await getGamificationStats();
      setStats(userStats);
      
      const currentUser: LeaderboardUser = {
        name: "Você (Explorador)",
        level: userStats.level,
        xp: userStats.xp,
        isCurrentUser: true,
        avatar: "🧭"
      };

      // Merge and sort
      const merged = [...MOCK_LEADERS, currentUser].sort((a, b) => b.xp - a.xp);
      setLeaders(merged);
    };

    loadLeaders();
    window.addEventListener("xp_gained", loadLeaders);
    return () => window.removeEventListener("xp_gained", loadLeaders);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 rounded-[2rem] border border-white/10 bg-slate-900/50 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-indigo-500/5 pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-6 border-b border-white/5">
        <div>
          <h3 className="text-2xl font-black text-white flex items-center gap-2">
            <span>Ranking Global de Mochileiros</span>
            <Trophy className="w-5 h-5 text-amber-400" />
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Veja sua colocação e compare seus pontos de experiência com exploradores de todo o Brasil.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {leaders.map((user, idx) => {
          // Determine medal or badge
          let rankIndicator = <span className="text-slate-500 font-bold text-sm w-6 text-center">{idx + 1}</span>;
          if (idx === 0) rankIndicator = <Medal className="w-6 h-6 text-yellow-400" />;
          if (idx === 1) rankIndicator = <Medal className="w-6 h-6 text-slate-300" />;
          if (idx === 2) rankIndicator = <Medal className="w-6 h-6 text-amber-600" />;

          return (
            <div
              key={idx}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                user.isCurrentUser
                  ? "bg-emerald-500/10 border-emerald-500/30 text-white shadow-md shadow-emerald-500/5"
                  : "bg-slate-950/30 border-white/5"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Ranking Medal/Number */}
                <div className="flex-shrink-0 flex justify-center w-8">
                  {rankIndicator}
                </div>

                {/* Avatar Icon */}
                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-xl">
                  {user.avatar}
                </div>

                {/* User details */}
                <div>
                  <span className={`block font-bold text-sm md:text-base ${user.isCurrentUser ? "text-emerald-400" : "text-slate-200"}`}>
                    {user.name}
                  </span>
                  <span className="block text-[10px] text-slate-500 font-black uppercase tracking-wider">
                    Nível {user.level} • {user.level >= 5 ? "Mochileiro Lendário" : "Explorador Activo"}
                  </span>
                </div>
              </div>

              {/* XP score */}
              <div className="flex items-center gap-2">
                <Flame className={`w-4 h-4 ${user.isCurrentUser ? "text-emerald-400" : "text-amber-500"}`} />
                <span className="font-extrabold text-sm md:text-base text-white">{user.xp} XP</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
