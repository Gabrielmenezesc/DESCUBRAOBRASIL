"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { supabase } from "@/lib/supabase";
import { User, Heart, Book, LogOut, Settings, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/premium"; // Redireciona se não logado
        return;
      }

      setProfile({
        name: user.user_metadata?.full_name || user.email,
        email: user.email,
        avatar: user.user_metadata?.avatar_url,
        plan: "Premium" // Mock por enquanto
      });

      // Busca favoritos
      const { data: favs } = await supabase
        .from("user_favorites")
        .select("*")
        .eq("user_id", user.id);
      
      setFavorites(favs || []);
      setLoading(false);
    }

    getProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-white pt-24 pb-12 transition-colors duration-700">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="lg:w-1/4">
            <motion.div 
               initial={{ x: -20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="glass-card p-6 sticky top-28"
            >
              <div className="text-center mb-8">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full p-1 mb-4 shadow-lg">
                   {profile?.avatar ? (
                     <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full border-4 border-white dark:border-slate-800" />
                   ) : (
                     <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-3xl font-bold text-slate-400">
                       {profile?.name?.[0].toUpperCase()}
                     </div>
                   )}
                </div>
                <h2 className="text-xl font-bold">{profile?.name}</h2>
                <div className="flex items-center justify-center gap-1 mt-2">
                   <ShieldCheck className="w-4 h-4 text-emerald-500" />
                   <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">{profile?.plan}</span>
                </div>
              </div>

              <nav className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500 text-white font-medium">
                  <User className="w-5 h-5" /> Meu Perfil
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 font-medium">
                  <Heart className="w-5 h-5" /> Favoritos
                </button>
                <Link href="/premium" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 font-medium">
                  <Book className="w-5 h-5" /> Meus eBooks
                </Link>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 font-medium">
                  <Settings className="w-5 h-5" /> Ajustes
                </button>
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => { supabase.auth.signOut(); window.location.href = "/"; }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors font-medium"
                  >
                    <LogOut className="w-5 h-5" /> Sair
                  </button>
                </div>
              </nav>
            </motion.div>
          </aside>

          {/* Main Content */}
          <div className="lg:w-3/4 space-y-8">
            <motion.section 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="glass-card p-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-none shadow-blue-500/20 shadow-2xl"
            >
               <h1 className="text-3xl font-bold mb-2">Bem-vindo de volta, {profile?.name.split(' ')[0]}!</h1>
               <p className="text-blue-100 opacity-80">Sua próxima aventura pelo Brasil começa aqui. Onde vamos hoje?</p>
            </motion.section>

            <div className="grid md:grid-cols-2 gap-8">
               {/* Favoritos do App */}
               <motion.div 
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.1 }}
                 className="glass-card p-6"
               >
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="font-bold text-lg flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" /> Lugares Favoritos
                     </h3>
                     <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">Do App PWA</span>
                  </div>
                  
                  {favorites.length > 0 ? (
                    <div className="space-y-3">
                       {favorites.map((fav, i) => (
                         <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                            <div>
                               <div className="font-bold text-sm">{fav.poi_name}</div>
                               <div className="text-[10px] text-slate-500 uppercase">{fav.category}</div>
                            </div>
                            <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
                               <Settings className="w-4 h-4" />
                            </button>
                         </div>
                       ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400 italic text-sm">
                       Você ainda não salvou nenhum lugar no mapa do computador ou celular.
                    </div>
                  )}
               </motion.div>

               {/* eBooks e Downloads */}
               <motion.div 
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.2 }}
                 className="glass-card p-6"
               >
                  <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
                     <Book className="w-5 h-5 text-emerald-500" /> Downloads Premium
                  </h3>
                  <div className="space-y-4">
                     <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-3">
                           <div className="p-3 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-600">
                              <Book className="w-5 h-5" />
                           </div>
                           <div>
                              <div className="font-bold text-sm group-hover:text-blue-500 transition-colors">Acessar Biblioteca</div>
                              <div className="text-[10px] text-slate-500">10 eBooks liberados para você</div>
                           </div>
                        </div>
                     </div>
                     <Link href="/premium" className="block w-full py-3 text-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:scale-[1.02] transition-transform">
                        Ver Todos os Ebooks
                     </Link>
                  </div>
               </motion.div>
            </div>
          </div>

        </div>
      </div>

      <FooterSection />
    </main>
  );
}
