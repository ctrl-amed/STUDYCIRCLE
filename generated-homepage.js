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
  let roomId = params.get("room") || params.get("code");
  
  if (roomId) {
    sessionStorage.setItem("activeRoomId", roomId);
  } else {
    roomId = sessionStorage.getItem("activeRoomId");
  }
  
  return roomId || "";
}

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

async function fetchAndRenderRoomData() {
  const roomNameElem = document.getElementById("nav-room-name");
  const roomCodeElem = document.getElementById("nav-room-code");
  const targetRoomCode = getUrlRoomId();

  if (roomCodeElem) roomCodeElem.textContent = targetRoomCode || "------";
  
  try {
    const storedRoom = JSON.parse(localStorage.getItem("currentActiveRoom") || "{}");
    if (storedRoom && roomNameElem) {
      activeRoomData = storedRoom;
      const roomName = storedRoom.name || storedRoom.roomName || storedRoom.topic || "Study Room";
      roomNameElem.textContent = roomName;
    }
  } catch(e) {}

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
      const currentRoom = rooms.find(r => {
        const rCode = String(r.roomCode || r.room_code || r.id || "").trim();
        return rCode.toUpperCase() === String(targetRoomCode).trim().toUpperCase();
      });

      if (currentRoom) {
        activeRoomData = currentRoom; 
        
        const foundName = currentRoom.name || currentRoom.roomName || currentRoom.title || currentRoom.topic || "Study Room";
        if (roomNameElem) roomNameElem.textContent = foundName;
        
        const foundCode = currentRoom.roomCode || currentRoom.room_code || currentRoom.id || targetRoomCode;
        if (roomCodeElem) roomCodeElem.textContent = foundCode;
        
        localStorage.setItem("currentActiveRoom", JSON.stringify(currentRoom));

        const livePlayers = currentRoom.players_list || currentRoom.players || [];
        const otherPlayers = livePlayers.filter(p => String(p.id || p.userId || p.username) !== String(currentUser?.id || currentUser?.username));
        renderRealPlayers(otherPlayers);
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
      let rawAvatarData = player.avatar_url || player.avatarConfig || player.avatar || player.config;
      if (rawAvatarData) {
        let parsed = rawAvatarData;
        while (typeof parsed === 'string') { parsed = JSON.parse(parsed); }
        if (typeof parsed === 'object' && parsed !== null) { configObj = { ...configObj, ...parsed }; }
      }
    } catch (e) {}

    const displayName = player.username || player.name || "STUDENT";
    const isHost = activeRoomData && String(player.id || player.userId) === String(activeRoomData.host_id || activeRoomData.hostId);
    const hostIcon = isHost 
      ? `<svg class="w-2.5 h-2.5 inline-block mr-1 text-[#FFFFFF] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L4 9v12h5v-7h6v7h5V9z"/></svg>` 
      : "";

    avatarWrapper.innerHTML = `
      <div class="absolute top-6 sm:top-2 left-1/2 -translate-x-1/2 bg-[#000000]/20 px-1.5 sm:px-3 py-0.5 sm:py-1 whitespace-nowrap shadow-md pointer-events-none flex items-center justify-center rounded-md">
        <span class="font-pressstart text-[6px] sm:text-[8px] text-[#FFFFFF] leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] flex items-center">
          ${hostIcon}${displayName}
        </span>
      </div>
    `;

    const avatarElem = document.createElement("custom-avatar");
    avatarElem.setAttribute("state", "idle");
    avatarElem.className = "pointer-events-none";
    
    if (typeof avatarElem.setConfig === "function") {
      avatarElem.setConfig(configObj);
    } else {
      avatarElem.setAttribute("config", JSON.stringify(configObj));
    }

    avatarWrapper.appendChild(avatarElem);
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
  } catch (err) {}

  const playerElem = document.getElementById(`room-player-${playerId}`);
  if (playerElem) playerElem.remove();

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
  } catch (err) {}
}

// ==========================================
// CALENDAR & CHECKLIST MODAL TOGGLES
// ==========================================

function openCalendarModal() {
  const modal = document.getElementById("calendar-modal");
  if (modal) {
    modal.classList.remove("hidden");
  }
}

function closeCalendarModal() {
  const modal = document.getElementById("calendar-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

function openChecklistModal() {
  const modal = document.getElementById("checklist-modal");
  if (modal) {
    modal.classList.remove("hidden");
    initChecklist();
  }
}

function closeChecklistModal() {
  const modal = document.getElementById("checklist-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

// ==========================================
// SYNCHRONIZED STUDY TIMER LOGIC (ROOM SHARED)
// ==========================================

let timerInterval = null;
let timeLeft = 25 * 60;
let isTimerRunning = false;
let currentPhase = "FOCUS";
let totalSessions = 3;
let currentSession = 1;

function initTimer() {
  const unselectedView = document.getElementById("timer-unselected-view");
  const activeView = document.getElementById("timer-active-view");

  if (unselectedView) unselectedView.classList.add("hidden");
  if (activeView) activeView.classList.remove("hidden");

  const roomCode = getUrlRoomId();
  let existingRoomTimer = null;
  if (roomCode) {
    try {
      existingRoomTimer = JSON.parse(localStorage.getItem(`room_timer_${roomCode}`) || "null");
    } catch(e) {}
  }

  let technique = "";
  let roomSessions = 3;

  let roomData = window.activeRoomData;
  if (!roomData || Object.keys(roomData).length === 0) {
    try {
      roomData = JSON.parse(localStorage.getItem("currentActiveRoom") || "{}");
    } catch(e) {}
  }

  if (roomData) {
    technique = String(roomData.technique || roomData.room_config?.technique || "").toLowerCase();
    roomSessions = parseInt(roomData.sessions || roomData.total_sessions || roomData.room_config?.sessions || 3, 10);
  }

  totalSessions = roomSessions;
  const techniqueLabel = document.getElementById("technique-label-text");

  if (existingRoomTimer && existingRoomTimer.timeLeft !== undefined) {
    timeLeft = existingRoomTimer.timeLeft;
    isTimerRunning = existingRoomTimer.isRunning;
  } else {
    if (technique.includes("52") || technique.includes("5217") || technique.includes("52-17") || technique.includes("52/12")) {
      timeLeft = 52 * 60;
      if (techniqueLabel) techniqueLabel.textContent = "52-12";
    } else if (technique.includes("90")) {
      timeLeft = 90 * 60;
      if (techniqueLabel) techniqueLabel.textContent = "90-mins";
    } else {
      timeLeft = 25 * 60;
      if (techniqueLabel) techniqueLabel.textContent = "Pomodoro";
    }
    isTimerRunning = false;
  }

  if (technique.includes("52") || technique.includes("5217") || technique.includes("52-17") || technique.includes("52/12")) {
    if (techniqueLabel) techniqueLabel.textContent = "52-12";
  } else if (technique.includes("90")) {
    if (techniqueLabel) techniqueLabel.textContent = "90-mins";
  } else {
    if (techniqueLabel) techniqueLabel.textContent = "Pomodoro";
  }

  updateTimerDisplay();
  
  const sessionLabelText = document.getElementById("session-label-text");
  if (sessionLabelText) {
    sessionLabelText.textContent = `Session ${currentSession} of ${totalSessions}`;
  }

  const toggleText = document.getElementById("timer-toggle-text");
  if (toggleText) toggleText.textContent = isTimerRunning ? "PAUSE" : "START";

  const toggleIcon = document.getElementById("timer-toggle-icon");
  if (toggleIcon) {
    toggleIcon.innerHTML = isTimerRunning 
      ? `<rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />`
      : `<polygon points="5,3 19,12 5,21" />`;
  }
}

function updateTimerDisplay() {
  const display = document.getElementById("timer-display");
  const miniDisplay = document.getElementById("mini-timer-display");
  const phaseLabel = document.getElementById("timer-phase-label");
  const circleProgress = document.getElementById("timer-circle-progress");

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeString = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  if (display) display.textContent = timeString;
  if (miniDisplay) miniDisplay.textContent = timeString;
  if (phaseLabel) phaseLabel.textContent = currentPhase;

  if (circleProgress) {
    let totalTime = 25 * 60;
    let roomData = window.activeRoomData;
    if (!roomData) {
      try { roomData = JSON.parse(localStorage.getItem("currentActiveRoom") || "{}"); } catch(e) {}
    }
    let technique = roomData ? String(roomData.technique || roomData.room_config?.technique || "pomodoro").toLowerCase() : "pomodoro";
    
    if (technique.includes("52") || technique.includes("5217") || technique.includes("52/12")) totalTime = 52 * 60;
    else if (technique.includes("90")) totalTime = 90 * 60;

    const circumference = 263.89;
    const offset = circumference - (timeLeft / totalTime) * circumference;
    circleProgress.style.strokeDashoffset = offset;
  }
}

// Robust Handler when timer expires
function handleTimerExpiration() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  isTimerRunning = false;
  
  const toggleText = document.getElementById("timer-toggle-text");
  const toggleIcon = document.getElementById("timer-toggle-icon");
  if (toggleText) toggleText.textContent = "START";
  if (toggleIcon) {
    toggleIcon.innerHTML = `<polygon points="5,3 19,12 5,21" />`;
  }
  
  const roomCode = getUrlRoomId();
  if (roomCode) {
    localStorage.removeItem(`room_timer_${roomCode}`);
  }
  
  if (typeof finalizeAndSaveSession === 'function') {
    finalizeAndSaveSession();
  } else if (typeof handleSessionCompletion === 'function') {
    handleSessionCompletion();
  } else {
    const completeModal = document.getElementById('session-complete-modal');
    if (completeModal) {
      completeModal.classList.remove('hidden');
    } else {
      alert("Session Complete! Great job studying.");
    }
  }
}

window.toggleTimer = function toggleTimer() {
  console.log("Global toggleTimer triggered! State:", isTimerRunning);

  isTimerRunning = !isTimerRunning;

  const toggleText = document.getElementById("timer-toggle-text");
  const toggleIcon = document.getElementById("timer-toggle-icon");
  const roomCode = getUrlRoomId();

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  const saveRoomTimerState = () => {
    if (roomCode) {
      localStorage.setItem(`room_timer_${roomCode}`, JSON.stringify({
        isRunning: isTimerRunning,
        timeLeft: timeLeft,
        timestamp: Date.now()
      }));
    }
  };

  saveRoomTimerState();

  if (isTimerRunning) {
    if (toggleText) toggleText.textContent = "PAUSE";
    if (toggleIcon) {
      toggleIcon.innerHTML = `<rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />`;
    }

    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
        saveRoomTimerState();
      } else {
        handleTimerExpiration();
      }
    }, 1000);

  } else {
    if (toggleText) toggleText.textContent = "START";
    if (toggleIcon) {
      toggleIcon.innerHTML = `<polygon points="5,3 19,12 5,21" />`;
    }
  }
}

function resetTimer() {
  isTimerRunning = false;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  const roomCode = getUrlRoomId();
  if (roomCode) localStorage.removeItem(`room_timer_${roomCode}`);
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
// SESSION ANALYTICS & INITIALIZATION (GINAYA SA HOMEPAGE)
// ==========================================

async function handleSessionCompletion() {
  const roomCode = getUrlRoomId();
  if (roomCode) {
    localStorage.removeItem(`room_timer_${roomCode}`);
  }

  // 1. Kumuha ng baseline data para sa session input
  const sessionEndTime = Date.now();
  const sessionStart = sessionEndTime - (90 * 60000); // 90 mins default o batay sa room technique
  const totalTasks = (typeof roomTasks !== 'undefined' && roomTasks.length > 0) ? roomTasks.length : 4;
  const completedTasks = (typeof roomTasks !== 'undefined' && roomTasks.length > 0) 
    ? roomTasks.filter(t => t.completed).length 
    : 4;

  const currentUserData = JSON.parse(sessionStorage.getItem("current_user") || "{}");
  const userStreak = currentUserData.streakDays || 7;

  // 2. Patakbuhin ang processSessionResults (tulad ng sa homepage para makuha ang XP/Coins breakdown)
  const sessionInput = {
    startTime: sessionStart,
    endTime: sessionEndTime,
    completedTasks: completedTasks,
    totalTasks: totalTasks,
    preTestScore: 72,  // O kunin mula sa quiz state kung meron
    postTestScore: 84, // O kunin mula sa quiz state kung meron
    userStreak: userStreak
  };

  const computedResults = processSessionResults(sessionInput);

  // 3. I-send sa database backend
  let sessionData = {};
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/api/session/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        durationMinutes: 90,
        completedTasks: completedTasks,
        totalTasks: totalTasks,
        preTestScore: 72,
        postTestScore: 84,
        improvement: 12,
        earnedXp: computedResults.rewards.xpEarned,
        earnedCoins: computedResults.rewards.coinsEarned
      })
    });

    if (response.ok) {
      sessionData = await response.json();
      updateSessionRewardsUI({
        xp_earned: computedResults.rewards.xpEarned,
        coins_earned: computedResults.rewards.coinsEarned,
        new_level: sessionData.newLevel || currentUserData.level || 10
      });
    }
  } catch (err) {
    console.error("Failed to record session analytics:", err);
  }

  // 4. Buuin ang payload para sa analytics modal (Kaparehong-kapareho ng sa homepage)
  const realModalPayload = {
    sessionType: "structured",
    duration: computedResults.analytics.duration,
    completedTasks: completedTasks,
    totalTasks: totalTasks,
    avgScore: 84,
    groupPreTest: 72,
    groupPostTest: 84,
    groupImprovement: 12,
    user: {
      avatar: currentUserData.avatar_url || currentUser.avatar_url || "https://api.dicebear.com/7.x/pixel-art/svg?seed=Angela",
      preTest: 72,
      postTest: 84,
      improvement: 12
    },
    members: [
      { name: "YOU (ANGELA)", avatar: currentUserData.avatar_url || "https://api.dicebear.com/7.x/pixel-art/svg?seed=Angela", focusTime: computedResults.analytics.duration, participation: 96, tasks: `${completedTasks}/${totalTasks}` }
    ],
    rewards: {
      level: sessionData.newLevel || currentUserData.level || 10,
      xpEarned: computedResults.rewards.xpEarned,
      coinsEarned: computedResults.rewards.coinsEarned,
      currentXp: sessionData.newXp || 100,
      nextLevelXp: 155,
      xpBreakdown: [
        { label: `Completed ${completedTasks} tasks`, value: computedResults.rewards.xpBreakdown.completedTasksXp },
        { label: `Focus time: ${computedResults.analytics.duration}`, value: computedResults.rewards.xpBreakdown.focusTimeXp },
        { label: "Completed study session", value: computedResults.rewards.xpBreakdown.sessionBonusXp }
      ],
      coinsBreakdown: [
        { label: `Completed ${completedTasks} tasks`, value: computedResults.rewards.coinsBreakdown.completedTasksCoins },
        { label: `Focus time: ${computedResults.analytics.duration}`, value: computedResults.rewards.coinsBreakdown.focusTimeCoins },
        { label: "Session completion bonus", value: computedResults.rewards.coinsBreakdown.sessionBonusCoins }
      ]
    }
  };

  // 5. Buksan ang modal gamit ang parehong function na gumagana sa homepage
  if (typeof window.showSessionAnalytics === 'function') {
    window.showSessionAnalytics(realModalPayload);
  } else {
    console.error("showSessionAnalytics is not defined.");
  }
}

function updateSessionRewardsUI(data) {
  const xpEarnedElem = document.getElementById("reward-xp-earned");
  const coinsEarnedElem = document.getElementById("reward-coins-earned");
  const userLevelElem = document.getElementById("reward-user-level");

  if (xpEarnedElem && data.xp_earned) xpEarnedElem.textContent = `+${data.xp_earned} XP`;
  if (coinsEarnedElem && data.coins_earned) coinsEarnedElem.textContent = `+${data.coins_earned}`;
  if (userLevelElem && data.new_level) userLevelElem.textContent = data.new_level;
}

function transitionToRewardsModal() {
  if (typeof closeModal === 'function') {
    closeModal('session-complete-modal');
    openModal('session-rewards-modal');
  } else {
    const completeModal = document.getElementById('session-complete-modal');
    const rewardsModal = document.getElementById('session-rewards-modal');
    if (completeModal) completeModal.classList.add('hidden');
    if (rewardsModal) rewardsModal.classList.remove('hidden');
  }
}

function finishAndCloseRewardsModal() {
  if (typeof closeModal === 'function') {
    closeModal('session-rewards-modal');
  } else {
    const rewardsModal = document.getElementById('session-rewards-modal');
    if (rewardsModal) rewardsModal.classList.add('hidden');
  }
  resetTimer();
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchCurrentUser();
  await fetchAndRenderRoomData();
  
  setTimeout(() => {
    initChecklist();
    initTimer();
  }, 1000);

  const toggleBtn = document.getElementById("timer-toggle-btn");
  if (toggleBtn) {
    toggleBtn.onclick = (e) => {
      e.preventDefault();
      window.toggleTimer();
    };
  }

  setInterval(fetchAndRenderRoomData, 3000);
});

// Real-time synchronization watcher with instant expiration check
setInterval(() => {
  const roomCode = getUrlRoomId();
  if (!roomCode) return;

  const savedState = localStorage.getItem(`room_timer_${roomCode}`);
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      
      if (parsed.timeLeft !== undefined) {
        timeLeft = parsed.timeLeft;
        if (timeLeft <= 0 && isTimerRunning) {
          handleTimerExpiration();
          return;
        }
      }
      
      if (isTimerRunning !== parsed.isRunning) {
        isTimerRunning = parsed.isRunning;
        if (isTimerRunning) {
          if (timerInterval) clearInterval(timerInterval);
          timerInterval = setInterval(() => {
            if (timeLeft > 0) {
              timeLeft--;
            } else {
              handleTimerExpiration();
            }
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
    } catch(e) {}
  }
}, 300);

function openTimerModal() {
  const modal = document.getElementById("timer-modal");
  if (modal) {
    modal.classList.remove("hidden");
    initTimer();
  }
}

// WSM & Analytics Engine Helper para hindi mag-error ang finalizeAndSaveSession
function processSessionResults(sessionInput) {
  const completedTasks = sessionInput.completedTasks || 4;
  const totalTasks = sessionInput.totalTasks || 4;
  const preTestScore = sessionInput.preTestScore || 0;
  const postTestScore = sessionInput.postTestScore || 0;
  const improvementScore = postTestScore - preTestScore;

  return {
    analytics: {
      duration: sessionInput.duration || "1hr 30m",
      completedTasksRatio: `${completedTasks}/${totalTasks}`,
      avgScore: `${postTestScore}%`,
      preTest: `${preTestScore}%`,
      postTest: `${postTestScore}%`,
      improvement: improvementScore >= 0 ? `+${improvementScore}%` : `${improvementScore}%`
    },
    rewards: {
      level: 10,
      xpEarned: completedTasks * 10 + 15,
      coinsEarned: completedTasks * 5 + 10
    }
  };
}