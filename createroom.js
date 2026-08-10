/**
 * Create Room Dynamic Step Form Controller & Database Sync
 */
let currentStep = 1;

// Base step configuration
const allSteps = [
  { stepId: 1, title: "Details" },
  { stepId: 2, title: "Privacy" },
  { stepId: 3, title: "Tasks" },
  { stepId: 4, title: "Invite" },
  { stepId: 5, title: "Review" }
];

// Dynamic Room Code Generator for Step 2
let generatedRoomCode = `SC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

document.addEventListener("DOMContentLoaded", () => {
  // Initialize dynamic room code and links in Step 2
  const inviteCodeDisplay = document.getElementById("invite-code-display");
  const inviteLinkDisplay = document.getElementById("invite-link-display");
  
  if (inviteCodeDisplay) inviteCodeDisplay.textContent = generatedRoomCode;
  if (inviteLinkDisplay) inviteLinkDisplay.textContent = `studycircle.app/join/${generatedRoomCode}`;

  renderDraftTasks();
  fetchRealFriends(); // Fetch actual friends from database instead of mock data
  updateStepUI();
});

/**
 * Gets the active steps list based on Max Players count (1 = Solo mode skips Step 4)
 */
function getActiveSteps() {
  const playersSelect = document.getElementById('room-players');
  const maxPlayers = playersSelect ? parseInt(playersSelect.value, 10) : 0;

  if (maxPlayers === 1) {
    return allSteps.filter(step => step.stepId !== 4);
  }
  return allSteps;
}

/**
 * Renders the step progress bars dynamically
 */
function renderProgressBars() {
  const container = document.getElementById("session-bars-container");
  if (!container) return;

  const activeSteps = getActiveSteps();
  const totalSteps = activeSteps.length;
  const currentStepIndex = activeSteps.findIndex(s => s.stepId === currentStep);

  let barsHTML = "";
  for (let i = 0; i < totalSteps; i++) {
    const bgClass = i <= currentStepIndex ? "bg-[#FD923E]" : "bg-[#FEF4E0]";
    barsHTML += `<div class="flex-1 h-full ${bgClass} border-[2px] border-[#3D2013] transition-colors duration-300"></div>`;
  }
  container.innerHTML = barsHTML;
}

/**
 * Updates step text, dynamic progress bar, form panels display, and action buttons
 */
function updateStepUI() {
  const activeSteps = getActiveSteps();
  const totalSteps = activeSteps.length;
  
  let currentStepIndex = activeSteps.findIndex(s => s.stepId === currentStep);
  if (currentStepIndex === -1) {
    currentStep = activeSteps[0].stepId;
    currentStepIndex = 0;
  }

  const stepNumberText = document.getElementById("step-number-text");
  const stepTitleText = document.getElementById("step-title-text");

  if (stepNumberText) stepNumberText.textContent = `${currentStepIndex + 1} of ${totalSteps}`;
  if (stepTitleText) stepTitleText.textContent = activeSteps[currentStepIndex].title;

  renderProgressBars();

  for (let i = 1; i <= 5; i++) {
    const formPanel = document.getElementById(`step-form-${i}`);
    if (formPanel) {
      if (i === currentStep) {
        formPanel.classList.remove("hidden");
      } else {
        formPanel.classList.add("hidden");
      }
    }
  }

  if (currentStep === 5) {
    renderReviewSummary();
  }

  const btnBack = document.getElementById("btn-back");
  const btnNext = document.getElementById("btn-next");
  const btnCreate = document.getElementById("btn-create");

  if (btnBack) {
    if (currentStepIndex === 0) {
      btnBack.classList.add("hidden");
      btnBack.classList.remove("flex");
    } else {
      btnBack.classList.remove("hidden");
      btnBack.classList.add("flex");
    }
  }

  if (btnNext && btnCreate) {
    if (currentStepIndex === totalSteps - 1) {
      btnNext.classList.add("hidden");
      btnNext.classList.remove("flex");
      btnCreate.classList.remove("hidden");
      btnCreate.classList.add("flex");
    } else {
      btnNext.classList.remove("hidden");
      btnNext.classList.add("flex");
      btnCreate.classList.add("hidden");
      btnCreate.classList.remove("flex");
    }
  }
}

/**
 * Validates current step input requirements before proceeding
 */
function validateStep(step) {
  if (step === 1) {
    let isValid = true;
    const roomNameInput = document.getElementById('room-name');
    const roomTopicInput = document.getElementById('room-topic');
    const roomPlayersSelect = document.getElementById('room-players');
    const roomSessionsSelect = document.getElementById('room-sessions');
    const customSessionsInput = document.getElementById('custom-sessions-input');

    if (!roomNameInput || roomNameInput.value.trim() === '') {
      showError('room-name');
      isValid = false;
    }
    if (!roomTopicInput || roomTopicInput.value.trim() === '') {
      showError('room-topic');
      isValid = false;
    }
    if (!roomPlayersSelect || roomPlayersSelect.value === '' || Number(roomPlayersSelect.value) < 1 || Number(roomPlayersSelect.value) > 6) {
      showError('room-players');
      isValid = false;
    }
    if (!roomSessionsSelect || roomSessionsSelect.value === '') {
      showError('room-sessions');
      isValid = false;
    } else if (roomSessionsSelect.value === 'custom') {
      if (!customSessionsInput || customSessionsInput.value.trim() === '' || parseInt(customSessionsInput.value, 10) <= 0) {
        showError('room-sessions');
        isValid = false;
      }
    }
    return isValid;
  }
  return true;
}

function toggleDropdownArrow(isOpen) {
  const arrowIcon = document.getElementById("arrow-icon-players");
  if (!arrowIcon) return;
  if (isOpen) {
    arrowIcon.classList.add("rotate-180");
  } else {
    arrowIcon.classList.remove("rotate-180");
  }
}

function handlePlayersChange(selectEl) {
  clearError('room-players');
  if (selectEl.value !== "") {
    selectEl.classList.remove("text-[#3D2013]/40");
    selectEl.classList.add("text-[#3D2013]");
  }
  enforceInviteLimits();
  renderFriendsList();
  updateStepUI();
}

function showError(fieldId) {
  const inputEl = document.getElementById(fieldId);
  const errorEl = document.getElementById(`error-${fieldId}`);
  if (inputEl) inputEl.classList.add('border-[#D9383A]');
  if (errorEl) errorEl.classList.remove('hidden');
}

function clearError(fieldId) {
  const inputEl = document.getElementById(fieldId);
  const errorEl = document.getElementById(`error-${fieldId}`);
  if (inputEl) inputEl.classList.remove('border-[#D9383A]');
  if (errorEl) errorEl.classList.add('hidden');
}

function nextStep() {
  if (!validateStep(currentStep)) return;
  const activeSteps = getActiveSteps();
  const currentStepIndex = activeSteps.findIndex(s => s.stepId === currentStep);
  if (currentStepIndex < activeSteps.length - 1) {
    currentStep = activeSteps[currentStepIndex + 1].stepId;
    updateStepUI();
  }
}

function previousStep() {
  const activeSteps = getActiveSteps();
  const currentStepIndex = activeSteps.findIndex(s => s.stepId === currentStep);
  if (currentStepIndex > 0) {
    currentStep = activeSteps[currentStepIndex - 1].stepId;
    updateStepUI();
  }
}

function goBack() {
  if (document.referrer && document.referrer.includes(window.location.host)) {
    window.history.back();
  } else {
    window.location.href = "myroom.html";
  }
}

let selectedTechniqueKey = 'pomodoro';
function selectTechnique(technique) {
  selectedTechniqueKey = technique;
  const techniques = ['pomodoro', '5217', '90min'];
  techniques.forEach(tech => {
    const btn = document.getElementById(`btn-tech-${tech}`);
    if (!btn) return;
    if (tech === technique) {
      btn.classList.remove('bg-[#FAE9CE]', 'flat-retro-shadow-hover');
      btn.classList.add('bg-[#FD923E]');
    } else {
      btn.classList.remove('bg-[#FD923E]');
      btn.classList.add('bg-[#FAE9CE]', 'flat-retro-shadow-hover');
    }
  });
}

let selectedPrivacy = 'public';
function selectPrivacy(type) {
  selectedPrivacy = type;
  const publicCard = document.getElementById('card-privacy-public');
  const privateCard = document.getElementById('card-privacy-private');
  if (type === 'public') {
    publicCard.className = "flex flex-col gap-2 p-3 sm:p-4 bg-[#FD923E] text-[#3D2013] border-[3px] border-[#3D2013] !rounded-none cursor-pointer transition-all duration-150 select-none";
    privateCard.className = "flex flex-col gap-2 p-3 sm:p-4 bg-[#FAE9CE] text-[#3D2013] border-[3px] border-[#3D2013] !rounded-none cursor-pointer flat-retro-shadow-hover transition-all duration-150 select-none";
  } else {
    privateCard.className = "flex flex-col gap-2 p-3 sm:p-4 bg-[#FD923E] text-[#3D2013] border-[3px] border-[#3D2013] !rounded-none cursor-pointer transition-all duration-150 select-none";
    publicCard.className = "flex flex-col gap-2 p-3 sm:p-4 bg-[#FAE9CE] text-[#3D2013] border-[3px] border-[#3D2013] !rounded-none cursor-pointer flat-retro-shadow-hover transition-all duration-150 select-none";
  }
}

function copyText(textToCopy, label) {
  navigator.clipboard.writeText(textToCopy).then(() => {
    alert(`${label} copied to clipboard!`);
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}

// Draft Tasks Management (Shared Tasklist sync)
let draftTasks = [];
function renderDraftTasks() {
  const container = document.getElementById("tasks-list-container");
  if (!container) return;

  if (draftTasks.length === 0) {
    container.innerHTML = `
      <p class="font-pressstart text-[8px] sm:text-[9px] text-[#3D2013]/60 italic py-2">
        No tasks added yet. Click "+ Add Task" below to start!
      </p>
    `;
    return;
  }

  container.innerHTML = draftTasks.map((taskText, index) => `
    <div class="flex items-center gap-2 w-full">
      <input type="text" 
             value="${taskText.replace(/"/g, '&quot;')}" 
             onchange="updateDraftTaskRow(${index}, this.value)"
             placeholder="Enter shared task item..." 
             class="flex-1 bg-[#FAE9CE] text-[#3D2013] border-[2px] border-[#3D2013] !rounded-none p-2 font-pressstart text-[8px] sm:text-[9px] focus:outline-none focus:bg-[#FEF4E0] placeholder-[#3D2013]/40 transition-colors">
      
      <button type="button" onclick="deleteDraftTaskRow(${index})" 
              title="Delete Task" 
              class="w-6 h-6 bg-[#A53914] border-[2px] border-[#482A1D] flex items-center justify-center text-[#FEF4E0] font-pressstart text-[10px] hover:brightness-110 active:scale-90 cursor-pointer shrink-0">
        ✕
      </button>
    </div>
  `).join('');
}

function addDraftTaskRow() {
  draftTasks.push("");
  renderDraftTasks();
  setTimeout(() => {
    const container = document.getElementById("tasks-list-container");
    if (container) {
      const inputs = container.querySelectorAll("input[type='text']");
      if (inputs.length > 0) {
        inputs[inputs.length - 1].focus();
      }
    }
  }, 50);
}

function updateDraftTaskRow(index, newValue) {
  if (index >= 0 && index < draftTasks.length) {
    draftTasks[index] = newValue;
  }
}

function deleteDraftTaskRow(index) {
  if (index >= 0 && index < draftTasks.length) {
    draftTasks.splice(index, 1);
    renderDraftTasks();
  }
}

// REAL FRIENDS INTEGRATION
let friendsList = [];

async function fetchRealFriends() {
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
      // Map real database friends
      friendsList = (data.friends || []).map(f => ({
        id: f.id.toString(),
        name: f.username || f.name || "Friend",
        avatar: f.avatarUrl || 'https://api.dicebear.com/7.x/pixel-art/svg?seed=' + f.username,
        invited: false
      }));
      renderFriendsList();
    }
  } catch (err) {
    console.warn("Could not fetch real friends, using empty list:", err);
  }
}

function getMaxInviteLimit() {
  const playersSelect = document.getElementById('room-players');
  const maxPlayers = playersSelect ? parseInt(playersSelect.value, 10) : 6;
  return Math.max(0, maxPlayers - 1);
}

function enforceInviteLimits() {
  const maxInvites = getMaxInviteLimit();
  let invitedCount = 0;
  friendsList.forEach(friend => {
    if (friend.invited) {
      invitedCount++;
      if (invitedCount > maxInvites) {
        friend.invited = false;
      }
    }
  });
}

function renderFriendsList() {
  const container = document.getElementById("friends-list-container");
  if (!container) return;

  if (friendsList.length === 0) {
    container.innerHTML = `<p class="font-pressstart text-[8px] text-[#3D2013]/60 italic py-2">No friends found. Add friends first to invite them!</p>`;
    return;
  }

  const maxInvites = getMaxInviteLimit();
  const currentInvitedCount = friendsList.filter(f => f.invited).length;

  let headerHTML = `
    <div class="font-pressstart text-[8px] sm:text-[9px] text-[#3D2013]/70 mb-2">
      Invited: ${currentInvitedCount} / ${maxInvites} max friends
    </div>
  `;

  let listHTML = friendsList.map((friend) => {
    const bgClass = friend.invited ? "bg-[#FD923E]" : "bg-[#FEF4E0]";
    const buttonText = friend.invited ? "Invited" : "Invite";
    const isLimitReached = !friend.invited && currentInvitedCount >= maxInvites;
    
    const iconSvg = friend.invited 
      ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>`;

    return `
      <div class="flex items-center justify-between p-2.5 ${bgClass} border-[2px] sm:border-[3px] border-[#3D2013] transition-colors duration-200 select-none">
        <div class="flex items-center gap-2.5">
          <img src="${friend.avatar}" alt="${friend.name}" class="w-7 h-7 sm:w-8 sm:h-8 border-[2px] border-[#3D2013] bg-[#FAE9CE] shrink-0" />
          <span class="font-pressstart text-[8px] sm:text-[9px] text-[#3D2013] truncate max-w-[130px] sm:max-w-[180px]">
            ${friend.name}
          </span>
        </div>
        <button type="button" 
                onclick="toggleInviteFriend('${friend.id}')"
                ${isLimitReached ? 'disabled' : ''} 
                class="bg-transparent border-none text-[#3D2013] font-pressstart text-[8px] sm:text-[9px] flex items-center gap-1 shrink-0 ${isLimitReached ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:opacity-80 active:scale-95 transition-transform'}">
          ${iconSvg}
          <span>${buttonText}</span>
        </button>
      </div>
    `;
  }).join('');

  container.innerHTML = headerHTML + listHTML;
}

function toggleInviteFriend(friendId) {
  const friend = friendsList.find(f => f.id === friendId);
  if (!friend) return;

  const maxInvites = getMaxInviteLimit();
  const currentInvitedCount = friendsList.filter(f => f.invited).length;

  if (!friend.invited && currentInvitedCount >= maxInvites) {
    alert(`You can only invite up to ${maxInvites} friend(s) for a ${maxInvites + 1}-player room.`);
    return;
  }

  friend.invited = !friend.invited;
  renderFriendsList();
}

/**
 * Renders final review summary card list inside Step 5
 */
function renderReviewSummary() {
  const container = document.getElementById("review-summary-container");
  if (!container) return;

  const roomName = document.getElementById("room-name")?.value.trim() || "—";
  const roomTopic = document.getElementById("room-topic")?.value.trim() || "—";
  
  const playersSelect = document.getElementById("room-players");
  const roomPlayers = playersSelect && playersSelect.value ? `${playersSelect.value} Player(s)` : "—";

  const sessionsSelect = document.getElementById("room-sessions");
  const customSessionsInput = document.getElementById("custom-sessions-input");
  let sessionsText = "—";

  if (sessionsSelect && sessionsSelect.value) {
    if (sessionsSelect.value === 'custom') {
      sessionsText = customSessionsInput && customSessionsInput.value ? `${customSessionsInput.value} Session(s)` : "—";
    } else {
      sessionsText = `${sessionsSelect.value} Session(s)`;
    }
  }

  const techniqueTitles = {
    pomodoro: "Pomodoro",
    "5217": "52-17",
    "90min": "90-mins"
  };
  const roomTechnique = techniqueTitles[selectedTechniqueKey] || "Pomodoro";

  const privacyText = selectedPrivacy === "public" ? "Public" : `Private (${generatedRoomCode})`;

  const validTasks = draftTasks.filter(t => t.trim() !== "");
  const tasksText = `${validTasks.length} Task(s)`;

  const invitedFriends = friendsList.filter(f => f.invited);
  const maxPlayers = playersSelect ? parseInt(playersSelect.value, 10) : 1;
  const invitedText = maxPlayers === 1 ? "N/A (Solo)" : `${invitedFriends.length} Friend(s)`;

  const summaryItems = [
    { label: "Name", value: roomName },
    { label: "Topic", value: roomTopic },
    { label: "Players", value: roomPlayers },
    { label: "Technique", value: roomTechnique },
    { label: "Sessions", value: sessionsText },
    { label: "Privacy", value: privacyText },
    { label: "Tasks", value: tasksText },
    { label: "Invited", value: invitedText }
  ];

  container.innerHTML = summaryItems.map(item => `
    <div class="flex items-center justify-between p-2.5 sm:p-3 bg-[#FEF4E0] border-[2px] sm:border-[3px] border-[#3D2013] select-none">
      <span class="font-pressstart text-[8px] sm:text-[9px] text-[#3D2013]/70 uppercase shrink-0">
        ${item.label}
      </span>
      <span class="font-pressstart text-[8px] sm:text-[9px] text-[#3D2013] font-bold text-right truncate max-w-[180px] sm:max-w-[260px]">
        ${item.value}
      </span>
    </div>
  `).join('');
}

function restrictToNumbersOnly(e) {
  const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
  if (allowedKeys.includes(e.key) || (e.ctrlKey || e.metaKey)) return;
  if (!/^[0-9]$/.test(e.key)) e.preventDefault();
}

function toggleSessionsDropdownArrow(isOpen) {
  const arrowIcon = document.getElementById("arrow-icon-sessions");
  if (!arrowIcon) return;
  if (isOpen) {
    arrowIcon.classList.add("rotate-180");
  } else {
    arrowIcon.classList.remove("rotate-180");
  }
}

function handleSessionsChange(selectEl) {
  clearError('room-sessions');
  const customInput = document.getElementById('custom-sessions-input');
  if (selectEl.value !== "") {
    selectEl.classList.remove("text-[#3D2013]/40");
    selectEl.classList.add("text-[#3D2013]");
  }
  if (selectEl.value === 'custom') {
    if (customInput) {
      customInput.classList.remove('hidden');
      customInput.focus();
    }
  } else {
    if (customInput) {
      customInput.classList.add('hidden');
      customInput.value = '';
    }
  }
}

/**
 * Final Action: Submits created room data with synced tasks and invited real friends to backend
 */
async function submitCreateRoom() {
  const roomName = document.getElementById("room-name")?.value.trim() || "Untitled Room";
  const roomTopic = document.getElementById("room-topic")?.value.trim() || "General Study";
  
  const playersSelect = document.getElementById("room-players");
  const roomPlayers = playersSelect && playersSelect.value ? parseInt(playersSelect.value, 10) : 1;

  const techniqueTitles = {
    pomodoro: "Pomodoro",
    "5217": "52-17",
    "90min": "90-mins"
  };
  const technique = techniqueTitles[selectedTechniqueKey] || "Pomodoro";

  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  });

  const validTasks = draftTasks.filter(t => t.trim() !== "");
  // Shared tasklist configuration (Synced across all room members)
  const checklist = validTasks.length > 0
    ? validTasks.map(task => ({ title: task, status: "inprogress" }))
    : [{ title: "Initial Study Focus", status: "inprogress" }];

  const customConfig = JSON.parse(sessionStorage.getItem("user_furniture_config") || '{"room":"ROOM1"}');
  const currentUser = JSON.parse(sessionStorage.getItem("current_user") || sessionStorage.getItem("user_profile") || '{"id": "u1", "username": "You", "avatar": ""}');

  // Gather invited real friends
  const invitedMembers = friendsList.filter(f => f.invited).map(f => ({
    id: f.id,
    username: f.name,
    avatar: f.avatar
  }));

  const allMembers = [
    { id: currentUser.id || 'u1', username: currentUser.username || currentUser.name || "You", avatar: currentUser.avatar || currentUser.avatar_url || "" },
    ...invitedMembers
  ];

  const newRoom = {
    id: generatedRoomCode,
    name: roomName,
    topic: roomTopic,
    host: currentUser.username || currentUser.name || "You",
    players: allMembers.length,
    maxPlayers: roomPlayers,
    members: allMembers,
    dateCreated: formattedDate,
    progressPercent: 0,
    visibility: selectedPrivacy || "public",
    technique: technique,
    checklist: checklist,
    roomConfig: customConfig
  };

  // Create notifications for invited friends
  const existingNotifications = JSON.parse(localStorage.getItem("userNotifications") || "[]");
  invitedMembers.forEach(friend => {
    existingNotifications.unshift({
      id: `NOTIF-${Date.now()}-${friend.id}`,
      recipientId: friend.id.toString(),
      sender: currentUser.username || currentUser.name || "Host",
      message: `${currentUser.username || currentUser.name || "Host"} invited you to join the study room: "${roomName}"`,
      roomCode: generatedRoomCode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    });
  });
  localStorage.setItem("userNotifications", JSON.stringify(existingNotifications));

  // Sync to Backend Database via API
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch("http://127.0.0.1:5000/api/create-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(newRoom)
    });

    if (!response.ok) {
      console.warn("Failed to sync room to database, saving locally via sessionStorage.");
    }
  } catch (err) {
    console.error("Network error while creating room:", err);
  }

  // Instant local reflections and active room setup
  sessionStorage.setItem("activeRoomId", generatedRoomCode);
  const existingRooms = JSON.parse(sessionStorage.getItem("userCreatedRooms") || "[]");
  existingRooms.unshift(newRoom);
  sessionStorage.setItem("userCreatedRooms", JSON.stringify(existingRooms));

  // Step 5 final redirect to generated homepage with room code query parameter
  window.location.href = `generated-homepage.html?room=${generatedRoomCode}`;
}