// Mock Data set for each timeframe selection
const mockDashboardData = {
  "7days": {
    subtitle: "Overview of StudyCircle Community in the last 7 days",
    totalUsers: "1,248",
    activeRooms: "42",
    studySessions: "318",
    avgProductivity: "84%",
    activeUsers: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [320, 450, 410, 520, 600, 780, 690]
    },
    techniques: [55, 25, 20], // [Pomodoro, 52-17, 90-min]
    studyHours: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [3.5, 4.2, 3.8, 5.0, 5.5, 6.8, 6.1]
    }
  },
  "1month": {
    subtitle: "Overview of StudyCircle Community in the last 1 month",
    totalUsers: "2,840",
    activeRooms: "115",
    studySessions: "1,420",
    avgProductivity: "81%",
    activeUsers: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      data: [1800, 2100, 2400, 2840]
    },
    techniques: [50, 30, 20],
    studyHours: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      data: [4.1, 4.5, 4.8, 5.2]
    }
  },
  "6months": {
    subtitle: "Overview of StudyCircle Community in the last 6 months",
    totalUsers: "8,920",
    activeRooms: "340",
    studySessions: "6,800",
    avgProductivity: "79%",
    activeUsers: {
      labels: ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"],
      data: [3200, 4100, 5600, 6900, 7800, 8920]
    },
    techniques: [60, 20, 20],
    studyHours: {
      labels: ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"],
      data: [3.8, 4.0, 4.3, 4.7, 5.1, 5.4]
    }
  },
  "1year": {
    subtitle: "Overview of StudyCircle Community in the last 1 year",
    totalUsers: "15,400",
    activeRooms: "890",
    studySessions: "18,200",
    avgProductivity: "83%",
    activeUsers: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      data: [5400, 8900, 12100, 15400]
    },
    techniques: [52, 28, 20],
    studyHours: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      data: [4.0, 4.6, 5.0, 5.5]
    }
  },
  "custom": {
    subtitle: "Overview of StudyCircle Community within custom date range",
    totalUsers: "3,150",
    activeRooms: "128",
    studySessions: "1,890",
    avgProductivity: "86%",
    activeUsers: {
      labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
      data: [400, 520, 610, 580, 700]
    },
    techniques: [48, 32, 20],
    studyHours: {
      labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
      data: [4.5, 4.8, 5.2, 5.0, 5.6]
    }
  }
};

let barChart, pieChart, lineChart;

// Modal Helpers
function openModal(id) {
  document.getElementById(id)?.classList.remove('hidden');
}
function closeModal(id) {
  document.getElementById(id)?.classList.add('hidden');
}

// Handle timeframe select change
function handleTimeframeChange() {
  const selected = document.getElementById('timeframe-select').value;
  const customContainer = document.getElementById('custom-date-container');

  if (selected === 'custom') {
    customContainer.classList.remove('hidden');
  } else {
    customContainer.classList.add('hidden');
    updateDashboard(selected);
  }
}

// Handle custom date apply
function applyCustomRange() {
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;

  if (startDate && endDate) {
    updateDashboard('custom');
  }
}

// Update DOM elements and Chart datasets
function updateDashboard(key) {
  const data = mockDashboardData[key];

  // Update text elements
  document.getElementById('timeframe-subtitle').textContent = data.subtitle;
  document.getElementById('stat-total-users').textContent = data.totalUsers;
  document.getElementById('stat-active-rooms').textContent = data.activeRooms;
  document.getElementById('stat-study-sessions').textContent = data.studySessions;
  document.getElementById('stat-avg-productivity').textContent = data.avgProductivity;

  // Update Charts
  barChart.data.labels = data.activeUsers.labels;
  barChart.data.datasets[0].data = data.activeUsers.data;
  barChart.update();

  pieChart.data.datasets[0].data = data.techniques;
  pieChart.update();

  lineChart.data.labels = data.studyHours.labels;
  lineChart.data.datasets[0].data = data.studyHours.data;
  lineChart.update();
}

// Initialize Charts on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  const textThemeColor = '#3D2013';

  // 1. Weekly Active Users Bar Chart
  const ctxBar = document.getElementById('activeUsersChart').getContext('2d');
  barChart = new Chart(ctxBar, {
    type: 'bar',
    data: {
      labels: mockDashboardData["7days"].activeUsers.labels,
      datasets: [{
        label: 'Active Users',
        data: mockDashboardData["7days"].activeUsers.data,
        backgroundColor: '#F6835E',
        borderColor: '#F6835E',
        borderWidth: 2,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: textThemeColor } },
        y: { ticks: { color: textThemeColor } }
      }
    }
  });

  // 2. Study Techniques Pie Chart
  const ctxPie = document.getElementById('techniquesChart').getContext('2d');
  pieChart = new Chart(ctxPie, {
    type: 'pie',
    data: {
      labels: ['Pomodoro', '52-17 Method', '90 Min Focus'],
      datasets: [{
        data: mockDashboardData["7days"].techniques,
        backgroundColor: ['#94B983', '#F6835E', '#CD4249'],
        borderColor: '#3D2013',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: textThemeColor, font: { size: 10 } }
        }
      }
    }
  });

  // 3. Average Study Hours Line Chart
  const ctxLine = document.getElementById('studyHoursChart').getContext('2d');
  lineChart = new Chart(ctxLine, {
    type: 'line',
    data: {
      labels: mockDashboardData["7days"].studyHours.labels,
      datasets: [{
        label: 'Avg Hours',
        data: mockDashboardData["7days"].studyHours.data,
        borderColor: '#A53914',
        backgroundColor: 'rgba(165, 57, 20, 0.15)',
        borderWidth: 3,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#FEF4E0',
        pointBorderColor: '#3D2013',
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: textThemeColor } },
        y: { ticks: { color: textThemeColor } }
      }
    }
  });
});