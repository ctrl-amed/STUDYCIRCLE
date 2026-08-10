// ==========================================
// LEADERBOARD SCRIPT (DATABASE CONNECTED)
// ==========================================

let currentUserId = null;
let globalRankings = [];
let friendsRankings = [];
let roomRankings = [];

/**
 * Fetch real leaderboard data from backend API
 */
async function fetchLeaderboardData() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    console.warn("No authentication token found.");
    return;
  }

  try {
    // 1. Kunin ang kasalukuyang user profile para malaman kung sino si "You"
    const profileRes = await fetch("http://127.0.0.1:5000/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (profileRes.ok) {
      const profileData = await profileRes.json();
      currentUserId = profileData.id;
    }

    // 2. Kunin ang Global Leaderboard galing sa Flask backend
    const response = await fetch("http://127.0.0.1:5000/api/leaderboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard from server.");
    }

    const data = await response.json();
    const rawUsers = data.leaderboard || [];

   // Map backend response to match row template fields with fallback checks
    globalRankings = rawUsers.map((u, index) => ({
      id: u.id,
      name: u.id === currentUserId ? "You" : u.name,
      level: u.level || 1,
      points: u.currentXP || u.points || 0,
      streak: u.streakDays || u.streak || u.streak_days || 0,
      coins: u.coins || 0,
      rank: index + 1,
      avatarUrl: u.avatarUrl || u.avatar_url || ""
    }));

    // 3. Para sa Friends Tab: Kunin ang listahan ng mga kaibigan
    try {
      const friendsRes = await fetch("http://127.0.0.1:5000/api/friends", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (friendsRes.ok) {
        const friendsData = await friendsRes.json();
        const friendIds = [currentUserId, ...(friendsData.friends || []).map(f => f.id)];
        friendsRankings = globalRankings
          .filter(u => friendIds.includes(u.id))
          .sort((a, b) => b.points - a.points)
          .map((u, idx) => ({ ...u, rank: idx + 1 }));
      } else {
        friendsRankings = globalRankings.filter(u => u.id === currentUserId);
      }
    } catch (e) {
      console.warn("Could not load friends for leaderboard:", e);
      friendsRankings = globalRankings.filter(u => u.id === currentUserId);
    }

    // 4. Para sa Room Tab (Halimbawa: Top 5 global users)
    roomRankings = globalRankings.slice(0, 5).map((u, idx) => ({ ...u, rank: idx + 1 }));

    // I-render ang lahat ng tabs
    renderTabContainer('global', globalRankings);
    renderTabContainer('friends', friendsRankings);
    renderTabContainer('room', roomRankings);

  } catch (err) {
    console.error("Failed to load leaderboard data:", err);
  }
}

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
// RENDER LEADERBOARD ROW WITH SAFE AVATAR FALLBACK
// ==========================================
function createPlayerRow(player) {
  const isYou = player.id === currentUserId;
  const bgColor = isYou ? 'bg-[#F5C498]' : 'bg-[#EBD9C4]';

  // Default configuration kung sakaling walang laman ang avatarUrl sa database
  let avatarConfigAttr = { body: "BODY1", face: "FACE1", tops: "TOP1", bottoms: "BOTTOM1" };
  
  try {
    if (player.avatarUrl) {
      let parsed = player.avatarUrl;
      while (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      if (typeof parsed === 'object' && parsed !== null) {
        avatarConfigAttr = parsed;
      }
    }
  } catch (e) {
    console.error("Error parsing leaderboard avatar config:", e);
  }

  const configString = JSON.stringify(avatarConfigAttr).replace(/"/g, '&quot;');
  const firstLetter = player.name ? player.name.charAt(0).toUpperCase() : "?";

  return `
    <div class="relative ${bgColor} border-[2px] border-[#3D2013] p-2 sm:p-2.5 flex items-center justify-between transition-colors hover:bg-opacity-90 mb-1.5">
      
      <!-- LEFT SIDE: RANK NUMBER + CUSTOM AVATAR + NAME & LEVEL -->
      <div class="flex items-center gap-1.5 min-[380px]:gap-2 sm:gap-3 min-w-0">
        
        <span class="font-pressstart text-[9px] min-[380px]:text-[11px] sm:text-[12px] text-[#3D2013] w-4 min-[380px]:w-5 sm:w-6 text-center shrink-0">
          ${player.rank}
        </span>

        <!-- Custom Avatar Component with Letter Fallback -->
        <div class="relative shrink-0">
          <div class="w-8 h-8 min-[380px]:w-9 min-[380px]:h-9 sm:w-10 sm:h-10 rounded-full border-[2px] border-[#3D2013] bg-[#FAE9CE] flex items-center justify-center overflow-hidden">
            ${player.avatarUrl ? `
              <custom-avatar class="w-full h-full scale-150 origin-center pointer-events-none" config="${configString}"></custom-avatar>
            ` : `
              <span class="font-pressstart text-xs text-[#3D2013]">${firstLetter}</span>
            `}
          </div>
        </div>
        
        <div class="flex flex-col justify-center min-w-0">
          <span class="font-pressstart text-[8px] min-[380px]:text-[9px] sm:text-[11px] text-[#3D2013] truncate leading-tight">
            ${escapeHtml(player.name)}
          </span>
          <span class="font-pixel text-[11px] min-[380px]:text-xs sm:text-sm text-[#3D2013]/75 leading-none mt-0.5">
            LVL ${player.level}
          </span>
        </div>
      </div>

      <!-- RIGHT SIDE: STATS -->
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
          <img src="media/coin_logo.png" alt="Coins" class="w-3 h-3 sm:w-3.5 sm:h-3.5 object-contain shrink-0">
          <span class="font-pressstart text-[7.5px] min-[380px]:text-[8.5px] sm:text-[10px] text-[#3D2013] leading-none">
            ${player.coins.toLocaleString()}
          </span>
        </div>

      </div>

    </div>
  `;
}

// ==========================================
// INFLATE TAB CONTAINERS
// ==========================================
function renderTabContainer(tabKey, dataList) {
  const container = document.getElementById(`form-${tabKey}`);
  if (container) {
    if (dataList.length === 0) {
      container.innerHTML = `<p class="text-center font-pixel text-sm p-4 text-[#3D2013]">No entries available.</p>`;
      return;
    }
    container.innerHTML = dataList
      .map(player => createPlayerRow(player))
      .join('');
  }
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
      tabBtn.classList.remove('bg-[#FAE9CE]', 'text-[#3D2013]', 'cursor-pointer', 'flat-retro-shadow-hover');
      tabBtn.classList.add('bg-[#E87339]', 'text-[#FFFFF6]', 'cursor-default');
      tabForm.classList.remove('hidden');
    } else {
      tabBtn.classList.remove('bg-[#E87339]', 'text-[#FFFFF6]', 'cursor-default');
      tabBtn.classList.add('bg-[#FAE9CE]', 'text-[#3D2013]', 'cursor-pointer', 'flat-retro-shadow-hover');
      tabForm.classList.add('hidden');
    }
  });
}

// ==========================================
// CLOSE / NAVIGATION HANDLERS
// ==========================================
function handleLeaderboardClose() {
  if (window.parent && window.parent.closeLeaderboardModal) {
    window.parent.closeLeaderboardModal();
  } else {
    window.location.href = "index.html"; 
  }
}

function goBack() {
  if (document.referrer && document.referrer.includes(window.location.host)) {
    window.history.back();
  } else {
    window.location.href = 'homepage.html';
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  fetchLeaderboardData();
});