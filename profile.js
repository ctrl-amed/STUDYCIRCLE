/**
 * Mock Profile Data Store
 * Modify this object to change default test values, badge ordering, or level boundaries.
 */
const profileMockData = {
  name: "Alex Rivera",
  username: "AlexR_Study",
  email: "alex.rivera@example.com",
  level: 9,
  currentXP: 9000,
  maxXP: 10000,
  coins: 12234,
  streakDays: 2,
  friendsCount: 5,
  stats: {
    totalStudyHours: 120.5,
    roomsCreated: 14,
    avgQuizScore: 92, // Percentage
    bestStreakDays: 18,
    lifetimeCoins: 4500
  },
  // You can easily reorder or add badge images here
  badges: [
    "media/badge1.png",
    "media/badge2.png",
    "media/badge3.png",
    "media/badge4.png",
    "media/badge5.png",
    "media/badge6.png"
  ]
};

/**
 * Tab Navigation Switcher
 */
function switchTab(tabName) {
  const btnBadges = document.getElementById('tab-badges');
  const btnAnalytics = document.getElementById('tab-analytics');
  const btnSettings = document.getElementById('tab-settings');

  const formBadges = document.getElementById('form-badges');
  const formAnalytics = document.getElementById('form-analytics');
  const formSettings = document.getElementById('form-settings');

  const chosenStyle = 'flex-1 min-h-[42px] flex items-center justify-center text-center bg-[#E87339] text-[#FFFFF6] border-[3px] border-[#3D2013] !rounded-none px-1.5 sm:px-2 py-1.5 font-pressstart text-[8px] min-[380px]:text-[9px] sm:text-[11px] leading-tight tracking-tight cursor-default transition-all duration-150';
  const unchosenStyle = 'flex-1 min-h-[42px] flex items-center justify-center text-center bg-[#FAE9CE] text-[#3D2013] border-[3px] border-[#3D2013] !rounded-none px-1.5 sm:px-2 py-1.5 font-pressstart text-[8px] min-[380px]:text-[9px] sm:text-[11px] leading-tight tracking-tight cursor-pointer flat-retro-shadow-hover transition-all duration-150';

  // Hide all forms
  [formBadges, formAnalytics, formSettings].forEach(form => {
    if (form) {
      form.classList.add('hidden');
      form.classList.remove('flex');
    }
  });

  // Reset all buttons to unchosen style
  if (btnBadges) btnBadges.className = unchosenStyle;
  if (btnAnalytics) btnAnalytics.className = unchosenStyle;
  if (btnSettings) btnSettings.className = unchosenStyle;

  // Set selected tab to active style
  if (tabName === 'badges' && formBadges && btnBadges) {
    formBadges.classList.remove('hidden');
    formBadges.classList.add('flex');
    btnBadges.className = chosenStyle;
  } else if (tabName === 'analytics' && formAnalytics && btnAnalytics) {
    formAnalytics.classList.remove('hidden');
    formAnalytics.classList.add('flex');
    btnAnalytics.className = chosenStyle;
  } else if (tabName === 'settings' && formSettings && btnSettings) {
    formSettings.classList.remove('hidden');
    formSettings.classList.add('flex');
    btnSettings.className = chosenStyle;
  }
}
/**
 * Render Badges Dynamically
 * To change badge order, modify the profileMockData.badges array.
 */
function renderBadges(badgeList) {
  const container = document.getElementById('badges-container');
  if (!container) return;

  container.innerHTML = ''; // Clear container

  badgeList.forEach((badgeSrc, index) => {
    const img = document.createElement('img');
    img.src = badgeSrc;
    img.alt = `Badge ${index + 1}`;
    img.className = 'w-20 h-20 sm:w-25 sm:h-25 object-contain shrink-0';
    container.appendChild(img);
  });
}

/**
 * Populate Profile Page UI from Data Store
 */
function loadProfileUI(data) {
  // 1. Profile Header & Card
  document.getElementById('profile-name').textContent = data.name;
  document.getElementById('profile-username').textContent = `@${data.username.replace(/^@/, '')}`;
  document.getElementById('player-level').textContent = data.level;

  // 2. Calculated Progress Bar & XP Ratio
  const percentage = Math.min(100, Math.max(0, (data.currentXP / data.maxXP) * 100));
  const xpBarFill = document.getElementById('xp-bar-fill');
  const xpText = document.getElementById('xp-text');
  
  if (xpBarFill) xpBarFill.style.width = `${percentage}%`;
  if (xpText) xpText.textContent = `${data.currentXP.toLocaleString()}/${data.maxXP.toLocaleString()} XP`;

  // 3. Status Badges
  document.getElementById('coins-count').textContent = data.coins.toLocaleString();
  document.getElementById('streak-count').textContent = `${data.streakDays}d`;
  document.getElementById('friends-count').textContent = `${data.friendsCount}`;

  // 4. Detailed Stat Cards
  document.getElementById('stat-study-hrs').textContent = data.stats.totalStudyHours;
  document.getElementById('stat-rooms').textContent = data.stats.roomsCreated;
  document.getElementById('stat-quiz').textContent = `${data.stats.avgQuizScore}%`;
  document.getElementById('stat-streak').textContent = `${data.stats.bestStreakDays} Days`;
  document.getElementById('stat-coins').textContent = data.stats.lifetimeCoins.toLocaleString();

  // 5. Populate Form Inputs in Settings Tab
  document.getElementById('settings-email').value = data.email;
  document.getElementById('settings-username').value = data.username;
  document.getElementById('settings-name').value = data.name;

  // 6. Render Badges
  renderBadges(data.badges);
}

/**
 * Form Submit Listener - Live Sync Name & Username
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initial load
  loadProfileUI(profileMockData);

  const settingsForm = document.getElementById('form-settings');
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Read form input values
      const updatedName = document.getElementById('settings-name').value.trim();
      const updatedUsername = document.getElementById('settings-username').value.trim();
      const updatedEmail = document.getElementById('settings-email').value.trim();

      const oldPass = document.getElementById('settings-old-pass').value;
      const newPass = document.getElementById('settings-new-pass').value;
      const confirmPass = document.getElementById('settings-confirm-pass').value;

      // Update Local Data Model
      if (updatedName) profileMockData.name = updatedName;
      if (updatedUsername) profileMockData.username = updatedUsername;
      if (updatedEmail) profileMockData.email = updatedEmail;

      // Synchronize Card UI
      loadProfileUI(profileMockData);

      // Clear password fields
      document.getElementById('settings-old-pass').value = '';
      document.getElementById('settings-new-pass').value = '';
      document.getElementById('settings-confirm-pass').value = '';

      alert('Profile details updated successfully!');
    });
  }
});