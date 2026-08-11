/**
 * Create Room Dynamic Step Form Controller
 */
let currentStep = 1;
let selectedChecklistMode = 'structured'; // Options: 'structured' | 'hangout'

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
 * Renders the step progress bars dynamically based on active steps count
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

// State for storing the selected PDF file and upload state
let selectedPdfFile = null;
let isPdfUploading = false;

/**
 * Formats bytes into human-readable KB or MB strings
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Handles PDF File Selection and UI updates
 */
function handlePdfUpload(inputEl) {
  clearError('step-3');

  if (inputEl.files && inputEl.files.length > 0) {
    const file = inputEl.files[0];

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      selectedPdfFile = file;
      simulatePdfUpload(file);
    } else {
      alert("Please upload a valid PDF file!");
      inputEl.value = "";
      removePdfFile();
    }
  }
}
/**
 * Simulates uploading progress for the PDF file
 */
function simulatePdfUpload(file) {
  isPdfUploading = true;

  const initialArea = document.getElementById('pdf-upload-initial');
  const progressArea = document.getElementById('pdf-upload-progress');
  const detailsArea = document.getElementById('pdf-upload-details');
  const progressBarInner = document.getElementById('pdf-progress-bar-inner');
  const progressPercentText = document.getElementById('pdf-progress-percent');

  // Show progress section
  if (initialArea) initialArea.classList.add('hidden');
  if (detailsArea) detailsArea.classList.add('hidden');
  if (progressArea) progressArea.classList.remove('hidden');

  let progress = 0;
  if (progressBarInner) progressBarInner.style.width = '0%';
  if (progressPercentText) progressPercentText.textContent = '0%';

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 20) + 10;
    if (progress > 100) progress = 100;

    if (progressBarInner) progressBarInner.style.width = `${progress}%`;
    if (progressPercentText) progressPercentText.textContent = `${progress}%`;

    if (progress >= 100) {
      clearInterval(interval);
      isPdfUploading = false;

      // Display file details on completion
      setTimeout(() => {
        if (progressArea) progressArea.classList.add('hidden');
        if (detailsArea) detailsArea.classList.remove('hidden');

        const fileNameDisplay = document.getElementById('pdf-file-name');
        const fileSizeDisplay = document.getElementById('pdf-file-size');

        if (fileNameDisplay) fileNameDisplay.textContent = file.name;
        if (fileSizeDisplay) fileSizeDisplay.textContent = formatFileSize(file.size);
      }, 300);
    }
  }, 120);
}
/**
 * Removes the current uploaded PDF and resets the input UI
 */
function removePdfFile() {
  selectedPdfFile = null;
  isPdfUploading = false;

  const fileInput = document.getElementById('room-pdf-upload');
  if (fileInput) fileInput.value = '';

  const initialArea = document.getElementById('pdf-upload-initial');
  const progressArea = document.getElementById('pdf-upload-progress');
  const detailsArea = document.getElementById('pdf-upload-details');

  if (initialArea) initialArea.classList.remove('hidden');
  if (progressArea) progressArea.classList.add('hidden');
  if (detailsArea) detailsArea.classList.add('hidden');
}
/**
 * Update Checklist Mode Toggle UI to show/hide PDF Section
 */
function selectChecklistMode(mode) {
  selectedChecklistMode = mode;
  clearError('step-3');

  const cardStructured = document.getElementById("card-mode-structured");
  const cardHangout = document.getElementById("card-mode-hangout");
  const addTaskBtn = document.getElementById("btn-add-task");
  const pdfUploadContainer = document.getElementById("pdf-upload-container");

  if (mode === 'structured') {
    if (cardStructured) {
      cardStructured.className = "flex flex-col gap-2 p-3 sm:p-4 bg-[#FD923E] text-[#3D2013] border-[3px] border-[#3D2013] !rounded-none cursor-pointer transition-all duration-150 select-none";
    }
    if (cardHangout) {
      cardHangout.className = "flex flex-col gap-2 p-3 sm:p-4 bg-[#FAE9CE] text-[#3D2013] border-[3px] border-[#3D2013] !rounded-none cursor-pointer flat-retro-shadow-hover transition-all duration-150 select-none";
    }

    if (addTaskBtn) {
      addTaskBtn.removeAttribute("disabled");
      addTaskBtn.className = "self-start w-auto bg-[#97B591] text-[#3D2013] border-[2px] sm:border-[3px] border-[#3D2013] !rounded-none px-4 py-2 font-pressstart text-[8px] sm:text-[9px] cursor-pointer transition-all duration-150 flat-retro-shadow-hover flex items-center justify-center gap-1.5";
    }

    // Show PDF container for Structured Focus
    if (pdfUploadContainer) {
      pdfUploadContainer.classList.remove("hidden");
    }
  } else {
    if (cardHangout) {
      cardHangout.className = "flex flex-col gap-2 p-3 sm:p-4 bg-[#FD923E] text-[#3D2013] border-[3px] border-[#3D2013] !rounded-none cursor-pointer transition-all duration-150 select-none";
    }
    if (cardStructured) {
      cardStructured.className = "flex flex-col gap-2 p-3 sm:p-4 bg-[#FAE9CE] text-[#3D2013] border-[3px] border-[#3D2013] !rounded-none cursor-pointer flat-retro-shadow-hover transition-all duration-150 select-none";
    }

    if (addTaskBtn) {
      addTaskBtn.setAttribute("disabled", "true");
      addTaskBtn.className = "self-start w-auto bg-[#A3A3A3] text-[#3D2013]/50 border-[2px] sm:border-[3px] border-[#3D2013]/40 !rounded-none px-4 py-2 font-pressstart text-[8px] sm:text-[9px] cursor-not-allowed opacity-60 flex items-center justify-center gap-1.5";
    }

    // Hide PDF container for Hangout mode
    if (pdfUploadContainer) {
      pdfUploadContainer.classList.add("hidden");
    }
  }

  renderDraftTasks();
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

  // Step 3 Validation: Require active file and complete upload
  if (step === 3) {
    if (selectedChecklistMode === 'structured') {
      const validTasks = draftTasks.filter(t => t.trim() !== "");
      
      if (isPdfUploading) {
        alert("Please wait until the PDF finishes uploading!");
        return false;
      }

      if (validTasks.length === 0 || !selectedPdfFile) {
        showError('step-3');
        return false;
      }
    }
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

async function submitCreateRoom(e) {
  const event = e || window.event;
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }
  
  const token = sessionStorage.getItem("token");
  if (!token) {
    alert("Authentication token not found! Please log in again.");
    return;
  }

  // Gather values
  const roomName = document.getElementById("room-name")?.value.trim() || "Untitled Room";
  const roomTopic = document.getElementById("room-topic")?.value.trim() || "General Study";
  const playersSelect = document.getElementById("room-players");
  const roomPlayers = playersSelect && playersSelect.value ? parseInt(playersSelect.value, 10) : 1;

  const techniqueTitles = { pomodoro: "Pomodoro", "5217": "52-17", "90min": "90-mins" };
  const technique = techniqueTitles[selectedTechniqueKey] || "Pomodoro";

  const sessionsSelect = document.getElementById("room-sessions");
  const customSessionsInput = document.getElementById("custom-sessions-input");
  let sessionsValue = 1;
  if (sessionsSelect && sessionsSelect.value === 'custom') {
    sessionsValue = customSessionsInput ? customSessionsInput.value : 1;
  } else if (sessionsSelect) {
    sessionsValue = sessionsSelect.value || 1;
  }

  const validTasks = draftTasks.filter(t => t.trim() !== "");
  let checklist = [];
  if (selectedChecklistMode === "structured") {
    checklist = validTasks.length > 0
      ? validTasks.map(task => ({ title: task, status: "inprogress" }))
      : [{ title: "Initial Study Focus", status: "inprogress" }];
  }

  const formData = new FormData();
  formData.append("roomName", roomName);
  formData.append("roomTopic", roomTopic);
  formData.append("roomPlayers", roomPlayers);
  formData.append("technique", technique);
  formData.append("roomSessions", sessionsValue);
  formData.append("visibility", selectedPrivacy || "public");
  formData.append("roomMode", selectedChecklistMode);
  formData.append("checklist", JSON.stringify(checklist));

  if (typeof selectedPdfFile !== 'undefined' && selectedPdfFile) {
    formData.append("pdfFile", selectedPdfFile);
  }

  try {
    // 1. We start the fetch
    console.log("Sending fetch request...");
    
    const response = await fetch("http://127.0.0.1:5000/api/rooms", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData
    });

    // 2. STOP AND CHECK STATUS
    alert("Backend responded! Status Code: " + response.status);

    if (!response.ok) {
      const errText = await response.text();
      alert("Server Error Details: " + errText);
      return;
    }

    // 3. PARSE JSON
    const data = await response.json();
    const roomObj = data.room || data;
    const roomCode = roomObj.roomCode || roomObj.room_code || roomObj.id || roomObj.code;
    
    // 4. STOP AND CHECK DATA
    alert("Success! Room Code extracted is: " + roomCode);

    if (!roomCode) {
      alert("Failed to extract room code from response!");
      return;
    }

    localStorage.setItem("currentActiveRoom", JSON.stringify(roomObj));
    const mode = (selectedChecklistMode || "").toLowerCase().trim();

    // 5. ATTEMPT REDIRECT
    alert("About to redirect to the room page now...");

    if (mode === 'structured') {
        window.location.href = `kitsuroom.html?code=${roomCode}`;
    } else {
        window.location.href = `generated-homepage.html?code=${roomCode}`;
    }

  } catch (err) {
    alert("Fatal Javascript Error: " + err.message);
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

  if (selectedChecklistMode === 'hangout') {
    container.innerHTML = `
      <p class="font-pressstart text-[8px] sm:text-[9px] text-[#3D2013]/60 italic py-2">
        Hangout Mode active. Checklist is optional and can be managed inside the room.
      </p>
    `;
    return;
  }

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
             oninput="clearError('step-3')"
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
  if (selectedChecklistMode === 'hangout') return;

  clearError('step-3');
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

  const inviteCode = document.getElementById("invite-code-display")?.textContent.trim() || "K7P9-X2M4";
  const privacyText = selectedPrivacy === "public" ? "Public" : `Private (${inviteCode})`;

  const modeText = selectedChecklistMode === 'structured' ? "Structured Focus" : "Hangout";
  const validTasks = draftTasks.filter(t => t.trim() !== "");
  const tasksText = selectedChecklistMode === 'structured' ? `${validTasks.length} Task(s)` : "Flexible (In-room)";

  const invitedCount = friendsList.filter(f => f.invited).length;
  const maxPlayers = playersSelect ? parseInt(playersSelect.value, 10) : 1;
  const invitedText = maxPlayers === 1 ? "N/A (Solo)" : `${invitedCount} Friend(s)`;

  const summaryItems = [
    { label: "Name", value: roomName },
    { label: "Topic", value: roomTopic },
    { label: "Players", value: roomPlayers },
    { label: "Technique", value: roomTechnique },
    { label: "Sessions", value: sessionsText },
    { label: "Privacy", value: privacyText },
    { label: "Mode", value: modeText },
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

/**
 * Restricts keypress inputs to only allow numeric key codes (0-9, Backspace, Arrow keys, Delete, Tab)
 */
function restrictToNumbersOnly(e) {
  const allowedKeys = [
    'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'
  ];
  
  // Allow navigation / control keys
  if (allowedKeys.includes(e.key) || (e.ctrlKey || e.metaKey)) {
    return;
  }

  // Prevent input if key is not a digit (0-9)
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
  }
}

/**
 * Toggles arrow rotation (up/down) when sessions dropdown is focused/blurred
 */
function toggleSessionsDropdownArrow(isOpen) {
  const arrowIcon = document.getElementById("arrow-icon-sessions");
  if (!arrowIcon) return;

  if (isOpen) {
    arrowIcon.classList.add("rotate-180");
  } else {
    arrowIcon.classList.remove("rotate-180");
  }
}

/**
 * Handles session selection change & toggles custom input visibility
 */
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