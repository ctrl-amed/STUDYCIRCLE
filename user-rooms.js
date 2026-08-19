document.addEventListener("DOMContentLoaded", () => {
  const myUsername = window.playerData ? window.playerData.username : "ACORN_HERO";

  // Mock Database for Rooms
  const mockRooms = {
    all: [
      { id: 1, name: "Cozy Coding Cave", host: "CodeWizard", privacy: "public", currentMembers: 4, maxMembers: 6, technique: "Pomodoro", focus: "2h 00m", breakTime: "0h 30m", sessions: 4, tasks: [{ text: "Setup repo", completed: true }, { text: "Write component API", completed: true }, { text: "Test routing", completed: false }, { text: "Deploy build", completed: false }], xp: 350, coins: 90 },
      { id: 2, name: "Quiet Calculus", host: "MathWhiz", privacy: "private", currentMembers: 2, maxMembers: 4, technique: "52-17", focus: "1h 45m", breakTime: "0h 17m", sessions: 3, tasks: [{ text: "Derivatives homework", completed: true }, { text: "Integration practice", completed: true }], xp: 300, coins: 75 },
      { id: 3, name: "Late Night Grind", host: myUsername, privacy: "public", currentMembers: 5, maxMembers: 6, technique: "Pomodoro", focus: "3h 10m", breakTime: "0h 50m", sessions: 6, tasks: [{ text: "Finish essay draft", completed: true }, { text: "Read chapter 4", completed: true }, { text: "Review notes", completed: true }], xp: 550, coins: 140 },
      { id: 4, name: "Design & Chill", host: "PixelArtist", privacy: "public", currentMembers: 3, maxMembers: 5, technique: "90m", focus: "3h 00m", breakTime: "1h 00m", sessions: 2, tasks: [{ text: "Wireframe UI", completed: true }, { text: "Select color palette", completed: false }], xp: 400, coins: 100 },
      { id: 5, name: "Language Masterclass", host: "LinguaFranc", privacy: "private", currentMembers: 1, maxMembers: 3, technique: "Pomodoro", focus: "1h 15m", breakTime: "0h 15m", sessions: 2, tasks: [{ text: "Kanji practice", completed: true }, { text: "Vocabulary review", completed: false }], xp: 200, coins: 50 }
    ],
    history: [
      { id: 101, name: "Morning Focus Hub", host: myUsername, privacy: "public", currentMembers: 3, maxMembers: 6, technique: "Pomodoro", focus: "2h 14m", breakTime: "0h 45m", sessions: 4, tasks: [{ text: "Morning emails", completed: true }, { text: "Task planning", completed: true }, { text: "Bug fixing", completed: true }, { text: "Code review", completed: true }, { text: "Sprint retrospective", completed: true }], xp: 450, coins: 120 },
      { id: 102, name: "Algorithm Dojo", host: "CodeWizard", privacy: "public", currentMembers: 6, maxMembers: 6, technique: "52-17", focus: "2h 35m", breakTime: "0h 34m", sessions: 5, tasks: [{ text: "Solve binary search", completed: true }, { text: "Graph algorithms", completed: true }, { text: "LeetCode daily", completed: false }], xp: 500, coins: 135 },
      { id: 103, name: "Thesis Writing Sanctuary", host: myUsername, privacy: "private", currentMembers: 1, maxMembers: 2, technique: "90m", focus: "4h 30m", breakTime: "1h 30m", sessions: 3, tasks: [{ text: "Literature review", completed: true }, { text: "Methodology section", completed: true }, { text: "References formatting", completed: true }], xp: 750, coins: 200 }
    ]
  };

  // Helper to render room cards
  function renderRoomCard(room, isHistoryTab = false) {
    const footerBtnText = isHistoryTab ? "STATISTICS" : "JOIN ROOM";
    const footerBtnClass = isHistoryTab ? "stat-btn bg-[#E87339] hover:bg-[#d66530] hover:text-white" : "join-room-action bg-[#E87339] hover:bg-[#d66530] hover:text-white";

    const isPublic = room.privacy.toLowerCase() === "public";
    
    const privacyStyles = isPublic 
      ? "border-[#315B8C] bg-[#EAF3FF] text-[#315B8C]" 
      : "border-[#6846A5] bg-[#F1EDFF] text-[#6846A5]";

    const privacyIcon = isPublic 
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" class="w-3 h-3 shrink-0"><path d="M0 0h24v24H0z" fill="none" /><path fill="currentColor" d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10s10-4.49 10-10S17.51 2 12 2M4 12c0-.9.16-1.76.43-2.57L6 11l2 2v2l2 2l1 1v1.93c-3.94-.49-7-3.86-7-7.93m14.33 4.87c-.65-.53-1.64-.87-2.33-.87v-1c0-1.1-.9-2-2-2h-4v-3c1.1 0 2-.9 2-2V7h1c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41c0 1.83-.63 3.52-1.67 4.87" /></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" class="w-3 h-3 shrink-0"><path d="M0 0h24v24H0z" fill="none" /><path fill="currentColor" d="M6 22q-.825 0-1.412-.587T4 20V10q0-.825.588-1.412T6 8h1V6q0-2.075 1.463-3.537T12 1t3.538 1.463T17 6v2h1q.825 0 1.413.588T20 10v10q0 .825-.587 1.413T18 22zm0-2h12V10H6zm7.413-3.588Q14 15.826 14 15t-.587-1.412T12 13t-1.412.588T10 15t.588 1.413T12 17t1.413-.587M9 8h6V6q0-1.25-.875-2.125T12 3t-2.125.875T9 6zM6 20V10z" /></svg>`;

    return `
      <div class="bg-[#FEF4E0] border-[2px] border-[#3D2013] rounded-[10px] p-4 flex flex-col gap-3 shadow-sm justify-between">
        <div class="flex items-start gap-3">
          <!-- Left Column: PFP Avatar -->
          <div class="w-10 h-10 rounded-full border-[2px] border-[#3D2013] bg-[#FAE9CE] shrink-0 flex items-center justify-center font-pressstart text-[10px] text-[#3D2013]">
            ${room.name.charAt(0)}
          </div>
          <!-- Right Column: Room Details -->
          <div class="flex-1 flex flex-col gap-1 overflow-hidden">
            <span class="font-pressstart text-[11px] text-[#3D2013] truncate">${room.name}</span>
            <span class="font-pressstart text-[8px] text-[#3D2013] truncate">Hosted by: <span class="text-[#E87339]">${room.host}</span></span>
            <div class="flex flex-col gap-1.5 pt-1">
              <div class="flex items-center">
                <span class="inline-flex items-center gap-1 font-pressstart text-[7px] border-[1.5px] px-2 py-0.5 rounded uppercase ${privacyStyles}">
                  ${privacyIcon}
                  <span>${room.privacy}</span>
                </span>
              </div>
              <div class="flex items-center gap-1 font-pressstart text-[8px] text-[#3D2013]">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" class="w-3 h-3 shrink-0">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path fill="currentColor" d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.4 3.4 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.4 3.4 0 0 0 15 11a3.5 3.5 0 0 0 0-7" />
                </svg>
                <span>${room.currentMembers}/${room.maxMembers}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Button -->
        <button class="${footerBtnClass} font-pressstart text-[9px] sm:text-[10px] text-[#FFFFF6] bg-[#E87339] !rounded-none border-[2px] border-[#3D2013] px-8 py-3 transition-all duration-150 retro-shadow cursor-pointer hover:bg-[#d66530] w-full" data-room-id="${room.id}" data-room-type="${isHistoryTab ? 'history' : 'all'}">
          ${footerBtnText}
        </button>
      </div>
    `;
  }

  // Populate Tabs
  const allRoomsContainer = document.getElementById("all-rooms");
  const myRoomsContainer = document.getElementById("my-rooms");
  const historyContainer = document.getElementById("history");

  function inflateRooms(searchQuery = "") {
    const query = searchQuery.toLowerCase();

    // All Rooms
    const filteredAll = mockRooms.all.filter(r => r.name.toLowerCase().includes(query) || r.host.toLowerCase().includes(query));
    allRoomsContainer.innerHTML = filteredAll.length ? filteredAll.map(r => renderRoomCard(r, false)).join('') : `<p class="font-pressstart text-[9px] text-[#3D2013]/70 col-span-full py-4">No rooms found.</p>`;

    // My Rooms (Rooms hosted by myUsername)
    const myRoomsList = mockRooms.all.filter(r => r.host === myUsername);
    const filteredMy = myRoomsList.filter(r => r.name.toLowerCase().includes(query));
    myRoomsContainer.innerHTML = filteredMy.length ? filteredMy.map(r => renderRoomCard(r, false)).join('') : `<p class="font-pressstart text-[9px] text-[#3D2013]/70 col-span-full py-4">You have not created any rooms yet.</p>`;

    // History
    const filteredHistory = mockRooms.history.filter(r => r.name.toLowerCase().includes(query) || r.host.toLowerCase().includes(query));
    historyContainer.innerHTML = filteredHistory.length ? filteredHistory.map(r => renderRoomCard(r, true)).join('') : `<p class="font-pressstart text-[9px] text-[#3D2013]/70 col-span-full py-4">No session history found.</p>`;
  }

  inflateRooms();

  // Search Bar Event Listener
  document.getElementById("room-search-input").addEventListener("input", (e) => {
    inflateRooms(e.target.value);
  });

  // Tab Navigation Switching Logic
  const tabBtns = document.querySelectorAll(".room-tab-btn");
  const tabPanes = document.querySelectorAll(".room-tab-pane");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");

      tabBtns.forEach(b => {
        b.classList.remove("border-[#E16F37]", "text-[#E16F37]");
        b.classList.add("border-transparent", "text-[#3D2013]");
      });
      btn.classList.remove("border-transparent", "text-[#3D2013]");
      btn.classList.add("border-[#E16F37]", "text-[#E16F37]");

      tabPanes.forEach(pane => {
        if (pane.id === targetId) {
          pane.classList.remove("hidden");
        } else {
          pane.classList.add("hidden");
        }
      });
    });
  });

  // Modal Controls utilizing global helpers where applicable
  const joinModal = document.getElementById("join-room-modal");
  const createModal = document.getElementById("create-room-modal");
  const statsModal = document.getElementById("stats-modal");

  document.getElementById("open-join-modal-btn").addEventListener("click", () => window.openModal("join-room-modal"));
  document.getElementById("open-create-modal-btn").addEventListener("click", () => window.openModal("create-room-modal"));

  document.querySelectorAll(".close-modal-btn, #cancel-join-btn, #cancel-create-btn, #close-stats-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      window.closeModal("join-room-modal");
      window.closeModal("create-room-modal");
      window.closeModal("stats-modal");
    });
  });

  // Privacy Choice Buttons Interaction Logic
  const privacyButtons = document.querySelectorAll(".privacy-choice-btn");
  let selectedPrivacy = "public"; // default

  privacyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      privacyButtons.forEach(b => {
        const isPublic = b.getAttribute("data-value") === "public";
        b.classList.remove(
          isPublic ? "bg-[#EAF3FF]" : "bg-[#F1EDFF]",
          isPublic ? "border-[#315B8C]" : "border-[#6846A5]",
          isPublic ? "text-[#315B8C]" : "text-[#6846A5]",
          "opacity-100"
        );
        b.classList.add("bg-[#FEF4E0]", "border-[#3D2013]/30", "text-[#3D2013]/60", "opacity-75");
      });

      const isPublic = btn.getAttribute("data-value") === "public";
      btn.classList.remove("bg-[#FEF4E0]", "border-[#3D2013]/30", "text-[#3D2013]/60", "opacity-75");
      btn.classList.add(
        isPublic ? "bg-[#EAF3FF]" : "bg-[#F1EDFF]",
        isPublic ? "border-[#315B8C]" : "border-[#6846A5]",
        isPublic ? "text-[#315B8C]" : "text-[#6846A5]",
        "opacity-100"
      );
      selectedPrivacy = btn.getAttribute("data-value");
    });
  });

  // --- Form Validation for Create Room ---
  const roomNameInput = document.getElementById("create-room-name");
  const roomMaxSelect = document.getElementById("create-room-max");
  const confirmCreateBtn = document.getElementById("confirm-create-btn");

  function validateCreateForm() {
    const hasName = roomNameInput.value.trim() !== "";
    const hasMaxMember = roomMaxSelect.value !== "";

    if (hasName && hasMaxMember) {
      confirmCreateBtn.disabled = false;
      confirmCreateBtn.classList.remove("opacity-50", "cursor-not-allowed");
      confirmCreateBtn.classList.add("cursor-pointer", "hover:bg-[#d66530]");
    } else {
      confirmCreateBtn.disabled = true;
      confirmCreateBtn.classList.add("opacity-50", "cursor-not-allowed");
      confirmCreateBtn.classList.remove("cursor-pointer", "hover:bg-[#d66530]");
    }
  }

  roomNameInput.addEventListener("input", validateCreateForm);
  roomMaxSelect.addEventListener("change", validateCreateForm);
  validateCreateForm();
  // --------------------------------------

  // Create Room Confirmation Mock
  confirmCreateBtn.addEventListener("click", () => {
    if (confirmCreateBtn.disabled) return; // Extra safeguard

    const name = roomNameInput.value.trim();
    const privacy = selectedPrivacy; 
    const maxMembers = parseInt(roomMaxSelect.value);

    const newRoom = {
      id: Date.now(),
      name: name,
      host: myUsername,
      privacy: privacy,
      currentMembers: 1,
      maxMembers: maxMembers,
      technique: "Pomodoro",
      focus: "1h 00m",
      breakTime: "0h 15m",
      sessions: 1,
      tasks: [{ text: "Initial goal setup", completed: false }],
      xp: 100,
      coins: 25
    };

    mockRooms.all.unshift(newRoom);
    inflateRooms();
    window.closeModal("create-room-modal");
    roomNameInput.value = "";
    roomMaxSelect.selectedIndex = 0;
    validateCreateForm(); // Reset button state

    // Reset privacy choice back to default 'public'
    if (privacyButtons.length > 0) {
      privacyButtons[0].click();
    }
  });

  // Join Private Room Confirmation Mock
  document.getElementById("confirm-join-btn").addEventListener("click", () => {
    const code = document.getElementById("private-code-input").value.trim();
    if (code) {
      alert(`Successfully joined private room with code: ${code}`);
      window.closeModal("join-room-modal");
      document.getElementById("private-code-input").value = "";
    } else {
      alert("Please enter a valid room code.");
    }
  });

  // Handle Statistics Button Click (delegated event listener)
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("stat-btn")) {
      const roomId = parseInt(e.target.getAttribute("data-room-id"));
      const room = mockRooms.history.find(r => r.id === roomId) || mockRooms.all.find(r => r.id === roomId);

      if (room) {
        document.getElementById("stats-modal-title").innerText = `Statistics: ${room.name}`;
        document.getElementById("stat-technique").innerText = room.technique;
        document.getElementById("stat-focus").innerText = room.focus;
        document.getElementById("stat-break").innerText = room.breakTime;
        document.getElementById("stat-sessions").innerText = `${room.sessions} Sessions`;
        
        const completedCount = room.tasks.filter(t => t.completed).length;
        document.getElementById("stat-tasks-count").innerText = `${completedCount} / ${room.tasks.length}`;
        document.getElementById("stat-xp").innerText = `${room.xp}`;
        document.getElementById("stat-coins").innerText = room.coins;

        const taskListEl = document.getElementById("stat-task-list");
        taskListEl.innerHTML = room.tasks.map(t => {
          if (t.completed) {
            return `
              <li class="flex justify-between items-center">
                <span class="flex items-center pl-5"><span class="line-through text-[#3D2013]/60">${t.text}</span></span>
                <span class="text-[#3D2013]/70"><span class="text-green-600 font-pixel text-[20px]">✓</span></span>
              </li>
            `;
          } else {
            return `
              <li class="flex justify-between items-center">
                <span class="flex items-center pl-5"><span>${t.text}</span></span>
                <span class="text-[#3D2013]/70"></span>
              </li>
            `;
          }
        }).join('');

        window.openModal("stats-modal");
      }
    }

    if (e.target.classList.contains("join-room-action")) {
      alert("Successfully joined the study room!");
    }
  });
});