/**
 * Create Room Dynamic Step Form Controller
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

/**
 * Gets the active steps list based on Max Players count (1 = Solo mode skips Step 4)
 */
function getActiveSteps() {
  const playersSelect = document.getElementById('room-players');
  const maxPlayers = playersSelect ? parseInt(playersSelect.value, 10) : 0;

  // If 1 Player (Solo), exclude Step 4 (Invite)
  if (maxPlayers === 1) {
    return allSteps.filter(step => step.stepId !== 4);
  }
  
  return allSteps;
}

/**
 * Renders the step progress bars dynamically based on active steps count (4 or 5)
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
  
  // Find current step position in active steps array
  let currentStepIndex = activeSteps.findIndex(s => s.stepId === currentStep);
  if (currentStepIndex === -1) {
    currentStep = activeSteps[0].stepId;
    currentStepIndex = 0;
  }

  const stepNumberText = document.getElementById("step-number-text");
  const stepTitleText = document.getElementById("step-title-text");

  // Step counter text: "Step 1 of 4" or "Step 1 of 5"
  if (stepNumberText) stepNumberText.textContent = `${currentStepIndex + 1} of ${totalSteps}`;
  if (stepTitleText) stepTitleText.textContent = activeSteps[currentStepIndex].title;

  renderProgressBars();

  // Show only active step panel, hide others
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

  // Trigger Review Summary rendering when arriving at Step 5
  if (currentStep === 5) {
    renderReviewSummary();
  }

  const btnBack = document.getElementById("btn-back");
  const btnNext = document.getElementById("btn-next");
  const btnCreate = document.getElementById("btn-create");

  // Manage Back button visibility
  if (btnBack) {
    if (currentStepIndex === 0) {
      btnBack.classList.add("hidden");
      btnBack.classList.remove("flex");
    } else {
      btnBack.classList.remove("hidden");
      btnBack.classList.add("flex");
    }
  }

  // Manage Next / Create button visibility on the final step
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

    // Check Room Name
    if (!roomNameInput || roomNameInput.value.trim() === '') {
      showError('room-name');
      isValid = false;
    }

    // Check Room Topic
    if (!roomTopicInput || roomTopicInput.value.trim() === '') {
      showError('room-topic');
      isValid = false;
    }

    // Check Max Players
    if (!roomPlayersSelect || roomPlayersSelect.value === '' || Number(roomPlayersSelect.value) < 1 || Number(roomPlayersSelect.value) > 6) {
      showError('room-players');
      isValid = false;
    }

    return isValid;
  }

  return true;
}

/**
 * Toggles arrow rotation (up/down) when select dropdown is focused/blurred
 */
function toggleDropdownArrow(isOpen) {
  const arrowIcon = document.getElementById("arrow-icon-players");
  if (!arrowIcon) return;

  if (isOpen) {
    arrowIcon.classList.add("rotate-180");
  } else {
    arrowIcon.classList.remove("rotate-180");
  }
}

/**
 * Updates text color once an option is selected & clears error message
 */
function handlePlayersChange(selectEl) {
  clearError('room-players');

  if (selectEl.value !== "") {
    selectEl.classList.remove("text-[#3D2013]/40");
    selectEl.classList.add("text-[#3D2013]");
  }

  // Re-evaluate friends selection limit and uninvite extra friends if player count dropped
  enforceInviteLimits();
  renderFriendsList();
  
  // Refresh UI steps bar dynamically
  updateStepUI();
}

/**
 * Displays red outline and shows the error text underneath
 */
function showError(fieldId) {
  const inputEl = document.getElementById(fieldId);
  const errorEl = document.getElementById(`error-${fieldId}`);

  if (inputEl) inputEl.classList.add('border-[#D9383A]');
  if (errorEl) errorEl.classList.remove('hidden');
}

/**
 * Clears error state on typing/selecting
 */
function clearError(fieldId) {
  const inputEl = document.getElementById(fieldId);
  const errorEl = document.getElementById(`error-${fieldId}`);

  if (inputEl) inputEl.classList.remove('border-[#D9383A]');
  if (errorEl) errorEl.classList.add('hidden');
}

/**
 * Action triggered on Next Button click
 */
function nextStep() {
  if (!validateStep(currentStep)) return;

  const activeSteps = getActiveSteps();
  const currentStepIndex = activeSteps.findIndex(s => s.stepId === currentStep);

  if (currentStepIndex < activeSteps.length - 1) {
    currentStep = activeSteps[currentStepIndex + 1].stepId;
    updateStepUI();
  }
}

/**
 * Action triggered on Back Button click
 */
function previousStep() {
  const activeSteps = getActiveSteps();
  const currentStepIndex = activeSteps.findIndex(s => s.stepId === currentStep);

  if (currentStepIndex > 0) {
    currentStep = activeSteps[currentStepIndex - 1].stepId;
    updateStepUI();
  }
}

/**
 * Action triggered on Create Room (Final Step)
 */
function submitCreateRoom() {
  // Use startSimulatedLoad to animate the loading bar and redirect upon completion
  if (typeof startSimulatedLoad === 'function') {
    startSimulatedLoad('Creating Room...', 2000, () => {
      window.location.href = "myroom.html";
    });
  } else {
    alert("Room successfully created!");
    window.location.href = "myroom.html";
  }
}

/**
 * Header Close (X) button navigation handler
 */
function goBack() {
  if (document.referrer && document.referrer.includes(window.location.host)) {
    window.history.back();
  } else {
    window.location.href = "myroom.html";
  }
}

// Currently selected technique state
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

// Initial draft tasks state
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
             placeholder="Enter task item..." 
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

// Mock list of friends state
let friendsList = [
  { id: 'f1', name: 'PixelSam', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Sam', invited: false },
  { id: 'f2', name: 'RetroAlex', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Alex', invited: false },
  { id: 'f3', name: 'CyberMaya', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Maya', invited: false },
  { id: 'f4', name: 'ByteJordan', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Jordan', invited: false },
  { id: 'f5', name: 'CodeTaylor', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Taylor', invited: false }
];

/**
 * Calculates max allowed invitations: (Max Players Selected) - 1 (Host)
 */
function getMaxInviteLimit() {
  const playersSelect = document.getElementById('room-players');
  const maxPlayers = playersSelect ? parseInt(playersSelect.value, 10) : 6;
  return Math.max(0, maxPlayers - 1);
}

/**
 * Ensures invited count does not exceed current limit if player dropdown changes
 */
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

/**
 * Renders the list of friends inside Step 4 with limit controls
 */
function renderFriendsList() {
  const container = document.getElementById("friends-list-container");
  if (!container) return;

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
      ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
           <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
         </svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
           <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
         </svg>`;

    return `
      <div class="flex items-center justify-between p-2.5 ${bgClass} border-[2px] sm:border-[3px] border-[#3D2013] transition-colors duration-200 select-none">
        <!-- LEFT SIDE: Profile Avatar + Name -->
        <div class="flex items-center gap-2.5">
          <img src="${friend.avatar}" alt="${friend.name}" class="w-7 h-7 sm:w-8 sm:h-8 border-[2px] border-[#3D2013] bg-[#FAE9CE] shrink-0" />
          <span class="font-pressstart text-[8px] sm:text-[9px] text-[#3D2013] truncate max-w-[130px] sm:max-w-[180px]">
            ${friend.name}
          </span>
        </div>

        <!-- RIGHT SIDE: Plus Icon + Invite Text -->
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

/**
 * Toggles friend invitation status respecting Max Invites limit
 */
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

// Initialize form state on DOM load
document.addEventListener("DOMContentLoaded", () => {
  renderDraftTasks();
  renderFriendsList();
  updateStepUI();
});

/**
 * Renders the final review summary card list inside Step 5
 */
function renderReviewSummary() {
  const container = document.getElementById("review-summary-container");
  if (!container) return;

  // Retrieve Form 1 values
  const roomName = document.getElementById("room-name")?.value.trim() || "—";
  const roomTopic = document.getElementById("room-topic")?.value.trim() || "—";
  
  const playersSelect = document.getElementById("room-players");
  const roomPlayers = playersSelect && playersSelect.value ? `${playersSelect.value} Player(s)` : "—";

  // Map technique key to display title
  const techniqueTitles = {
    pomodoro: "Pomodoro",
    "5217": "52-17",
    "90min": "90-mins"
  };
  const roomTechnique = techniqueTitles[selectedTechniqueKey] || "Pomodoro";

  // Form 2 Privacy values
  const inviteCode = document.getElementById("invite-code-display")?.textContent.trim() || "K7P9-X2M4";
  const privacyText = selectedPrivacy === "public" ? "Public" : `Private (${inviteCode})`;

  // Form 3 Task counts
  const validTasks = draftTasks.filter(t => t.trim() !== "");
  const tasksText = `${validTasks.length} Task(s)`;

  // Form 4 Invited count
  const invitedCount = friendsList.filter(f => f.invited).length;
  const maxPlayers = playersSelect ? parseInt(playersSelect.value, 10) : 1;
  const invitedText = maxPlayers === 1 ? "N/A (Solo)" : `${invitedCount} Friend(s)`;

  // Summary Rows Data configuration
  const summaryItems = [
    { label: "Name", value: roomName },
    { label: "Topic", value: roomTopic },
    { label: "Players", value: roomPlayers },
    { label: "Technique", value: roomTechnique },
    { label: "Privacy", value: privacyText },
    { label: "Tasks", value: tasksText },
    { label: "Invited", value: invitedText }
  ];

  // Render items styled identical to the friends list card UI
  container.innerHTML = summaryItems.map(item => `
    <div class="flex items-center justify-between p-2.5 sm:p-3 bg-[#FEF4E0] border-[2px] sm:border-[3px] border-[#3D2013] select-none">
      <!-- LEFT SIDE: Label -->
      <span class="font-pressstart text-[8px] sm:text-[9px] text-[#3D2013]/70 uppercase shrink-0">
        ${item.label}
      </span>

      <!-- RIGHT SIDE: Inputted Value -->
      <span class="font-pressstart text-[8px] sm:text-[9px] text-[#3D2013] font-bold text-right truncate max-w-[180px] sm:max-w-[260px]">
        ${item.value}
      </span>
    </div>
  `).join('');
}