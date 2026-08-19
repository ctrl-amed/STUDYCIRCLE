// --- START SESSION WORKFLOW STATE ---
let sessionState = {
  workType: "reading", // default selection
  tasks: [],           // list of tasks added by user
  technique: "pomodoro", // default study technique
  customSessions: 1,   // if non-recommended technique chosen
  timerInterval: null,
  timeLeft: 25 * 60,   // default pomodoro focus time in seconds
  isFocusPhase: true,
  currentSessionNum: 1,
  totalSessions: 4,
  isRunning: false
};

// Technique configurations
const techniqueConfigs = {
  pomodoro: { focus: 25 * 60, break: 5 * 60, name: "Pomodoro" },
  "52-17": { focus: 52 * 60, break: 17 * 60, name: "52-17" },
  "90m": { focus: 90 * 60, break: 20 * 60, name: "90m Focus" }
};

document.addEventListener("DOMContentLoaded", () => {
  // Bind click event to all Start Session triggers
  document.querySelectorAll("#start-session-btn").forEach(btn => {
    btn.addEventListener("click", openStartSessionModal);
  });
});

// --- STEP 1: OPEN MODAL & WORK TYPE SELECTION ---
function openStartSessionModal() {
  const modal = document.getElementById("start-session-modal");
  if (modal) {
    modal.classList.remove("hidden");
    renderSessionStep1();
  }
}

function closeStartSessionModal() {
  const modal = document.getElementById("start-session-modal");
  if (modal) modal.classList.add("hidden");
}

function renderSessionStep1() {
  const container = document.getElementById("modal-step-container");
  const types = ["reading", "writing", "review", "Practice", "memorize", "creation"];

  container.innerHTML = `
    <div class="flex flex-col gap-2 pb-2 border-b-[2px] border-[#3D2013]/20">
      <h3 class="font-pressstart text-[12px] sm:text-[14px] text-[#3D2013]">WHAT ARE YOU WORKING ON?</h3>
      <p class="font-pixel text-[16px] sm:text-[18px] text-[#3D2013]/80">Choose the type of work you want to focus on.</p>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2">
      ${types.map(t => `
        <button onclick="selectWorkType('${t}')" class="work-type-btn font-pressstart text-[9px] p-3 uppercase border-[2px] border-[#3D2013] transition-all cursor-pointer ${sessionState.workType === t ? 'bg-[#E87339] text-[#FFFFF6]' : 'bg-[#FAE9CE] text-[#3D2013] hover:bg-[#f3dcba]'}" data-type="${t}">
          ${t}
        </button>
      `).join('')}
    </div>
    <div class="flex items-center justify-between pt-2 border-t-[2px] border-[#3D2013]/20">
      <button onclick="closeStartSessionModal()" class="font-pressstart text-[9px] bg-[#FAE9CE] text-[#3D2013] border-[2px] border-[#3D2013] px-3 py-2 cursor-pointer">CANCEL</button>
      <button onclick="renderSessionStep2()" class="font-pressstart text-[9px] bg-[#E87339] text-[#FFFFF6] border-[2px] border-[#3D2013] px-3 py-2 cursor-pointer">CONTINUE</button>
    </div>
  `;
}

window.selectWorkType = function(type) {
  sessionState.workType = type;
  document.querySelectorAll('.work-type-btn').forEach(btn => {
    if(btn.dataset.type === type) {
      btn.className = "work-type-btn font-pressstart text-[9px] p-3 uppercase border-[2px] border-[#3D2013] transition-all cursor-pointer bg-[#E87339] text-[#FFFFF6]";
    } else {
      btn.className = "work-type-btn font-pressstart text-[9px] p-3 uppercase border-[2px] border-[#3D2013] transition-all cursor-pointer bg-[#FAE9CE] text-[#3D2013] hover:bg-[#f3dcba]";
    }
  });
};

// --- STEP 2: TASK MANAGEMENT ---
function renderSessionStep2() {
  const container = document.getElementById("modal-step-container");
  
  container.innerHTML = `
    <div class="flex flex-col gap-2 pb-2 border-b-[2px] border-[#3D2013]/20">
      <h3 class="font-pressstart text-[12px] sm:text-[14px] text-[#3D2013]">WHAT’S YOUR TASK?</h3>
      <p class="font-pixel text-[16px] sm:text-[18px] text-[#3D2013]/80">Tell us what you want to accomplish during this session.</p>
    </div>
    
    <div class="flex flex-col gap-2 max-h-[40vh] overflow-y-auto p-1" id="task-input-list">
      <div class="flex gap-2">
        <input type="text" id="new-task-input" placeholder="Add a new task..." class="font-pixel text-[16px] bg-[#FAE9CE] border-[2px] border-[#3D2013] px-3 py-1.5 flex-1 text-[#3D2013] outline-none" />
        <button onclick="addTaskItem()" class="font-pressstart text-[8px] bg-[#E87339] text-[#FFFFF6] border-[2px] border-[#3D2013] px-3 py-2 cursor-pointer">ADD</button>
      </div>
      <div id="active-task-cards" class="flex flex-col gap-1.5 mt-2">
        ${sessionState.tasks.map((task, idx) => renderTaskCardHtml(task, idx)).join('')}
      </div>
    </div>

    <div class="flex items-center justify-between pt-2 border-t-[2px] border-[#3D2013]/20">
      <button onclick="renderSessionStep1()" class="font-pressstart text-[9px] bg-[#FAE9CE] text-[#3D2013] border-[2px] border-[#3D2013] px-3 py-2 cursor-pointer">BACK</button>
      <button onclick="renderSessionStep3()" class="font-pressstart text-[9px] bg-[#E87339] text-[#FFFFF6] border-[2px] border-[#3D2013] px-3 py-2 cursor-pointer">CONTINUE</button>
    </div>
  `;
}

window.addTaskItem = function() {
  const input = document.getElementById("new-task-input");
  const val = input.value.trim();
  if(val) {
    sessionState.tasks.push({ text: val, completed: false });
    input.value = "";
    renderSessionStep2();
  }
};

window.removeTaskItem = function(index) {
  sessionState.tasks.splice(index, 1);
  renderSessionStep2();
};

function renderTaskCardHtml(task, index) {
  return `
    <div class="flex items-center justify-between bg-[#FAE9CE] border-[1.5px] border-[#3D2013] p-2 rounded-[6px]">
      <span class="font-pixel text-[16px] text-[#3D2013] truncate flex-1">${task.text}</span>
      <button onclick="removeTaskItem(${index})" class="text-red-600 font-pressstart text-[8px] px-2 py-1 cursor-pointer">REMOVE</button>
    </div>
  `;
}

// --- STEP 3: STUDY TECHNIQUE RECOMMENDATION ---
function renderSessionStep3() {
  const container = document.getElementById("modal-step-container");
  const isRecommended = sessionState.technique === "pomodoro";

  container.innerHTML = `
    <div class="flex flex-col gap-2 pb-2 border-b-[2px] border-[#3D2013]/20">
      <h3 class="font-pressstart text-[12px] sm:text-[14px] text-[#3D2013]">RECOMMENDED FOR YOU</h3>
      <p class="font-pixel text-[16px] sm:text-[18px] text-[#3D2013]/80">Today’s study plan.</p>
    </div>

    <div class="flex flex-col gap-3 py-2">
      <div class="bg-[#FAE9CE] border-[2px] border-[#3D2013] p-3 rounded-[8px] flex flex-col gap-1">
        <span class="font-pressstart text-[9px] text-[#E87339]">Recommended Technique</span>
        <span class="font-pressstart text-[11px] text-[#3D2013]">Pomodoro (25m Focus | 5m Break)</span>
      </div>

      <div class="flex gap-2 justify-center">
        <button onclick="selectTechnique('pomodoro')" class="tech-btn font-pressstart text-[8px] px-3 py-2 border-[2px] border-[#3D2013] cursor-pointer ${sessionState.technique === 'pomodoro' ? 'bg-[#E87339] text-[#FFFFF6]' : 'bg-[#FAE9CE] text-[#3D2013]'}">Pomodoro</button>
        <button onclick="selectTechnique('52-17')" class="tech-btn font-pressstart text-[8px] px-3 py-2 border-[2px] border-[#3D2013] cursor-pointer ${sessionState.technique === '52-17' ? 'bg-[#E87339] text-[#FFFFF6]' : 'bg-[#FAE9CE] text-[#3D2013]'}>52-17</button>
        <button onclick="selectTechnique('90m')" class="tech-btn font-pressstart text-[8px] px-3 py-2 border-[2px] border-[#3D2013] cursor-pointer ${sessionState.technique === '90m' ? 'bg-[#E87339] text-[#FFFFF6]' : 'bg-[#FAE9CE] text-[#3D2013]'}>90m</button>
      </div>

      <div id="session-number-container" class="${isRecommended ? 'hidden' : 'flex'} flex-col gap-1.5 pt-2">
        <label class="font-pressstart text-[8px] text-[#3D2013]">Enter Session Number / Target:</label>
        <input type="number" id="session-num-input" value="${sessionState.customSessions}" min="1" class="font-pixel text-[16px] bg-[#FAE9CE] border-[2px] border-[#3D2013] px-3 py-1.5 text-[#3D2013] outline-none" />
      </div>
    </div>

    <div class="flex items-center justify-between pt-2 border-t-[2px] border-[#3D2013]/20">
      <button onclick="renderSessionStep2()" class="font-pressstart text-[9px] bg-[#FAE9CE] text-[#3D2013] border-[2px] border-[#3D2013] px-3 py-2 cursor-pointer">BACK</button>
      <button onclick="launchActiveSession()" class="font-pressstart text-[9px] bg-[#E87339] text-[#FFFFF6] border-[2px] border-[#3D2013] px-3 py-2 cursor-pointer">
        ${isRecommended ? 'User Recommendation' : 'Continue with this technique'}
      </button>
    </div>
  `;
}

window.selectTechnique = function(tech) {
  sessionState.technique = tech;
  sessionState.timeLeft = techniqueConfigs[tech].focus;
  renderSessionStep3();
};

// --- LAUNCH ACTIVE SESSION & REPLACE CARDS ---
window.launchActiveSession = function() {
  const numInput = document.getElementById("session-num-input");
  if(numInput) {
    sessionState.customSessions = parseInt(numInput.value) || 1;
    sessionState.totalSessions = sessionState.customSessions;
  } else {
    sessionState.totalSessions = 4; // Default for pomodoro recommendation
  }

  closeStartSessionModal();
  inflateActiveSessionUI();
  inflateRecentActivityTasksUI();
};

function inflateActiveSessionUI() {
  const card1 = document.getElementById("active-session-card");
  if (!card1) return;

  card1.className = "bg-gradient-to-b from-[#FDE4D0] to-[#FFD2AE] border-[2px] border-[#3D2013] rounded-[12px] p-4 sm:p-6 shadow-md flex flex-col justify-between gap-4 relative";
  card1.innerHTML = `
    <div class="flex items-center justify-between">
      <span class="font-pressstart text-[10px] text-[#E87339] uppercase">${sessionState.workType} SESSION</span>
      <div class="flex gap-1">
        <button onclick="toggleFloatingWidget()" class="p-1 bg-[#FAE9CE] border-[1px] border-[#3D2013] text-[8px] font-pressstart cursor-pointer">Float</button>
        <button onclick="toggleFullscreenSession()" class="p-1 bg-[#FAE9CE] border-[1px] border-[#3D2013] text-[8px] font-pressstart cursor-pointer">Full</button>
      </div>
    </div>

    <div class="flex flex-col items-center justify-center py-4 gap-2">
      <div id="timer-display" class="font-pressstart text-[30px] sm:text-[40px] text-[#3D2013]">
        ${formatTime(sessionState.timeLeft)}
      </div>
      <div class="flex gap-3 font-pressstart text-[10px] text-[#3D2013]/70">
        <span id="focustime-indicator">Focus: ${techniqueConfigs[sessionState.technique].name}</span>
        <span id="session-count-indicator">${sessionState.currentSessionNum}/${sessionState.totalSessions}</span>
      </div>
    </div>

    <div class="flex justify-center pt-2">
      <button id="timer-toggle-btn" onclick="toggleTimer()" class="font-pressstart text-[10px] text-[#FFFFF6] bg-[#E87339] border-[2px] border-[#3D2013] px-6 py-2.5 cursor-pointer">
        START
      </button>
    </div>
  `;
}

function inflateRecentActivityTasksUI() {
  const card2 = document.getElementById("recent-activity-card");
  if (!card2) return;

  card2.innerHTML = `
    <div class="flex items-center justify-between pb-2">
      <h3 class="font-pressstart text-[12px] sm:text-[14px] text-[#3D2013]">SESSION TASKS</h3>
    </div>
    <div class="border-t-[2px] border-[#3D2013]/20"></div>
    <div id="session-task-checklist" class="flex flex-col gap-2 overflow-y-auto max-h-[250px] p-1">
      ${sessionState.tasks.map((task, idx) => `
        <label class="flex items-center gap-2.5 p-2 bg-[#FAE9CE] border-[1.5px] border-[#3D2013] rounded-[8px] cursor-pointer">
          <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskCheckbox(${idx})" class="w-4 h-4 accent-[#E87339]" />
          <span class="font-pixel text-[16px] text-[#3D2013] ${task.completed ? 'line-through opacity-50' : ''}">${task.text}</span>
        </label>
      `).join('')}
    </div>
  `;
}

window.toggleTaskCheckbox = function(index) {
  sessionState.tasks[index].completed = !sessionState.tasks[index].checked;
  inflateRecentActivityTasksUI();
};

// --- TIMER CONTROLS ---
window.toggleTimer = function() {
  const btn = document.getElementById("timer-toggle-btn");
  if (!sessionState.isRunning) {
    sessionState.isRunning = true;
    btn.textContent = "PAUSE";
    sessionState.timerInterval = setInterval(() => {
      if (sessionState.timeLeft > 0) {
        sessionState.timeLeft--;
        document.getElementById("timer-display").textContent = formatTime(sessionState.timeLeft);
      } else {
        clearInterval(sessionState.timerInterval);
        handleSessionCompletion();
      }
    }, 1000);
  } else {
    sessionState.isRunning = false;
    btn.textContent = "START";
    clearInterval(sessionState.timerInterval);
  }
};

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function handleSessionCompletion() {
  sessionState.isRunning = false;
  if (sessionState.currentSessionNum < sessionState.totalSessions) {
    sessionState.currentSessionNum++;
    sessionState.timeLeft = techniqueConfigs[sessionState.technique].focus;
    inflateActiveSessionUI();
    alert("Focus session complete! Time for a break.");
  } else {
    // Show rewards modal and reset containers
    document.getElementById("rewards-modal")?.classList.remove("hidden");
    resetToDefaultUI();
  }
}

window.closeRewardsModal = function() {
  document.getElementById("rewards-modal")?.classList.add("hidden");
};

function resetToDefaultUI() {
  // Re-load the original HTML structure for Card 1 and Card 2 via page reload or template restoration
  location.reload();
}

window.toggleFloatingWidget = function() {
  const card1 = document.getElementById("active-session-card");
  card1.classList.toggle("fixed");
  card1.classList.toggle("bottom-4");
  card1.classList.toggle("right-4");
  card1.classList.toggle("z-50");
  card1.classList.toggle("max-w-sm");
};

window.toggleFullscreenSession = function() {
  const card1 = document.getElementById("active-session-card");
  card1.classList.toggle("fixed");
  card1.classList.toggle("inset-4");
  card1.classList.toggle("z-50");
};