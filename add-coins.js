// ==========================================
// CENTRALIZED COIN SYSTEM & STORAGE
// ==========================================

const COINS_KEY = 'player_user_coins';

/**
 * Gets current coin balance from localStorage
 */
function getCoins() {
  const saved = localStorage.getItem(COINS_KEY);
  // Default to 1000 starting coins
  return saved !== null ? parseInt(saved, 10) : 1000;
}

/**
 * Directly sets a new coin total in localStorage
 */
function setCoins(amount) {
  const finalAmount = Math.max(0, amount);
  localStorage.setItem(COINS_KEY, finalAmount.toString());
  updateCoinDisplays();
}

/**
 * Updates all coin text displays on the active page
 */
function updateCoinDisplays() {
  const currentCoins = getCoins();
  
  // Updates any element with class="user-coin-balance" or id="user-coin-balance"
  const coinElements = document.querySelectorAll('.user-coin-balance, #user-coin-balance');
  coinElements.forEach(el => {
    el.textContent = currentCoins.toLocaleString();
  });

  // Keep in sync with global playerData if present
  if (typeof playerData !== 'undefined' && playerData !== null) {
    playerData.coins = currentCoins;
  }
}

/**
 * Adds coins, saves to localStorage, and updates UI on all tabs/pages
 */
function addCoins(amount) {
  const currentCoins = getCoins();
  setCoins(currentCoins + amount);
}

/**
 * Deducts coins if sufficient balance exists
 * @returns {boolean} true if successful, false if insufficient balance
 */
function deductCoins(amount) {
  const currentCoins = getCoins();
  if (currentCoins < amount) {
    return false;
  }
  setCoins(currentCoins - amount);
  return true;
}

// Automatically populate coin displays when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  updateCoinDisplays();
});

// Listen for coin updates from other open browser tabs
window.addEventListener('storage', (event) => {
  if (event.key === COINS_KEY) {
    updateCoinDisplays();
  }
});


// ==========================================
// ADD COINS MODAL CONTROLLER & LOGIC
// ==========================================

// Track selected amount (defaults to 1250)
let selectedCoinAmount = "1250";

/**
 * Handles package selection
 */
function selectCoinPackage(selectedBtn) {
  const allCards = document.querySelectorAll('#add-coins-modal .coin-card');
  
  selectedCoinAmount = selectedBtn.getAttribute('data-package');

  allCards.forEach(card => {
    card.classList.remove('selected-card');
    const badge = card.querySelector('.check-badge');
    if (badge) badge.classList.add('hidden');
  });

  selectedBtn.classList.add('selected-card');
  const activeBadge = selectedBtn.querySelector('.check-badge');
  if (activeBadge) activeBadge.classList.remove('hidden');
}

/**
 * Handles purchase simulation
 */
function processPurchase() {
  const selectionView = document.getElementById('coin-modal-selection');
  const loadingView = document.getElementById('coin-modal-loading');
  const successView = document.getElementById('coin-modal-success');

  if (selectionView) selectionView.classList.add('hidden');
  if (loadingView) loadingView.classList.remove('hidden');

  setTimeout(() => {
    if (loadingView) loadingView.classList.add('hidden');
    if (successView) successView.classList.remove('hidden');

    const amountNum = parseInt(selectedCoinAmount, 10) || 0;

    const purchasedLabel = document.getElementById('purchased-coin-amount');
    if (purchasedLabel) {
      purchasedLabel.textContent = amountNum.toLocaleString();
    }

    // Automatically adds purchased amount & updates UI everywhere
    addCoins(amountNum);

    if (typeof updateDashboardState === 'function') {
      updateDashboardState();
    }

    showCoinSuccessToast();
  }, 2000);
}

/**
 * Toast Notification Generator
 */
function showCoinSuccessToast() {
  let toastContainer = document.getElementById('toast-container');
  
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed top-5 right-5 z-[70] flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = "bg-[#FBF2E3] border-2 sm:border-4 border-[#3D2013] pt-3 sm:pt-4 px-3 sm:px-4 pb-0 flex flex-col gap-2 sm:gap-3 relative shadow-md transition-all duration-300 w-full max-w-[260px] sm:max-w-xs md:max-w-sm lg:max-w-md retro-shadow pointer-events-auto opacity-0 translate-y-[-20px] !rounded-none overflow-hidden fixed top-10 sm:top-6 lg:top-13 z-[70]";

  toast.style.boxShadow = "4px 4px 0px #3D2013";

  toast.innerHTML = `
    <div class="flex items-center gap-2 sm:gap-3 pr-1 sm:pr-2">
      <svg class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="#788D55" stroke-width="4" stroke-linecap="square" stroke-linejoin="square"/>
      </svg>
      
      <span class="font-pressstart text-[6px] sm:text-[8px] md:text-[10px] lg:text-[12px] text-[#482A1D] whitespace-nowrap tracking-wide leading-snug">
        Purchase successful!
      </span>
    </div>
    
    <div class="w-full bg-transparent h-1 sm:h-1.5 flex justify-center mt-auto overflow-hidden">
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

/**
 * Resets modal to Step 1 (Selection View) and resets selected card
 */
function resetCoinModal() {
  const selectionView = document.getElementById('coin-modal-selection');
  const loadingView = document.getElementById('coin-modal-loading');
  const successView = document.getElementById('coin-modal-success');

  if (selectionView) {
    selectionView.classList.remove('hidden');
    selectionView.style.display = '';
  }
  if (loadingView) {
    loadingView.classList.add('hidden');
  }
  if (successView) {
    successView.classList.add('hidden');
  }

  // Reset selected amount and cards to default (1250 Popular Card)
  selectedCoinAmount = "1250";
  const allCards = document.querySelectorAll('#add-coins-modal .coin-card');
  allCards.forEach(card => {
    const isPopularCard = card.getAttribute('data-package') === '1250';
    const badge = card.querySelector('.check-badge');

    if (isPopularCard) {
      card.classList.add('selected-card');
      if (badge) badge.classList.remove('hidden');
    } else {
      card.classList.remove('selected-card');
      if (badge) badge.classList.add('hidden');
    }
  });
}

// Global Modal Open/Close Helpers
window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    if (modalId === 'add-coins-modal') {
      resetCoinModal(); // Ensures fresh state every time modal opens
    }
    modal.classList.remove('hidden');
  }
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    
    // Slight delay before reset so user doesn't see UI jump during closing
    if (modalId === 'add-coins-modal') {
      setTimeout(() => {
        resetCoinModal();
      }, 150);
    }
  }
};