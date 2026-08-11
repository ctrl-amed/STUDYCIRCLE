// --- STATE MANAGEMENT ---
let uploadedFiles = [
  { id: '1', name: 'Cell_Biology_Ch3.pdf', size: '2.4 MB', addedBy: 'Player 1' },
  { id: '2', name: 'Organic_Chemistry_Summary.pdf', size: '1.1 MB', addedBy: 'You' }
];

let generatedItems = []; // Saved tool items
let currentActiveTool = ''; // 'Pre-quiz', 'Post-quiz', 'Flashcards', 'Notes'
let currentGeneratedItem = null;
let hasActiveToolChanged = false; // Tracks whether modifications occurred in current tool session

const roomState = {
  mode: 'structured', // 'hangout' | 'structured'
  role: 'host', // 'host' | 'player'
  isQuizStarted: false,
  playersReady: 4,
  totalPlayers: 5,
  isPlayerReady: false
};

/**
 * Safely updates the user's role in roomState, updates the URL,
 * clamps ready counts, and re-renders dependent UI elements.
 * 
 * @param {'host' | 'player'} newRole 
 * @param {Object} [options]
 * @param {boolean} [options.broadcast=true] Whether to notify other tabs/clients
 */
function setRole(newRole, options = { broadcast: true }) {
  // 1. Validate role input
  if (newRole !== 'host' && newRole !== 'player') {
    console.warn(`[setRole] Invalid role provided: "${newRole}". Must be 'host' or 'player'.`);
    return;
  }

  // 2. Prevent redundant work if role hasn't changed
  if (roomState.role === newRole) return;

  const previousRole = roomState.role;
  roomState.role = newRole;

  // 3. Keep playersReady within valid bounds [0, totalPlayers]
  roomState.playersReady = getClampedReadyCount(roomState.playersReady);

  // 4. Synchronize URL query parameter without reloading the page
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('role', newRole);
    window.history.replaceState(null, '', url.toString());
  } catch (err) {
    console.error('[setRole] Failed to sync URL state:', err);
  }

  // 5. Update UI controls depending on host vs. player permissions
  renderRoleDependentUI(newRole);

  // 6. Broadcast state change if requested
  // Note: Only allow broadcast if new role is host OR if broadcasting host-relinquishment
  if (options.broadcast && roomStateChannel) {
    roomStateChannel.postMessage({
      type: 'ROLE_CHANGED',
      previousRole,
      role: roomState.role,
      playersReady: roomState.playersReady,
      totalPlayers: roomState.totalPlayers,
      mode: roomState.mode,
      isQuizStarted: roomState.isQuizStarted
    });
  }
}

/**
 * Updates UI elements based on host/player control permissions.
 * @param {'host' | 'player'} role 
 */
function renderRoleDependentUI(role) {
  const isHost = role === 'host';

  // Toggle host-only controls visibility
  const hostElements = document.querySelectorAll('[data-host-only]');
  hostElements.forEach((el) => {
    el.classList.toggle('hidden', !isHost);
    if ('disabled' in el) {
      el.disabled = !isHost;
    }
  });

  // Toggle player-only controls visibility
  const playerElements = document.querySelectorAll('[data-player-only]');
  playerElements.forEach((el) => {
    el.classList.toggle('hidden', isHost);
  });

  // Re-render core room state views
  if (typeof renderRoomStateDependents === 'function') {
    renderRoomStateDependents();
  }
}

const ROOM_STATE_CHANNEL = 'studycircle_room_state_channel';
const roomStateChannel = typeof BroadcastChannel !== 'undefined'
  ? new BroadcastChannel(ROOM_STATE_CHANNEL)
  : null;

function isStructuredMode() {
  return roomState.mode === 'structured';
}

function isStructuredHost() {
  return isStructuredMode() && roomState.role === 'host';
}

function isStructuredPlayer() {
  return isStructuredMode() && roomState.role === 'player';
}

function isQuizTool(toolName = currentActiveTool) {
  return toolName === 'Pre-quiz' || toolName === 'Post-quiz';
}

function getClampedReadyCount(value = roomState.playersReady) {
  const num = Number(value);
  const validNum = Number.isFinite(num) ? num : 0;
  return Math.max(0, Math.min(roomState.totalPlayers, validNum));
}

function renderRoomStateDependents() {
  renderToolsColumnForRoomState();

  if (isStructuredHost() && isQuizTool() && !roomState.isQuizStarted) {
    renderStructuredHostLobby();
  }
}

function updateRoomState(patch = {}, options = {}) {
  const shouldBroadcast = options.broadcast !== false;

  if (patch.mode === 'hangout' || patch.mode === 'structured') {
    roomState.mode = patch.mode;
  }
  if (patch.role === 'host' || patch.role === 'player') {
    roomState.role = patch.role;
  }
  if (typeof patch.isQuizStarted === 'boolean') {
    roomState.isQuizStarted = patch.isQuizStarted;
  }
  if (typeof patch.isPlayerReady === 'boolean') {
    roomState.isPlayerReady = patch.isPlayerReady;
  }

  const nextTotalPlayers = Number(patch.totalPlayers);
  if (Number.isFinite(nextTotalPlayers) && nextTotalPlayers > 0) {
    roomState.totalPlayers = nextTotalPlayers;
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'playersReady')) {
    roomState.playersReady = getClampedReadyCount(patch.playersReady);
  } else {
    roomState.playersReady = getClampedReadyCount();
  }

  renderRoomStateDependents();

  if (shouldBroadcast) {
    broadcastRoomState();
  }
}

function setStructuredReadyStatus(playersReady, totalPlayers = roomState.totalPlayers) {
  updateRoomState({ playersReady, totalPlayers });
}

function hydrateRoomStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');
  const role = params.get('role');
  const readyParam = params.get('playersReady');
  const totalParam = params.get('totalPlayers');

  if (mode === 'hangout' || mode === 'structured') {
    roomState.mode = mode;
  }
  if (role === 'host' || role === 'player') {
    roomState.role = role;
  }
  
  if (totalParam !== null) {
    const total = Number(totalParam);
    if (Number.isFinite(total) && total > 0) {
      roomState.totalPlayers = total;
    }
  }

  if (readyParam !== null) {
    const ready = Number(readyParam);
    if (Number.isFinite(ready)) {
      roomState.playersReady = getClampedReadyCount(ready);
    }
  }
}

function getSharedRoomStatePatch() {
  return {
    mode: roomState.mode,
    isQuizStarted: roomState.isQuizStarted,
    playersReady: getClampedReadyCount(),
    totalPlayers: roomState.totalPlayers
  };
}

function broadcastRoomState() {
  if (roomStateChannel) {
    roomStateChannel.postMessage(getSharedRoomStatePatch());
  }
}

if (roomStateChannel) {
  roomStateChannel.onmessage = (event) => {
    if (!event.data || typeof event.data !== 'object') return;

    const patch = {};

    if (event.data.mode === 'hangout' || event.data.mode === 'structured') {
      patch.mode = event.data.mode;
    }
    if (typeof event.data.isQuizStarted === 'boolean') {
      patch.isQuizStarted = event.data.isQuizStarted;
    }
    
    const incomingTotal = Number(event.data.totalPlayers);
    if (Number.isFinite(incomingTotal) && incomingTotal > 0) {
      patch.totalPlayers = incomingTotal;
    }

    const incomingReady = Number(event.data.playersReady);
    if (Number.isFinite(incomingReady)) {
      patch.playersReady = incomingReady;
    }

    updateRoomState(patch, { broadcast: false });
  };
}

function initializeRoomState() {
  hydrateRoomStateFromUrl();
  // Sync view without mutating roomState.playersReady default value
  renderRoomStateDependents();
}

function renderToolsColumnForRoomState() {
  const titleElem = document.getElementById('tools-header-title');
  const mainMenu = document.getElementById('tools-main-menu');
  const formView = document.getElementById('tools-form-view');
  const playerView = document.getElementById('structured-player-view');

  if (!mainMenu || !formView || !playerView) return;

  if (isStructuredPlayer()) {
    mainMenu.classList.add('hidden');
    formView.classList.add('hidden');
    playerView.classList.remove('hidden');
    if (titleElem) titleElem.textContent = roomState.isQuizStarted ? 'Live Quiz' : 'Structured Quiz';
    renderStructuredPlayerView();
    return;
  }

  playerView.classList.add('hidden');

  if (!currentActiveTool && formView.classList.contains('hidden')) {
    mainMenu.classList.remove('hidden');
    if (titleElem) titleElem.textContent = 'Tools';
  }
}

function renderStructuredHostLobby(container = document.getElementById('structured-lobby-container')) {
  if (!container) return;

  const readyCount = getClampedReadyCount();
  const waitingCount = Math.max(0, roomState.totalPlayers - readyCount);
  const canStart = readyCount >= roomState.totalPlayers;

  // Determine button label based on current active quiz type
  const quizTypeLabel = isQuizTool(currentActiveTool) ? currentActiveTool : 'Quiz';
  const buttonText = `Start ${quizTypeLabel}`;

  container.innerHTML = `
    <div class="bg-[#FFF8EC] border-2 border-[#3D2013] rounded-xl p-4 flex flex-col gap-4 shadow-sm">
      <div class="flex flex-col gap-1 text-center">
        <h3 class="font-pressstart text-[10px] text-[#3D2013] leading-relaxed">${quizTypeLabel} Lobby</h3>
        <p class="font-pixel text-sm text-[#3D2013]/70">Players are joining and marking themselves ready.</p>
      </div>

      <div class="bg-[#FEF4E0] border-2 border-[#3D2013]/20 rounded-xl p-4 text-center">
        <p class="font-pressstart text-xs text-[#3D2013]">${readyCount}/${roomState.totalPlayers} Players Ready</p>
        <p class="font-pixel text-xs text-[#3D2013]/60 mt-1">${waitingCount === 0 ? 'Everyone is ready.' : `${waitingCount} still waiting.`}</p>
      </div>

      <button
        type="button"
        onclick="startStructuredQuiz()"
        ${canStart ? '' : 'disabled'}
        class="w-full bg-[#788D55] text-white font-pressstart text-xs py-3 rounded-xl border-2 border-[#3D2013] transition-all shadow-sm ${canStart ? 'hover:bg-[#5B6D3F] active:scale-[0.98] cursor-pointer' : 'opacity-50 cursor-not-allowed'}">
        ${buttonText}
      </button>
    </div>
  `;
}

function showStructuredHostLobby() {
  const step1 = document.getElementById('step-1-source-select');
  const lobby = document.getElementById('structured-lobby-container');
  const step2 = document.getElementById('step-2-generated-container');

  if (step1) step1.classList.add('hidden');
  if (step2) step2.classList.add('hidden');
  if (lobby) lobby.classList.remove('hidden');

  renderStructuredHostLobby(lobby);
}

function renderStructuredPlayerView() {
  const container = document.getElementById('structured-player-view');
  if (!container) return;

  if (roomState.isQuizStarted) {
    if (!quizState.activeQuiz) {
      currentActiveTool = currentActiveTool || 'Pre-quiz';
      quizState.activeQuiz = JSON.parse(JSON.stringify(mockQuizData[currentActiveTool] || mockQuizData['Pre-quiz']));
      quizState.currentQuestionIndex = 0;
      quizState.userAnswers = {};
      quizState.isCompleted = false;
      quizState.isReviewing = false;
    }

    container.innerHTML = `<div id="structured-player-quiz-content" class="flex-1 flex flex-col gap-3"></div>`;
    renderQuizView(document.getElementById('structured-player-quiz-content'));
    return;
  }

  const readyLabel = roomState.isPlayerReady ? 'Ready' : "I'm Ready";
  const readyCount = getClampedReadyCount();

  container.innerHTML = `
    <div class="flex-1 flex flex-col justify-center gap-4">
      <div class="bg-[#FFF8EC] border-2 border-[#3D2013] rounded-xl p-4 flex flex-col gap-3 text-center shadow-sm">
        <h3 class="font-pressstart text-[10px] text-[#3D2013] leading-relaxed">Waiting for the host to start</h3>
        <p class="font-pixel text-sm text-[#3D2013]/70">${readyCount}/${roomState.totalPlayers} Players Ready</p>
        <button
          type="button"
          onclick="toggleStructuredPlayerReady()"
          class="w-full ${roomState.isPlayerReady ? 'bg-[#788D55]' : 'bg-[#E87339]'} text-white font-pressstart text-xs py-3 rounded-xl border-2 border-[#3D2013] hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-sm">
          ${readyLabel}
        </button>
      </div>
    </div>
  `;
}

function toggleStructuredPlayerReady() {
  const nextPlayerReady = !roomState.isPlayerReady;
  updateRoomState({
    isPlayerReady: nextPlayerReady,
    playersReady: roomState.playersReady + (nextPlayerReady ? 1 : -1)
  });
}

function startStructuredQuiz() {
  if (!isStructuredHost()) return;

  updateRoomState({ isQuizStarted: true });
  hasActiveToolChanged = true;

  const lobby = document.getElementById('structured-lobby-container');
  const step2 = document.getElementById('step-2-generated-container');
  if (lobby) lobby.classList.add('hidden');
  if (step2) step2.classList.remove('hidden');

  if (currentGeneratedItem) {
    currentGeneratedItem.isQuizStarted = true;
  }

  renderQuizView();
}

// Initial Setup on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  renderUploadedFiles();
  initializeRoomState();
});

// Navigation back handler for the close button
function goBack() {
  if (document.referrer && document.referrer.includes(window.location.host)) {
    window.history.back();
  } else {
    window.location.href = 'homepage.html';
  }
}

// Toggle Drawer functionality for Mobile
function toggleMobileDrawer(columnName) {
  const isMobile = window.innerWidth < 768;
  const col = document.getElementById(`${columnName}-col`);
  const overlay = document.getElementById('mobile-drawer-overlay');

  if (!col) return;

  if (isMobile) {
    const activeClass = 'translate-x-0';
    const hiddenClass = 'translate-x-full';

    const isOpen = col.classList.contains(activeClass) && !col.classList.contains(hiddenClass);

    closeMobileDrawers(); // Close other drawers first

    if (!isOpen) {
      col.classList.remove(hiddenClass);
      col.classList.add(activeClass);
      if (overlay) overlay.classList.remove('hidden');
    }
  } else {
    // Desktop collapsing toggle logic
    toggleColumn(columnName);
  }
}

// Close all mobile drawers and backdrop
function closeMobileDrawers() {
  const toolsCol = document.getElementById('tools-col');
  const overlay = document.getElementById('mobile-drawer-overlay');

  if (toolsCol) {
    toolsCol.classList.add('translate-x-full');
    toolsCol.classList.remove('translate-x-0');
  }
  if (overlay) {
    overlay.classList.add('hidden');
  }
}

// Desktop Column Collapse/Expand Toggle Logic
function toggleColumn(columnName) {
  if (window.innerWidth < 768) {
    closeMobileDrawers();
    return;
  }

  const col = document.getElementById(`${columnName}-col`);
  if (!col) return;

  const content = col.querySelector('.col-content');
  const collapsedIcon = col.querySelector('.col-collapsed-icon');

  const expandedWidth = 'md:w-[40%]';

  if (col.classList.contains(expandedWidth)) {
    // Collapse
    col.classList.remove(expandedWidth);
    col.classList.add('md:w-12', 'items-center');
    content.classList.add('hidden');
    collapsedIcon.classList.remove('hidden');
  } else {
    // Expand
    col.classList.remove('md:w-12', 'items-center');
    col.classList.add(expandedWidth);
    content.classList.remove('hidden');
    collapsedIcon.classList.add('hidden');
  }
}

// Shared study timer display from homepage.html
const STUDY_TIMER_STORAGE_KEY = "homepage_study_timer_state";
const roomTimerChannel = new BroadcastChannel("study_timer_channel");
let studyTimerState = getSavedStudyTimerState();
let studyTimerInterval = null;

function formatStudyTimer(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

function getSavedStudyTimerState() {
  try {
    return JSON.parse(localStorage.getItem(STUDY_TIMER_STORAGE_KEY)) || null;
  } catch (error) {
    return null;
  }
}

function getLiveStudyTimerSeconds(data) {
  if (!data || !Number.isFinite(data.secondsLeft)) return 0;

  if (!data.isRunning || !Number.isFinite(data.updatedAt)) {
    return Math.max(0, data.secondsLeft);
  }

  const elapsedSeconds = Math.floor((Date.now() - data.updatedAt) / 1000);
  return Math.max(0, data.secondsLeft - elapsedSeconds);
}

function renderStudyTimerFromHomepage(data = studyTimerState) {
  const timerElement = document.getElementById("room-timer");
  const secondsLeft = getLiveStudyTimerSeconds(data);
  const formattedTime = data?.formattedTime && !data.isRunning
    ? data.formattedTime
    : formatStudyTimer(secondsLeft);

  if (timerElement) {
    timerElement.textContent = formattedTime;
    timerElement.style.color = data?.isBreak ? "#788D55" : "#3D2013";
  }
}

function syncStudyTimerFromHomepage(data) {
  if (!data || data.source !== "homepage-study-timer") return;

  studyTimerState = data;
  renderStudyTimerFromHomepage(studyTimerState);
}

document.addEventListener("DOMContentLoaded", () => {
  syncStudyTimerFromHomepage(getSavedStudyTimerState() || {
    source: "homepage-study-timer",
    secondsLeft: 0,
    formattedTime: "00:00",
    isRunning: false
  });

  if (studyTimerInterval) clearInterval(studyTimerInterval);
  studyTimerInterval = setInterval(() => {
    renderStudyTimerFromHomepage(studyTimerState);
  }, 1000);
});





function togglePlayersDropdown() {
  const dropdown = document.getElementById('players-dropdown');
  dropdown.classList.toggle('hidden');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('players-dropdown');
  const button = e.target.closest('button[onclick="togglePlayersDropdown()"]');
  if (!button && !dropdown.contains(e.target)) {
    dropdown.classList.add('hidden');
  }
});

// Auto-resize textarea up to max-height (120px)
function autoResizeTextarea(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

// Handle Enter key for sending messages (Shift+Enter for newline)
function handleChatKeyDown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendChatMessage();
  }
}

// Canned response pool for Kitsu AI simulation
const kitsuResponses = [
  "Great point! Let's keep pushing forward.",
  "I'm right here with you! What topic should we study next?",
  "Awesome focus! Don't forget to take quick stretch breaks.",
  "That sounds clear! Need me to generate a quiz on this?",
  "Keep up the great study energy! You're leveling up fast!"
];

// Send chat message logic
function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const messageText = input.value.trim();

  if (!messageText) return;

  // 1. Hide the Welcome Banner on first message sent
  const welcomeBanner = document.getElementById('chat-welcome-banner');
  if (welcomeBanner) {
    welcomeBanner.classList.add('hidden');
  }

  // 2. Append user message to chat stream
  const chatStream = document.getElementById('chat-stream');
  const userMessage = document.createElement('div');
  
  userMessage.className = 'self-end bg-[#FCB980] border-2 border-[#3D2013] !rounded-none text-[#3D2013] font-pixel text-sm sm:text-lg md:text-[20px] leading-snug px-3 py-2 sm:px-4 sm:py-3 max-w-[85%] break-words shadow-sm';
  userMessage.textContent = messageText;

  chatStream.appendChild(userMessage);

  // 3. Reset input field & height
  input.value = '';
  input.style.height = 'auto';

  // 4. Scroll to bottom
  scrollToBottom();

  // 5. Trigger simulated AI Response
  triggerAIResponse(messageText);
}

// Simulated AI Answer Logic
function triggerAIResponse(userQuery) {
  const chatStream = document.getElementById('chat-stream');

  // Create AI container element: Plain text, pixel font, #3D2013 color, NO background/bubble
  const aiContainer = document.createElement('div');
  aiContainer.className = 'self-start max-w-[85%] font-pixel text-[#3D2013] text-sm sm:text-lg md:text-[20px] leading-snug py-1 break-words';

  // Name tag for Kitsu
  const aiName = document.createElement('span');
  aiName.className = 'font-bold text-[#DD6E36] block text-xs sm:text-sm mb-0.5';
  aiName.textContent = 'Kitsu AI:';

  // Response text container
  const aiText = document.createElement('span');
  aiText.textContent = '...'; // Typing indicator placeholder

  aiContainer.appendChild(aiName);
  aiContainer.appendChild(aiText);

  // Delay simulation (1 second response time)
  setTimeout(() => {
    chatStream.appendChild(aiContainer);
    scrollToBottom();

    // Pick response based on user input or random fallback
    const reply = getAIReplyText(userQuery);
    
    // Simulate typing effect
    typeWriterEffect(aiText, reply, 25);
  }, 600);
}

// Quick keyword matcher for responses
function getAIReplyText(text) {
  const lower = text.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hey there! Ready to study together?";
  }
  if (lower.includes('quiz') || lower.includes('test')) {
    return "Quizzes are a great way to retain knowledge! Upload your notes in the Tools menu to generate one.";
  }
  if (lower.includes('help')) {
    return "I can help you review topics, organize study sessions, or keep track of time!";
  }
  
  // Default to random cozy encouragement
  return kitsuResponses[Math.floor(Math.random() * kitsuResponses.length)];
}

// Typewriter effect function
function typeWriterEffect(element, text, speed) {
  element.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      scrollToBottom();
    } else {
      clearInterval(timer);
    }
  }, speed);
}

// Helper to handle smooth auto-scrolling
function scrollToBottom() {
  const container = document.getElementById('chat-messages-container');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

// --- TOOLS NAVIGATION & FORM SWITCHING LOGIC ---

// Step 1: Open Tool Form & Show File Checkbox Selector
function openToolForm(toolName) {
  currentActiveTool = toolName;
  hasActiveToolChanged = false; // Reset change tracker for new tool

  // Header update
  const titleElem = document.getElementById('tools-header-title');
  if (titleElem) titleElem.textContent = toolName;

  // Show form view, hide main menu
  document.getElementById('tools-main-menu').classList.add('hidden');
  document.getElementById('tools-form-view').classList.remove('hidden');

  // Activate Step 1
  document.getElementById('step-1-source-select').classList.remove('hidden');
  document.getElementById('step-2-generated-container').classList.add('hidden');

  document.getElementById('step-1-title').textContent = `${toolName} - Step 1: Select Sources`;

  renderStep1Checkboxes();
}

// Render Step 1 Checkbox file list
function renderStep1Checkboxes() {
  const container = document.getElementById('step-1-file-checkbox-list');
  if (!container) return;

  if (uploadedFiles.length === 0) {
    container.innerHTML = `
      <div class="bg-[#FFF8EC] border-2 border-dashed border-[#3D2013]/40 rounded-xl p-4 text-center">
        <p class="font-pixel text-xs text-[#3D2013]/70">No uploaded sources available.</p>
        <p class="font-pixel text-[11px] text-[#E87339] mt-1">Please add sources on the main tools menu first.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = uploadedFiles.map(file => `
    <label class="flex items-center gap-3 bg-[#FFF8EC] border-1 border-[#3D2013]/10 rounded-xl p-3 cursor-pointer hover:bg-[#FEF4E0] transition-colors">
      <input type="checkbox" checked value="${file.id}" class="accent-[#E87339] w-4 h-4 cursor-pointer" />
      <div class="flex flex-col min-w-0">
        <span class="font-pressstart text-[8px] lg:text-[10px] text-[#3D2013] truncate">${file.name}</span>
        <span class="font-pixel text-[10px] text-[#3D2013]/60">${file.size}</span>
      </div>
    </label>
  `).join('');
}

// Step 1 Next Button Click Handler
function handleStep1Next() {
  const checkboxes = document.querySelectorAll('#step-1-file-checkbox-list input[type="checkbox"]:checked');
  
  if (uploadedFiles.length > 0 && checkboxes.length === 0) {
    alert('Please select at least one source file to continue.');
    return;
  }

  if (isStructuredHost() && isQuizTool(currentActiveTool)) {
    updateRoomState({ isQuizStarted: false });
  }

  // 1. Instantly generate & inflate the mock content state based on the current tool
  generateMockToolContent(currentActiveTool);
  
  // 2. Mark state as changed/dirty so navigation handlers track it
  hasActiveToolChanged = true;

  // 3. Update the header title dynamically to match the newly generated item
  if (currentGeneratedItem && currentGeneratedItem.title) {
    const titleElem = document.getElementById('tools-header-title');
    if (titleElem) titleElem.textContent = currentGeneratedItem.title;
  }

  // 4. Automatically save/persist the generated item into the generatedItems array if it's new
  if (currentGeneratedItem) {
    const existingIndex = generatedItems.findIndex(item => item.id === currentGeneratedItem.id);
    if (existingIndex !== -1) {
      generatedItems[existingIndex] = { ...currentGeneratedItem };
    } else {
      generatedItems.unshift({ ...currentGeneratedItem });
    }
    renderGeneratedItemsList();
  }

  // 5. Hide Step 1, then either show the structured lobby or generated content
  if (isStructuredHost() && isQuizTool(currentActiveTool)) {
    showStructuredHostLobby();
  } else {
    document.getElementById('step-1-source-select').classList.add('hidden');
    document.getElementById('structured-lobby-container').classList.add('hidden');
    document.getElementById('step-2-generated-container').classList.remove('hidden');
  }
}

// Reset Back to Tools Main View
function resetToolsView() {
  const titleElem = document.getElementById('tools-header-title');
  if (titleElem) titleElem.textContent = 'Tools';

  // Reset form views
  document.getElementById('tools-form-view').classList.add('hidden');
  document.getElementById('step-1-source-select').classList.remove('hidden');
  document.getElementById('structured-lobby-container').classList.add('hidden');
  document.getElementById('step-2-generated-container').classList.add('hidden');
  document.getElementById('tools-main-menu').classList.remove('hidden');

  currentActiveTool = '';
  hasActiveToolChanged = false; // Reset modification flag
  renderToolsColumnForRoomState();
}

// --- MOCK DATA FOR QUIZZES ---
const mockQuizData = {
  "Pre-quiz": {
    topic: "Cell Biology",
    type: "Pre-quiz",
    sourcesCount: 2,
    totalQuestions: 3,
    questions: [
      {
        id: 1,
        question: "What is the primary powerhouse of the cell?",
        options: [
          "Ribosome",
          "Mitochondria",
          "Nucleus",
          "Endoplasmic Reticulum"
        ],
        correctAnswer: 1 // Index 1 = Mitochondria
      },
      {
        id: 2,
        question: "Which organelle is responsible for protein synthesis?",
        options: [
          "Ribosome",
          "Golgi Apparatus",
          "Lysosome",
          "Vacuole"
        ],
        correctAnswer: 0 // Index 0 = Ribosome
      },
      {
        id: 3,
        question: "Where is the genetic material (DNA) stored in a eukaryotic cell?",
        options: [
          "Cytoplasm",
          "Cell Membrane",
          "Nucleus",
          "Peroxisome"
        ],
        correctAnswer: 2 // Index 2 = Nucleus
      }
    ]
  },
  "Post-quiz": {
    topic: "Cell Biology & Respiration",
    type: "Post-quiz",
    sourcesCount: 2,
    totalQuestions: 3,
    questions: [
      {
        id: 1,
        question: "During cellular respiration, which process occurs in the cytoplasm under anaerobic conditions?",
        options: [
          "Krebs Cycle",
          "Electron Transport Chain",
          "Glycolysis",
          "Fermentation only"
        ],
        correctAnswer: 2 // Index 2 = Glycolysis
      },
      {
        id: 2,
        question: "What is the main energy currency unit produced by cells?",
        options: [
          "DNA",
          "ATP",
          "RNA",
          "Glucose"
        ],
        correctAnswer: 1 // Index 1 = ATP
      },
      {
        id: 3,
        question: "Which organelle packaging and dispatches proteins formed by ribosomes?",
        options: [
          "Golgi Apparatus",
          "Mitochondria",
          "Chloroplast",
          "Centrosome"
        ],
        correctAnswer: 0 // Index 0 = Golgi Apparatus
      }
    ]
  }
};

// Quiz Interactive State
let quizState = {
  activeQuiz: null,
  currentQuestionIndex: 0,
  userAnswers: {}, // { questionId: selectedOptionIndex }
  isCompleted: false,
  isReviewing: false
};

// --- MOCK DATA FOR FLASHCARDS ---
const mockFlashcardData = {
  topic: "Cellular Respiration",
  sourcesCount: 2,
  cards: [
    {
      id: 1,
      term: "ATP (Adenosine Triphosphate)",
      definition: "High-energy molecule that stores and supplies the cell with needed energy."
    },
    {
      id: 2,
      term: "Glycolysis",
      definition: "Anaerobic process occurring in cytoplasm that breaks down glucose into pyruvate."
    },
    {
      id: 3,
      term: "Mitochondria",
      definition: "Double-membrane organelle responsible for generating most cellular ATP via oxidative phosphorylation."
    },
    {
      id: 4,
      term: "Krebs Cycle",
      definition: "A series of chemical reactions in the mitochondrial matrix used by aerobic organisms to generate energy."
    },
    {
      id: 5,
      term: "Electron Transport Chain",
      definition: "A complex set of proteins that creates a proton gradient across the inner mitochondrial membrane to drive ATP synthesis."
    }
  ]
};

// --- FLASHCARD INTERACTIVE STATE ---
let flashcardState = {
  topic: "",
  sourcesCount: 0,
  cards: [],
  currentIndex: 0,
  isFlipped: false,
  isListView: false
};

// --- MOCK DATA FOR NOTES ---
const mockNotesData = {
  topic: "Cellular Respiration & Metabolism",
  sourcesCount: 2,
  notesContent: [
    {
      heading: "Overview & Purpose",
      body: "Cellular respiration is a set of metabolic reactions taking place in cells to convert biochemical energy from nutrients into ATP, releasing waste products."
    },
    {
      heading: "Primary Stages",
      bullets: [
        "<strong>Glycolysis:</strong> Converts glucose into pyruvate in the cytoplasm under anaerobic conditions.",
        "<strong>Krebs Cycle:</strong> Operates inside the mitochondrial matrix to produce electron carriers (NADH & FADH2).",
        "<strong>Electron Transport Chain:</strong> Drives ATP synthesis via oxidative phosphorylation across the inner membrane."
      ]
    },
    {
      heading: "Summary & Key Takeaways",
      body: "Overall ATP yield ranges between 30 to 32 ATP molecules per oxidized glucose molecule depending on shuttle mechanisms."
    }
  ]
};

// --- NOTES INTERACTIVE STATE ---
let notesState = {
  topic: "",
  sourcesCount: 0,
  notesContent: []
};


// Step 2: Render Content per Tool Type (Revised for Quizzes)
// --- UPDATED generateMockToolContent HANDLER ---
function generateMockToolContent(toolName) {
  const container = document.getElementById('mock-output-content');
  if (!container) return;

  let title = '';
  let badgeColor = '';

  if (toolName === 'Pre-quiz' || toolName === 'Post-quiz') {
    badgeColor = toolName === 'Pre-quiz' ? 'bg-[#788D55]' : 'bg-[#708EA4]';
    title = `${toolName} (Generated)`;

    quizState.activeQuiz = JSON.parse(JSON.stringify(mockQuizData[toolName]));
    quizState.currentQuestionIndex = 0;
    quizState.userAnswers = {};
    quizState.isCompleted = false;
    quizState.isReviewing = false;

    currentGeneratedItem = {
      id: Date.now().toString(),
      title: title,
      type: toolName,
      badgeColor: badgeColor,
      date: new Date().toLocaleDateString(),
      quizState: JSON.parse(JSON.stringify(quizState))
    };

    renderQuizView(container);
    return;
  } else if (toolName === 'Flashcards') {
    title = 'Key Term Deck';
    badgeColor = 'bg-[#A53914]';

    // Initialize Flashcard State
    flashcardState.topic = mockFlashcardData.topic;
    flashcardState.sourcesCount = mockFlashcardData.sourcesCount;
    flashcardState.cards = JSON.parse(JSON.stringify(mockFlashcardData.cards));
    flashcardState.currentIndex = 0;
    flashcardState.isFlipped = false;
    flashcardState.isListView = false;

    currentGeneratedItem = {
      id: Date.now().toString(),
      title: title,
      type: toolName,
      badgeColor: badgeColor,
      date: new Date().toLocaleDateString(),
      flashcardState: JSON.parse(JSON.stringify(flashcardState))
    };

    renderFlashcardsView(container);
    return;
  } else {
    // --- REVISED NOTES BRANCH ---
    title = `"${mockNotesData.topic}" Notes`;
    badgeColor = 'bg-[#E34B00]';

    notesState.topic = mockNotesData.topic;
    notesState.sourcesCount = mockNotesData.sourcesCount;
    notesState.notesContent = JSON.parse(JSON.stringify(mockNotesData.notesContent));

    currentGeneratedItem = {
      id: Date.now().toString(),
      title: title,
      type: toolName,
      badgeColor: badgeColor,
      date: new Date().toLocaleDateString(),
      notesState: JSON.parse(JSON.stringify(notesState))
    };

    renderNotesView(container);
    return;
  }

  currentGeneratedItem = {
    id: Date.now().toString(),
    title: title,
    type: toolName,
    badgeColor: badgeColor,
    date: new Date().toLocaleDateString()
  };
}

// --- NOTES VIEW RENDERER ---
function renderNotesView(container = document.getElementById('mock-output-content')) {
  if (!container) return;

  container.innerHTML = `
    <!-- Header & Rename Controls -->
    <div class="bg-[#FFF8EC] border-2 border-[#3D2013] rounded-xl p-3 shadow-sm flex flex-col gap-2">
      <div class="flex items-center justify-between gap-2">
        <h3 id="notes-title-text" class="font-pressstart text-[10px] text-[#3D2013] truncate">
          ${currentGeneratedItem.title}
        </h3>
        <button onclick="toggleNotesRename()" 
                title="Rename Notes"
                class="px-2 py-1 bg-[#FEF4E0] border border-[#3D2013] rounded text-[10px] font-pressstart text-[#3D2013] hover:bg-[#E87339] hover:text-white transition-colors cursor-pointer shrink-0">
          Rename
        </button>
      </div>

      <!-- Rename Input Drawer (Hidden by default) -->
      <div id="notes-rename-container" class="hidden flex items-center gap-2 pt-1 border-t border-[#3D2013]/10">
        <input type="text" 
               id="notes-rename-input" 
               value="${currentGeneratedItem.title}" 
               class="flex-1 bg-[#FEF4E0] border border-[#3D2013] rounded px-2 py-1 font-pixel text-xs text-[#3D2013] outline-none" />
        <button onclick="saveNotesRename()" 
                class="px-2 py-1 bg-[#788D55] text-white border border-[#3D2013] rounded text-[9px] font-pressstart cursor-pointer hover:bg-[#5B6D3F]">
          Save
        </button>
      </div>

      <!-- Sources Indicator -->
      <p class="font-pixel text-[12px] text-[#3D2013]/60">
        ${notesState.sourcesCount} Sources
      </p>
    </div>

    <!-- Notes Content Container -->
    <div class="bg-[#FFF8EC] border-2 border-[#3D2013] rounded-xl p-3 flex flex-col gap-3 font-pixel text-xs text-[#3D2013] max-h-[300px] overflow-y-auto shadow-sm">
      ${notesState.notesContent.map(section => `
        <div class="flex flex-col gap-1 pb-2 border-b border-[#3D2013]/10 last:border-b-0 last:pb-0">
          <h4 class="font-pressstart text-[9px] text-[#E34B00]">${section.heading}</h4>
          ${section.body ? `<p class="leading-relaxed text-[#3D2013]/80">${section.body}</p>` : ''}
          ${section.bullets ? `
            <ul class="list-disc pl-4 space-y-1 leading-relaxed text-[#3D2013]/80">
              ${section.bullets.map(b => `<li>${b}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

// --- RENAME HANDLERS ---
function toggleNotesRename() {
  const renameContainer = document.getElementById('notes-rename-container');
  if (renameContainer) {
    renameContainer.classList.toggle('hidden');
  }
}

function saveNotesRename() {
  const input = document.getElementById('notes-rename-input');
  if (!input) return;

  const newTitle = input.value.trim();
  if (!newTitle) return;

  // 1. Update current generated item state
  currentGeneratedItem.title = newTitle;
  hasActiveToolChanged = true;

  // 2. Update inline title text
  const titleText = document.getElementById('notes-title-text');
  if (titleText) titleText.textContent = newTitle;

  // 3. Update main tools panel header title
  const headerTitle = document.getElementById('tools-header-title');
  if (headerTitle) headerTitle.textContent = newTitle;

  // 4. Hide rename box
  toggleNotesRename();
}

// --- FLASHCARD VIEW RENDERER ---
function renderFlashcardsView(container = document.getElementById('mock-output-content')) {
  if (!container) return;

  if (flashcardState.isListView) {
    renderFlashcardListView(container);
    return;
  }

  const currentCard = flashcardState.cards[flashcardState.currentIndex];
  const totalCards = flashcardState.cards.length;
  const cardRatio = `${flashcardState.currentIndex + 1} / ${totalCards}`;

  const isFirstCard = flashcardState.currentIndex === 0;
  const isLastCard = flashcardState.currentIndex === totalCards - 1;

  container.innerHTML = `
    <!-- Flashcard Header -->
    <div class="flex flex-col gap-1">
      <h3 class="font-pressstart text-[10px] text-[#3D2013]">"${flashcardState.topic}" Flashcards</h3>
      <p class="font-pixel text-[13px] text-[#3D2013]/60">${flashcardState.sourcesCount} Sources Used</p>
    </div>

    <!-- Active Card Ratio Counter -->
    <div class="flex justify-end pr-1">
      <span class="font-pressstart text-[10px] text-[#3D2013]/70">${cardRatio}</span>
    </div>

    <!-- Flashcard Container (Flip on click) -->
    <div onclick="flipFlashcardCard()" 
         class="border-2 border-[#3D2013] rounded-xl p-6 min-h-[160px] flex flex-col items-center justify-center text-center cursor-pointer shadow-sm transition-all select-none ${
           flashcardState.isFlipped 
             ? 'bg-gradient-to-b from-[#FFF2DD] to-[#FFEAC8]' 
             : 'bg-[#FEF4E0]'
         }">
      ${
        !flashcardState.isFlipped
          ? `
          <!-- Front Side: Question / Term -->
          <p class="font-pressstart text-xs sm:text-sm text-[#3D2013] leading-relaxed">
            ${currentCard.term}
          </p>
          <span class="font-pixel text-[11px] text-[#3D2013]/50 mt-4 block">💡 Click to reveal answer</span>
        `
          : `
          <!-- Back Side: Answer / Definition -->
          <p class="font-pressstart text-xs text-[#3D2013] leading-relaxed">
            ${currentCard.definition}
          </p>
          <span class="font-pixel text-[11px] text-[#E87339] mt-4 block">🔄 Click to flip back</span>
        `
      }
    </div>

    <!-- Footer Controls -->
    <div class="flex items-center ${isFirstCard ? 'justify-end' : 'justify-between'} gap-2 pt-2">
      ${
        !isFirstCard
          ? `
        <button onclick="prevFlashcard()" class="px-3 py-1.5 bg-[#FEF4E0] border-2 border-[#3D2013] rounded-lg font-pressstart text-[10px] text-[#3D2013] hover:bg-[#FCB980] transition-colors cursor-pointer active:scale-95">
          Previous
        </button>
      `
          : ''
      }

      ${
        !isLastCard
          ? `
        <button onclick="nextFlashcard()" class="px-3 py-1.5 bg-[#E87339] border-2 border-[#3D2013] rounded-lg font-pressstart text-[10px] text-white hover:bg-[#DD6E36] transition-colors cursor-pointer active:scale-95">
          Next
        </button>
      `
          : `
        <button onclick="showFlashcardList()" class="px-3 py-1.5 bg-[#788D55] border-2 border-[#3D2013] rounded-lg font-pressstart text-[10px] text-white hover:bg-[#5B6D3F] transition-colors cursor-pointer active:scale-95">
          Done
        </button>
      `
      }
    </div>
  `;
}

// --- FLASHCARD LIST VIEW RENDERER ---
function renderFlashcardListView(container) {
  container.innerHTML = `
    <!-- Header -->
    <div class="flex flex-col gap-1 pb-1">
      <h3 class="font-pressstart text-[10px] text-[#3D2013]">"${flashcardState.topic}" - Full Deck Overview</h3>
      <p class="font-pixel text-[13px] text-[#3D2013]/60">${flashcardState.cards.length} Cards Total</p>
    </div>

    <!-- Inflated Flashcards List -->
    <div class="flex flex-col gap-2.5 max-h-[280px] overflow-y-auto pr-1">
      ${flashcardState.cards
        .map(
          (card, idx) => `
        <div class="bg-[#FFF8EC] border-2 border-[#3D2013] rounded-xl p-3 flex flex-col gap-1.5">
          <div class="flex items-center justify-between border-b border-[#3D2013]/10 pb-1">
            <span class="font-pressstart text-[9px] text-[#A53914]">Card #${idx + 1}</span>
            <span class="font-pressstart text-[8px] text-[#3D2013]/50">Term</span>
          </div>
          <p class="font-pressstart text-[10px] text-[#3D2013]">${card.term}</p>
          <div class="border-t border-dashed border-[#3D2013]/20 pt-1.5 mt-1">
            <span class="font-pressstart text-[8px] text-[#788D55] block mb-0.5">Definition</span>
            <p class="font-pressstart text-[9px] text-[#3D2013]/80 leading-normal">${card.definition}</p>
          </div>
        </div>
      `
        )
        .join('')}
    </div>

    <!-- Footer Actions -->
    <div class="flex items-center justify-end gap-2 pt-2">
      <button onclick="reshuffleFlashcards()" class="px-4 py-2 bg-[#E87339] border-2 border-[#3D2013] rounded-lg font-pressstart text-[10px] text-white hover:bg-[#DD6E36] transition-colors cursor-pointer active:scale-95">
        Reshuffle
      </button>
    </div>
  `;
}

// --- FLASHCARD EVENT HANDLERS ---
function flipFlashcardCard() {
  flashcardState.isFlipped = !flashcardState.isFlipped;
  hasActiveToolChanged = true;
  renderFlashcardsView();
}

function nextFlashcard() {
  if (flashcardState.currentIndex < flashcardState.cards.length - 1) {
    flashcardState.currentIndex++;
    flashcardState.isFlipped = false;
    hasActiveToolChanged = true;
    renderFlashcardsView();
  }
}

function prevFlashcard() {
  if (flashcardState.currentIndex > 0) {
    flashcardState.currentIndex--;
    flashcardState.isFlipped = false;
    hasActiveToolChanged = true;
    renderFlashcardsView();
  }
}

function showFlashcardList() {
  flashcardState.isListView = true;
  hasActiveToolChanged = true;
  renderFlashcardsView();
}

function reshuffleFlashcards() {
  // Fisher-Yates Shuffle Algorithm
  for (let i = flashcardState.cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flashcardState.cards[i], flashcardState.cards[j]] = [
      flashcardState.cards[j],
      flashcardState.cards[i]
    ];
  }
  flashcardState.currentIndex = 0;
  flashcardState.isFlipped = false;
  flashcardState.isListView = false;
  hasActiveToolChanged = true;
  renderFlashcardsView();
}

// --- QUIZ VIEW RENDERER ---
function renderQuizView(container = document.getElementById('mock-output-content')) {
  if (!container || !quizState.activeQuiz) return;

  const quiz = quizState.activeQuiz;

  if (isStructuredMode() && isQuizTool(quiz.type) && !roomState.isQuizStarted && !quizState.isCompleted && !quizState.isReviewing) {
    if (isStructuredHost()) {
      renderStructuredHostLobby(container);
    } else {
      container.innerHTML = `
        <div class="bg-[#FFF8EC] border-2 border-[#3D2013] rounded-xl p-4 text-center shadow-sm">
          <h3 class="font-pressstart text-[10px] text-[#3D2013] leading-relaxed">Waiting for the host to start</h3>
          <button
            type="button"
            onclick="toggleStructuredPlayerReady()"
            class="mt-4 w-full ${roomState.isPlayerReady ? 'bg-[#788D55]' : 'bg-[#E87339]'} text-white font-pressstart text-xs py-3 rounded-xl border-2 border-[#3D2013] hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-sm">
            ${roomState.isPlayerReady ? 'Ready' : "I'm Ready"}
          </button>
        </div>
      `;
    }
    return;
  }

  if (quizState.isReviewing) {
    renderQuizReview(container);
    return;
  }

  if (quizState.isCompleted) {
    renderQuizResults(container);
    return;
  }

  const qIndex = quizState.currentQuestionIndex;
  const currentQ = quiz.questions[qIndex];
  const totalQ = quiz.totalQuestions;
  const selectedOpt = quizState.userAnswers[currentQ.id];

  const badgeColor = quiz.type === 'Pre-quiz' ? 'bg-[#788D55]' : 'bg-[#708EA4]';

  container.innerHTML = `
    <!-- Quiz Header -->
    <div class="rounded-xl p-3 flex flex-col gap-1">

      <h3 class="font-pressstart text-[8px] lg:text-[10px] text-[#3D2013] mt-1">"${quiz.topic}" ${quiz.type}</h3>
      <p class="font-pixel text-[15px] text-[#3D2013]/60">${quiz.sourcesCount} Sources Used</p>
            <div class="flex items-center justify-between">
        <span class="font-pressstart text-[8px] lg:text-[10px] text-[#3D2013]/70">
          ${qIndex + 1}/${totalQ}
        </span>
      </div>
    </div>

    <!-- Active Question Card -->
    <div class="rounded-xl p-4 flex flex-col gap-3">
      <p class="font-pixel text-[15px] sm:text-sm font-pressstart text-[#3D2013]">
        Q${qIndex + 1}. ${currentQ.question}
      </p>

      <!-- Options -->
      <div class="flex flex-col gap-2 font-pressstart text-xs text-[#3D2013]">
        ${currentQ.options.map((option, idx) => `
          <label onclick="selectQuizAnswer(${currentQ.id}, ${idx})" 
                 class="flex items-center gap-2.5 p-2 rounded-lg border-2 border-[#3D2013]/20 cursor-pointer transition-colors ${selectedOpt === idx ? 'bg-[#FCB980]/40 border-[#3D2013] font-bold' : 'hover:bg-[#FEF4E0]'}">
            <input type="radio" name="q_${currentQ.id}" value="${idx}" ${selectedOpt === idx ? 'checked' : ''} class="accent-[#E87339] cursor-pointer" />
            <span>${option}</span>
          </label>
        `).join('')}
      </div>
    </div>

    <!-- Footer Controls -->
    <div class="flex items-center ${qIndex === 0 ? 'justify-end' : 'justify-between'} gap-2 pt-1">
      ${qIndex > 0 ? `
        <button onclick="prevQuizQuestion()" class="px-3 py-1.5 bg-[#FEF4E0] border-2 border-[#3D2013] rounded-lg font-pressstart text-[10px] text-[#3D2013] hover:bg-[#FCB980] transition-colors cursor-pointer active:scale-95">
          Previous
        </button>
      ` : ''}

      ${qIndex < totalQ - 1 ? `
        <button onclick="nextQuizQuestion()" class="px-3 py-1.5 bg-[#E87339] border-2 border-[#3D2013] rounded-lg font-pressstart text-[10px] text-white hover:bg-[#DD6E36] transition-colors cursor-pointer active:scale-95">
          Next
        </button>
      ` : `
        <button onclick="submitQuiz()" class="px-3 py-1.5 bg-[#788D55] border-2 border-[#3D2013] rounded-lg font-pressstart text-[10px] text-white hover:bg-[#5B6D3F] transition-colors cursor-pointer active:scale-95">
          Done
        </button>
      `}
    </div>
  `;
}

// --- QUIZ INTERACTION HANDLERS ---
function selectQuizAnswer(questionId, optionIndex) {
  if (quizState.userAnswers[questionId] !== optionIndex) {
    quizState.userAnswers[questionId] = optionIndex;
    hasActiveToolChanged = true; // Mark state as modified upon answering
  }
  renderQuizView();
}

function nextQuizQuestion() {
  if (quizState.currentQuestionIndex < quizState.activeQuiz.totalQuestions - 1) {
    quizState.currentQuestionIndex++;
    renderQuizView();
  }
}

function prevQuizQuestion() {
  if (quizState.currentQuestionIndex > 0) {
    quizState.currentQuestionIndex--;
    renderQuizView();
  }
}

function submitQuiz() {
  quizState.isCompleted = true;
  hasActiveToolChanged = true; // Quiz submission is a change in progress
  renderQuizView();
}

function retakeQuiz() {
  quizState.currentQuestionIndex = 0;
  quizState.userAnswers = {};
  quizState.isCompleted = false;
  quizState.isReviewing = false;
  hasActiveToolChanged = true;
  renderQuizView();
}

function reviewQuiz() {
  quizState.isReviewing = true;
  renderQuizView();
}

function backToResults() {
  quizState.isReviewing = false;
  renderQuizView();
}

// --- QUIZ RESULT FORM RENDERER ---
function renderQuizResults(container) {
  const quiz = quizState.activeQuiz;
  let correct = 0;
  let incorrect = 0;
  let skipped = 0;

  quiz.questions.forEach(q => {
    const userAns = quizState.userAnswers[q.id];
    if (userAns === undefined) {
      skipped++;
    } else if (userAns === q.correctAnswer) {
      correct++;
    } else {
      incorrect++;
    }
  });

  const total = quiz.totalQuestions;
  const correctPct = Math.round((correct / total) * 100);
  const incorrectPct = 100 - correctPct;

  // Mock Leaderboard Data
  const leaderboard = [
    { username: 'You', correct: correct, total: total },
    { username: 'Player 1', correct: Math.max(0, correct - 1), total: total },
    { username: 'Player 2', correct: Math.min(total, correct + 1), total: total }
  ].sort((a, b) => b.correct - a.correct);

  container.innerHTML = `
    <!-- Header -->
    <div class="bg-[#FFF8EC] border-2 border-[#3D2013] rounded-xl p-3 shadow-sm flex flex-col gap-1">
      <h3 class="font-pressstart text-xs text-[#3D2013]">"${quiz.topic}" ${quiz.type} - Results</h3>
      <p class="font-pixel text-xs text-[#3D2013]/60">${quiz.sourcesCount} Sources Used</p>
    </div>

    <!-- Analytics Container -->
    <div class="bg-[#FFF8EC] border-2 border-[#3D2013] rounded-xl p-3 flex flex-col gap-3 shadow-sm">
      <h4 class="font-pressstart text-[10px] text-[#3D2013]">Performance Breakdown</h4>
      
      <!-- Visual Bar Graph -->
      <div class="w-full h-4 bg-[#A53914]/30 rounded-full border border-[#3D2013] overflow-hidden flex">
        <div style="width: ${correctPct}%;" class="bg-[#788D55] h-full transition-all duration-500"></div>
        <div style="width: ${incorrectPct}%;" class="bg-[#A53914] h-full transition-all duration-500"></div>
      </div>

      <!-- Stats List -->
      <div class="grid grid-cols-3 gap-1 text-center font-pixel text-xs">
        <div class="p-1.5 bg-[#788D55]/10 border border-[#788D55] rounded-lg">
          <span class="block font-bold text-[#788D55]">Correct</span>
          <span class="font-pressstart text-[10px]">${correct} pts</span>
        </div>
        <div class="p-1.5 bg-[#A53914]/10 border border-[#A53914] rounded-lg">
          <span class="block font-bold text-[#A53914]">Incorrect</span>
          <span class="font-pressstart text-[10px]">${incorrect} pts</span>
        </div>
        <div class="p-1.5 bg-[#3D2013]/10 border border-[#3D2013]/40 rounded-lg">
          <span class="block font-bold text-[#3D2013]">Skipped</span>
          <span class="font-pressstart text-[10px]">${skipped} pts</span>
        </div>
      </div>
    </div>

    <!-- Leaderboard Container -->
    <div class="bg-[#FFF8EC] border-2 border-[#3D2013] rounded-xl p-3 flex flex-col gap-2 shadow-sm">
      <h4 class="font-pressstart text-[10px] text-[#3D2013]">Leaderboard</h4>
      <div class="flex flex-col gap-1.5 font-pixel text-xs">
        ${leaderboard.map((player, idx) => `
          <div class="flex items-center justify-between p-1.5 rounded border border-[#3D2013]/20 ${player.username === 'You' ? 'bg-[#FCB980]/30 font-bold' : 'bg-[#FEF4E0]'}">
            <span>#${idx + 1} ${player.username}</span>
            <span class="font-pressstart text-[9px]">${player.correct} / ${player.total}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Footer Action Buttons -->
    <div class="flex items-center justify-between gap-2 pt-1">
      <button onclick="reviewQuiz()" class="px-3 py-1.5 bg-[#FEF4E0] border-2 border-[#3D2013] rounded-lg font-pressstart text-[10px] text-[#3D2013] hover:bg-[#FCB980] transition-colors cursor-pointer active:scale-95">
        Review Answers
      </button>
      <button onclick="retakeQuiz()" class="px-3 py-1.5 bg-[#E87339] border-2 border-[#3D2013] rounded-lg font-pressstart text-[10px] text-white hover:bg-[#DD6E36] transition-colors cursor-pointer active:scale-95">
        Retake Quiz
      </button>
    </div>
  `;
}

// --- QUIZ REVIEW FORM RENDERER ---
function renderQuizReview(container) {
  const quiz = quizState.activeQuiz;

  container.innerHTML = `
    <!-- Header -->
    <div class="bg-[#FFF8EC] border-2 border-[#3D2013] rounded-xl p-3 shadow-sm flex flex-col gap-1">
      <h3 class="font-pressstart text-xs text-[#3D2013]">Review Answers - "${quiz.topic}"</h3>
      <p class="font-pixel text-xs text-[#3D2013]/60">Green = Correct Answer | Red = Wrong Choice</p>
    </div>

    <!-- Questions List with Highlights -->
    <div class="flex flex-col gap-3">
      ${quiz.questions.map((q, qIdx) => {
        const userAns = quizState.userAnswers[q.id];
        return `
          <div class="bg-[#FFF8EC] border-2 border-[#3D2013] rounded-xl p-3 flex flex-col gap-2 shadow-sm">
            <p class="font-pixel text-xs font-bold text-[#3D2013]">
              Q${qIdx + 1}. ${q.question}
            </p>
            <div class="flex flex-col gap-1 font-pixel text-xs">
              ${q.options.map((opt, oIdx) => {
                let optionStyle = 'border-[#3D2013]/20 bg-transparent';
                let tag = '';

                if (oIdx === q.correctAnswer) {
                  optionStyle = 'border-[#788D55] bg-[#788D55]/20 font-bold text-[#5B6D3F]';
                  tag = ' ✓ (Correct Answer)';
                } else if (userAns === oIdx && userAns !== q.correctAnswer) {
                  optionStyle = 'border-[#A53914] bg-[#A53914]/20 font-bold text-[#A53914]';
                  tag = ' ✕ (Your Choice)';
                }

                return `
                  <div class="p-2 rounded border-2 ${optionStyle}">
                    <span>${opt}${tag}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Back to Results Button -->
    <div class="flex items-center justify-start pt-1">
      <button onclick="backToResults()" class="px-3 py-1.5 bg-[#3D2013] border-2 border-[#3D2013] rounded-lg font-pressstart text-[10px] text-white hover:bg-[#3D2013]/80 transition-colors cursor-pointer active:scale-95">
        ← Back to Results
      </button>
    </div>
  `;
}

// --- 3. Check Flashcard changes when navigating back ---
function handleBackToTools() {
  const step2Container = document.getElementById('step-2-generated-container');
  const lobbyContainer = document.getElementById('structured-lobby-container');
  const isStep2Active = step2Container && !step2Container.classList.contains('hidden');
  const isLobbyActive = lobbyContainer && !lobbyContainer.classList.contains('hidden');

  if (isStep2Active || isLobbyActive) {
    let hasChanges = hasActiveToolChanged;

    // Check Quiz state changes if not caught by flag
    if (!hasChanges && (currentActiveTool === 'Pre-quiz' || currentActiveTool === 'Post-quiz')) {
      const hasAnsweredQuestions = Object.keys(quizState.userAnswers).length > 0;
      
      if (currentGeneratedItem && currentGeneratedItem.quizState) {
        const originalAnswers = currentGeneratedItem.quizState.userAnswers || {};
        const isAnswersChanged = JSON.stringify(originalAnswers) !== JSON.stringify(quizState.userAnswers);
        const isStatusChanged = currentGeneratedItem.quizState.isCompleted !== quizState.isCompleted;
        hasChanges = isAnswersChanged || isStatusChanged;
      } else {
        hasChanges = hasAnsweredQuestions || quizState.isCompleted;
      }
    }

    // Check Flashcard state changes if not caught by flag
    if (!hasChanges && currentActiveTool === 'Flashcards') {
      if (currentGeneratedItem && currentGeneratedItem.flashcardState) {
        hasChanges = JSON.stringify(currentGeneratedItem.flashcardState) !== JSON.stringify(flashcardState);
      }
    }

    // Prompt modal ONLY when changes or progress are detected
    if (hasChanges) {
      openBackModal();
    } else {
      resetToolsView();
    }
  } else {
    resetToolsView();
  }
}
// Open Back Confirmation Modal
function openBackModal() {
  const modal = document.getElementById('back-confirmation-modal');
  const card = document.getElementById('back-modal-card');

  if (modal && card) {
    modal.classList.remove('hidden');
    setTimeout(() => {
      card.classList.remove('scale-95', 'opacity-0');
      card.classList.add('scale-100', 'opacity-100');
    }, 10);
  }
}

// Close Back Confirmation Modal
function closeBackModal(callback) {
  const modal = document.getElementById('back-confirmation-modal');
  const card = document.getElementById('back-modal-card');

  if (modal && card) {
    card.classList.remove('scale-100', 'opacity-100');
    card.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
      if (callback) callback();
    }, 200);
  }
}

// Modal Option 1: "Back" - Discard progress and reset to main tools menu
function confirmDiscardAndGoBack() {
  closeBackModal(() => {
    currentGeneratedItem = null; // Discard changes
    resetToolsView();
  });
}

// Modal Option 2: "Save" - Persist state/progress and reset to main tools menu
function confirmSaveAndGoBack() {
  closeBackModal(() => {
    saveAndFinishToolItem();
  });
}

// --- 1. Save tool item with Flashcard state persistence ---
function saveAndFinishToolItem() {
  if (currentGeneratedItem) {
    if (currentActiveTool === 'Pre-quiz' || currentActiveTool === 'Post-quiz') {
      currentGeneratedItem.quizState = JSON.parse(JSON.stringify(quizState));
    } else if (currentActiveTool === 'Flashcards') {
      currentGeneratedItem.flashcardState = JSON.parse(JSON.stringify(flashcardState));
    } else if (currentActiveTool === 'Notes') {
      currentGeneratedItem.notesState = JSON.parse(JSON.stringify(notesState));
    }

    const existingIndex = generatedItems.findIndex(item => item.id === currentGeneratedItem.id);
    if (existingIndex !== -1) {
      generatedItems[existingIndex] = { ...currentGeneratedItem };
    } else {
      generatedItems.unshift({ ...currentGeneratedItem });
    }

    renderGeneratedItemsList();
    currentGeneratedItem = null;
  }
  resetToolsView();
}

// Variable to track which item ID is pending deletion
let pendingDeleteItemId = null;

// Render Saved Generated Items on Tools Main Menu (Above Add Sources)
function renderGeneratedItemsList() {
  const container = document.getElementById('generated-items-list');
  if (!container) return;

  if (generatedItems.length === 0) {
    container.innerHTML = '';
    return;
  }

  // SVG Icons Pool
  const icons = {
    'Pre-quiz': `
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" class="w-3.5 h-3.5 text-white inline-block">
        <path d="M0 0h24v24H0z" fill="none" />
        <g fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 2a7.5 7.5 0 0 0-4.8 13.263C8.19 16.089 9 17.21 9 18.5h6c0-1.29.81-2.411 1.8-3.238A7.5 7.5 0 0 0 12 2Z" />
          <path stroke-linejoin="round" d="M15 18.5H9v2a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5z" />
          <path stroke-linecap="round" d="M10 8c0-1.013.895-2 2-2s2 .82 2 1.833c0 .365-.116.705-.317.991C13.085 9.676 12 10.488 12 11.5" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.992 14h.009" />
        </g>
      </svg>`,
    'Post-quiz': `
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" class="w-3.5 h-3.5 text-white inline-block">
        <path d="M0 0h24v24H0z" fill="none" />
        <path fill="currentColor" d="M14.738 14.688q.312-.313.312-.738t-.312-.737T14 12.9t-.737.313t-.313.737t.313.738T14 15t.738-.312M13.25 11.8h1.5q0-.725.15-1.062t.7-.888q.75-.75 1-1.212t.25-1.088q0-1.125-.788-1.837T14 5q-1.025 0-1.787.575T11.15 7.1l1.35.55q.225-.625.613-.937T14 6.4q.6 0 .975.338t.375.912q0 .35-.2.663t-.7.787q-.825.725-1.012 1.138T13.25 11.8M8 18q-.825 0-1.412-.587T6 16V4q0-.825.588-1.412T8 2h12q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18zm-4 4q-.825 0-1.412-.587T2 20V6h2v14h14v2z" />
      </svg>`,
    'Flashcards': `
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" class="w-3.5 h-3.5 text-white inline-block">
        <path d="M0 0h48v48H0z" fill="none" />
        <defs>
          <mask id="SVGy38Vyesv">
            <g fill="none" stroke-linejoin="round" stroke-width="4">
              <path fill="#fff" stroke="#fff" d="M41 5.5H7v28h34z" />
              <path stroke="#fff" stroke-linecap="round" d="m16 41.5l8-8l8 8" />
              <path stroke="#000" stroke-linecap="round" d="m13.924 24.663l5.642-5.508l4.442 4.345l9.959-9.98" />
              <path stroke="#fff" stroke-linecap="round" d="M4 5.5h40" />
            </g>
          </mask>
        </defs>
        <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#SVGy38Vyesv)" />
      </svg>`,
    'Notes': `
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" class="w-3.5 h-3.5 text-white inline-block">
        <path d="M0 0h24v24H0z" fill="none" />
        <path fill="currentColor" d="M6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h8l6 6v12q0 .825-.587 1.413T18 22zm7-13h5l-5-5z" />
      </svg>`
  };

  container.innerHTML = generatedItems.map(item => `
    <div onclick="openSavedGeneratedItem('${item.id}')" 
         class="group flex items-center justify-between rounded-xl p-2.5 bg-[#FFF8EC]/60 border border-[#3D2013]/10 hover:border-[#3D2013]/30 cursor-pointer hover:bg-[#FEF4E0] transition-all gap-2">
      <div class="flex items-center gap-2 min-w-0 flex-1">
        <span class="${item.badgeColor} text-white font-pressstart text-[9px] p-1.5 rounded shrink-0 inline-flex items-center justify-center">
          ${icons[item.type] || ''}
        </span>
        <span class="font-pressstart text-[6px] sm:text-[8px] md:text-[10px] text-[#3D2013] truncate">${item.title}</span>
      </div>

      <div class="flex items-center gap-1 shrink-0">
        <!-- Delete Button -->
        <button type="button" 
                onclick="promptDeleteItem(event, '${item.id}')" 
                title="Delete Item"
                class="p-1 rounded-md text-[#3D2013]/40 hover:text-[#A53914] hover:bg-[#A53914]/10 transition-colors cursor-pointer">
          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        <!-- Open Arrow -->
        <svg class="w-3.5 h-3.5 text-[#3D2013]/60 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  `).join('');
}

// Open Delete Confirmation Modal
function promptDeleteItem(event, id) {
  // Prevent click event from bubbling up to openSavedGeneratedItem
  if (event) event.stopPropagation();

  const item = generatedItems.find(i => i.id === id);
  if (!item) return;

  pendingDeleteItemId = id;

  const textElem = document.getElementById('delete-modal-text');
  if (textElem) {
    textElem.textContent = `Are you sure you want to delete "${item.title}"?`;
  }

  const modal = document.getElementById('delete-confirmation-modal');
  const card = document.getElementById('delete-modal-card');

  if (modal && card) {
    modal.classList.remove('hidden');
    setTimeout(() => {
      card.classList.remove('scale-95', 'opacity-0');
      card.classList.add('scale-100', 'opacity-100');
    }, 10);
  }
}

// Close Delete Modal
function closeDeleteModal() {
  const modal = document.getElementById('delete-confirmation-modal');
  const card = document.getElementById('delete-modal-card');

  if (modal && card) {
    card.classList.remove('scale-100', 'opacity-100');
    card.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
      pendingDeleteItemId = null;
    }, 200);
  }
}

// Confirm Delete & Remove Item
function confirmDeleteItem() {
  if (!pendingDeleteItemId) return;

  // Remove from state
  generatedItems = generatedItems.filter(item => item.id !== pendingDeleteItemId);

  // Re-render list
  renderGeneratedItemsList();

  // Close modal
  closeDeleteModal();
}

// --- 2. Open saved item and restore Flashcard state ---
function openSavedGeneratedItem(id) {
  const item = generatedItems.find(i => i.id === id);
  if (!item) return;

  currentActiveTool = item.type;
  hasActiveToolChanged = false;

  const titleElem = document.getElementById('tools-header-title');
  if (titleElem) titleElem.textContent = item.title;

  document.getElementById('tools-main-menu').classList.add('hidden');
  document.getElementById('tools-form-view').classList.remove('hidden');
  document.getElementById('step-1-source-select').classList.add('hidden');
  document.getElementById('step-2-generated-container').classList.remove('hidden');

  currentGeneratedItem = item;

  if (item.quizState) {
    quizState = JSON.parse(JSON.stringify(item.quizState));
    renderQuizView();
  } else if (item.flashcardState) {
    flashcardState = JSON.parse(JSON.stringify(item.flashcardState));
    renderFlashcardsView();
  } else if (item.notesState) {
    notesState = JSON.parse(JSON.stringify(item.notesState));
    renderNotesView();
  } else {
    generateMockToolContent(item.type);
  }
}

// ==================== PDF UPLOAD & MODAL LOGIC ====================

// --- FILE UPLOAD MODAL & RENDERING LOGIC ---
function openPdfModal() {
  const modal = document.getElementById('pdf-upload-modal');
  const card = document.getElementById('pdf-modal-card');
  if (!modal || !card) return;
  
  modal.classList.remove('hidden');
  setTimeout(() => {
    card.classList.remove('scale-95', 'opacity-0');
    card.classList.add('scale-100', 'opacity-100');
  }, 10);
}

function closePdfModal() {
  const modal = document.getElementById('pdf-upload-modal');
  const card = document.getElementById('pdf-modal-card');
  if (!modal || !card) return;

  card.classList.remove('scale-100', 'opacity-100');
  card.classList.add('scale-95', 'opacity-0');
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 200);
}

// Reset progress state
function resetModalProgress() {
  const progressContainer = document.getElementById('upload-progress-container');
  const progressBar = document.getElementById('upload-progress-bar');
  const progressPercent = document.getElementById('upload-percent');
  const dropZone = document.getElementById('drag-drop-zone');

  if (progressContainer) progressContainer.classList.add('hidden');
  if (dropZone) dropZone.classList.remove('hidden');
  if (progressBar) progressBar.style.width = '0%';
  if (progressPercent) progressPercent.textContent = '0%';
}

function triggerFileInput() {
  document.getElementById('pdf-file-input').click();
}

function handleFileSelect(event) {
  const files = event.target.files;
  if (files && files[0]) {
    simulateFileUpload(files[0]);
  }
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDragLeave(e) {
  e.preventDefault();
}

function handleFileDrop(e) {
  e.preventDefault();
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    simulateFileUpload(e.dataTransfer.files[0]);
  }
}

function simulateFileUpload(file) {
  const progressContainer = document.getElementById('upload-progress-container');
  const progressBar = document.getElementById('upload-progress-bar');
  const percentText = document.getElementById('upload-percent');
  const nameText = document.getElementById('upload-filename');
  const sizeText = document.getElementById('upload-filesize');

  progressContainer.classList.remove('hidden');
  nameText.textContent = file.name;
  sizeText.textContent = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

  let progress = 0;
  const interval = setInterval(() => {
    progress += 20;
    progressBar.style.width = `${progress}%`;
    percentText.textContent = `${progress}%`;

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        uploadedFiles.push({
          id: Date.now().toString(),
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          addedBy: 'You'
        });
        renderUploadedFiles();
        closePdfModal();
        progressContainer.classList.add('hidden');
        progressBar.style.width = '0%';
      }, 300);
    }
  }, 150);
}

// Render uploaded source files list on Main Menu
function renderUploadedFiles() {
  const list = document.getElementById('uploaded-files-list');
  if (!list) return;

  list.innerHTML = uploadedFiles.map(file => {
    // Format addedBy display (defaults to "You" if missing or set to current user)
    const uploaderLabel = (!file.addedBy || file.addedBy === "You") ? "You" : file.addedBy;

    return `
      <div class="flex items-center justify-between rounded-xl p-2.5 bg-[#FFF8EC]/60 border border-[#3D2013]/10">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="flex items-center justify-center shrink-0 text-[#E87339]">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path fill="#ef5350" d="M13 9h5.5L13 3.5zM6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m4.93 10.44c.41.9.93 1.64 1.53 2.15l.41.32c-.87.16-2.07.44-3.34.93l-.11.04l.5-1.04c.45-.87.78-1.66 1.01-2.4m6.48 3.81c.18-.18.27-.41.28-.66c.03-.2-.02-.39-.12-.55c-.29-.47-1.04-.69-2.28-.69l-1.29.07l-.87-.58c-.63-.52-1.2-1.43-1.6-2.56l.04-.14c.33-1.33.64-2.94-.02-3.6a.85.85 0 0 0-.61-.24h-.24c-.37 0-.7.39-.79.77c-.37 1.33-.15 2.06.22 3.27v.01c-.25.88-.57 1.9-1.08 2.93l-.96 1.8l-.89.49c-1.2.75-1.77 1.59-1.88 2.12c-.04.19-.02.36.05.54l.03.05l.48.31l.44.11c.81 0 1.73-.95 2.97-3.07l.18-.07c1.03-.33 2.31-.56 4.03-.75c1.03.51 2.24.74 3 .74c.44 0 .74-.11.91-.3m-.41-.71l.09.11c-.01.1-.04.11-.09.13h-.04l-.19.02c-.46 0-1.17-.19-1.9-.51c.09-.1.13-.1.23-.1c1.4 0 1.8.25 1.9.35M7.83 17c-.65 1.19-1.24 1.85-1.69 2c.05-.38.5-1.04 1.21-1.69zm3.02-6.91c-.23-.9-.24-1.63-.07-2.05l.07-.12l.15.05c.17.24.19.56.09 1.1l-.03.16l-.16.82z" />
            </svg>
          </div>
          <div class="flex flex-col min-w-0">
            <div class="flex items-center gap-1.5 min-w-0">
              <span class="font-pressstart text-[8px] lg:text-[10px] text-[#3D2013] truncate">${file.name}</span>
              <span class="font-pixel text-[15px] text-[#482A1D] shrink-0" leading-none>• Added by: ${uploaderLabel}</span>
            </div>
            <span class="font-pixel text-[11px] text-[#3D2013]/60">${file.size || 'Unknown size'}</span>
          </div>
        </div>
        <button onclick="removeUploadedFile('${file.id}')" class="text-[#3D2013]/50 hover:text-[#A53914] text-xs font-bold px-1.5 py-0.5 rounded cursor-pointer">
          ✕
        </button>
      </div>
    `;
  }).join('');
}

function removeUploadedFile(id) {
  uploadedFiles = uploadedFiles.filter(f => f.id !== id);
  renderUploadedFiles();
}

// Validate PDF format & simulate upload progress
function validateAndProcessPdf(file) {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith('.pdf')) {
    alert("Please upload PDF files only!");
    return;
  }

  const dropZone = document.getElementById('drag-drop-zone');
  const progressContainer = document.getElementById('upload-progress-container');
  const filenameElem = document.getElementById('upload-filename');
  const filesizeElem = document.getElementById('upload-filesize');
  const progressBar = document.getElementById('upload-progress-bar');
  const progressPercent = document.getElementById('upload-percent');

  // Format File Size
  const formattedSize = formatBytes(file.size);

  if (filenameElem) filenameElem.textContent = file.name;
  if (filesizeElem) filesizeElem.textContent = formattedSize;

  // Show Progress View
  if (dropZone) dropZone.classList.add('hidden');
  if (progressContainer) {
    progressContainer.classList.remove('hidden');
    progressContainer.classList.add('flex');
  }

  // Simulate Upload Progress
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);

      if (progressBar) progressBar.style.width = '100%';
      if (progressPercent) progressPercent.textContent = '100%';

      setTimeout(() => {
        // 1. Inflate File under Library Button
        inflateUploadedFile(file.name, formattedSize, file);

        // 2. Trigger Retro Success Toast
        showCustomizerSuccessToast(`Uploaded: ${file.name}`);

        // 3. Close Modal
        closePdfModal();
      }, 400);
    } else {
      if (progressBar) progressBar.style.width = `${progress}%`;
      if (progressPercent) progressPercent.textContent = `${progress}%`;
    }
  }, 150);
}

// Format Bytes to KB/MB
function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function inflateUploadedFile(filename, filesize, fileObject, addedBy = "You") {
  const container = document.getElementById('uploaded-files-list');
  if (!container) return;

  const fileUrl = URL.createObjectURL(fileObject);

  const fileCard = document.createElement('div');
  fileCard.className = 
    "uploaded-file-item p-2 flex items-center justify-between border-b border-[#3D2013]/10 last:border-b-0 " +
    "transition-all animate-fadeIn";

  // Check if added by the current user to display "You" vs the username
  const uploaderLabel = (addedBy === "You" || !addedBy) ? "You" : addedBy;

  fileCard.innerHTML = `
    <div class="flex items-center gap-2.5 min-w-0 pr-2">
      <div class="flex items-center justify-center shrink-0 text-[#E87339]">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path fill="#ef5350" d="M13 9h5.5L13 3.5zM6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m4.93 10.44c.41.9.93 1.64 1.53 2.15l.41.32c-.87.16-2.07.44-3.34.93l-.11.04l.5-1.04c.45-.87.78-1.66 1.01-2.4m6.48 3.81c.18-.18.27-.41.28-.66c.03-.2-.02-.39-.12-.55c-.29-.47-1.04-.69-2.28-.69l-1.29.07l-.87-.58c-.63-.52-1.2-1.43-1.6-2.56l.04-.14c.33-1.33.64-2.94-.02-3.6a.85.85 0 0 0-.61-.24h-.24c-.37 0-.7.39-.79.77c-.37 1.33-.15 2.06.22 3.27v.01c-.25.88-.57 1.9-1.08 2.93l-.96 1.8l-.89.49c-1.2.75-1.77 1.59-1.88 2.12c-.04.19-.02.36.05.54l.03.05l.48.31l.44.11c.81 0 1.73-.95 2.97-3.07l.18-.07c1.03-.33 2.31-.56 4.03-.75c1.03.51 2.24.74 3 .74c.44 0 .74-.11.91-.3m-.41-.71l.09.11c-.01.1-.04.11-.09.13h-.04l-.19.02c-.46 0-1.17-.19-1.9-.51c.09-.1.13-.1.23-.1c1.4 0 1.8.25 1.9.35M7.83 17c-.65 1.19-1.24 1.85-1.69 2c.05-.38.5-1.04 1.21-1.69zm3.02-6.91c-.23-.9-.24-1.63-.07-2.05l.07-.12l.15.05c.17.24.19.56.09 1.1l-.03.16l-.16.82z" />
        </svg>
      </div>
      <div class="flex flex-col min-w-0">
        <div class="flex items-center gap-1.5 min-w-0">
          <span class="font-pressstart text-[9px] sm:text-[10px] text-[#3D2013] truncate">${filename}</span>
          <span class="font-pixel text-[11px] sm:text-xs text-[#E87339] shrink-0">• Added by ${uploaderLabel}</span>
        </div>
        <span class="font-pixel text-xs text-[#3D2013]/60">${filesize} • Just now</span>
      </div>
    </div>

    <div class="flex items-center gap-1.5 shrink-0">
      <a href="${fileUrl}" download="${filename}" title="Download / Open File"
         class="p-1.5 text-[#788D55] hover:text-[#5B6D3F] transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </a>
      
      <button onclick="this.closest('.uploaded-file-item').remove()" title="Remove File"
              class="p-1.5 text-[#3D2013]/40 hover:text-[#A53914] transition-colors cursor-pointer">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  `;

  container.prepend(fileCard);
}

// Retro Toast Helper (Included from reference)
function showCustomizerSuccessToast(message = "Purchase Successful!") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = 
    "bg-[#FBF2E3] border-4 border-[#3D2013] p-4 flex flex-col gap-2 relative shadow-md " +
    "transition-all duration-300 max-w-xs retro-shadow pointer-events-auto " +
    "opacity-0 translate-y-[-20px] !rounded-none overflow-hidden z-[130]";
  toast.style.boxShadow = "4px 4px 0px #3D2013";

  toast.innerHTML = `
    <div class="flex items-center gap-3 pr-2">
      <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="#788D55" stroke-width="4" stroke-linecap="square" stroke-linejoin="square"/>
      </svg>
      <span class="font-pressstart text-[10px] text-[#482A1D] tracking-wide truncate">${message}</span>
    </div>
    <div class="w-full bg-transparent h-1.5 flex justify-center mt-auto overflow-hidden">
      <div class="w-full h-full bg-[#788D55] animate-progress-center"></div>
    </div>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove("opacity-0", "translate-y-[-20px]");
    toast.classList.add("opacity-100", "translate-y-0");
  });

  setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-y-0");
    toast.classList.add("opacity-0", "translate-y-[-20px]");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Add this helper function to handle flashcard flipping
function toggleFlashcard(cardElement) {
  const front = cardElement.querySelector('.card-front');
  const back = cardElement.querySelector('.card-back');
  if (front && back) {
    front.classList.toggle('hidden');
    back.classList.toggle('hidden');
  }
}

roomTimerChannel.onmessage = (event) => {
  syncStudyTimerFromHomepage(event.data);
};

window.addEventListener("storage", (event) => {
  if (event.key !== STUDY_TIMER_STORAGE_KEY) return;

  try {
    syncStudyTimerFromHomepage(JSON.parse(event.newValue));
  } catch (error) {
    renderStudyTimerFromHomepage({
      source: "homepage-study-timer",
      secondsLeft: 0,
      formattedTime: "00:00",
      isRunning: false
    });
  }
});


// --- MOCK DATA ---
const roomInfo = {
  name: 'Study Rooooom'
};

const mockPlayers = [
  { id: '1', name: 'Player 1', avatarLabel: 'P1' },
  { id: '2', name: 'Player 2', avatarLabel: 'P2' },
  { id: '3', name: 'Player 3', avatarLabel: 'P3' },
];

// --- INITIAL SETUP ---
document.addEventListener('DOMContentLoaded', () => {
  renderRoomInfo();
  renderPlayers();
  renderUploadedFiles();
});

// --- RENDER FUNCTIONS ---

// 1. Render Room Information
function renderRoomInfo() {
  const roomHeading = document.getElementById('room-name-heading');
  if (roomHeading) {
    roomHeading.textContent = roomInfo.name;
  }
}

// 2. Render Desktop & Mobile Players List Dynamically
function renderPlayers() {
  const desktopContainer = document.getElementById('desktop-players-list');
  const mobileDropdownContainer = document.getElementById('players-dropdown');
  const mobileCountBadge = document.getElementById('mobile-players-count');

  // Update mobile button counter badge (e.g. "3P")
  if (mobileCountBadge) {
    mobileCountBadge.textContent = `${mockPlayers.length}P`;
  }

  // Render Desktop Avatars
  if (desktopContainer) {
    desktopContainer.innerHTML = mockPlayers.map(player => `
      <div title="${player.name}" class="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full border-[3px] sm:border-[4px] border-[#788D55] bg-[#FEF4E0] shadow-sm flex items-center justify-center overflow-hidden shrink-0">
        <span class="font-pixel text-xs font-bold">${player.avatarLabel}</span>
      </div>
    `).join('');
  }

  // Render Mobile Dropdown List
  if (mobileDropdownContainer) {
    mobileDropdownContainer.innerHTML = mockPlayers.map((player, index) => {
      const isLast = index === mockPlayers.length - 1;
      const borderClass = isLast ? '' : 'pb-1 border-b border-[#3D2013]/20';
      return `
        <div class="flex items-center gap-2 ${borderClass}">
          <div class="w-7 h-7 rounded-full border-[2px] border-[#788D55] bg-[#FEF4E0] flex items-center justify-center text-xs font-pixel shrink-0">
            ${player.avatarLabel}
          </div>
          <span class="font-pixel text-xs font-bold text-[#3D2013] truncate">${player.name}</span>
        </div>
      `;
    }).join('');
  }
}

function closeKitsuModal() {
  // If embedded in an iframe inside homepage.html modal
  if (window.parent && window.parent.closeKitsuAiModal) {
    window.parent.closeKitsuAiModal();
  } else if (document.referrer && document.referrer.includes(window.location.host)) {
    // If opened as a standalone page, use history navigation
    window.history.back();
  } else {
    // Fallback navigation
    window.location.href = 'homepage.html';
  }
}

d// ==========================================
// 1. EXISTING UI FUNCTIONS (Huwag burahin)
// ==========================================
function closeKitsuModal() {
  // If embedded in an iframe inside homepage.html modal
  if (window.parent && window.parent.closeKitsuAiModal) {
    window.parent.closeKitsuAiModal();
  } else if (document.referrer && document.referrer.includes(window.location.host)) {
    // If opened as a standalone page, use history navigation
    window.history.back();
  } else {
    // Fallback navigation
    window.location.href = 'homepage.html';
  }
}

// ==========================================
// 2. NEW LOBBY & POLLING VARIABLES
// ==========================================
let roomPollingInterval;
let isPlayerReady = false;

// ==========================================
// 3. NEW LOBBY FUNCTIONS
// ==========================================
async function toggleReadyStatus(roomCode) {
    const token = sessionStorage.getItem("token");
    if (!token) return alert("You are not logged in!");

    try {
        const res = await fetch(`http://127.0.0.1:5000/api/room/toggle-ready`, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ roomCode: roomCode })
        });
        const data = await res.json();
        
        if (res.ok) {
            isPlayerReady = data.is_ready;
            // Update button UI based on status
            const readyBtn = document.getElementById("btn-ready");
            if (readyBtn) {
                readyBtn.innerText = isPlayerReady ? "Ready!" : "Click to Ready";
                readyBtn.style.backgroundColor = isPlayerReady ? "#97B591" : "#FD923E"; 
            }
        } else {
            console.error("Failed to toggle ready:", data.error);
        }
    } catch (err) {
        console.error("Error toggling ready:", err);
    }
}

let roomPollingInterval;
let isPlayerReady = false;

// Function para i-render ang Lobby UI batay sa kung Host o Player ka
function renderQuizLobbyUI(data) {
    const container = document.getElementById("kitsu-main-content") || document.body; // Baguhin depende sa container ID mo
    
    const readyCount = data.players.filter(p => p.is_ready).length;
    const totalCount = data.current_count;

    // Kung sinimulan na ng host ang quiz, i-redirect o i-load na ang quiz questions screen
    if (data.quiz_started) {
        clearInterval(roomPollingInterval);
        loadQuizQuestionsInterface();
        return;
    }

    if (data.is_host) {
        // --- HOST VIEW (Screenshot 1 style) ---
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center p-6">
                <h2 class="font-pressstart text-[14px] text-[#3D2013] mb-2">Quiz Lobby</h2>
                <p class="font-pressstart text-[8px] text-[#3D2013]/70 mb-6">Players are joining and marking themselves ready.</p>
                
                <div class="bg-[#FEF4E0] border-[3px] border-[#3D2013] p-6 rounded-lg w-full max-w-md text-center shadow-md mb-6">
                    <p class="font-pressstart text-[12px] text-[#3D2013] mb-1">${readyCount}/${totalCount} Players Ready</p>
                    <p class="font-pressstart text-[8px] text-[#3D2013]/60">${data.all_ready ? "Everyone is ready." : "Waiting for players to ready up..."}</p>
                </div>

                <button id="btn-start-quiz" onclick="hostStartQuiz('${data.roomCode}')" 
                    class="font-pressstart text-[10px] text-[#FEF4E0] px-8 py-3 rounded-lg border-[3px] border-[#3D2013] transition-all cursor-pointer retro-shadow ${data.all_ready ? 'bg-[#788D55] hover:brightness-105' : 'bg-gray-400 opacity-50 cursor-not-allowed'}"
                    ${!data.all_ready ? 'disabled' : ''}>
                    Start Quiz
                </button>
            </div>
        `;
    } else {
        // --- PLAYER VIEW (Screenshot 2 & 3 style) ---
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center p-6">
                <div class="bg-[#FEF4E0] border-[3px] border-[#3D2013] p-6 rounded-lg w-full max-w-md text-center shadow-md mb-6">
                    <p class="font-pressstart text-[11px] text-[#3D2013] mb-2">Waiting for the host to start</p>
                    <p class="font-pressstart text-[8px] text-[#3D2013]/60 mb-4">${readyCount}/${totalCount} Players Ready</p>
                    
                    <button id="btn-ready" onclick="toggleReadyStatus('${data.roomCode}')" 
                        class="w-full font-pressstart text-[10px] text-[#FEF4E0] py-3 rounded-lg border-[3px] border-[#3D2013] transition-all cursor-pointer retro-shadow ${isPlayerReady ? 'bg-[#788D55]' : 'bg-[#FD923E]'}">
                        ${isPlayerReady ? 'Ready' : "I'm Ready"}
                    </button>
                </div>
            </div>
        `;
    }
}

// Function para tawagin ang status check bawat 2 segundo
async function fetchRoomStatus(roomCode) {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
        const res = await fetch(`http://127.0.0.1:5000/api/room/${roomCode}/status`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();

        if (res.ok) {
            data.roomCode = roomCode;
            renderQuizLobbyUI(data);
        }
    } catch (err) {
        console.error("Error fetching room status:", err);
    }
}

// Host action para i-start ang quiz para sa lahat
async function hostStartQuiz(roomCode) {
    const token = sessionStorage.getItem("token");
    try {
        const res = await fetch(`http://127.0.0.1:5000/api/room/${roomCode}/start-quiz`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
            loadQuizQuestionsInterface();
        }
    } catch (err) {
        console.error("Error starting quiz:", err);
    }
}

// Dito kukunin at ipapakita ang mismong Pre-Quiz questions para sa pagsagot sabay-sabay
async function loadQuizQuestionsInterface() {
    const urlParams = new URLSearchParams(window.location.search);
    const roomCode = urlParams.get('code');
    const token = sessionStorage.getItem("token");
    
    try {
        const res = await fetch(`http://127.0.0.1:5000/api/room/${roomCode}/pre-quiz`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const quizData = await res.json();

        if (res.ok) {
            console.log("Quiz Loaded:", quizData);
            // Ilagay dito ang rendering ng mga tanong (Questions, Options, at Individual Score tracker)
            alert("Quiz has started! Rendering questions now...");
        }
    } catch (err) {
        console.error("Error loading quiz questions:", err);
    }
}

// Bagong function para i-fetch ang Pre-Quiz galing sa AI
async function fetchAndShowPreQuiz(roomCode) {
    const token = sessionStorage.getItem("token");
    try {
        alert("All players are ready! Generating AI Pre-Quiz from your PDF...");
        
        const res = await fetch(`http://127.0.0.1:5000/api/room/${roomCode}/pre-quiz`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const quizData = await res.json();

        if (res.ok) {
            console.log("Pre-Quiz Generated successfully:", quizData);
            
            // Pansamantalang ilalagay natin sa memory para magamit sa UI mo
            window.currentActiveQuiz = quizData;
            
            // Dito mo na i-rrender ang quiz questions sa HTML modal o container mo
            alert(`Quiz Ready! Topic: ${quizData.topic}\nFirst Question: ${quizData.questions[0].question}`);
            
            // TODO: Ilagay dito ang function para ipakita ang quiz container sa kitsuai.html
        } else {
            alert("Error generating quiz: " + (quizData.error || "Unknown error"));
        }
    } catch (err) {
        console.error("Error fetching pre-quiz:", err);
    }
}

// ==========================================
// 4. INITIALIZATION ON PAGE LOAD
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Get the code from the URL (Priority)
    const urlParams = new URLSearchParams(window.location.search);
    const roomCodeFromUrl = urlParams.get('code');

    // 2. Determine which room data to load
    if (roomCodeFromUrl) {
        console.log("Loading Room from URL:", roomCodeFromUrl);
        
        // --- BAGONG IDINAGDAG PARA SA LOBBY ---
        // Simulan ang timer! Magtatanong sa backend every 2 seconds
        roomPollingInterval = setInterval(() => fetchRoomStatus(roomCodeFromUrl), 2000);

        // I-setup ang "Ready" button
        const readyBtn = document.getElementById("btn-ready");
        if (readyBtn) {
            readyBtn.addEventListener("click", () => toggleReadyStatus(roomCodeFromUrl));
        }
        // --------------------------------------

    } else {
        // Fallback: If no code in URL, check localStorage
        const storedRoom = JSON.parse(localStorage.getItem("currentActiveRoom"));
        if (storedRoom && (storedRoom.roomCode === roomCodeFromUrl || storedRoom.room_code === roomCodeFromUrl)) {
             console.log("Room data matches URL:", storedRoom.name);
        } else {
            console.warn("No active room found in URL or LocalStorage.");
        }
    }
});