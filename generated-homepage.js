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
  let roomId = params.get("room");
  if (roomId) {
    sessionStorage.setItem("activeRoomId", roomId);
  } else {
    roomId = sessionStorage.getItem("activeRoomId");
  }
  return roomId || "";
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

  if (roomCodeElem) roomCodeElem.textContent = targetRoomCode || "------";
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
        activeRoomData = currentRoom; 
        if (roomNameElem) roomNameElem.textContent = currentRoom.name || "Study Room";
        
        // --- 1. SYNC ROOM FURNITURE ---
        const roomElement = document.querySelector("custom-room"); 
        if (roomElement && activeRoomData.room_config) {
          let rConfig = activeRoomData.room_config;
          while (typeof rConfig === 'string') {
            try { rConfig = JSON.parse(rConfig); } catch(e) { break; }
          }
          if (typeof rConfig === 'object' && Object.keys(rConfig).length > 0) {
            roomElement.setAttribute("config", JSON.stringify(rConfig));
          }
        }

        // --- 2. SYNC LOCAL PLAYER HOST ICON ---
        const localNameTag = document.getElementById("local-player-name");
        if (localNameTag && currentUser.id) {
          const isLocalHost = String(currentUser.id) === String(activeRoomData.host_id);
          const cleanName = currentUser.username || currentUser.name || "STUDENT";
          const hostSvg = `<svg class="w-2.5 h-2.5 inline-block mr-1 text-[#FFFFFF] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L4 9v12h5v-7h6v7h5V9z"/></svg>`;
          localNameTag.innerHTML = isLocalHost ? `${hostSvg}${cleanName}` : cleanName;
        }

        // --- 3. CHECK KICK STATUS FOR NON-HOST PLAYERS ---
        const livePlayers = currentRoom.players_list || [];
        const isHost = String(currentUser.id) === String(currentRoom.host_id);
        
        if (!isHost && currentUser.id) {
          const amIStillInRoom = livePlayers.some(p => String(p.id) === String(currentUser.id)) || 
                                 String(currentRoom.host_id) === String(currentUser.id);
          
          if (!amIStillInRoom) {
            alert("You have been kicked from the room by the host.");
            window.location.href = "homepage.html";
            return;
          }
        }

        // --- 4. SYNC OTHER PLAYERS ---
        const otherPlayers = livePlayers.filter(p => String(p.id) !== String(currentUser.id));
        const livePlayersStr = JSON.stringify(otherPlayers);

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

  const kickBtn = document.getElementById("modal-kick-btn");

  if (kickBtn) {
    const rawHostId = activeRoomData?.host_id || activeRoomData?.hostId || activeRoomData?.host || "";
    const hostId = String(rawHostId);
    const currentUserId = String(currentUser?.id || currentUser?.username || "");
    const targetPlayerId = String(player.id || player.username || "");

    const isHostByUsername = (String(activeRoomData?.host) === String(currentUser?.username || currentUser?.name));
    const isHostById = (hostId === currentUserId);
    const isHost = isHostById || isHostByUsername;

    const isSelf = (targetPlayerId === currentUserId || String(player.username) === String(currentUser?.username));

    if (isHost && !isSelf) {
      kickBtn.classList.remove("hidden");
      kickBtn.style.display = "flex";
      kickBtn.onclick = () => kickRealPlayer(player.id);
    } else {
      kickBtn.classList.add("hidden");
      kickBtn.style.display = "none";
    }
  }

  openModal("mock-player-modal");
}

async function kickRealPlayer(playerId) {
  if (!playerId) return;

  const rawHostId = activeRoomData?.host_id || activeRoomData?.hostId || activeRoomData?.host || "";
  const hostId = String(rawHostId);
  const currentUserId = String(currentUser?.id || currentUser?.username || "");

  const isHostById = (hostId === currentUserId);
  const isHostByName = (String(activeRoomData?.host) === String(currentUser?.username || currentUser?.name));
  const isHost = isHostById || isHostByName;

  if (!isHost) {
    alert("Only the room host is authorized to kick players.");
    return;
  }

  try {
    const token = sessionStorage.getItem("token");
    const targetRoomCode = getUrlRoomId();

    await fetch(`${API_BASE_URL}/api/kick-player`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        room_code: targetRoomCode,
        player_id: playerId
      })
    });
  } catch (err) {
    console.warn("Failed to notify backend about kicked player:", err);
  }

  const playerElem = document.getElementById(`room-player-${playerId}`);
  if (playerElem) {
    playerElem.remove();
  }

  closeModal("mock-player-modal");
  selectedRealPlayerId = null;
}

// ==========================================
// INDIVIDUAL CHECKLIST & SHARED TASKS LOGIC
// ==========================================

let roomTasks = [];

function initChecklist() {
  if (!activeRoomData || !activeRoomData.checklist) return;
  
  let rawChecklist = activeRoomData.checklist;
  while (typeof rawChecklist === 'string') {
    try { rawChecklist = JSON.parse(rawChecklist); } catch(e) { break; }
  }

  if (Array.isArray(rawChecklist)) {
    const roomCode = getUrlRoomId();
    const savedProgress = JSON.parse(localStorage.getItem(`checklist_progress_${roomCode}`) || "{}");

    roomTasks = rawChecklist.map((task, idx) => ({
      id: idx,
      title: task.title || task,
      completed: savedProgress[idx] !== undefined ? savedProgress[idx] : (task.status === "complete" || task.completed === true)
    }));
  }

  renderChecklistUI();
}

function renderChecklistUI() {
  const container = document.getElementById("checklist-tasks-container");
  const ratioText = document.getElementById("checklist-ratio-text");
  const progressBar = document.getElementById("checklist-progress-bar");
  const taskCountBadge = document.getElementById("checklist-task-count");

  if (!container) return;

  if (roomTasks.length === 0) {
    container.innerHTML = `<p class="font-pixel text-lg text-[#3D2013]/60 italic text-center py-4">No tasks found for this room.</p>`;
    if (ratioText) ratioText.textContent = "0/0 completed";
    if (progressBar) progressBar.style.width = "0%";
    return;
  }

  let completedCount = roomTasks.filter(t => t.completed).length;

  container.innerHTML = roomTasks.map(task => `
    <label class="flex items-center gap-2.5 p-2 bg-[#FAE9CE] border-[2px] border-[#482A1D] cursor-pointer hover:bg-[#FEF4E0] transition-colors select-none">
      <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskCompletion(${task.id})"
             class="w-4 h-4 accent-[#788D55] cursor-pointer">
      <span class="font-pixel text-lg text-[#3D2013] ${task.completed ? 'line-through opacity-60' : ''}">
        ${task.title}
      </span>
    </label>
  `).join("");

  if (ratioText) ratioText.textContent = `${completedCount}/${roomTasks.length} completed`;
  if (progressBar) progressBar.style.width = `${(completedCount / roomTasks.length) * 100}%`;
  if (taskCountBadge) taskCountBadge.textContent = `${roomTasks.length} Tasks`;
}

function toggleTaskCompletion(taskId) {
  const task = roomTasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    
    const roomCode = getUrlRoomId();
    const progressMap = {};
    roomTasks.forEach(t => { progressMap[t.id] = t.completed; });
    localStorage.setItem(`checklist_progress_${roomCode}`, JSON.stringify(progressMap));

    renderChecklistUI();
  }
}

function addNewTaskRow() {
  const editContainer = document.getElementById("edit-task-list");
  if (!editContainer) return;

  const div = document.createElement("div");
  div.className = "flex items-center gap-2";
  div.innerHTML = `
    <input type="text" placeholder="New task title..." 
           class="flex-1 bg-[#FAE9CE] border-[2px] border-[#3D2013] px-2.5 py-1.5 font-pixel text-lg text-[#3D2013] focus:outline-none">
    <button onclick="this.parentElement.remove()" class="bg-[#A53914] text-white px-2.5 py-1 font-pressstart text-xs">✕</button>
  `;
  editContainer.appendChild(div);
}

function openAddTaskModal() {
  const editContainer = document.getElementById("edit-task-list");
  if (!editContainer) return;

  editContainer.innerHTML = roomTasks.map(t => `
    <div class="flex items-center gap-2">
      <input type="text" value="${t.title}" 
             class="flex-1 bg-[#FAE9CE] border-[2px] border-[#3D2013] px-2.5 py-1.5 font-pixel text-lg text-[#3D2013] focus:outline-none">
      <button onclick="this.parentElement.remove()" class="bg-[#A53914] text-white px-2.5 py-1 font-pressstart text-xs">✕</button>
    </div>
  `).join("");

  openModal("add-task-modal");
}

async function saveTaskChanges() {
  const editContainer = document.getElementById("edit-task-list");
  if (!editContainer) return;

  const inputs = editContainer.querySelectorAll("input[type='text']");
  const newTasks = [];
  inputs.forEach(inp => {
    if (inp.value.trim() !== "") {
      newTasks.push({ title: inp.value.trim(), status: "inprogress" });
    }
  });

  roomTasks = newTasks.map((t, idx) => ({ id: idx, title: t.title, completed: false }));
  renderChecklistUI();
  closeModal("add-task-modal");

  try {
    const token = sessionStorage.getItem("token");
    const targetRoomCode = getUrlRoomId();
    await fetch(`${API_BASE_URL}/api/update-room-tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ room_code: targetRoomCode, checklist: newTasks })
    });
  } catch (err) {
    console.warn("Failed to sync tasks to server:", err);
  }
}

// ==========================================
// SYNCHRONIZED STUDY TIMER LOGIC
// ==========================================

let timerInterval = null;
let timeLeft = 25 * 60; // Default 25 mins
let isTimerRunning = false;
let currentPhase = "FOCUS";

function initTimer() {
  const unselectedView = document.getElementById("timer-unselected-view");
  const activeView = document.getElementById("timer-active-view");

  if (unselectedView) unselectedView.classList.add("hidden");
  if (activeView) activeView.classList.remove("hidden");

  if (activeRoomData && activeRoomData.technique) {
    const tech = String(activeRoomData.technique).toLowerCase();
    if (tech.includes("52")) timeLeft = 52 * 60;
    else if (tech.includes("90")) timeLeft = 90 * 60;
    else timeLeft = 25 * 60;
  } else {
    timeLeft = 25 * 60;
  }

  isTimerRunning = false;
  updateTimerDisplay();
  
  const toggleText = document.getElementById("timer-toggle-text");
  if (toggleText) toggleText.textContent = "START";

  const toggleIcon = document.getElementById("timer-toggle-icon");
  if (toggleIcon) {
    toggleIcon.innerHTML = `<polygon points="5,3 19,12 5,21" />`;
  }

  // Kung HINDI host ang user, gawing medyo transparent o lagyan ng paalala ang button para sa kanila
  const toggleBtn = document.getElementById("timer-toggle-btn");
  if (toggleBtn && !checkIsHost()) {
    toggleBtn.title = "Only the room host can control the timer.";
  }
}

function updateTimerDisplay() {
  const display = document.getElementById("timer-display");
  const miniDisplay = document.getElementById("mini-timer-display");
  const phaseLabel = document.getElementById("timer-phase-label");

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeString = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  if (display) display.textContent = timeString;
  if (miniDisplay) miniDisplay.textContent = timeString;
  if (phaseLabel) phaseLabel.textContent = currentPhase;
}

function checkIsHost() {
  if (!activeRoomData) return true; // Default muna sa true habang naglo-load para hindi ma-lock agad
  const rawHostId = activeRoomData?.host_id || activeRoomData?.hostId || activeRoomData?.host || "";
  const hostId = String(rawHostId).trim();
  const currentUserId = String(currentUser?.id || "").trim();
  const currentUsername = String(currentUser?.username || currentUser?.name || "").trim();
  const roomHostName = String(activeRoomData?.host || "").trim();

  const isHostById = (hostId !== "" && currentUserId !== "" && hostId === currentUserId);
  const isHostByName = (roomHostName !== "" && currentUsername !== "" && roomHostName.toLowerCase() === currentUsername.toLowerCase());
  
  // Kung wala pang na-fetch na host_id o user id, iberipika sa sessionStorage kung sakaling naroon
  const storedUser = JSON.parse(sessionStorage.getItem("current_user") || "{}");
  const storedUserId = String(storedUser.id || "").trim();
  const isHostByStoredId = (hostId !== "" && storedUserId !== "" && hostId === storedUserId);

  return isHostById || isHostByName || isHostByStoredId || !hostId;
}

function toggleTimer() {
  console.log("toggleTimer is executing...");

  // Pansamantalang huwag muna nating i-block kung host o hindi para lang umandar
  // (O kaya naman ay pilitin nating maging true para sa testing)
  isTimerRunning = !isTimerRunning;
  console.log("New isTimerRunning state:", isTimerRunning);

  const roomCode = getUrlRoomId();
  sessionStorage.setItem(`timer_state_${roomCode}`, JSON.stringify({
    isRunning: isTimerRunning,
    timeLeft: timeLeft,
    timestamp: Date.now()
  }));

  // Direktang tawagin ang executeTimerAction
  const toggleText = document.getElementById("timer-toggle-text");
  const toggleIcon = document.getElementById("timer-toggle-icon");

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  if (isTimerRunning) {
    if (toggleText) toggleText.textContent = "PAUSE";
    if (toggleIcon) {
      toggleIcon.innerHTML = `<rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />`;
    }
    console.log("Interval started successfully!");

    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        console.log("Ticking! Oras ngayon:", timeLeft);
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        isTimerRunning = false;
        if (toggleText) toggleText.textContent = "START";
        alert("Session complete!");
      }
    }, 1000);
  } else {
    if (toggleText) toggleText.textContent = "START";
    if (toggleIcon) {
      toggleIcon.innerHTML = `<polygon points="5,3 19,12 5,21" />`;
    }
    console.log("Timer paused.");
  }
}

function executeTimerAction() {
  const toggleText = document.getElementById("timer-toggle-text");
  
  // Linisin ang lumang interval para hindi magpatong-patong
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  if (isTimerRunning) {
    if (toggleText) toggleText.textContent = "PAUSE";
    console.log("Timer is now running. Starting countdown interval...");

    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        console.log("Remaining time (seconds):", timeLeft);
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        isTimerRunning = false;
        if (toggleText) toggleText.textContent = "START";
        alert("Session complete!");
      }
    }, 1000);
  } else {
    if (toggleText) toggleText.textContent = "START";
    console.log("Timer paused.");
  }
}

function resetTimer() {
  if (!checkIsHost()) {
    alert("Only the room host can reset the timer!");
    return;
  }

  isTimerRunning = false;
  if (timerInterval) clearInterval(timerInterval);
  
  const roomCode = getUrlRoomId();
  sessionStorage.removeItem(`timer_state_${roomCode}`);

  const toggleText = document.getElementById("timer-toggle-text");
  if (toggleText) toggleText.textContent = "START";
  initTimer();
}

function saveTimerSettings() {
  const sessionInput = document.getElementById("session-input");
  if (sessionInput && sessionInput.value) {
    timeLeft = parseInt(sessionInput.value, 10) * 60;
    updateTimerDisplay();
  }
  closeModal('timer-edit-modal');
}

// ==========================================
// SESSION ANALYTICS & DATABASE UPDATE LOGIC
// ==========================================

async function recordSessionAnalytics() {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/finish-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.ok) {
      console.log("Session analytics recorded and streak updated successfully!");
    }
  } catch (err) {
    console.error("Failed to record session analytics:", err);
  }
}

// Hook initialization into main DOM load
document.addEventListener("DOMContentLoaded", async () => {
  await fetchCurrentUser();
  await fetchAndRenderRoomData();
  
  setTimeout(() => {
    initChecklist();
    initTimer();
  }, 1000);

  setInterval(fetchAndRenderRoomData, 3000);
});

// ==========================================
// SINGLE UNIFIED REAL-TIME SYNC WATCHER
// ==========================================
setInterval(() => {
  const roomCode = getUrlRoomId();
  if (!roomCode) return;

  const savedState = sessionStorage.getItem(`timer_state_${roomCode}`);
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      
      if (!checkIsHost()) {
        timeLeft = parsed.timeLeft;
        
        if (isTimerRunning !== parsed.isRunning) {
          isTimerRunning = parsed.isRunning;
          if (isTimerRunning) {
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(() => {
              if (timeLeft > 0) timeLeft--;
              updateTimerDisplay();
            }, 1000);
          } else {
            if (timerInterval) clearInterval(timerInterval);
          }
        }
        updateTimerDisplay();

        const toggleText = document.getElementById("timer-toggle-text");
        const toggleIcon = document.getElementById("timer-toggle-icon");
        
        if (toggleText) {
          toggleText.textContent = isTimerRunning ? "PAUSE" : "START";
        }
        if (toggleIcon) {
          toggleIcon.innerHTML = isTimerRunning 
            ? `<rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />`
            : `<polygon points="5,3 19,12 5,21" />`;
        }
      }
    } catch(e) {}
  }
}, 1000);

// Direktang i-attach ang click listener sa button kasama ang Host Protection
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("timer-toggle-btn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Direct button click detected! Calling toggleTimer()...");
      toggleTimer(); // Direktang tinatawag ang function
    });
  } else {
    console.warn("Element #timer-toggle-btn not found during DOMContentLoaded!");
  }
});

// I-override o i-hook ang pagbukas ng timer modal para siguradong naka-init
function openTimerModal() {
  const modal = document.getElementById("timer-modal");
  if (modal) {
    modal.classList.remove("hidden");
    initTimer();
  }
}