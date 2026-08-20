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

// --- MOCK ROOM DATA & CHAT ---
const roomAuditLogsData = [
  { pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Shadow", username: "ACORN_HERO", activity: "Completed a 25m Focus Session", time: "2m ago" },
  { pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=CodeWizard", username: "CodeWizard", activity: "Finished task: Fix API Route", time: "8m ago" },
  { pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=PixelArtist", username: "PixelArtist", activity: "Started Break Phase", time: "14m ago" },
  { pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=CodeWizard", username: "CodeWizard", activity: "Joined the room", time: "22m ago" },
  { pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=PixelArtist", username: "PixelArtist", activity: "Joined the room", time: "30m ago" }
];

let roomChatMessages = [
  { username: "CodeWizard", pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=CodeWizard", text: "Welcome everyone! Ready to focus?", time: "10:14 AM" },
  { username: "PixelArtist", pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=PixelArtist", text: "Working on UI sprites today 🎨", time: "10:15 AM" }
];

const mockDemoRoomData = {
  name: "Cozy Coding Sanctuary",
  code: "CCC482",
  host: (typeof playerData !== "undefined" && playerData.username) ? playerData.username : "ACORN_HERO",
  privacy: "PUBLIC",
  currentMembers: 6,
  maxMembers: 6,
  members: [
    { username: (typeof playerData !== "undefined" && playerData.username) ? playerData.username : "ACORN_HERO", isHost: true, status: "in session", pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Shadow" },
    { username: "PIXEL_SAM", isHost: false, status: "in session", pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=PIXEL_SAM" },
    { username: "LOFI_LUNA", isHost: false, status: "online", pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=LOFI_LUNA" },
    { username: "STUDY_BEAR", isHost: false, status: "in session", pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=STUDY_BEAR" },
    { username: "COZY_CAT", isHost: false, status: "online", pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=COZY_CAT" },
    { username: "NIGHT_OWL", isHost: false, status: "in session", pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=NIGHT_OWL" }
  ]
};

// ==========================================
// --- MOCK MULTIPLAYER AVATAR DATA & SYSTEM ---
// ==========================================
const mockPlayerList = [
  { 
    id: 1, 
    name: "PIXEL_SAM", 
    level: 5,
    xp: 4200,
    positionClass: "left-[25%] bottom-[12%] md:bottom-[15%] lg:bottom-[18%]",
    config: { body: "BODY1", face: "FACE2", tops: "TOP3", bottoms: "BOTTOM2", hair: "HAIR1" }
  },
  { 
    id: 2, 
    name: "LOFI_LUNA", 
    level: 12,
    xp: 8750,
    positionClass: "left-[75%] bottom-[12%] md:bottom-[15%] lg:bottom-[18%]",
    config: { body: "BODY1", face: "FACE1", tops: "TOP5", bottoms: "BOTTOM4", hair: "HAIR3" }
  },
  { 
    id: 3, 
    name: "STUDY_BEAR", 
    level: 3,
    xp: 1500,
    positionClass: "left-[36%] bottom-[20%] md:bottom-[22%] lg:bottom-[28%]",
    config: { body: "BODY1", face: "FACE3", tops: "TOP1", bottoms: "BOTTOM1" }
  },
  { 
    id: 4, 
    name: "COZY_CAT",  
    level: 8,
    xp: 6300,
    positionClass: "left-[64%] bottom-[20%] md:bottom-[22%] lg:bottom-[28%]",
    config: { body: "BODY1", face: "FACE4", tops: "TOP2", bottoms: "BOTTOM3", hair: "HAIR2" }
  },
  { 
    id: 5, 
    name: "NIGHT_OWL", 
    level: 15,
    xp: 9900,
    positionClass: "left-[50%] bottom-[28%] md:bottom-[30%] lg:bottom-[36%]",
    config: { body: "BODY1", face: "FACE1", tops: "TOP4", bottoms: "BOTTOM6", hair: "HAIR4" }
  }
];

let selectedMockPlayerId = null;

window.setMockPlayerCount = function(count) {
  const container = document.getElementById("mock-avatars-container");
  if (!container) return;

  const clampedCount = Math.min(Math.max(parseInt(count, 10) || 0, 0), 5);
  container.innerHTML = "";

  for (let i = 0; i < clampedCount; i++) {
    const player = mockPlayerList[i];

    const avatarWrapper = document.createElement("div");
    avatarWrapper.id = `mock-player-${player.id}`;
    avatarWrapper.className = `absolute w-[140px] h-[140px] md:w-[180px] md:h-[180px] lg:w-[200px] lg:h-[200px] -translate-x-1/2 origin-bottom pointer-events-auto cursor-pointer ${player.positionClass}`;

    avatarWrapper.onclick = (e) => {
      e.stopPropagation();
      openMockPlayerModal(player.id);
    };

    const configString = JSON.stringify(player.config).replace(/"/g, '&quot;');

    avatarWrapper.innerHTML = `
      <!-- NAME TAG -->
      <div class="absolute top-4 sm:top-2 left-1/2 -translate-x-1/2 bg-[#000000]/30 px-2 py-0.5 whitespace-nowrap rounded-[4px] shadow-md pointer-events-none flex items-center justify-center z-10">
        <span class="font-pressstart text-[6px] sm:text-[8px] text-[#FFFFFF] leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          ${player.name}
        </span>
      </div>
      <custom-avatar config="${configString}" state="idle"></custom-avatar>
    `;

    container.appendChild(avatarWrapper);
  }
};

window.openMockPlayerModal = function(playerId) {
  ensureMockPlayerModalExists();
  const player = mockPlayerList.find(p => p.id === playerId);
  if (!player) return;

  selectedMockPlayerId = playerId;

  const modalName = document.getElementById("mock-modal-player-name");
  const modalLevel = document.getElementById("mock-modal-player-level");
  const modalXpText = document.getElementById("mock-modal-xp-text");
  const modalXpBar = document.getElementById("mock-modal-xp-bar-fill");

  if (modalName) modalName.textContent = player.name;
  if (modalLevel) modalLevel.textContent = `LVL ${player.level}`;
  
  const maxXp = 10000;
  const xpPercent = Math.min(Math.max((player.xp / maxXp) * 100, 0), 100);
  
  if (modalXpText) modalXpText.textContent = `${player.xp.toLocaleString()} / ${maxXp.toLocaleString()} XP`;
  if (modalXpBar) modalXpBar.style.width = `${xpPercent}%`;

  openModal("mock-player-modal");
};

window.kickMockPlayer = function() {
  if (selectedMockPlayerId === null) return;

  const playerElem = document.getElementById(`mock-player-${selectedMockPlayerId}`);
  if (playerElem) {
    playerElem.remove();
  }

  closeModal("mock-player-modal");
  selectedMockPlayerId = null;
};

function ensureMockPlayerModalExists() {
  if (document.getElementById("mock-player-modal")) return;

  const modal = document.createElement("div");
  modal.id = "mock-player-modal";
  modal.className = "fixed inset-0 bg-[#3D2013]/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4";
  modal.innerHTML = `
    <div class="w-full max-w-sm bg-[#FEF4E0] border-[2px] border-[#3D2013] rounded-[12px] p-5 flex flex-col gap-4 shadow-2xl relative">
      <div class="flex items-center justify-between pb-2 border-b-[2px] border-[#3D2013]/20">
        <h3 id="mock-modal-player-name" class="font-pressstart text-[12px] sm:text-[14px] text-[#3D2013] uppercase truncate">PLAYER</h3>
        <span id="mock-modal-player-level" class="font-pressstart text-[9px] bg-[#E87339] text-[#FEF4E0] px-2 py-0.5 rounded border border-[#3D2013]">LVL 1</span>
      </div>

      <div class="flex flex-col gap-1.5">
        <div class="flex justify-between font-pressstart text-[8px] text-[#3D2013]">
          <span>XP PROGRESS</span>
          <span id="mock-modal-xp-text">0 / 10000 XP</span>
        </div>
        <div class="w-full h-3 bg-[#FAE9CE] border-[1.5px] border-[#3D2013] rounded-full overflow-hidden p-0.5">
          <div id="mock-modal-xp-bar-fill" class="h-full bg-[#E87339] rounded-full transition-all duration-300" style="width: 0%"></div>
        </div>
      </div>

      <div class="flex gap-2 pt-2 border-t-[1.5px] border-[#3D2013]/20">
        <button onclick="kickMockPlayer()" class="flex-1 font-pressstart text-[9px] text-[#FEF4E0] bg-[#A53914] border-[1.5px] border-[#3D2013] py-2 rounded-[6px] hover:bg-[#832c0f] cursor-pointer transition-colors uppercase">
          KICK PLAYER
        </button>
        <button onclick="closeModal('mock-player-modal')" class="flex-1 font-pressstart text-[9px] text-[#3D2013] bg-[#FAE9CE] border-[1.5px] border-[#3D2013] py-2 rounded-[6px] hover:bg-[#f3dcba] cursor-pointer transition-colors uppercase">
          CLOSE
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// --- GLOBAL APP STATE MANAGER ---
let currentHomepageState = "ROOM"; // "SOLO" | "ROOM"
let activeRoomData = null;
let currentTab = "all-time";

// --- TIMER & SESSION GLOBAL STATE ---
let timerInterval = null;
let isTimerRunning = false;
let isFocusPhase = true;
let currentSessionCount = 0;
let totalSessions = 1;
let focusDurationSec = 25 * 60;
let breakDurationSec = 5 * 60;
let remainingTimeSec = 25 * 60;
let sessionTasksList = [];

// DOM Backups for resets
let defaultActiveSessionHTML = "";
let defaultRecentActivityHTML = "";
let defaultMiddleLeaderboardHTML = "";
let defaultCalendarHTML = "";

// --- INITIALIZER ---
document.addEventListener("DOMContentLoaded", () => {
  const activeCard = document.getElementById("active-session-card");
  const recentCard = document.getElementById("recent-activity-card");
  const leaderboardSection = document.getElementById("middle-leaderboard-section");
  const calendarSection = document.getElementById("calendar-section");

  if (activeCard) defaultActiveSessionHTML = activeCard.innerHTML;
  if (recentCard) defaultRecentActivityHTML = recentCard.innerHTML;
  if (leaderboardSection) defaultMiddleLeaderboardHTML = leaderboardSection.innerHTML;
  if (calendarSection) defaultCalendarHTML = calendarSection.innerHTML;

  updateAvatarNametag();
  updateStreakDisplay();
  updateGreetingAndDate();
  renderRecentActivities();
  renderActiveSession();
  switchTab("all-time");
  updateAllCalendars();
  updateFocusTimeDisplay();

  // Calendar controls
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
  document.getElementById("cal-fullscreen-btn")?.addEventListener("click", () => modalOverlay?.classList.remove("hidden"));
  document.getElementById("cal-minimize-btn")?.addEventListener("click", () => modalOverlay?.classList.add("hidden"));
  modalOverlay?.addEventListener("click", (e) => { if (e.target === modalOverlay) modalOverlay.classList.add("hidden"); });

  initHomepageState();
});

// ==========================================
// --- HOMEPAGE STATE MANAGER (SOLO / ROOM) ---
// ==========================================

function initHomepageState() {
  if (currentHomepageState === "ROOM") {
    let roomData = mockDemoRoomData;
    const savedRoomData = localStorage.getItem("activeRoomSession");
    
    if (savedRoomData) {
      try {
        roomData = JSON.parse(savedRoomData);
      } catch (e) {
        console.error("Error parsing saved room session:", e);
        localStorage.removeItem("activeRoomSession");
      }
    }
    
    setHomepageState("ROOM", roomData);
  } else {
    setHomepageState("SOLO");
  }
}

window.switchHomepageState = function(state, roomData = null) {
  setHomepageState(state, roomData);
};

function setHomepageState(state, roomData = null) {
  currentHomepageState = state;

  const sidebarContainer = document.getElementById("sidebar-container");
  const mainWrapper = document.getElementById("main-wrapper");

  if (state === "ROOM") {
    activeRoomData = roomData || mockDemoRoomData;

    // Ensure member count is valid
    const totalMembers = activeRoomData.currentMembers || 1;

    // Build mock members array for sidebar list if not present
    if (!activeRoomData.members || activeRoomData.members.length === 0) {
      const myUsername = (typeof playerData !== "undefined" && playerData.username) ? playerData.username : "ACORN_HERO";
      const isHost = activeRoomData.host === myUsername;

      const members = [
        { username: myUsername, isHost: isHost, status: "in session", pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=" + myUsername }
      ];

      const mockPool = ["PIXEL_SAM", "LOFI_LUNA", "STUDY_BEAR", "COZY_CAT", "NIGHT_OWL"];
      for (let i = 0; i < Math.max(0, totalMembers - 1); i++) {
        const name = mockPool[i % mockPool.length];
        members.push({
          username: name,
          isHost: false,
          status: i % 2 === 0 ? "in session" : "online",
          pfp: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${name}`
        });
      }
      activeRoomData.members = members;
    }

    localStorage.setItem("activeRoomSession", JSON.stringify(activeRoomData));

    // 1. Hide Sidebar Container & adjust wrapper layout
    if (sidebarContainer) sidebarContainer.style.display = "none";
    if (mainWrapper) {
      mainWrapper.classList.remove("pl-0", "md:pl-64");
      mainWrapper.classList.add("pl-0");
    }

    // 2. Transform Header
    transformHeaderToRoomState();

    // 3. Header Texts
    inflateRoomHeaderTexts(activeRoomData);

    // 4. Container Replacements
    if (localStorage.getItem("activeSession")) {
      inflateTasksCardUI();
    } else {
      inflateRoomActivityCardUI(activeRoomData);
    }
    inflateRoomPlayersSectionUI(activeRoomData);
    inflateRoomChatSectionUI(activeRoomData);

    // 5. Render Mock Avatars based on currentMembers in room
    // totalMembers - 1 mock avatars are rendered (since 1 avatar is the user)
    const mockCount = Math.max(0, totalMembers - 1);
    setMockPlayerCount(mockCount);

  } else {
    // SOLO STATE
    activeRoomData = null;
    localStorage.removeItem("activeRoomSession");

    // Clear mock avatars when switching back to SOLO
    setMockPlayerCount(0);

    // 1. Restore Sidebar & wrapper padding
    if (sidebarContainer) sidebarContainer.style.display = "";
    if (mainWrapper) {
      mainWrapper.classList.remove("pl-0");
      mainWrapper.classList.add("pl-0", "md:pl-64");
    }

    // 2. Restore Header
    restoreHeaderToSoloState();

    // 3. Reset greeting and date
    updateGreetingAndDate();

    // 4. Restore Solo Container UI
    const leaderboardSection = document.getElementById("middle-leaderboard-section");
    const calendarSection = document.getElementById("calendar-section");
    const recentCard = document.getElementById("recent-activity-card");

    if (leaderboardSection && defaultMiddleLeaderboardHTML) {
      leaderboardSection.innerHTML = defaultMiddleLeaderboardHTML;
      switchTab(currentTab);
    }

    if (calendarSection && defaultCalendarHTML) {
      calendarSection.innerHTML = defaultCalendarHTML;
      updateAllCalendars();
    }

    if (localStorage.getItem("activeSession")) {
      inflateTasksCardUI();
    } else if (recentCard) {
      recentCard.innerHTML = defaultRecentActivityHTML;
      renderRecentActivities();
    }
  }
}

// --- DYNAMIC HEADER BUTTON TOGGLES ---
function transformHeaderToRoomState() {
  const headerContainer = document.getElementById("header-container");
  if (!headerContainer) return;

  const signOutBtn = headerContainer.querySelector('button[onclick*="logout-modal"]');
  if (signOutBtn) {
    signOutBtn.outerHTML = `
      <button id="leave-room-btn" onclick="leaveRoomSession()" title="Leave Room"
              class="h-8 sm:h-11 bg-[#A53914] border-[2px] sm:border-[2px] border-[#3D2013] px-1.5 sm:px-3 rounded-[8px] sm:rounded-[10px] flex items-center justify-center gap-1 sm:gap-2 transition-all duration-150 retro-shadow shrink-0 cursor-pointer hover:bg-[#832c0f]">
        <svg class="w-3.5 h-3.5 sm:w-6 sm:h-6 text-[#FEF4E0]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        <span class="font-pressstart text-[8px] sm:text-[11px] text-[#FEF4E0] hidden sm:inline">LEAVE ROOM</span>
      </button>
    `;
  }
}

function restoreHeaderToSoloState() {
  const headerContainer = document.getElementById("header-container");
  if (!headerContainer) return;

  const leaveRoomBtn = document.getElementById("leave-room-btn");
  if (leaveRoomBtn) {
    leaveRoomBtn.outerHTML = `
      <button onclick="openModal('logout-modal')" title="Logout"
              class="h-8 sm:h-11 bg-[#A53914] border-[2px] sm:border-[2px] border-[#3D2013] px-1.5 sm:px-3 rounded-[8px] sm:rounded-[10px] flex items-center justify-center gap-1 sm:gap-2 transition-all duration-150 retro-shadow shrink-0 cursor-pointer hover:bg-[#832c0f]">
        <svg class="w-3.5 h-3.5 sm:w-6 sm:h-6 text-[#FEF4E0]" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path fill="currentColor" d="M9 20.75H6a2.64 2.64 0 0 1-2.75-2.53V5.78A2.64 2.64 0 0 1 6 3.25h3a.75.75 0 0 1 0 1.5H6a1.16 1.16 0 0 0-1.25 1v12.47a1.16 1.16 0 0 0 1.25 1h3a.75.75 0 0 1 0 1.5Zm7-4a.74.74 0 0 1-.53-.22a.75.75 0 1 1 0-1.06L18.94 12l-3.47-3.47a.75.75 0 1 1 1.06-1.06l4 4a.75.75 0 0 1 0 1.06l-4 4a.74.74 0 0 1-.53.22" />
          <path fill="currentColor" d="M20 12.75H9a.75.75 0 0 1 0-1.5h11a.75.75 0 0 1 0 1.5" />
        </svg>
        <span class="font-pressstart text-[8px] sm:text-[11px] text-[#FEF4E0] hidden sm:inline">SIGN OUT</span>
      </button>
    `;
  }
}

window.leaveRoomSession = function() {
  if (confirm("Are you sure you want to leave this study room?")) {
    setHomepageState("SOLO");
  }
};

// --- ROOM INFLATION HELPERS ---
function inflateRoomHeaderTexts(room) {
  const userGreetingEl = document.getElementById("user-greeting");
  const currentDateTextEl = document.getElementById("current-date-text");

  if (userGreetingEl) {
    userGreetingEl.textContent = room.name.toUpperCase();
  }

  if (currentDateTextEl) {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    currentDateTextEl.textContent = `${formattedDate} | ${room.currentMembers}/${room.maxMembers} Members | ${room.privacy.toUpperCase()}`;
  }
}

// 1. RECENT ACTIVITY CARD -> ROOM ACTIVITY AUDIT LOGS
function inflateRoomActivityCardUI(room) {
  const recentCard = document.getElementById("recent-activity-card");
  if (!recentCard) return;

  const top3Logs = roomAuditLogsData.slice(0, 3);

  recentCard.innerHTML = `
    <div class="flex flex-col gap-3 h-full">
      <div class="flex items-center justify-between pb-2">
        <h3 class="font-pressstart text-[12px] sm:text-[14px] text-[#3D2013] uppercase">ROOM ACTIVITY</h3>
        <button onclick="openRecentActivitiesModal()" class="text-[#3D2013] hover:text-[#EA781C] font-pressstart text-[8px] sm:text-[9px] px-2.5 py-1.5 rounded-[6px] transition-colors cursor-pointer uppercase">
          VIEW ALL
        </button>
      </div>

      <div class="border-t-[2px] border-[#3D2013]/20"></div>

      <div class="flex flex-col gap-2 overflow-y-auto max-h-[220px]">
        ${top3Logs.map(log => `
          <div class="flex items-center justify-between p-2 rounded-[8px] bg-[#FAE9CE]/60 border border-[#3D2013]/20 hover:bg-[#FAE9CE] transition-colors">
            <div class="flex items-center gap-2.5 min-w-0 flex-1">
              <img src="${log.pfp}" alt="${log.username}" class="w-8 h-8 rounded-full border border-[#3D2013] bg-[#FEF4E0] shrink-0" />
              <div class="flex flex-col min-w-0">
                <span class="font-pressstart text-[9px] text-[#3D2013] truncate">${log.username}</span>
                <span class="font-pressstart text-[8px] text-[#3D2013]/70 truncate mt-0.5">${log.activity}</span>
              </div>
            </div>
            <div class="shrink-0 pl-2">
              <span class="font-pixel text-[14px] text-[#3D2013]/60">${log.time}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// 2. MIDDLE LEADERBOARD SECTION -> MEMBERS
function inflateRoomPlayersSectionUI(room) {
  const middleSection = document.getElementById("middle-leaderboard-section");
  if (!middleSection) return;

  const currentUsername = (typeof playerData !== "undefined" && playerData.username) ? playerData.username : "ACORN_HERO";
  const membersList = room.members || [];

  middleSection.innerHTML = `
    <div class="flex flex-col gap-3 h-full">
      <div class="flex items-center justify-between pb-2 border-b-[2px] border-[#3D2013]/20">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-[#E16F37] shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <h3 class="font-pressstart text-[11px] sm:text-[13px] text-[#3D2013] uppercase">ROOM MEMBERS (${membersList.length}/${room.maxMembers || 6})</h3>
        </div>
      </div>

      <div class="flex flex-col gap-2 overflow-y-auto max-h-[280px] pr-1">
        ${membersList.map(p => {
          const isYou = p.username === currentUsername;
          const isInSession = p.status === "in session";

          return `
            <div class="flex items-center justify-between p-2 rounded-[8px] ${isYou ? 'bg-[#C97845]/40 border-[1.5px] border-[#3D2013]' : 'bg-[#FAE9CE]/50 border border-[#3D2013]/20'}">
              <div class="flex items-center gap-2.5 min-w-0">
                <img src="${p.pfp || 'https://api.dicebear.com/7.x/pixel-art/svg?seed=' + p.username}" class="w-7 h-7 rounded-full border border-[#3D2013] bg-[#FEF4E0] shrink-0" />
                <div class="flex flex-col min-w-0">
                  <span class="font-pressstart text-[9px] text-[#3D2013] truncate flex items-center gap-1">
                    ${p.username}
                    ${isYou ? '<span class="text-[7px] text-[#E87339]">(YOU)</span>' : ''}
                    ${p.isHost ? '<span class="text-[6px] bg-[#E87339] text-[#FEF4E0] px-1 py-0.2 rounded uppercase">HOST</span>' : ''}
                  </span>
                </div>
              </div>

              <div class="shrink-0 pl-2">
                <span class="font-pressstart text-[7px] px-2 py-1 rounded border border-[#3D2013]/30 uppercase ${isInSession ? 'bg-[#E87339] text-[#FEF4E0]' : 'bg-[#76A853] text-[#FEF4E0]'}">
                  ${p.status || 'online'}
                </span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// 3. CALENDAR SECTION -> ROOM CHAT
function inflateRoomChatSectionUI(room) {
  const calendarSection = document.getElementById("calendar-section");
  if (!calendarSection) return;

  calendarSection.innerHTML = `
    <div class="flex flex-col gap-2 h-full justify-between relative">
      <div class="flex items-center justify-between pb-2 border-b-[2px] border-[#3D2013]/20 shrink-0">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-[#3D2013]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
          <h3 class="font-pressstart text-[11px] sm:text-[13px] text-[#3D2013] uppercase">ROOM CHAT</h3>
        </div>
        <button onclick="openRoomChatModal()" title="Full Screen Chat" class="p-1 sm:p-1.5 rounded-[6px] text-[#3D2013] hover:bg-[#FDE4D0] hover:text-[#E87339] transition-all cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" class="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20H4v-5m0 5l6.5-6.5M15 4h5v5m0-5l-6.5 6.5" />
          </svg>
        </button>
      </div>

      <div class="relative flex-1 min-h-0">
        <div id="room-chat-messages" class="flex flex-col gap-2 overflow-y-auto max-h-[200px] h-full p-2 bg-[#FAE9CE]/40 border border-[#3D2013]/20 rounded-[8px]">
          ${roomChatMessages.map(msg => renderChatMessageHTML(msg)).join('')}
        </div>

        <button id="room-scroll-bottom-btn" onclick="scrollRoomChatToBottom()" class="hidden absolute bottom-2 right-2 bg-[#E87339] text-[#FEF4E0] border-[2px] border-[#3D2013] p-1.5 rounded-full shadow-md hover:bg-[#d0622c] cursor-pointer transition-opacity duration-200 z-10" title="Scroll to bottom">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
      </div>

      <div id="room-picker-wrapper" class="hidden absolute bottom-14 left-0 z-50 transition-all duration-200 scale-95 opacity-0 origin-bottom-left max-w-[calc(100%-24px)]">
        <emoji-picker class="light shadow-2xl border-[2px] border-[#3D2013] rounded-xl overflow-hidden text-xs max-h-56"></emoji-picker>
      </div>

      <form onsubmit="sendRoomChatMessage(event, 'room-chat-input')" class="flex gap-2 items-center pt-1">
        <div class="flex-1 flex items-center bg-[#FEF4E0] border-[2px] border-[#3D2013] rounded-[8px] px-2.5 py-1">
          <input id="room-chat-input" type="text" placeholder="Type a message..." required class="flex-1 bg-transparent font-pixel text-[15px] text-[#3D2013] focus:outline-none min-w-0 placeholder-[#3D2013]/50" />
          <button type="button" id="room-emoji-trigger" onclick="toggleRoomEmojiPicker(event)" class="text-sm cursor-pointer hover:scale-110 transition active:scale-95 ml-1 select-none shrink-0" title="Add Emoji">😀</button>
        </div>
        <button type="submit" class="bg-[#E87339] text-[#FEF4E0] border-[2px] border-[#3D2013] px-3 py-2 rounded-[8px] font-pressstart hover:bg-[#d0622c] cursor-pointer shrink-0 flex items-center justify-center transition-colors" aria-label="Send">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path fill="currentColor" d="M3 20v-6l8-2l-8-2V4l19 8z" />
          </svg>
        </button>
      </form>
    </div>
  `;

  setupRoomChatEvents();
  ensureRoomChatModalExists();
}

function renderChatMessageHTML(msg) {
  const currentUsername = (typeof playerData !== "undefined" && playerData.username) ? playerData.username : "ACORN_HERO";
  const isMe = msg.username === currentUsername;

  if (isMe) {
    return `
      <div class="flex items-start gap-2 p-2 rounded-[6px] bg-[#FAE9CE] text-[#3D2013] border-[1.5px] border-[#3D2013] self-end max-w-[85%] min-w-0 flex-row-reverse">
        <img src="${msg.pfp}" class="w-6 h-6 rounded-full border border-[#3D2013] object-cover bg-[#FEF4E0] shrink-0" />
        <div class="flex flex-col min-w-0 items-end flex-1">
          <div class="flex items-center gap-1.5 flex-row-reverse">
            <span class="font-pressstart text-[8px] text-[#E87339] shrink-0">YOU</span>
            <span class="font-pixel text-[11px] text-[#3D2013]/60 shrink-0">${msg.time}</span>
          </div>
          <span class="font-pixel text-[15px] text-[#3D2013] mt-0.5 break-words break-all [overflow-wrap:anywhere] text-right leading-tight max-w-full">${msg.text}</span>
        </div>
      </div>
    `;
  }

  return `
    <div class="flex items-start gap-2 p-2 rounded-[6px] bg-[#E87339] text-[#FEF4E0] border-[1.5px] border-[#3D2013] max-w-[85%] min-w-0 self-start">
      <img src="${msg.pfp}" class="w-6 h-6 rounded-full border border-[#3D2013] object-cover bg-[#FEF4E0] shrink-0" />
      <div class="flex flex-col min-w-0 flex-1">
        <div class="flex items-center gap-1.5">
          <span class="font-pressstart text-[8px] text-[#FEF4E0] font-bold truncate">${msg.username}</span>
          <span class="font-pixel text-[11px] text-[#FEF4E0]/80 shrink-0">${msg.time}</span>
        </div>
        <span class="font-pixel text-[15px] text-[#FEF4E0] mt-0.5 break-words break-all [overflow-wrap:anywhere] leading-tight max-w-full">${msg.text}</span>
      </div>
    </div>
  `;
}

window.sendRoomChatMessage = function(e, inputId = "room-chat-input") {
  if (e) e.preventDefault();
  const input = document.getElementById(inputId);
  if (!input || !input.value.trim()) return;

  const currentUsername = (typeof playerData !== "undefined" && playerData.username) ? playerData.username : "ACORN_HERO";
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newMsg = {
    username: currentUsername,
    pfp: "https://api.dicebear.com/7.x/pixel-art/svg?seed=" + currentUsername,
    text: input.value.trim(),
    time: timeStr
  };

  roomChatMessages.push(newMsg);
  input.value = "";

  closeRoomEmojiPicker();
  closeModalRoomEmojiPicker();

  const chatContainer = document.getElementById("room-chat-messages");
  if (chatContainer) {
    chatContainer.innerHTML = roomChatMessages.map(msg => renderChatMessageHTML(msg)).join('');
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  const modalChatContainer = document.getElementById("modal-room-chat-messages");
  if (modalChatContainer) {
    modalChatContainer.innerHTML = roomChatMessages.map(msg => renderChatMessageHTML(msg)).join('');
    modalChatContainer.scrollTop = modalChatContainer.scrollHeight;
  }
};

function setupRoomChatEvents() {
  const chatContainer = document.getElementById("room-chat-messages");
  const scrollBottomBtn = document.getElementById("room-scroll-bottom-btn");
  const wrapper = document.getElementById("room-picker-wrapper");
  const picker = wrapper ? wrapper.querySelector("emoji-picker") : null;
  const input = document.getElementById("room-chat-input");

  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight;

    if (scrollBottomBtn) {
      chatContainer.addEventListener("scroll", () => {
        const distanceFromBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight;
        if (distanceFromBottom > 30) {
          scrollBottomBtn.classList.remove("hidden");
        } else {
          scrollBottomBtn.classList.add("hidden");
        }
      });
    }
  }

  if (picker && input) {
    picker.addEventListener("emoji-click", (event) => {
      const emoji = event.detail.unicode;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const text = input.value;

      input.value = text.substring(0, start) + emoji + text.substring(end);
      input.focus();
      const nextPos = start + emoji.length;
      input.setSelectionRange(nextPos, nextPos);
    });
  }
}

window.toggleRoomEmojiPicker = function(e) {
  if (e) e.stopPropagation();
  const wrapper = document.getElementById("room-picker-wrapper");
  const input = document.getElementById("room-chat-input");
  if (!wrapper) return;

  if (window.innerWidth < 640 && input) {
    input.focus();
    return;
  }

  const isHidden = wrapper.classList.contains("hidden");
  if (isHidden) {
    wrapper.classList.remove("hidden");
    void wrapper.offsetHeight;
    wrapper.classList.remove("scale-95", "opacity-0");
    wrapper.classList.add("scale-100", "opacity-100");
  } else {
    closeRoomEmojiPicker();
  }
};

window.closeRoomEmojiPicker = function() {
  const wrapper = document.getElementById("room-picker-wrapper");
  if (!wrapper) return;
  wrapper.classList.remove("scale-100", "opacity-100");
  wrapper.classList.add("scale-95", "opacity-0");
  setTimeout(() => wrapper.classList.add("hidden"), 200);
};

window.scrollRoomChatToBottom = function() {
  const chatContainer = document.getElementById("room-chat-messages");
  if (chatContainer) {
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
  }
};

function ensureRoomChatModalExists() {
  let modalOverlay = document.getElementById("room-chat-modal-overlay");
  if (modalOverlay) return;

  modalOverlay = document.createElement("div");
  modalOverlay.id = "room-chat-modal-overlay";
  modalOverlay.className = "fixed inset-0 bg-[#3D2013]/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-6 transition-all duration-300";

  modalOverlay.innerHTML = `
    <div class="w-full max-w-2xl h-[80vh] sm:h-[85vh] bg-[#FEF4E0] border-[2px] border-[#3D2013] rounded-[12px] p-4 flex flex-col justify-between gap-3 shadow-2xl relative">
      <div class="flex items-center justify-between pb-2 border-b-[2px] border-[#3D2013]/20 shrink-0">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-[#E87339]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
          <h3 class="font-pressstart text-[12px] sm:text-[14px] text-[#3D2013] uppercase">ROOM CHAT</h3>
        </div>
        <button onclick="closeRoomChatModal()" title="Close Full Screen" class="p-1.5 rounded-[6px] text-[#3D2013] hover:bg-[#FDE4D0] hover:text-[#E87339] transition-all cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" class="w-5 h-5" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path fill="currentColor" d="m10 15.4l-5.9 5.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7L8.6 14H5q-.425 0-.712-.288T4 13t.288-.712T5 12h6q.425 0 .713.288T12 13v6q0 .425-.288.713T11 20t-.712-.288T10 19zm5.4-5.4H19q.425 0 .713.288T20 11t-.288.713T19 12h-6q-.425 0-.712-.288T12 11V5q0-.425.288-.712T13 4t.713.288T14 5v3.6l5.9-5.9q.275-.275.7-.275t.7.275t.275.7t-.275.7z" />
          </svg>
        </button>
      </div>

      <div class="relative flex-1 min-h-0">
        <div id="modal-room-chat-messages" class="flex flex-col gap-2.5 overflow-y-auto h-full p-3 bg-[#FAE9CE]/40 border border-[#3D2013]/20 rounded-[8px]">
          ${roomChatMessages.map(msg => renderChatMessageHTML(msg)).join('')}
        </div>

        <button id="modal-room-scroll-bottom-btn" onclick="scrollModalRoomChatToBottom()" class="hidden absolute bottom-3 right-3 bg-[#E87339] text-[#FEF4E0] border-[2px] border-[#3D2013] p-1.5 rounded-full shadow-md hover:bg-[#d0622c] cursor-pointer transition-opacity duration-200 z-10" title="Scroll to bottom">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
      </div>

      <div id="modal-room-picker-wrapper" class="hidden absolute bottom-16 left-4 z-50 transition-all duration-200 scale-95 opacity-0 origin-bottom-left max-w-[calc(100%-32px)]">
        <emoji-picker class="light shadow-2xl border-[2px] border-[#3D2013] rounded-xl overflow-hidden text-xs max-h-60"></emoji-picker>
      </div>

      <form onsubmit="sendRoomChatMessage(event, 'modal-room-chat-input')" class="flex gap-2 items-center shrink-0">
        <div class="flex-1 flex items-center bg-[#FEF4E0] border-[2px] border-[#3D2013] rounded-[8px] px-3 py-1.5">
          <input id="modal-room-chat-input" type="text" placeholder="Type a message..." required class="flex-1 bg-transparent font-pixel text-[16px] text-[#3D2013] focus:outline-none min-w-0 placeholder-[#3D2013]/50" />
          <button type="button" id="modal-room-emoji-trigger" onclick="toggleModalRoomEmojiPicker(event)" class="text-base cursor-pointer hover:scale-110 transition active:scale-95 ml-1 select-none shrink-0" title="Add Emoji">😀</button>
        </div>
        <button type="submit" class="bg-[#E87339] text-[#FEF4E0] border-[2px] border-[#3D2013] px-4 py-2.5 rounded-[8px] font-pressstart hover:bg-[#d0622c] cursor-pointer shrink-0 flex items-center justify-center transition-colors" aria-label="Send">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path fill="currentColor" d="M3 20v-6l8-2l-8-2V4l19 8z" />
          </svg>
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeRoomChatModal();
  });

  setupModalRoomChatEvents();
}

window.openRoomChatModal = function() {
  ensureRoomChatModalExists();
  const modal = document.getElementById("room-chat-modal-overlay");
  const modalMessages = document.getElementById("modal-room-chat-messages");

  if (modal) {
    if (modalMessages) {
      modalMessages.innerHTML = roomChatMessages.map(msg => renderChatMessageHTML(msg)).join('');
      modalMessages.scrollTop = modalMessages.scrollHeight;
    }
    modal.classList.remove("hidden");
  }
};

window.closeRoomChatModal = function() {
  const modal = document.getElementById("room-chat-modal-overlay");
  if (modal) modal.classList.add("hidden");
  closeModalRoomEmojiPicker();
};

function setupModalRoomChatEvents() {
  const chatContainer = document.getElementById("modal-room-chat-messages");
  const scrollBottomBtn = document.getElementById("modal-room-scroll-bottom-btn");
  const wrapper = document.getElementById("modal-room-picker-wrapper");
  const picker = wrapper ? wrapper.querySelector("emoji-picker") : null;
  const input = document.getElementById("modal-room-chat-input");

  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight;

    if (scrollBottomBtn) {
      chatContainer.addEventListener("scroll", () => {
        const distanceFromBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight;
        if (distanceFromBottom > 30) {
          scrollBottomBtn.classList.remove("hidden");
        } else {
          scrollBottomBtn.classList.add("hidden");
        }
      });
    }
  }

  if (picker && input) {
    picker.addEventListener("emoji-click", (event) => {
      const emoji = event.detail.unicode;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const text = input.value;

      input.value = text.substring(0, start) + emoji + text.substring(end);
      input.focus();
      const nextPos = start + emoji.length;
      input.setSelectionRange(nextPos, nextPos);
    });
  }
}

window.toggleModalRoomEmojiPicker = function(e) {
  if (e) e.stopPropagation();
  const wrapper = document.getElementById("modal-room-picker-wrapper");
  const input = document.getElementById("modal-room-chat-input");
  if (!wrapper) return;

  if (window.innerWidth < 640 && input) {
    input.focus();
    return;
  }

  const isHidden = wrapper.classList.contains("hidden");
  if (isHidden) {
    wrapper.classList.remove("hidden");
    void wrapper.offsetHeight;
    wrapper.classList.remove("scale-95", "opacity-0");
    wrapper.classList.add("scale-100", "opacity-100");
  } else {
    closeModalRoomEmojiPicker();
  }
};

window.closeModalRoomEmojiPicker = function() {
  const wrapper = document.getElementById("modal-room-picker-wrapper");
  if (!wrapper) return;
  wrapper.classList.remove("scale-100", "opacity-100");
  wrapper.classList.add("scale-95", "opacity-0");
  setTimeout(() => wrapper.classList.add("hidden"), 200);
};

window.scrollModalRoomChatToBottom = function() {
  const chatContainer = document.getElementById("modal-room-chat-messages");
  if (chatContainer) {
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
  }
};

document.addEventListener("click", (event) => {
  const cardWrapper = document.getElementById("room-picker-wrapper");
  const cardTrigger = document.getElementById("room-emoji-trigger");
  if (cardWrapper && !cardWrapper.contains(event.target) && event.target !== cardTrigger) {
    closeRoomEmojiPicker();
  }

  const modalWrapper = document.getElementById("modal-room-picker-wrapper");
  const modalTrigger = document.getElementById("modal-room-emoji-trigger");
  if (modalWrapper && !modalWrapper.contains(event.target) && event.target !== modalTrigger) {
    closeModalRoomEmojiPicker();
  }
});

// --- USER & GREETING LOGIC ---
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
  if (!modalContainer) return;

  if (currentHomepageState === "ROOM") {
    modalContainer.innerHTML = roomAuditLogsData.map((item) => `
      <div class="flex items-center justify-between p-2 rounded-[8px] bg-[#FAE9CE]/60 border border-[#3D2013]/20">
        <div class="flex items-center gap-2.5 min-w-0 flex-1">
          <img src="${item.pfp}" alt="${item.username}" class="w-8 h-8 rounded border border-[#3D2013] bg-[#FEF4E0] shrink-0" />
          <div class="flex flex-col min-w-0">
            <span class="font-pressstart text-[9px] text-[#3D2013] truncate">${item.username}</span>
            <span class="font-pressstart text-[8px] text-[#3D2013]/70 truncate mt-0.5">${item.activity}</span>
          </div>
        </div>
        <div class="shrink-0 pl-2">
          <span class="font-pixel text-[14px] text-[#3D2013]/60">${item.time}</span>
        </div>
      </div>
    `).join("");
  } else {
    modalContainer.innerHTML = recentActivitiesData
      .map((item) => renderActivityItemHtml(item))
      .join("");
  }

  openModal("recent-activities-modal");
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("hidden");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("hidden");
}

// --- ACTIVE SESSION & TIMER SYSTEM ---
function renderActiveSession() {
  const savedSessionData = localStorage.getItem("activeSession");
  if (!savedSessionData) return;

  try {
    const session = JSON.parse(savedSessionData);
    const activeCard = document.getElementById("active-session-card");
    if (!activeCard) return;

    totalSessions = parseInt(session.sessionCount) || 1;
    focusDurationSec = (parseInt(session.focusTime) || 25) * 60;
    breakDurationSec = (parseInt(session.breakTime) || 5) * 60;
    remainingTimeSec = focusDurationSec;
    isFocusPhase = true;
    currentSessionCount = 0;

    sessionTasksList = (session.tasks || []).map((tText) => ({ text: tText, completed: false }));

    inflateTimerCardUI(session);
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
    <div class="flex flex-col gap-3 [.fixed-fullscreen-widget_&]:gap-3 sm:[.fixed-fullscreen-widget_&]:gap-6 h-full justify-between w-full max-w-3xl mx-auto">
      <div class="flex items-center justify-between pb-2 border-b border-[#3D2013]/20">
        <div class="flex items-center gap-2 [.fixed-fullscreen-widget_&]:gap-2 sm:[.fixed-fullscreen-widget_&]:gap-3">
          <span class="font-pressstart text-[8px] sm:text-[9px] [.fixed-fullscreen-widget_&]:text-[10px] sm:[.fixed-fullscreen-widget_&]:text-[12px] text-[#FEF4E0] bg-[#E87339] border border-[#3D2013] px-2 [.fixed-fullscreen-widget_&]:px-2.5 sm:[.fixed-fullscreen-widget_&]:px-3 py-0.5 [.fixed-fullscreen-widget_&]:py-1 uppercase">
            ${session.workType || "GENERAL WORK"}
          </span>
          <span class="font-pressstart text-[8px] sm:text-[9px] [.fixed-fullscreen-widget_&]:text-[10px] sm:[.fixed-fullscreen-widget_&]:text-[12px] text-[#3D2013] opacity-80">
            ${session.techniqueName || "Technique"}
          </span>
        </div>

        <div class="flex items-center gap-1.5 [.fixed-fullscreen-widget_&]:gap-2 sm:[.fixed-fullscreen-widget_&]:gap-3">
          <div class="relative group flex items-center">
            <button onclick="toggleFloatingWidget()" class="p-1 [.fixed-fullscreen-widget_&]:p-1.5 sm:[.fixed-fullscreen-widget_&]:p-2 cursor-pointer text-[#3D2013] hover:text-[#E87339] transition-colors">
              <svg class="w-4 h-4 [.fixed-fullscreen-widget_&]:w-5 [.fixed-fullscreen-widget_&]:h-5 sm:[.fixed-fullscreen-widget_&]:w-6 sm:[.fixed-fullscreen-widget_&]:h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
            <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center pointer-events-none z-50 whitespace-nowrap">
              <span class="font-pressstart text-[7px] sm:text-[8px] [.fixed-fullscreen-widget_&]:text-[9px] text-[#FEF4E0] bg-[#3D2013] px-2 py-1 rounded-[4px] border border-[#3D2013] shadow-md uppercase">
                POP-OUT WIDGET
              </span>
              <div class="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#3D2013]"></div>
            </div>
          </div>
          
          <div class="relative group flex items-center">
            <button onclick="toggleFullScreenTimer()" class="p-1 [.fixed-fullscreen-widget_&]:p-1.5 sm:[.fixed-fullscreen-widget_&]:p-2 cursor-pointer text-[#3D2013] hover:text-[#E87339] transition-colors">
              <svg class="w-4 h-4 [.fixed-fullscreen-widget_&]:w-5 [.fixed-fullscreen-widget_&]:h-5 sm:[.fixed-fullscreen-widget_&]:w-6 sm:[.fixed-fullscreen-widget_&]:h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
              </svg>
            </button>
            <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center pointer-events-none z-50 whitespace-nowrap">
              <span class="font-pressstart text-[7px] sm:text-[8px] [.fixed-fullscreen-widget_&]:text-[9px] text-[#FEF4E0] bg-[#3D2013] px-2 py-1 rounded-[4px] border border-[#3D2013] shadow-md uppercase">
                FULLSCREEN
              </span>
              <div class="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#3D2013]"></div>
            </div>
          </div>

          <div class="relative group flex items-center">
            <button onclick="cancelActiveSession()" class="p-1 [.fixed-fullscreen-widget_&]:p-1.5 sm:[.fixed-fullscreen-widget_&]:p-2 cursor-pointer text-[#A53914] hover:text-[#E87339] transition-colors">
              <svg class="w-4 h-4 [.fixed-fullscreen-widget_&]:w-5 [.fixed-fullscreen-widget_&]:h-5 sm:[.fixed-fullscreen-widget_&]:w-6 sm:[.fixed-fullscreen-widget_&]:h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            <div class="absolute bottom-full mb-2 right-0 sm:left-1/2 sm:-translate-x-1/2 hidden group-hover:flex flex-col items-center pointer-events-none z-50 whitespace-nowrap">
              <span class="font-pressstart text-[7px] sm:text-[8px] [.fixed-fullscreen-widget_&]:text-[9px] text-[#FEF4E0] bg-[#A53914] px-2 py-1 rounded-[4px] border border-[#3D2013] shadow-md uppercase">
                CANCEL SESSION
              </span>
              <div class="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#A53914] self-end pr-2 sm:self-center sm:pr-0"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center my-1 [.fixed-fullscreen-widget_&]:my-2 sm:[.fixed-fullscreen-widget_&]:my-6 text-center">
        <span id="timer-phase-label" class="font-pressstart text-[10px] sm:text-[12px] [.fixed-fullscreen-widget_&]:text-[13px] sm:[.fixed-fullscreen-widget_&]:text-[22px] text-[#E87339] tracking-wider uppercase mb-1 [.fixed-fullscreen-widget_&]:mb-2 sm:[.fixed-fullscreen-widget_&]:mb-3">
          FOCUS PHASE
        </span>
        <div id="timer-time-display" class="font-pressstart text-[36px] sm:text-[48px] [.fixed-fullscreen-widget_&]:text-[52px] sm:[.fixed-fullscreen-widget_&]:text-[100px] text-[#3D2013] tracking-tighter drop-shadow-sm">
          ${formatTime(remainingTimeSec)}
        </div>
      </div>

      <div>
        <button id="timer-start-pause-btn" onclick="toggleTimer()" class="w-full font-pressstart text-[11px] [.fixed-fullscreen-widget_&]:text-[13px] sm:[.fixed-fullscreen-widget_&]:text-[16px] text-[#FFFFF6] bg-[#E87339] border-[2px] border-[#3D2013] py-2.5 [.fixed-fullscreen-widget_&]:py-3 sm:[.fixed-fullscreen-widget_&]:py-4 transition-all retro-shadow active:translate-x-0.5 active:translate-y-0.5 cursor-pointer">
          START FOCUS
        </button>
      </div>

      <div class="grid grid-cols-3 gap-2 border-t-[1.5px] border-[#3D2013]/20 pt-3 [.fixed-fullscreen-widget_&]:pt-3 sm:[.fixed-fullscreen-widget_&]:pt-6 text-center">
        <div class="flex items-center justify-center gap-2 [.fixed-fullscreen-widget_&]:gap-2 sm:[.fixed-fullscreen-widget_&]:gap-3">
          <svg class="w-7 h-7 sm:w-9 sm:h-9 [.fixed-fullscreen-widget_&]:w-8 [.fixed-fullscreen-widget_&]:h-8 sm:[.fixed-fullscreen-widget_&]:w-12 sm:[.fixed-fullscreen-widget_&]:h-12 shrink-0 text-[#E87339]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 3"></path></svg>
          <div class="flex flex-col text-left">
            <span class="font-pressstart text-[10px] sm:text-[13px] [.fixed-fullscreen-widget_&]:text-[12px] sm:[.fixed-fullscreen-widget_&]:text-[18px] text-[#3D2013]">${focusMins}m</span>
            <span class="font-pixel text-[10px] sm:text-[15px] [.fixed-fullscreen-widget_&]:text-[13px] sm:[.fixed-fullscreen-widget_&]:text-[20px] text-[#3D2013]/60 uppercase">FOCUS</span>
          </div>
        </div>

        <div class="flex items-center justify-center gap-2 [.fixed-fullscreen-widget_&]:gap-2 sm:[.fixed-fullscreen-widget_&]:gap-3 border-x border-[#3D2013]/20 px-1">
          <svg class="w-7 h-7 sm:w-9 sm:h-9 [.fixed-fullscreen-widget_&]:w-8 [.fixed-fullscreen-widget_&]:h-8 sm:[.fixed-fullscreen-widget_&]:w-12 sm:[.fixed-fullscreen-widget_&]:h-12 shrink-0 text-[#E87339]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18 8h1a3 3 0 010 6h-1M6 8h12v7a3 3 0 01-3 3H9a3 3 0 01-3-3V8zM6 10H4a2 2 0 00-2 2v1a2 2 0 002 2h2"></path></svg>
          <div class="flex flex-col text-left">
            <span class="font-pressstart text-[10px] sm:text-[13px] [.fixed-fullscreen-widget_&]:text-[12px] sm:[.fixed-fullscreen-widget_&]:text-[18px] text-[#3D2013]">${breakMins}m</span>
            <span class="font-pixel text-[10px] sm:text-[15px] [.fixed-fullscreen-widget_&]:text-[13px] sm:[.fixed-fullscreen-widget_&]:text-[20px] text-[#3D2013]/60 uppercase">BREAK</span>
          </div>
        </div>

        <div class="flex items-center justify-center gap-2 [.fixed-fullscreen-widget_&]:gap-2 sm:[.fixed-fullscreen-widget_&]:gap-3">
          <svg class="w-7 h-7 sm:w-9 sm:h-9 [.fixed-fullscreen-widget_&]:w-8 [.fixed-fullscreen-widget_&]:h-8 sm:[.fixed-fullscreen-widget_&]:w-12 sm:[.fixed-fullscreen-widget_&]:h-12 shrink-0 text-[#E87339]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="5"></circle><circle cx="12" cy="12" r="1"></circle></svg>
          <div class="flex flex-col text-left">
            <span id="session-progress-display" class="font-pressstart text-[10px] sm:text-[13px] [.fixed-fullscreen-widget_&]:text-[12px] sm:[.fixed-fullscreen-widget_&]:text-[18px] text-[#3D2013]">
              ${currentSessionCount}/${totalSessions}
            </span>
            <span class="font-pixel text-[10px] sm:text-[15px] [.fixed-fullscreen-widget_&]:text-[13px] sm:[.fixed-fullscreen-widget_&]:text-[20px] text-[#3D2013]/60 uppercase">SESSIONS</span>
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

function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDailyStats() {
  const today = getTodayDateString();
  const lastSavedDate = localStorage.getItem("tracker_date");

  if (lastSavedDate !== today) {
    localStorage.setItem("tracker_date", today);
    localStorage.setItem("daily_focus_seconds", "0");
    localStorage.setItem("daily_break_seconds", "0");
  }

  const dailyFocusSeconds = parseInt(localStorage.getItem("daily_focus_seconds") || "0", 10);
  const dailyBreakSeconds = parseInt(localStorage.getItem("daily_break_seconds") || "0", 10);
  const totalFocusSeconds = parseInt(localStorage.getItem("total_focus_seconds") || "0", 10);
  const totalBreakSeconds = parseInt(localStorage.getItem("total_break_seconds") || "0", 10);

  return {
    dailyFocusSeconds,
    dailyBreakSeconds,
    totalFocusSeconds,
    totalBreakSeconds,
    focusSeconds: dailyFocusSeconds,
    breakSeconds: dailyBreakSeconds,
    totalSeconds: dailyFocusSeconds + dailyBreakSeconds,
    totalMinutes: Math.floor((dailyFocusSeconds + dailyBreakSeconds) / 60)
  };
}

function recordCompletedSession(durationInSeconds, sessionType) {
  const currentStats = getDailyStats();

  if (sessionType === 'focus') {
    const updatedDailyFocus = currentStats.dailyFocusSeconds + durationInSeconds;
    localStorage.setItem("daily_focus_seconds", updatedDailyFocus.toString());
    const updatedTotalFocus = currentStats.totalFocusSeconds + durationInSeconds;
    localStorage.setItem("total_focus_seconds", updatedTotalFocus.toString());
  } else if (sessionType === 'break') {
    const updatedDailyBreak = currentStats.dailyBreakSeconds + durationInSeconds;
    localStorage.setItem("daily_break_seconds", updatedDailyBreak.toString());
    const updatedTotalBreak = currentStats.totalBreakSeconds + durationInSeconds;
    localStorage.setItem("total_break_seconds", updatedTotalBreak.toString());
  }

  return getDailyStats();
}

function updateFocusTimeDisplay() {
  const displayEl = document.getElementById("focus-time-display");
  if (!displayEl) return;

  const { dailyFocusSeconds } = getDailyStats();
  const hours = Math.floor(dailyFocusSeconds / 3600);
  const minutes = Math.floor((dailyFocusSeconds % 3600) / 60);

  displayEl.textContent = `${hours}h ${minutes}m`;
}

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

      const timeDisplay = getActiveElement("timer-time-display");
      if (timeDisplay) timeDisplay.textContent = formatTime(remainingTimeSec);

      if (remainingTimeSec <= 0) {
        clearInterval(timerInterval);
        isTimerRunning = false;

        if (isFocusPhase) {
          recordCompletedSession(focusDurationSec, 'focus');
          updateFocusTimeDisplay();

          isFocusPhase = false;
          remainingTimeSec = breakDurationSec;
          updatePhaseUI("BREAK PHASE", "START BREAK");
        } else {
          recordCompletedSession(breakDurationSec, 'break');
          updateFocusTimeDisplay();

          currentSessionCount++;
          const progressEl = getActiveElement("session-progress-display");
          if (progressEl) progressEl.textContent = `${currentSessionCount}/${totalSessions}`;

          if (currentSessionCount >= totalSessions) {
            handleSessionCompletion();
            return;
          } else {
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
  const phaseLabel = getActiveElement("timer-phase-label");
  const timeDisplay = getActiveElement("timer-time-display");
  const btn = getActiveElement("timer-start-pause-btn");

  if (phaseLabel) phaseLabel.textContent = label;
  if (timeDisplay) timeDisplay.textContent = formatTime(remainingTimeSec);
  if (btn) btn.textContent = btnText;
}

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

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

let pipWindow = null;

function getActiveElement(id) {
  return document.getElementById(id) || (pipWindow && !pipWindow.closed ? pipWindow.document.getElementById(id) : null);
}

window.toggleFloatingWidget = async function() {
  const activeCard = document.getElementById("active-session-card");
  if (!activeCard) return;

  if (pipWindow && !pipWindow.closed) {
    pipWindow.close();
    pipWindow = null;
    return;
  }

  if ("documentPictureInPicture" in window) {
    try {
      const parentContainer = activeCard.parentElement;
      const nextSibling = activeCard.nextSibling;

      pipWindow = await window.documentPictureInPicture.requestWindow({
        width: 380,
        height: 320,
      });

      [...document.styleSheets].forEach((styleSheet) => {
        try {
          const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join("");
          const style = document.createElement("style");
          style.textContent = cssRules;
          pipWindow.document.head.appendChild(style);
        } catch (e) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = styleSheet.href;
          pipWindow.document.head.appendChild(link);
        }
      });

      document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
        pipWindow.document.head.appendChild(link.cloneNode(true));
      });

      pipWindow.document.body.className = "bg-[#FAE9CE] p-3 flex flex-col justify-center items-center h-full m-0 overflow-hidden";
      pipWindow.document.body.appendChild(activeCard);

      pipWindow.addEventListener("pagehide", () => {
        if (parentContainer) {
          if (nextSibling) {
            parentContainer.insertBefore(activeCard, nextSibling);
          } else {
            parentContainer.appendChild(activeCard);
          }
        }
        pipWindow = null;
      });

    } catch (err) {
      console.error("Failed to open Document PiP window, falling back to CSS widget:", err);
      fallbackFloatingWidget(activeCard);
    }
  } else {
    fallbackFloatingWidget(activeCard);
  }
};

function fallbackFloatingWidget(activeCard) {
  if (activeCard.classList.contains("fixed-float-widget")) {
    activeCard.classList.remove("fixed-float-widget", "fixed", "bottom-5", "right-5", "w-80", "sm:w-96", "z-50", "shadow-2xl");
    disableWidgetDragging(activeCard);
  } else {
    activeCard.classList.remove("fixed-fullscreen-widget", "fixed", "inset-0", "z-50", "w-screen", "h-screen", "flex", "items-center", "justify-center", "p-6", "bg-[#FAE9CE]");
    activeCard.classList.add("fixed-float-widget", "fixed", "bottom-5", "right-5", "w-80", "sm:w-96", "z-50", "shadow-2xl");
    enableWidgetDragging(activeCard);
  }
}

let isWidgetDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let initialCardX = 0;
let initialCardY = 0;

function enableWidgetDragging(card) {
  disableWidgetDragging(card);

  const rect = card.getBoundingClientRect();
  card.style.position = "fixed";
  card.style.left = `${rect.left}px`;
  card.style.top = `${rect.top}px`;
  card.style.bottom = "auto";
  card.style.right = "auto";

  const handleDragStart = (e) => {
    if (e.target.closest("button, input, label, a, svg")) return;

    isWidgetDragging = true;
    dragStartX = e.clientX || (e.touches && e.touches[0].clientX);
    dragStartY = e.clientY || (e.touches && e.touches[0].clientY);

    const currentRect = card.getBoundingClientRect();
    initialCardX = currentRect.left;
    initialCardY = currentRect.top;

    card.style.cursor = "grabbing";
    card.style.userSelect = "none";

    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleDragEnd);
  };

  const handleDragMove = (e) => {
    if (!isWidgetDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    const deltaX = clientX - dragStartX;
    const deltaY = clientY - dragStartY;

    let newX = initialCardX + deltaX;
    let newY = initialCardY + deltaY;

    const maxX = window.innerWidth - card.offsetWidth;
    const maxY = window.innerHeight - card.offsetHeight;

    newX = Math.max(10, Math.min(newX, maxX - 10));
    newY = Math.max(10, Math.min(newY, maxY - 10));

    card.style.left = `${newX}px`;
    card.style.top = `${newY}px`;
  };

  const handleTouchMove = (e) => {
    if (!isWidgetDragging) return;
    e.preventDefault();
    handleDragMove(e);
  };

  const handleDragEnd = () => {
    if (!isWidgetDragging) return;
    isWidgetDragging = false;
    card.style.cursor = "";
    card.style.userSelect = "";

    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("mouseup", handleDragEnd);
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleDragEnd);
  };

  card._dragStartHandler = handleDragStart;
  card.addEventListener("mousedown", handleDragStart);
  card.addEventListener("touchstart", handleDragStart);
}

function disableWidgetDragging(card) {
  if (card._dragStartHandler) {
    card.removeEventListener("mousedown", card._dragStartHandler);
    card.removeEventListener("touchstart", card._dragStartHandler);
    delete card._dragStartHandler;
  }
  card.style.position = "";
  card.style.left = "";
  card.style.top = "";
  card.style.bottom = "";
  card.style.right = "";
  card.style.cursor = "";
  card.style.userSelect = "";
}

window.toggleFullScreenTimer = function() {
  const activeCard = document.getElementById("active-session-card");
  if (!activeCard) return;

  disableWidgetDragging(activeCard);

  if (activeCard.classList.contains("fixed-fullscreen-widget")) {
    activeCard.classList.remove("fixed-fullscreen-widget", "fixed", "inset-0", "z-50", "w-screen", "h-screen", "flex", "items-center", "justify-center", "p-6", "bg-[#FAE9CE]");
  } else {
    activeCard.classList.remove("fixed-float-widget", "fixed", "bottom-5", "right-5", "w-80", "sm:w-96", "z-50", "shadow-2xl");
    activeCard.classList.add("fixed-fullscreen-widget", "fixed", "inset-0", "z-50", "w-screen", "h-screen", "flex", "items-center", "justify-center", "p-6", "bg-[#FAE9CE]");
  }
};

function handleSessionCompletion() {
  if (timerInterval) clearInterval(timerInterval);
  isTimerRunning = false;
  
  let totalSavedSessions = parseInt(localStorage.getItem("total_sessions_completed") || "0", 10);
  totalSavedSessions += 1;
  localStorage.setItem("total_sessions_completed", totalSavedSessions.toString());

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
  const leaderboardSection = document.getElementById("middle-leaderboard-section");
  const calendarSection = document.getElementById("calendar-section");

  if (activeCard) {
    disableWidgetDragging(activeCard);
    activeCard.className = "bg-gradient-to-b from-[#FDE4D0] to-[#FFD2AE] border-[2px] border-[#3D2013] rounded-[12px] p-4 sm:p-6 shadow-md flex flex-col justify-between gap-4";
    activeCard.innerHTML = defaultActiveSessionHTML;
  }

  if (recentCard) {
    if (currentHomepageState === "ROOM") {
      inflateRoomActivityCardUI(activeRoomData || mockDemoRoomData);
    } else {
      recentCard.innerHTML = defaultRecentActivityHTML;
      renderRecentActivities();
    }
  }

  if (leaderboardSection && defaultMiddleLeaderboardHTML) {
    if (currentHomepageState === "ROOM") {
      inflateRoomPlayersSectionUI(activeRoomData || mockDemoRoomData);
    } else {
      leaderboardSection.innerHTML = defaultMiddleLeaderboardHTML;
      switchTab(currentTab);
    }
  }

  if (calendarSection && defaultCalendarHTML) {
    if (currentHomepageState === "ROOM") {
      inflateRoomChatSectionUI(activeRoomData || mockDemoRoomData);
    } else {
      calendarSection.innerHTML = defaultCalendarHTML;
      updateAllCalendars();
    }
  }

  updateStreakDisplay();
  updateAvatarNametag();
  updateFocusTimeDisplay();
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
      btn.classList.remove("bg-[#E87339]", "text-[#FFFFF6]", "hover:bg-[#f3dcba]");
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