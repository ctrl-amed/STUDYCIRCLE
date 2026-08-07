/**
 * Dynamic Rooms Loader from Backend API with Local Storage Merging
 */
let allRooms = [];

/**
 * Fetches rooms from the backend API and merges them with local sessionStorage rooms
 */
async function fetchRooms() {
  let backendRooms = [];
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch("http://127.0.0.1:5000/api/rooms", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      backendRooms = data.rooms || [];
    }
  } catch (err) {
    console.warn("Backend fetch failed, relying on sessionStorage.", err);
  }

  // Always load user-created rooms from sessionStorage as well
  const localUserRooms = JSON.parse(sessionStorage.getItem("userCreatedRooms") || "[]");

  // Combine both sources and remove duplicates based on room id
  const combinedMap = new Map();
  [...localUserRooms, ...backendRooms].forEach(room => {
    if (room && room.id) {
      combinedMap.set(room.id.toUpperCase(), room);
    }
  });

  allRooms = Array.from(combinedMap.values());
  renderRoomCards(allRooms);
}

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
        <p class="font-pressstart text-[10px] sm:text-[12px] text-[#3D2013]">NO ROOMS FOUND.</p>
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
            <span>${room.players || 1}/${room.maxPlayers || 6}</span>
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
            <span class="truncate" title="${room.host}">${room.host || 'You'}</span>
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
    renderRoomCards(allRooms);
    return;
  }

  const filtered = allRooms.filter((room) => {
    return (
      (room.name && room.name.toLowerCase().includes(cleanQuery)) ||
      (room.topic && room.topic.toLowerCase().includes(cleanQuery)) ||
      (room.id && room.id.toLowerCase().includes(cleanQuery)) ||
      (room.host && room.host.toLowerCase().includes(cleanQuery))
    );
  });

  renderRoomCards(filtered);
}

function enterRoom(roomId) {
  sessionStorage.setItem("activeRoomId", roomId);
  startSimulatedLoad("Joining Room...", 2000, () => {
    window.location.href = `generated-homepage.html?room=${roomId}`;
  });
}

/**
 * Initial Event Bindings on DOM Content Loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  fetchRooms();

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
  
  if (input) input.value = ""; 
  if (errorText) errorText.classList.add("hidden"); 
  modal?.classList.remove("hidden");
}

function closeJoinPrivateModal() {
  document.getElementById("join-private-modal")?.classList.add("hidden");
}

async function submitPrivateRoomCode() {
  const input = document.getElementById("private-room-code-input");
  const errorText = document.getElementById("private-room-error");
  const roomCode = input?.value.trim().toUpperCase();

  if (errorText) errorText.classList.add("hidden");

  if (!roomCode) {
    if (errorText) {
      errorText.textContent = "◆ PLEASE ENTER A CODE ◆";
      errorText.classList.remove("hidden");
    }
    return;
  }

  // Refresh latest rooms pool right before checking
  const localUserRooms = JSON.parse(sessionStorage.getItem("userCreatedRooms") || "[]");
  const combinedMap = new Map();
  [...localUserRooms, ...allRooms].forEach(room => {
    if (room && room.id) {
      combinedMap.set(room.id.toUpperCase(), room);
    }
  });

  let matchedRoom = combinedMap.get(roomCode);

  // If still not found locally, check backend API endpoint
  if (!matchedRoom) {
    try {
      const token = sessionStorage.getItem("token");
      const currentUser = JSON.parse(sessionStorage.getItem("user_profile") || '{"id": "u1", "username": "You"}');
      
      const response = await fetch(`http://127.0.0.1:5000/api/join-room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ inviteCode: roomCode, user: currentUser })
      });

      if (response.ok) {
        const data = await response.json();
        matchedRoom = data.room;
      }
    } catch (err) {
      console.error("Error validating room code with backend:", err);
    }
  }

  if (!matchedRoom) {
    console.warn("Room code not found anywhere:", roomCode);
    if (errorText) {
      errorText.textContent = "◆ INVALID ROOM CODE ◆";
      errorText.classList.remove("hidden");
    }
    return;
  }

  closeJoinPrivateModal();
  enterRoom(matchedRoom.id || roomCode);
}