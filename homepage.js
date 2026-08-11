// =========================================================================
// 📢 BACKEND INTEGRATION NOTE FOR MY AWESOME BACKEND DEVELOPER:
// 
// Hey! Below is the `playerData` state object powering all header widgets.
// To connect database/API:
// 1. Fetch user data from your endpoint (e.g. GET /api/user/dashboard-summary)
// 2. Overwrite `playerData` values (name, level, XP, coins, friendsCount, streakDays)
// 3. Call `updateDashboardState()` to sync the UI elements automatically.
// =========================================================================

// ==========================================
// PLAYER DATA STATE (DYNAMIC BACKEND SYNC)
// ==========================================
let playerData = {
  name: "ACORN_HERO",
  level: 1,
  currentXP: 0,
  maxXP: 2550,
  avatarUrl: "",       // User avatar URL
  coins: 0,            // Total coins earned
  friendsCount: 0,     // Active/Online friends count
  streakDays: "0d"     // Current streak value
};

/**
 * Fetch user data from backend API (/me) and update dashboard state
 */
async function loadUserData() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    window.location.href = "authentication.html#login";
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:5000/me", {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
    });

    if (!response.ok) {
      sessionStorage.removeItem("token");
      window.location.href = "authentication.html#login";
      return;
    }

    const userData = await response.json();

    playerData.name = userData.username || "ACORN_HERO";
    playerData.level = userData.level || 1;
    playerData.currentXP = userData.currentXP || 0;
    playerData.maxXP = userData.maxXP || 2550;
    playerData.avatarUrl = userData.avatarUrl || "";

    // Sync from Backend, fallback to Account-Specific LocalStorage
    const userCoinKey = `coins_${playerData.name}`;
    const userStreakKey = `streak_${playerData.name}`;

    playerData.coins = userData.coins ?? parseInt(localStorage.getItem(userCoinKey)) ?? 0;
    playerData.streakDays = userData.streakDays ? `${userData.streakDays}d` : (localStorage.getItem(userStreakKey) || "0d");
    
    if (userData.checkInDates) {
      calendarState.checkInDates = userData.checkInDates;
    } else {
      loadPlayerCalendarData(); // Load account-specific dates from browser
    }

    updateDashboardState();
    renderMiniCalendar();
    renderFullCalendar();

  } catch (err) {
    console.error("Failed to connect to backend:", err);
  }
}

// ==========================================
// CORE UI FUNCTIONS
// ==========================================
/**
 * Updates all profile, coins, friends, and streak UI components
 */
function updateDashboardState() {
  // 1. Profile elements (Desktop & Mobile Modal)
  const levelElement = document.getElementById("player-level");
  const modalLevelElement = document.getElementById("modal-player-level");

  const nameElement = document.getElementById("player-name");
  const modalNameElement = document.getElementById("modal-player-name");
  const avatarNametagElement = document.getElementById("avatar-nametag"); // Name Tag Reference

  const xpBarFill = document.getElementById("xp-bar-fill");
  const modalXpBarFill = document.getElementById("modal-xp-bar-fill");

  const xpTextElement = document.getElementById("xp-text");
  const modalXpTextElement = document.getElementById("modal-xp-text");

  const avatarImg = document.getElementById("player-avatar");
  const modalAvatarImg = document.getElementById("modal-player-avatar");

  // 2. Status elements
  const friendsElement = document.getElementById("friends-count");
  const modalStreakVal = document.getElementById("modal-streak-val");
  const modalFriendsVal = document.getElementById("modal-friends-val");

  // Calculate XP percentage
  let percentage = (playerData.currentXP / playerData.maxXP) * 100;
  percentage = Math.min(Math.max(percentage, 0), 100);

  // Apply Level
  if (levelElement) levelElement.textContent = playerData.level;
  if (modalLevelElement) modalLevelElement.textContent = `LVL ${playerData.level}`;

  // Apply Name
  if (nameElement) nameElement.textContent = playerData.name;
  if (modalNameElement) modalNameElement.textContent = playerData.name;
  if (avatarNametagElement) avatarNametagElement.textContent = playerData.name;

  // Apply Avatars
  if (playerData.avatarUrl) {
    if (avatarImg) {
      avatarImg.src = playerData.avatarUrl;
      avatarImg.classList.remove("hidden");
    }
    if (modalAvatarImg) {
      modalAvatarImg.src = playerData.avatarUrl;
      modalAvatarImg.classList.remove("hidden");
    }
  }

  // Apply XP Bar Fills
  const applyBarWidth = (el) => {
    if (el) {
      el.style.width = `${percentage}%`;
      if (percentage > 0) {
        el.classList.add("border-r-4", "border-[#3D2013]");
      } else {
        el.classList.remove("border-r-4", "border-[#3D2013]");
      }
    }
  };
  applyBarWidth(xpBarFill);
  applyBarWidth(modalXpBarFill);

  // Apply XP Text
  const formattedCurrent = playerData.currentXP.toLocaleString();
  const formattedMax = playerData.maxXP.toLocaleString();
  const xpFormatted = `${formattedCurrent}/${formattedMax} XP`;

  if (xpTextElement) xpTextElement.textContent = xpFormatted;
  if (modalXpTextElement) modalXpTextElement.textContent = xpFormatted;

  // 3. Update Status Badges using querySelectorAll to catch duplicate IDs (Navbar + Modals)
  document.querySelectorAll('#coins-count').forEach(el => {
    el.textContent = playerData.coins.toLocaleString();
  });
  
  document.querySelectorAll('#streak-count').forEach(el => {
    el.textContent = playerData.streakDays;
  });

  if (friendsElement) friendsElement.textContent = playerData.friendsCount;
  if (modalStreakVal) modalStreakVal.textContent = `${playerData.streakDays} study`;
  if (modalFriendsVal) modalFriendsVal.textContent = playerData.friendsCount;
}

// Initialize on page load by calling loadUserData instead of static updateDashboardState
document.addEventListener("DOMContentLoaded", () => {
  loadUserData();
});


// ==========================================
// MODAL CONTROLLERS
// ==========================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("hidden");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("hidden");
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  updateDashboardState();
});

// ==========================================
// NAVIGATION CLICK HANDLER (MODAL PLACEHOLDER)
// ==========================================
function onNavClick(title, description) {
  const modalTitle = document.getElementById("nav-modal-title");
  const modalDesc = document.getElementById("nav-modal-desc");
  
  if (modalTitle) modalTitle.textContent = title.toUpperCase();
  if (modalDesc) modalDesc.textContent = description;
  
  openModal("nav-action-modal");
}

// ==========================================
// MODAL CONTROLLERS
// ==========================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("hidden");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("hidden");
}

/**
 * Toggles a modal open or closed.
 * If the modal is currently visible, it closes it; otherwise, it opens it.
 */
function toggleModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  if (modal.classList.contains("hidden")) {
    openModal(modalId);
  } else {
    closeModal(modalId);
  }
}

// ==========================================
// CHECKLIST MANAGEMENT SYSTEM
// ==========================================

// Initial default tasks state
let checklistData = [
];

// Temporary array used during editing inside the Add Task Modal
let draftChecklistData = [];

/**
 * Render main view checklist items
 */
function renderChecklist() {
  const total = checklistData.length;
  const completed = checklistData.filter((task) => task.completed).length;

  // 1. Update existing badge (if present)
  const taskCountBadge = document.getElementById("checklist-task-count");
  if (taskCountBadge) {
    taskCountBadge.textContent = `${completed}/${total} ${total === 1 ? 'Task' : 'Tasks'}`;
  }

  // 2. Update static bottom ratio text & progress bar
  const ratioText = document.getElementById("checklist-ratio-text");
  if (ratioText) {
    ratioText.textContent = `${completed}/${total} completed`;
  }

  const progressBar = document.getElementById("checklist-progress-bar");
  if (progressBar) {
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    progressBar.style.width = `${percentage}%`;
  }

  // 3. Render container tasks or empty state
  const container = document.getElementById("checklist-tasks-container");
  if (!container) return;

  if (checklistData.length === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full py-8 text-center gap-2">
        <p class="font-pixel text-2xl text-[#3D2013]">Add your task</p>
        <p class="font-pressstart text-[10px] text-[#3D2013]/70">Click + above to get started!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = checklistData.map((task) => `
    <div class="bg-[#FEF4E0] border-[2px] border-[#482A1D] p-2.5 flex items-start gap-3 w-full">
      <button onclick="toggleTaskCompletion(${task.id})" 
              class="w-5 h-5 border-[2px] border-[#482A1D] ${task.completed ? 'bg-[#788D55]' : 'bg-transparent'} flex items-center justify-center shrink-0 cursor-pointer mt-0.5">
        <svg class="w-3.5 h-3.5 text-[#FEF4E0] ${task.completed ? '' : 'hidden'}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </button>

      <span class="font-pixel text-lg leading-tight text-[#482A1D] break-words whitespace-normal flex-1 min-w-0 ${task.completed ? 'line-through opacity-60' : ''}">
        ${escapeHtml(task.text)}
      </span>
    </div>
  `).join('');
}

/**
 * Toggle task checkmark state from main checklist view
 */
function toggleTaskCompletion(id) {
  const task = checklistData.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    renderChecklist();
  }
}

/**
 * Open the Add Task Modal and copy actual state to draft state
 */
function openAddTaskModal() {
  draftChecklistData = JSON.parse(JSON.stringify(checklistData));
  renderDraftTaskList();
  openModal("add-task-modal");
}

/**
 * Render editable list inside the Add Task Modal
 */
function renderDraftTaskList() {
  const container = document.getElementById("edit-task-list");
  if (!container) return;

  // Empty state for draft modal
  if (draftChecklistData.length === 0) {
    container.innerHTML = `
      <div class="py-6 text-center">
        <p class="font-pixel text-xl text-[#3D2013]/70">Add your task by clicking "+ Add Task" below!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = draftChecklistData.map((task, index) => `
    <div class="flex items-center gap-2 w-full">
      <div class="bg-[#EBD9C4] border-[2px] border-[#482A1D] p-2 flex items-center gap-2.5 flex-1 min-w-0">
        <button onclick="toggleDraftTaskCompletion(${index})" 
                class="w-5 h-5 border-[2px] border-[#482A1D] ${task.completed ? 'bg-[#788D55]' : 'bg-transparent'} flex items-center justify-center shrink-0 cursor-pointer">
          <svg class="w-3.5 h-3.5 text-[#FEF4E0] ${task.completed ? '' : 'hidden'}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </button>

        <input type="text" 
               value="${escapeHtml(task.text)}" 
               oninput="updateDraftTaskText(${index}, this.value)"
               class="font-pixel text-xl leading-none text-[#482A1D] bg-transparent border-b border-transparent hover:border-[#482A1D]/40 focus:border-[#482A1D] focus:outline-none w-full truncate py-0.5"
               placeholder="Enter task name..." />
      </div>

      <button onclick="deleteDraftTaskRow(${index})" 
              title="Delete Task" 
              class="w-6 h-6 bg-[#A53914] border-[2px] border-[#482A1D] flex items-center justify-center text-[#FEF4E0] font-pressstart text-[10px] hover:brightness-110 active:scale-90 cursor-pointer shrink-0">
        ✕
      </button>
    </div>
  `).join('');
}

/**
 * Handle draft state updates
 */
function toggleDraftTaskCompletion(index) {
  if (draftChecklistData[index]) {
    draftChecklistData[index].completed = !draftChecklistData[index].completed;
    renderDraftTaskList();
  }
}

function updateDraftTaskText(index, val) {
  if (draftChecklistData[index]) {
    draftChecklistData[index].text = val;
  }
}

function deleteDraftTaskRow(index) {
  draftChecklistData.splice(index, 1);
  renderDraftTaskList();
}

function addNewTaskRow() {
  draftChecklistData.push({
    id: Date.now(),
    text: "", // Initialize as empty so unedited rows can be filtered out
    completed: false
  });
  renderDraftTaskList();
}

/**
 * Commit draft changes to main checklist state and update UI
 */
function saveTaskChanges() {
  // Filter out empty rows, whitespace-only rows, or unedited default text ("New Task")
  checklistData = draftChecklistData.filter(t => {
    if (!t || !t.text) return false;
    const trimmedText = t.text.trim();
    return trimmedText.length > 0 && trimmedText.toLowerCase() !== "new task";
  });
  
  renderChecklist();
  
  // Close the modal cleanly after saving
  if (typeof closeModal === "function") {
    closeModal("add-task-modal");
  } else {
    const modal = document.getElementById("add-task-modal");
    if (modal) modal.classList.add("hidden");
  }
}

// Utility function to escape raw strings for HTML inputs/content
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Ensure checklist initializes when DOM loads
document.addEventListener("DOMContentLoaded", () => {
  renderChecklist();
});

// ==========================================
// STUDY TIMER SYSTEM LOGIC
// ==========================================

let sessionStartTime = null; // Mag-i-store ng timestamp kung kailan pinindot ang START

const TECHNIQUES = {
  pomodoro: { name: "Pomodoro", study: 1 * 60, break: 1 * 60 },
  "5217": { name: "52-17", study: 52 * 60, break: 17 * 60 },
  "90min": { name: "90 Min", study: 90 * 60, break: 20 * 60 }
};

let timerState = {
  selectedTechnique: null, // 'pomodoro' | '5217' | '90min' | null
  totalSessions: 3,
  currentSession: 1,
  isBreak: false,
  secondsLeft: 0,
  totalSeconds: 0,
  isRunning: false,
  timerInterval: null
};

// Draft state for Edit Settings Modal
let tempSelectedTechnique = null;

/**
 * Restricts input field strictly to numbers
 */
function validateNumberInput(input) {
  input.value = input.value.replace(/[^0-9]/g, '');
  if (parseInt(input.value) === 0) input.value = "1";
}

/**
 * Handles technique selection styling inside the Edit Modal
 */
function selectTechnique(techKey) {
  tempSelectedTechnique = techKey;
  updateTechniqueButtonsUI();
}

/**
 * Updates UI of the three technique selection buttons
 */
function updateTechniqueButtonsUI() {
  const keys = ['pomodoro', '5217', '90min'];
  keys.forEach(key => {
    const btn = document.getElementById(`btn-tech-${key}`);
    if (!btn) return;

    if (tempSelectedTechnique === key) {
      // Chosen Style: Orange Fill, White Text
      btn.className = "flex-1 min-h-[56px] flex flex-col items-center justify-center gap-1.5 p-2 font-pressstart text-[8px] sm:text-[9px] bg-[#E87339] text-[#FFFFF6] border-[3px] border-[#3D2013] !rounded-none cursor-default transition-all duration-150";
    } else {
      // Unchosen Style: Cream Fill, Dark Text
      btn.className = "flex-1 min-h-[56px] flex flex-col items-center justify-center gap-1.5 p-2 font-pressstart text-[8px] sm:text-[9px] bg-[#FAE9CE] text-[#3D2013] border-[3px] border-[#3D2013] !rounded-none cursor-pointer flat-retro-shadow-hover transition-all duration-150";
    }
  });
}

/**
 * Opens Edit Settings Modal with initial states
 */
function openTimerEditModal() {
  // Default to pomodoro if they haven't selected one yet
  tempSelectedTechnique = timerState.selectedTechnique || 'pomodoro'; 
  const input = document.getElementById("session-input");
  if (input) input.value = timerState.totalSessions || 3;
  
  updateTechniqueButtonsUI();
  
  const modal = document.getElementById("timer-edit-modal");
  if (modal) modal.classList.remove("hidden");
}

/**
 * Commits settings from edit modal to main timer state
 */
function saveTimerSettings() {
  if (!tempSelectedTechnique) {
    closeModal("timer-edit-modal");
    return;
  }

  const input = document.getElementById("session-input");
  const sessions = parseInt(input.value) || 3;

  timerState.selectedTechnique = tempSelectedTechnique;
  timerState.totalSessions = sessions;
  timerState.currentSession = 1;
  timerState.isBreak = false;
  
  // Pause any active timer
  pauseTimer();

  // Reset duration to chosen technique study time
  const tech = TECHNIQUES[timerState.selectedTechnique];
  timerState.totalSeconds = tech.study;
  timerState.secondsLeft = tech.study;

  renderTimerUI();
  closeModal("timer-edit-modal");
}

/**
 * Updates all visual aspects of the main timer modal AND the mini-display
 */

const timerChannel = new BroadcastChannel('study_timer_channel');

function renderTimerUI() {
  const unselectedView = document.getElementById("timer-unselected-view");
  const activeView = document.getElementById("timer-active-view");
  const miniDisplay = document.getElementById("mini-timer-display");
  
  // NEW: Target the Checklist Header
  const checklistHeader = document.querySelector("#checklist-modal h3");

  if (!timerState.selectedTechnique) {
    if (unselectedView) {
      unselectedView.classList.remove("hidden");
      // Inject a big friendly button so they know where to click!
      unselectedView.innerHTML = `
        <div class="flex flex-col items-center gap-4 py-4">
          <p class="font-pixel text-xl sm:text-2xl text-[#3D2013]/70 text-center">No study technique chosen</p>
          <button onclick="openModal('timer-edit-modal')" class="font-pressstart text-[10px] bg-[#E87338] border-[2.5px] border-[#3D2013] text-[#FEF4E0] py-2.5 px-4 retro-shadow hover:scale-105 active:scale-95 transition-all cursor-pointer">
            CHOOSE TECHNIQUE
          </button>
        </div>
      `;
    }
    if (activeView) activeView.classList.add("hidden");
    
    // Optional reset state when no technique is active
    if (miniDisplay) {
      miniDisplay.textContent = "00:00";
      miniDisplay.style.color = "#A53914"; 
    }
    // Reset checklist header if timer is off
    if (checklistHeader) {
      checklistHeader.textContent = "CHECKLIST";
      checklistHeader.style.color = "#3D2013";
    }
    return;
  }

  if (unselectedView) unselectedView.classList.add("hidden");
  if (activeView) activeView.classList.remove("hidden");

  // Format MM:SS
  const mins = Math.floor(timerState.secondsLeft / 60);
  const secs = timerState.secondsLeft % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // BROADCAST TIME TO OTHER PAGES
  timerChannel.postMessage({
    formattedTime: formattedTime,
    isBreak: timerState.isBreak,
    isRunning: timerState.isRunning
  });
  
  const display = document.getElementById("timer-display");
  if (display) display.textContent = formattedTime;

  // Sync to Mini Timer Display
  if (miniDisplay) {
    miniDisplay.textContent = formattedTime;
    miniDisplay.style.color = timerState.isBreak ? "#788D55" : "#A53914";
  }

  // SYNC TO CHECKLIST HEADER
  if (checklistHeader) {
    checklistHeader.textContent = `CHECKLIST [${formattedTime}]`;
    checklistHeader.style.color = timerState.isBreak ? "#788D55" : "#A53914";
  }

  // Phase Label (FOCUS vs BREAK)
  const phaseLabel = document.getElementById("timer-phase-label");
  if (phaseLabel) {
    phaseLabel.textContent = timerState.isBreak ? "BREAK" : "FOCUS";
    phaseLabel.className = timerState.isBreak 
      ? "font-pressstart text-[8px] text-[#788D55] mt-1" 
      : "font-pressstart text-[8px] text-[#A53914] mt-1";
  }

  // Circular SVG Progress Calculation
  const circleProgress = document.getElementById("timer-circle-progress");
  if (circleProgress && timerState.totalSeconds > 0) {
    const maxOffset = 263.89; 
    const progressRatio = timerState.secondsLeft / timerState.totalSeconds;
    const dashOffset = maxOffset * (1 - progressRatio);
    circleProgress.style.strokeDashoffset = dashOffset;
    circleProgress.setAttribute("stroke", timerState.isBreak ? "#788D55" : "#E87338");
  }

  // Toggle Button Text & Icon
  const toggleText = document.getElementById("timer-toggle-text");
  const toggleIcon = document.getElementById("timer-toggle-icon");
  if (toggleText) toggleText.textContent = timerState.isRunning ? "PAUSE" : "START";
  if (toggleIcon) {
    toggleIcon.innerHTML = timerState.isRunning 
      ? `<rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />`
      : `<polygon points="5,3 19,12 5,21" />`;
  }

  // Session Ratio Text & Label
  const sessionLabel = document.getElementById("session-label-text");
  const techLabel = document.getElementById("technique-label-text");
  if (sessionLabel) {
    sessionLabel.textContent = `Session ${timerState.currentSession} of ${timerState.totalSessions}`;
  }
  if (techLabel) {
    techLabel.textContent = TECHNIQUES[timerState.selectedTechnique].name;
  }

  // Segmented Progress Bars
  renderSessionBars();
}

/**
 * Generates session ratio progress bars
 */
function renderSessionBars() {
  const container = document.getElementById("session-bars-container");
  if (!container) return;

  let barsHTML = "";
  for (let i = 1; i <= timerState.totalSessions; i++) {
    const isCompleted = i < timerState.currentSession;
    const isCurrent = i === timerState.currentSession;

    // FEF4E0 default background, FD923E when completed
    let bgClass = "bg-[#FEF4E0]";
    if (isCompleted) {
      bgClass = "bg-[#FD923E]";
    } else if (isCurrent && timerState.isBreak) {
      bgClass = "bg-[#E87338]"; // Optional highlight for break phase
    }

    barsHTML += `<div class="flex-1 h-full ${bgClass} border-[2px] border-[#3D2013] transition-colors duration-300"></div>`;
  }
  container.innerHTML = barsHTML;
}

/**
 * Timer Control Functions
 */
function toggleTimer() {
  if (timerState.isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  if (!timerState.selectedTechnique || timerState.isRunning) return;
  
  // Kung ito ang simula ng unang session, i-record ang timestamp
  if (!sessionStartTime && timerState.currentSession === 1 && !timerState.isBreak) {
    sessionStartTime = Date.now();
  }

  timerState.isRunning = true;
  timerState.timerInterval = setInterval(() => {
    if (timerState.secondsLeft > 0) {
      timerState.secondsLeft--;
      renderTimerUI();
    } else {
      handleTimerCompletion();
    }
  }, 1000);
  renderTimerUI();
}

function pauseTimer() {
  timerState.isRunning = false;
  if (timerState.timerInterval) clearInterval(timerState.timerInterval);
  renderTimerUI();
}

function resetTimer() {
  pauseTimer();
  if (timerState.selectedTechnique) {
    const tech = TECHNIQUES[timerState.selectedTechnique];
    timerState.secondsLeft = timerState.isBreak ? tech.break : tech.study;
    timerState.totalSeconds = timerState.secondsLeft;
  }
  renderTimerUI();
}

/**
 * Handles transition between study and break phases / next sessions
 */
function handleTimerCompletion() {
  pauseTimer();
  const tech = TECHNIQUES[timerState.selectedTechnique];

  if (!timerState.isBreak) {
    // Finished Focus -> Start Break Phase
    timerState.isBreak = true;
    timerState.totalSeconds = tech.break;
    timerState.secondsLeft = tech.break;
  } else {
    // Finished Break -> Move to Next Session
    timerState.isBreak = false;
    if (timerState.currentSession < timerState.totalSessions) {
      timerState.currentSession++;
      timerState.totalSeconds = tech.study;
      timerState.secondsLeft = tech.study;
    } else {
      // Completed All Sessions!
      
      // I-trigger ang function na magkokompyut at magpapadala ng data sa backend / database
      finalizeAndSaveSession();
      
      // Reset state
      timerState.currentSession = 1;
      timerState.totalSeconds = tech.study;
      timerState.secondsLeft = tech.study;
      sessionStartTime = null; // I-reset para sa susunod na session
    }
  }

  renderTimerUI();
}

// Bind open modal override
window.openModal = (function(originalOpenModal) {
  return function(modalId) {
    if (modalId === 'timer-edit-modal') {
      openTimerEditModal();
    } else {
      originalOpenModal(modalId);
    }
  };
})(window.openModal);

// Initialize Timer on Load
document.addEventListener("DOMContentLoaded", () => {
  renderTimerUI();
});


async function finalizeAndSaveSession() {
  const sessionEndTime = Date.now();
  
  // 1. Kunin ang oras ng pagsisimula (siguraduhing may variable kang 'sessionStartTime' kapag nag-uumpisa ang timer)
  const sessionStart = (typeof sessionStartTime !== 'undefined' && sessionStartTime) 
    ? sessionStartTime 
    : sessionEndTime - (45 * 60000); // Fallback kung sakaling walang start time

  // 2. Kunin ang tasks mula sa checklist
  const totalTasks = (typeof checklistData !== 'undefined' && checklistData.length > 0) ? checklistData.length : 3;
  const completedTasks = (typeof checklistData !== 'undefined' && checklistData.length > 0) 
    ? checklistData.filter(t => t.completed).length 
    : 3;

  // 3. Kunin ang Pre-Test at Post-Test scores mula kay Kitsu AI
  const testScores = (typeof retrieveAndClearTestScores === 'function') 
    ? retrieveAndClearTestScores() 
    : { preTest: 60, postTest: 90 };
  
  const preTestScore = testScores.preTest ?? 60;
  const postTestScore = testScores.postTest ?? 90;

  // 4. Kunin ang user streak mula sa sessionStorage
  const currentUserData = JSON.parse(sessionStorage.getItem("current_user") || "{}");
  const userStreak = currentUserData.streakDays || 7; 

  // 5. PATAKBURIN ANG ANALYTICS LOGIC ENGINE (Dito kinukuha ang tunay na XP, Coins, Duration, at Improvement)
  const sessionInput = {
    startTime: sessionStart,
    endTime: sessionEndTime,
    completedTasks: completedTasks,
    totalTasks: totalTasks,
    preTestScore: preTestScore,
    postTestScore: postTestScore,
    userStreak: userStreak
  };

  const computedResults = processSessionResults(sessionInput);

  // 6. I-SEND ANG MGA DATOS SA BACKEND PARA MA-SAVE SA DATABASE
  const token = sessionStorage.getItem("token");
  try {
    const response = await fetch("http://127.0.0.1:5000/api/session/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        durationMinutes: Math.round((sessionEndTime - sessionStart) / 60000),
        completedTasks,
        totalTasks,
        preTestScore,
        postTestScore,
        improvement: postTestScore - preTestScore,
        earnedXp: computedResults.rewards.xpEarned,
        earnedCoins: computedResults.rewards.coinsEarned
      })
    });

    if (response.ok) {
      const dbResult = await response.json();
      console.log("Session successfully saved to database!", dbResult);
    }
  } catch (err) {
    console.error("Failed to save session to backend:", err);
  }

  // 7. BUUIN ANG PAYLOAD PARA SA MODAL UI GAMIT ANG MGA TUNAY NA DATOS
  const realModalPayload = {
    sessionType: "structured",
    duration: computedResults.analytics.duration, // Halimbawa: "45m" o "1hr 15m"
    completedTasks: completedTasks,
    totalTasks: totalTasks,
    avgScore: postTestScore,
    user: {
      avatar: currentUserData.avatar_url || "https://api.dicebear.com/7.x/pixel-art/svg?seed=Angela",
      preTest: preTestScore,
      postTest: postTestScore,
      improvement: postTestScore - preTestScore
    },
    rewards: {
      level: currentUserData.level || 5,
      xpEarned: computedResults.rewards.xpEarned,
      coinsEarned: computedResults.rewards.coinsEarned,
      currentXp: currentUserData.currentXp || computedResults.rewards.xpEarned,
      nextLevelXp: currentUserData.nextLevelXp || 100,
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

  // 8. BUBUKSAN NA NG KUSA ANG MODAL AT IPAPAKITA ANG REAL DATA SA USER!
  if (typeof showSessionAnalytics === 'function') {
    showSessionAnalytics(realModalPayload);
  } else {
    console.error("showSessionAnalytics is not defined. Make sure analytics-modal.js is loaded.");
  }
}

/// ==========================================
// STUDY CALENDAR SYSTEM LOGIC
// ==========================================

let isTodayCheckedIn = false;
const calendarState = {
  viewDate: new Date(), 
  checkInDates: [] // Will be loaded dynamically per user
};

/**
 * Loads check-in dates specific to the currently logged-in player
 */
function loadPlayerCalendarData() {
  if (!playerData || !playerData.name) return;

  const userKey = `checkInDates_${playerData.name}`;
  calendarState.checkInDates = JSON.parse(localStorage.getItem(userKey)) || [];

  // Automatically check if the user needs to pop up the check-in modal on load
  checkDailyCheckInAutoPopup();
}

/**
 * Automatically checks if the user has already checked in today.
 * If not, it automatically opens the full-calendar modal on startup.
 */
function checkDailyCheckInAutoPopup() {
  const todayStr = formatDateKey(new Date());
  const isCheckedToday = calendarState.checkInDates.includes(todayStr);

  if (!isCheckedToday) {
    setTimeout(() => {
      if (typeof openModal === 'function') {
        openModal('full-calendar-modal');
      }
    }, 300);
  }
}

/**
 * Main Check-In Action handler (Account-specific)
 */
async function performCheckIn() {
  const todayStr = formatDateKey(new Date());
  if (!calendarState.checkInDates.includes(todayStr)) {
    calendarState.checkInDates.push(todayStr);
  
    
    // Increment streak numerically by 1
    let currentStreakNum = parseInt(playerData.streakDays) || 0;
    currentStreakNum += 1;
    playerData.streakDays = `${currentStreakNum}d`;

    // 1. SAVE LOCALLY USING UNIQUE USERNAME KEY
    const userKey = `checkInDates_${playerData.name}`;
    const coinKey = `coins_${playerData.name}`;
    const streakKey = `streak_${playerData.name}`;

    localStorage.setItem(userKey, JSON.stringify(calendarState.checkInDates));
    localStorage.setItem(coinKey, playerData.coins);
    localStorage.setItem(streakKey, playerData.streakDays);

    // Directly update Streak and Coins UI elements on screen
    const streakEl = document.getElementById("streak-display");
    if (streakEl) streakEl.textContent = playerData.streakDays;

    const coinsEl = document.getElementById("coins-display");
    if (coinsEl) coinsEl.textContent = playerData.coins;

    // Sync global dashboard state & Re-render UI components
    updateDashboardState();
    renderMiniCalendar();
    renderFullCalendar();

    // 2. SAVE TO BACKEND DATABASE
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        await fetch("http://127.0.0.1:5000/api/user/checkin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ 
            date: todayStr, 
            coins: playerData.coins, 
            streak: currentStreakNum 
          })
        });
      } catch (err) {
        console.warn("Backend check-in sync skipped or failed.", err);
      }
    }
  }
}

/**
 * Render Mini Calendar view (Inside the small desktop floating window)
 */
function renderMiniCalendar() {
  const container = document.getElementById("calendar-body");
  if (!container) return;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  const totalDays = new Date(year, month + 1, 0).getDate();
  const monthName = today.toLocaleString('default', { month: 'short' }).toUpperCase();

  let gridsHTML = '';
  for (let d = 1; d <= totalDays; d++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isChecked = calendarState.checkInDates.includes(dateKey);
    const isToday = d === today.getDate();

    // Highlights checked-in days with green background (#788D55)
    const bgClass = isChecked ? "bg-[#788D55] text-[#FEF4E0]" : "bg-[#FEF4E0] text-[#3D2013]";
    const borderClass = isToday ? "border-[#A53914] border-[2px]" : "border-[#482A1D]/30 border";

    gridsHTML += `
      <div title="${dateKey}" class="${bgClass} ${borderClass} h-6 flex items-center justify-center font-pressstart text-[8px] rounded-none select-none">
        ${d}
      </div>
    `;
  }

  container.innerHTML = `
    <div class="grid grid-cols-7 gap-1 overflow-y-auto pr-1 flex-1">
      ${gridsHTML}
    </div>
    <div class="flex items-center justify-between pt-2 mt-1 border-t border-[#482A1D]/20 shrink-0">
      <span class="font-pressstart text-xs text-[#3D2013]">${monthName} ${year}</span>
      <button onclick="openModal('full-calendar-modal')" class="font-pressstart text-[9px] text-[#E87338] hover:text-[#A53914] flex items-center gap-1.5 transition-colors cursor-pointer p-0.5">
        <span>VIEW FULL</span>
        <svg class="w-3 h-3 text-current" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
        </svg>
      </button>
    </div>
  `;
}

/**
 * Render Full Calendar view (Inside centered modal) - Fully patched with grid builder
 */
function renderFullCalendar() {
  const container = document.getElementById("full-calendar-grid");
  const monthHeader = document.getElementById("full-calendar-month-label");
  if (!container || !monthHeader) return;

  const viewYear = calendarState.viewDate.getFullYear();
  const viewMonth = calendarState.viewDate.getMonth();

  const monthName = calendarState.viewDate.toLocaleString('default', { month: 'long' }).toUpperCase();
  monthHeader.textContent = `${monthName} ${viewYear}`;

  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayStr = formatDateKey(new Date());

  let daysHTML = '';

  // Blank slots for start of month padding
  for (let i = 0; i < firstDayIndex; i++) {
    daysHTML += `<div class="h-9 sm:h-10 bg-transparent"></div>`;
  }

  // Day tiles loop
  for (let d = 1; d <= totalDays; d++) {
    const dateKey = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isChecked = calendarState.checkInDates.includes(dateKey);
    const isToday = dateKey === todayStr;

    // Highlights checked-in days with green background (#788D55)
    const bgStyle = isChecked 
      ? "bg-[#788D55] text-[#FEF4E0] border-[#3D2013]" 
      : "bg-[#FEF4E0] text-[#3D2013] border-[#3D2013]";
    
    const todayRing = isToday ? "ring-2 ring-[#E87338] ring-offset-1" : "";

    daysHTML += `
      <div class="h-9 sm:h-10 border-[2px] ${bgStyle} ${todayRing} flex items-center justify-center font-pressstart text-[10px] sm:text-[11px] relative select-none">
        ${d}
      </div>
    `;
  }

  container.innerHTML = daysHTML;

  // Toggle Check-in Button / Status message
  const checkInBtn = document.getElementById("calendar-checkin-btn");
  const checkInMsg = document.getElementById("calendar-checked-msg");

  if (checkInBtn && checkInMsg) {
    // ✅ Direktang i-check kung kasama na ang todayStr sa checkInDates array
    const isCheckedToday = calendarState.checkInDates.includes(todayStr);

    if (isCheckedToday) {
      checkInBtn.classList.add("hidden");
      checkInMsg.classList.remove("hidden");
    } else {
      checkInBtn.classList.remove("hidden");
      checkInMsg.classList.add("hidden");
    }
  }
}

/**
 * Calendar Navigation (Previous / Next Month)
 */
function changeCalendarMonth(offset) {
  calendarState.viewDate.setMonth(calendarState.viewDate.getMonth() + offset);
  renderFullCalendar();
}

// Ensure Calendars initialize on load
document.addEventListener("DOMContentLoaded", () => {
  loadPlayerCalendarData();
  renderMiniCalendar();
  renderFullCalendar();
});

// ==========================================
// KITSU AI SPARKLE CHAT LOGIC (Homepage Connected)
// ==========================================

async function sendSparkleMessage() {
  const input = document.getElementById("sparkle-chat-input");
  const container = document.getElementById("sparkle-chat-container");
  if (!input || !container) return;

  const text = input.value.trim();
  if (text.length === 0) return;

  // 1. Render User Message Box (#FCB980 BG)
  const userMsgHTML = `
    <div class="self-end max-w-[85%] bg-[#FCB980] border-[2px] border-[#482A1D] p-2.5 shadow-[2px_2px_0px_#482A1D]">
      <p class="font-pixel text-lg leading-snug text-[#3D2013] break-words">
        ${escapeHtml(text)}
      </p>
    </div>
  `;
  container.insertAdjacentHTML("beforeend", userMsgHTML);

  // Clear input and scroll down
  input.value = "";
  scrollToBottomSparkleChat();

  // 2. Connect to the working backend route
  const token = sessionStorage.getItem("token");

  try {
    const response = await fetch("http://127.0.0.1:5000/api/kitsu-ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();
    
    // 👉 Binasa natin ang 'response' at 'error' na galing sa parehong backend route mo
    const aiReply = data.response || data.error || "Kitsu is resting right now! Try again later. 🐾";

    // Render Kitsu AI Response Box (#DCDDC9 BG)
    const aiMsgHTML = `
      <div class="self-start max-w-[85%] bg-[#DCDDC9] border-[2px] border-[#482A1D] p-2.5 shadow-[2px_2px_0px_#482A1D]">
        <p class="font-pixel text-lg leading-snug text-[#3D2013] break-words">
          ${escapeHtml(aiReply)}
        </p>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", aiMsgHTML);
    scrollToBottomSparkleChat();

  } catch (err) {
    console.error("Kitsu AI chat error:", err);
    const errorMsgHTML = `
      <div class="self-start max-w-[85%] bg-[#DCDDC9] border-[2px] border-[#482A1D] p-2.5 shadow-[2px_2px_0px_#482A1D]">
        <p class="font-pixel text-lg leading-snug text-[#3D2013] break-words">
          Oops! Kitsu lost connection to the server. 🐾
        </p>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", errorMsgHTML);
    scrollToBottomSparkleChat();
  }
}

/**
 * Scrolls the chat container to the latest message
 */
function scrollToBottomSparkleChat() {
  const container = document.getElementById("sparkle-chat-container");
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

/**
 * Monitors scroll position to toggle the lower-right floating arrow button
 */
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("sparkle-chat-container");
  const scrollBtn = document.getElementById("sparkle-scroll-btn");

  if (container && scrollBtn) {
    container.addEventListener("scroll", () => {
      const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
      if (distanceFromBottom > 60) {
        scrollBtn.classList.remove("hidden");
      } else {
        scrollBtn.classList.add("hidden");
      }
    });
  }
});
// ==========================================
// KITSU AI SPARKLE CHAT RESIZE OBSERVER
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const sparkleWindow = document.getElementById("sparkle-window");

  if (sparkleWindow && window.ResizeObserver) {
    const resizeObserver = new ResizeObserver(() => {
      scrollToBottomSparkleChat();
    });

    resizeObserver.observe(sparkleWindow);
  }
});




// ==========================================
// FRIENDS LIST & CHAT SYSTEM LOGIC (DATABASE CONNECTED)
// ==========================================

// Current Friends list state loaded from database
let friendsList = [];

// Active chat partner state
let activeChatFriendId = null;
let friendChatHistory = {}; // Stores messages key-value: { friendId: [ {sender, text} ] }

// Active open context cloud menu ID
let openMenuFriendId = null;

// Auto-sync interval reference for live chat polling
let chatAutoSyncInterval = null;

/**
 * Fetch real friends list from the Flask database backend
 */
async function fetchFriendsList() {
  const token = sessionStorage.getItem("token");
  if (!token) return;

  try {
    const response = await fetch("http://127.0.0.1:5000/api/friends", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      friendsList = data.friends || [];
      renderFriendsList();
    }
  } catch (err) {
    console.error("Failed to load friends from database:", err);
  }
}

/**
 * Render all friends into Online and Offline sections
 */
function renderFriendsList() {
  const onlineContainer = document.getElementById("friends-online-list");
  const offlineContainer = document.getElementById("friends-offline-list");
  const onlineBadge = document.getElementById("friends-online-badge");
  const offlineBadge = document.getElementById("friends-offline-badge");

  if (!onlineContainer || !offlineContainer) return;

  const onlineFriends = friendsList.filter(f => f.isOnline);
  const offlineFriends = friendsList.filter(f => !f.isOnline);

  // Update counters
  if (onlineBadge) onlineBadge.textContent = onlineFriends.length;
  if (offlineBadge) offlineBadge.textContent = offlineFriends.length;

  // Sync state header/badge if playerData exists
  if (typeof playerData !== 'undefined') {
    playerData.friendsCount = onlineFriends.length;
    if (typeof updateDashboardState === 'function') {
      updateDashboardState();
    }
  }

  // Render function helper
  const generateFriendCardHTML = (friend) => `
    <div class="relative bg-[#FAE9CE] border-[2px] border-[#3D2013] p-2 flex items-center justify-between hover:bg-[#F6DBBC]/50 transition-colors cursor-pointer group"
         onclick="handleFriendCardClick(event, ${friend.id})">
      
      <!-- LEFT: AVATAR + NAME & LEVEL -->
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="relative shrink-0">
          <div class="w-9 h-9 rounded-full border-[2px] border-[#3D2013] bg-[#FAE9CE] flex items-center justify-center overflow-hidden">
            ${friend.avatarUrl 
              ? `<img src="${friend.avatarUrl}" class="w-full h-full object-cover">` 
              : `<span class="font-pressstart text-xs text-[#3D2013]">${friend.name.charAt(0)}</span>`}
          </div>
          <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-[1.5px] border-[#3D2013] ${friend.isOnline ? 'bg-[#788D55]' : 'bg-[#B29E8A]'}"></div>
        </div>
        
        <div class="flex flex-col truncate">
          <span class="font-pressstart text-[10px] text-[#3D2013] truncate">${escapeHtml(friend.name)}</span>
          <span class="font-pixel text-sm text-[#3D2013]/70 leading-none">LVL ${friend.level}</span>
        </div>
      </div>

      <!-- RIGHT: THREE DOT BUTTON -->
      <div class="relative shrink-0">
        <button onclick="toggleFriendContextMenu(event, ${friend.id})" 
                title="Options" 
                class="w-7 h-7 flex items-center justify-center text-[#3D2013] hover:bg-[#3D2013]/10 rounded transition-colors cursor-pointer">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="2"/>
            <circle cx="12" cy="12" r="2"/>
            <circle cx="12" cy="19" r="2"/>
          </svg>
        </button>

        <!-- CHAT CLOUD CONTEXT MENU (RECTANGULAR WITH ARROW) -->
        <div id="friend-menu-${friend.id}" 
             class="hidden absolute right-0 top-8 z-30 w-44 bg-[#FEF4E0] border-[2px] border-[#3D2013] p-1.5 flex flex-col gap-1 rounded-lg">
          
          <!-- ARROW POINTING UP TO THREE DOTS -->
          <div class="absolute -top-[7px] right-2.5 w-3 h-3 bg-[#FEF4E0] border-t-[2px] border-l-[2px] border-[#3D2013] rotate-45"></div>

          <!-- OPTION 1: SEND MESSAGE -->
          <button onclick="openFriendChatModal(event, ${friend.id})" 
                  class="w-full flex items-center gap-2 p-1.5 hover:bg-[#788D55] hover:text-[#FEF4E0] text-[#3D2013] transition-colors rounded-none group/btn text-left cursor-pointer">
            <svg class="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
            </svg>
            <span class="font-pressstart text-[8px]">Send Message</span>
          </button>

          <!-- OPTION 2: UNFRIEND (RED) -->
          <button onclick="removeFriend(event, ${friend.id})" 
                  class="w-full flex items-center gap-2 p-1.5 hover:bg-[#A53914] hover:text-[#FEF4E0] text-[#A53914] transition-colors rounded-none group/btn text-left cursor-pointer">
            <svg class="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
            </svg>
            <span class="font-pressstart text-[8px]">Unfriend</span>
          </button>

        </div>
      </div>

    </div>
  `;

  onlineContainer.innerHTML = onlineFriends.length > 0 
    ? onlineFriends.map(generateFriendCardHTML).join('') 
    : `<p class="font-pixel text-base text-[#3D2013]/50 italic px-1">No study buddies online</p>`;

  offlineContainer.innerHTML = offlineFriends.length > 0 
    ? offlineFriends.map(generateFriendCardHTML).join('') 
    : `<p class="font-pixel text-base text-[#3D2013]/50 italic px-1">No offline friends</p>`;
}

/**
 * Toggle custom cloud menu below three dot
 */
function toggleFriendContextMenu(event, friendId) {
  event.stopPropagation();

  if (openMenuFriendId && openMenuFriendId !== friendId) {
    const prevMenu = document.getElementById(`friend-menu-${openMenuFriendId}`);
    if (prevMenu) prevMenu.classList.add("hidden");
  }

  const currentMenu = document.getElementById(`friend-menu-${friendId}`);
  if (currentMenu) {
    currentMenu.classList.toggle("hidden");
    openMenuFriendId = currentMenu.classList.contains("hidden") ? null : friendId;
  }
}

// Close open menus when clicking anywhere else
document.addEventListener("click", () => {
  if (openMenuFriendId) {
    const menu = document.getElementById(`friend-menu-${openMenuFriendId}`);
    if (menu) menu.classList.add("hidden");
    openMenuFriendId = null;
  }
});

/**
 * Handles clicking a friend card container directly
 */
function handleFriendCardClick(event, friendId) {
  if (event.target.closest("button")) return;
  openFriendChatModal(event, friendId);
}

/**
 * Remove/Unfriend pipeline using real database API
 */
async function removeFriend(event, friendId) {
  event.stopPropagation();
  const token = sessionStorage.getItem("token");

  try {
    const response = await fetch(`http://127.0.0.1:5000/api/friends/remove/${friendId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.ok) {
      friendsList = friendsList.filter(f => f.id !== friendId);
      if (openMenuFriendId === friendId) openMenuFriendId = null;
      renderFriendsList();
      showFriendsToast("Friend removed", false);
    }
  } catch (err) {
    console.error("Failed to remove friend:", err);
  }
}

/**
 * Toast notification handler
 */
function showFriendsToast(message, isSuccess = true) {
  const toast = document.getElementById("friends-toast");
  const msgEl = document.getElementById("friends-toast-msg");
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.className = `absolute -top-12 left-3 right-3 p-2 border-[2px] border-[#3D2013] flex items-center justify-between z-20 ${
    isSuccess ? 'bg-[#788D55] text-[#FEF4E0]' : 'bg-[#A53914] text-[#FEF4E0]'
  }`;

  toast.classList.remove("hidden");
  setTimeout(() => { hideFriendsToast(); }, 3500);
}

function hideFriendsToast() {
  const toast = document.getElementById("friends-toast");
  if (toast) toast.classList.add("hidden");
}

/**
 * Friend Search / Add pipeline using real database API
 */
async function handleAddFriendSearch() {
  const input = document.getElementById("friend-search-input");
  if (!input) return;

  const usernameQuery = input.value.trim();
  if (!usernameQuery) return;

  const token = sessionStorage.getItem("token");

  try {
    const response = await fetch("http://127.0.0.1:5000/api/friends/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ username: usernameQuery })
    });

    const data = await response.json();
    if (response.ok) {
      showFriendsToast(data.message, true);
      input.value = "";
      fetchFriendsList(); // Refresh list from database
    } else {
      showFriendsToast(data.error || "User doesn't exist", false);
    }
  } catch (err) {
    console.error("Error adding friend:", err);
    showFriendsToast("Server error adding friend", false);
  }

  input.value = "";
}

/**
 * CHAT MODAL LOGIC WITH DATABASE FETCHING
 */
async function openFriendChatModal(event, friendId) {
  if (event) event.stopPropagation();

  const friend = friendsList.find(f => f.id === friendId);
  if (!friend) return;
  activeChatFriendId = friendId;

  // Set Modal Header
  const usernameEl = document.getElementById("chat-modal-username");
  const statusEl = document.getElementById("chat-modal-status");
  const fallbackEl = document.getElementById("chat-modal-avatar-fallback");
  
  if (usernameEl) usernameEl.textContent = friend.name;
  if (statusEl) {
    statusEl.textContent = friend.isOnline ? "Online" : "Offline";
    statusEl.className = `font-pixel text-sm leading-none ${friend.isOnline ? 'text-[#788D55]' : 'text-[#3D2013]/50'}`;
  }
  if (fallbackEl) fallbackEl.textContent = friend.name.charAt(0);

  // Fetch real chat history from database backend
  const token = sessionStorage.getItem("token");
  try {
    const response = await fetch(`http://127.0.0.1:5000/api/chat/${friendId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (response.ok) {
      const data = await response.json();
      friendChatHistory[friendId] = data.messages.map(m => ({
        sender: m.sender_id === friendId ? friend.name : "me",
        text: m.text
      }));
    }
  } catch (err) {
    console.error("Failed to load chat history:", err);
  }

  renderFriendChatMessages();
  
  if (openMenuFriendId) {
    const menu = document.getElementById(`friend-menu-${openMenuFriendId}`);
    if (menu) menu.classList.add("hidden");
    openMenuFriendId = null;
  }

  openModal("friend-chat-modal");

  // Clear any existing background poll interval
  if (chatAutoSyncInterval) clearInterval(chatAutoSyncInterval);

  // Start real-time background polling to automatically fetch incoming messages every 2 seconds
  chatAutoSyncInterval = setInterval(async () => {
    if (!activeChatFriendId) return;

    try {
      const pollResponse = await fetch(`http://127.0.0.1:5000/api/chat/${activeChatFriendId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (pollResponse.ok) {
        const pollData = await pollResponse.json();
        const activeFriend = friendsList.find(f => f.id === activeChatFriendId);
        const friendName = activeFriend ? activeFriend.name : "Friend";

        const newHistory = pollData.messages.map(m => ({
          sender: m.sender_id === activeChatFriendId ? friendName : "me",
          text: m.text
        }));

        // Update view only if message length changes to keep UI smooth
        const oldLength = (friendChatHistory[activeChatFriendId] || []).length;
        if (newHistory.length !== oldLength) {
          friendChatHistory[activeChatFriendId] = newHistory;
          renderFriendChatMessages();
        }
      }
    } catch (pollErr) {
      console.error("Auto-sync chat error:", pollErr);
    }
  }, 2000);
}

function renderFriendChatMessages() {
  const container = document.getElementById("friend-chat-messages-container");
  if (!container || !activeChatFriendId) return;
  
  const messages = friendChatHistory[activeChatFriendId] || [];

  container.innerHTML = messages.map(msg => {
    const isMe = msg.sender === "me";
    return `
      <div class="${isMe ? 'self-end bg-[#E87338] text-[#FEF4E0]' : 'self-start bg-[#DCDDC9] text-[#3D2013]'} max-w-[85%] border-[2px] border-[#482A1D] p-2 shadow-[2px_2px_0px_#482A1D]">
        <p class="font-pixel text-lg leading-snug break-words">${escapeHtml(msg.text)}</p>
      </div>
    `;
  }).join('');

  container.scrollTop = container.scrollHeight;
}

/**
 * Send chat message and store to database backend
 */
async function sendFriendChatMessage() {
  const input = document.getElementById("friend-chat-input");
  if (!input || !activeChatFriendId) return;
  
  const text = input.value.trim();
  if (!text) return;

  const token = sessionStorage.getItem("token");

  try {
    const response = await fetch("http://127.0.0.1:5000/api/chat/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ receiver_id: activeChatFriendId, text: text })
    });

    if (response.ok) {
      if (!friendChatHistory[activeChatFriendId]) {
        friendChatHistory[activeChatFriendId] = [];
      }
      friendChatHistory[activeChatFriendId].push({ sender: "me", text });
      input.value = "";
      renderFriendChatMessages();
    }
  } catch (err) {
    console.error("Failed to send message:", err);
  }
}

// Fetch friends list from database on initial load
document.addEventListener("DOMContentLoaded", () => {
  fetchFriendsList();

  // Background sync for friends list status every 5 seconds
  setInterval(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      fetch("http://127.0.0.1:5000/api/friends", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.friends) {
          friendsList = data.friends;
          renderFriendsList();
        }
      })
      .catch(() => {});
    }
  }, 5000);
});

// ==========================================
// MODAL CLOSE OVERRIDE FOR AUTO-CLOSING CHAT
// ==========================================
const baseCloseModal = window.closeModal;
window.closeModal = function(modalId) {
  if (modalId === 'friends-modal' || modalId === 'friend-chat-modal') {
    // Clear chat polling when chat modal closes
    if (chatAutoSyncInterval) {
      clearInterval(chatAutoSyncInterval);
      chatAutoSyncInterval = null;
    }
    if (modalId === 'friends-modal') {
      const chatModal = document.getElementById('friend-chat-modal');
      if (chatModal) chatModal.classList.add('hidden');
    }
  }
  if (typeof baseCloseModal === 'function') {
    baseCloseModal(modalId);
  } else {
    document.getElementById(modalId)?.classList.add('hidden');
  }
};

// ==========================================
// FRIEND CHAT SCROLL & RESIZE LOGIC
// ==========================================
function scrollToBottomFriendChat() {
  const container = document.getElementById("friend-chat-messages-container");
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("friend-chat-messages-container");
  const scrollBtn = document.getElementById("friend-scroll-btn");

  if (container && scrollBtn) {
    container.addEventListener("scroll", () => {
      const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
      if (distanceFromBottom > 60) {
        scrollBtn.classList.remove("hidden");
      } else {
        scrollBtn.classList.add("hidden");
      }
    });
  }

  const friendWindow = document.getElementById("friend-chat-window");
  if (friendWindow && window.ResizeObserver) {
    const resizeObserver = new ResizeObserver(() => {
      scrollToBottomFriendChat();
    });
    resizeObserver.observe(friendWindow);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const handle = document.getElementById("friend-chat-resize-handle");
  const windowEl = document.getElementById("friend-chat-window");

  if (!handle || !windowEl) return;

  let isResizing = false;
  let startX, startY, startWidth, startHeight;

  handle.addEventListener("mousedown", (e) => {
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = windowEl.offsetWidth;
    startHeight = windowEl.offsetHeight;
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;

    // Dragging top-left increases dimensions as mouse moves left/up
    const newWidth = Math.min(Math.max(startWidth + (startX - e.clientX), 300), 550);
    const newHeight = Math.min(Math.max(startHeight + (startY - e.clientY), 280), 520);

    windowEl.style.width = `${newWidth}px`;
    windowEl.style.height = `${newHeight}px`;
  });

  document.addEventListener("mouseup", () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.userSelect = "";
    }
  });
});

// ==========================================
// GLOBAL BACKGROUND CHAT LISTENER (AUTO-POPUP CHAT)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  // Mag-check ng mga bagong mensahe sa lahat ng kaibigan tuwing 3 segundo
  setInterval(async () => {
    const token = sessionStorage.getItem("token");
    if (!token || typeof friendsList === 'undefined' || friendsList.length === 0) return;

    for (const friend of friendsList) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/chat/${friend.id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          const messages = data.messages || [];
          if (messages.length === 0) continue;

          const lastMessage = messages[messages.length - 1];
          const isFromFriend = String(lastMessage.sender_id) === String(friend.id);

          // Gamitin ang sessionStorage para malaman ang huling bilang ng mensahe na nakita na
          const storageKey = `last_msg_count_${friend.id}`;
          const lastStoredCount = parseInt(sessionStorage.getItem(storageKey) || "-1", 10);

          // 1. KUNG FIRST TIME PA LANG I-LOAD SA SESSION NA ITO:
          // Itabi lang natin ang baseline count, HUWAG mag-popup para hindi mabulabog pagpunta ng homepage.
          if (lastStoredCount === -1) {
            sessionStorage.setItem(storageKey, messages.length);
            friendChatHistory[friend.id] = messages.map(m => ({
              sender: m.sender_id === friend.id ? friend.name : "me",
              text: m.text
            }));
            continue;
          }

          // 2. KUNG MAY TUNAY NA BAGONG MENSAHE NA DUMATING (Nadagdagan ang bilang ng messages):
          if (messages.length > lastStoredCount) {
            // I-update ang stored count sa sessionStorage
            sessionStorage.setItem(storageKey, messages.length);

            // I-update ang chat history
            friendChatHistory[friend.id] = messages.map(m => ({
              sender: m.sender_id === friend.id ? friend.name : "me",
              text: m.text
            }));

            // Kung galing sa kaibigan ang bagong mensahe, saka lang natin i-trigger ang POP-UP!
            if (isFromFriend) {
              const chatModal = document.getElementById("friend-chat-modal");
              const isChatOpen = chatModal && !chatModal.classList.contains("hidden");

              if (isChatOpen && activeChatFriendId === friend.id) {
                // Kung nakabukas na ang chat nila, i-render lang ang bagong mensahe
                renderFriendChatMessages();
              } else {
                // Kung sarado, KUSA NITONG IISCREEN-POP UP ANG CHAT BOX
                if (typeof openFriendChatModal === 'function') {
                  activeChatFriendId = friend.id;
                  
                  const usernameEl = document.getElementById("chat-modal-username");
                  const statusEl = document.getElementById("chat-modal-status");
                  const fallbackEl = document.getElementById("chat-modal-avatar-fallback");
                  
                  if (usernameEl) usernameEl.textContent = friend.name;
                  if (statusEl) {
                    statusEl.textContent = friend.isOnline ? "Online" : "Offline";
                    statusEl.className = `font-pixel text-sm leading-none ${friend.isOnline ? 'text-[#788D55]' : 'text-[#3D2013]/50'}`;
                  }
                  if (fallbackEl) fallbackEl.textContent = friend.name.charAt(0);

                  renderFriendChatMessages();
                  if (chatModal) chatModal.classList.remove("hidden");
                }
              }
            }
          }
        }
      } catch (err) {
        // Silent catch para hindi magka-error sa console
      }
    }
  }, 3000);
});

// ==========================================
// 🎓 KITSU INTERACTIVE TUTORIAL SYSTEM
// ==========================================

const tutorialSteps = [
  {
    // Step 1: Welcome (Centered)
    targetSelector: null,
    position: "center",
    title: "Hi there! I'm Kitsu!",
    message: "Welcome to StudyCircle! Let me show you around so you can get started!"
  },
  {
    // Step 2: Tasks Checklist
    targetSelector: 'button[onclick*="checklist-modal"]',
    position: "side",
    title: "Tasks Checklist",
    message: "Add your tasks here and complete them to earn Coins and Level Up."
  },
  {
    // Step 3: Study Timer
    targetSelector: 'button[onclick*="timer-modal"]',
    position: "side",
    title: "Study Timer",
    message: "Choose your preferred study technique and keep track of your study sessions with the built-in timer."
  },
  {
    // Step 4: Calendar and Streak
    targetSelector: 'button[onclick*="calendar-modal"]',
    position: "side",
    title: "Calendar and Streak",
    message: "Check in daily to build your streak! Keep your streak alive by checking in to get rewards."
  },
  {
    // Step 5: AI Sparkle Assistance
    targetSelector: 'button[onclick*="sparkle-modal"]',
    position: "side",
    title: "AI Assistance",
    message: "Click here to chat with Kitsu! Ask questions, get study tips, and receive help whenever you need it."
  },
  {
    // Step 6: Study Coins
    targetSelector: '.user-coin-balance', // Target parent container or coin badge
    position: "under",
    title: "Study Coins",
    message: "This is where you can view your Study Coins. Earn coins by completing tasks and use them to customize your character and room."
  },
  {
    // Step 7: Add Friends
    targetSelector: 'button[onclick*="friends-modal"]',
    position: "under",
    title: "Add Friends",
    message: "Connect with friends by sending or accepting friend requests. Study together and stay motivated!"
  },
  {
    // Step 8: Streak Status Button
    targetSelector: 'button[onclick*="full-calendar-modal"]',
    position: "under",
    title: "Streak",
    message: "Keep your streak alive by checking in every day. The longer your streak, the greater your achievement!"
  },
  {
    // Step 9: Final Step (Centered)
    targetSelector: null,
    position: "center",
    title: "You’re All Set!",
    message: "You're ready to begin your study journey. Complete tasks, stay consistent, and have fun learning with Kitsu!"
  }
];

let currentTutorialStep = 0;

/**
 * Checks if tutorial should run automatically on page load
 */
function checkAndStartTutorial() {
  // CHANGED: Now looks in sessionStorage
  const isPending = sessionStorage.getItem("pendingTutorial") === "true";
  if (isPending) {
    startTutorial();
  }
}

/**
 * Initializes and presents the tutorial system
 */
function startTutorial() {
  currentTutorialStep = 0;
  const overlay = document.getElementById("tutorial-overlay");
  if (overlay) overlay.classList.remove("hidden");
  renderTutorialStep();
}

// Keep track of the elevated element across steps
let activeElevatedElement = null;

function renderTutorialStep() {
  const step = tutorialSteps[currentTutorialStep];
  if (!step) return;

  // 1. RESET PREVIOUS STEP: Remove high z-index from the previous element
  if (activeElevatedElement) {
    activeElevatedElement.classList.remove("z-[999]", "relative");
    activeElevatedElement = null;
  }

  const titleEl = document.getElementById("tutorial-title");
  const msgEl = document.getElementById("tutorial-message");
  const nextBtn = document.getElementById("tutorial-next-btn");
  const skipBtn = document.getElementById("tutorial-skip-btn");
  const container = document.getElementById("tutorial-bubble-container");
  const spotlight = document.getElementById("tutorial-spotlight");

  // Update text
  if (titleEl) titleEl.textContent = step.title;
  if (msgEl) msgEl.textContent = step.message;

  // Update button labels
  const isLast = currentTutorialStep === tutorialSteps.length - 1;
  if (nextBtn) nextBtn.textContent = isLast ? "Done" : "NEXT";
  if (skipBtn) {
    if (isLast) skipBtn.classList.add("hidden");
    else skipBtn.classList.remove("hidden");
  }

  // 2. FIND & ELEVATE CURRENT STEP TARGET ONLY
  let targetElement = null;
  if (step.targetSelector) {
    targetElement = document.querySelector(step.targetSelector);
    if (targetElement && step.targetSelector.includes("user-coin-balance")) {
      targetElement = targetElement.closest('#tut-coins-container') || targetElement;
    }
  }

  if (targetElement && step.position !== "center") {
    // Elevate ONLY this active step's target above the backdrop overlay
    targetElement.classList.add("z-[999]", "relative");
    activeElevatedElement = targetElement;

    const rect = targetElement.getBoundingClientRect();

    // Position spotlight glow box over active element
    if (spotlight) {
      spotlight.style.top = `${rect.top - 6}px`;
      spotlight.style.left = `${rect.left - 6}px`;
      spotlight.style.width = `${rect.width + 12}px`;
      spotlight.style.height = `${rect.height + 12}px`;
      spotlight.classList.remove("hidden");
    }

    // Position speech bubble next to/under target element
    container.style.position = "absolute";
    if (step.position === "under") {
      container.style.top = `${Math.min(window.innerHeight - 300, rect.bottom + 16)}px`;
      container.style.left = `${Math.max(16, Math.min(window.innerWidth - container.offsetWidth - 16, rect.left + rect.width / 2 - container.offsetWidth / 2))}px`;
    } else if (step.position === "side") {
      if (window.innerWidth < 640) {
        container.style.top = `${Math.min(window.innerHeight - 320, rect.bottom + 16)}px`;
        container.style.left = "50%";
        container.style.transform = "translateX(-50%)";
      } else {
        container.style.top = `${Math.max(16, rect.top)}px`;
        const placeRight = rect.left < window.innerWidth / 2;
        container.style.left = placeRight 
          ? `${rect.right + 16}px` 
          : `${rect.left - container.offsetWidth - 16}px`;
        container.style.transform = "none";
      }
    }
  } else {
    // Centered step (e.g., Welcome or Finish screen)
    if (spotlight) spotlight.classList.add("hidden");
    container.style.position = "relative";
    container.style.top = "auto";
    container.style.left = "auto";
    container.style.transform = "none";
  }
}

/**
 * Moves to next step or finishes tutorial
 */
function nextTutorialStep() {
  if (currentTutorialStep < tutorialSteps.length - 1) {
    currentTutorialStep++;
    renderTutorialStep();
  } else {
    completeTutorial();
  }
}

/**
 * Skips and closes tutorial
 */
function confirmSkipTutorial() {
  closeModal('skip-tutorial-modal');
  completeTutorial();
}

/**
 * Clears flags and closes tutorial UI
 */
function completeTutorial() {
  if (activeElevatedElement) {
    activeElevatedElement.classList.remove("z-[999]", "relative");
    activeElevatedElement = null;
  }
  
  // Changed from localStorage to sessionStorage to keep tab sessions independent
  sessionStorage.setItem("pendingTutorial", "false");
  sessionStorage.setItem("tutorialCompleted", "true");

  const overlay = document.getElementById("tutorial-overlay");
  if (overlay) overlay.classList.add("hidden");
}

// Automatically check on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  // Small delay ensures layout & target buttons are rendered before calculating positions
  setTimeout(checkAndStartTutorial, 300);
});

// ==========================================
// LOFI AUDIO PLAYER LOGIC
// ==========================================

const lofiTracks = [
  { name: "Cozy Coffee Shop", src: "ASSETS/BGM/LOFI1.mp3" },
  { name: "Late Night Rain", src: "ASSETS/BGM/LOFI2.mp3" },
  { name: "Midnight Study", src: "ASSETS/BGM/LOFI3.mp3" },
  { name: "Pixel Dreams", src: "ASSETS/BGM/LOFI4.mp3" }
];

let currentTrackIndex = 0;

function getAudioPlayer() {
  return document.getElementById("lofi-audio-player");
}

function initLofiPlayer() {
  const audio = getAudioPlayer();
  if (!audio) return;

  // Set initial source and volume
  audio.src = lofiTracks[currentTrackIndex].src;
  audio.volume = 0.5;

  // Sync state when track ends
  audio.addEventListener("ended", () => {
    updateLofiUI(false);
  });
}

function toggleLofiPlay() {
  const audio = getAudioPlayer();
  if (!audio) return;

  if (audio.paused) {
    audio.play().then(() => {
      updateLofiUI(true);
    }).catch(err => {
      console.warn("Playback blocked or track not found:", err);
    });
  } else {
    audio.pause();
    updateLofiUI(false);
  }
}

function changeLofiTrack(index) {
  const audio = getAudioPlayer();
  if (!audio) return;

  currentTrackIndex = parseInt(index, 10);
  const track = lofiTracks[currentTrackIndex];
  
  audio.src = track.src;
  
  const titleDisplay = document.getElementById("lofi-current-title");
  if (titleDisplay) titleDisplay.textContent = track.name;

  // Play automatically on change if audio was already active
  if (!audio.paused || document.getElementById("lofi-vinyl-icon")?.classList.contains("animate-spin-slow")) {
    audio.play().then(() => {
      updateLofiUI(true);
    }).catch(err => console.warn(err));
  }
}

function setLofiVolume(val) {
  const audio = getAudioPlayer();
  if (audio) {
    audio.volume = parseFloat(val);
  }
}

function updateLofiUI(isPlaying) {
  const vinylIcon = document.getElementById("lofi-vinyl-icon");
  const playIcon = document.getElementById("lofi-play-icon");
  const playText = document.getElementById("lofi-play-text");
  const playBtn = document.getElementById("lofi-play-btn");
  const titleDisplay = document.getElementById("lofi-current-title");

  if (titleDisplay) {
    titleDisplay.textContent = lofiTracks[currentTrackIndex].name;
  }

  if (isPlaying) {
    if (vinylIcon) vinylIcon.classList.add("animate-spin-slow");
    if (playIcon) playIcon.textContent = "❚❚";
    if (playText) playText.textContent = "PAUSE";
    if (playBtn) {
      playBtn.classList.remove("bg-[#788D55]");
      playBtn.classList.add("bg-[#A53914]");
    }
  } else {
    if (vinylIcon) vinylIcon.classList.remove("animate-spin-slow");
    if (playIcon) playIcon.textContent = "▶";
    if (playText) playText.textContent = "PLAY";
    if (playBtn) {
      playBtn.classList.remove("bg-[#A53914]");
      playBtn.classList.add("bg-[#788D55]");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initLofiPlayer();
});


// ==========================================
// LEADERBOARD OVERLAY MODAL LOGIC
// ==========================================
function openLeaderboardModal() {
  const iframe = document.getElementById("leaderboard-frame");
  
  // Set iframe source only when opening to delay loading resource
  if (iframe && iframe.src !== window.location.origin + "/leaderboard.html") {
    iframe.src = "leaderboard.html";
  }
  
  openModal("leaderboard-modal");
}

function closeLeaderboardModal() {
  closeModal("leaderboard-modal");
}

/**
 * Utility function to format a Date object into 'YYYY-MM-DD'
 */
function formatDateKey(date) {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}


// ==========================================
// DAILY STREAK CALENDAR AUTO-POPUP
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // Delay slightly to let the rest of the UI and avatars render first
  setTimeout(() => {
    // Rely on the existing formatDateKey function you already built
    const todayStr = formatDateKey(new Date());
    const lastVisit = localStorage.getItem("lastStudyCircleVisit");
    
    // If the user hasn't visited yet today, pop up the calendar
    if (lastVisit !== todayStr) {
      localStorage.setItem("lastStudyCircleVisit", todayStr);
      openModal("full-calendar-modal");
    }
  }, 800); 
});


function renderNotifications() {
  // Subukan nating ilagay o hanapin ang kahit anong container sa page mo
  let container = document.getElementById("notifications-container");
  
  // Kung wala pang container sa HTML mo, gawa tayo ng automatic pop-up o ilagay sa itaas ng body
  if (!container) {
    container = document.createElement("div");
    container.id = "notifications-container";
    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.right = "20px";
    container.style.zIndex = "9999";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";
    document.body.appendChild(container);
  }

  // Kunin LAHAT ng imbitasyon sa localStorage nang walang filter muna para sigurado
  const notifications = JSON.parse(localStorage.getItem("userNotifications") || "[]");
  
  if (notifications.length === 0) {
    return; // Huwag na munang magpakita ng 'No new notifications' para hindi makaistorbo sa UI
  }

  container.innerHTML = notifications.map(notif => `
    <div class="flex flex-col gap-2 p-3 bg-[#FEF4E0] border-[3px] border-[#3D2013] shadow-lg" style="min-width: 250px;">
      <p class="font-pressstart text-[8px] text-[#3D2013]">${notif.message}</p>
      <div class="flex items-center justify-between">
        <span class="font-pressstart text-[7px] text-[#3D2013]/65">${notif.timestamp}</span>
        <button onclick="acceptRoomInvite('${notif.roomCode}', '${notif.id}')" 
                class="bg-[#FD923E] text-[#3D2013] font-pressstart text-[8px] px-3 py-1 border-[2px] border-[#3D2013] cursor-pointer hover:brightness-105">
          Accept & Join
        </button>
      </div>
    </div>
  `).join('');
}

function acceptRoomInvite(roomCode, notificationId) {
  // 1. Tanggalin muna ang notification sa localStorage gamit ang ID nito
  let allNotifications = JSON.parse(localStorage.getItem("userNotifications") || "[]");
  allNotifications = allNotifications.filter(notif => notif.id !== notificationId);
  localStorage.setItem("userNotifications", JSON.stringify(allNotifications));

  // 2. I-save ang current joined room sa session
  sessionStorage.setItem("currentJoinedRoom", roomCode);
  sessionStorage.setItem("activeRoomId", roomCode);

  // 3. I-refresh o i-re-render ang notifications para mawala na agad sa screen ang na-click na box
  if (typeof renderNotifications === 'function') {
    renderNotifications();
  }

  alert(`Successfully joined room ${roomCode}! Entering room...`);

  // 4. Pumasok na sa room gamit ang mismong enterRoom function ng system mo
  if (typeof enterRoom === 'function') {
    enterRoom(roomCode);
  } else {
    window.location.href = `generated-homepage.html?room=${roomCode}`;
  }
}


// --- KITSU AI SCORE RETRIEVAL FOR HOMEPAGE ---
function retrieveAndClearTestScores() {
  const storedPre = localStorage.getItem('current_pre_test');
  const storedPost = localStorage.getItem('current_post_test');
  
  // Gamitin ang '??' para kung null/undefined lang siya magiging 0. 
  // Kung 0 ang naka-save, tatanggapin na niya ang 0 at hindi na mag-f-fallback sa 72/84.
  const preTest = storedPre !== null ? parseFloat(storedPre) : 0;
  const postTest = storedPost !== null ? parseFloat(storedPost) : 0;
  
  // Linisin na pagkatapos kunin
  localStorage.removeItem('current_pre_test');
  localStorage.removeItem('current_post_test');
  
  return { preTest, postTest };
}