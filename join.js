/**
 * Dynamic Rooms Loader from Backend API
 */
let allRooms = [];
const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://127.0.0.1:5000"  // Local testing
  : "https://studycircle-kv4v.onrender.com"; // Online production

/**
 * Fetches rooms primarily from the backend API and filters out private or finished rooms
 */
async function fetchRooms() {
  let backendRooms = [];
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
      backendRooms = data.rooms || [];
    }
  } catch (err) {
    console.warn("Backend fetch failed for rooms.", err);
  }

  // Filter para lumabas lamang ang Public at Hangouts rooms na UNFINISHED (hindi pa tapos)
  allRooms = backendRooms.filter(room => {
    const visibility = room.visibility ? room.visibility.toLowerCase() : 'public';
    
    // Alamin ang room mode kung naka-hangouts man
    let roomMode = 'structured';
    if (room.roomConfig && room.roomConfig.roomMode) {
      roomMode = room.roomConfig.roomMode.toLowerCase();
    }
    
    // Calculate progress percentage para malaman kung tapos na ba
    let calculatedPercent = room.progressPercent || 0;
    if (room.checklist && room.checklist.length > 0) {
      let checklistArray = room.checklist;
      while (typeof checklistArray === 'string') {
        try { checklistArray = JSON.parse(checklistArray); } catch(e) { break; }
      }
      if (Array.isArray(checklistArray) && checklistArray.length > 0) {
        const completedCount = checklistArray.filter(c => c.status === "complete" || c.completed === true || c.status === "completed").length;
        calculatedPercent = Math.round((completedCount / checklistArray.length) * 100);
      }
    }

    // Siguraduhing hindi pa tapos (unfinished)
    const isFinished = calculatedPercent >= 100 || room.status === "finished";

    // Piliin lamang ang mga public o hangouts na hindi pa tapos
    const isPublicOrHangout = (visibility === 'public' || visibility === 'hangout' || roomMode === 'hangout');

    return isPublicOrHangout && !isFinished;
  });

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
        <p class="font-pressstart text-[10px] sm:text-[12px] text-[#3D2013]">NO UNFINISHED PUBLIC OR HANGOUT ROOMS FOUND.</p>
      </div>
    `;
    return;
  }

  rooms.forEach((room) => {
    const roomCodeParam = room.roomCode || room.room_code || room.id;
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
          <button onclick="enterRoom('${roomCodeParam}')" 
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

async function enterRoom(roomIdentifier) {
  let roomCode = roomIdentifier;
  if (typeof roomIdentifier === 'object' && roomIdentifier !== null) {
    roomCode = roomIdentifier.roomCode || roomIdentifier.room_code || roomIdentifier.id;
  }

  let targetPage = 'generated-homepage.html'; // Default para sa hangouts
  
  const foundRoom = allRooms.find(r => r.id == roomIdentifier || r.roomCode == roomIdentifier || r.room_code == roomIdentifier);
  if (foundRoom) {
    roomCode = foundRoom.roomCode || foundRoom.room_code;
    localStorage.setItem("currentActiveRoom", JSON.stringify(foundRoom));
    
    // I-check ang roomMode kung hangouts ba o structured
    let mode = 'hangout';
    if (foundRoom.roomConfig && foundRoom.roomConfig.roomMode) {
      mode = foundRoom.roomConfig.roomMode.toLowerCase();
    } else if (foundRoom.roomMode) {
      mode = foundRoom.roomMode.toLowerCase();
    }
    
    if (mode === 'structured') {
      targetPage = 'kitsuai.html';
    }
  }

  sessionStorage.setItem("activeRoomId", roomCode);
  startSimulatedLoad("Joining Room...", 1500, () => {
    window.location.href = `${targetPage}?code=${roomCode}`;
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
      errorText.classList.add("hidden");
    }
    return;
  }

  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/api/join-room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ inviteCode: roomCode })
    });

    if (response.ok) {
      const data = await response.json();
      const matchedRoom = data.room;
      
      closeJoinPrivateModal();
      const finalCode = matchedRoom.roomCode || matchedRoom.room_code || roomCode;
      
      localStorage.setItem("currentActiveRoom", JSON.stringify(matchedRoom));
      
      // I-check ang roomMode bago mag-redirect
      let targetPage = 'generated-homepage.html';
      let mode = 'hangout';
      if (matchedRoom.roomConfig && matchedRoom.roomConfig.roomMode) {
        mode = matchedRoom.roomConfig.roomMode.toLowerCase();
      } else if (matchedRoom.roomMode) {
        mode = matchedRoom.roomMode.toLowerCase();
      }
      
      if (mode === 'structured') {
        targetPage = 'kitsuai.html';
      }
      
      startSimulatedLoad("Joining Room...", 1500, () => {
        window.location.href = `${targetPage}?code=${finalCode}`;
      });
    } else {
      const errData = await response.json();
      if (errorText) {
        errorText.textContent = `◆ ${errData.message || 'INVALID ROOM CODE'} ◆`;
        errorText.classList.remove("hidden");
      }
    }
  } catch (err) {
    console.error("Error validating room code with backend:", err);
    if (errorText) {
      errorText.textContent = "◆ CONNECTION ERROR ◆";
      errorText.classList.remove("hidden");
    }
  }
}