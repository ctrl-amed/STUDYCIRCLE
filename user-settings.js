// ==========================================
// USER SETTINGS & SECURITY LOGIC
// ==========================================

window.userSettingsData = window.userSettingsData || {
  email: "hero@acorn.study",
  passwordHash: "Password123!", // Mock database password
  dailyReminderEnabled: true,
  dailyReminderTime: "08:00",
  manualReminders: [
    { id: 1, title: "Midterms Study Session", datetime: "2026-06-15T14:30" }
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  initAccountSettingsUI();
  initStudyRemindersUI();
  initChangePasswordLogic();
});

// ------------------------------------------
// HELPER FUNCTIONS REQUIRED
// ------------------------------------------
function setFieldError(inputEl, errorEl, message) {
  inputEl.style.borderColor = "#A94A4A";
  if (errorEl) {
    errorEl.className = "font-pixel text-[#A94A4A] text-sm leading-tight mt-1 transition-colors duration-150";
    errorEl.textContent = `✘ ${message}`;
    errorEl.classList.remove('hidden');
  }
}

function clearFieldError(inputEl, errorEl, defaultMessage = '') {
  inputEl.style.borderColor = "#3D2013";
  if (errorEl) {
    if (defaultMessage) {
      errorEl.className = "font-pixel text-[#3D2013] text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] leading-tight mt-1 transition-colors duration-150";
      errorEl.textContent = defaultMessage;
      errorEl.classList.remove('hidden');
    } else {
      errorEl.classList.add('hidden');
      errorEl.textContent = '';
    }
  }
}

function setupVisibilityToggle(button, inputElement) {
  if (!button || !inputElement) return;
  button.addEventListener("click", () => {
    const isPassword = inputElement.type === "password";
    inputElement.type = isPassword ? "text" : "password";
    const openPaths = button.querySelectorAll(".eye-open");
    const closedPath = button.querySelector(".eye-closed");
    if (isPassword) {
      openPaths.forEach(p => p.classList.add("hidden"));
      if (closedPath) closedPath.classList.remove("hidden");
    } else {
      openPaths.forEach(p => p.classList.remove("hidden"));
      if (closedPath) closedPath.classList.add("hidden");
    }
  });
}

// Toast Generator Function
function showSuccessToast(message) {
  const toastContainer = document.getElementById("toast-container");
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = "bg-[#FBF2E3] border-4 border-[#3D2013] p-4 flex flex-col gap-2 relative shadow-md transition-all duration-300 max-w-xs retro-shadow pointer-events-auto opacity-0 translate-y-[-20px] !rounded-none overflow-hidden";
  toast.style.boxShadow = "4px 4px 0px #3D2013";

  toast.innerHTML = `
    <div class="flex items-center gap-3 pr-2">
      <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="#788D55" stroke-width="4" stroke-linecap="square" stroke-linejoin="square"/>
      </svg>
      <span class="font-pressstart text-[11px] sm:text-[12px] text-[#482A1D] tracking-wide">${message}</span>
    </div>
    <div class="w-full bg-transparent h-1.5 flex justify-center mt-auto overflow-hidden">
      <div class="w-full h-full bg-[#788D55] animate-progress-center"></div>
    </div>
  `;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', 'translate-y-[-20px]');
    toast.classList.add('opacity-100', 'translate-y-0');
  });

  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-[-20px]');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ------------------------------------------
// ACCOUNT SETTINGS (USERNAME & EMAIL EDIT MODALS)
// ------------------------------------------
function initAccountSettingsUI() {
  const settingsData = window.userSettingsData;
  const globalPlayer = window.playerData;

  // Sync display text
  const usernameDisplay = document.getElementById("settings-display-username");
  const emailDisplay = document.getElementById("settings-display-email");
  if (usernameDisplay) usernameDisplay.textContent = globalPlayer.username;
  if (emailDisplay) emailDisplay.textContent = settingsData.email;

  // Modals buttons triggers
  const openUserBtn = document.getElementById("open-edit-username-btn");
  const openEmailBtn = document.getElementById("open-edit-email-btn");
  const openPassBtn = document.getElementById("open-change-password-btn");

  if (openUserBtn) openUserBtn.addEventListener("click", () => {
    document.getElementById("modal-current-username").textContent = globalPlayer.username;
    document.getElementById("modal-new-username").value = "";
    document.getElementById("username-char-count").textContent = "0/20";
    clearFieldError(document.getElementById("modal-new-username"), document.getElementById("username-error-note"), "Usernames must be 6-20 characters long and can include letters, numbers, and special characters.");
    window.openModal("edit-username-modal");
  });

  if (openEmailBtn) openEmailBtn.addEventListener("click", () => {
    document.getElementById("modal-current-email").textContent = settingsData.email;
    document.getElementById("modal-new-email").value = "";
    clearFieldError(document.getElementById("modal-new-email"), document.getElementById("email-error-note"));
    window.openModal("edit-email-modal");
  });

  if (openPassBtn) openPassBtn.addEventListener("click", () => {
    document.getElementById("old-password").value = "";
    document.getElementById("new-password").value = "";
    document.getElementById("confirm-password").value = "";
    clearFieldError(document.getElementById("old-password"), document.getElementById("old-password-error"));
    clearFieldError(document.getElementById("new-password"), document.getElementById("new-password-error"));
    clearFieldError(document.getElementById("confirm-password"), document.getElementById("password-security-note"), "Create a strong password using 8 or more characters, including uppercase and lowercase letters, a number, and a special character.");
    window.openModal("change-password-modal");
  });

  // Username validation & save
  const newUsernameInput = document.getElementById("modal-new-username");
  const usernameNote = document.getElementById("username-error-note");
  if (newUsernameInput) {
    newUsernameInput.addEventListener("input", () => {
      const val = newUsernameInput.value;
      document.getElementById("username-char-count").textContent = `${val.length}/20`;
      if (val.length === 0) {
        clearFieldError(newUsernameInput, usernameNote, "Usernames must be 6-20 characters long and can include letters, numbers, and special characters.");
      } else if (val.length < 6 || val.length > 20) {
        setFieldError(newUsernameInput, usernameNote, "Username must be between 6 and 20 characters.");
      } else {
        clearFieldError(newUsernameInput, usernameNote, "Username looks good!");
      }
    });
  }

  const saveUsernameBtn = document.getElementById("save-username-btn");
  if (saveUsernameBtn) {
    saveUsernameBtn.addEventListener("click", () => {
      const val = newUsernameInput.value.trim();
      if (val.length < 6 || val.length > 20) {
        setFieldError(newUsernameInput, usernameNote, "Invalid length (6-20 chars required).");
        return;
      }
      globalPlayer.username = val;
      if (usernameDisplay) usernameDisplay.textContent = val;
      window.closeModal("edit-username-modal");
      showSuccessToast("Username updated successfully!");
    });
  }

  // Email validation & save
  const newEmailInput = document.getElementById("modal-new-email");
  const emailNote = document.getElementById("email-error-note");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const saveEmailBtn = document.getElementById("save-email-btn");
  if (saveEmailBtn) {
    saveEmailBtn.addEventListener("click", () => {
      const val = newEmailInput.value.trim();
      if (!val) {
        setFieldError(newEmailInput, emailNote, "Email field cannot be empty.");
        return;
      }
      if (!emailRegex.test(val)) {
        setFieldError(newEmailInput, emailNote, "Invalid email address format (missing @ or domain).");
        return;
      }
      settingsData.email = val;
      if (emailDisplay) emailDisplay.textContent = val;
      window.closeModal("edit-email-modal");
      showSuccessToast("Email updated successfully!");
    });
  }
}

// ------------------------------------------
// STUDY REMINDERS TOGGLE & CONFIG
// ------------------------------------------
function initStudyRemindersUI() {
  const settingsData = window.userSettingsData;
  const toggleBtn = document.getElementById("reminder-toggle-btn");
  const toggleThumb = document.getElementById("reminder-toggle-thumb");
  const activeBox = document.getElementById("reminder-active-box");
  const statusText = document.getElementById("reminder-status-text");
  const editTimeBtn = document.getElementById("edit-reminder-time-btn");
  const timePickerBox = document.getElementById("reminder-time-picker-box");
  const timeInput = document.getElementById("reminder-time-input");
  const saveTimeBtn = document.getElementById("save-reminder-time-btn");
  
  const manualBox = document.getElementById("reminder-manual-box");
  const manualInput = document.getElementById("manual-reminder-input");
  const saveManualBtn = document.getElementById("save-manual-reminder-btn");
  const manualList = document.getElementById("manual-reminders-list");

  function updateToggleUI() {
    if (settingsData.dailyReminderEnabled) {
      toggleBtn.classList.remove("bg-[#3D2013]/20");
      toggleBtn.classList.add("bg-[#E87339]");
      toggleThumb.style.transform = "translateX(24px)";
      activeBox.classList.remove("hidden");
      manualBox.classList.add("hidden");
      statusText.textContent = `You will be reminded daily at ${settingsData.dailyReminderTime}`;
      timeInput.value = settingsData.dailyReminderTime;
    } else {
      toggleBtn.classList.remove("bg-[#E87339]");
      toggleBtn.classList.add("bg-[#3D2013]/20");
      toggleThumb.style.transform = "translateX(0px)";
      activeBox.classList.add("hidden");
      manualBox.classList.remove("hidden");
    }
  }

  updateToggleUI();
  renderManualReminders();

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      settingsData.dailyReminderEnabled = !settingsData.dailyReminderEnabled;
      updateToggleUI();
    });
  }

  if (editTimeBtn) {
    editTimeBtn.addEventListener("click", () => {
      timePickerBox.classList.toggle("hidden");
    });
  }

  if (saveTimeBtn) {
    saveTimeBtn.addEventListener("click", () => {
      if (!timeInput.value) return;
      settingsData.dailyReminderTime = timeInput.value;
      timePickerBox.classList.add("hidden");
      updateToggleUI();
    });
  }

  if (saveManualBtn) {
    saveManualBtn.addEventListener("click", () => {
      if (!manualInput.value) return;
      settingsData.manualReminders.push({
        id: Date.now(),
        title: "Custom Reminder",
        datetime: manualInput.value
      });
      manualInput.value = "";
      renderManualReminders();
    });
  }

  function renderManualReminders() {
    if (!manualList) return;
    if (settingsData.manualReminders.length === 0) {
      manualList.innerHTML = `<span class="font-pixel text-[12px] text-[#3D2013]/60 italic">No manual reminders set.</span>`;
      return;
    }

    manualList.innerHTML = settingsData.manualReminders.map(rem => `
      <div class="flex items-center justify-between bg-[#FAE9CE] p-2 rounded-[6px] border border-[#3D2013]/30 font-pixel text-[13px]">
        <span class="text-[#3D2013]">📅 ${new Date(rem.datetime).toLocaleString()}</span>
        <button onclick="window.removeManualReminder(${rem.id})" class="text-[#A94A4A] font-pressstart text-[8px] hover:underline cursor-pointer">REMOVE</button>
      </div>
    `).join("");
  }
}

window.removeManualReminder = function(id) {
  window.userSettingsData.manualReminders = window.userSettingsData.manualReminders.filter(r => r.id !== id);
  const manualList = document.getElementById("manual-reminders-list");
  if (manualList) {
    if (window.userSettingsData.manualReminders.length === 0) {
      manualList.innerHTML = `<span class="font-pixel text-[12px] text-[#3D2013]/60 italic">No manual reminders set.</span>`;
    } else {
      manualList.innerHTML = window.userSettingsData.manualReminders.map(rem => `
        <div class="flex items-center justify-between bg-[#FAE9CE] p-2 rounded-[6px] border border-[#3D2013]/30 font-pixel text-[13px]">
          <span class="text-[#3D2013]">📅 ${new Date(rem.datetime).toLocaleString()}</span>
          <button onclick="window.removeManualReminder(${rem.id})" class="text-[#A94A4A] font-pressstart text-[8px] hover:underline cursor-pointer">REMOVE</button>
        </div>
      `).join("");
    }
  }
};

// ------------------------------------------
// CHANGE PASSWORD & VALIDATION LOGIC
// ------------------------------------------
function initChangePasswordLogic() {
  const oldPassInput = document.getElementById("old-password");
  const newPassInput = document.getElementById("new-password");
  const confirmPassInput = document.getElementById("confirm-password");

  const oldPassError = document.getElementById("old-password-error");
  const newPassError = document.getElementById("new-password-error");
  const passwordNote = document.getElementById("password-security-note");

  const savePassBtn = document.getElementById("save-password-btn");

  const toggleOldBtn = document.getElementById("toggle-old-password");
  const toggleNewBtn = document.getElementById("toggle-new-password");
  const toggleConfirmBtn = document.getElementById("toggle-confirm-password");

  // Setup Visibility Toggles
  setupVisibilityToggle(toggleOldBtn, oldPassInput);
  setupVisibilityToggle(toggleNewBtn, newPassInput);
  setupVisibilityToggle(toggleConfirmBtn, confirmPassInput);

  // Helper to reset a toggle button back to "password hidden" state
  function resetVisibilityToggle(button, inputElement) {
    if (!button || !inputElement) return;
    inputElement.type = "password";
    const openPaths = button.querySelectorAll(".eye-open");
    const closedPath = button.querySelector(".eye-closed");
    openPaths.forEach(p => p.classList.remove("hidden"));
    if (closedPath) closedPath.classList.add("hidden");
  }

  // Live validation for Old Password (clears "Wrong credentials" error on input)
  if (oldPassInput) {
    oldPassInput.addEventListener("input", () => {
      clearFieldError(oldPassInput, oldPassError);
    });
  }

  // Live validation for New Password
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  let isNewPassValid = false;
  let isConfirmPassValid = false;

  if (newPassInput) {
    newPassInput.addEventListener("input", () => {
      const val = newPassInput.value;
      if (!val) {
        clearFieldError(newPassInput, newPassError);
        isNewPassValid = false;
      } else if (!strongPasswordRegex.test(val)) {
        setFieldError(newPassInput, newPassError, "Password not strong enough. Must contain 8+ characters, uppercase, lowercase, number, and special char.");
        isNewPassValid = false;
      } else {
        clearFieldError(newPassInput, newPassError);
        isNewPassValid = true;
      }
      validateConfirmPasswordMatch();
    });
  }

  if (confirmPassInput) {
    confirmPassInput.addEventListener("input", () => {
      validateConfirmPasswordMatch();
    });
  }

  function validateConfirmPasswordMatch() {
    const confirmVal = confirmPassInput.value;
    const newVal = newPassInput.value;

    if (!confirmVal) {
      clearFieldError(confirmPassInput, passwordNote, "Create a strong password using 8 or more characters, including uppercase and lowercase letters, a number, and a special character.");
      isConfirmPassValid = false;
      return;
    }

    if (confirmVal !== newVal) {
      setFieldError(confirmPassInput, passwordNote, "Passwords do not match.");
      isConfirmPassValid = false;
    } else {
      clearFieldError(confirmPassInput, passwordNote);
      isConfirmPassValid = true;
    }
  }

  // Save submission check
  if (savePassBtn) {
    savePassBtn.addEventListener("click", () => {
      const oldVal = oldPassInput.value;
      const newVal = newPassInput.value;
      const confirmVal = confirmPassInput.value;

      // A. Empty Check
      let hasError = false;
      if (!oldVal) {
        setFieldError(oldPassInput, oldPassError, "Old password is required.");
        hasError = true;
      } else {
        clearFieldError(oldPassInput, oldPassError);
      }

      if (!newVal) {
        setFieldError(newPassInput, newPassError, "New password is required.");
        hasError = true;
      }

      if (!confirmVal) {
        setFieldError(confirmPassInput, passwordNote, "Confirm password is required.");
        hasError = true;
      }

      if (hasError || !isNewPassValid || !isConfirmPassValid) {
        return;
      }

      // B. Old Password Verification against mock database record
      if (oldVal !== window.userSettingsData.passwordHash) {
        setFieldError(oldPassInput, oldPassError, "Wrong credentials");
        oldPassInput.style.borderColor = "#A94A4A";
        
        clearFieldError(newPassInput, newPassError);
        clearFieldError(confirmPassInput, passwordNote, "Create a strong password using 8 or more characters, including uppercase and lowercase letters, a number, and a special character.");

        oldPassInput.value = "";
        newPassInput.value = "";
        confirmPassInput.value = "";

        resetVisibilityToggle(toggleOldBtn, oldPassInput);
        resetVisibilityToggle(toggleNewBtn, newPassInput);
        resetVisibilityToggle(toggleConfirmBtn, confirmPassInput);

        isNewPassValid = false;
        isConfirmPassValid = false;
        return;
      }

      // Success
      window.userSettingsData.passwordHash = newVal;
      window.closeModal("change-password-modal");
      showSuccessToast("Password changed successfully!");
    });
  }
}