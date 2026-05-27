"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Compass, MapPin, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";
import { getGamificationStats, findTreasure, TREASURES, type Treasure } from "@/lib/gamification";

export default function TreasureHunt() {
  const [found, setFound] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTreasure, setSelectedTreasure] = useState<Treasure | null>(null);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchStats = async () => {
    const stats = await getGamificationStats();
    setFound(stats.foundTreasures);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
    
    // Listen to updates
    const handleUpdate = () => {
      fetchStats();
    };
    window.addEventListener("treasure_found", handleUpdate);
    return () => window.removeEventListener("treasure_found", handleUpdate);
  }, []);

  const handleDig = async () => {
    if (!selectedTreasure) return;
    
    const userGuess = guess.trim().toLowerCase();
    
    // Determine the expected answer based on the treasure ID
    let correctAnswer = "";
    if (selectedTreasure.id === "t_rj") correctAnswer = "confeitaria colombo";
    if (selectedTreasure.id === "t_ba") correctAnswer = "igreja do bonfim";
    if (selectedTreasure.id === "t_am") correctAnswer = "encontro das aguas";
    if (selectedTreasure.id === "t_go") correctAnswer = "trilha dos canions";
    
    if (userGuess.includes(correctAnswer) || correctAnswer.includes(userGuess) && userGuess.length > 4) {
      const result = await findTreasure(selectedTreasure.id);
      if (result.success) {
        setFeedback({ type: "success", message: `Incrível! Você escavou e encontrou o ${selectedTreasure.title}! +${selectedTreasure.xpReward} XP 🎉` });
        fetchStats();
      } else {
        setFeedback({ type: "success", message: "Você já desvendou este baú!" });
      }
    } else {
      setFeedback({ type: "error", message: "Nada encontrado neste ponto. Analise a pista novamente! 🔍" });
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
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-emerald-500/5 pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-6 border-b border-white/5">
        <div>
          <h3 className="text-2xl font-black text-white flex items-center gap-2">
            <span>Caça ao Tesouro Geográfico</span>
            <span className="text-xs px-2.5 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full">
              {found.length} de {TREASURES.length} Encontrados
            </span>
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Encontre relíquias escondidas em coordenadas geográficas exatas pelo Brasil. Siga a pista e digite o local preciso para escavar!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Treasure Chests List */}
        <div className="lg:col-span-1 space-y-4">
          <span className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Relíquias</span>
          {TREASURES.map((t) => {
            const isFound = found.includes(t.id);
            const isSelected = selectedTreasure?.id === t.id;
            
            return (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTreasure(t);
                  setGuess("");
                  setFeedback(null);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-slate-950 border-cyan-500/50 text-white shadow-md shadow-cyan-500/5"
                    : isFound
                      ? "bg-slate-950/40 border-emerald-500/20 text-slate-300"
                      : "bg-slate-950/20 border-white/5 hover:border-white/10 text-slate-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{isFound ? "🔓" : "🔒"}</span>
                  <div>
                    <span className="block font-bold text-sm">{t.title}</span>
                    <span className="block text-[10px] font-black text-slate-500 uppercase">{t.stateCode}</span>
                  </div>
                </div>
                {isFound && (
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center border border-emerald-500/30">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Riddle / Interactive Digging Area */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-slate-950/40 p-6 flex flex-col justify-between">
          {selectedTreasure ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-cyan-400" />
                    <h4 className="font-extrabold text-white text-lg">{selectedTreasure.title}</h4>
                  </div>
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase">
                    +{selectedTreasure.xpReward} XP
                  </span>
                </div>
                
                {/* Coordinates & Riddle */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-950 p-3 rounded-lg border border-white/5">
                    <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                    <span>Coordenadas de satélite: Lat {selectedTreasure.lat}, Lng {selectedTreasure.lng}</span>
                  </div>
                  
                  <div className="p-5 rounded-xl bg-slate-950/80 border border-white/5">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-2">Charada de Localização</span>
                    <p className="text-slate-200 text-sm md:text-base italic leading-relaxed">
                      &ldquo;{selectedTreasure.riddle}&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Digging input */}
              <div className="mt-6 space-y-4">
                {!found.includes(selectedTreasure.id) ? (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-400">Onde devemos cavar?</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Digite o ponto turístico exato (ex: Igreja do Bonfim)..."
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        className="flex-1 bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 font-bold focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                      <button
                        onClick={handleDig}
                        className="bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500 text-slate-950 px-6 py-3 rounded-xl font-black transition-all hover:scale-105 active:scale-95 shadow-md shadow-cyan-500/10"
                      >
                        Escavar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <span className="block text-white">Tesouro Encontrado!</span>
                      <span className="block text-xs text-emerald-500/80 font-medium mt-0.5">Parabéns por explorar com precisão! Você escavou esta relíquia histórica.</span>
                    </div>
                  </div>
                )}

                {/* Feedback messages */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex items-center gap-2 text-sm font-bold mt-2 ${
                        feedback.type === "success" ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {feedback.type === "success" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                      <span>{feedback.message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
              <HelpCircle className="w-12 h-12 text-slate-700 mb-4 animate-bounce" />
              <span className="font-bold text-lg text-slate-400">Selecione uma relíquia</span>
              <span className="text-sm text-slate-500 mt-1 max-w-xs">Escolha um dos baús trancados à esquerda para ver suas coordenadas de GPS e decifrar o enigma.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
