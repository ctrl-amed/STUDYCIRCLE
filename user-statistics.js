// ==========================================
// USER STATISTICS WIDGETS & MOCK DATA
// ==========================================

window.userStatsData = window.userStatsData || {
  streakDays: 0,
  bestStreak: 0,
  totalSessions: 0,
  focusTimeHours: 0,
  focusTimeMinutes: 0,
  
  // Weekly tracker data (Mon to Sun)
  weeklyActivity: [
    { day: "MON", count: 3, completed: true },
    { day: "TUE", count: 5, completed: true },
    { day: "WED", count: 2, completed: true },
    { day: "THU", count: 4, completed: true },
    { day: "FRI", count: 6, completed: true },
    { day: "SAT", count: 0, completed: false }, // Future or empty day example
    { day: "SUN", count: 0, completed: false }
  ],

  // Productive days breakdown (Mon - Sun)
  productiveDays: [
    { day: "Mon", count: 4 },
    { day: "Tue", count: 7 },
    { day: "Wed", count: 5 },
    { day: "Thu", count: 8 },
    { day: "Fri", count: 6 },
    { day: "Sat", count: 2 },
    { day: "Sun", count: 1 }
  ],

  // Heatmap mock daily data generator helper
  heatmapDays: [] // populated on init
};

// Initialize Mock Heatmap Data for the past year (~365 days)
function generateHeatmapMockData() {
  const data = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    // Random activity count weighted slightly
    const rand = Math.random();
    let count = 0;
    if (rand > 0.4) count = Math.floor(Math.random() * 3) + 1;
    if (rand > 0.8) count = Math.floor(Math.random() * 5) + 3;
    
    data.push({
      date: d.toISOString().split('T')[0],
      count: count
    });
  }
  return data;
}

window.userStatsData.heatmapDays = generateHeatmapMockData();

// Render Functions
document.addEventListener("DOMContentLoaded", () => {
  renderHeaderStats();
  renderWeeklyTracker();
  renderHeatmap();
  renderProductiveDays();
});

function renderHeaderStats() {
  const stats = window.userStatsData;
  const streakEl = document.getElementById("stat-streak-days");
  const bestStreakEl = document.getElementById("stat-best-streak");
  const totalSessionsEl = document.getElementById("stat-total-sessions");
  const focusTimeEl = document.getElementById("stat-focus-time");

  // Read lifetime tracking from localStorage
  const totalFocusSec = parseInt(localStorage.getItem("total_focus_seconds") || "0", 10);
  const totalSessionsCount = parseInt(localStorage.getItem("total_sessions_completed") || "0", 10);

  // Convert total focus seconds to hours and minutes
  const hours = Math.floor(totalFocusSec / 3600);
  const minutes = Math.floor((totalFocusSec % 3600) / 60);

  if (streakEl) streakEl.textContent = `${stats.streakDays} Days`;
  if (bestStreakEl) bestStreakEl.textContent = `${stats.bestStreak} Days`;
  
  // Inflate real session count
  if (totalSessionsEl) totalSessionsEl.textContent = totalSessionsCount;

  // Inflate real focus time
  if (focusTimeEl) {
    focusTimeEl.textContent = `${hours}h ${minutes}m`;
  }
}

// Automatically update display in real-time when tracking updates in another tab
window.addEventListener('storage', (event) => {
  if (event.key === 'total_focus_seconds' || event.key === 'total_sessions_completed') {
    renderHeaderStats();
  }
});

function renderWeeklyTracker() {
  const container = document.getElementById("weekly-tracker-container");
  if (!container) return;

  const currentDayIndex = (new Date().getDay() + 6) % 7; // 0 for Mon, 6 for Sun
  const weeklyData = window.userStatsData.weeklyActivity;

  container.innerHTML = weeklyData.map((item, idx) => {
    const isFuture = idx > currentDayIndex;
    const isCurrent = idx === currentDayIndex;
    const countDisplay = isFuture ? "-" : item.count;
    const dotBg = isFuture ? "bg-[#3D2013]/10 border-[#3D2013]/20" : (item.completed ? "bg-[#E87339] border-[#3D2013]" : "bg-[#3D2013]/20 border-[#3D2013]/40");

    return `
      <div class="flex flex-col items-center justify-between p-2 rounded-[8px] bg-[#FEF4E0] border-[2px] ${isCurrent ? 'border-[#E87339] shadow-sm' : 'border-[#3D2013]/30'}">
        <span class="font-pixel text-[13px] sm:text-[15px] text-[#3D2013] uppercase">${item.day}</span>
        <div class="my-2 w-5 h-5 rounded-full border-[1.5px] ${dotBg} flex items-center justify-center"></div>
        <span class="font-pressstart text-[10px] sm:text-[12px] text-[#3D2013]">${countDisplay}</span>
        ${isCurrent ? '<div class="w-full h-[3px] bg-[#E87339] mt-2 rounded-full"></div>' : '<div class="w-full h-[3px] bg-transparent mt-2"></div>'}
      </div>
    `;
  }).join("");
}

function renderHeatmap() {
  const container = document.getElementById("heatmap-container");
  if (!container) return;

  const daysData = window.userStatsData.heatmapDays;
  
  // Group days into columns of 7 (weeks)
  const weeks = [];
  let currentWeek = [];
  
  daysData.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === daysData.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Calculate month labels positions based on the first day of each week
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthsRow = [];
  let lastMonth = -1;

  weeks.forEach((week, weekIndex) => {
    const firstDayOfWeek = new Date(week[0].date);
    const month = firstDayOfWeek.getMonth();
    if (month !== lastMonth) {
      monthsRow.push({ name: monthNames[month], weekIndex });
      lastMonth = month;
    }
  });

  // Build HTML layout with Month headers on top, Day labels on the left, and scrollable grid
  const gridHtml = `
    <div class="flex flex-col gap-2 w-max">
      <!-- Months Header Row -->
      <div class="flex pl-7 relative h-4 font-pixel text-[11px] text-[#3D2013]/70">
        ${monthsRow.map((m, idx) => {
          // Calculate approximate left offset based on week index (each week column is ~20px wide including gaps)
          const nextWeekIdx = monthsRow[idx + 1] ? monthsRow[idx + 1].weekIndex : weeks.length;
          const spanWeeks = nextWeekIdx - m.weekIndex;
          return `<div style="width: ${spanWeeks * 20}px;" class="shrink-0">${m.name}</div>`;
        }).join("")}
      </div>

      <!-- Main Body: Left Day Labels + Scrolling Grid -->
      <div class="flex items-start gap-2">
        <!-- Left Side Day Labels (Mon, Wed, Fri) -->
        <div class="flex flex-col justify-between text-[10px] font-pixel text-[#3D2013]/70 h-[108px] pr-1 select-none shrink-0">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        <!-- Heatmap Weeks Grid -->
        <div class="flex gap-1.5 justify-start">
          ${weeks.map(week => `
            <div class="flex flex-col gap-1.5">
              ${week.map(d => {
                let bgColor = "bg-[#EADcc9]";
                if (d.count > 0 && d.count <= 2) bgColor = "bg-[#F8C8A6]";
                else if (d.count > 2 && d.count <= 4) bgColor = "bg-[#F2994A]";
                else if (d.count > 4) bgColor = "bg-[#E87339]";

                return `
                  <div class="w-3.5 h-3.5 rounded-sm border border-[#3D2013]/20 ${bgColor} relative group cursor-pointer">
                    <!-- Tooltip -->
                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col items-center z-50 pointer-events-none whitespace-nowrap bg-[#3D2013] text-[#FEF4E0] font-pixel text-[10px] px-2 py-1 rounded shadow-lg">
                      <span>${d.count} study sessions on ${d.date}</span>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;

  container.innerHTML = gridHtml;
}

function renderProductiveDays() {
  const container = document.getElementById("productive-days-container");
  if (!container) return;

  const days = window.userStatsData.productiveDays;
  const maxCount = Math.max(...days.map(d => d.count), 1);

  container.innerHTML = days.map(d => {
    const percentage = Math.round((d.count / maxCount) * 100);
    const isPeak = d.count === maxCount;

    return `
      <div class="flex items-center gap-3 font-pixel text-[14px] text-[#3D2013]">
        <span class="w-8 font-pressstart text-[10px] uppercase">${d.day}</span>
        <div class="flex-1 h-4 bg-[#3D2013]/10 border-[1.5px] border-[#3D2013]/30 rounded-[4px] overflow-hidden p-[2px]">
          <div class="h-full rounded-[2px] ${isPeak ? 'bg-[#E87339]' : 'bg-[#3D2013]/60'} transition-all duration-300" style="width: ${Math.max(percentage, 4)}%;"></div>
        </div>
        <span class="w-6 text-right font-pressstart text-[10px]">${d.count}</span>
      </div>
    `;
  }).join("");
}