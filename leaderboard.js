    function goBack() {
      if (document.referrer && document.referrer.includes(window.location.host)) {
        window.history.back();
      } else {
        window.location.href = 'homepage.html';
      }
    }

    function handleLeaderboardClose() {
  // Check if loaded inside an iframe in index.html
  if (window.parent && window.parent.closeLeaderboardModal) {
    window.parent.closeLeaderboardModal();
  } else {
    // Fallback if accessed directly as a standalone page
    window.location.href = "index.html"; 
  }
}

    function switchLeaderboardTab(tab) {
      const tabs = ['global', 'friends', 'room'];
      
      tabs.forEach(t => {
        const btn = document.getElementById(`tab-${t}`);
        const form = document.getElementById(`form-${t}`);
        
        if (t === tab) {
          // Active Tab Styling
          btn.classList.remove('bg-[#FAE9CE]', 'text-[#3D2013]', 'cursor-pointer', 'flat-retro-shadow-hover');
          btn.classList.add('bg-[#E87339]', 'text-[#FFFFF6]', 'cursor-default');
          form.classList.remove('hidden');
        } else {
          // Inactive Tab Styling
          btn.classList.remove('bg-[#E87339]', 'text-[#FFFFF6]', 'cursor-default');
          btn.classList.add('bg-[#FAE9CE]', 'text-[#3D2013]', 'cursor-pointer', 'flat-retro-shadow-hover');
          form.classList.add('hidden');
        }
      });
    }

    // ==========================================
// MOCK DATA FOR LEADERBOARDS
// ==========================================
const currentUserId = 101; // ID representing "You"

const mockLeaderboardData = {
  global: [
    { id: 1, name: "PixelMaster", level: 42, points: 15400, streak: 28, coins: 3400, rank: 1, avatarUrl: "" },
    { id: 2, name: "StudyCat", level: 38, points: 14200, streak: 21, coins: 2890, rank: 2, avatarUrl: "" },
    { id: 101, name: "You", level: 25, points: 11850, streak: 14, coins: 1850, rank: 3, avatarUrl: "" },
    { id: 4, name: "CodeNinja", level: 29, points: 9400, streak: 9, coins: 1200, rank: 4, avatarUrl: "" },
    { id: 5, name: "FocusQueen", level: 27, points: 8900, streak: 12, coins: 950, rank: 5, avatarUrl: "" },
    { id: 6, name: "ByteHero", level: 22, points: 7600, streak: 5, coins: 810, rank: 6, avatarUrl: "" },
    { id: 7, name: "CoffeeLover", level: 20, points: 6800, streak: 3, coins: 620, rank: 7, avatarUrl: "" },
    { id: 8, name: "AlgoWizard", level: 18, points: 5900, streak: 7, coins: 450, rank: 8, avatarUrl: "" },
    { id: 9, name: "RetroGamer", level: 17, points: 5400, streak: 4, coins: 410, rank: 9, avatarUrl: "" },
    { id: 10, name: "KitsuFan", level: 15, points: 4800, streak: 6, coins: 380, rank: 10, avatarUrl: "" },
    { id: 11, name: "LogicKing", level: 14, points: 4200, streak: 2, coins: 310, rank: 11, avatarUrl: "" },
    { id: 12, name: "DataDrifter", level: 12, points: 3900, streak: 5, coins: 290, rank: 12, avatarUrl: "" },
    { id: 13, name: "NightOwl", level: 11, points: 3100, streak: 1, coins: 210, rank: 13, avatarUrl: "" },
    { id: 14, name: "CyberScholar", level: 9, points: 2600, streak: 3, coins: 180, rank: 14, avatarUrl: "" },
    { id: 15, name: "PixelRookie", level: 5, points: 1200, streak: 0, coins: 90, rank: 15, avatarUrl: "" }
  ],
  friends: [
    { id: 101, name: "You", level: 25, points: 11850, streak: 14, coins: 1850, rank: 1, avatarUrl: "" },
    { id: 2, name: "StudyCat", level: 38, points: 10200, streak: 21, coins: 2890, rank: 2, avatarUrl: "" },
    { id: 5, name: "FocusQueen", level: 27, points: 8900, streak: 12, coins: 950, rank: 3, avatarUrl: "" },
    { id: 7, name: "CoffeeLover", level: 20, points: 6800, streak: 3, coins: 620, rank: 4, avatarUrl: "" }
  ],
  room: [
    { id: 4, name: "CodeNinja", level: 29, points: 1400, streak: 9, coins: 1200, rank: 1, avatarUrl: "" },
    { id: 101, name: "You", level: 25, points: 1250, streak: 14, coins: 1850, rank: 2, avatarUrl: "" },
    { id: 8, name: "AlgoWizard", level: 18, points: 900, streak: 7, coins: 450, rank: 3, avatarUrl: "" }
  ]
};

// Utility function to escape HTML special characters
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==========================================
// RENDER LEADERBOARD ROW
// ==========================================
function createPlayerRow(player) {
  const isYou = player.id === currentUserId;
  
  // Background Colors: "You" = #F5C498, "Others" = #EBD9C4
  const bgColor = isYou ? 'bg-[#F5C498]' : 'bg-[#EBD9C4]';

  return `
    <div class="relative ${bgColor} border-[2px] border-[#3D2013] p-2 sm:p-2.5 flex items-center justify-between transition-colors hover:bg-opacity-90">
      
      <!-- LEFT SIDE: RANK NUMBER + AVATAR + NAME & LEVEL -->
      <div class="flex items-center gap-1.5 min-[380px]:gap-2 sm:gap-3 min-w-0">
        
        <!-- Rank Number (Clean text, uniform color, no #) -->
        <span class="font-pressstart text-[9px] min-[380px]:text-[11px] sm:text-[12px] text-[#3D2013] w-4 min-[380px]:w-5 sm:w-6 text-center shrink-0">
          ${player.rank}
        </span>

        <!-- Avatar -->
        <div class="relative shrink-0">
          <div class="w-7 h-7 min-[380px]:w-8 min-[380px]:h-8 sm:w-9 sm:h-9 rounded-full border-[2px] border-[#3D2013] bg-[#FAE9CE] flex items-center justify-center overflow-hidden">
            ${player.avatarUrl 
              ? `<img src="${player.avatarUrl}" class="w-full h-full object-cover">` 
              : `<span class="font-pressstart text-[10px] sm:text-xs text-[#3D2013]">${escapeHtml(player.name.charAt(0))}</span>`}
          </div>
        </div>
        
        <!-- Name & Level (Vertically centered container) -->
        <div class="flex flex-col justify-center min-w-0">
          <span class="font-pressstart text-[8px] min-[380px]:text-[9px] sm:text-[11px] text-[#3D2013] truncate leading-tight">
            ${escapeHtml(player.name)}
          </span>
          <span class="font-pixel text-[11px] min-[380px]:text-xs sm:text-sm text-[#3D2013]/75 leading-none mt-0.5">
            LVL ${player.level}
          </span>
        </div>
      </div>

      <!-- RIGHT SIDE: STATS (Vertical stack on mobile, horizontal row on desktop) -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 md:gap-4 shrink-0 pl-1.5 sm:pl-2">
        
        <!-- Points / Score -->
        <div class="flex items-center justify-end sm:justify-start gap-1" title="Points">
          <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#E87339] shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l2.4 5.26 5.6.49-4.2 3.86 1.22 5.48L12 14.37 7 17.09l1.22-5.48L4 7.75l5.6-.49L12 2z"/>
          </svg>
          <span class="font-pressstart text-[7.5px] min-[380px]:text-[8.5px] sm:text-[10px] text-[#3D2013] leading-none">
            ${player.points.toLocaleString()}
          </span>
        </div>

        <!-- Streak Fire -->
        <div class="flex items-center justify-end sm:justify-start gap-1" title="Day Streak">
          <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#E87339] shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.5 2.1c0 2.2-1.8 3.9-3.5 5.2-1.4 1.1-2.5 2.4-2.5 4.2 0 3 2.5 5.5 5.5 5.5s5.5-2.5 5.5-5.5c0-3.3-2.3-5.8-5-9.4z"/>
          </svg>
          <span class="font-pressstart text-[7.5px] min-[380px]:text-[8.5px] sm:text-[10px] text-[#3D2013] leading-none">
            ${player.streak}d
          </span>
        </div>

        <!-- Coins Logo & Count -->
        <div class="flex items-center justify-end sm:justify-start gap-1" title="Coins">
          <img src="media/coin_logo.png" alt="Coins" class="w-3 h-3 sm:w-3.5 sm:h-3.5 object-contain shrink-0" 
               onerror="this.onerror=null; this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%23FD923E%22><circle cx=%2212%22 cy=%2212%22 r=%2210%22/></svg>';">
          <span class="font-pressstart text-[7.5px] min-[380px]:text-[8.5px] sm:text-[10px] text-[#3D2013] leading-none">
            ${player.coins.toLocaleString()}
          </span>
        </div>

      </div>

    </div>
  `;
}

// ==========================================
// INFLATE ALL TAB CONTAINERS
// ==========================================
function renderLeaderboards() {
  ['global', 'friends', 'room'].forEach(tabKey => {
    const container = document.getElementById(`form-${tabKey}`);
    if (container && mockLeaderboardData[tabKey]) {
      container.innerHTML = mockLeaderboardData[tabKey]
        .map(player => createPlayerRow(player))
        .join('');
    }
  });
}

// ==========================================
// TAB SWITCHING LOGIC
// ==========================================
function switchLeaderboardTab(selectedTab) {
  const tabs = ['global', 'friends', 'room'];

  tabs.forEach(tab => {
    const tabBtn = document.getElementById(`tab-${tab}`);
    const tabForm = document.getElementById(`form-${tab}`);

    if (tab === selectedTab) {
      // Active Tab Styling
      tabBtn.classList.remove('bg-[#FAE9CE]', 'text-[#3D2013]', 'cursor-pointer', 'flat-retro-shadow-hover');
      tabBtn.classList.add('bg-[#E87339]', 'text-[#FFFFF6]', 'cursor-default');
      tabForm.classList.remove('hidden');
    } else {
      // Inactive Tab Styling
      tabBtn.classList.remove('bg-[#E87339]', 'text-[#FFFFF6]', 'cursor-default');
      tabBtn.classList.add('bg-[#FAE9CE]', 'text-[#3D2013]', 'cursor-pointer', 'flat-retro-shadow-hover');
      tabForm.classList.add('hidden');
    }
  });
}

// Navigation back handler
function goBack() {
  window.history.back();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  renderLeaderboards();
});