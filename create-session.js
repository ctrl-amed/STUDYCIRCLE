document.addEventListener("DOMContentLoaded", () => {
  // --- MOCK ALGORITHM RECOMMENDATION DATA ---
  const mockRecommendedData = {
    techniqueName: "Pomodoro (25m focus / 5m break)",
    number_session: 4,
    focus: 25,
    break: 5
  };

  // --- FORM STATE ---
  let selectedWorkType = null;
  let draftTasks = [];
  let selectedTechnique = "recommended";

  // --- INITIALIZE DEFAULT TECHNIQUE STATE (Form 3) ---
  const recommendedBtn = document.querySelector('.technique-option-btn[data-technique="recommended"]');
  if (recommendedBtn) {
    recommendedBtn.setAttribute("data-selected", "true");
    recommendedBtn.classList.add("glow-border-card");
  }

  // Form Steps References
  const step1 = document.getElementById("form-step-1");
  const step2 = document.getElementById("form-step-2");
  const step3 = document.getElementById("form-step-3");
  const step4 = document.getElementById("form-step-4");

  function showStep(stepNum) {
    step1.classList.add("hidden");
    step2.classList.add("hidden");
    step3.classList.add("hidden");
    step4.classList.add("hidden");

    if (stepNum === 1) step1.classList.remove("hidden");
    if (stepNum === 2) step2.classList.remove("hidden");
    if (stepNum === 3) step3.classList.remove("hidden");
    if (stepNum === 4) {
      renderReviewSummary();
      step4.classList.remove("hidden");
    }
  }

  // --- FORM 1: WORK TYPE SELECTION ---
  const workBtns = document.querySelectorAll(".work-option-btn");
  workBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      workBtns.forEach(b => {
        b.removeAttribute("data-selected");
      });
      btn.setAttribute("data-selected", "true");
      selectedWorkType = btn.getAttribute("data-work");
    });
  });

  document.getElementById("f1-back-btn").addEventListener("click", () => {
    if (document.referrer) {
      window.location.href = document.referrer;
    } else {
      window.history.back();
    }
  });

  document.getElementById("f1-continue-btn").addEventListener("click", () => {
    if (!selectedWorkType) {
      alert("Please select a work type before continuing.");
      return;
    }
    showStep(2);
  });

  // --- FORM 2: DYNAMIC INLINE TASK ROW MANAGEMENT ---
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
               oninput="updateDraftTaskRow(${index}, this.value)"
               placeholder="Enter task item..." 
               class="flex-1 bg-[#FEF4E0] text-[#3D2013] border-[2px] border-[#3D2013] !rounded-none p-2 font-pressstart text-[8px] sm:text-[9px] focus:outline-none focus:bg-[#FFFFFF] placeholder-[#3D2013]/40 transition-colors">
        
        <button type="button" onclick="deleteDraftTaskRow(${index})" 
                title="Delete Task" 
                class="w-6 h-6 bg-[#A53914] border-[2px] border-[#482A1D] flex items-center justify-center text-[#FEF4E0] font-pressstart text-[10px] hover:brightness-110 active:scale-90 cursor-pointer shrink-0">
          ✕
        </button>
      </div>
    `).join('');
  }

  window.addDraftTaskRow = function() {
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
  };

  window.updateDraftTaskRow = function(index, newValue) {
    if (index >= 0 && index < draftTasks.length) {
      draftTasks[index] = newValue;
    }
  };

  window.deleteDraftTaskRow = function(index) {
    if (index >= 0 && index < draftTasks.length) {
      draftTasks.splice(index, 1);
      renderDraftTasks();
    }
  };

  document.getElementById("f2-back-btn").addEventListener("click", () => {
    showStep(1);
  });

  document.getElementById("f2-continue-btn").addEventListener("click", () => {
    const validTasks = draftTasks.filter(t => t.trim() !== "");
    if (validTasks.length === 0) {
      alert("Please add at least one task for this session.");
      return;
    }
    showStep(3);
  });

  // Render task list initially
  renderDraftTasks();

  // --- FORM 3: TECHNIQUE SELECTION ---
  const techBtns = document.querySelectorAll(".technique-option-btn");
  const sessionWrapper = document.getElementById("session-input-wrapper");
  const f3ContinueBtn = document.getElementById("f3-continue-btn");

  techBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Reset all buttons' attributes and classes
      techBtns.forEach(b => {
        b.setAttribute("data-selected", "false");
        if (b.getAttribute("data-technique") === "recommended") {
          b.classList.remove("glow-border-card");
        }
      });

      // Set the clicked button to active
      btn.setAttribute("data-selected", "true");
      
      // If it's the recommended button, add back the glow-border-card
      if (btn.getAttribute("data-technique") === "recommended") {
        btn.classList.add("glow-border-card");
      }

      selectedTechnique = btn.getAttribute("data-technique");

      // Toggle session input visibility and button text
      if (selectedTechnique === "recommended") {
        sessionWrapper.classList.add("hidden");
        f3ContinueBtn.textContent = "USE RECOMMENDATION";
      } else {
        sessionWrapper.classList.remove("hidden");
        f3ContinueBtn.textContent = "CONTINUE WITH THIS TECHNIQUE";
      }
    });
  });

  document.getElementById("f3-back-btn").addEventListener("click", () => {
    showStep(2);
  });

  document.getElementById("f3-continue-btn").addEventListener("click", () => {
    showStep(4);
  });

  // --- FORM 4: REVIEW SUMMARY & SUBMIT ---
  function renderReviewSummary() {
    const validTasks = draftTasks.filter(t => t.trim() !== "");
    
    // Work Type Summary
    document.getElementById("review-work-type").textContent = selectedWorkType || "N/A";

    // Find the currently selected technique button to read its data attributes
    const activeTechBtn = document.querySelector(`.technique-option-btn[data-technique="${selectedTechnique}"]`);

    let focusTime = "25";
    let breakTime = "5";
    let sessionCount = "4";
    let techniqueDisplayName = "Recommended Strategy";

    if (selectedTechnique === "recommended") {
      focusTime = mockRecommendedData.focus;
      breakTime = mockRecommendedData.break;
      sessionCount = mockRecommendedData.number_session;
      techniqueDisplayName = "Recommended Strategy";
    } else {
      if (activeTechBtn) {
        focusTime = activeTechBtn.getAttribute("data-focus") || "25";
        breakTime = activeTechBtn.getAttribute("data-break") || "5";
      }

      const techTitles = {
        "pomodoro": "Pomodoro",
        "52-17": "52-17 Method",
        "90m": "90m Deep Work"
      };
      techniqueDisplayName = techTitles[selectedTechnique] || selectedTechnique;
      sessionCount = document.getElementById("session-count-input").value || "1";
    }

    // Populate technique card breakdown elements
    document.getElementById("review-technique").textContent = techniqueDisplayName;
    document.getElementById("review-focus-time").textContent = focusTime;
    document.getElementById("review-break-time").textContent = breakTime;
    document.getElementById("review-session-count").textContent = sessionCount;

    // Tasks Checklist Summary
    const reviewList = document.getElementById("review-tasks-list");
    reviewList.innerHTML = validTasks.map(t => `
      <li class="bg-[#FEF4E0] border border-[#3D2013] px-2.5 py-1.5 font-bold text-[#3D2013] flex items-center gap-2">
        <span class="w-2 h-2 bg-[#E87339] border border-[#3D2013] shrink-0"></span>
        <span>${t}</span>
      </li>
    `).join('');
  }

  document.getElementById("f4-back-btn").addEventListener("click", () => {
    showStep(3);
  });

document.getElementById("f4-confirm-btn").addEventListener("click", () => {
  const validTasks = draftTasks.filter(t => t.trim() !== "");
  const activeTechBtn = document.querySelector(`.technique-option-btn[data-technique="${selectedTechnique}"]`);
  
  let focusTime = "25";
  let breakTime = "5";

  if (selectedTechnique === "recommended") {
    focusTime = mockRecommendedData.focus;
    breakTime = mockRecommendedData.break;
  } else if (activeTechBtn) {
    focusTime = activeTechBtn.getAttribute("data-focus") || "25";
    breakTime = activeTechBtn.getAttribute("data-break") || "5";
  }
  
  const finalSessions = selectedTechnique === "recommended" 
    ? mockRecommendedData.number_session 
    : (document.getElementById("session-count-input").value || "1");

  const techTitles = {
    "pomodoro": "Pomodoro",
    "52-17": "52-17 Method",
    "90m": "90m Deep Work",
    "recommended": "Recommended Strategy"
  };

  // --- SAVE ACTIVE SESSION TO LOCALSTORAGE ---
  const newSession = {
    workType: selectedWorkType || "General Work",
    techniqueKey: selectedTechnique,
    techniqueName: techTitles[selectedTechnique] || selectedTechnique,
    focusTime: focusTime,
    breakTime: breakTime,
    sessionCount: finalSessions,
    tasks: validTasks,
    createdAt: new Date().toISOString()
  };

  localStorage.setItem("activeSession", JSON.stringify(newSession));

  if (document.referrer) {
    window.location.href = document.referrer;
  } else {
    window.history.back();
  }
});



});

// Global function for the upper right close button
window.goBack = function() {
  if (document.referrer) {
    window.location.href = document.referrer;
  } else {
    window.history.back();
  }
};