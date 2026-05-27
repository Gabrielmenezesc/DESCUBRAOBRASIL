import { supabase } from "./supabase";

export interface UserStats {
  xp: number;
  level: number;
  visitedStates: string[]; // State codes (e.g. 'RJ', 'BA')
  unlockedAchievements: string[]; // Achievement IDs
  completedMissions: string[]; // Mission IDs
  foundTreasures: string[]; // Treasure IDs
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  category: "exploration" | "social" | "maya" | "special";
}

export interface Mission {
  id: string;
  stateCode: string;
  title: string;
  description: string;
  xpReward: number;
  riddle: string;
  answer: string; // The correct keyword answer to unlock
}

export interface Treasure {
  id: string;
  stateCode: string;
  title: string;
  riddle: string;
  lat: number;
  lng: number;
  xpReward: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_steps", title: "Primeiros Passos", description: "Iniciou sua jornada de exploração pelo Brasil.", icon: "🧭", xpReward: 50, category: "exploration" },
  { id: "maya_friend", title: "Amigo da Maya", description: "Interagiu com a Inteligência Artificial Maya.", icon: "🤖", xpReward: 50, category: "maya" },
  { id: "rj_explorer", title: "Explorador Imperial", description: "Desvendou os encantos do Rio de Janeiro.", icon: "🏖️", xpReward: 100, category: "exploration" },
  { id: "ba_explorer", title: "Alma Soteropolitana", description: "Imergiu na cultura e história da Bahia.", icon: "🥁", xpReward: 100, category: "exploration" },
  { id: "am_explorer", title: "Desbravador da Selva", description: "Explorou as belezas naturais do Amazonas.", icon: "🐆", xpReward: 100, category: "exploration" },
  { id: "five_stamps", title: "Viajante Experiente", description: "Coletou 5 carimbos diferentes no seu passaporte.", icon: "🗺️", xpReward: 300, category: "special" },
  { id: "treasure_hunter", title: "Caçador de Relíquias", description: "Encontrou seu primeiro tesouro escondido no mapa.", icon: "💎", xpReward: 200, category: "special" },
  { id: "master_explorer", title: "Super Mochileiro", description: "Atingiu o nível 5 de aventura.", icon: "👑", xpReward: 500, category: "special" }
];

export const MISSIONS: Mission[] = [
  {
    id: "m_rj",
    stateCode: "RJ",
    title: "O Guardião do Corcovado",
    description: "Qual é o nome do morro icônico onde a estátua do Cristo Redentor está localizada?",
    xpReward: 120,
    riddle: "Sou o morro que sustenta o abraço mais famoso do mundo na Cidade Maravilhosa.",
    answer: "corcovado"
  },
  {
    id: "m_ba",
    stateCode: "BA",
    title: "O Sabor do Dendê",
    description: "Qual iguaria típica baiana é feita de massa de feijão-fradinho, cebola e sal, frita no azeite de dendê?",
    xpReward: 120,
    riddle: "Servido quente com vatapá, caruru e camarão pelas baianas em seus tabuleiros.",
    answer: "acaraje"
  },
  {
    id: "m_am",
    stateCode: "AM",
    title: "O Templo da Ópera",
    description: "Qual é o nome do principal teatro histórico de Manaus, símbolo da época áurea da borracha?",
    xpReward: 120,
    riddle: "Minha cúpula tem as cores da bandeira brasileira e recebo óperas no coração da floresta.",
    answer: "teatro amazonas"
  },
  {
    id: "m_sp",
    stateCode: "SP",
    title: "Avenida Cultural",
    description: "Qual é a avenida mais famosa e importante de São Paulo, fechada para carros aos domingos?",
    xpReward: 120,
    riddle: "O MASP repousa sobre minhas calçadas e sou o coração financeiro paulista.",
    answer: "avenida paulista"
  },
  {
    id: "m_df",
    stateCode: "DF",
    title: "Arquitetura Alada",
    description: "Quem é o famoso arquiteto que projetou os monumentos curvos da Catedral e do Congresso em Brasília?",
    xpReward: 120,
    riddle: "Criei curvas no concreto armado que encantam o mundo sob as asas do plano piloto.",
    answer: "oscar niemeyer"
  }
];

export const TREASURES: Treasure[] = [
  { id: "t_rj", stateCode: "RJ", title: "Cálice de Ouro Real", riddle: "Escondido nas proximidades da icônica Confeitaria Colombo no Centro do Rio.", lat: -22.905, lng: -43.178, xpReward: 150 },
  { id: "t_ba", stateCode: "BA", title: "Amuleto do Senhor do Bonfim", riddle: "Oculto próximo à histórica Igreja do Nosso Senhor do Bonfim em Salvador.", lat: -12.924, lng: -38.508, xpReward: 150 },
  { id: "t_am", stateCode: "AM", title: "Lágrima de Vitória-Régia", riddle: "Escondida no Encontro das Águas dos rios Negro e Solimões.", lat: -3.134, lng: -59.902, xpReward: 150 },
  { id: "t_go", stateCode: "GO", title: "Pedra de Cristal da Chapada", riddle: "Oculta na entrada da trilha dos Cânions na Chapada dos Veadeiros.", lat: -14.135, lng: -47.788, xpReward: 150 }
];

export const DEFAULT_STATS: UserStats = {
  xp: 0,
  level: 1,
  visitedStates: [],
  unlockedAchievements: [],
  completedMissions: [],
  foundTreasures: []
};

// Calculate level based on XP: Level = Math.floor(Math.sqrt(XP / 100)) + 1
// Level 1: 0-99 XP
// Level 2: 100-399 XP (100)
// Level 3: 400-899 XP (400)
// Level 4: 900-1599 XP (900)
// Level 5: 1600+ XP (1600)
export function getLevelFromXP(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function getXPForNextLevel(level: number): number {
  return Math.pow(level, 2) * 100;
}

export function getXPProgress(xp: number): { currentLevelXP: number; nextLevelXP: number; percentage: number } {
  const level = getLevelFromXP(xp);
  const currentLevelXP = Math.pow(level - 1, 2) * 100;
  const nextLevelXP = Math.pow(level, 2) * 100;
  const range = nextLevelXP - currentLevelXP;
  const progress = xp - currentLevelXP;
  const percentage = Math.min(Math.round((progress / range) * 100), 100);
  
  return { currentLevelXP, nextLevelXP, percentage };
}

// Local Storage keys
const STORAGE_KEY = "descubra_brasil_gamification";

export async function getGamificationStats(): Promise<UserStats> {
  // Try loading from Supabase first if logged in
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data, error } = await supabase
        .from("user_gamification")
        .select("*")
        .eq("user_id", session.user.id)
        .single();
      
      if (data && !error) {
        return {
          xp: data.xp,
          level: data.level,
          visitedStates: data.visited_states || [],
          unlockedAchievements: data.unlocked_achievements || [],
          completedMissions: data.completed_missions || [],
          foundTreasures: data.found_treasures || []
        };
      }
    }
  } catch (e) {
    console.warn("Supabase gamification load failed - falling back to localStorage", e);
  }

  // Local storage fallback
  if (typeof window !== "undefined") {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        return DEFAULT_STATS;
      }
    }
  }
  return DEFAULT_STATS;
}

export async function saveGamificationStats(stats: UserStats): Promise<void> {
  // Sync level
  stats.level = getLevelFromXP(stats.xp);

  // Check achievements triggered by new stats
  checkTriggeredAchievements(stats);

  // Sync level again just in case achievements gave more XP
  stats.level = getLevelFromXP(stats.xp);

  // Save to local storage
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }

  // Save to Supabase if logged in
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { error } = await supabase
        .from("user_gamification")
        .upsert({
          user_id: session.user.id,
          xp: stats.xp,
          level: stats.level,
          visited_states: stats.visitedStates,
          unlocked_achievements: stats.unlockedAchievements,
          completed_missions: stats.completedMissions,
          found_treasures: stats.foundTreasures,
          updated_at: new Date()
        });
      if (error) console.error("Supabase gamification sync error:", error);
    }
  } catch (e) {
    console.warn("Supabase gamification save failed", e);
  }
}

function checkTriggeredAchievements(stats: UserStats): void {
  // Helper to unlock an achievement
  const unlock = (id: string) => {
    if (!stats.unlockedAchievements.includes(id)) {
      stats.unlockedAchievements.push(id);
      const ach = ACHIEVEMENTS.find(a => a.id === id);
      if (ach) {
        stats.xp += ach.xpReward;
        // Trigger custom dispatch event for UI notifications
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("achievement_unlocked", { detail: ach }));
        }
      }
    }
  };

  // 1. First steps
  if (stats.xp > 0 || stats.visitedStates.length > 0) {
    unlock("first_steps");
  }

  // 2. RJ Explorer
  if (stats.visitedStates.includes("RJ")) {
    unlock("rj_explorer");
  }

  // 3. BA Explorer
  if (stats.visitedStates.includes("BA")) {
    unlock("ba_explorer");
  }

  // 4. AM Explorer
  if (stats.visitedStates.includes("AM")) {
    unlock("am_explorer");
  }

  // 5. Five stamps
  if (stats.visitedStates.length >= 5) {
    unlock("five_stamps");
  }

  // 6. Treasure hunter
  if (stats.foundTreasures.length >= 1) {
    unlock("treasure_hunter");
  }

  // 7. Master explorer
  if (stats.level >= 5) {
    unlock("master_explorer");
  }
}

export async function addXP(amount: number, reason: string): Promise<UserStats> {
  const stats = await getGamificationStats();
  stats.xp += amount;
  await saveGamificationStats(stats);
  
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("xp_gained", { detail: { amount, reason } }));
  }
  
  return stats;
}

export async function visitState(stateCode: string): Promise<UserStats> {
  const stats = await getGamificationStats();
  const normalizedCode = stateCode.toUpperCase();
  
  if (!stats.visitedStates.includes(normalizedCode)) {
    stats.visitedStates.push(normalizedCode);
    stats.xp += 150; // 150 XP for stamp in passport
    await saveGamificationStats(stats);
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("state_visited", { detail: { stateCode: normalizedCode } }));
    }
  }
  return stats;
}

export async function completeMission(missionId: string): Promise<{ success: boolean; stats: UserStats; xpReward?: number }> {
  const stats = await getGamificationStats();
  const mission = MISSIONS.find(m => m.id === missionId);
  
  if (!mission) return { success: false, stats };
  
  if (!stats.completedMissions.includes(missionId)) {
    stats.completedMissions.push(missionId);
    stats.xp += mission.xpReward;
    await saveGamificationStats(stats);
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("mission_completed", { detail: mission }));
    }
    return { success: true, stats, xpReward: mission.xpReward };
  }
  
  return { success: false, stats };
}

export async function findTreasure(treasureId: string): Promise<{ success: boolean; stats: UserStats; xpReward?: number }> {
  const stats = await getGamificationStats();
  const treasure = TREASURES.find(t => t.id === treasureId);
  
  if (!treasure) return { success: false, stats };
  
  if (!stats.foundTreasures.includes(treasureId)) {
    stats.foundTreasures.push(treasureId);
    stats.xp += treasure.xpReward;
    await saveGamificationStats(stats);
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("treasure_found", { detail: treasure }));
    }
    return { success: true, stats, xpReward: treasure.xpReward };
  }
  return { success: false, stats };
}
