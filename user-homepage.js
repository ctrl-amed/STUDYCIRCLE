// --- HOMEPAGE SPECIFIC MOCK DATA ---
const recentActivitiesData = [
  { activity: "Reading", technique: "52-17", duration: "1h 45m", date: "Today" },
  { activity: "Writing", technique: "Pomodoro", duration: "2h 15m", date: "Today" },
  { activity: "Review", technique: "90m Focus", duration: "45m", date: "Yesterday" },
  { activity: "Practice", technique: "Pomodoro", duration: "1h 10m", date: "Yesterday" },
  { activity: "Memorize", technique: "52-17", duration: "30m", date: "Aug 15, 2026" },
  { activity: "Creation", technique: "90m Focus", duration: "1h 30m", date: "Aug 12, 2026" }
];

const activityIcons = {
  Reading: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 2048 2048"><path d="M0 0h2048v2048H0z" fill="none" /><path fill="currentColor" d="M1920 256v1664H0V256h256V128h384q88 0 169 27t151 81q69-54 150-81t170-27h384v128zm-640 0q-70 0-136 23t-120 69v1254q59-33 124-49t132-17h256V256zM384 1536h256q67 0 132 16t124 50V348q-54-45-120-68t-136-24H384zm-256 256h806q-32-31-65-54t-68-40t-75-25t-86-9H256V384H128zM1792 384h-128v1280h-384q-46 0-85 8t-75 25t-69 40t-65 55h806z" /></svg>`,
  Writing: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="-2 -2 24 24"><path d="M-2 -2h24v24H-2z" fill="none" /><path fill="currentColor" d="m5.72 14.456l1.761-.508l10.603-10.73a.456.456 0 0 0-.003-.64l-.635-.642a.443.443 0 0 0-.632-.003L6.239 12.635zM18.703.664l.635.643c.876.887.884 2.318.016 3.196L8.428 15.561l-3.764 1.084a.9.9 0 0 1-1.11-.623.9.9 0 0 1-.002-.506l1.095-3.84L15.544.647a2.215 2.215 0 0 1 3.159.016zM7.184 1.817c.496 0 .898.407.898.909a.903.903 0 0 1-.898.909H3.592c-.992 0-1.796.814-1.796 1.817v10.906c0 1.004.804 1.818 1.796 1.818h10.776c.992 0 1.797-.814 1.797-1.818v-3.635c0-.502.402-.909.898-.909s.898.407.898.91v3.634c0 2.008-1.609 3.636-3.593 3.636H3.592C1.608 19.994 0 18.366 0 16.358V5.452c0-2.007 1.608-3.635 3.592-3.635z" /></svg>`,
  Review: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path fill="currentColor" d="M7 14h1.625q.2 0 .388-.075t.337-.225l4.7-4.7q.225-.225.338-.513t.112-.562t-.125-.537t-.325-.488l-.9-.95q-.225-.225-.5-.337t-.575-.113q-.275 0-.562.113T11 5.95l-4.7 4.7q-.15.15-.225.338T6 11.375V13q0 .425.288.713T7 14m6-6.075L12.075 7zM7.5 12.5v-.95l2.525-2.525l.5.45l.45.5L8.45 12.5zm3.025-3.025l.45.5l-.95-.95zm.65 4.525H17q.425 0 .713-.288T18 13t-.288-.712T17 12h-3.825zM6 18l-2.3 2.3q-.475.475-1.088.213T2 19.575V4q0-.825.588-1.412T4 2h16q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18zm-.85-2H20V4H4v13.125zM4 16V4z" /></svg>`,
  Practice: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path fill="currentColor" d="M23 5v2h-1v1h-1v1h-1v1h-1V9h-1V8h-1V7h-1V6h-1V5h-1V4h1V3h1V2h1V1h2v1h1v1h1v1h1v1zm-6 5V9h-1V8h-1V7h-1V6h-2v1h-1v1h-1v1H9v1H8v1H7v1H6v1H5v1H4v1H3v1H2v1H1v6h6v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-2zm-2 2v1h-1v1h-1v1h-1v1h-1v1h-1v1H9v1H8v1H7v1H3v-4h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1V9h1V8h2v1h1v1h1v2z" /></svg>`,
  Memorize: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path fill="currentColor" d="M21.33 12.91c.09 1.55-.62 3.04-1.89 3.95l.77 1.49c.23.45.26.98.06 1.45c-.19.47-.58.84-1.06 1l-.79.25a1.69 1.69 0 0 1-1.86-.55L14.44 18c-.89-.15-1.73-.53-2.44-1.1c-.5.15-1 .23-1.5.23c-.88 0-1.76-.27-2.5-.79c-.53.16-1.07.23-1.62.22c-.79.01-1.57-.15-2.3-.45a4.1 4.1 0 0 1-2.43-3.61c-.08-.72.04-1.45.35-2.11c-.29-.75-.32-1.57-.07-2.33C2.3 7.11 3 6.32 3.87 5.82c.58-1.69 2.21-2.82 4-2.7c1.6-1.5 4.05-1.66 5.83-.37c.42-.11.86-.17 1.3-.17c1.36-.03 2.65.57 3.5 1.64c2.04.53 3.5 2.35 3.58 4.47c.05 1.11-.25 2.2-.86 3.13c.07.36.11.72.11 1.09m-5-1.41c.57.07 1.02.5 1.02 1.07a1 1 0 0 1-1 1h-.63c-.32.9-.88 1.69-1.62 2.29c.25.09.51.14.77.21c5.13-.07 4.53-3.2 4.53-3.25a2.59 2.59 0 0 0-2.69-2.49a1 1 0 0 1-1-1a1 1 0 0 1 1-1c1.23.03 2.41.49 3.33 1.3c.05-.29.08-.59.08-.89c-.06-1.24-.62-2.32-2.87-2.53c-1.25-2.96-4.4-1.32-4.4-.4c-.03.23.21.72.25.75a1 1 0 0 1 1 1c0 .55-.45 1-1 1c-.53-.02-1.03-.22-1.43-.56c-.48.31-1.03.5-1.6.56c-.57.05-1.04-.35-1.07-.9a.97.97 0 0 1 .88-1.1c.16-.02.94-.14.94-.77c0-.66.25-1.29.68-1.79c-.92-.25-1.91.08-2.91 1.29C6.75 5 6 5.25 5.45 7.2C4.5 7.67 4 8 3.78 9c1.08-.22 2.19-.13 3.22.25c.5.19.78.75.59 1.29c-.19.52-.77.78-1.29.59c-.73-.32-1.55-.34-2.3-.06c-.32.27-.32.83-.32 1.27c0 .74.37 1.43 1 1.83c.53.27 1.12.41 1.71.4q-.225-.39-.39-.81a1.038 1.038 0 0 1 1.96-.68c.4 1.14 1.42 1.92 2.62 2.05c1.37-.07 2.59-.88 3.19-2.13c.23-1.38 1.34-1.5 2.56-1.5m2 7.47l-.62-1.3l-.71.16l1 1.25zm-4.65-8.61a1 1 0 0 0-.91-1.03c-.71-.04-1.4.2-1.93.67c-.57.58-.87 1.38-.84 2.19a1 1 0 0 0 1 1c.57 0 1-.45 1-1c0-.27.07-.54.23-.76c.12-.1.27-.15.43-.15c.55.03 1.02-.38 1.02-.92" /></svg>`,
  Creation: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path fill="currentColor" d="M17.5 12a1.5 1.5 0 0 1-1.5-1.5A1.5 1.5 0 0 1 17.5 9a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5m-3-4A1.5 1.5 0 0 1 13 6.5A1.5 1.5 0 0 1 14.5 5A1.5 1.5 0 0 1 16 6.5A1.5 1.5 0 0 1 14.5 8m-5 0A1.5 1.5 0 0 1 8 6.5A1.5 1.5 0 0 1 9.5 5A1.5 1.5 0 0 1 11 6.5A1.5 1.5 0 0 1 9.5 8m-3 4A1.5 1.5 0 0 1 5 10.5A1.5 1.5 0 0 1 6.5 9A1.5 1.5 0 0 1 8 10.5A1.5 1.5 0 0 1 6.5 12M12 3a9 9 0 0 0-9 9a9 9 0 0 0 9 9a1.5 1.5 0 0 0 1.5-1.5c0-.39-.15-.74-.39-1c-.23-.27-.38-.62-.38-1a1.5 1.5 0 0 1 1.5-1.5H16a5 5 0 0 0 5-5c0-4.42-4.03-8-9-8" /></svg>`
};

const leaderboardData = {
  "all-time": [
    { rank: 1, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Pixel1", username: "PixelKing", score: "420h 15m" },
    { rank: 2, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Shadow", username: "ACORN_HERO", score: "380h 40m" },
    { rank: 3, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Retro", username: "RetroGamer", score: "310h 05m" },
    { rank: 4, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Byte", username: "ByteWizard", score: "295h 50m" },
    { rank: 5, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Cyber", username: "CyberSamurai", score: "250h 12m" },
    { rank: 6, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Voxel", username: "VoxelHero", score: "210h 30m" },
    { rank: 7, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=8Bit", username: "8BitMaster", score: "195h 45m" },
    { rank: 8, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Chiptune", username: "ChiptuneQueen", score: "180h 20m" },
    { rank: 9, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Arcade", username: "ArcadeLegend", score: "165h 10m" },
    { rank: 10, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Neo", username: "NeonKnight", score: "150h 00m" },
    { rank: 11, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Giga", username: "GigaChad", score: "142h 18m" },
    { rank: 12, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Mega", username: "MegaByte", score: "130h 05m" }
  ],
  "this-month": [
    { rank: 1, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Shadow", username: "ACORN_HERO", score: "85h 20m" },
    { rank: 2, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Pixel1", username: "PixelKing", score: "72h 10m" },
    { rank: 3, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Cyber", username: "CyberSamurai", score: "68h 45m" },
    { rank: 4, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Retro", username: "RetroGamer", score: "60h 15m" },
    { rank: 5, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Voxel", username: "VoxelHero", score: "55h 00m" },
    { rank: 6, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Byte", username: "ByteWizard", score: "48h 30m" },
    { rank: 7, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Chiptune", username: "ChiptuneQueen", score: "42h 10m" },
    { rank: 8, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=8Bit", username: "8BitMaster", score: "39h 55m" },
    { rank: 9, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Neo", username: "NeonKnight", score: "31h 05m" },
    { rank: 10, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Arcade", username: "ArcadeLegend", score: "28h 40m" },
    { rank: 11, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Giga", username: "GigaChad", score: "22h 10m" }
  ],
  "streaks": [
    { rank: 1, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Byte", username: "ByteWizard", streak: "142 d" },
    { rank: 2, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Pixel1", username: "PixelKing", streak: "98 d" },
    { rank: 3, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Retro", username: "ACORN_HERO", streak: "75 d" },
    { rank: 4, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Shadow", username: "ShadowNinja", streak: "61 d" },
    { rank: 5, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Chiptune", username: "ChiptuneQueen", streak: "45 d" },
    { rank: 6, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Cyber", username: "CyberSamurai", streak: "39 d" },
    { rank: 7, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Voxel", username: "VoxelHero", streak: "30 d" },
    { rank: 8, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=8Bit", username: "8BitMaster", streak: "28 d" },
    { rank: 9, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Arcade", username: "ArcadeLegend", streak: "21 d" },
    { rank: 10, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Neo", username: "NeonKnight", streak: "14 d" },
    { rank: 11, pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Giga", username: "GigaChad", streak: "10 d" }
  ]
};

let currentTab = "all-time";

// --- TIMER & SESSION GLOBAL STATE ---
let timerInterval = null;
let isTimerRunning = false;
let isFocusPhase = true; // true = Focus, false = Break
let currentSessionCount = 0;
let totalSessions = 1;
let focusDurationSec = 25 * 60;
let breakDurationSec = 5 * 60;
let remainingTimeSec = 25 * 60;
let sessionTasksList = [];

// Backup default DOM content for reset capability
let defaultActiveSessionHTML = "";
let defaultRecentActivityHTML = "";

// --- HOMEPAGE SPECIFIC INITIALIZERS ---
document.addEventListener("DOMContentLoaded", () => {
  // Save default container templates
  const activeCard = document.getElementById("active-session-card");
  const recentCard = document.getElementById("recent-activity-card");

  if (activeCard) defaultActiveSessionHTML = activeCard.innerHTML;
  if (recentCard) defaultRecentActivityHTML = recentCard.innerHTML;

  updateAvatarNametag();
  updateStreakDisplay();
  updateGreetingAndDate();
  renderRecentActivities();
  renderActiveSession();
  switchTab("all-time");
  updateAllCalendars();
  updateFocusTimeDisplay()

  document.getElementById("cal-prev-month")?.addEventListener("click", () => {
    currentCalDate.setMonth(currentCalDate.getMonth() - 1);
    updateAllCalendars();
  });

  document.getElementById("cal-next-month")?.addEventListener("click", () => {
    currentCalDate.setMonth(currentCalDate.getMonth() + 1);
    updateAllCalendars();
  });

  document.getElementById("modal-cal-prev-month")?.addEventListener("click", () => {
    currentCalDate.setMonth(currentCalDate.getMonth() - 1);
    updateAllCalendars();
  });

  document.getElementById("modal-cal-next-month")?.addEventListener("click", () => {
    currentCalDate.setMonth(currentCalDate.getMonth() + 1);
    updateAllCalendars();
  });

  const modalOverlay = document.getElementById("cal-modal-overlay");
  const fullscreenBtn = document.getElementById("cal-fullscreen-btn");
  const minimizeBtn = document.getElementById("cal-minimize-btn");

  fullscreenBtn?.addEventListener("click", () => {
    modalOverlay?.classList.remove("hidden");
  });

  minimizeBtn?.addEventListener("click", () => {
    modalOverlay?.classList.add("hidden");
  });

  modalOverlay?.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.add("hidden");
    }
  });
});

function updateAvatarNametag() {
  const avatarNametagEl = document.getElementById("avatar-nametag");
  const username = (typeof playerData !== "undefined" && playerData.username) ? playerData.username : "username";

  if (avatarNametagEl) {
    avatarNametagEl.textContent = username;
  }
}

function updateStreakDisplay() {
  const streakDisplayEl = document.getElementById("streak-display");
  const streak = (typeof playerData !== "undefined" && typeof playerData.streak_number === "number") 
    ? playerData.streak_number 
    : 0;

  if (streakDisplayEl) {
    streakDisplayEl.textContent = `${streak} ${streak === 1 ? 'day' : 'days'}`;
  }
}

// --- HOMEPAGE GREETING & DATE ---
function updateGreetingAndDate() {
  const userGreetingEl = document.getElementById("user-greeting");
  const currentDateTextEl = document.getElementById("current-date-text");
  
  const now = new Date();
  const hours = now.getHours();
  let timeOfDay = "Morning";
  if (hours >= 12 && hours < 17) timeOfDay = "Afternoon";
  else if (hours >= 17) timeOfDay = "Evening";

  const username = (typeof playerData !== "undefined" && playerData.username) ? playerData.username : "username";

  if (userGreetingEl) {
    userGreetingEl.textContent = `Good ${timeOfDay}, ${username}`;
  }

  if (currentDateTextEl) {
    const formattedDate = now.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
    currentDateTextEl.textContent = `${formattedDate} | Ready to focus?`;
  }
}

// --- RECENT ACTIVITY LOGIC ---
function renderRecentActivities() {
  const container = document.getElementById("recent-activity-list");
  if (!container) return;

  if (recentActivitiesData.length === 0) {
    container.innerHTML = `<div class="text-center font-pressstart text-[10px] text-[#3D2013]/60 py-4">No recent activity recorded.</div>`;
    return;
  }

  const displayItems = recentActivitiesData.slice(0, 3);
  container.innerHTML = displayItems.map((item) => renderActivityItemHtml(item)).join("");
}

function renderActivityItemHtml(item) {
  const iconSvg = activityIcons[item.activity] || activityIcons.Reading;

  return `
    <div class="flex items-center justify-between p-2 rounded-[8px] transition-colors hover:bg-[#FAE9CE]/50">
      <div class="flex items-center gap-2.5 min-w-0 flex-1">
        <div class="w-10 h-10 rounded-[6px] bg-[#FAE9CE] border-[1.5px] border-[#3D2013] flex items-center justify-center text-lg shrink-0">
          ${iconSvg}
        </div>
        <div class="flex flex-col min-w-0">
          <span class="font-pressstart text-[10px] text-[#3D2013] truncate uppercase">${item.activity}</span>
          <span class="font-pressstart text-[8px] text-[#3D2013]/60 truncate mt-0.5">${item.duration} | ${item.technique}</span>
        </div>
      </div>

      <div class="shrink-0 pl-2">
        <span class="font-pixel text-[15px] text-[#3D2013]/70 px-2 py-1 uppercase">
          ${item.date}
        </span>
      </div>
    </div>
  `;
}

function openRecentActivitiesModal() {
  const modalContainer = document.getElementById("all-activities-list");
  if (modalContainer) {
    modalContainer.innerHTML = recentActivitiesData
      .map((item) => renderActivityItemHtml(item))
      .join("");
  }
  openModal("recent-activities-modal");
}

// --- ACTIVE SESSION & TIMER SYSTEM ---
function renderActiveSession() {
  const savedSessionData = localStorage.getItem("activeSession");
  if (!savedSessionData) return;

  try {
    const session = JSON.parse(savedSessionData);
    const activeCard = document.getElementById("active-session-card");
    if (!activeCard) return;

    // Initialize Timer Variables from Session Data
    totalSessions = parseInt(session.sessionCount) || 1;
    focusDurationSec = (parseInt(session.focusTime) || 25) * 60;
    breakDurationSec = (parseInt(session.breakTime) || 5) * 60;
    remainingTimeSec = focusDurationSec;
    isFocusPhase = true;
    currentSessionCount = 0;

    // Initialize Tasks State
    sessionTasksList = (session.tasks || []).map((tText) => ({ text: tText, completed: false }));

    // Inflate Active Session Card
    inflateTimerCardUI(session);

    // Inflate Recent Activity Card with Session Tasks
    inflateTasksCardUI();

  } catch (e) {
    console.error("Error inflating active session:", e);
  }
}

function inflateTimerCardUI(session) {
  const activeCard = document.getElementById("active-session-card");
  if (!activeCard) return;

  const focusMins = session.focusTime || 25;
  const breakMins = session.breakTime || 5;

  activeCard.innerHTML = `
    <div class="flex flex-col gap-3 h-full justify-between">
      <!-- HEADER CONTROLS & META -->
      <div class="flex items-center justify-between pb-2 border-b border-[#3D2013]/20">
        <div class="flex items-center gap-2">
          <span class="font-pressstart text-[8px] sm:text-[9px] text-[#FEF4E0] bg-[#E87339] border border-[#3D2013] px-2 py-0.5 uppercase">
            ${session.workType || "GENERAL WORK"}
          </span>
          <span class="font-pressstart text-[8px] sm:text-[9px] text-[#3D2013] opacity-80">
            ${session.techniqueName || "Technique"}
          </span>
        </div>

        <!-- ACTION BUTTONS: FLOATING, FULLSCREEN, CANCEL -->
        <div class="flex items-center gap-1.5">
          <button onclick="toggleFloatingWidget()" title="Pop-out Floating Widget" class="p-1 hover:bg-[#FAE9CE] rounded border border-[#3D2013]/40 cursor-pointer text-[#3D2013]">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
          </button>
          
          <button onclick="toggleFullScreenTimer()" title="Full Screen Timer" class="p-1 hover:bg-[#FAE9CE] rounded border border-[#3D2013]/40 cursor-pointer text-[#3D2013]">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
            </svg>
          </button>

          <button onclick="cancelActiveSession()" title="Cancel Session" class="font-pressstart text-[9px] text-[#A53914] hover:bg-[#A53914] hover:text-[#FEF4E0] border border-[#A53914] px-1.5 py-0.5 transition-colors cursor-pointer ml-1">
            ✕
          </button>
        </div>
      </div>

      <!-- TIMER DISPLAY -->
      <div class="flex flex-col items-center justify-center my-1 text-center">
        <span id="timer-phase-label" class="font-pressstart text-[10px] sm:text-[12px] text-[#E87339] tracking-wider uppercase mb-1">
          FOCUS PHASE
        </span>
        <div id="timer-time-display" class="font-pressstart text-[36px] sm:text-[48px] text-[#3D2013] tracking-tighter drop-shadow-sm">
          ${formatTime(remainingTimeSec)}
        </div>
      </div>

      <!-- START / PAUSE TOGGLE BUTTON -->
      <div>
        <button id="timer-start-pause-btn" onclick="toggleTimer()" class="w-full font-pressstart text-[11px] text-[#FFFFF6] bg-[#E87339] border-[2px] border-[#3D2013] py-2.5 transition-all retro-shadow active:translate-x-0.5 active:translate-y-0.5 cursor-pointer">
          START FOCUS
        </button>
      </div>

      <!-- STATS BREAKDOWN -->
      <div class="grid grid-cols-3 gap-2 border-t-[1.5px] border-[#3D2013]/20 pt-3 text-center">
        <!-- FOCUS -->
        <div class="flex items-center justify-center gap-2">
          <svg class="w-7 h-7 sm:w-9 sm:h-9 shrink-0 text-[#E87339]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 3"></path></svg>
          <div class="flex flex-col text-left">
            <span class="font-pressstart text-[10px] sm:text-[13px] text-[#3D2013]">${focusMins}m</span>
            <span class="font-pixel text-[10px] sm:text-[15px] text-[#3D2013]/60 uppercase">FOCUS</span>
          </div>
        </div>

        <!-- BREAK -->
        <div class="flex items-center justify-center gap-2 border-x border-[#3D2013]/20 px-1">
          <svg class="w-7 h-7 sm:w-9 sm:h-9 shrink-0 text-[#E87339]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18 8h1a3 3 0 010 6h-1M6 8h12v7a3 3 0 01-3 3H9a3 3 0 01-3-3V8zM6 10H4a2 2 0 00-2 2v1a2 2 0 002 2h2"></path></svg>
          <div class="flex flex-col text-left">
            <span class="font-pressstart text-[10px] sm:text-[13px] text-[#3D2013]">${breakMins}m</span>
            <span class="font-pixel text-[10px] sm:text-[15px] text-[#3D2013]/60 uppercase">BREAK</span>
          </div>
        </div>

        <!-- SESSIONS -->
        <div class="flex items-center justify-center gap-2">
          <svg class="w-7 h-7 sm:w-9 sm:h-9 shrink-0 text-[#E87339]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="5"></circle><circle cx="12" cy="12" r="1"></circle></svg>
          <div class="flex flex-col text-left">
            <span id="session-progress-display" class="font-pressstart text-[10px] sm:text-[13px] text-[#3D2013]">
              ${currentSessionCount}/${totalSessions}
            </span>
            <span class="font-pixel text-[10px] sm:text-[15px] text-[#3D2013]/60 uppercase">SESSIONS</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function inflateTasksCardUI() {
  const recentCard = document.getElementById("recent-activity-card");
  if (!recentCard) return;

  const total = sessionTasksList.length;
  const completed = sessionTasksList.filter(t => t.completed).length;

  recentCard.innerHTML = `
    <div class="flex flex-col gap-3 h-full">
      <div class="flex items-center justify-between pb-2 border-b-[2px] border-[#3D2013]/20">
        <h3 class="font-pressstart text-[11px] sm:text-[13px] text-[#3D2013] uppercase">SESSION TASKS</h3>
        <span id="task-ratio-display" class="font-pressstart text-[9px] sm:text-[10px] text-[#E87339] px-2 py-0.5">
          ${completed}/${total} COMPLETED
        </span>
      </div>

      <!-- TASK CHECKLIST -->
      <div class="flex flex-col gap-2 overflow-y-auto max-h-[220px] pr-1">
        ${sessionTasksList.map((task, idx) => `
          <label class="flex items-center gap-2.5 p-2 bg-[#FAE9CE]/60 border border-[#3D2013]/30 rounded-[6px] hover:bg-[#FAE9CE] cursor-pointer transition-colors">
            <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTaskCompletion(${idx})" class="w-4 h-4 accent-[#E87339] border-[#3D2013] rounded cursor-pointer shrink-0">
            <span id="task-text-${idx}" class="font-pressstart text-[8px] sm:text-[9px] text-[#3D2013] break-words ${task.completed ? 'line-through opacity-50' : ''}">
              ${task.text}
            </span>
          </label>
        `).join('')}
      </div>
    </div>
  `;
}

// 1. Helper using Local Time (fixes UTC timezone shift bug)
// 1. Helper for Local Time string (YYYY-MM-DD)
function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
// 1. Helper to convert duration strings like "1h 45m" or "45m" into seconds
function parseDurationToSeconds(durationStr) {
  let totalSec = 0;
  const hoursMatch = durationStr.match(/(\d+)h/);
  const minsMatch = durationStr.match(/(\d+)m/);
  if (hoursMatch) totalSec += parseInt(hoursMatch[1], 10) * 3600;
  if (minsMatch) totalSec += parseInt(minsMatch[1], 10) * 60;
  return totalSec;
}
// 2. Retrieve combined daily totals (Mock Data + Live Timer Storage)
// 2. Retrieve only real tracked time from localStorage
function getDailyStats() {
  const today = getTodayDateString();
  const lastSavedDate = localStorage.getItem("tracker_date");

  // Only reset stored timer values when a new calendar day actually begins
  if (lastSavedDate !== today) {
    localStorage.setItem("tracker_date", today);
    localStorage.setItem("daily_focus_seconds", "0");
    localStorage.setItem("daily_break_seconds", "0");
  }

  const focusSeconds = parseInt(localStorage.getItem("daily_focus_seconds") || "0", 10);
  const breakSeconds = parseInt(localStorage.getItem("daily_break_seconds") || "0", 10);

  return {
    focusSeconds,
    breakSeconds,
    totalSeconds: focusSeconds + breakSeconds,
    totalMinutes: Math.floor((focusSeconds + breakSeconds) / 60)
  };
}

// 3. Add finished session time (type: 'focus' or 'break', duration in seconds)
function recordCompletedSession(durationInSeconds, sessionType) {
  // Ensure reset check runs before saving new time
  const currentStats = getDailyStats();

  if (sessionType === 'focus') {
    const updatedFocus = currentStats.focusSeconds + durationInSeconds;
    localStorage.setItem("daily_focus_seconds", updatedFocus.toString());
  } else if (sessionType === 'break') {
    const updatedBreak = currentStats.breakSeconds + durationInSeconds;
    localStorage.setItem("daily_break_seconds", updatedBreak.toString());
  }

  // Return the combined stats for immediate UI updates
  return getDailyStats();
}

// 3. Update element text content
function updateFocusTimeDisplay() {
  const displayEl = document.getElementById("focus-time-display");
  if (!displayEl) return;

  const { focusSeconds } = getDailyStats();

  const hours = Math.floor(focusSeconds / 3600);
  const minutes = Math.floor((focusSeconds % 3600) / 60);

  displayEl.textContent = `${hours}h ${minutes}m`;
}

// --- TIMER INTERACTION LOGIC ---
function toggleTimer() {
  const btn = document.getElementById("timer-start-pause-btn");

  if (isTimerRunning) {
    clearInterval(timerInterval);
    isTimerRunning = false;
    if (btn) btn.textContent = isFocusPhase ? "RESUME FOCUS" : "RESUME BREAK";
  } else {
    isTimerRunning = true;
    if (btn) btn.textContent = "PAUSE";

    timerInterval = setInterval(() => {
      remainingTimeSec--;

      const timeDisplay = document.getElementById("timer-time-display");
      if (timeDisplay) timeDisplay.textContent = formatTime(remainingTimeSec);

// --- UPDATE toggleTimer() IN YOUR CODE ---
if (remainingTimeSec <= 0) {
  clearInterval(timerInterval);
  isTimerRunning = false;

  if (isFocusPhase) {
    // 1. Record completed focus time to localStorage
    recordCompletedSession(focusDurationSec, 'focus');
    
    // 2. Refresh the UI display
    updateFocusTimeDisplay();

    // Switch state to Break, pause timer, prompt user to start break
    isFocusPhase = false;
    remainingTimeSec = breakDurationSec;
    updatePhaseUI("BREAK PHASE", "START BREAK");
  } else {
    // 1. Record completed break time to localStorage
    recordCompletedSession(breakDurationSec, 'break');
    
    // 2. Refresh the UI display
    updateFocusTimeDisplay();

    // Break finished -> Increment session count (1 Focus + 1 Break = 1 Session)
    currentSessionCount++;
    const progressEl = document.getElementById("session-progress-display");
    if (progressEl) progressEl.textContent = `${currentSessionCount}/${totalSessions}`;

    if (currentSessionCount >= totalSessions) {
      handleSessionCompletion();
      return;
    } else {
      // Prepare next Focus Phase and wait for user to start
      isFocusPhase = true;
      remainingTimeSec = focusDurationSec;
      updatePhaseUI("FOCUS PHASE", "START FOCUS");
    }
  }
}
    }, 1000);
  }
}

function updatePhaseUI(label, btnText) {
  const phaseLabel = document.getElementById("timer-phase-label");
  const timeDisplay = document.getElementById("timer-time-display");
  const btn = document.getElementById("timer-start-pause-btn");

  if (phaseLabel) phaseLabel.textContent = label;
  if (timeDisplay) timeDisplay.textContent = formatTime(remainingTimeSec);
  if (btn) btn.textContent = btnText;
}

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// --- TASK CHECKLIST TOGGLE ---
window.toggleTaskCompletion = function(index) {
  if (sessionTasksList[index]) {
    sessionTasksList[index].completed = !sessionTasksList[index].completed;
    
    const completed = sessionTasksList.filter(t => t.completed).length;
    const ratioEl = document.getElementById("task-ratio-display");
    if (ratioEl) ratioEl.textContent = `${completed}/${sessionTasksList.length} COMPLETED`;

    const textEl = document.getElementById(`task-text-${index}`);
    if (textEl) {
      if (sessionTasksList[index].completed) {
        textEl.classList.add("line-through", "opacity-50");
      } else {
        textEl.classList.remove("line-through", "opacity-50");
      }
    }
  }
};

// --- FLOATING WIDGET & FULLSCREEN MODES ---
window.toggleFloatingWidget = function() {
  const activeCard = document.getElementById("active-session-card");
  if (!activeCard) return;

  if (activeCard.classList.contains("fixed-float-widget")) {
    activeCard.classList.remove("fixed-float-widget", "fixed", "bottom-5", "right-5", "w-80", "sm:w-96", "z-50", "shadow-2xl");
  } else {
    activeCard.classList.remove("fixed-fullscreen-widget", "fixed", "inset-0", "z-50", "w-screen", "h-screen", "flex", "items-center", "justify-center", "p-6", "bg-[#FAE9CE]");
    activeCard.classList.add("fixed-float-widget", "fixed", "bottom-5", "right-5", "w-80", "sm:w-96", "z-50", "shadow-2xl");
  }
};

window.toggleFullScreenTimer = function() {
  const activeCard = document.getElementById("active-session-card");
  if (!activeCard) return;

  if (activeCard.classList.contains("fixed-fullscreen-widget")) {
    activeCard.classList.remove("fixed-fullscreen-widget", "fixed", "inset-0", "z-50", "w-screen", "h-screen", "flex", "items-center", "justify-center", "p-6", "bg-[#FAE9CE]");
  } else {
    activeCard.classList.remove("fixed-float-widget", "fixed", "bottom-5", "right-5", "w-80", "sm:w-96", "z-50", "shadow-2xl");
    activeCard.classList.add("fixed-fullscreen-widget", "fixed", "inset-0", "z-50", "w-screen", "h-screen", "flex", "items-center", "justify-center", "p-6", "bg-[#FAE9CE]");
  }
};

// --- SESSION COMPLETION & RESET REWARDS ---
function handleSessionCompletion() {
  if (timerInterval) clearInterval(timerInterval);
  isTimerRunning = false;
  showRewardsModal();
  resetContainersToDefault();
}

window.cancelActiveSession = function() {
  if (confirm("Are you sure you want to cancel the active session?")) {
    if (timerInterval) clearInterval(timerInterval);
    isTimerRunning = false;
    resetContainersToDefault();
  }
};

function resetContainersToDefault() {
  localStorage.removeItem("activeSession");

  const activeCard = document.getElementById("active-session-card");
  const recentCard = document.getElementById("recent-activity-card");

  if (activeCard) {
    activeCard.className = "bg-gradient-to-b from-[#FDE4D0] to-[#FFD2AE] border-[2px] border-[#3D2013] rounded-[12px] p-4 sm:p-6 shadow-md flex flex-col justify-between gap-4";
    activeCard.innerHTML = defaultActiveSessionHTML;
  }

  if (recentCard) {
    recentCard.innerHTML = defaultRecentActivityHTML;
    renderRecentActivities();
  }

  // Re-populate all dynamic data into restored DOM elements
  updateStreakDisplay();
  updateAvatarNametag();
  updateFocusTimeDisplay(); // <--- Re-populates stored focus time
}

function showRewardsModal() {
  const rewardsModal = document.getElementById("rewards-modal");
  if (rewardsModal) {
    rewardsModal.classList.remove("hidden");
  }
}

window.closeRewardsModal = function() {
  const rewardsModal = document.getElementById("rewards-modal");
  if (rewardsModal) {
    rewardsModal.classList.add("hidden");
  }
};

// --- LEADERBOARD LOGIC ---
function renderLeaderboardRow(item, isStreak = false) {
  const isCurrentUser = typeof playerData !== "undefined" && item.username === playerData.username;

  const rowStyle = isCurrentUser
    ? "bg-[#C97845]/50 border-[1.5px] border-[#3D2013]"
    : "bg-[#FAE9CE]/40 border-[1.5px] border-[#3D2013]/20 hover:bg-[#FAE9CE]";

  const valueDisplay = isStreak 
    ? `<span class="flex items-center gap-1 font-pressstart text-[9px] text-[#3D2013]">
        <svg class="w-3.5 h-3.5 sm:w-6 sm:h-6 text-[#ED8C00]" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.8 9.4Q11 7 12 3q2.5 5 0 10q3 0 5-2.9a7 7 0 1 1-9.2-.7" />
        </svg>
        ${item.streak}
       </span>`
    : `<span class="font-pressstart text-[9px] text-[#3D2013]">
        ${item.score}
       </span>`;

  return `
    <div class="flex items-center justify-between p-2 rounded-[8px] ${rowStyle} transition-colors">
      <div class="flex items-center gap-2.5 min-w-0">
        <span class="font-pressstart text-[10px] w-5 text-center ${item.rank <= 3 ? 'text-[#D97706] font-bold' : 'text-[#3D2013]/60'}">
          #${item.rank}
        </span>
        <img src="${item.pfp}" alt="${item.username}" class="w-7 h-7 rounded-[4px] border border-[#3D2013] bg-[#FEF4E0] shrink-0" />
        <span class="font-pressstart text-[9px] text-[#3D2013] truncate">
          ${item.username} ${isCurrentUser ? '<span class="text-[7px] text-[#E87339]">(YOU)</span>' : ''}
        </span>
      </div>
      <div class="shrink-0 pl-2">
        ${valueDisplay}
      </div>
    </div>
  `;
}

function renderLeaderboard(category = "all-time", containerId = "leaderboard-list", limit = 10) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const data = leaderboardData[category] || [];
  const isStreak = category === "streaks";
  const itemsToRender = limit ? data.slice(0, limit) : data;

  container.innerHTML = itemsToRender
    .map((item) => renderLeaderboardRow(item, isStreak))
    .join("");
}

window.switchTab = function(category, isModal = false) {
  currentTab = category;

  renderLeaderboard(category, "leaderboard-list", 10);
  updateTabStyles(".lb-tab", `tab-${category}`);

  renderLeaderboard(category, "modal-leaderboard-list", null);
  updateTabStyles(".modal-lb-tab", `modal-tab-${category}`);
};

function updateTabStyles(selector, activeId) {
  document.querySelectorAll(selector).forEach((btn) => {
    if (btn.id === activeId) {
      btn.classList.add("bg-[#E87339]", "text-[#FFFFF6]", "hover:bg-[#f17a41]");
      btn.classList.remove("bg-[#FAE9CE]", "text-[#3D2013]", "hover:bg-[#f3dcba]");
    } else {
      btn.classList.add("bg-[#FAE9CE]", "text-[#3D2013]", "hover:bg-[#f3dcba]");
      btn.classList.remove("bg-[#E87339]", "text-[#FFFFF6]", "hover:bg-[#f17a41]");
    }
  });
}

window.openLeaderboardModal = function() {
  const modal = document.getElementById("leaderboard-modal");
  if (modal) {
    modal.classList.remove("hidden");
    renderLeaderboard(currentTab, "modal-leaderboard-list", null);
    updateTabStyles(".modal-lb-tab", `modal-tab-${currentTab}`);
  }
};

window.closeLeaderboardModal = function() {
  const modal = document.getElementById("leaderboard-modal");
  if (modal) modal.classList.add("hidden");
};

// --- CALENDAR LOGIC & STATE ---
const userActivities = {
  "2026-08-01": [
    { name: "Reading", duration: "1h 00m", technique: "Pomodoro" },
    { name: "Practice", duration: "45m", technique: "52-17" }
  ],
  "2026-08-05": [
    { name: "Writing", duration: "2h 15m", technique: "90m" }
  ],
  "2026-08-12": [
    { name: "Creation", duration: "1h 30m", technique: "Pomodoro" }
  ],
  "2026-08-15": [
    { name: "Memorize", duration: "30m", technique: "52-17" }
  ],
  "2026-08-17": [
    { name: "Review", duration: "45m", technique: "Pomodoro" },
    { name: "Practice", duration: "1h 10m", technique: "90m" }
  ],
  "2026-08-18": [
    { name: "Reading", duration: "1h 45m", technique: "52-17" },
    { name: "Writing", duration: "2h 15m", technique: "90m" }
  ]
};

let currentCalDate = new Date(2026, 7, 1);

function renderCalendarGrid(targetGridId, monthYearLabelId) {
  const grid = document.getElementById(targetGridId);
  const label = document.getElementById(monthYearLabelId);
  if (!grid || !label) return;

  const year = currentCalDate.getFullYear();
  const month = currentCalDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  label.textContent = `${monthNames[month]} ${year}`;
  grid.innerHTML = "";

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const isCompact = targetGridId === "calendar-days-grid";

  for (let i = 0; i < firstDayIndex; i++) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = isCompact ? "h-full min-h-0" : "min-h-[40px] sm:min-h-[48px]";
    grid.appendChild(emptyDiv);
  }

  for (let day = 1; day <= totalDays; day++) {
    const formattedMonth = String(month + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateKey = `${year}-${formattedMonth}-${formattedDay}`;

    const dayActivities = userActivities[dateKey] || [];
    const hasActivity = dayActivities.length > 0;

    const today = new Date();
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    const bgStyles = isToday
      ? "bg-[#E87339] text-[#FEF4E0] border-[1.5px] border-[#3D2013]"
      : "bg-[#FEF4E0] hover:bg-[#FDE4D0] text-[#3D2013]";

    const dayCell = document.createElement("div");
    dayCell.className = `relative flex flex-col items-center justify-center p-1 rounded-[6px] ${bgStyles} transition-all cursor-pointer min-h-[40px] sm:min-h-[48px] group cal-day-cell`;

    const dayNum = document.createElement("span");
    dayNum.className = `font-pressstart text-[9px] sm:text-[11px] ${
      isToday ? "text-[#FEF4E0]" : "text-[#3D2013]"
    }`;
    dayNum.textContent = day;
    dayCell.appendChild(dayNum);

    if (hasActivity) {
      const indicator = document.createElement("span");
      indicator.className = `w-2 h-2 sm:w-2.5 sm:h-2.5 ${
        isToday ? "text-[#FEF4E0]" : "bg-[#E87339]"
      } border-[1px] border-[#3D2013] rounded-full mt-1 shrink-0`;
      dayCell.appendChild(indicator);

      const isTopRow = day + firstDayIndex <= 7;
      const colIndex = (day + firstDayIndex - 1) % 7;
      const isLeftEdge = colIndex <= 1;
      const isRightEdge = colIndex >= 5;

      const verticalPos = isTopRow ? "top-full mt-2" : "bottom-full mb-2";

      let horizontalPos = "left-1/2 -translate-x-1/2";
      let arrowHorizontal = "left-1/2 -translate-x-1/2";

      if (isLeftEdge) {
        horizontalPos = "left-0 -translate-x-1 sm:translate-x-0";
        arrowHorizontal = "left-4";
      } else if (isRightEdge) {
        horizontalPos = "right-0 translate-x-1 sm:translate-x-0";
        arrowHorizontal = "right-4";
      }

      const arrowVertical = isTopRow
        ? "bottom-full border-b-4 border-b-[#3D2013]"
        : "top-full border-t-4 border-t-[#3D2013]";

      const arrowPos = `${arrowVertical} ${arrowHorizontal} border-x-4 border-x-transparent`;

      const popover = document.createElement("div");
      popover.className = `cal-popover absolute ${verticalPos} ${horizontalPos} hidden sm:group-hover:flex flex-col gap-1.5 w-40 sm:w-48 bg-[#FEF4E0] border-[2px] border-[#3D2013] rounded-[8px] p-2 shadow-xl z-50 pointer-events-none transition-all`;

      let popoverHtml = "";
      dayActivities.forEach((act, index) => {
        const isLast = index === dayActivities.length - 1;
        popoverHtml += `
          <div class="flex flex-col gap-0.5 ${!isLast ? "border-b border-[#3D2013]/20 pb-1.5" : ""}">
            <span class="font-pressstart text-[8px] sm:text-[9px] text-[#E87339] font-bold truncate">
              ${act.name}
            </span>
            <div class="flex items-center justify-between font-pressstart text-[6px] sm:text-[7px] text-[#3D2013]/80">
              <span>${act.duration}</span>
              <span class="bg-[#3D2013]/10 px-1 py-0.5 rounded text-[#3D2013]">${act.technique}</span>
            </div>
          </div>
        `;
      });

      popoverHtml += `<div class="absolute ${arrowPos}"></div>`;
      popover.innerHTML = popoverHtml;
      dayCell.appendChild(popover);

      dayCell.addEventListener("click", (e) => {
        const isTouchDevice = window.matchMedia("(hover: none)").matches || window.innerWidth < 640;
        
        if (isTouchDevice) {
          e.stopPropagation();
          const isCurrentlyVisible = popover.classList.contains("flex");

          document.querySelectorAll(".cal-popover").forEach((p) => {
            p.classList.remove("flex");
            p.classList.add("hidden");
            p.parentElement.classList.remove("z-50");
          });

          if (!isCurrentlyVisible) {
            popover.classList.remove("hidden");
            popover.classList.add("flex");
            dayCell.classList.add("z-50");
          }
        }
      });
    }

    grid.appendChild(dayCell);
  }
}

function updateAllCalendars() {
  renderCalendarGrid("calendar-days-grid", "cal-month-year");
  renderCalendarGrid("modal-calendar-days-grid", "modal-cal-month-year");
}

document.addEventListener("click", () => {
  document.querySelectorAll(".cal-popover").forEach((p) => {
    p.classList.remove("flex");
    p.classList.add("hidden");
    p.parentElement.classList.remove("z-50");
  });
});