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
    dateCreated: "Oct 12, 2026",
    progressPercent: 75,
    visibility: "private",
    technique: "Pomodoro",
    checklist: [
      { title: "Limits & Continuity Review", status: "complete" },
      { title: "Integration by Parts Drills", status: "complete" },
      { title: "Differential Equations Worksheet", status: "complete" },
      { title: "Practice Exam Questions", status: "inprogress" }
    ]
  },
  {
    id: "RM-102",
    name: "Web Dev & Tailwind Showcase",
    topic: "Frontend Engineering",
    host: "Sarah_Code",
    players: 2,
    maxPlayers: 6,
    dateCreated: "Nov 03, 2026",
    progressPercent: 40,
    visibility: "public",
    technique: "52-17",
    checklist: [
      { title: "Setup Tailwind Config", status: "complete" },
      { title: "Build Responsive Cards", status: "complete" },
      { title: "Integrate Modal Popups", status: "inprogress" },
      { title: "Deploy to Vercel", status: "inprogress" },
      { title: "Lighthouse Audit", status: "inprogress" }
    ]
  },
  {
    id: "RM-103",
    name: "Biology Midterm Prep",
    topic: "Cellular Structures & DNA",
    host: "BioMaster99",
    players: 6,
    maxPlayers: 6,
    dateCreated: "Dec 18, 2026",
    progressPercent: 100,
    visibility: "private",
    technique: "90-deep",
    checklist: [
      { title: "Cellular Respiration Diagram", status: "complete" },
      { title: "DNA Replication Steps", status: "complete" }
    ]
  },
  {
    id: "RM-104",
    name: "Quiet Focus Pomodoro",
    topic: "General Study & Homework",
    host: "ZenStudent",
    players: 1,
    maxPlayers: 6,
    dateCreated: "Jan 05, 2026",
    progressPercent: 20,
    visibility: "public",
    technique: "Pomodoro",
    checklist: [
      { title: "Read Chapter 4", status: "complete" },
      { title: "Summarize Key Terms", status: "inprogress" },
      { title: "Essay Outline", status: "inprogress" },
      { title: "Final Proofread", status: "inprogress" },
      { title: "Submit Assignment", status: "inprogress" }
    ]
  },
  {
    id: "RM-105",
    name: "Data Structures Sprints",
    topic: "Binary Trees & Graph Algorithms",
    host: "AlgoGuru",
    players: 5,
    maxPlayers: 6,
    dateCreated: "Feb 14, 2026",
    progressPercent: 85,
    visibility: "private",
    technique: "Pomodoro",
    checklist: [
      { title: "Tree Traversals (DFS/BFS)", status: "complete" },
      { title: "Dijkstra Algorithm Implementation", status: "complete" },
      { title: "LeetCode Graph Problems", status: "complete" },
      { title: "Time Complexity Analysis", status: "inprogress" }
    ]
  }
];

let activeRoomId = null;

/**
 * Retrieves all combined rooms (User created from localStorage + Mock Data)
 */
function getAllRooms() {
  const userRooms = JSON.parse(localStorage.getItem("userCreatedRooms") || "[]");
  return [...userRooms, ...mockRoomsData];
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
        <p class="font-pressstart text-[10px] sm:text-[12px] text-[#3D2013]">NO ROOMS FOUND MATCHING YOUR SEARCH.</p>
      </div>
    `;
    return;
  }

  rooms.forEach((room) => {
    // Dynamically calculate progress percent based on checklist items if present
    let calculatedPercent = room.progressPercent || 0;
    if (room.checklist && room.checklist.length > 0) {
      const completedCount = room.checklist.filter(c => c.status === "complete").length;
      calculatedPercent = Math.round((completedCount / room.checklist.length) * 100);
    }

    const cardHTML = `
      <div class="bg-[#FEF4E0] border-[2.5px] border-[#3D2013] rounded-none p-3.5 flex flex-col justify-between gap-2.5 shadow-md transition-transform duration-150">
        
        <!-- TOP SECTION: NAME & TOPIC -->
        <div class="flex flex-col gap-0.5">
          <h2 class="font-pressstart text-[10px] sm:text-[11px] text-[#3D2013] truncate leading-tight" title="${room.name}">
            ${room.name}
          </h2>
          <p class="font-pressstart text-[8px] sm:text-[8.5px] text-[#3D2013]/70 truncate">
            ${room.topic}
          </p>
        </div>

        <!-- META ROW: PLAYER COUNT + DOT SEPARATOR + DATE CREATED -->
        <div class="flex items-center gap-1 text-[#FD923E] font-pressstart text-[8px] sm:text-[8.5px]">
          <div class="flex items-center gap-1">
            <span>${room.players}</span>
            <svg class="w-3 h-3 text-[#583889]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          
          <!-- DOT SEPARATOR -->
          <span class="text-[10px] text-[#FD923E] leading-none">•</span>
          
          <span>${room.dateCreated}</span>
        </div>

        <!-- RIGHT-ALIGNED PROGRESS BAR & PERCENT -->
        <div class="flex flex-col items-end gap-1 w-full shrink-0">
          <div class="w-full bg-[#FEF4E0] border-[2px] border-[#3D2013] h-3 relative overflow-hidden">
            <div class="bg-[#788D55] h-full transition-all duration-300" style="width: ${calculatedPercent}%;"></div>
          </div>
          <span class="font-pressstart text-[7.5px] sm:text-[8px] text-[#3D2013] leading-none">
            ${calculatedPercent}% COMPLETE
          </span>
        </div>

        <!-- BUTTONS ROW -->
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

/**
 * Action Handlers
 */
function enterRoom(roomId) {
  alert(`Entering Room ID: ${roomId}`);
}

/**
 * Views Room Details Modal
 */
function viewRoomDetails(roomId) {
  const allRooms = getAllRooms();
  const room = allRooms.find(r => r.id === roomId);
  if (!room) return;

  activeRoomId = roomId;

  // Set Modal Header & Meta Details
  document.getElementById("modal-room-name").textContent = room.name;
  document.getElementById("modal-room-topic").textContent = room.topic;
  document.getElementById("modal-room-date").textContent = room.dateCreated;
  
  const playerText = room.players === 1 ? "1 player" : `${room.players} players`;
  document.getElementById("modal-room-players-allowed").textContent = playerText;

  const privacyEl = document.getElementById("modal-room-privacy");
  if (privacyEl) privacyEl.textContent = room.visibility;

  const techEl = document.getElementById("modal-study-technique");
  if (techEl) techEl.textContent = room.technique || "Pomodoro";

  // Calculate dynamic progress percent based on checklist completion
  let calculatedPercent = room.progressPercent || 0;
  if (room.checklist && room.checklist.length > 0) {
    const completedCount = room.checklist.filter(c => c.status === "complete").length;
    calculatedPercent = Math.round((completedCount / room.checklist.length) * 100);
  }

  document.getElementById("modal-progress-percent").textContent = `${calculatedPercent}%`;
  document.getElementById("modal-progress-bar").style.width = `${calculatedPercent}%`;

  // Render Checklist
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

  // Optional Custom Room Preview Render
  const modalPreviewContainer = document.getElementById("modal-room-preview");
  if (modalPreviewContainer && room.roomConfig) {
    modalPreviewContainer.innerHTML = `<custom-room config='${JSON.stringify(room.roomConfig)}'></custom-room>`;
  }

  // Show Details Modal
  document.getElementById("room-details-modal")?.classList.remove("hidden");
}

function closeDetailsModal() {
  document.getElementById("room-details-modal")?.classList.add("hidden");
}

/**
 * Share Sub-Modal Handlers
 */
function openShareModal() {
  const allRooms = getAllRooms();
  const room = allRooms.find(r => r.id === activeRoomId);
  if (!room) return;

  // Set current room data into share input and dropdowns
  const linkInput = document.getElementById("share-link-input");
  const visSelect = document.getElementById("share-visibility-select");
  const memSelect = document.getElementById("share-members-select");

  if (linkInput) linkInput.value = `studycircle.app/join/${room.id}`;
  if (visSelect) visSelect.value = room.visibility;
  if (memSelect) memSelect.value = room.maxPlayers.toString();

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
  const userRooms = JSON.parse(localStorage.getItem("userCreatedRooms") || "[]");
  const userRoomIndex = userRooms.findIndex(r => r.id === activeRoomId);

  const visSelect = document.getElementById("share-visibility-select");
  const memSelect = document.getElementById("share-members-select");

  if (userRoomIndex !== -1) {
    // Save to user Created Rooms in localStorage
    if (visSelect) userRooms[userRoomIndex].visibility = visSelect.value;
    if (memSelect) userRooms[userRoomIndex].maxPlayers = parseInt(memSelect.value, 10);
    localStorage.setItem("userCreatedRooms", JSON.stringify(userRooms));
  } else {
    // Save to Mock Room directly
    const mockRoom = mockRoomsData.find(r => r.id === activeRoomId);
    if (mockRoom) {
      if (visSelect) mockRoom.visibility = visSelect.value;
      if (memSelect) mockRoom.maxPlayers = parseInt(memSelect.value, 10);
    }
  }

  // Refresh active Details Modal UI and catalog view
  viewRoomDetails(activeRoomId);
  renderRoomCards(getAllRooms());

  closeShareModal();
}

/**
 * Initial Event Bindings on DOM Content Loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  // Render initial catalog combining local stored user rooms and mock data
  renderRoomCards(getAllRooms());

  // Setup search input filter listener
  const searchInput = document.getElementById("room-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      filterRooms(e.target.value);
    });
  }
});