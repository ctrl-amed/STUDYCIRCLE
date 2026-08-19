// Reference global state provided by global.js
const playerData = window.playerData;

let myFriendsData = [
  { id: "f1", username: "StudyOwl", level: 12, status: "GROUPED", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Owl" },
  { id: "f2", username: "PixelPanda", level: 8, status: "ONLINE", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Panda" },
  { id: "f3", username: "FocusCat", level: 15, status: "OFFLINE", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Cat" },
  { id: "f4", username: "ByteBear", level: 20, status: "ONLINE", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=ByteBear" },
  { id: "f5", username: "CozyFox", level: 11, status: "GROUPED", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=CozyFox" },
  { id: "f6", username: "RetroBunny", level: 5, status: "OFFLINE", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=RetroBunny" },
  { id: "f7", username: "ChaiShiba", level: 18, status: "ONLINE", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=ChaiShiba" },
  { id: "f8", username: "LoFiFrog", level: 9, status: "OFFLINE", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=LoFiFrog" },
  { id: "f9", username: "PixelPenguin", level: 14, status: "GROUPED", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=PixelPenguin" },
  { id: "f10", username: "ZenKoala", level: 22, status: "ONLINE", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=ZenKoala" }
];

let addFriendsData = [
  { id: "p1", username: "ChaiMaster", level: 4, streak: 3, focusTime: "12h", sessions: 18, requested: false, avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Chai" },
  { id: "p2", username: "ByteNinja", level: 9, streak: 14, focusTime: "45h", sessions: 52, requested: false, avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Ninja" },
  { id: "p3", username: "ZenCoder", level: 21, streak: 30, focusTime: "120h", sessions: 110, requested: false, avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Zen" },
  { id: "p4", username: "RetroFox", level: 6, streak: 5, focusTime: "18h", sessions: 22, requested: false, avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Fox" }
];

let requestsData = [
  { id: "r1", username: "CozyBear", level: 11, timeAgo: "TODAY", status: null, avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Bear" },
  { id: "r2", username: "LoFiBunny", level: 7, timeAgo: "YESTERDAY", status: null, avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Bunny" },
  { id: "r3", username: "NekoGamer", level: 19, timeAgo: "3 DAYS AGO", status: null, avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Neko" }
];

let notificationFriendsData = [
  { id: "f1", username: "StudyOwl", level: 12, status: "GROUPED", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Owl", lastMessage: "Awesome! Let's focus for 45 mins. 🚀", timeAgo: "1m", isUnread: true },
  { id: "f2", username: "PixelPanda", level: 8, status: "ONLINE", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Panda", lastMessage: "Almost done, just working on question 3.", timeAgo: "15m", isUnread: true },
  { id: "f3", username: "FocusCat", level: 15, status: "OFFLINE", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Cat", lastMessage: "Sounds good! Catch you later.", timeAgo: "2h", isUnread: false },
  { id: "f4", username: "ByteBear", level: 20, status: "ONLINE", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=ByteBear", lastMessage: "Let me know when you start the timer.", timeAgo: "1d", isUnread: false },
  { id: "f5", username: "CozyFox", level: 11, status: "GROUPED", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=CozyFox", lastMessage: "Hey! Joining the group room now.", timeAgo: "2d", isUnread: false }
];

const mockChatHistory = {
  f1: [
    { sender: "them", text: "Hey! Ready for our study session?" },
    { sender: "me", text: "Yep, joining the room now!" },
    { sender: "them", text: "Awesome! Let's focus for 45 mins. 🚀" }
  ],
  f2: [
    { sender: "them", text: "Hey Acorn! Did you finish the stats assignment?" },
    { sender: "me", text: "Almost done, just working on question 3." }
  ],
  f3: [
    { sender: "them", text: "Catch you later for retro games!" },
    { sender: "me", text: "Sounds good! Catch you later." }
  ]
};

let pendingRemoveFriendId = null;
let currentChatFriend = null;

// --- RENDER HTML TEMPLATES INTO DOM ---
function renderHeader(containerId = "header-container") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <header class="relative z-10 pt-4 sm:pt-6 flex items-center justify-between md:justify-end w-full px-3 sm:px-6 shrink-0">
      <!-- MOBILE TOP-LEFT TOGGLE BUTTON -->
      <button id="mobile-toggle-btn" aria-label="Open Mobile Navigation" class="md:hidden bg-[#FEF4E0] border-2 sm:border-[2px] border-[#3D2013] text-[#3D2013] h-8 sm:h-11 w-8 sm:w-11 flex items-center justify-center rounded-[8px] sm:rounded-[10px] shadow-sm hover:bg-[#FDE4D0] transition-colors focus:outline-none cursor-pointer shrink-0">
        <svg class="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path id="mobile-toggle-icon" stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <!-- UPPER RIGHT HEADER COMPONENTS -->
      <div class="flex items-center gap-1 sm:gap-3 flex-nowrap justify-end max-w-full py-2 px-1">

        <!-- 5. COIN COUNTER (NON-CLICKABLE) -->
        <div class="h-8 sm:h-11 bg-[#FEF4E0] border-[2px] sm:border-[2px] border-[#3D2013] px-1.5 sm:px-3 rounded-[30px] flex items-center justify-center gap-1 sm:gap-2 shrink-0 shadow-sm">
          <img src="media/coin_logo.png" alt="Coin" class="w-3.5 h-3.5 sm:w-6 sm:h-6 object-contain shrink-0" onerror="this.onerror=null; this.src='media/kitsu_logo.png';">
          <span id="coin-number" class="font-pressstart text-[8px] sm:text-[12px] text-[#3D2013]">0</span>
        </div>

        <!-- 4. NOTIFICATION BUTTON & POPOVER -->
        <div class="relative shrink-0">
          <button onclick="toggleModal('notification-modal')" title="Notifications"
                  class="h-8 sm:h-11 bg-[#FEF4E0] border-[2px] sm:border-[2px] border-[#3D2013] px-1.5 sm:px-3 rounded-[8px] sm:rounded-[10px] flex items-center justify-center transition-all duration-150 retro-shadow shrink-0 cursor-pointer hover:bg-[#FDE4D0]">
            <svg class="w-3.5 h-3.5 sm:w-6 sm:h-6 text-[#E87339]" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path fill="currentColor" fill-rule="evenodd" d="M2.77 17.7c.155.065.32.095.48.095l.005-.005c.32 0 .64-.125.88-.365L6.56 15h8.19a2.755 2.755 0 0 0 2.75-2.75v-6.5A2.755 2.755 0 0 0 14.75 3h-10A2.755 2.755 0 0 0 2 5.75v10.795c0 .51.3.96.77 1.155M3.5 5.75c0-.69.56-1.25 1.25-1.25h10c.69 0 1.25.56 1.25 1.25v6.5c0 .69-.56 1.25-1.25 1.25H5.94L3.5 15.94zm16.365 15.68c.24.24.56.365.885.365v.005A1.245 1.245 0 0 0 22 20.55V10.255a2.755 2.755 0 0 0-2.75-2.75H19v1.5h.25c.69 0 1.25.56 1.25 1.25v9.69l-1.94-1.94h-6.81c-.69 0-1.25-.56-1.25-1.25V16.5H9v.255a2.755 2.755 0 0 0 2.75 2.75h6.19z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <!-- NOTIFICATION CIRCLE BADGE -->
          <div id="notif-badge" class="hidden absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-[#E87339] border-[1.5px] sm:border-[2px] border-[#3D2013] text-[#FFFFF6] font-pressstart text-[6px] sm:text-[9px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center z-20 pointer-events-none">
            <span id="notif-number">0</span>
          </div>

          <!-- NOTIFICATION DROPDOWN MODAL -->
          <div id="notification-modal" class="fixed inset-x-3 top-16 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 z-50 hidden">
            <div class="bg-[#FEF4E0] border-[2px] border-[#3D2013] rounded-[12px] p-3 sm:p-4 w-full sm:w-[360px] h-[70vh] sm:h-[420px] max-h-[500px] shadow-2xl flex flex-col gap-3 text-left">
              <div class="flex items-center justify-between pb-2 border-b-[2px] border-[#3D2013]/20 shrink-0">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 text-[#E87339]" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path fill="currentColor" fill-rule="evenodd" d="M2.77 17.7c.155.065.32.095.48.095l.005-.005c.32 0 .64-.125.88-.365L6.56 15h8.19a2.755 2.755 0 0 0 2.75-2.75v-6.5A2.755 2.755 0 0 0 14.75 3h-10A2.755 2.755 0 0 0 2 5.75v10.795c0 .51.3.96.77 1.155M3.5 5.75c0-.69.56-1.25 1.25-1.25h10c.69 0 1.25.56 1.25 1.25v6.5c0 .69-.56 1.25-1.25 1.25H5.94L3.5 15.94zm16.365 15.68c.24.24.56.365.885.365v.005A1.245 1.245 0 0 0 22 20.55V10.255a2.755 2.755 0 0 0-2.75-2.75H19v1.5h.25c.69 0 1.25.56 1.25 1.25v9.69l-1.94-1.94h-6.81c-.69 0-1.25-.56-1.25-1.25V16.5H9v.255a2.755 2.755 0 0 0 2.75 2.75h6.19z" clip-rule="evenodd" />
                  </svg>
                  <h3 class="font-pressstart text-[10px] sm:text-[12px] text-[#3D2013]">Notifications</h3>
                </div>
                <button onclick="closeModal('notification-modal')" class="text-[#3D2013] hover:text-[#A53914] font-pressstart text-[12px] p-1 cursor-pointer">✕</button>
              </div>

              <div class="relative w-full shrink-0">
                <input type="text" id="notif-friends-search" oninput="filterNotificationFriendsSearch()" placeholder="Search friends..." class="w-full bg-[#FEF4E0] border-[2px] border-[#3D2013] rounded-[8px] px-2.5 py-1.5 font-pressstart text-[8px] sm:text-[9px] text-[#3D2013] focus:outline-none placeholder-[#3D2013]/50">
              </div>

              <div id="notif-friends-container" class="overflow-y-auto pr-1 flex-1 min-h-0 flex flex-col gap-2"></div>
            </div>
          </div>
        </div>

        <!-- 3. FRIENDS BUTTON -->
        <button onclick="openModal('friends-modal')" title="Friends"
                class="h-8 sm:h-11 bg-[#FEF4E0] border-[2px] sm:border-[2px] border-[#3D2013] px-1.5 sm:px-3 rounded-[8px] sm:rounded-[10px] flex items-center justify-center gap-1 sm:gap-2 transition-all duration-150 retro-shadow shrink-0 cursor-pointer hover:bg-[#FDE4D0]">
          <svg class="w-3.5 h-3.5 sm:w-6 sm:h-6 text-[#E87339]" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path fill="currentColor" d="M3.5 8a5.5 5.5 0 1 1 8.596 4.547a9.005 9.005 0 0 1 5.9 8.18a.751.751 0 0 1-1.5.045a7.5 7.5 0 0 0-14.993 0a.75.75 0 0 1-1.499-.044a9.005 9.005 0 0 1 5.9-8.181A5.5 5.5 0 0 1 3.5 8M9 4a4 4 0 1 0 0 8a4 4 0 0 0 0-8m8.29 4q-.221 0-.434.03a.75.75 0 1 1-.212-1.484a4.53 4.53 0 0 1 3.38 8.097a6.69 6.69 0 0 1 3.956 6.107a.75.75 0 0 1-1.5 0a5.19 5.19 0 0 0-3.696-4.972l-.534-.16v-1.676l.41-.209A3.03 3.03 0 0 0 17.29 8" />
          </svg>
          <span id="friends-number" class="font-pressstart text-[8px] sm:text-[12px] text-[#3D2013]">0</span>
        </button>

        <!-- 2. STREAK COUNTER -->
        <div class="h-8 sm:h-11 bg-[#FEF4E0] border-[2px] sm:border-[2px] border-[#3D2013] px-1.5 sm:px-3 rounded-[8px] sm:rounded-[10px] flex items-center justify-center gap-0.5 sm:gap-1.5 shrink-0 shadow-sm">
          <svg class="w-3.5 h-3.5 sm:w-6 sm:h-6 text-[#ED8C00]" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.8 9.4Q11 7 12 3q2.5 5 0 10q3 0 5-2.9a7 7 0 1 1-9.2-.7" />
          </svg>
          <span class="font-pressstart text-[8px] sm:text-[12px] text-[#3D2013]">
            <span id="streak-number">0</span>D
          </span>
        </div>

        <!-- 1. SIGN OUT BUTTON -->
        <button onclick="openModal('logout-modal')" title="Logout"
                class="h-8 sm:h-11 bg-[#A53914] border-[2px] sm:border-[2px] border-[#3D2013] px-1.5 sm:px-3 rounded-[8px] sm:rounded-[10px] flex items-center justify-center gap-1 sm:gap-2 transition-all duration-150 retro-shadow shrink-0 cursor-pointer hover:bg-[#832c0f]">
          <svg class="w-3.5 h-3.5 sm:w-6 sm:h-6 text-[#FEF4E0]" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path fill="currentColor" d="M9 20.75H6a2.64 2.64 0 0 1-2.75-2.53V5.78A2.64 2.64 0 0 1 6 3.25h3a.75.75 0 0 1 0 1.5H6a1.16 1.16 0 0 0-1.25 1v12.47a1.16 1.16 0 0 0 1.25 1h3a.75.75 0 0 1 0 1.5Zm7-4a.74.74 0 0 1-.53-.22a.75.75 0 1 1 0-1.06L18.94 12l-3.47-3.47a.75.75 0 1 1 1.06-1.06l4 4a.75.75 0 0 1 0 1.06l-4 4a.74.74 0 0 1-.53.22" />
            <path fill="currentColor" d="M20 12.75H9a.75.75 0 0 1 0-1.5h11a.75.75 0 0 1 0 1.5" />
          </svg>
          <span class="font-pressstart text-[8px] sm:text-[11px] text-[#FEF4E0] hidden sm:inline">SIGN OUT</span>
        </button>

      </div>
    </header>

    <!-- LOGOUT MODAL -->
    <div id="logout-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D2013]/50 hidden">
      <div class="bg-[#FEF4E0] border-[2px] border-[#3D2013] rounded-[12px] p-6 max-w-sm w-full shadow-xl flex flex-col gap-4 text-center">
        <h3 class="font-pressstart text-[14px] text-[#3D2013]">Sign Out</h3>
        <p class="font-pressstart text-[10px] text-[#3D2013]/80 leading-normal">Are you sure you want to sign out?</p>
        <div class="flex gap-3 justify-center mt-2">
          <button onclick="closeModal('logout-modal')" class="bg-[#A53914] text-[#FEF4E0] border-[2px] border-[#3D2013] px-4 py-2 rounded-[8px] font-pressstart text-[10px] cursor-pointer hover:bg-[#832c0f] transition-colors">Yes</button>
          <button onclick="closeModal('logout-modal')" class="bg-[#FAE9CE] text-[#3D2013] border-[2px] border-[#3D2013] px-4 py-2 rounded-[8px] font-pressstart text-[10px] cursor-pointer hover:bg-[#f3d3a8] transition-colors">Cancel</button>
        </div>
      </div>
    </div>

    <!-- FRIENDS MODAL -->
    <div id="friends-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D2013]/50 hidden">
      <div class="bg-[#FEF4E0] border-[2px] border-[#3D2013] rounded-[12px] p-4 sm:p-6 w-[720px] max-w-[95vw] h-[580px] max-h-[90vh] shadow-xl flex flex-col gap-4 text-left">
        <div class="flex items-center justify-between pb-3 shrink-0">
          <div class="flex items-center gap-2">
            <svg class="w-6 h-6 text-[#E87339]" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path fill="currentColor" d="M3.5 8a5.5 5.5 0 1 1 8.596 4.547a9.005 9.005 0 0 1 5.9 8.18a.751.751 0 0 1-1.5.045a7.5 7.5 0 0 0-14.993 0a.75.75 0 0 1-1.499-.044a9.005 9.005 0 0 1 5.9-8.181A5.5 5.5 0 0 1 3.5 8M9 4a4 4 0 1 0 0 8a4 4 0 0 0 0-8m8.29 4q-.221 0-.434.03a.75.75 0 1 1-.212-1.484a4.53 4.53 0 0 1 3.38 8.097a6.69 6.69 0 0 1 3.956 6.107a.75.75 0 0 1-1.5 0a5.19 5.19 0 0 0-3.696-4.972l-.534-.16v-1.676l.41-.209A3.03 3.03 0 0 0 17.29 8" />
            </svg>
            <h3 class="font-pressstart text-[14px] text-[#3D2013]">Friends</h3>
          </div>
          <button onclick="closeModal('friends-modal')" class="text-[#3D2013] hover:text-[#A53914] font-pressstart text-[14px] cursor-pointer">✕</button>
        </div>

        <div class="flex items-center gap-2 p-1.5 rounded-[8px] shrink-0">
          <button id="tab-btn-my-friends" onclick="switchFriendsTab('my-friends')" class="flex-1 min-w-0 h-11 min-h-[44px] px-1 flex items-center justify-center text-center font-pressstart text-[8px] sm:text-[10px] leading-tight rounded-[6px] transition-all bg-[#FDE4D0] text-[#E87339] border-[2px] border-transparent shadow-sm cursor-pointer break-words hyphens-auto">MY FRIENDS</button>
          <button id="tab-btn-add-friends" onclick="switchFriendsTab('add-friends')" class="flex-1 min-w-0 h-11 min-h-[44px] px-1 flex items-center justify-center text-center font-pressstart text-[8px] sm:text-[10px] leading-tight rounded-[6px] transition-all bg-[#FAE9CE] text-[#3D2013] border-[2px] border-[#3D2013] shadow-sm cursor-pointer break-words hyphens-auto">ADD FRIENDS</button>
          <button id="tab-btn-requests" onclick="switchFriendsTab('requests')" class="flex-1 min-w-0 h-11 min-h-[44px] px-1 flex items-center justify-center text-center font-pressstart text-[8px] sm:text-[10px] leading-tight rounded-[6px] transition-all bg-[#FAE9CE] text-[#3D2013] border-[2px] border-[#3D2013] shadow-sm cursor-pointer break-words hyphens-auto">REQUESTS</button>
        </div>

        <div class="overflow-y-auto pr-1 flex-1 min-h-0">
          <div id="tab-content-my-friends" class="flex flex-col gap-2.5"></div>
          <div id="tab-content-add-friends" class="hidden flex flex-col gap-4">
            <div class="relative w-full">
              <input type="text" id="add-friend-search" oninput="filterAddFriendsSearch()" placeholder="Search players..." class="w-full bg-[#FEF4E0] border-[2px] border-[#3D2013] rounded-[8px] px-3 py-2 font-pressstart text-[10px] text-[#3D2013] focus:outline-none placeholder-[#3D2013]/50">
            </div>
            <div id="add-friends-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"></div>
          </div>
          <div id="tab-content-requests" class="hidden flex flex-col gap-2.5"></div>
        </div>
      </div>
    </div>

    <!-- CHAT SUB-MODAL -->
    <div id="chat-modal" class="fixed bottom-4 right-4 z-50 p-0 hidden">
      <div class="bg-[#FEF4E0] border-[2px] border-[#3D2013] rounded-[10px] max-w-md w-80 sm:w-96 shadow-xl flex flex-col overflow-hidden relative">
        <div class="flex items-center justify-between p-3 bg-[#FAE9CE] border-b-[2px] border-[#3D2013]">
          <div class="flex items-center gap-2.5 min-w-0">
            <img id="chat-user-pfp" src="" alt="PFP" class="w-8 h-8 rounded-full border-[2px] border-[#3D2013] object-cover bg-[#FEF4E0] shrink-0">
            <div class="flex flex-col min-w-0">
              <span id="chat-user-name" class="font-pressstart text-[11px] text-[#3D2013] truncate">USERNAME</span>
              <span id="chat-user-status" class="font-pressstart text-[8px]">ONLINE</span>
            </div>
          </div>
          <button onclick="closeModal('chat-modal')" class="text-[#3D2013] hover:text-[#A53914] font-pressstart text-[12px] cursor-pointer shrink-0 ml-2">✕</button>
        </div>

        <div class="p-3 flex flex-col gap-3 relative">
          <div class="relative">
            <div id="chat-messages-container" class="h-48 overflow-y-auto p-3 flex flex-col gap-2">
              <div class="text-center font-pressstart text-[8px] text-[#3D2013]/60 py-2">Start of conversation</div>
            </div>
            <button id="scroll-bottom-btn" class="hidden absolute bottom-2 right-2 bg-[#E87339] text-[#FEF4E0] border-[2px] border-[#3D2013] p-1.5 rounded-full shadow-md hover:bg-[#d0622c] cursor-pointer transition-opacity duration-200 z-10" title="Scroll to bottom">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>
          </div>

          <div id="picker-wrapper" class="hidden absolute bottom-16 left-3 z-50 transition-all duration-200 scale-95 opacity-0 origin-bottom-left max-w-[calc(100%-24px)]">
            <emoji-picker class="light shadow-2xl border-[2px] border-[#3D2013] rounded-xl overflow-hidden text-xs max-h-60"></emoji-picker>
          </div>

          <form id="chat-form" class="flex gap-2 items-center">
            <div class="flex-1 flex items-center bg-[#FEF4E0] border-[2px] border-[#3D2013] rounded-[8px] px-2 py-1">
              <input type="text" id="chat-input" placeholder="Type a message..." required class="flex-1 bg-transparent font-pixel text-[15px] text-[#3D2013] focus:outline-none min-w-0">
              <button type="button" id="emoji-trigger" class="text-sm cursor-pointer hover:scale-110 transition active:scale-95 ml-1 select-none shrink-0" title="Add Emoji">😀</button>
            </div>
            <button type="submit" class="bg-[#E87339] text-[#FEF4E0] border-[2px] border-[#3D2013] px-3 py-2 rounded-[8px] font-pressstart hover:bg-[#d0622c] cursor-pointer shrink-0 flex items-center justify-center" aria-label="Send">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path fill="currentColor" d="M3 20v-6l8-2l-8-2V4l19 8z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- REMOVE FRIEND WARNING MODAL -->
    <div id="remove-friend-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D2013]/50 hidden">
      <div class="bg-[#FEF4E0] border-[2px] border-[#3D2013] rounded-[12px] p-6 max-w-sm w-full shadow-xl flex flex-col gap-3 text-center items-center">
        <div class="w-12 h-12 rounded-full bg-[#E87339]/20 border-[2px] border-[#E87339] flex items-center justify-center text-[#E87339]">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <h3 class="font-pressstart text-[12px] text-[#3D2013]">Remove Friend?</h3>
        <p id="remove-friend-msg" class="font-pressstart text-[9px] text-[#3D2013]/80 leading-relaxed">
          Are you sure you want to remove <span id="remove-friend-target-name" class="text-[#E87339]">Username</span> from your friends list?
        </p>
        <div class="flex gap-3 justify-center mt-2 w-full">
          <button onclick="closeModal('remove-friend-modal')" class="flex-1 bg-[#FAE9CE] text-[#3D2013] border-[2px] border-[#3D2013] py-2 rounded-[8px] font-pressstart text-[10px] cursor-pointer hover:bg-[#f3d3a8] transition-colors">Cancel</button>
          <button id="confirm-remove-friend-btn" class="flex-1 bg-[#A53914] text-[#FEF4E0] border-[2px] border-[#3D2013] py-2 rounded-[8px] font-pressstart text-[10px] cursor-pointer hover:bg-[#832c0f] transition-colors">Remove</button>
        </div>
      </div>
    </div>
  `;
}

// --- DOM CONTENT LOADED MAIN HANDLER ---
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();

  // Sync latest coin value from localStorage upon load
  const currentCoins = localStorage.getItem(COINS_KEY) !== null 
    ? parseInt(localStorage.getItem(COINS_KEY), 10) 
    : (playerData.coin_number || 1250);
    
  playerData.coin_number = currentCoins;

  const coinNumberEl = document.getElementById("coin-number");
  const notifBadgeEl = document.getElementById("notif-badge");
  const notifNumberEl = document.getElementById("notif-number");
  const friendsNumberEl = document.getElementById("friends-number");
  const streakNumberEl = document.getElementById("streak-number");

  function updateHeaderData() {
    if (coinNumberEl) coinNumberEl.textContent = playerData.coin_number.toLocaleString();
    if (friendsNumberEl) friendsNumberEl.textContent = playerData.friends_number;
    if (streakNumberEl) streakNumberEl.textContent = playerData.streak_number;

    if (notifBadgeEl && notifNumberEl) {
      if (playerData.notif_number > 0) {
        notifNumberEl.textContent = playerData.notif_number;
        notifBadgeEl.classList.remove("hidden");
      } else {
        notifBadgeEl.classList.add("hidden");
      }
    }
  }

  // Chat Form & Modals Listeners
  const chatForm = document.getElementById("chat-form");
  if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("chat-input");
      if (input && input.value.trim() !== "") {
        sendChatMessage(input.value.trim());
        input.value = "";
      }
    });
  }

  const confirmRemoveBtn = document.getElementById("confirm-remove-friend-btn");
  if (confirmRemoveBtn) confirmRemoveBtn.addEventListener("click", executeRemoveFriend);

  // Emoji Picker & Scroll Logic
  const trigger = document.getElementById("emoji-trigger");
  const wrapper = document.getElementById("picker-wrapper");
  const picker = document.querySelector("emoji-picker");
  const input = document.getElementById("chat-input");
  const msgContainer = document.getElementById("chat-messages-container");
  const scrollBottomBtn = document.getElementById("scroll-bottom-btn");

  function togglePicker() {
    if (window.innerWidth < 640) {
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
      closePicker();
    }
  }

  function closePicker() {
    if (!wrapper) return;
    wrapper.classList.remove("scale-100", "opacity-100");
    wrapper.classList.add("scale-95", "opacity-0");
    setTimeout(() => wrapper.classList.add("hidden"), 200);
  }

  if (trigger) {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePicker();
    });
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

  document.addEventListener("click", (event) => {
    if (wrapper && !wrapper.contains(event.target) && event.target !== trigger) {
      closePicker();
    }
  });

  if (msgContainer && scrollBottomBtn) {
    msgContainer.addEventListener("scroll", () => {
      const distanceFromBottom = msgContainer.scrollHeight - msgContainer.scrollTop - msgContainer.clientHeight;
      if (distanceFromBottom > 40) scrollBottomBtn.classList.remove("hidden");
      else scrollBottomBtn.classList.add("hidden");
    });

    scrollBottomBtn.addEventListener("click", () => {
      msgContainer.scrollTo({ top: msgContainer.scrollHeight, behavior: "smooth" });
    });
  }

  // Final Component Initialization Calls
  updateHeaderData();
  renderMyFriends();
  renderAddFriends();
  renderRequests();
  renderNotificationFriends();
  updateUnreadNotifBadge();
});

// --- FRIENDS TAB SWITCHING LOGIC ---
function switchFriendsTab(tabName) {
  const tabs = ["my-friends", "add-friends", "requests"];
  const baseClasses = "flex-1 min-w-0 h-11 min-h-[44px] px-1 flex items-center justify-center text-center font-pressstart text-[8px] sm:text-[10px] leading-tight rounded-[6px] transition-all shadow-sm cursor-pointer break-words hyphens-auto";

  tabs.forEach((tab) => {
    const btn = document.getElementById(`tab-btn-${tab}`);
    const content = document.getElementById(`tab-content-${tab}`);
    
    if (btn) {
      if (tab === tabName) {
        btn.className = `${baseClasses} bg-[#FDE4D0] text-[#E87339] border-[2px] border-transparent`;
      } else {
        btn.className = `${baseClasses} bg-[#FAE9CE] text-[#3D2013] border-[2px] border-[#3D2013]`;
      }
    }

    if (content) {
      if (tab === tabName) content.classList.remove("hidden");
      else content.classList.add("hidden");
    }
  });
}

// --- RENDER FRIENDS VIEWS ---
function renderMyFriends() {
  const container = document.getElementById("tab-content-my-friends");
  if (!container) return;

  if (myFriendsData.length === 0) {
    container.innerHTML = `<div class="text-center font-pressstart text-[10px] text-[#3D2013]/60 py-6">No friends added yet.</div>`;
    return;
  }

  container.innerHTML = myFriendsData.map((friend) => {
    let statusBg = "bg-[#788D55]";
    let statusTextColor = "text-[#788D55]";

    if (friend.status === "GROUPED") {
      statusBg = "bg-[#E87339]";
      statusTextColor = "text-[#E87339]";
    }
    if (friend.status === "OFFLINE") {
      statusBg = "bg-[#6F655D]";
      statusTextColor = "text-[#6F655D]";
    }

    return `
      <div id="friend-card-${friend.id}" class="flex flex-col gap-2 sm:grid sm:grid-cols-3 sm:gap-0 items-center bg-[#FEF4E0] border-[2px] border-[#3D2013] p-2.5 transition-all duration-300">
        <div class="flex items-center gap-2.5 min-w-0 w-full">
          <div class="relative w-9 h-9 shrink-0">
            <img src="${friend.avatar}" alt="${friend.username}" class="w-full h-full rounded-full border-[2px] border-[#3D2013] object-cover bg-[#FEF4E0]">
            <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-[1.5px] border-[#3D2013] ${statusBg}"></span>
          </div>
          <div class="flex flex-col min-w-0">
            <span class="font-pressstart text-[10px] text-[#3D2013] whitespace-normal break-words sm:truncate">${friend.username}</span>
            <span class="font-pressstart text-[8px] text-[#3D2013]/70">LVL ${friend.level}</span>
          </div>
        </div>

        <div class="flex items-center justify-between w-full sm:contents">
          <div class="flex justify-start sm:justify-center">
            <span class="font-pressstart text-[8px] ${statusTextColor} text-left sm:text-center">
              ${friend.status}
            </span>
          </div>

          <div class="flex items-center justify-end gap-1.5">
            <button onclick="openChatModal('${friend.id}')" title="Message" class="p-1.5 text-[#3D2013] hover:text-[#FD923E] transition-colors cursor-pointer">
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path fill="currentColor" d="m6 18l-2.3 2.3q-.475.475-1.088.213T2 19.575V4q0-.825.588-1.412T4 2h16q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18zm-.85-2H20V4H4v13.125zM4 16V4zm3-2h6q.425 0 .713-.288T14 13t-.288-.712T13 12H7q-.425 0-.712.288T6 13t.288.713T7 14m0-3h10q.425 0 .713-.288T18 10t-.288-.712T17 9H7q-.425 0-.712.288T6 10t.288.713T7 11m0-3h10q.425 0 .713-.288T18 7t-.288-.712T17 6H7q-.425 0-.712.288T6 7t.288.713T7 8" />
              </svg>
            </button>
            <button onclick="openRemoveFriendModal('${friend.id}')" title="Remove" class="p-1.5 text-[#3D2013] hover:text-[#A53914] transition-colors cursor-pointer">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function renderAddFriends(searchQuery = "") {
  const container = document.getElementById("add-friends-grid");
  if (!container) return;

  const filtered = addFriendsData.filter(p => p.username.toLowerCase().includes(searchQuery.toLowerCase()));

  if (filtered.length === 0) {
    container.innerHTML = `<div class="col-span-full text-center font-pressstart text-[10px] text-[#3D2013]/60 py-6">No players found.</div>`;
    return;
  }

  container.innerHTML = filtered.map((player) => `
    <div class="bg-[#FEF4E0] border-[2px] border-[#3D2013] p-2.5 flex flex-col gap-2">
      <div class="flex items-center justify-between gap-1.5 min-w-0">
        <div class="flex items-center gap-1.5 min-w-0 flex-1">
          <img src="${player.avatar}" alt="${player.username}" class="w-7 h-7 rounded-full border-[1.5px] border-[#3D2013] bg-[#FEF4E0] object-cover shrink-0">
          <div class="flex flex-col min-w-0 flex-1">
            <span class="font-pressstart text-[9px] text-[#3D2013] break-words whitespace-normal leading-tight">${player.username}</span>
            <span class="font-pressstart text-[7px] text-[#3D2013]/70">LVL ${player.level}</span>
          </div>
        </div>
        <button onclick="requestAddFriend('${player.id}')" ${player.requested ? 'disabled' : ''} 
                class="px-2 py-1.5 rounded-[6px] font-pressstart text-[7px] border-[1.5px] border-[#3D2013] cursor-pointer transition-colors shrink-0 ${
                  player.requested 
                    ? 'bg-[#6F655D] text-[#FEF4E0] cursor-not-allowed opacity-80' 
                    : 'bg-[#E87339] text-[#FEF4E0] hover:bg-[#d0622c]'
                }">
          ${player.requested ? 'REQUESTED' : 'REQUEST'}
        </button>
      </div>

      <div class="border-t border-[#3D2013]/20"></div>

      <div class="grid grid-cols-3 divide-x divide-[#3D2013]/20 font-pixel text-[#3D2013]">
        <div class="flex items-center justify-center gap-1 px-1">
          <svg class="w-3.5 h-3.5 text-[#ED8C00] shrink-0" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.8 9.4Q11 7 12 3q2.5 5 0 10q3 0 5-2.9a7 7 0 1 1-9.2-.7" />
          </svg>
          <div class="flex flex-col text-left">
            <span class="text-[15px] leading-none">${player.streak}</span>
            <span class="text-[10px] text-[#3D2013]/60 leading-tight mt-0.5">STREAK</span>
          </div>
        </div>

        <div class="flex items-center justify-center gap-1 px-1">
          <svg class="w-3.5 h-3.5 text-[#E87339] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7v5l3 3m6-3a9 9 0 1 1-18 0a9 9 0 0 1 18 0" />
          </svg>
          <div class="flex flex-col text-left">
            <span class="text-[15px] leading-none">${player.focusTime}</span>
            <span class="text-[10px] text-[#3D2013]/60 leading-tight mt-0.5">FOCUS</span>
          </div>
        </div>

        <div class="flex items-center justify-center gap-1 px-1">
          <svg class="w-3.5 h-3.5 text-[#E87339] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <g fill="currentColor">
              <path d="M12.75 2a.75.75 0 0 0-.75-.75C6.063 1.25 1.25 6.063 1.25 12S6.063 22.75 12 22.75S22.75 17.937 22.75 12a.75.75 0 0 0-1.5 0A9.25 9.25 0 1 1 12 2.75a.75.75 0 0 0 .75-.75" />
              <path d="M11.735 6.95a.75.75 0 0 0-.884-.585A5.752 5.752 0 0 0 12 17.75a5.75 5.75 0 0 0 5.635-4.601a.75.75 0 0 0-1.47-.299A4.252 4.252 0 0 1 7.75 12a4.25 4.25 0 0 1 3.4-4.165a.75.75 0 0 0 .585-.885" />
              <path d="M14.5 8.44V5.62a2 2 0 0 1 .586-1.414l2.134-2.134a.75.75 0 0 1 1.28.53V5.44l.059.059h2.837a.75.75 0 0 1 .53 1.28l-2.133 2.134a2 2 0 0 1-1.414.586H15.56l-3.03 3.03a.75.75 0 1 1-1.061-1.06z" />
            </g>
          </svg>
          <div class="flex flex-col text-left">
            <span class="text-[15px] leading-none">${player.sessions}</span>
            <span class="text-[10px] text-[#3D2013]/60 leading-tight mt-0.5">SESSIONS</span>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

function filterAddFriendsSearch() {
  const query = document.getElementById("add-friend-search")?.value || "";
  renderAddFriends(query);
}

function requestAddFriend(playerId) {
  const player = addFriendsData.find(p => p.id === playerId);
  if (player) {
    player.requested = true;
    renderAddFriends(document.getElementById("add-friend-search")?.value || "");
  }
}

function renderRequests() {
  const container = document.getElementById("tab-content-requests");
  if (!container) return;

  if (requestsData.length === 0) {
    container.innerHTML = `<div class="text-center font-pressstart text-[10px] text-[#3D2013]/60 py-6">No friend requests.</div>`;
    return;
  }

  container.innerHTML = requestsData.map((req) => `
    <div id="request-card-${req.id}" class="flex items-center justify-between bg-[#FEF4E0] border-[2px] border-[#3D2013] p-2.5 transition-all duration-300">
      <div class="flex items-center gap-2.5 min-w-0">
        <img src="${req.avatar}" alt="${req.username}" class="w-8 h-8 rounded-full border-[2px] border-[#3D2013] bg-[#FEF4E0] object-cover shrink-0">
        <div class="flex flex-col min-w-0">
          <span class="font-pressstart text-[10px] text-[#3D2013] break-words whitespace-normal leading-tight">${req.username}</span>
          <span class="font-pressstart text-[8px] text-[#3D2013]/70">LVL ${req.level}</span>
        </div>
      </div>

      <div class="font-pressstart text-[8px] text-[#3D2013]/60 shrink-0 px-2">
        ${req.timeAgo}
      </div>

      <div id="request-actions-${req.id}" class="flex items-center gap-1.5 shrink-0">
        ${
          req.status === "ACCEPTED" 
            ? `<span class="font-pressstart text-[9px] text-[#788D55]">ACCEPTED</span>` 
            : req.status === "REJECTED" 
            ? `<span class="font-pressstart text-[9px] text-[#A53914]">REJECTED</span>` 
            : `
              <button onclick="handleRequest('${req.id}', 'ACCEPT')" title="Accept" class="p-1 text-[#788D55] hover:text-[#637545] cursor-pointer transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              </button>
              <button onclick="handleRequest('${req.id}', 'REJECT')" title="Reject" class="p-1 text-[#A53914] hover:text-[#832c0f] cursor-pointer transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            `
        }
      </div>
    </div>
  `).join("");
}

function handleRequest(reqId, action) {
  const req = requestsData.find(r => r.id === reqId);
  if (!req) return;

  req.status = action === "ACCEPT" ? "ACCEPTED" : "REJECTED";
  renderRequests();

  setTimeout(() => {
    const card = document.getElementById(`request-card-${reqId}`);
    if (card) {
      card.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        requestsData = requestsData.filter(r => r.id !== reqId);
        renderRequests();
      }, 300);
    }
  }, 1000);
}

// --- CHAT MODAL LOGIC ---
function openChatModal(friendId) {
  const friend = myFriendsData.find(f => f.id === friendId);
  if (!friend) return;

  currentChatFriend = friend;
  document.getElementById("chat-user-pfp").src = friend.avatar;
  document.getElementById("chat-user-name").textContent = friend.username;

  const statusEl = document.getElementById("chat-user-status");
  if (statusEl) {
    statusEl.textContent = friend.status;
    statusEl.classList.remove("text-[#788D55]", "text-[#E87339]", "text-[#6F655D]");

    if (friend.status === "GROUPED") statusEl.classList.add("text-[#E87339]");
    else if (friend.status === "OFFLINE") statusEl.classList.add("text-[#6F655D]");
    else statusEl.classList.add("text-[#788D55]");
  }

  const msgContainer = document.getElementById("chat-messages-container");
  if (!msgContainer) return;

  msgContainer.innerHTML = `<div class="text-center font-pressstart text-[8px] text-[#3D2013]/60 py-2">Start of conversation with ${friend.username}</div>`;

  const history = mockChatHistory[friend.id] || [
    { sender: "them", text: `Hey there! Glad to connect.` },
    { sender: "me", text: "Hey! Let's get some study sessions done today! 📚" }
  ];

  history.forEach(msg => appendMessageBubble(msg.text, msg.sender === "me"));
  msgContainer.scrollTop = msgContainer.scrollHeight;

  openModal("chat-modal");
}

function appendMessageBubble(text, isUser = true) {
  const msgContainer = document.getElementById("chat-messages-container");
  if (!msgContainer) return;

  const msgBubble = document.createElement("div");
  msgBubble.className = isUser 
    ? "self-end bg-[#FAE9CE] text-[#3D2013] border-[1.5px] border-[#3D2013] rounded-[6px] px-2.5 py-1.5 font-pixel text-[15px] max-w-[80%] break-words"
    : "self-start bg-[#E87339] text-[#FEF4E0] border-[1.5px] border-[#3D2013] rounded-[6px] px-2.5 py-1.5 font-pixel text-[15px] max-w-[80%] break-words";

  msgBubble.textContent = text;
  msgContainer.appendChild(msgBubble);
}

function sendChatMessage(text) {
  appendMessageBubble(text, true);

  if (currentChatFriend) {
    // 1. Update mockChatHistory
    if (!mockChatHistory[currentChatFriend.id]) mockChatHistory[currentChatFriend.id] = [];
    mockChatHistory[currentChatFriend.id].push({ sender: "me", text });

    // 2. Update notificationFriendsData preview
    const notifFriend = notificationFriendsData.find(f => f.id === currentChatFriend.id);
    if (notifFriend) {
      notifFriend.lastMessage = text;
      notifFriend.timeAgo = "Just now";
      renderNotificationFriends(document.getElementById("notif-friends-search")?.value || "");
    }
  }

  const msgContainer = document.getElementById("chat-messages-container");
  if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
}

// --- REMOVE FRIEND LOGIC ---
function openRemoveFriendModal(friendId) {
  const friend = myFriendsData.find(f => f.id === friendId);
  if (!friend) return;

  pendingRemoveFriendId = friendId;
  document.getElementById("remove-friend-target-name").textContent = friend.username;
  openModal("remove-friend-modal");
}

function executeRemoveFriend() {
  if (!pendingRemoveFriendId) return;

  const friendId = pendingRemoveFriendId;
  closeModal("remove-friend-modal");

  const card = document.getElementById(`friend-card-${friendId}`);
  if (card) {
    card.classList.add("opacity-0", "scale-95");
    setTimeout(() => {
      myFriendsData = myFriendsData.filter(f => f.id !== friendId);
      renderMyFriends();
      pendingRemoveFriendId = null;
    }, 300);
  }
}

// --- NOTIFICATION COMPONENT LOGIC ---
function renderNotificationFriends(searchQuery = "") {
  const container = document.getElementById("notif-friends-container");
  if (!container) return;

  const filtered = notificationFriendsData.filter(friend => 
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filtered.length === 0) {
    container.innerHTML = `<div class="text-center font-pressstart text-[10px] text-[#3D2013]/60 py-6">No notifications found.</div>`;
    return;
  }

  container.innerHTML = filtered.map((friend) => {
    let statusBg = "bg-[#788D55]";
    if (friend.status === "GROUPED") statusBg = "bg-[#E87339]";
    if (friend.status === "OFFLINE") statusBg = "bg-[#6F655D]";

    const cardBg = friend.isUnread 
      ? "bg-[#FDE4D0] border-[2px] border-[#E87339] shadow-sm" 
      : "bg-[#FEF4E0] border-[2px] border-[#3D2013]";

    return `
      <div id="notif-friend-card-${friend.id}" 
           onclick="handleOpenNotifChat('${friend.id}')"
           class="flex items-center justify-between gap-3 ${cardBg} p-2.5 rounded-[8px] cursor-pointer hover:bg-[#F3D3A8] transition-all duration-200">
        
        <!-- Left Section: Avatar + Info -->
        <div class="flex items-center gap-2.5 min-w-0 flex-1">
          <div class="relative w-9 h-9 shrink-0">
            <img src="${friend.avatar}" alt="${friend.username}" class="w-full h-full rounded-full border-[2px] border-[#3D2013] object-cover bg-[#FEF4E0]">
            <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-[1.5px] border-[#3D2013] ${statusBg}"></span>
          </div>

          <div class="flex flex-col min-w-0 flex-1">
            <span class="font-pressstart text-[9px] text-[#3D2013] truncate">${friend.username}</span>
            <span class="font-pixel text-[13px] text-[#3D2013]/70 truncate leading-tight">${friend.lastMessage || ""}</span>
          </div>
        </div>

        <!-- Right Section: Time Badge -->
        <div class="font-pressstart text-[7px] text-[#3D2013]/60 shrink-0">
          ${friend.timeAgo || ""}
        </div>

      </div>
    `;
  }).join("");
}
function filterNotificationFriendsSearch() {
  const input = document.getElementById("notif-friends-search");
  if (input) renderNotificationFriends(input.value);
}

function updateUnreadNotifBadge() {
  const unreadCount = notificationFriendsData.filter(f => f.isUnread).length;
  playerData.notif_number = unreadCount;
  const notifBadgeEl = document.getElementById("notif-badge");
  const notifNumberEl = document.getElementById("notif-number");

  if (notifBadgeEl && notifNumberEl) {
    if (unreadCount > 0) {
      notifNumberEl.textContent = unreadCount;
      notifBadgeEl.classList.remove("hidden");
    } else {
      notifBadgeEl.classList.add("hidden");
    }
  }
}

function handleOpenNotifChat(friendId) {
  const friend = notificationFriendsData.find(f => f.id === friendId);
  if (friend) friend.isUnread = false;

  updateUnreadNotifBadge();
  renderNotificationFriends(document.getElementById("notif-friends-search")?.value || "");
  closeModal("notification-modal");
  openChatModal(friendId);
}