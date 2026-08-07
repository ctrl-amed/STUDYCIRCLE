// ==========================================
// AVATAR OVERLAY MODAL LOGIC
// ==========================================
function openAvatarModal(event) {
  if (event) event.preventDefault();
  const iframe = document.getElementById("avatar-frame");
  if (iframe && iframe.src !== window.location.origin + "/customavatar.html") {
    iframe.src = "customavatar.html";
  }
  openModal("avatar-modal");
}

function closeAvatarModal() {
  closeModal("avatar-modal");
}

// ==========================================
// FURNITURE OVERLAY MODAL LOGIC
// ==========================================
function openFurnitureModal(event) {
  if (event) event.preventDefault();
  const iframe = document.getElementById("furniture-frame");
  if (iframe && iframe.src !== window.location.origin + "/customroom.html") {
    iframe.src = "customroom.html";
  }
  openModal("furniture-modal");
}

function closeFurnitureModal() {
  closeModal("furniture-modal");
}

// ==========================================
// ROOM INFO & REAL MULTIPLAYER SYNC LOGIC
// ==========================================

const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://127.0.0.1:5000"
  : "https://studycircle-kv4v.onrender.com";

let currentUser = { id: null };
let activeRoomData = null;
let currentRenderedPlayers = "";

function getUrlRoomId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("room") || sessionStorage.getItem("activeRoomId") || "";
}

// Ensure the system knows who the currently logged-in user is
async function fetchCurrentUser() {
  try {
    const token = sessionStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/me`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) {
      currentUser = await res.json();
      sessionStorage.setItem("current_user", JSON.stringify(currentUser));
    }
  } catch(e) {
    console.error("Failed to fetch current user data.");
  }
}

// ==========================================
// ROOM INFO, FURNITURE & REAL MULTIPLAYER SYNC
// ==========================================

async function fetchAndRenderRoomData() {
  const roomNameElem = document.getElementById("nav-room-name");
  const roomCodeElem = document.getElementById("nav-room-code");
  const targetRoomCode = getUrlRoomId();

  if (roomCodeElem) roomCodeElem.textContent = targetRoomCode;
  if (!targetRoomCode) return;

  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/api/rooms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      const rooms = data.rooms || [];
      const currentRoom = rooms.find(r => (r.room_code || r.id) === targetRoomCode);

      if (currentRoom) {
        activeRoomData = currentRoom; // Save globally for Kick Button validation
        if (roomNameElem) roomNameElem.textContent = currentRoom.name || "Study Room";
        
        // --- 1. SYNC ROOM FURNITURE ---
        // Assuming your room uses a <custom-room> tag. 
        const roomElement = document.querySelector("custom-room"); 
        if (roomElement && activeRoomData.room_config) {
          let rConfig = activeRoomData.room_config;
          while (typeof rConfig === 'string') {
            try { rConfig = JSON.parse(rConfig); } catch(e) { break; }
          }
          // Only update if it exists and is an object
          if (typeof rConfig === 'object' && Object.keys(rConfig).length > 0) {
            roomElement.setAttribute("config", JSON.stringify(rConfig));
          }
        }

        // --- 2. SYNC LOCAL PLAYER HOST ICON ---
        // Updates your OWN name tag in the center of the screen
        const localNameTag = document.getElementById("local-player-name");
        if (localNameTag && currentUser.id) {
          const isLocalHost = String(currentUser.id) === String(activeRoomData.host_id);
          const cleanName = currentUser.username || currentUser.name || "STUDENT";
          const hostSvg = `<svg class="w-2.5 h-2.5 inline-block mr-1 text-[#FFFFFF] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L4 9v12h5v-7h6v7h5V9z"/></svg>`;
          
          localNameTag.innerHTML = isLocalHost ? `${hostSvg}${cleanName}` : cleanName;
        }

        // --- 3. SYNC OTHER PLAYERS ---
        const livePlayers = currentRoom.players_list || [];
        
        // Remove yourself from the list so you don't get duplicated!
        const otherPlayers = livePlayers.filter(p => String(p.id) !== String(currentUser.id));
        const livePlayersStr = JSON.stringify(otherPlayers);

        // Render only when someone joins or leaves to prevent flickering
        if (currentRenderedPlayers !== livePlayersStr) {
          currentRenderedPlayers = livePlayersStr;
          renderRealPlayers(otherPlayers);
        }
      }
    }
  } catch (err) {
    console.warn("Could not fetch live room members.", err);
  }
}

const avatarPositions = [
  "left-[30%] bottom-[18%] md:bottom-[19%] lg:bottom-[25%]",
  "left-[75%] bottom-[18%] md:bottom-[19%] lg:bottom-[27%]",
  "left-[40%] bottom-[24%] md:bottom-[25%] lg:bottom-[35%]",
  "left-[64%] bottom-[24%] md:bottom-[25%] lg:bottom-[35%]",
  "left-[50%] bottom-[30%] md:bottom-[31%] lg:bottom-[40%]",
  "left-[20%] bottom-[35%] md:bottom-[36%] lg:bottom-[45%]"
];

function renderRealPlayers(playerList) {
  const container = document.getElementById("mock-avatars-container");
  if (!container) return;

  container.innerHTML = ""; 

  playerList.forEach((player, index) => {
    const avatarWrapper = document.createElement("div");
    avatarWrapper.id = `room-player-${player.id || index}`;
    
    const posClass = avatarPositions[index % avatarPositions.length];
    avatarWrapper.className = `absolute w-[160px] h-[160px] scale-100 md:w-[200px] md:h-[200px] md:scale-125 lg:w-[240px] lg:h-[240px] lg:scale-150 -translate-x-1/2 origin-bottom pointer-events-auto cursor-pointer ${posClass}`;

    avatarWrapper.onclick = (e) => {
      e.stopPropagation();
      openRealPlayerModal(player);
    };

    let configObj = { 
      body: "BODY1", face: "FACE1", 
      tops: "TOP1", bottoms: "BOTTOM1", 
      shoes: "", hair: "", accessories: "" 
    };

    try {
      if (player.avatar_url) {
        let parsed = player.avatar_url;
        while (typeof parsed === 'string') { parsed = JSON.parse(parsed); }
        if (typeof parsed === 'object' && parsed !== null) { configObj = { ...configObj, ...parsed }; }
      }
    } catch (e) { console.error("Error parsing avatar config", e); }

    const configString = JSON.stringify(configObj).replace(/"/g, '&quot;');
    const displayName = player.username || player.name || "STUDENT";

    // SVG for the Home Icon for OTHER players
    const isHost = activeRoomData && String(player.id) === String(activeRoomData.host_id);
    const hostIcon = isHost 
      ? `<svg class="w-2.5 h-2.5 inline-block mr-1 text-[#FFFFFF] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L4 9v12h5v-7h6v7h5V9z"/></svg>` 
      : "";

    avatarWrapper.innerHTML = `
      <div class="absolute top-6 sm:top-2 left-1/2 -translate-x-1/2 bg-[#000000]/20 px-1.5 sm:px-3 py-0.5 sm:py-1 whitespace-nowrap shadow-md pointer-events-none flex items-center justify-center rounded-md">
        <span class="font-pressstart text-[6px] sm:text-[8px] text-[#FFFFFF] leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] flex items-center">
          ${hostIcon}${displayName}
        </span>
      </div>
      <custom-avatar config="${configString}" state="idle" class="pointer-events-none"></custom-avatar>
    `;

    container.appendChild(avatarWrapper);
  });
}
// ==========================================
// RENDER PLAYERS & HOST ICON LOGIC
// ==========================================

function renderRealPlayers(playerList) {
  const container = document.getElementById("mock-avatars-container");
  if (!container) return;

  container.innerHTML = ""; 

  playerList.forEach((player, index) => {
    const avatarWrapper = document.createElement("div");
    avatarWrapper.id = `room-player-${player.id || index}`;
    
    const posClass = avatarPositions[index % avatarPositions.length];
    avatarWrapper.className = `absolute w-[160px] h-[160px] scale-100 md:w-[200px] md:h-[200px] md:scale-125 lg:w-[240px] lg:h-[240px] lg:scale-150 -translate-x-1/2 origin-bottom pointer-events-auto cursor-pointer ${posClass}`;

    avatarWrapper.onclick = (e) => {
      e.stopPropagation();
      openRealPlayerModal(player);
    };

    // Standardized default to perfectly match the local view (No randomization)
    let configObj = { 
      body: "BODY1", face: "FACE1", 
      tops: "TOP1", bottoms: "BOTTOM1", 
      shoes: "", hair: "", accessories: "" 
    };

    try {
      if (player.avatar_url) {
        let parsed = player.avatar_url;
        while (typeof parsed === 'string') { parsed = JSON.parse(parsed); }
        if (typeof parsed === 'object' && parsed !== null) { configObj = { ...configObj, ...parsed }; }
      }
    } catch (e) { console.error("Error parsing avatar config", e); }

    const configString = JSON.stringify(configObj).replace(/"/g, '&quot;');
    const displayName = player.username || player.name || "STUDENT";

    // Check if this specific player is the host of the room
    const isHost = activeRoomData && String(player.id) === String(activeRoomData.host_id);
    
    // SVG for the Home Icon (Only shows up if the player is the host)
    const hostIcon = isHost 
      ? `<svg class="w-2.5 h-2.5 inline-block mr-1 text-[#FFFFFF] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L4 9v12h5v-7h6v7h5V9z"/></svg>` 
      : "";

    avatarWrapper.innerHTML = `
      <div class="absolute top-6 sm:top-2 left-1/2 -translate-x-1/2 bg-[#000000]/20 px-1.5 sm:px-3 py-0.5 sm:py-1 whitespace-nowrap shadow-md pointer-events-none flex items-center justify-center rounded-md">
        <span class="font-pressstart text-[6px] sm:text-[8px] text-[#FFFFFF] leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] flex items-center">
          ${hostIcon}${displayName}
        </span>
      </div>
      <custom-avatar config="${configString}" state="idle" class="pointer-events-none"></custom-avatar>
    `;

    container.appendChild(avatarWrapper);
  });
}

// ==========================================
// REAL PLAYER MODAL & KICK LOGIC
// ==========================================

let selectedRealPlayerId = null;

function openRealPlayerModal(player) {
  selectedRealPlayerId = player.id;
  
  const modalName = document.getElementById("mock-modal-player-name");
  const modalLevel = document.getElementById("mock-modal-player-level");
  const modalXpText = document.getElementById("mock-modal-xp-text");
  const modalXpBar = document.getElementById("mock-modal-xp-bar-fill");
  
  if (modalName) modalName.textContent = player.username || player.name || "STUDENT";
  if (modalLevel) modalLevel.textContent = player.level || 1;

  const xp = player.xp || 0;
  const maxXp = 10000;
  const xpPercent = Math.min(Math.max((xp / maxXp) * 100, 0), 100);
  
  if (modalXpText) modalXpText.textContent = `${xp.toLocaleString()} / ${maxXp.toLocaleString()} XP`;
  if (modalXpBar) modalXpBar.style.width = `${xpPercent}%`;

  // --- KICK BUTTON HOST CHECK ---
  // Targets the specific ID of the kick button in your new HTML modal structure
  const kickBtn = document.getElementById("modal-kick-btn");

  if (kickBtn && activeRoomData && currentUser.id) {
    const isHost = String(activeRoomData.host_id) === String(currentUser.id);
    const isSelf = String(player.id) === String(currentUser.id);
    
    // Only show the kick button if the Host is viewing AND not clicking on themselves
    if (isHost && !isSelf) {
      kickBtn.classList.remove("hidden");
      kickBtn.onclick = () => kickRealPlayer(player.id);
    } else {
      kickBtn.classList.add("hidden");
    }
  }

  openModal("mock-player-modal");
}

function kickRealPlayer(playerId) {
  if (!playerId) return;
  const playerElem = document.getElementById(`room-player-${playerId}`);
  if (playerElem) {
    playerElem.remove();
  }
  closeModal("mock-player-modal");
  selectedRealPlayerId = null;
}

// Load process on startup
document.addEventListener("DOMContentLoaded", async () => {
  await fetchCurrentUser(); // Step 1: Get the correct User ID
  fetchAndRenderRoomData(); // Step 2: Load Room info without including yourself
  
  setInterval(fetchAndRenderRoomData, 3000); // Poll every 3 seconds
});