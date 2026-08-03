/**
 * Mock Data Store for Study Rooms
 */
const mockRoomsData = [
  {
    id: "RM-101",
    name: "Late Night Math Grind",
    topic: "Calculus III & Differential Equations",
    host: "AlexR_Study",
    players: 4,
    maxPlayers: 6,
    technique: "pomodoro"
  },
  {
    id: "RM-102",
    name: "Web Dev & Tailwind Showcase",
    topic: "Frontend Engineering",
    host: "Sarah_Code",
    players: 2,
    maxPlayers: 6,
    technique: "52-17"
  },
  {
    id: "RM-103",
    name: "Biology Midterm Prep",
    topic: "Cellular Structures & DNA",
    host: "BioMaster99",
    players: 6,
    maxPlayers: 6,
    technique: "19-deep"
  },
  {
    id: "RM-104",
    name: "Quiet Focus Pomodoro",
    topic: "General Study & Homework",
    host: "ZenStudent",
    players: 1,
    maxPlayers: 6,
    technique: "pomodoro"
  },
  {
    id: "RM-105",
    name: "Data Structures Sprints",
    topic: "Binary Trees & Graph Algorithms",
    host: "AlgoGuru",
    players: 5,
    maxPlayers: 6,
    technique: "52-17"
  }
];

/**
 * Render Room Cards dynamically into the DOM container
 */
function renderRoomCards(rooms) {
  const container = document.getElementById("room-list-container");
  if (!container) return;

  container.innerHTML = ""; // Clear existing contents

  if (rooms.length === 0) {
    container.innerHTML = `
      <div class="col-span-full bg-[#FEF4E0] border-[3px] border-[#3D2013] rounded-none p-6 text-center shadow-md">
        <p class="font-pressstart text-[10px] sm:text-[12px] text-[#3D2013]">NO ROOMS FOUND MATCHING YOUR SEARCH.</p>
      </div>
    `;
    return;
  }

  rooms.forEach((room) => {
    const cardHTML = `
      <div class="bg-[#FEF4E0] border-[2.5px] border-[#3D2013] !rounded-none p-3.5 flex flex-col justify-between gap-3 shadow-md transition-transform duration-150">
        
        <!-- TOP SECTION: NAME, TOPIC & TECHNIQUE BADGE -->
        <div class="flex items-start justify-between gap-2">
          <div class="flex flex-col gap-0.5 min-w-0 flex-1">
            <h2 class="font-pressstart text-[10px] sm:text-[11px] text-[#3D2013] truncate leading-tight" title="${room.name}">
              ${room.name}
            </h2>
            <p class="font-pressstart text-[8px] sm:text-[8.5px] text-[#3D2013]/70 truncate">
              ${room.topic}
            </p>
          </div>

          <!-- UPPER-RIGHT TECHNIQUE BADGE -->
          <div class="bg-[#EEBB4A] border-[2px] border-[#3D2013] !rounded-none px-1.5 py-0.5 shrink-0">
            <span class="font-pressstart text-[7px] sm:text-[8px] text-[#3D2013] uppercase block leading-none">
              ${room.technique || 'pomodoro'}
            </span>
          </div>
        </div>

        <!-- META ROW: PLAYER RATIO + DOT SEPARATOR + OWNER/HOST WITH CROWN -->
        <div class="flex items-center gap-1.5 text-[#FD923E] font-pressstart text-[8px] sm:text-[8.5px]">
          <!-- Player Ratio -->
          <div class="flex items-center gap-1 shrink-0">
            <span>${room.players}/${room.maxPlayers}</span>
            <svg class="w-3 h-3 text-[#583889]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          
          <!-- Dot Separator -->
          <span class="text-[10px] text-[#FD923E] leading-none">•</span>
          
          <!-- Crown Icon + Owner Name -->
          <div class="flex items-center gap-1 min-w-0 truncate text-[#3D2013]">
            <!-- Crown SVG Icon -->
            <svg class="w-3 h-3 text-[#EEBB4A] shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
            </svg>
            <span class="truncate" title="${room.host}">${room.host}</span>
          </div>
        </div>

        <!-- ACTION BUTTON ROW (JOIN ROOM) -->
        <div class="pt-0.5">
          <button onclick="enterRoom('${room.id}')" 
                  class="w-full font-pressstart text-[8px] sm:text-[9px] text-[#3D2013] bg-[#FD923E] border-[2px] border-[#3D2013] !rounded-none py-2 px-2 text-center transition-all duration-150 cursor-pointer retro-shadow uppercase">
            JOIN ROOM
          </button>
        </div>

      </div>
    `;
    container.insertAdjacentHTML("beforeend", cardHTML);
  });
}

/**
 * Filter rooms based on query against name, topic, lobby code/ID, or host
 */
function filterRooms(query) {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) {
    renderRoomCards(mockRoomsData);
    return;
  }

  const filtered = mockRoomsData.filter((room) => {
    return (
      room.name.toLowerCase().includes(cleanQuery) ||
      room.topic.toLowerCase().includes(cleanQuery) ||
      room.id.toLowerCase().includes(cleanQuery) ||
      room.host.toLowerCase().includes(cleanQuery)
    );
  });

  renderRoomCards(filtered);
}

/**
 * Action Handlers
 */
function enterRoom(roomId) {
  // Trigger retro loading overlay then navigate to room
  startSimulatedLoad("Joining Room...", 2000, () => {
    window.location.href = `myroom.html?id=${roomId}`;
  });
}

/**
 * Initial Event Bindings on DOM Content Loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  // Render initial catalog
  renderRoomCards(mockRoomsData);

  // Setup search input filter listener
  const searchInput = document.getElementById("room-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      filterRooms(e.target.value);
    });
  }
});

/**
 * Join Private Modal Handlers
 */
function openJoinPrivateModal() {
  const modal = document.getElementById("join-private-modal");
  const input = document.getElementById("private-room-code-input");
  const errorText = document.getElementById("private-room-error");
  
  if (input) input.value = ""; // Clear previous input
  if (errorText) errorText.classList.add("hidden"); // Clear previous errors
  modal?.classList.remove("hidden");
}

function closeJoinPrivateModal() {
  document.getElementById("join-private-modal")?.classList.add("hidden");
}

function submitPrivateRoomCode() {
  const input = document.getElementById("private-room-code-input");
  const errorText = document.getElementById("private-room-error");
  const roomCode = input?.value.trim().toUpperCase();

  // Reset error state
  if (errorText) errorText.classList.add("hidden");

  if (!roomCode) {
    if (errorText) {
      errorText.textContent = "◆ PLEASE ENTER A CODE ◆";
      errorText.classList.remove("hidden");
    }
    return;
  }

  // Validate room code against mock store
  const roomExists = mockRoomsData.some(r => r.id.toUpperCase() === roomCode);

  if (!roomExists) {
    // Show invalid code error message below input
    if (errorText) {
      errorText.textContent = "◆ INVALID ROOM CODE ◆";
      errorText.classList.remove("hidden");
    }
    return;
  }

  // Hide Modal & Trigger Loading Overlay
  closeJoinPrivateModal();
  enterRoom(roomCode);
}