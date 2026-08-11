// Pre-defined Mock Datasets (Cleaned up default values to 0 instead of hardcoded mock scores)
window.MOCK_ANALYTICS_DATA = {
  group: {
    sessionType: "structured", // Options: "structured" | "hangout"
    duration: "1hr 30m",
    completedTasks: 4,
    totalTasks: 4,
    avgScore: 0,
    groupPreTest: 0,
    groupPostTest: 0,
    groupImprovement: 0,
    userTasksCompleted: 4,
    userTasksTotal: 4,
    user: { 
      avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Angela", 
      preTest: 0, 
      postTest: 0, 
      improvement: 0 
    },
    members: [
      { name: "YOU (ANGELA)", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Angela", focusTime: "1hr 30m", participation: 96, tasks: "4/4" },
      { name: "ALTHEA", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Althea", focusTime: "1hr 20m", participation: 85, tasks: "4/4" }
    ],
    rewards: {
      level: 10,
      xpEarned: 55,
      coinsEarned: 35,
      currentXp: 100,
      nextLevelXp: 155,
      xpBreakdown: [
        { label: "Completed 4 tasks", value: 40 },
        { label: "Focus time: 1hr 30m", value: 10 },
        { label: "Completed study session", value: 5 }
      ],
      coinsBreakdown: [
        { label: "Completed 4 tasks", value: 20 },
        { label: "Focus time: 1hr 30m", value: 10 },
        { label: "Session completion bonus", value: 5 }
      ]
    }
  },
  hangout: {
    sessionType: "hangout",
    duration: "1hr 15m",
    completedTasks: 3,
    totalTasks: 5,
    avgScore: 0,
    user: { 
      avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Angela"
    },
    members: [
      { name: "YOU (ANGELA)", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Angela", focusTime: "1hr 15m", participation: 90, tasks: "Active" },
      { name: "ALTHEA", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Althea", focusTime: "1hr 10m", participation: 80, tasks: "Active" }
    ],
    rewards: {
      level: 10,
      xpEarned: 30,
      coinsEarned: 20,
      currentXp: 130,
      nextLevelXp: 155,
      xpBreakdown: [
        { label: "Hangout activity", value: 20 },
        { label: "Focus time: 1hr 15m", value: 10 }
      ],
      coinsBreakdown: [
        { label: "Hangout activity", value: 15 },
        { label: "Focus time: 1hr 15m", value: 5 }
      ]
    }
  },
  solo: {
    sessionType: "structured",
    duration: "45m",
    completedTasks: 3,
    totalTasks: 3,
    avgScore: 0,
    userTasksCompleted: 3,
    userTasksTotal: 3,
    user: { 
      avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Angela", 
      preTest: 0, 
      postTest: 0, 
      improvement: 0 
    },
    members: [{ name: "YOU" }],
    rewards: {
      level: 5,
      xpEarned: 40,
      coinsEarned: 25,
      currentXp: 40,
      nextLevelXp: 100,
      xpBreakdown: [
        { label: "Completed 3 tasks", value: 30 },
        { label: "Focus time: 45m", value: 5 },
        { label: "Completed study session", value: 5 }
      ],
      coinsBreakdown: [
        { label: "Completed 3 tasks", value: 15 },
        { label: "Focus time: 45m", value: 5 },
        { label: "Session completion bonus", value: 5 }
      ]
    }
  }
};

// Auto-inject Modal Markup into Host Page DOM
function injectAnalyticsModalMarkup() {
  if (document.getElementById('analytics-modal-backdrop')) return;

  const template = `
<div id="analytics-modal-backdrop" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 text-[#3D2013] select-none hidden">
  <div class="relative w-full max-w-2xl bg-[#FAE9CE] border-[4px] border-[#3D2013] rounded-2xl p-6 flex flex-col gap-5 overflow-hidden">
    
    <!-- STEP 1: SESSION ANALYTICS -->
    <div id="analytics-step-1" class="flex flex-col gap-4">
      <div class="text-center flex flex-col gap-1">
        <h2 class="font-pressstart text-xl sm:text-2xl font-black text-[#3D2013] uppercase tracking-wide">Session Complete!</h2>
        <p id="analytics-subtitle" class="font-pixel text-sm sm:text-base text-[#3D2013]/80">Great Job! Here's how your study session went.</p>
      </div>

      <!-- METRICS GRID -->
      <div class="grid grid-cols-3 gap-2 sm:gap-3">
        <div class="bg-[#FEF4E0] border-[3px] border-[#3D2013] rounded-xl p-3 flex items-center gap-2 sm:gap-3 ">
          <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#6B8E62] border-[2px] border-[#3D2013] flex items-center justify-center text-[#FEF4E0] shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
          </div>
          <div class="flex flex-col truncate">
            <span class="font-pixel text-xs text-[#3D2013]/60 uppercase">Duration</span>
            <span id="metric-duration" class="font-pressstart text-[10px] sm:text-[13px]">0m</span>
          </div>
        </div>

        <div class="bg-[#FEF4E0] border-[3px] border-[#3D2013] rounded-xl p-3 flex items-center gap-2 sm:gap-3 ">
          <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#6B8E62] border-[2px] border-[#3D2013] flex items-center justify-center text-[#FEF4E0] shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="16" rx="2"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <div class="flex flex-col truncate">
            <span id="label-tasks-title" class="font-pixel text-xs text-[#3D2013]/60 uppercase">Completed Tasks</span>
            <div class="flex items-baseline gap-1">
              <span id="metric-tasks-count" class="font-pressstart text-[10px] sm:text-[13px]">0/0</span>
              <span id="metric-tasks-percent" class="font-pixel text-[10px] text-[#3D2013]/80">0%</span>
            </div>
          </div>
        </div>

        <div class="bg-[#FEF4E0] border-[3px] border-[#3D2013] rounded-xl p-3 flex items-center gap-2 sm:gap-3 ">
          <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#6B8E62] border-[2px] border-[#3D2013] flex items-center justify-center text-[#FEF4E0] shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
          </div>
          <div class="flex flex-col truncate">
            <span id="label-score-title" class="font-pixel text-xs text-[#3D2013]/60 uppercase">Average Score</span>
            <span id="metric-avg-score" class="font-pressstart text-[10px] sm:text-[13px]">0%</span>
          </div>
        </div>
      </div>

      <!-- SEPARATE PERFORMANCE SECTION: SOLO UI MODE -->
      <div id="solo-performance-box" class="bg-[#FEF4E0] border-[3px] border-[#3D2013] rounded-xl p-2.5 sm:p-3  flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-[#3D2013]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
          <span class="font-pressstart text-[9px] sm:text-[10px] uppercase">Your Performance</span>
        </div>
        <div class="flex items-center justify-between gap-3 w-full px-6 sm:px-12 py-1">
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[2px] border-[#3D2013] bg-[#FAE9CE] overflow-hidden shrink-0 flex items-center justify-center">
            <img id="solo-user-avatar" src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Angela" alt="User Avatar" class="w-full h-full object-cover">
          </div>
          <div class="flex-1 flex items-center justify-around text-center">
            <div class="flex flex-col items-center justify-center">
              <span class="font-pixel text-[11px] sm:text-xs text-[#3D2013]/50 block">PRE-TEST</span>
              <span id="solo-user-pretest" class="font-pressstart text-xs sm:text-sm text-[#D96B27]">0%</span>
            </div>
            <span class="font-pressstart text-xs sm:text-sm text-[#3D2013]/60 font-bold self-center pt-3">→</span>
            <div class="flex flex-col items-center justify-center">
              <span class="font-pixel text-[11px] sm:text-xs text-[#3D2013]/50 block">POST-TEST</span>
              <span id="solo-user-posttest" class="font-pressstart text-xs sm:text-sm text-[#6B8E62]">0%</span>
            </div>
            <div class="flex flex-col items-center justify-center border-l-2 border-[#3D2013]/20 pl-3 sm:pl-4">
              <span class="font-pixel text-[11px] sm:text-xs text-[#3D2013]/50 block">IMPROVEMENT</span>
              <span id="solo-user-improvement" class="font-pressstart text-xs sm:text-sm text-[#6B8E62]">↑ 0%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- SEPARATE PERFORMANCE SECTION: GROUP UI MODE -->
      <div id="group-performance-box" class="hidden bg-[#FEF4E0] border-[3px] border-[#3D2013] rounded-xl p-3 sm:p-3.5  grid grid-cols-1 sm:grid-cols-2 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-[#3D2013]/20 gap-3">
        <!-- Group Progress Column -->
        <div class="flex flex-col justify-center gap-2 pb-3 sm:pb-0 sm:pr-4">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-[#3D2013] shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
            <span class="font-pressstart text-[9px] sm:text-[10px] uppercase">Group Learning Progress</span>
          </div>
          <div class="flex items-center justify-between text-center pt-1">
            <div class="flex flex-col">
              <span class="font-pixel text-xs text-[#3D2013]/50">PRE-TEST</span>
              <span id="group-pretest" class="font-pressstart text-[8px] sm:text-[9px] text-[#D96B27]">0%</span>
            </div>
            <span class="font-pressstart text-[8px] sm:text-[9px]">→</span>
            <div class="flex flex-col">
              <span class="font-pixel text-xs text-[#3D2013]/50">POST-TEST</span>
              <span id="group-posttest" class="font-pressstart text-[8px] sm:text-[9px] text-[#6B8E62]">0%</span>
            </div>
            <div class="flex flex-col border-l-2 border-[#3D2013]/20 pl-2">
              <span class="font-pixel text-xs text-[#3D2013]/50">IMPROVEMENT</span>
              <span id="group-improvement" class="font-pressstart text-[8px] sm:text-[9px] text-[#6B8E62]">↑ 0%</span>
            </div>
          </div>
        </div>

        <!-- Individual User Column in Group Mode -->
        <div class="pt-3 sm:pt-0 sm:pl-4 flex flex-col justify-center gap-2">
          <div class="flex items-center gap-2">
            <span class="font-pressstart text-[9px] sm:text-[10px] uppercase">Your Performance</span>
          </div>
          <div class="flex items-center justify-between gap-3 w-full">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[2px] border-[#3D2013] bg-[#FAE9CE] overflow-hidden shrink-0 flex items-center justify-center">
              <img id="group-user-avatar" src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Angela" alt="User Avatar" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 flex items-center justify-between text-center">
              <div>
                <span class="font-pixel text-xs text-[#3D2013]/50 block">PRE-TEST</span>
                <span id="group-user-pretest" class="font-pressstart text-[8px] sm:text-[9px] text-[#D96B27]">0%</span>
              </div>
              <span class="font-pressstart text-[8px] sm:text-[9px] text-[#3D2013]/60 font-bold">→</span>
              <div>
                <span class="font-pixel text-xs text-[#3D2013]/50 block">POST-TEST</span>
                <span id="group-user-posttest" class="font-pressstart text-[8px] sm:text-[9px] text-[#6B8E62]">0%</span>
              </div>
              <div class="border-l-2 border-[#3D2013]/20 pl-3">
                <span class="font-pixel text-xs text-[#3D2013]/50 block">IMPROVEMENT</span>
                <span id="group-user-improvement" class="font-pressstart text-[8px] sm:text-[9px] text-[#6B8E62]">↑ 0%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MEMBERS ACTIVITY SECTION -->
      <div id="group-members-section" class="hidden bg-[#FEF4E0] border-[3px] border-[#3D2013] rounded-xl p-3.5  flex-col gap-2.5">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-[#3D2013]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span class="font-pressstart text-[9px] sm:text-[10px] uppercase">Members Activity</span>
        </div>
        <div class="grid grid-cols-12 font-pixel text-xs text-[#3D2013]/60 uppercase px-1">
          <span class="col-span-4">Member</span>
          <span class="col-span-3 text-center">Focus Time</span>
          <span class="col-span-3 text-center">Participation</span>
          <span class="col-span-2 text-right">Tasks</span>
        </div>
        <div id="members-activity-list" class="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1"></div>
      </div>

      <div class="flex justify-center pt-2">
        <button onclick="switchAnalyticsStep(2)" class="font-pressstart w-48 bg-[#D96B27] hover:bg-[#c45a1c] text-[#FEF4E0] border-[3px] border-[#3D2013] rounded-xl py-2.5 text-xs uppercase  hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#3D2013] active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_#3D2013] transition-all duration-150 cursor-pointer">
          Next
        </button>
      </div>
    </div>

    <!-- STEP 2: SESSION REWARDS -->
    <div id="analytics-step-2" class="flex flex-col gap-4 hidden">
      <div class="text-center flex flex-col gap-1">
        <h2 class="font-pressstart text-xl sm:text-2xl font-black text-[#3D2013] uppercase tracking-wide">Session Rewards</h2>
        <p class="font-pixel text-sm sm:text-base text-[#3D2013]/80">Keep up the good work!</p>
      </div>
      <div class="bg-[#FEF4E0] border-[3px] border-[#3D2013] rounded-xl p-4  grid grid-cols-3 divide-x-2 divide-[#3D2013]/20 text-center items-center">
        <div class="flex flex-col gap-1">
          <span class="font-pixel text-xs text-[#3D2013]/60 uppercase">Level</span>
          <span id="reward-level" class="font-pressstart text-sm sm:text-lg">1</span>
        </div>
        <div class="flex flex-col gap-1 px-2 items-center">
          <span class="font-pixel text-xs text-[#3D2013]/60 uppercase">XP Earned</span>
          <span id="reward-xp-earned" class="font-pressstart text-sm sm:text-base text-[#D96B27]">+0 XP</span>
          <div class="w-full max-w-[100px] h-2 bg-[#FAE9CE] border-[1.5px] border-[#3D2013] rounded-full overflow-hidden mt-0.5">
            <div id="reward-xp-bar" class="bg-[#D96B27] h-full" style="width: 0%;"></div>
          </div>
          <span id="reward-xp-progress" class="font-pixel text-xs text-[#3D2013]/60">0/100</span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="font-pixel text-xs text-[#3D2013]/60 uppercase">Coins Earned</span>
          <div class="flex items-center justify-center gap-1">
            <span id="reward-coins-earned" class="font-pressstart text-sm sm:text-base text-[#6B8E62]">+0</span>
            <div class="font-pressstart w-4 h-4 rounded-full bg-[#EAB246] border-[1.5px] border-[#3D2013] flex items-center justify-center text-[8px]">$</div>
          </div>
        </div>
      </div>
      <div class="bg-[#FEF4E0] border-[3px] border-[#3D2013] rounded-xl p-4  grid grid-cols-1 sm:grid-cols-2 gap-4 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-[#3D2013]/20">
        <div class="flex flex-col gap-2 pb-3 sm:pb-0 sm:pr-2">
          <div class="flex items-center gap-1.5 uppercase">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            <span class="font-pressstart text-[8px] sm:text-[9px]">XP Breakdown</span>
          </div>
          <div id="xp-breakdown-list" class="flex flex-col gap-1.5 pt-1"></div>
          <div class="border-t-2 border-[#3D2013]/20 pt-1.5 flex justify-between items-center">
            <span class="font-pressstart text-[8px] sm:text-[9px]">TOTAL</span>
            <span id="xp-breakdown-total" class="font-pressstart text-[8px] sm:text-[9px] text-[#D96B27]">+0 XP</span>
          </div>
        </div>
        <div class="flex flex-col gap-2 pt-3 sm:pt-0 sm:pl-3">
          <div class="flex items-center gap-1.5 uppercase">
            <div class="font-pressstart w-3.5 h-3.5 rounded-full bg-[#EAB246] border-[1px] border-[#3D2013] flex items-center justify-center text-[7px]">$</div>
            <span class="font-pressstart text-[8px] sm:text-[9px]">Coins Breakdown</span>
          </div>
          <div id="coins-breakdown-list" class="flex flex-col gap-1.5 pt-1"></div>
          <div class="border-t-2 border-[#3D2013]/20 pt-1.5 flex justify-between items-center">
            <span class="font-pressstart text-[8px] sm:text-[9px]">TOTAL</span>
            <div class="flex items-center gap-1 text-[#6B8E62]">
              <span id="coins-breakdown-total" class="font-pressstart text-[8px] sm:text-[9px]">+0</span>
              <div class="w-3 h-3 rounded-full bg-[#EAB246] border-[1px] border-[#3D2013]"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center pt-2">
        <button onclick="closeAnalyticsModal()" class="font-pressstart w-48 bg-[#D96B27] hover:bg-[#c45a1c] text-[#FEF4E0] border-[3px] border-[#3D2013] rounded-xl py-2.5 text-xs uppercase  hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#3D2013] active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_#3D2013] transition-all duration-150 cursor-pointer">
          Done
        </button>
      </div>
    </div>
  </div>
</div>`;

  document.body.insertAdjacentHTML('beforeend', template);
}

window.switchAnalyticsStep = function(step) {
  const step1 = document.getElementById('analytics-step-1');
  const step2 = document.getElementById('analytics-step-2');
  if (step === 1) {
    if (step1) step1.classList.remove('hidden');
    if (step2) step2.classList.add('hidden');
  } else {
    if (step1) step1.classList.add('hidden');
    if (step2) step2.classList.remove('hidden');
  }
};

window.closeAnalyticsModal = function() {
  const backdrop = document.getElementById('analytics-modal-backdrop');
  if (backdrop) backdrop.classList.add('hidden');
  switchAnalyticsStep(1);
};

window.showSessionAnalytics = function(data) {
  injectAnalyticsModalMarkup();

  if (!data || typeof data === 'string') {
    const type = data === 'solo' ? 'solo' : (data === 'hangout' ? 'hangout' : 'group');
    // Clone ang object para hindi maapektuhan ang original mock data
    data = JSON.parse(JSON.stringify(window.MOCK_ANALYTICS_DATA[type]));

    // Kunin ang tunay na score mula sa localStorage kung tinapos ang pre/post test bago mag-session
    const savedPre = localStorage.getItem('last_pre_test_score');
    const savedPost = localStorage.getItem('last_post_test_score');

    if (savedPre !== null && data.user) {
      data.user.preTest = parseInt(savedPre);
    }
    if (savedPost !== null && data.user) {
      data.user.postTest = parseInt(savedPost);
      data.user.improvement = data.user.postTest - (data.user.preTest || 0);
      data.avgScore = data.user.postTest;
    }
  }

  switchAnalyticsStep(1);

  const isGroup = Array.isArray(data.members) && data.members.length > 1;
  const isHangout = data.sessionType === 'hangout' || data.isHangout === true;

  // Dynamic Header Labels based on session type and state
  if (isGroup) {
    document.getElementById('analytics-subtitle').textContent = isHangout 
      ? "Hangout complete! Here's how your group spent time together."
      : "Great Job! Here's how your group study session went.";
      
    document.getElementById('label-tasks-title').textContent = isHangout ? "Your Tasks" : "Shared Tasks";
    document.getElementById('label-score-title').textContent = isHangout ? "Group Engagement" : "Group Avg. Score";
  } else {
    document.getElementById('analytics-subtitle').textContent = "Great Job! Here's how your study session went.";
    document.getElementById('label-tasks-title').textContent = "Completed Tasks";
    document.getElementById('label-score-title').textContent = "Average Score";
  }

  // Core Metrics
  document.getElementById('metric-duration').textContent = data.duration || "0m";
  document.getElementById('metric-tasks-count').textContent = `${data.completedTasks || 0}/${data.totalTasks || 0}`;
  
  const taskPercent = data.totalTasks ? Math.round((data.completedTasks / data.totalTasks) * 100) : 0;
  document.getElementById('metric-tasks-percent').textContent = `${taskPercent}%`;
  document.getElementById('metric-avg-score').textContent = `${data.avgScore || 0}%`;

  const soloBox = document.getElementById('solo-performance-box');
  const groupBox = document.getElementById('group-performance-box');

  if (isGroup) {
    // Show Group container, hide Solo container
    soloBox.classList.add('hidden');
    groupBox.classList.remove('hidden');
    groupBox.classList.add('grid');

    // Populate Group learning metrics (Display N/A or dashes during Hangout mode)
    if (isHangout) {
      document.getElementById('group-pretest').textContent = "N/A";
      document.getElementById('group-posttest').textContent = "N/A";
      document.getElementById('group-improvement').textContent = "—";
    } else {
      document.getElementById('group-pretest').textContent = `${data.groupPreTest || 0}%`;
      document.getElementById('group-posttest').textContent = `${data.groupPostTest || 0}%`;
      document.getElementById('group-improvement').textContent = `↑ ${data.groupImprovement || 0}%`;
    }

    // Populate User metrics inside Group view
    if (data.user) {
      if (data.user.avatar) document.getElementById('group-user-avatar').src = data.user.avatar;
      document.getElementById('group-user-pretest').textContent = isHangout ? "N/A" : `${data.user.preTest || 0}%`;
      document.getElementById('group-user-posttest').textContent = isHangout ? "N/A" : `${data.user.postTest || 0}%`;
      document.getElementById('group-user-improvement').textContent = isHangout ? "—" : `↑ ${data.user.improvement || 0}%`;
    }
  } else {
    // Show Solo container, hide Group container
    groupBox.classList.add('hidden');
    groupBox.classList.remove('grid');
    soloBox.classList.remove('hidden');

    // Populate User metrics inside Solo view
    if (data.user) {
      if (data.user.avatar) document.getElementById('solo-user-avatar').src = data.user.avatar;
      document.getElementById('solo-user-pretest').textContent = `${data.user.preTest || 0}%`;
      document.getElementById('solo-user-posttest').textContent = `${data.user.postTest || 0}%`;
      document.getElementById('solo-user-improvement').textContent = `↑ ${data.user.improvement || 0}%`;
    }
  }

  const membersSection = document.getElementById('group-members-section');
  const membersList = document.getElementById('members-activity-list');

  if (isGroup) {
    membersSection.classList.remove('hidden');
    membersSection.classList.add('flex');
    membersList.innerHTML = data.members.map(member => `
      <div class="grid grid-cols-12 items-center bg-[#FAE9CE] border-[2px] border-[#3D2013] p-1.5 rounded-lg">
        <div class="col-span-4 flex items-center gap-1.5 truncate pr-1">
          <img src="${member.avatar || 'https://api.dicebear.com/7.x/pixel-art/svg?seed=' + member.name}" class="w-5 h-5 rounded-full border border-[#3D2013] shrink-0">
          <span class="font-pixel text-sm truncate">${member.name}</span>
        </div>
        <span class="col-span-3 text-center font-pressstart text-[8px] text-[#D96B27]">${member.focusTime}</span>
        <div class="col-span-3 flex items-center gap-1 px-1">
          <span class="font-pixel text-xs w-6 text-right">${member.participation}%</span>
          <div class="flex-1 h-1.5 bg-[#FEF4E0] border border-[#3D2013] rounded-full overflow-hidden">
            <div class="bg-[#D96B27] h-full" style="width: ${member.participation}%"></div>
          </div>
        </div>
        <span class="col-span-2 text-right font-pressstart text-[8px] text-[#6B8E62]">${member.tasks || (isHangout ? 'Active' : '0')}</span>
      </div>
    `).join('');
  } else {
    membersSection.classList.add('hidden');
    membersSection.classList.remove('flex');
  }

  if (data.rewards) {
    document.getElementById('reward-level').textContent = data.rewards.level || 1;
    document.getElementById('reward-xp-earned').textContent = `+${data.rewards.xpEarned || 0} XP`;
    document.getElementById('reward-coins-earned').textContent = `+${data.rewards.coinsEarned || 0}`;

    const xpPercent = Math.min(100, Math.round(((data.rewards.currentXp || 0) / (data.rewards.nextLevelXp || 100)) * 100));
    document.getElementById('reward-xp-bar').style.width = `${xpPercent}%`;
    document.getElementById('reward-xp-progress').textContent = `${data.rewards.currentXp || 0}/${data.rewards.nextLevelXp || 100}`;

    const xpList = document.getElementById('xp-breakdown-list');
    xpList.innerHTML = (data.rewards.xpBreakdown || []).map(item => `
      <div class="flex justify-between items-center text-[#3D2013]/80">
        <span class="font-pixel text-xs sm:text-sm">${item.label}</span>
        <span class="font-pressstart text-[8px] text-[#D96B27]">+${item.value} XP</span>
      </div>
    `).join('');
    document.getElementById('xp-breakdown-total').textContent = `+${data.rewards.xpEarned || 0} XP`;

    const coinsList = document.getElementById('coins-breakdown-list');
    coinsList.innerHTML = (data.rewards.coinsBreakdown || []).map(item => `
      <div class="flex justify-between items-center text-[#3D2013]/80">
        <span class="font-pixel text-xs sm:text-sm">${item.label}</span>
        <div class="flex items-center gap-0.5">
          <span class="font-pressstart text-[8px] text-[#6B8E62]">+${item.value}</span>
          <div class="w-2.5 h-2.5 rounded-full bg-[#EAB246] border-[1px] border-[#3D2013]"></div>
        </div>
      </div>
    `).join('');
    document.getElementById('coins-breakdown-total').textContent = `+${data.rewards.coinsEarned || 0}`;
  }

  document.getElementById('analytics-modal-backdrop').classList.remove('hidden');
};

document.addEventListener('DOMContentLoaded', injectAnalyticsModalMarkup);