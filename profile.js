/**
 * Mock Profile Data Store (Fallback if backend values are missing)
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
 * Tab Navigation Switcher (Badges, Analytics, Settings)
 */
function switchTab(tabName) {
  const btnBadges = document.getElementById('tab-badges');
  const btnAnalytics = document.getElementById('tab-analytics');
  const btnSettings = document.getElementById('tab-settings');

  const formBadges = document.getElementById('form-badges');
  const formAnalytics = document.getElementById('form-analytics');
  const formSettings = document.getElementById('form-settings');

  const chosenStyle = 'flex-1 text-center bg-[#E87339] text-[#FFFFF6] border-[3px] border-[#3D2013] !rounded-none py-3 px-2 font-pressstart text-[10px] sm:text-[12px] tracking-tight cursor-default transition-all duration-150';
  const unchosenStyle = 'flex-1 text-center bg-[#FAE9CE] text-[#3D2013] border-[3px] border-[#3D2013] !rounded-none py-3 px-2 font-pressstart text-[10px] sm:text-[12px] tracking-tight cursor-pointer flat-retro-shadow-hover transition-all duration-150';

  // Hide all forms
  [formBadges, formAnalytics, formSettings].forEach(form => {
    if (form) {
      form.classList.add('hidden');
      form.classList.remove('flex');
    }
  });

  // Reset all buttons
  if (btnBadges) btnBadges.className = unchosenStyle;
  if (btnAnalytics) btnAnalytics.className = unchosenStyle;
  if (btnSettings) btnSettings.className = unchosenStyle;

  // Show selected form and set active style
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
 */
function renderBadges(badgeList) {
  const container = document.getElementById('badges-container');
  if (!container) {
    console.error("Could not find 'badges-container' in the HTML!");
    return; 
  }

  container.innerHTML = ''; // Clear container

  // Clean up the array (prevents empty strings from rendering as broken images)
  const validBadges = badgeList ? badgeList.filter(b => b && b.trim() !== "") : [];

  if (validBadges.length === 0) {
    container.innerHTML = '<p class="font-pixel text-[10px] sm:text-[12px] text-[#3D2013]/60 italic mt-2">No badges unlocked yet</p>';
    return;
  }

  validBadges.forEach((badgeSrc, index) => {
    const img = document.createElement('img');
    img.src = badgeSrc; // Points to "media/badge1.png"
    img.alt = `Badge ${index + 1}`;
    img.className = 'w-20 h-20 sm:w-25 sm:h-25 object-contain shrink-0';
    
    // ERROR CATCHER: If the image path is broken, this will highlight it in red
    img.onerror = () => {
        console.error(`❌ Failed to load badge image at path: ${badgeSrc}`);
        img.style.border = "2px dashed red"; 
        img.style.padding = "5px";
    };
    
    container.appendChild(img);
  });
}

/**
 * Populate Profile Page UI from Data Store or Server Data
 */
function loadProfileUI(data) {
  // 1. Profile Header & Card
  const profileName = document.getElementById('profile-name');
  const profileUsername = document.getElementById('profile-username');
  const playerLevel = document.getElementById('player-level');

  if (profileName) profileName.textContent = data.name || "Name";
  if (profileUsername) profileUsername.textContent = `@${(data.username || "User_name").replace(/^@/, '')}`;
  if (playerLevel) playerLevel.textContent = data.level || 1;

  // --- AVATAR SYSTEM SYNC ---
  // Fall back to existing session storage config or default config if backend value is empty
  let avatarConfig = data.avatarUrl;
  if (!avatarConfig || avatarConfig.trim() === "") {
    avatarConfig = sessionStorage.getItem("user_avatar_config");
  }

  if (avatarConfig) {
    sessionStorage.setItem("user_avatar_config", typeof avatarConfig === 'string' ? avatarConfig : JSON.stringify(avatarConfig));
    
    let parsedConfig = avatarConfig;
    try {
      while (typeof parsedConfig === 'string') {
        parsedConfig = JSON.parse(parsedConfig);
      }
    } catch (e) {
      parsedConfig = { body: "BODY1", face: "FACE1", tops: "TOP7", bottoms: "BOTTOM6" };
    }

    window.dispatchEvent(new CustomEvent("avatar-updated", { 
      detail: parsedConfig 
    }));
  } else {
    // Force a default dispatch if nothing exists anywhere
    window.dispatchEvent(new CustomEvent("avatar-updated", { 
      detail: { body: "BODY1", face: "FACE1", tops: "TOP7", bottoms: "BOTTOM6" } 
    }));
  }

  // 2. Calculated Progress Bar & XP Ratio
  const currentXP = data.currentXP || 0;
  const maxXP = data.maxXP || 10000;
  const percentage = Math.min(100, Math.max(0, (currentXP / maxXP) * 100));
  
  const xpBarFill = document.getElementById('xp-bar-fill');
  const xpText = document.getElementById('xp-text');
  
  if (xpBarFill) xpBarFill.style.width = `${percentage}%`;
  if (xpText) xpText.textContent = `${currentXP.toLocaleString()}/${maxXP.toLocaleString()} XP`;

  // 3. Status Badges
  const coinsCount = document.getElementById('coins-count');
  const streakCount = document.getElementById('streak-count');
  const friendsCount = document.getElementById('friends-count');

  if (coinsCount) coinsCount.textContent = (data.coins || 0).toLocaleString();
  if (streakCount) streakCount.textContent = `${data.streakDays || 0}d`;
  if (friendsCount) friendsCount.textContent = `${data.friendsCount || 0}`;

  // 4. Detailed Stat Cards
  const stats = data.stats || {};
  const statStudyHrs = document.getElementById('stat-study-hrs');
  const statRooms = document.getElementById('stat-rooms');
  const statQuiz = document.getElementById('stat-quiz');
  const statStreak = document.getElementById('stat-streak');
  const statCoins = document.getElementById('stat-coins');

  if (statStudyHrs) statStudyHrs.textContent = stats.totalStudyHours || "0 hrs";
  if (statRooms) statRooms.textContent = stats.roomsCreated || 0;
  if (statQuiz) statQuiz.textContent = `${stats.avgQuizScore || 0}%`;
  if (statStreak) statStreak.textContent = `${stats.bestStreakDays || data.streakDays || 0} Days`;
  if (statCoins) statCoins.textContent = (stats.lifetimeCoins || data.coins || 0).toLocaleString();

  // --- 4.1 WSA ANALYTICS CALCULATION SYNC ---
  const avgQuiz = stats.avgQuizScore || 0;
  const studyHrs = parseFloat(stats.totalStudyHours) || 0;
  const rooms = stats.roomsCreated || 0;

  const c1 = Math.round(((avgQuiz / 100) * 40) * 10) / 10;
  const c2 = Math.round((Math.min(35, (studyHrs / 50) * 35)) * 10) / 10;
  const c3 = Math.round((Math.min(25, (rooms / 10) * 25)) * 10) / 10;
  const totalWSA = Math.round((c1 + c2 + c3) * 10) / 10;

  const wsaTotalScore = document.getElementById('wsa-total-score');
  const wsaC1Score = document.getElementById('wsa-c1-score');
  const wsaC1Bar = document.getElementById('wsa-c1-bar');
  const wsaC2Score = document.getElementById('wsa-c2-score');
  const wsaC2Bar = document.getElementById('wsa-c2-bar');
  const wsaC3Score = document.getElementById('wsa-c3-score');
  const wsaC3Bar = document.getElementById('wsa-c3-bar');

  if (wsaTotalScore) wsaTotalScore.textContent = totalWSA;
  if (wsaC1Score) wsaC1Score.textContent = `${c1} / 40 pts`;
  if (wsaC1Bar) wsaC1Bar.style.width = `${(c1 / 40) * 100}%`;

  if (wsaC2Score) wsaC2Score.textContent = `${c2} / 35 pts`;
  if (wsaC2Bar) wsaC2Bar.style.width = `${(c2 / 35) * 100}%`;

  if (wsaC3Score) wsaC3Score.textContent = `${c3} / 25 pts`;
  if (wsaC3Bar) wsaC3Bar.style.width = `${(c3 / 25) * 100}%`;

  // 5. Populate Form Inputs in Settings Tab
  const settingsEmail = document.getElementById('settings-email');
  const settingsUsername = document.getElementById('settings-username');
  const settingsName = document.getElementById('settings-name');

  if (settingsEmail) settingsEmail.value = data.email || "";
  if (settingsUsername) settingsUsername.value = data.username || "";
  if (settingsName) settingsName.value = data.name || "";

  // 6. Render Badges
  renderBadges(data.badges || profileMockData.badges);
}

/**
 * Fetch Live Data from Backend API (/me) on Load
 */
async function fetchBackendProfile() {
  const token = sessionStorage.getItem("token");

  if (!token) {
    window.location.href = "authentication.html#login";
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:5000/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      sessionStorage.removeItem("token");
      window.location.href = "authentication.html#login";
      return;
    }

    const userData = await response.json();

    // Map backend user response into the data object structure
    const liveData = {
      name: userData.name || userData.username,
      username: userData.username,
      email: userData.email,
      level: userData.level || 1,
      currentXP: userData.currentXP || 0,
      maxXP: userData.maxXP || 10000,
      coins: userData.coins || 0,
      streakDays: userData.streakDays || 0,
      friendsCount: userData.friendsCount || 0,
      avatarUrl: userData.avatarUrl || "",
      stats: {
        totalStudyHours: userData.totalStudyHours || 0,
        roomsCreated: userData.roomsCreated || 0,
        avgQuizScore: userData.avgQuizScore || 0,
        bestStreakDays: userData.bestStreak || userData.streakDays || 0,
        lifetimeCoins: userData.coins || 0
      },
      badges: userData.badges || profileMockData.badges
    };

    loadProfileUI(liveData);

  } catch (err) {
    console.error("Failed to connect to backend, falling back to mock UI:", err);
    loadProfileUI(profileMockData); // Fallback so page doesn't break offline
  }
}
/**
 * Form Submit Listener - Sync with Backend /update-profile API
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initial load from server
  fetchBackendProfile();

  const settingsForm = document.getElementById('form-settings');
  if (settingsForm) {
    settingsForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const token = sessionStorage.getItem("token");
      const updatedName = document.getElementById('settings-name').value.trim();
      const updatedUsername = document.getElementById('settings-username').value.trim();
      const updatedEmail = document.getElementById('settings-email').value.trim();

      const oldPass = document.getElementById('settings-old-pass').value;
      const newPass = document.getElementById('settings-new-pass').value;
      const confirmPass = document.getElementById('settings-confirm-pass').value;

      // Validate password changes if populated
      if (newPass || oldPass || confirmPass) {
        if (newPass !== confirmPass) {
          alert('New passwords do not match.');
          return;
        }
        if (!oldPass) {
          alert('Please enter your old password to set a new one.');
          return;
        }
      }

      try {
        const response = await fetch("http://127.0.0.1:5000/update-profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            email: updatedEmail,
            username: updatedUsername,
            name: updatedName,
            old_password: oldPass || null,
            new_password: newPass || null
          })
        });

        const data = await response.json();

        if (response.ok) {
          alert('Profile details updated successfully!');

          // Clear password fields
          document.getElementById('settings-old-pass').value = '';
          document.getElementById('settings-new-pass').value = '';
          document.getElementById('settings-confirm-pass').value = '';

          // Reload UI data from server
          fetchBackendProfile();
        } else {
          alert(data.message || 'Failed to update profile.');
        }
      } catch (err) {
        console.error(err);
        alert('Unable to connect to the backend server.');
      }
    });
  }
});