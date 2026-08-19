// ==========================================
// SHARED GLOBAL STATE & UTILITY HELPERS
// ==========================================

// ==========================================
// SHARED GLOBAL STATE & UTILITY HELPERS
// ==========================================

const COINS_KEY = 'player_user_coins';

// Retrieve initial coin value from localStorage or default to 1250
function getSavedCoins() {
  const saved = localStorage.getItem(COINS_KEY);
  return saved !== null ? parseInt(saved, 10) : 1250;
}

// Ensure playerData is globally available without throwing re-declaration errors
window.playerData = window.playerData || {
  username: "ACORN_HERO",
  level: 10,
  currentXP: 4500,
  maxXP: 10000,
  avatarUrl: "",
  coin_number: getSavedCoins(), // Pulls from localStorage automatically
  friends_number: 14,
  streak_number: 7,
  notif_number: 3
};

// Global helper to sync and update coins across components and pages
window.updateGlobalCoins = function(newAmount) {
  const finalAmount = Math.max(0, newAmount);
  localStorage.setItem(COINS_KEY, finalAmount.toString());
  window.playerData.coin_number = finalAmount;
  
  // Update DOM element if it exists on the current page
  const coinNumberEl = document.getElementById("coin-number");
  if (coinNumberEl) {
    coinNumberEl.textContent = finalAmount.toLocaleString();
  }
};

window.addEventListener('storage', (event) => {
  if (event.key === 'player_user_coins') {
    const updatedCoins = parseInt(event.newValue, 10) || 1250;
    if (window.playerData) {
      window.playerData.coin_number = updatedCoins;
    }
    const coinNumberEl = document.getElementById("coin-number");
    if (coinNumberEl) {
      coinNumberEl.textContent = updatedCoins.toLocaleString();
    }
  }
});

// Global helper functions
window.isMobile = window.isMobile || (() => window.innerWidth < 768);

window.openModal = window.openModal || function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("hidden");
};

window.closeModal = window.closeModal || function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("hidden");
};

window.toggleModal = window.toggleModal || function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.toggle("hidden");
};

window.updateGlobalStreak = function(newStreak) {
  const finalStreak = Math.max(0, newStreak);
  
  if (window.playerData) {
    window.playerData.streak_number = finalStreak;
  }
  
  const streakDisplayEl = document.getElementById("streak-display");
  if (streakDisplayEl) {
    streakDisplayEl.textContent = `${finalStreak} ${finalStreak === 1 ? 'day' : 'days'}`;
  }
};

// Open modal & lazy-load iframe
function openKitsuAiModal(event) {
  if (event) event.preventDefault();

  const iframe = document.getElementById("kitsuai-frame");
  const targetUrl = window.location.origin + "/kitsuai.html";
  
  if (iframe && iframe.src !== targetUrl) {
    iframe.src = "kitsuai.html";
  }
  
  openModal("kitsuai-modal");
}

// Close modal wrapper
function closeKitsuAiModal() {
  closeModal("kitsuai-modal");
}