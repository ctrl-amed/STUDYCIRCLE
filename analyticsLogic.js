// ==========================================
// STUDYCIRCLE ANALYTICS & REWARDS LOGIC ENGINE
// ==========================================

/**
 * Level Up System Thresholds (XP needed for the next level)
 */
const LEVEL_THRESHOLDS = {
  1: 100, 2: 150, 3: 200, 4: 250, 5: 300,
  6: 350, 7: 400, 8: 450, 9: 500, 10: 550,
  11: 600, 12: 650, 13: 700, 14: 750, 15: 800,
  16: 850, 17: 900, 18: 1000, 19: 1050,
  49: 2500, 50: "MAX LEVEL"
};

/**
 * Computes Streak XP Multiplier based on user streak days
 */
function getStreakMultiplier(streakDays) {
  if (streakDays >= 100) return 3.0;
  if (streakDays >= 80) return 2.5;
  if (streakDays >= 30) return 2.0;
  if (streakDays >= 21) return 1.75;
  if (streakDays >= 14) return 1.5;
  if (streakDays >= 7) return 1.25;
  if (streakDays >= 3) return 1.1;
  return 1.0;
}

/**
 * Computes Study Duration XP and Coins Bonus
 * Rules:
 * - < 1 hour: +5 XP / +5 Coins
 * - 1–2 hours: +10 XP / +10 Coins
 * - 2–3 hours: +15 XP / +15 Coins
 * - 3+ hours: +20 XP / +20 Coins
 */
function getDurationBonus(durationMinutes) {
  const hours = durationMinutes / 60;
  if (hours >= 3) return { xp: 20, coins: 20, label: "Study for 3+ hours" };
  if (hours >= 2) return { xp: 15, coins: 15, label: "Study for 2-3 hours" };
  if (hours >= 1) return { xp: 10, coins: 10, label: "Study for 1-2 hours" };
  return { xp: 5, coins: 5, label: "Study for < 1 hour" };
}

/**
 * Main Solo Post-Session Analytics & Rewards Calculator
 * @param {Object} sessionInput 
 * - startTime: Timestamp o Date object
 * - endTime: Timestamp o Date object
 * - completedTasks: Bilang ng natapos na tasks
 * - totalTasks: Kabuuang bilang ng tasks
 * - preTestScore: Porsyento (hal. 72)
 * - postTestScore: Porsyento (hal. 84)
 * - userStreak: Araw ng sunod-sunod na pag-aaral (hal. 7)
 */
function processSessionResults(sessionInput) {
  const {
    startTime,
    endTime,
    completedTasks = 4,
    totalTasks = 4,
    preTestScore = 72,
    postTestScore = 84,
    userStreak = 7
  } = sessionInput;

  // 1. DURATION CALCULATION (End Time - Start Time)
  const durationMs = new Date(endTime) - new Date(startTime);
  const durationMinutes = Math.max(0, Math.floor(durationMs / 60000));
  const durationFormatted = formatDuration(durationMinutes);

  // 2. IMPROVEMENT CALCULATION (Post-Test - Pre-Test)
  const improvementScore = postTestScore - preTestScore;
  const improvementFormatted = (improvementScore >= 0 ? `+${improvementScore}%` : `${improvementScore}%`);

  // 3. XP DISTRIBUTION COMPUTATION
  const taskXp = completedTasks * 10;            // +10 XP per task (+40 XP para sa 4 tasks)
  const sessionCompletionXp = 5;                // +5 XP para sa pagtapos ng session
  const durationBonus = getDurationBonus(durationMinutes);
  
  const baseTotalXp = taskXp + sessionCompletionXp + durationBonus.xp;

  // Apply Streak Multiplier (e.g., 7 days = 1.25x)
  const multiplier = getStreakMultiplier(userStreak);
  const finalXpEarned = Math.round(baseTotalXp * multiplier); // Rounded as specified in PDF

  // 4. COINS DISTRIBUTION COMPUTATION
  const taskCoins = completedTasks * 5;         // +5 coins per task (+20 coins para sa 4 tasks)
  const sessionCompletionCoins = 5;             // +5 coins session completion bonus
  const totalCoinsEarned = taskCoins + sessionCompletionCoins + durationBonus.coins;

  return {
    analytics: {
      duration: durationFormatted,
      completedTasksRatio: `${completedTasks}/${totalTasks}`,
      avgScore: `${postTestScore}%`,
      preTest: `${preTestScore}%`,
      postTest: `${postTestScore}%`,
      improvement: improvementFormatted
    },
    rewards: {
      level: 10, // Pwedeng i-dynamic base sa user profile
      xpEarned: finalXpEarned,
      coinsEarned: totalCoinsEarned,
      xpBreakdown: {
        completedTasksXp: taskXp,
        focusTimeXp: durationBonus.xp,
        sessionBonusXp: sessionCompletionXp,
        streakMultiplier: multiplier,
        baseTotal: baseTotalXp,
        total: finalXpEarned
      },
      coinsBreakdown: {
        completedTasksCoins: taskCoins,
        focusTimeCoins: durationBonus.coins,
        sessionBonusCoins: sessionCompletionCoins,
        total: totalCoinsEarned
      }
    }
  };
}

/**
 * Helper to format minutes into "1hr 30m" format
 */
function formatDuration(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0 && mins > 0) return `${hrs}hr ${mins}m`;
  if (hrs > 0) return `${hrs}hr`;
  return `${mins}m`;
}