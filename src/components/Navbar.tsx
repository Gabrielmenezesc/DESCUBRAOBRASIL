"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Clock, Sun, Moon } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/supabase";
import { User, LogIn, Crown } from "lucide-react";


const navLinks = [
  { href: "/", label: "Início" },
  { href: "/noticias", label: "Notícias" },
  { href: "/turismo", label: "Turismo" },
  { href: "/servicos", label: "Dicas" },
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/contato", label: "Contato" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { weather, loading } = useWeather();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    
    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Brasília live clock ──────────────────────────────────
  const [clock, setClock] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      // Brasília is UTC-3 always
      const bsb = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
      const h = bsb.getHours().toString().padStart(2, "0");
      const m = bsb.getMinutes().toString().padStart(2, "0");
      const s = bsb.getSeconds().toString().padStart(2, "0");
      setClock(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group hover:scale-105 transition-transform">
            <img 
              src="/logo-descubra.png" 
              alt="Descubra o Brasil" 
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Weather + Clock Badges */}
          <div className="flex items-center gap-3">
            {/* Weather Badge */}
            {!loading && weather && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/30 dark:to-emerald-900/30 border border-blue-100 dark:border-blue-800/50 text-sm">
                <span className="text-lg">{weather.icon}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{weather.temperature}°C</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs max-w-[80px] truncate">{weather.city}</span>
              </div>
            )}
            {loading && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 text-sm">
                <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="w-12 h-3 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
              </div>
            )}
            {/* Brasília Clock Badge */}
            {clock && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm">
                <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 dark:text-slate-400" />
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300 text-xs">{clock}</span>
                <span className="text-slate-400 dark:text-slate-500 dark:text-slate-400 text-xs">BSB</span>
              </div>
            )}

            {/* Dark Mode Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />}
              </button>
            )}

            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-800">
                {session ? (
                  <Link 
                    href="/dashboard" 
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 text-white font-bold text-sm hover:bg-blue-600 transition-colors"
                  >
                    {session.user.user_metadata?.avatar_url ? (
                      <img src={session.user.user_metadata.avatar_url} className="w-5 h-5 rounded-full" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span>Minha Conta</span>
                  </Link>
                ) : (
                  <>
                    <button 
                      onClick={() => alert('Faça login no Aplicativo para acesso completo!')} 
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <LogIn className="w-4 h-4" /> Entrar
                    </button>
                  </>
                )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-xl animate-in slide-in-from-top-4 duration-300">
          <div className="px-4 py-8 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-6 py-4 rounded-2xl text-xl font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                {link.label}
              </Link>
            ))}
            
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 space-y-4 px-2">
               {session ? (
                 <Link 
                   href="/dashboard"
                   className="block w-full py-5 text-center rounded-2xl bg-blue-500 text-white font-black text-lg shadow-lg shadow-blue-500/30"
                   onClick={() => setOpen(false)}
                 >
                   ✨ Painel do Viajante
                 </Link>
               ) : (
                 <>
                   <Link 
                     href="/premium"
                     className="block w-full py-5 text-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-lg"
                     onClick={() => setOpen(false)}
                   >
                     Entrar Agora
                   </Link>
                   <Link 
                     href="/premium"
                     className="block w-full py-5 text-center rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-lg"
                     onClick={() => setOpen(false)}
                   >
                     Seja Premium <Crown className="inline-block w-5 h-5 ml-1 fill-current" />
                   </Link>
                 </>
               )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
