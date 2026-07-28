// 1. Elements
const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const tabsBar = document.getElementById('modal-tabs');

const formLogin = document.getElementById('form-login');
const formSignup = document.getElementById('form-signup');
const formReset = document.getElementById('form-reset');

const linkForgot = document.getElementById('link-forgot');
const linkBackToLogin = document.getElementById('link-back-to-login');

// --- ELEMENTS FOR VALIDATION & TOASTS ---
const resetEmailInput = document.getElementById('reset-email');
const resetErrorText = document.getElementById('reset-error');
const toastContainer = document.getElementById('toast-container');

// --- LOGIN ELEMENTS FOR ERROR HANDLING & EYE TOGGLE ---
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const loginErrorText = document.getElementById('login-error');
const btnTogglePassword = document.getElementById('btn-toggle-password');
const eyeIcon = document.getElementById('eye-icon');

// --- NEW SIGN UP ELEMENTS ---
const signupUsernameInput = document.getElementById('signup-username');
const signupEmailInput = document.getElementById('signup-email');
const signupPasswordInput = document.getElementById('signup-password');
const signupUsernameError = document.getElementById('signup-username-error');
const signupEmailError = document.getElementById('signup-email-error');
const signupPasswordNote = document.getElementById('signup-password-note');
const btnToggleSignupPassword = document.getElementById('btn-toggle-signup-password');
const signupEyeIcon = document.getElementById('signup-eye-icon');

// Mock database arrays for validation checks
const mockDatabase = ['user@studycircle.app', 'acorn@studycircle.app'];
const mockUsernames = ['acorn_hero', 'study_master'];

// 2. CSS classes for Tab states
const activeTabStyle = "flex-1 py-2 text-center text-white bg-[#788D55] rounded-lg border-2 border-[#3D2013] transition-all duration-150";
const inactiveTabStyle = "flex-1 py-2 text-center text-[#4A2E21] hover:text-[#E87339] transition-all duration-150";

// 3. Core view controller helper
function toggleViews(showLogin, showSignup, showReset) {
  formLogin.classList.toggle('hidden', !showLogin);
  formSignup.classList.toggle('hidden', !showSignup);
  formReset.classList.toggle('hidden', !showReset);
  tabsBar.classList.toggle('hidden', showReset); // Hide tab bar on reset
  
  // Clear reset view errors
  if (resetErrorText) {
    resetErrorText.classList.add('hidden');
    resetErrorText.textContent = '';
  }

  // Clear login view errors and reset borders
  if (loginEmailInput && loginPasswordInput && loginErrorText) {
    loginEmailInput.style.borderColor = "#3D2013";
    loginPasswordInput.style.borderColor = "#3D2013";
    loginErrorText.classList.add('hidden');
    loginErrorText.textContent = '';
  }

  // Clear signup view errors and reset layout
  if (signupUsernameInput && signupEmailInput && signupPasswordInput) {
    signupUsernameInput.style.borderColor = "#3D2013";
    signupEmailInput.style.borderColor = "#3D2013";
    signupPasswordInput.style.borderColor = "#3D2013";
    
    signupUsernameError.classList.add('hidden');
    signupEmailError.classList.add('hidden');
    
    signupPasswordNote.className = "font-pixel text-[#3D2013] text-[20px] leading-tight mt-1";
    signupPasswordNote.textContent = "Create a strong password using 8 or more characters, including uppercase and lowercase letters, a number, and a special character.";
  }
}

// 4. Set visual active/inactive tab styles
function setTabActive(target) {
  if (target === 'login') {
    tabLogin.className = activeTabStyle;
    tabSignup.className = inactiveTabStyle;
  } else {
    tabSignup.className = activeTabStyle;
    tabLogin.className = inactiveTabStyle;
  }
}

// 5. Read URL Hash and apply correct state automatically
function handleUrlHash() {
  const hash = window.location.hash;
  if (hash === '#signup') {
    toggleViews(false, true, false);
    setTabActive('signup');
  } else {
    toggleViews(true, false, false);
    setTabActive('login');
  }
}

// Helper to trigger loading screen and redirect
function triggerLoadingAndRedirect(statusText, targetUrl = "homepage.html") {
  if (typeof startSimulatedLoad === 'function') {
    startSimulatedLoad(statusText, 2000, () => {
      window.location.href = targetUrl;
    });
  } else {
    window.location.href = targetUrl;
  }
}

// --- 6. EVENT LISTENERS ---
tabLogin.addEventListener('click', () => {
  toggleViews(true, false, false);
  setTabActive('login');
});

tabSignup.addEventListener('click', () => {
  toggleViews(false, true, false);
  setTabActive('signup');
});

linkForgot.addEventListener('click', () => {
  toggleViews(false, false, true);
});

linkBackToLogin.addEventListener('click', () => {
  toggleViews(true, false, false);
  setTabActive('login');
});

window.addEventListener('DOMContentLoaded', handleUrlHash);
window.addEventListener('hashchange', handleUrlHash);

// Login Password Field Eye Toggle Visibility
if (btnTogglePassword && loginPasswordInput && eyeIcon) {
  btnTogglePassword.addEventListener('click', () => {
    const isPassword = loginPasswordInput.getAttribute('type') === 'password';
    loginPasswordInput.setAttribute('type', isPassword ? 'text' : 'password');
    eyeIcon.innerHTML = isPassword 
      ? `<path stroke-linecap="square" stroke-linejoin="square" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.243L9.88 9.88" />`
      : `<path stroke-linecap="square" stroke-linejoin="square" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="square" stroke-linejoin="square" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />`;
  });
}

// Sign Up Password Field Eye Toggle Visibility
if (btnToggleSignupPassword && signupPasswordInput && signupEyeIcon) {
  btnToggleSignupPassword.addEventListener('click', () => {
    const isPassword = signupPasswordInput.getAttribute('type') === 'password';
    signupPasswordInput.setAttribute('type', isPassword ? 'text' : 'password');
    signupEyeIcon.innerHTML = isPassword
      ? `<path stroke-linecap="square" stroke-linejoin="square" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.243L9.88 9.88" />`
      : `<path stroke-linecap="square" stroke-linejoin="square" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="square" stroke-linejoin="square" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />`;
  });
}

// Toast Generator Function for internal screen reset
function showSuccessToast() {
  const toast = document.createElement('div');
  toast.className = "bg-[#FBF2E3] border-4 border-[#3D2013] p-4 flex flex-col gap-2 relative shadow-md transition-all duration-300 max-w-xs retro-shadow pointer-events-auto opacity-0 translate-y-[-20px] !rounded-none overflow-hidden";
  toast.style.boxShadow = "4px 4px 0px #3D2013";

  toast.innerHTML = `
    <div class="flex items-center gap-3 pr-2">
      <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="#788D55" stroke-width="4" stroke-linecap="square" stroke-linejoin="square"/>
      </svg>
      <span class="font-pressstart text-[14px] text-[#482A1D] whitespace-nowrap tracking-wide">Password link sent!</span>
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

// --- 7. FORM SUBMISSION EVENT LISTENERS ---

// Login Form Submission
if (formLogin) {
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailVal = loginEmailInput.value.trim();
    const passwordVal = loginPasswordInput.value;
    
    loginEmailInput.style.borderColor = "#3D2013";
    loginPasswordInput.style.borderColor = "#3D2013";
    loginErrorText.classList.add('hidden');
    loginErrorText.textContent = '';

    const validEmail = "user@studycircle.app";
    const validPassword = "password123";

    if (emailVal.toLowerCase() === validEmail && passwordVal === validPassword) {
      triggerLoadingAndRedirect(' LOGGING IN ');
    } else {
      loginEmailInput.style.borderColor = "#A94A4A";
      loginPasswordInput.style.borderColor = "#A94A4A";
      loginErrorText.textContent = "✘ Invalid email or password.";
      loginErrorText.classList.remove('hidden');
    }
  });
}

// Sign Up Form Submission
if (formSignup) {
  formSignup.addEventListener('submit', (e) => {
    e.preventDefault();

    const usernameVal = signupUsernameInput.value.trim();
    const emailVal = signupEmailInput.value.trim();
    const passwordVal = signupPasswordInput.value;

    signupUsernameInput.style.borderColor = "#3D2013";
    signupEmailInput.style.borderColor = "#3D2013";
    signupPasswordInput.style.borderColor = "#3D2013";
    signupUsernameError.classList.add('hidden');
    signupEmailError.classList.add('hidden');
    signupPasswordNote.className = "font-pixel text-[#3D2013] text-[20px] leading-tight mt-1";
    signupPasswordNote.textContent = "Create a strong password using 8 or more characters, including uppercase and lowercase letters, a number, and a special character.";

    let hasError = false;

    if (mockUsernames.includes(usernameVal.toLowerCase())) {
      signupUsernameInput.style.borderColor = "#A94A4A";
      signupUsernameError.textContent = "✘ Username is already taken.";
      signupUsernameError.classList.remove('hidden');
      hasError = true;
    }

    if (mockDatabase.includes(emailVal.toLowerCase())) {
      signupEmailInput.style.borderColor = "#A94A4A";
      signupEmailError.textContent = "✘ This email is already registered.";
      signupEmailError.classList.remove('hidden');
      hasError = true;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_+\-\[\]\\\/]).{8,}$/;
    if (!passwordRegex.test(passwordVal)) {
      signupPasswordInput.style.borderColor = "#A94A4A";
      signupPasswordNote.className = "font-pixel text-[#A94A4A] text-sm leading-tight mt-1";
      signupPasswordNote.textContent = "✘ Your password doesn't meet the required security requirements. Please ensure it contains at least 8 characters, an uppercase letter, a lowercase letter, a number, and a special character.";
      hasError = true;
    }

    if (hasError) return;

    signupUsernameInput.value = '';
    signupEmailInput.value = '';
    signupPasswordInput.value = '';
    
    triggerLoadingAndRedirect(' CREATING ACCOUNT ');
  });
}

// Reset Password Form Submission
if (formReset) {
  formReset.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailVal = resetEmailInput.value.trim();

    if (emailVal === '') {
      resetErrorText.textContent = "✘ Textbox is empty! Please enter your email.";
      resetErrorText.classList.remove('hidden');
      return;
    }

    if (!mockDatabase.includes(emailVal.toLowerCase())) {
      resetErrorText.textContent = "✘ Email address not found in our system.";
      resetErrorText.classList.remove('hidden');
      return;
    }

    resetErrorText.classList.add('hidden');
    resetEmailInput.value = '';
    
    toggleViews(true, false, false);
    setTabActive('login');
    
    showSuccessToast();
  });
}

// --- REDIRECTED TOAST DETECTION SYSTEM ---
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem('passwordChangedSuccess') === 'true') {
    localStorage.removeItem('passwordChangedSuccess');

    const incomingToast = document.createElement('div');
    incomingToast.className = "bg-[#FBF2E3] border-4 border-[#3D2013] p-4 flex flex-col gap-2 relative shadow-md transition-all duration-300 max-w-xs retro-shadow pointer-events-auto opacity-0 translate-y-[-20px]";
    incomingToast.style.boxShadow = "4px 4px 0px #3D2013";

    incomingToast.innerHTML = `
      <div class="flex items-center gap-3 pr-2">
        <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="#788D55" stroke-width="4" stroke-linecap="square" stroke-linejoin="square"/>
        </svg>
        <span class="font-pressstart text-[11px] text-[#482A1D] tracking-wide">Password changed successfully!</span>
      </div>
      <div class="w-32 bg-transparent h-1.5 flex justify-center mt-1 mx-auto overflow-hidden">
        <div class="w-full h-full bg-[#788D55] animate-progress-center"></div>
      </div>
    `;

    if (toastContainer) {
      toastContainer.appendChild(incomingToast);

      requestAnimationFrame(() => {
        incomingToast.classList.remove('opacity-0', 'translate-y-[-20px]');
        incomingToast.classList.add('opacity-100', 'translate-y-0');
      });

      setTimeout(() => {
        incomingToast.classList.remove('opacity-100', 'translate-y-0');
        incomingToast.classList.add('opacity-0', 'translate-y-[-20px]');
        setTimeout(() => incomingToast.remove(), 300);
      }, 4000);
    }
  }
});