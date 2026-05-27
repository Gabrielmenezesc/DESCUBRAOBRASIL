// PWA Gamification System
// Syncs via the same LocalStorage key as the main website

const GAMIFICATION_STORAGE_KEY = "descubra_brasil_gamification";

const APP_ACHIEVEMENTS = [
  { id: "first_steps", title: "Primeiros Passos", description: "Iniciou sua jornada de aventura.", icon: "🧭", xpReward: 50 },
  { id: "maya_friend", title: "Amigo da Maya", description: "Perguntou algo para a Maya IA.", icon: "🤖", xpReward: 50 },
  { id: "rj_explorer", title: "Explorador Imperial", description: "Visitou o Rio de Janeiro.", icon: "🏖️", xpReward: 100 },
  { id: "ba_explorer", title: "Alma Soteropolitana", description: "Visitou a Bahia.", icon: "🥁", xpReward: 100 },
  { id: "am_explorer", title: "Desbravador da Selva", description: "Visitou o Amazonas.", icon: "🐆", xpReward: 100 },
  { id: "five_stamps", title: "Viajante Experiente", description: "Coletou 5 carimbos de estados.", icon: "🗺️", xpReward: 300 }
];

const STATES_STAMPS = [
  { code: "RJ", name: "Rio de Janeiro", icon: "🏖️", color: "linear-gradient(135deg, #3b82f6, #06b6d4)" },
  { code: "BA", name: "Bahia", icon: "🥁", color: "linear-gradient(135deg, #f57c00, #ffb300)" },
  { code: "AM", name: "Amazonas", icon: "🐆", color: "linear-gradient(135deg, #2e7d32, #4caf50)" },
  { code: "SP", name: "São Paulo", icon: "🏙️", color: "linear-gradient(135deg, #4f46e5, #9333ea)" },
  { code: "DF", name: "Distrito Federal", icon: "🏛️", color: "linear-gradient(135deg, #d97706, #f59e0b)" },
  { code: "GO", name: "Goiás", icon: "🏞️", color: "linear-gradient(135deg, #14b8a6, #10b981)" },
  { code: "MG", name: "Minas Gerais", icon: "☕", color: "linear-gradient(135deg, #ef4444, #f43f5e)" },
  { code: "PR", name: "Paraná", icon: "🌲", color: "linear-gradient(135deg, #15803d, #16a34a)" },
  { code: "RS", name: "Rio G. do Sul", icon: "🧉", color: "linear-gradient(135deg, #dc2626, #fbbf24)" },
];

// Load stats from LocalStorage
function getAppStats() {
  const local = localStorage.getItem(GAMIFICATION_STORAGE_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      // Use defaults
    }
  }
  return {
    xp: 0,
    level: 1,
    visitedStates: [],
    unlockedAchievements: [],
    completedMissions: [],
    foundTreasures: []
  };
}

// Save stats
function saveAppStats(stats) {
  // Recalculate level
  stats.level = Math.floor(Math.sqrt(stats.xp / 100)) + 1;
  
  // Trigger automatic achievements
  if (stats.xp > 0 && !stats.unlockedAchievements.includes("first_steps")) {
    stats.unlockedAchievements.push("first_steps");
    stats.xp += 50;
  }
  if (stats.visitedStates.includes("RJ") && !stats.unlockedAchievements.includes("rj_explorer")) {
    stats.unlockedAchievements.push("rj_explorer");
    stats.xp += 100;
  }
  if (stats.visitedStates.includes("BA") && !stats.unlockedAchievements.includes("ba_explorer")) {
    stats.unlockedAchievements.push("ba_explorer");
    stats.xp += 100;
  }
  if (stats.visitedStates.includes("AM") && !stats.unlockedAchievements.includes("am_explorer")) {
    stats.unlockedAchievements.push("am_explorer");
    stats.xp += 100;
  }
  if (stats.visitedStates.length >= 5 && !stats.unlockedAchievements.includes("five_stamps")) {
    stats.unlockedAchievements.push("five_stamps");
    stats.xp += 300;
  }

  stats.level = Math.floor(Math.sqrt(stats.xp / 100)) + 1;

  localStorage.setItem(GAMIFICATION_STORAGE_KEY, JSON.stringify(stats));
  updateAppHUD();
}

// Get rank name based on level
function getRankName(level) {
  if (level === 1) return "Recruta de Viagem";
  if (level === 2) return "Mochileiro Iniciante";
  if (level === 3) return "Navegador de Chapadas";
  if (level === 4) return "Explorador da Selva";
  return "Mochileiro Lendário";
}

// Update DOM elements on Home HUD & Adventure Modal
function updateAppHUD() {
  const stats = getAppStats();
  const rank = getRankName(stats.level);
  
  const currentLevelXP = Math.pow(stats.level - 1, 2) * 100;
  const nextLevelXP = Math.pow(stats.level, 2) * 100;
  const range = nextLevelXP - currentLevelXP;
  const progress = stats.xp - currentLevelXP;
  const percentage = Math.min(Math.round((progress / range) * 100), 100);

  // Update HUD
  const hudRank = document.getElementById("app-hud-rank");
  const hudLevel = document.getElementById("app-hud-level");
  const hudProgress = document.getElementById("app-hud-progress");
  const hudXp = document.getElementById("app-hud-xp");
  const hudStates = document.getElementById("app-hud-states");

  if (hudRank) hudRank.textContent = rank;
  if (hudLevel) hudLevel.textContent = `Nível ${stats.level}`;
  if (hudProgress) hudProgress.style.width = `${percentage}%`;
  if (hudXp) hudXp.textContent = `${stats.xp} / ${nextLevelXP} XP`;
  if (hudStates) hudStates.textContent = `🎒 ${stats.visitedStates.length}/27 Estados`;

  // Update Adventure Modal if visible
  const advRank = document.getElementById("adv-rank");
  const advLevel = document.getElementById("adv-level");
  const advProgress = document.getElementById("adv-progress");
  const advXp = document.getElementById("adv-xp");
  const advStates = document.getElementById("adv-states");

  if (advRank) advRank.textContent = rank;
  if (advLevel) advLevel.textContent = `Nível ${stats.level}`;
  if (advProgress) advProgress.style.width = `${percentage}%`;
  if (advXp) advXp.textContent = `${stats.xp} / ${nextLevelXP} XP`;
  if (advStates) advStates.textContent = `${stats.visitedStates.length}/27 Estados`;

  // Render Stamps Grid
  const stampsGrid = document.getElementById("adv-stamps-grid");
  if (stampsGrid) {
    stampsGrid.innerHTML = "";
    STATES_STAMPS.forEach(st => {
      const isStamped = stats.visitedStates.includes(st.code);
      const cell = document.createElement("div");
      cell.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        background: #f8fafc;
        border: 1px solid ${isStamped ? '#10b981' : '#e2e8f0'};
        border-radius: 12px;
        opacity: ${isStamped ? '1' : '0.45'};
        cursor: pointer;
        position: relative;
      `;
      
      cell.innerHTML = `
        <div style="
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: ${isStamped ? st.color : '#e2e8f0'};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          margin-bottom: 5px;
          color: white;
          transform: ${isStamped ? 'rotate(-10deg)' : 'none'};
          box-shadow: ${isStamped ? '0 4px 10px rgba(16,185,129,0.2)' : 'none'};
        ">
          ${isStamped ? st.icon : '🔒'}
        </div>
        <span style="font-size: 9px; font-weight: 800; color: #1e293b; text-align: center; text-transform: uppercase;">${st.code}</span>
      `;

      if (!isStamped) {
        cell.addEventListener("click", () => {
          stats.visitedStates.push(st.code);
          stats.xp += 150;
          saveAppStats(stats);
          Swal.fire({
            title: "Carimbo Coletado! 🎒",
            text: `Você carimbou o passaporte para ${st.name} e ganhou +150 XP!`,
            icon: "success",
            confirmButtonText: "Maravilha!",
            confirmButtonColor: "#10B981"
          });
        });
      }

      stampsGrid.appendChild(cell);
    });
  }

  // Render Achievements
  const achList = document.getElementById("adv-achievements-list");
  if (achList) {
    achList.innerHTML = "";
    APP_ACHIEVEMENTS.forEach(ach => {
      const isUnlocked = stats.unlockedAchievements.includes(ach.id);
      const row = document.createElement("div");
      row.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px;
        background: #f8fafc;
        border: 1px solid ${isUnlocked ? '#10b981' : '#e2e8f0'};
        border-radius: 12px;
        opacity: ${isUnlocked ? '1' : '0.55'};
        text-align: left;
      `;
      
      row.innerHTML = `
        <div style="width: 38px; height: 38px; border-radius: 8px; background: ${isUnlocked ? 'rgba(16,185,129,0.1)' : '#e2e8f0'}; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;">
          ${isUnlocked ? ach.icon : '🔒'}
        </div>
        <div style="flex: 1;">
          <h5 style="margin: 0; font-size: 0.8rem; font-weight: 800; color: #1e293b;">${ach.title}</h5>
          <p style="margin: 0; font-size: 0.68rem; color: #64748b;">${ach.description}</p>
        </div>
        <span style="font-size: 10px; font-weight: 800; color: ${isUnlocked ? '#10b981' : '#64748b'};">${isUnlocked ? '✓' : ''} +${ach.xpReward} XP</span>
      `;
      achList.appendChild(row);
    });
  }
}

// Initial triggers
document.addEventListener("DOMContentLoaded", () => {
  // Listen to clicks on the HUD card to open the Adventure modal
  const hud = document.getElementById("app-gamification-hud");
  if (hud) {
    hud.addEventListener("click", () => {
      const modal = document.getElementById("modal-adventure");
      if (modal) {
        modal.classList.remove("hidden");
        updateAppHUD();
      }
    });
  }

  // Hook into Maya chat to award XP for interactions
  const sendBtn = document.getElementById("maya-send");
  const input = document.getElementById("maya-input");
  if (sendBtn && input) {
    const awardMayaXP = () => {
      const stats = getAppStats();
      if (!stats.unlockedAchievements.includes("maya_friend")) {
        stats.unlockedAchievements.push("maya_friend");
        stats.xp += 100; // Award 100 XP on first conversation
        saveAppStats(stats);
        Swal.fire({
          title: "Conquista Desbloqueada! 🤖",
          text: "Você conversou com a Maya IA e ganhou +100 XP!",
          icon: "info",
          confirmButtonText: "Legal!",
          confirmButtonColor: "#10B981"
        });
      }
    };
    sendBtn.addEventListener("click", awardMayaXP);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") awardMayaXP();
    });
  }

  // Render initial HUD
  updateAppHUD();
});
