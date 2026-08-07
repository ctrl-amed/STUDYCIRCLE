let activeRoomId = null;

/**
 * Retrieves rooms created by the user OR rooms the user has joined
 */
function getAllRooms() {
  const userRooms = JSON.parse(sessionStorage.getItem("userCreatedRooms") || "[]");
  const joinedRooms = JSON.parse(sessionStorage.getItem("userJoinedRooms") || "[]");
  
  // Combine and remove any potential duplicate rooms by ID
  const combinedRooms = [...userRooms, ...joinedRooms];
  const uniqueRooms = Array.from(new Map(combinedRooms.map(room => [room.id, room])).values());
  
  return uniqueRooms;
}

/**
 * Render Room Cards dynamically into the DOM container
 */
function renderRoomCards(rooms) {
  const container = document.getElementById("room-list-container");
  if (!container) return;

  container.innerHTML = ""; // Clear existing contents

  if (!rooms || rooms.length === 0) {
    container.innerHTML = `
      <div class="col-span-full bg-[#FEF4E0] border-[3px] border-[#3D2013] rounded-none p-6 text-center shadow-md">
        <p class="font-pressstart text-[10px] sm:text-[12px] text-[#3D2013]">NO ROOMS FOUND. CREATE OR JOIN ONE TO GET STARTED!</p>
      </div>
    `;
    return;
  }

  rooms.forEach((room) => {
    let calculatedPercent = room.progressPercent || 0;
    if (room.checklist && room.checklist.length > 0) {
      const completedCount = room.checklist.filter(c => c.status === "complete").length;
      calculatedPercent = Math.round((completedCount / room.checklist.length) * 100);
    }

    const cardHTML = `
      <div class="bg-[#FEF4E0] border-[2.5px] border-[#3D2013] rounded-none p-3.5 flex flex-col justify-between gap-2.5 shadow-md transition-transform duration-150">
        
        <div class="flex flex-col gap-0.5">
          <h2 class="font-pressstart text-[10px] sm:text-[11px] text-[#3D2013] truncate leading-tight" title="${room.name}">
            ${room.name}
          </h2>
          <p class="font-pressstart text-[8px] sm:text-[8.5px] text-[#3D2013]/70 truncate">
            ${room.topic}
          </p>
        </div>

        <div class="flex items-center gap-1 text-[#FD923E] font-pressstart text-[8px] sm:text-[8.5px]">
          <div class="flex items-center gap-1">
            <span>${room.players || 1}</span>
            <svg class="w-3 h-3 text-[#583889]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <span class="text-[10px] text-[#FD923E] leading-none">•</span>
          <span>${room.dateCreated || "Recent"}</span>
        </div>

        <div class="flex flex-col items-end gap-1 w-full shrink-0">
          <div class="w-full bg-[#FEF4E0] border-[2px] border-[#3D2013] h-3 relative overflow-hidden">
            <div class="bg-[#788D55] h-full transition-all duration-300" style="width: ${calculatedPercent}%;"></div>
          </div>
          <span class="font-pressstart text-[7.5px] sm:text-[8px] text-[#3D2013] leading-none">
            ${calculatedPercent}% COMPLETE
          </span>
        </div>

        <div class="flex items-center gap-2 pt-0.5">
          <button onclick="enterRoom('${room.id}')" 
                  class="flex-[2] font-pressstart text-[8px] sm:text-[9px] text-[#3D2013] bg-[#FD923E] border-[2px] border-[#3D2013] !rounded-none py-1.5 px-2 text-center transition-all duration-150 cursor-pointer retro-shadow hover:brightness-105 active:scale-95">
            ENTER
          </button>
          
          <button onclick="viewRoomDetails('${room.id}')" 
                  class="flex-1 font-pressstart text-[8px] sm:text-[9px] text-[#3D2013] bg-[#FEF4E0] border-[2px] border-[#3D2013] !rounded-none py-1.5 px-2 text-center transition-all duration-150 cursor-pointer retro-shadow hover:bg-[#F8E9D2] active:scale-95">
            DETAILS
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
  const allRooms = getAllRooms();
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
  // Find the selected room from active storage or mock lists if available
  const allRooms = getAllRooms();
  const roomToJoin = allRooms.find(r => r.id === roomId);

  if (roomToJoin) {
    const joinedRooms = JSON.parse(sessionStorage.getItem("userJoinedRooms") || "[]");
    
    // Prevent duplicate entries in userJoinedRooms
    if (!joinedRooms.some(r => r.id === roomToJoin.id)) {
      joinedRooms.push(roomToJoin);
      sessionStorage.setItem("userJoinedRooms", JSON.stringify(joinedRooms));
    }
  }

  alert(`Entering Room ID: ${roomId}`);
}

function viewRoomDetails(roomId) {
  const allRooms = getAllRooms();
  const room = allRooms.find(r => r.id === roomId);
  if (!room) return;

  activeRoomId = roomId;

  document.getElementById("modal-room-name").textContent = room.name;
  document.getElementById("modal-room-topic").textContent = room.topic;
  document.getElementById("modal-room-date").textContent = room.dateCreated || "Recent";
  
  const playerText = room.players === 1 ? "1 player" : `${room.players || 1} players`;
  document.getElementById("modal-room-players-allowed").textContent = playerText;

  const privacyEl = document.getElementById("modal-room-privacy");
  if (privacyEl) privacyEl.textContent = room.visibility || "public";

  const techEl = document.getElementById("modal-study-technique");
  if (techEl) techEl.textContent = room.technique || "Pomodoro";

  let calculatedPercent = room.progressPercent || 0;
  if (room.checklist && room.checklist.length > 0) {
    const completedCount = room.checklist.filter(c => c.status === "complete").length;
    calculatedPercent = Math.round((completedCount / room.checklist.length) * 100);
  }

  document.getElementById("modal-progress-percent").textContent = `${calculatedPercent}%`;
  document.getElementById("modal-progress-bar").style.width = `${calculatedPercent}%`;

  const checklistContainer = document.getElementById("modal-checklist-container");
  if (checklistContainer) {
    if (!room.checklist || room.checklist.length === 0) {
      checklistContainer.innerHTML = `<p class="font-pressstart text-[8px] text-[#3D2013]/60 italic">No checklist items available.</p>`;
    } else {
      checklistContainer.innerHTML = room.checklist.map(item => {
        const isComplete = item.status === "complete";
        const statusText = isComplete ? "complete" : "inprogress";
        const statusTextColor = isComplete ? "text-[#788D55]" : "text-[#FD923E]";

        return `
          <div class="flex items-center justify-between py-2 border-b-[1.5px] border-[#3D2013]/30 last:border-b-0 w-full">
            <span class="font-pressstart text-[8px] sm:text-[8.5px] text-[#3D2013] truncate max-w-[200px] sm:max-w-[280px]">
              ${item.title}
            </span>
            <span class="font-pressstart text-[7px] sm:text-[8px] uppercase shrink-0 ${statusTextColor}">
              ${statusText}
            </span>
          </div>
        `;
      }).join('');
    }
  }

  document.getElementById("room-details-modal")?.classList.remove("hidden");
}

function closeDetailsModal() {
  document.getElementById("room-details-modal")?.classList.add("hidden");
}

function openShareModal() {
  const allRooms = getAllRooms();
  const room = allRooms.find(r => r.id === activeRoomId);
  if (!room) return;

  const linkInput = document.getElementById("share-link-input");
  const visSelect = document.getElementById("share-visibility-select");
  const memSelect = document.getElementById("share-members-select");

  if (linkInput) linkInput.value = `studycircle.app/join/${room.id}`;
  if (visSelect) visSelect.value = room.visibility || "public";
  if (memSelect) memSelect.value = (room.maxPlayers || 4).toString();

  document.getElementById("share-room-modal")?.classList.remove("hidden");
}

function closeShareModal() {
  document.getElementById("share-room-modal")?.classList.add("hidden");
}

function copyShareLink() {
  const shareInput = document.getElementById("share-link-input");
  if (!shareInput) return;

  navigator.clipboard.writeText(shareInput.value).then(() => {
    alert("Share link copied to clipboard!");
  });
}

function saveRoomSettings() {
  const userRooms = JSON.parse(sessionStorage.getItem("userCreatedRooms") || "[]");
  const userRoomIndex = userRooms.findIndex(r => r.id === activeRoomId);

  const visSelect = document.getElementById("share-visibility-select");
  const memSelect = document.getElementById("share-members-select");

  if (userRoomIndex !== -1) {
    if (visSelect) userRooms[userRoomIndex].visibility = visSelect.value;
    if (memSelect) userRooms[userRoomIndex].maxPlayers = parseInt(memSelect.value, 10);
    sessionStorage.setItem("userCreatedRooms", JSON.stringify(userRooms));
  }

  viewRoomDetails(activeRoomId);
  renderRoomCards(getAllRooms());
  closeShareModal();
}

document.addEventListener("DOMContentLoaded", () => {
  renderRoomCards(getAllRooms());

  const searchInput = document.getElementById("room-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      filterRooms(e.target.value);
    });
  }
});