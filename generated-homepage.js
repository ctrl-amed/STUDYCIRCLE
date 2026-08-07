// ==========================================
// AVATAR OVERLAY MODAL LOGIC
// ==========================================
function openAvatarModal(event) {
  if (event) event.preventDefault();

  const iframe = document.getElementById("avatar-frame");
  
  // Lazy-load iframe source on first open
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
  
  // Lazy-load iframe source on first open
  if (iframe && iframe.src !== window.location.origin + "/customroom.html") {
    iframe.src = "customroom.html";
  }
  
  openModal("furniture-modal");
}

function closeFurnitureModal() {
  closeModal("furniture-modal");
}

// ==========================================
// MOCK ROOM DATA LOGIC
// ==========================================
const mockRoomData = {
  roomName: "Cozy Study Nook",
  roomCode: "STUDY-8291"
};

function loadRoomInfo() {
  const roomNameElem = document.getElementById("nav-room-name");
  const roomCodeElem = document.getElementById("nav-room-code");

  // Retrieve user-created rooms saved during room creation
  const userRooms = JSON.parse(sessionStorage.getItem("userCreatedRooms") || "[]");

  if (userRooms.length > 0) {
    const activeRoom = userRooms[0]; // Most recently created room

    if (roomNameElem) {
      roomNameElem.textContent = activeRoom.name || "Cozy Study Nook";
    }
    if (roomCodeElem) {
      roomCodeElem.textContent = activeRoom.id || "STUDY-8291";
    }
  } else {
    // Fallback if no local room is found
    if (roomNameElem) roomNameElem.textContent = mockRoomData.roomName;
    if (roomCodeElem) roomCodeElem.textContent = mockRoomData.roomCode;
  }
}

// Populate the room details when DOM content loads
document.addEventListener("DOMContentLoaded", () => {
  loadRoomInfo();
});

// ==========================================
// MOCK MULTIPLAYER AVATAR SYSTEM
// ==========================================

// Predefined mock player profiles with unique names, positions, custom asset configurations, level, and XP
const mockPlayerList = [
  { 
    id: 1, 
    name: "PIXEL_SAM", 
    level: 5,
    xp: 4200,
    positionClass: "left-[30%] bottom-[18%] md:bottom-[19%] lg:bottom-[25%]",
    config: {
      body: "BODY1",
      face: "FACE2",
      tops: "TOP3",
      bottoms: "BOTTOM2",
      shoes: "",
      hair: "HAIR1",
      accessories: ""
    }
  },
  { 
    id: 2, 
    name: "LOFI_LUNA", 
    level: 12,
    xp: 8750,
    positionClass: "left-[75%] bottom-[18%] md:bottom-[19%] lg:bottom-[27%]",
    config: {
      body: "BODY1",
      face: "FACE1",
      tops: "TOP5",
      bottoms: "BOTTOM4",
      shoes: "",
      hair: "HAIR3",
      accessories: ""
    }
  },
  { 
    id: 3, 
    name: "STUDY_BEAR", 
    level: 3,
    xp: 1500,
    positionClass: "left-[40%] bottom-[24%] md:bottom-[25%] lg:bottom-[35%]",
    config: {
      body: "BODY1",
      face: "FACE3",
      tops: "TOP1",
      bottoms: "BOTTOM1",
      shoes: "",
      hair: "",
      accessories: ""
    }
  },
  { 
    id: 4, 
    name: "COZY_CAT",  
    level: 8,
    xp: 6300,
    positionClass: "left-[64%] bottom-[24%] md:bottom-[25%] lg:bottom-[35%]",
    config: {
      body: "BODY1",
      face: "FACE4",
      tops: "TOP2",
      bottoms: "BOTTOM3",
      shoes: "",
      hair: "HAIR2",
      accessories: ""
    }
  },
  { 
    id: 5, 
    name: "NIGHT_OWL", 
    level: 15,
    xp: 9900,
    positionClass: "left-[50%] bottom-[30%] md:bottom-[31%] lg:bottom-[40%]",
    config: {
      body: "BODY1",
      face: "FACE1",
      tops: "TOP4",
      bottoms: "BOTTOM6",
      shoes: "",
      hair: "HAIR4",
      accessories: ""
    }
  }
];

/**
 * Renders or updates the number of additional mock players in the room.
 * @param {number} count - The number of extra players to show (1 to 5). Max room size is 6 including the local user.
 */
function setMockPlayerCount(count) {
  const container = document.getElementById("mock-avatars-container");
  if (!container) return;

  const clampedCount = Math.min(Math.max(parseInt(count, 10) || 0, 0), 5);
  container.innerHTML = "";

  for (let i = 0; i < clampedCount; i++) {
    const player = mockPlayerList[i];

    const avatarWrapper = document.createElement("div");
    avatarWrapper.id = `mock-player-${player.id}`;
    
    // Explicit pointer-events-auto is attached directly to this div
    avatarWrapper.className = `absolute w-[160px] h-[160px] scale-100 md:w-[200px] md:h-[200px] md:scale-125 lg:w-[240px] lg:h-[240px] lg:scale-150 -translate-x-1/2 origin-bottom pointer-events-auto cursor-pointer ${player.positionClass}`;

    avatarWrapper.onclick = (e) => {
      e.stopPropagation();
      openMockPlayerModal(player.id);
    };

    const configString = JSON.stringify(player.config).replace(/"/g, '&quot;');

    avatarWrapper.innerHTML = `
      <!-- NAME TAG -->
      <div class="absolute top-6 sm:top-2 left-1/2 -translate-x-1/2 bg-[#000000]/20 px-1.5 sm:px-3 py-0.5 sm:py-1 whitespace-nowrap shadow-md pointer-events-none flex items-center justify-center">
        <span class="font-pressstart text-[6px] sm:text-[8px] text-[#FFFFFF] leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          ${player.name}
        </span>
      </div>
      <custom-avatar config="${configString}" state="idle" class="pointer-events-none"></custom-avatar>
    `;

    container.appendChild(avatarWrapper);
  }
}

/**
 * Dynamically updates the avatar assets of a specific mock player.
 * @param {number} playerId - The ID of the mock player (1 to 5).
 * @param {Object} newConfig - Partial or full configuration object with new asset keys.
 * 
 * Example usage:
 * updateMockPlayerAsset(1, { tops: "TOP2", hair: "HAIR5" });
 */
function updateMockPlayerAsset(playerId, newConfig) {
  const player = mockPlayerList.find(p => p.id === playerId);
  if (!player) return;

  // Merge new configuration with existing configuration
  player.config = { ...player.config, ...newConfig };

  // Update DOM element if rendered
  const playerWrapper = document.getElementById(`mock-player-${playerId}`);
  if (playerWrapper) {
    const avatarElem = playerWrapper.querySelector("custom-avatar");
    if (avatarElem) {
      avatarElem.setAttribute("config", JSON.stringify(player.config));
    }
  }
}

// Initialize room details and dynamic player count on DOM load
document.addEventListener("DOMContentLoaded", () => {
  loadRoomInfo();

  // 1. Retrieve created rooms list or active room configuration
  const userRooms = JSON.parse(sessionStorage.getItem("userCreatedRooms") || "[]");

  // 2. Determine player count from latest created room or fall back to default
  let extraPlayersCount = 4; // Default fallback count

  if (userRooms.length > 0) {
    const activeRoom = userRooms[0]; // Gets the most recently created room
    
    // Total players selected (e.g., 5) minus 1 (for the host/local user)
    // Ensures count stays within valid limits for setMockPlayerCount (0 to 5)
    if (activeRoom.players !== undefined) {
      extraPlayersCount = Math.max(0, activeRoom.players - 1);
    }
  }

  // 3. Render exact amount of mock avatars
  setMockPlayerCount(extraPlayersCount);
});

// Currently active mock player in the modal
let selectedMockPlayerId = null;

/**
 * Opens the profile modal for a clicked mock player.
 * @param {number} playerId 
 */
function openMockPlayerModal(playerId) {
  const player = mockPlayerList.find(p => p.id === playerId);
  if (!player) return;

  selectedMockPlayerId = playerId;

  // Set Modal Elements
  const modalName = document.getElementById("mock-modal-player-name");
  const modalLevel = document.getElementById("mock-modal-player-level");
  const modalXpText = document.getElementById("mock-modal-xp-text");
  const modalXpBar = document.getElementById("mock-modal-xp-bar-fill");

  if (modalName) modalName.textContent = player.name;
  if (modalLevel) modalLevel.textContent = player.level;
  
  // Format XP progress
  const maxXp = 10000;
  const xpPercent = Math.min(Math.max((player.xp / maxXp) * 100, 0), 100);
  
  if (modalXpText) modalXpText.textContent = `${player.xp.toLocaleString()} / ${maxXp.toLocaleString()} XP`;
  if (modalXpBar) modalXpBar.style.width = `${xpPercent}%`;

  openModal("mock-player-modal");
}

/**
 * Kicks the selected mock player from the room.
 */
function kickMockPlayer() {
  if (selectedMockPlayerId === null) return;

  // Remove element from DOM
  const playerElem = document.getElementById(`mock-player-${selectedMockPlayerId}`);
  if (playerElem) {
    playerElem.remove();
  }

  // Close modal and reset active ID
  closeModal("mock-player-modal");
  selectedMockPlayerId = null;
}

/**
 * Renders or updates the number of additional mock players in the room.
 * @param {number} count - The number of extra players to show (1 to 5).
 */
function setMockPlayerCount(count) {
  const container = document.getElementById("mock-avatars-container");
  if (!container) return;

  const clampedCount = Math.min(Math.max(parseInt(count, 10) || 0, 0), 5);
  container.innerHTML = "";

  for (let i = 0; i < clampedCount; i++) {
    const player = mockPlayerList[i];

    const avatarWrapper = document.createElement("div");
    avatarWrapper.id = `mock-player-${player.id}`;
    avatarWrapper.className = `absolute w-[160px] h-[160px] scale-100 md:w-[200px] md:h-[200px] md:scale-125 lg:w-[240px] lg:h-[240px] lg:scale-150 -translate-x-1/2 origin-bottom pointer-events-auto cursor-pointer ${player.positionClass}`;

    // Add click event to open profile modal
    avatarWrapper.onclick = (e) => {
      e.stopPropagation();
      openMockPlayerModal(player.id);
    };

    const configString = JSON.stringify(player.config).replace(/"/g, '&quot;');

    avatarWrapper.innerHTML = `
      <!-- NAME TAG -->
      <div class="absolute top-6 sm:top-2 left-1/2 -translate-x-1/2 bg-[#000000]/20 px-1.5 sm:px-3 py-0.5 sm:py-1 whitespace-nowrap shadow-md pointer-events-none flex items-center justify-center">
        <span class="font-pressstart text-[6px] sm:text-[8px] text-[#FFFFFF] leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          ${player.name}
        </span>
      </div>
      <custom-avatar config="${configString}" state="idle"></custom-avatar>
    `;

    container.appendChild(avatarWrapper);
  }
}