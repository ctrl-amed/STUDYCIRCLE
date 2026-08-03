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
// PLAYER DATA STATE
// ==========================================
const playerData = {
  name: "ACORN_HERO",
  level: 99,
  currentXP: 1000,
  maxXP: 10000,
  avatarUrl: "",       // BACKEND: User avatar URL
  coins: 12234,        // BACKEND: Total coins earned
  friendsCount: 5,     // BACKEND: Active/Online friends count
  streakDays: "2d"     // BACKEND: Current streak value (e.g., "2d" or 2)
};

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
  const avatarNametagElement = document.getElementById("avatar-nametag"); // 👈 Added Name Tag Reference

  const xpBarFill = document.getElementById("xp-bar-fill");
  const modalXpBarFill = document.getElementById("modal-xp-bar-fill");

  const xpTextElement = document.getElementById("xp-text");
  const modalXpTextElement = document.getElementById("modal-xp-text");

  const avatarImg = document.getElementById("player-avatar");
  const modalAvatarImg = document.getElementById("modal-player-avatar");

  // 2. Status elements
  const coinsElement = document.getElementById("coins-count");
  const friendsElement = document.getElementById("friends-count");
  const streakElement = document.getElementById("streak-count");
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
  if (avatarNametagElement) avatarNametagElement.textContent = playerData.name; // 👈 Set Name Tag Text

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

  // 3. Update Status Badges
  if (coinsElement) coinsElement.textContent = playerData.coins.toLocaleString();
  if (friendsElement) friendsElement.textContent = playerData.friendsCount;
  if (streakElement) streakElement.textContent = playerData.streakDays;
  if (modalStreakVal) modalStreakVal.textContent = `${playerData.streakDays} study`;
  if (modalFriendsVal) modalFriendsVal.textContent = playerData.friendsCount;
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
    text: "New Task",
    completed: false
  });
  renderDraftTaskList();
}

/**
 * Commit draft changes to main checklist state and update UI
 */
function saveTaskChanges() {
  checklistData = draftChecklistData.filter(t => t.text.trim().length > 0);
  renderChecklist();
  closeModal("add-task-modal");
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

const TECHNIQUES = {
  pomodoro: { name: "Pomodoro", study: 1 * 60, break: 5 * 60 },
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
  tempSelectedTechnique = timerState.selectedTechnique;
  const input = document.getElementById("session-input");
  if (input) input.value = timerState.totalSessions;
  
  updateTechniqueButtonsUI();
  
  // Directly reveal the modal element to avoid the recursive loop
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

  // --- NEW: Grab the Mini Timer Display element ---
  const miniDisplay = document.getElementById("mini-timer-display");

  if (!timerState.selectedTechnique) {
    if (unselectedView) unselectedView.classList.remove("hidden");
    if (activeView) activeView.classList.add("hidden");
    
    // Optional reset state when no technique is active
    if (miniDisplay) {
      miniDisplay.textContent = "00:00";
      miniDisplay.style.color = "#A53914"; // Default terracotta
    }
    return;
  }

  if (unselectedView) unselectedView.classList.add("hidden");
  if (activeView) activeView.classList.remove("hidden");

  // Format MM:SS
  const mins = Math.floor(timerState.secondsLeft / 60);
  const secs = timerState.secondsLeft % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // --- BROADCAST TIME TO OTHER PAGES ---
  timerChannel.postMessage({
    formattedTime: formattedTime,
    isBreak: timerState.isBreak,
    isRunning: timerState.isRunning
  });
  
  const display = document.getElementById("timer-display");
  if (display) display.textContent = formattedTime;

  // --- NEW: Sync MM:SS and dynamic colors to the Mini Timer Display ---
  if (miniDisplay) {
    miniDisplay.textContent = formattedTime;

    if (timerState.isBreak) {
      // Break Phase: Green (#788D55)
      miniDisplay.style.color = "#788D55";
    } else {
      // Study Phase: Orange / Terracotta (#A53914)
      miniDisplay.style.color = "#A53914";
    }
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
    const maxOffset = 263.89; // 2 * PI * r (r=42)
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
      alert("Great job! All study sessions completed.");
      timerState.currentSession = 1;
      timerState.totalSeconds = tech.study;
      timerState.secondsLeft = tech.study;
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

// ==========================================
// STUDY CALENDAR SYSTEM LOGIC
// ==========================================

const calendarState = {
  viewDate: new Date(), // Tracks currently displayed month/year in full calendar
  // BACKEND INTEGRATION: Array of checked-in dates in "YYYY-MM-DD" format
  checkInDates: [
    "2026-07-20",
    "2026-07-21",
    "2026-07-22"
  ]
};

/**
 * Format Date object to "YYYY-MM-DD" string
 */
function formatDateKey(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Checks if today's date is already checked in
 */
function isTodayCheckedIn() {
  const todayStr = formatDateKey(new Date());
  return calendarState.checkInDates.includes(todayStr);
}

/**
 * Main Check-In Action handler
 */
function performCheckIn() {
  const todayStr = formatDateKey(new Date());
  if (!calendarState.checkInDates.includes(todayStr)) {
    calendarState.checkInDates.push(todayStr);
    
    // Reward user (Backend Hook: update database)
    playerData.coins += 50; 
    
    // Increment streak numerically if formatted like "2d"
    let currentStreakNum = parseInt(playerData.streakDays) || 0;
    currentStreakNum += 1;
    playerData.streakDays = `${currentStreakNum}d`;

    // Sync global dashboard state
    updateDashboardState();
    
    // Re-render calendar UI views
    renderMiniCalendar();
    renderFullCalendar();
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
  
  // Get days count for current month
  const totalDays = new Date(year, month + 1, 0).getDate();
  const monthName = today.toLocaleString('default', { month: 'short' }).toUpperCase();

  let gridsHTML = '';
  for (let d = 1; d <= totalDays; d++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isChecked = calendarState.checkInDates.includes(dateKey);
    const isToday = d === today.getDate();

    // Default: Cream fill | Checked: Green fill (#788D55)
    const bgClass = isChecked ? "bg-[#788D55] text-[#FEF4E0]" : "bg-[#FEF4E0] text-[#3D2013]";
    const borderClass = isToday ? "border-[#A53914] border-[2px]" : "border-[#482A1D]/30 border";

    gridsHTML += `
      <div title="${dateKey}" class="${bgClass} ${borderClass} h-6 flex items-center justify-center font-pressstart text-[8px] rounded-none select-none">
        ${d}
      </div>
    `;
  }

  container.innerHTML = `
    <!-- Mini Grid Display (Top Area) -->
    <div class="grid grid-cols-7 gap-1 overflow-y-auto pr-1 flex-1">
      ${gridsHTML}
    </div>

    <!-- Bottom Month Label & Text Button Row -->
    <div class="flex items-center justify-between pt-2 mt-1 border-t border-[#482A1D]/20 shrink-0">
      <span class="font-pressstart text-xs text-[#3D2013]">${monthName} ${year}</span>
      
      <!-- VIEW FULL BUTTON (Text & Icon Only) -->
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
 * Render Full Calendar view (Inside centered modal)
 */
function renderFullCalendar() {
  const container = document.getElementById("full-calendar-grid");
  const monthHeader = document.getElementById("full-calendar-month-label");
  if (!container || !monthHeader) return;

  const viewYear = calendarState.viewDate.getFullYear();
  const viewMonth = calendarState.viewDate.getMonth();

  // Set Header Title
  const monthName = calendarState.viewDate.toLocaleString('default', { month: 'long' }).toUpperCase();
  monthHeader.textContent = `${monthName} ${viewYear}`;

  // First day offset (0 = Sun, 1 = Mon...)
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();

  const todayStr = formatDateKey(new Date());

  let daysHTML = '';

  // Blank slots for start of month padding
  for (let i = 0; i < firstDayIndex; i++) {
    daysHTML += `<div class="h-9 sm:h-10 bg-transparent"></div>`;
  }

  // Day tiles
  for (let d = 1; d <= totalDays; d++) {
    const dateKey = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isChecked = calendarState.checkInDates.includes(dateKey);
    const isToday = dateKey === todayStr;

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
    if (isTodayCheckedIn()) {
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
  renderMiniCalendar();
  renderFullCalendar();
});

// ==========================================
// KITSU AI SPARKLE CHAT LOGIC
// ==========================================

/**
 * Handles sending a message, rendering user/AI boxes, and triggering response
 */
function sendSparkleMessage() {
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

  // Clear input
  input.value = "";
  scrollToBottomSparkleChat();

  // 2. Simulate AI Response (Connect your backend API here)
  setTimeout(() => {
    const aiMsgHTML = `
      <div class="self-start max-w-[85%] bg-[#DCDDC9] border-[2px] border-[#482A1D] p-2.5 shadow-[2px_2px_0px_#482A1D]">
        <p class="font-pixel text-lg leading-snug text-[#3D2013] break-words">
          I received: "${escapeHtml(text)}". Let's crush your study goals today!
        </p>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", aiMsgHTML);
    scrollToBottomSparkleChat();
  }, 600);
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
      // Reveal button if user scrolls up more than 60px from bottom
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
      // Keep chat scrolled to bottom when window size changes
      scrollToBottomSparkleChat();
    });

    resizeObserver.observe(sparkleWindow);
  }
});




// ==========================================
// FRIENDS LIST & CHAT SYSTEM LOGIC
// ==========================================

// Mock database users for search test
const knownUsersDatabase = [
  { id: 101, name: "KITSU_MASTER", level: 12, isOnline: true, avatarUrl: "" },
  { id: 102, name: "PIXEL_SAMURAI", level: 8, isOnline: false, avatarUrl: "" },
  { id: 103, name: "NEON_STUDY", level: 15, isOnline: true, avatarUrl: "" }
];

// Current Friends list state
let friendsList = [
  { id: 1, name: "PANDA_BEAR", level: 5, isOnline: true, avatarUrl: "" },
  { id: 2, name: "OTTER_LOVER", level: 14, isOnline: true, avatarUrl: "" },
  { id: 3, name: "COFFEE_GURU", level: 9, isOnline: true, avatarUrl: "" },
  { id: 4, name: "NIGHT_OWL", level: 21, isOnline: false, avatarUrl: "" },
  { id: 5, name: "RETRO_KID", level: 3, isOnline: false, avatarUrl: "" }
];

// Active chat partner state
let activeChatFriendId = null;
let friendChatHistory = {}; // Stores messages key-value: { friendId: [ {sender, text} ] }

// Active open context cloud menu ID
let openMenuFriendId = null;

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

  // Sync state header/badge
  playerData.friendsCount = onlineFriends.length;
  updateDashboardState();

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
  // Prevent trigger if clicking three dots or dropdown items
  if (event.target.closest("button")) return;
  openFriendChatModal(event, friendId);
}

/**
 * Remove/Unfriend pipeline
 */
function removeFriend(event, friendId) {
  event.stopPropagation();
  friendsList = friendsList.filter(f => f.id !== friendId);
  
  if (openMenuFriendId === friendId) openMenuFriendId = null;
  
  renderFriendsList();
  showFriendsToast("Friend removed", false);
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
 * Friend Search / Add pipeline
 */
function handleAddFriendSearch() {
  const input = document.getElementById("friend-search-input");
  if (!input) return;

  const query = input.value.trim().toUpperCase();
  if (!query) return;

  // Check if already friends
  const alreadyFriend = friendsList.find(f => f.name.toUpperCase() === query);
  if (alreadyFriend) {
    showFriendsToast(`${query} is already your friend!`, false);
    input.value = "";
    return;
  }

  // Check database
  const foundUser = knownUsersDatabase.find(u => u.name.toUpperCase() === query);
  if (foundUser) {
    friendsList.push({ ...foundUser, id: Date.now() });
    renderFriendsList();
    showFriendsToast(`${foundUser.name} added successfully!`, true);
  } else {
    showFriendsToast("User doesn't exist", false);
  }

  input.value = "";
}

/**
 * CHAT MODAL LOGIC
 */
function openFriendChatModal(event, friendId) {
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

  // Initialize messages array if empty
  if (!friendChatHistory[friendId]) {
    friendChatHistory[friendId] = [
      { sender: friend.name, text: `Hey! Let's study together today!` }
    ];
  }

  renderFriendChatMessages();
  
  if (openMenuFriendId) {
    const menu = document.getElementById(`friend-menu-${openMenuFriendId}`);
    if (menu) menu.classList.add("hidden");
    openMenuFriendId = null;
  }

  openModal("friend-chat-modal");
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

function sendFriendChatMessage() {
  const input = document.getElementById("friend-chat-input");
  if (!input || !activeChatFriendId) return;
  
  const text = input.value.trim();
  if (!text) return;

  if (!friendChatHistory[activeChatFriendId]) {
    friendChatHistory[activeChatFriendId] = [];
  }

  friendChatHistory[activeChatFriendId].push({ sender: "me", text });
  input.value = "";
  renderFriendChatMessages();
}

// Ensure friends list renders on initial load
document.addEventListener("DOMContentLoaded", () => {
  renderFriendsList();
});

// ==========================================
// MODAL CLOSE OVERRIDE FOR AUTO-CLOSING CHAT
// ==========================================
const baseCloseModal = window.closeModal;
window.closeModal = function(modalId) {
  if (modalId === 'friends-modal') {
    // Automatically close friend chat modal if Friends list is closed
    const chatModal = document.getElementById('friend-chat-modal');
    if (chatModal) chatModal.classList.add('hidden');
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
  const isPending = localStorage.getItem("pendingTutorial") === "true";
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
  localStorage.setItem("pendingTutorial", "false");
  localStorage.setItem("tutorialCompleted", "true");

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