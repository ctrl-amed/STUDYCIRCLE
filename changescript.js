document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-change-password");
  const newPasswordInput = document.getElementById("new-password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const matchError = document.getElementById("password-match-error");
  const securityNote = document.getElementById("password-security-note");

  const btnToggleNew = document.getElementById("btn-toggle-new-password");
  const btnToggleConfirm = document.getElementById("btn-toggle-confirm-password");

  // --- EXTRACT TOKEN FROM URL ---
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  if (!token) {
    securityNote.innerText = "Error: Invalid or missing password reset token.";
    securityNote.classList.add("text-[#A94A4A]");
    if (form) form.style.display = "none";
    return;
  }

  // --- PASSWORD VISIBILITY TOGGLE HANDLING ---
  function setupVisibilityToggle(button, inputElement) {
    if (!button || !inputElement) return;
    button.addEventListener("click", () => {
      const isPassword = inputElement.type === "password";
      inputElement.type = isPassword ? "text" : "password";

      const openPaths = button.querySelectorAll(".eye-open");
      const closedPath = button.querySelector(".eye-closed");

      if (isPassword) {
        openPaths.forEach(p => p.classList.add("hidden"));
        closedPath.classList.remove("hidden");
      } else {
        openPaths.forEach(p => p.classList.remove("hidden"));
        closedPath.classList.add("hidden");
      }
    });
  }

  setupVisibilityToggle(btnToggleNew, newPasswordInput);
  setupVisibilityToggle(btnToggleConfirm, confirmPasswordInput);

  // --- REGEX COMPLEXITY VALIDATION ---
  function validateComplexity(password) {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    if (!/[!@#$%^&*(),.?":{}|<>_]/.test(password)) return false;
    return true;
  }

  // --- FORM SUBMISSION & BACKEND API CALL ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Reset styles and messages
    newPasswordInput.classList.remove("border-[#A94A4A]");
    confirmPasswordInput.classList.remove("border-[#A94A4A]");
    matchError.classList.add("hidden");
    
    securityNote.innerText = "Create a strong password using 8 or more characters, including uppercase and lowercase letters, a number, and a special character.";
    securityNote.classList.remove("text-[#A94A4A]");
    securityNote.classList.add("text-[#3D2013]");

    // 1. Check if passwords match
    if (newPassword !== confirmPassword) {
      newPasswordInput.classList.add("border-[#A94A4A]");
      confirmPasswordInput.classList.add("border-[#A94A4A]");
      matchError.innerText = "Passwords do not match.";
      matchError.classList.remove("hidden");
      return;
    }

    // 2. Check password complexity strength
    if (!validateComplexity(newPassword)) {
      newPasswordInput.classList.add("border-[#A94A4A]");
      confirmPasswordInput.classList.add("border-[#A94A4A]");
      
      securityNote.innerText = "Your password doesn't meet the required security requirements. Please ensure it contains at least 8 characters, an uppercase letter, a lowercase letter, a number, and a special character.";
      securityNote.classList.remove("text-[#3D2013]");
      securityNote.classList.add("text-[#A94A4A]");
      return;
    }

    // 3. SEND TO BACKEND FLASK API
    try {
      const response = await fetch("http://127.0.0.1:5000/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: token,
          password: newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        securityNote.innerText = data.message || "Failed to reset password.";
        securityNote.classList.remove("text-[#3D2013]");
        securityNote.classList.add("text-[#A94A4A]");
        return;
      }

      // Success: Flag and redirect to login
      localStorage.setItem('passwordChangedSuccess', 'true');
      window.location.href = "authentication.html#login";

    } catch (err) {
      console.error(err);
      securityNote.innerText = "Unable to connect to the backend server.";
      securityNote.classList.remove("text-[#3D2013]");
      securityNote.classList.add("text-[#A94A4A]");
    }
  });
});