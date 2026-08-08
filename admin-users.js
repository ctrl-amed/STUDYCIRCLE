/**
 * Mock Data Store for Admin Dashboard
 */
const adminMockData = {
  administrator: {
    name: "Eleanor Vance",
    role: "System Admin",
    pfpUrl: ""
  },
  stats: {
    totalUsers: 1428,
    activeUsers: 952,
    suspendedUsers: 14,
    newThisWeek: 126
  },
  users: [
    { id: 1, name: "PixelKnight", email: "pixel@game.com", level: 42, streak: 15, coins: 1200, status: "active", registered: "2023-01-15", pfpUrl: "" },
    { id: 2, name: "RetroQueen", email: "queen@game.com", level: 88, streak: 45, coins: 5400, status: "active", registered: "2022-11-20", pfpUrl: "" },
    { id: 3, name: "ShadowNinja", email: "shadow@game.com", level: 12, streak: 0, coins: 150, status: "inactive", registered: "2023-05-10", pfpUrl: "" },
    { id: 4, name: "BitMaster", email: "bit@game.com", level: 65, streak: 30, coins: 3100, status: "active", registered: "2021-08-05", pfpUrl: "" },
    { id: 5, name: "GamerGuy99", email: "gamer99@game.com", level: 5, streak: 2, coins: 80, status: "inactive", registered: "2023-09-01", pfpUrl: "" },
    { id: 6, name: "CyberSamurai", email: "cyber@game.com", level: 99, streak: 120, coins: 9990, status: "active", registered: "2020-04-12", pfpUrl: "" },
    { id: 7, name: "ArcadeHero", email: "arcade@game.com", level: 34, streak: 8, coins: 890, status: "active", registered: "2023-03-22", pfpUrl: "" },
    { id: 8, name: "VaporWave", email: "vapor@game.com", level: 19, streak: 1, coins: 400, status: "inactive", registered: "2023-06-18", pfpUrl: "" },
    { id: 9, name: "NeonRider", email: "neon@game.com", level: 51, streak: 22, coins: 2150, status: "active", registered: "2022-12-01", pfpUrl: "" },
    { id: 10, name: "8BitLegend", email: "legend@game.com", level: 73, streak: 60, coins: 4800, status: "active", registered: "2021-02-14", pfpUrl: "" },
    { id: 11, name: "QuestSeeker", email: "quest@game.com", level: 27, streak: 5, coins: 620, status: "inactive", registered: "2023-04-03", pfpUrl: "" },
    { id: 12, name: "LevelUpPro", email: "pro@game.com", level: 91, streak: 95, coins: 8100, status: "active", registered: "2020-10-30", pfpUrl: "" }
  ]
};

// State Variables
let filteredUsers = [...adminMockData.users];
let currentPage = 1;
const pageSize = 5;
let selectedUserId = null;
let currentSortOrder = 'desc'; // Default sort order

/**
 * Modal Toggle Functions
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('hidden');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('hidden');
}

/**
 * Dynamic Sorter Handlers & Auto-Range Encoder
 */
function handleSortCategoryChange() {
  const category = document.getElementById('sort-category').value;
  
  const numSorter = document.getElementById('number-sorter-container');
  const dateSorter = document.getElementById('date-sorter-container');
  const statusSorter = document.getElementById('status-sorter-container');

  // Hide containers
  numSorter.classList.add('hidden');
  dateSorter.classList.add('hidden');
  statusSorter.classList.add('hidden');

  // Reset direction to descending (default)
  currentSortOrder = 'desc';
  updateSortOrderIcon();

  if (['level', 'streak', 'coins'].includes(category)) {
    numSorter.classList.remove('hidden');
    numSorter.classList.add('flex');
    
    // Encode Min/Max range automatically based on dataset
    const values = adminMockData.users.map(u => u[category]);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    
    document.getElementById('num-min').value = isFinite(minVal) ? minVal : '';
    document.getElementById('num-max').value = isFinite(maxVal) ? maxVal : '';

  } else if (category === 'registered') {
    dateSorter.classList.remove('hidden');
    dateSorter.classList.add('flex');
    
    // Encode Oldest/Newest dates automatically
    const dates = adminMockData.users.map(u => u.registered).sort();
    if (dates.length > 0) {
      document.getElementById('date-from').value = dates[0];
      document.getElementById('date-to').value = dates[dates.length - 1];
    }
  } else if (category === 'status') {
    statusSorter.classList.remove('hidden');
  }

  applySortAndFilter();
}

/**
 * Toggle Ascending/Descending Direction Button
 */
function toggleSortOrder() {
  currentSortOrder = currentSortOrder === 'desc' ? 'asc' : 'desc';
  updateSortOrderIcon();
  applySortAndFilter();
}

function updateSortOrderIcon() {
  const numIcon = document.getElementById('num-sort-order-icon');
  const dateIcon = document.getElementById('date-sort-order-icon');
  const iconText = currentSortOrder === 'desc' ? '▼' : '▲';

  if (numIcon) numIcon.textContent = iconText;
  if (dateIcon) dateIcon.textContent = iconText;
}

/**
 * Core Sort & Filter Logic
 */
function applySortAndFilter() {
  const category = document.getElementById('sort-category').value;
  const searchQuery = document.getElementById('user-search-input').value.toLowerCase().trim();

  // Filter by search query first
  let list = adminMockData.users.filter(u => u.name.toLowerCase().includes(searchQuery));

  if (category) {
    if (['level', 'streak', 'coins'].includes(category)) {
      const minInput = document.getElementById('num-min').value;
      const maxInput = document.getElementById('num-max').value;
      
      const min = minInput !== '' ? parseInt(minInput, 10) : -Infinity;
      const max = maxInput !== '' ? parseInt(maxInput, 10) : Infinity;

      // Filter within numerical range
      list = list.filter(u => u[category] >= min && u[category] <= max);

      // Sort according to direction button
      list.sort((a, b) => {
        return currentSortOrder === 'asc' ? a[category] - b[category] : b[category] - a[category];
      });

    } else if (category === 'registered') {
      const from = document.getElementById('date-from').value;
      const to = document.getElementById('date-to').value;

      if (from) list = list.filter(u => u.registered >= from);
      if (to) list = list.filter(u => u.registered <= to);

      // Sort according to direction button
      list.sort((a, b) => {
        const dateA = new Date(a.registered);
        const dateB = new Date(b.registered);
        return currentSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });

    } else if (category === 'status') {
      const statusFilter = document.getElementById('status-filter').value;
      if (statusFilter !== 'all') {
        list = list.filter(u => u.status === statusFilter);
      }
    }
  }

  filteredUsers = list;
  currentPage = 1;
  renderUserTable();
}

/**
 * Live Search Trigger
 */
function handleLiveSearch() {
  applySortAndFilter();
}

/**
 * Masks an email address for privacy (e.g., "pixel@game.com" -> "pi***@game.com")
 */
function maskEmail(email) {
  if (!email || !email.includes('@')) return email;
  
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) {
    return `${localPart[0]}*@${domain}`;
  }
  
  const visible = localPart.slice(0, 2);
  const masked = '*'.repeat(localPart.length - 2);
  return `${visible}${masked}@${domain}`;
}

/**
 * Render Table & Mobile Cards with Pagination
 */
function renderUserTable() {
  const tbody = document.getElementById('user-table-body');
  const mobileList = document.getElementById('user-card-mobile-list');
  if (!tbody && !mobileList) return;

  if (tbody) tbody.innerHTML = '';
  if (mobileList) mobileList.innerHTML = '';

  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / pageSize) || 1;

  if (currentPage > totalPages) currentPage = totalPages;

  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalUsers);
  const pageItems = filteredUsers.slice(startIdx, endIdx);

  if (pageItems.length === 0) {
    const emptyHtml = `
      <div class="p-6 text-center text-[#3D2013]/60 italic font-pressstart text-[10px]">
        No users found matching current filter/search.
      </div>
    `;
    if (tbody) tbody.innerHTML = `<tr><td colspan="8">${emptyHtml}</td></tr>`;
    if (mobileList) mobileList.innerHTML = emptyHtml;
  } else {
    pageItems.forEach(u => {
      // Mask email when inflating layout
      const maskedEmail = maskEmail(u.email);

      const statusBadge = u.status === 'active' 
        ? `<span class="bg-[#CDECCF] text-[#5C8D57] border border-[#5C8D57] px-2 py-0.5 rounded-md text-[9px] inline-block">Active</span>`
        : `<span class="bg-[#F7CACA] text-[#944444] border border-[#944444] px-2 py-0.5 rounded-md text-[9px] inline-block">Inactive</span>`;

      const avatarHtml = u.pfpUrl 
        ? `<img src="${u.pfpUrl}" class="w-full h-full object-cover">` 
        : `<svg class="w-4 h-4 text-[#3D2013]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;

      if (tbody) {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-[#FAE9CE]/50 transition-colors font-pressstart text-[10px]";
        tr.innerHTML = `
          <td class="p-3.5">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-full bg-[#FAE9CE] border border-[#3D2013] flex items-center justify-center shrink-0 overflow-hidden">
                ${avatarHtml}
              </div>
              <span class=" truncate max-w-[120px]">${u.name}</span>
            </div>
          </td>
          <!-- Use masked email here -->
          <td class="p-3.5 text-[#3D2013]/80 truncate max-w-[150px]">${maskedEmail}</td>
          
          <td class="p-3.5 text-center ">
            <span class="bg-[#E3D2E5] text-[#261A36] border border-[#261A36] rounded-md px-2 py-1 inline-block text-[10px] w-full">
              Lv. ${u.level}
            </span>
          </td>

          <td class="p-3.5 text-center">
            <div class="flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path fill="currentColor" d="M17.66 11.2c-.23-.3-.51-.56-.77-.82c-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32c-2.59 2.08-3.61 5.75-2.39 8.9c.04.1.08.2.08.33c0 .22-.15.42-.35.5c-.23.1-.47.04-.66-.12a.6.6 0 0 1-.14-.17c-1.13-1.43-1.31-3.48-.55-5.12C5.78 10 4.87 12.3 5 14.47c.06.5.12 1 .29 1.5c.14.6.41 1.2.71 1.73c1.08 1.73 2.95 2.97 4.96 3.22c2.14.27 4.43-.12 6.07-1.6c1.83-1.66 2.47-4.32 1.53-6.6l-.13-.26c-.21-.46-.77-1.26-.77-1.26m-3.16 6.3c-.28.24-.74.5-1.1.6c-1.12.4-2.24-.16-2.9-.82c1.19-.28 1.9-1.16 2.11-2.05c.17-.8-.15-1.46-.28-2.23c-.12-.74-.1-1.37.17-2.06c.19.38.39.76.63 1.06c.77 1 1.98 1.44 2.24 2.8c.04.14.06.28.06.43c.03.82-.33 1.72-.93 2.27" />
              </svg>
              <span>${u.streak}d</span>
            </div>
          </td>

          <td class="p-3.5 text-center">
            <div class="flex items-center justify-center gap-1">
              <img src="./media/coin_logo.png" alt="Coin" class="w-3.5 h-3.5 object-contain">
              <span>${u.coins}</span>
            </div>
          </td>

          <td class="p-3.5 text-center">${statusBadge}</td>
          <td class="p-3.5 text-center text-[9px] text-[#3D2013]/70">${u.registered}</td>
          
          <td class="p-3.5 text-center">
            <div class="flex items-center justify-center gap-2">
              <button onclick="handleViewUser(${u.id})" title="View"
                      class="bg-[#FEF4E0] border-[2px] border-[#3D2013] p-1.5 flex items-center justify-center rounded-[6px] transition-all duration-150 retro-shadow shrink-0 cursor-pointer hover:scale-105">
                <svg class="w-4 h-4 text-[#3D2013]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </button>
              
              <button onclick="handleRemoveUser(${u.id})" title="Remove"
                      class="bg-[#A53914] border-[2px] border-[#3D2013] p-1.5 flex items-center justify-center rounded-[6px] transition-all duration-150 retro-shadow shrink-0 cursor-pointer hover:scale-105">
                <svg class="w-4 h-4 text-[#FEF4E0]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      }

      if (mobileList) {
        const card = document.createElement('div');
        card.className = "bg-[#FAE9CE] border-[2px] border-[#3D2013] rounded-[10px] p-3 flex flex-col gap-2.5 shadow-sm";
        card.innerHTML = `
          <div class="flex items-center justify-between pb-2 border-b border-[#3D2013]/20">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-[#FEF4E0] border border-[#3D2013] flex items-center justify-center shrink-0 overflow-hidden">
                ${avatarHtml}
              </div>
              <div class="flex flex-col">
                <span class=" text-[11px] leading-tight text-[#3D2013]">${u.name}</span>
                <!-- Use masked email here -->
                <span class="text-[8px] text-[#3D2013]/70 truncate max-w-[150px]">${maskedEmail}</span>
              </div>
            </div>
            
            <div class="flex items-center gap-1.5">
              <button onclick="handleViewUser(${u.id})" title="View"
                      class="bg-[#FEF4E0] border-[1.5px] border-[#3D2013] p-1 flex items-center justify-center rounded-[5px] active:scale-95">
                <svg class="w-3.5 h-3.5 text-[#3D2013]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </button>
              
              <button onclick="handleRemoveUser(${u.id})" title="Remove"
                      class="bg-[#A53914] border-[1.5px] border-[#3D2013] p-1 flex items-center justify-center rounded-[5px] active:scale-95">
                <svg class="w-3.5 h-3.5 text-[#FEF4E0]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-1 text-[9px] items-center text-center">
            <span class="bg-[#E3D2E5] text-[#261A36] border border-[#261A36] rounded px-1.5 py-0.5 ">
              Lv. ${u.level}
            </span>

            <div class="flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-[#3D2013]" viewBox="0 0 24 24">
                <path fill="currentColor" d="M17.66 11.2c-.23-.3-.51-.56-.77-.82c-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32c-2.59 2.08-3.61 5.75-2.39 8.9c.04.1.08.2.08.33c0 .22-.15.42-.35.5c-.23.1-.47.04-.66-.12a.6.6 0 0 1-.14-.17c-1.13-1.43-1.31-3.48-.55-5.12C5.78 10 4.87 12.3 5 14.47c.06.5.12 1 .29 1.5c.14.6.41 1.2.71 1.73c1.08 1.73 2.95 2.97 4.96 3.22c2.14.27 4.43-.12 6.07-1.6c1.83-1.66 2.47-4.32 1.53-6.6l-.13-.26c-.21-.46-.77-1.26-.77-1.26m-3.16 6.3c-.28.24-.74.5-1.1.6c-1.12.4-2.24-.16-2.9-.82c1.19-.28 1.9-1.16 2.11-2.05c.17-.8-.15-1.46-.28-2.23c-.12-.74-.1-1.37.17-2.06c.19.38.39.76.63 1.06c.77 1 1.98 1.44 2.24 2.8c.04.14.06.28.06.43c.03.82-.33 1.72-.93 2.27" />
              </svg>
              <span>${u.streak}d</span>
            </div>

            <div class="flex items-center justify-center gap-1">
              <img src="./media/coin_logo.png" alt="Coin" class="w-3 h-3 object-contain">
              <span>${u.coins}</span>
            </div>
          </div>

          <div class="flex items-center justify-between text-[8px] text-[#3D2013]/70 pt-1">
            <span>Reg: ${u.registered}</span>
            <div>${statusBadge}</div>
          </div>
        `;
        mobileList.appendChild(card);
      }
    });
  }

  // Pagination Text
  const paginationInfo = document.getElementById('pagination-info');
  if (paginationInfo) {
    const from = totalUsers === 0 ? 0 : startIdx + 1;
    paginationInfo.textContent = `Showing ${from}-${endIdx} of ${totalUsers} Users`;
  }

  // Pagination Controls
  const paginationControls = document.getElementById('pagination-controls');
  if (paginationControls) {
    paginationControls.innerHTML = '';

    if (currentPage > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.className = "font-pressstart text-[9px] bg-[#FEF4E0] border-[2px] border-[#3D2013] text-[#3D2013] px-2.5 py-1 rounded-[6px] hover:bg-[#FAE9CE] transition-all cursor-pointer";
      prevBtn.textContent = "◄ PREV";
      prevBtn.onclick = () => { currentPage--; renderUserTable(); };
      paginationControls.appendChild(prevBtn);
    }

    const pageBadge = document.createElement('span');
    pageBadge.className = "font-pressstart text-[9px] px-2 text-[#3D2013]";
    pageBadge.textContent = `Page ${currentPage} of ${totalPages}`;
    paginationControls.appendChild(pageBadge);

    if (currentPage < totalPages) {
      const nextBtn = document.createElement('button');
      nextBtn.className = "font-pressstart text-[9px] bg-[#FEF4E0] border-[2px] border-[#3D2013] text-[#3D2013] px-2.5 py-1 rounded-[6px] hover:bg-[#FAE9CE] transition-all cursor-pointer";
      nextBtn.textContent = "NEXT ►";
      nextBtn.onclick = () => { currentPage++; renderUserTable(); };
      paginationControls.appendChild(nextBtn);
    }
  }
}

/**
 * Modal Actions
 */
function handleViewUser(id) {
  const user = adminMockData.users.find(u => u.id === id);
  if (!user) return;
  
  // Mask the email address
  const maskedEmail = maskEmail(user.email);
  
  const container = document.getElementById('view-user-details');
  const statusBadge = user.status === 'active' 
    ? `<span class="bg-[#CDECCF] text-[#5C8D57] font-pixel text-[15px] lg:text-[20px] border border-[#5C8D57] px-2 py-1 rounded-md text-[9px] inline-block w-full text-center">Active</span>`
    : `<span class="bg-[#F7CACA] text-[#944444] font-pixel text-[15px] lg:text-[20px] border border-[#944444] px-2 py-1 rounded-md text-[9px] inline-block w-full text-center">Inactive</span>`;

  const lastLoggedIn = "2026-08-05 14:32";

  container.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-[1fr_auto_2fr] gap-4 sm:gap-4 items-center font-pixel">
      <div class="flex flex-col items-center gap-3 text-center">
        <div class="flex flex-col items-center gap-2 w-full">
          <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FAE9CE] border-[2px] border-[#3D2013] flex items-center justify-center overflow-hidden shrink-0">
            ${user.pfpUrl ? `<img src="${user.pfpUrl}" class="w-full h-full object-cover">` : `<svg class="w-8 h-8 sm:w-10 sm:h-10 text-[#3D2013]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`}
          </div>
          <span class="font-pixel text-[15px] lg:text-[20px] break-words max-w-[160px] sm:max-w-[120px] leading-tight">${user.name}</span>
          <div class="w-full max-w-[120px]">${statusBadge}</div>
        </div>

        <div class="w-full border-t-[2px] border-[#3D2013]/20 my-1"></div>

        <div class="flex flex-row sm:flex-col items-center justify-center gap-3 sm:gap-2 w-full text-[10px]">
          <span class="bg-[#E3D2E5] font-pixel text-[15px] lg:text-[20px] text-[#261A36] border border-[#261A36] rounded-md px-2 py-1 inline-block text-center shrink-0">
            Lv. ${user.level}
          </span>
          <div class="font-pixel text-[15px] lg:text-[20px] flex items-center justify-center gap-1 shrink-0">
            <svg class="w-3.5 h-3.5 text-[#3D2013]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.66 11.2c-.23-.3-.51-.56-.77-.82c-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32c-2.59 2.08-3.61 5.75-2.39 8.9c.04.1.08.2.08.33c0 .22-.15.42-.35.5c-.23.1-.47.04-.66-.12a.6.6 0 0 1-.14-.17c-1.13-1.43-1.31-3.48-.55-5.12C5.78 10 4.87 12.3 5 14.47c.06.5.12 1 .29 1.5c.14.6.41 1.2.71 1.73c1.08 1.73 2.95 2.97 4.96 3.22c2.14.27 4.43-.12 6.07-1.6c1.83-1.66 2.47-4.32 1.53-6.6l-.13-.26c-.21-.46-.77-1.26-.77-1.26"/>
            </svg>
            <span>${user.streak}d</span>
          </div>
          <div class="font-pixel text-[15px] lg:text-[20px] flex items-center justify-center gap-1 shrink-0">
            <img src="./media/coin_logo.png" alt="Coin" class="w-3.5 h-3.5 object-contain">
            <span>${user.coins}</span>
          </div>
        </div>
      </div>

      <div class="w-full h-[2px] sm:w-[2px] sm:h-full bg-[#3D2013]"></div>

      <div class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-3 sm:gap-y-4 text-[10px] items-center">
        <div class="font-pixel text-[15px] lg:text-[20px] flex items-center gap-2 text-[#3D2013]/80">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path fill="currentColor" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4" />
          </svg>
          <span class="hidden sm:inline">Username</span>
        </div>
        <div class="font-pixel text-[15px] lg:text-[20px]  break-words pr-2">${user.name}</div>

        <div class="font-pixel text-[15px] lg:text-[20px] flex items-center gap-2 text-[#3D2013]/80">
          <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          <span class="hidden sm:inline">Email</span>
        </div>
        <!-- Updated to display maskedEmail for both text content and hover tooltip -->
        <div class="font-pixel text-[15px] lg:text-[20px]  break-all pr-2" title="${maskedEmail}">${maskedEmail}</div>

        <div class="font-pixel text-[15px] lg:text-[20px] flex items-center gap-2 text-[#3D2013]/80">
          <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>
          <span class="hidden sm:inline">Registered</span>
        </div>
        <div class="font-pixel text-[15px] lg:text-[20px]  break-words">${user.registered}</div>

        <div class="font-pixel text-[15px] lg:text-[20px] flex items-center gap-2 text-[#3D2013]/80">
          <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
          <span class="hidden sm:inline">Last Login</span>
        </div>
        <div class="font-pixel text-[15px] lg:text-[20px]  break-words">${lastLoggedIn}</div>
      </div>
    </div>
  `;
  openModal('view-user-modal');
}

function showUserDeletedToast(userName) {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = "bg-[#FBF2E3] border-4 border-[#3D2013] p-4 flex flex-col gap-2 relative shadow-md transition-all duration-300 max-w-xs retro-shadow pointer-events-auto opacity-0 translate-y-[-20px] !rounded-none overflow-hidden";
  toast.style.boxShadow = "4px 4px 0px #3D2013";

  toast.innerHTML = `
    <div class="flex items-center gap-3 pr-2">
      <!-- Retro Trash Icon -->
      <svg class="w-5 h-5 flex-shrink-0 text-[#A53914]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
      </svg>
      <span class="font-pressstart text-[11px] text-[#482A1D] tracking-wide">
        "${userName}" removed successfully!
      </span>
    </div>
    <div class="w-full bg-transparent h-1.5 flex justify-center mt-auto overflow-hidden">
      <div class="w-full h-full bg-[#A53914] animate-progress-center"></div>
    </div>
  `;

  toastContainer.appendChild(toast);

  // Trigger entering slide & fade-in animation
  requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', 'translate-y-[-20px]');
    toast.classList.add('opacity-100', 'translate-y-0');
  });

  // Slide out and remove after 4 seconds
  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-[-20px]');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function handleRemoveUser(id) {
  const user = adminMockData.users.find(u => u.id === id);
  if (!user) return;
  selectedUserId = id;

  document.getElementById('remove-user-text').textContent = `Are you sure you want to remove "${user.name}"?`;
  openModal('remove-user-modal');
}

function confirmRemoveUser() {
  const idx = adminMockData.users.findIndex(u => u.id === selectedUserId);
  if (idx !== -1) {
    const deletedUser = adminMockData.users[idx]; // Store reference to get the username
    adminMockData.users.splice(idx, 1);
    applySortAndFilter();
    
    // Trigger notification toast
    showUserDeletedToast(deletedUser.name);
  }
  closeModal('remove-user-modal');
}
/**
 * Load Dashboard Data
 */
function loadAdminDashboard(data) {
  const adminName = document.getElementById('admin-name');
  const adminRole = document.getElementById('admin-role');
  const adminPfp = document.getElementById('admin-pfp');
  const adminPlaceholder = document.getElementById('admin-pfp-placeholder');

  if (adminName) adminName.textContent = data.administrator.name;
  if (adminRole) adminRole.textContent = data.administrator.role;

  if (data.administrator.pfpUrl && adminPfp) {
    adminPfp.src = data.administrator.pfpUrl;
    adminPfp.classList.remove('hidden');
    if (adminPlaceholder) adminPlaceholder.classList.add('hidden');
  }

  const totalUsers = document.getElementById('stat-total-users');
  const activeUsers = document.getElementById('stat-active-users');
  const suspendedUsers = document.getElementById('stat-suspended-users');
  const newThisWeek = document.getElementById('stat-new-this-week');

  if (totalUsers) totalUsers.textContent = data.stats.totalUsers.toLocaleString();
  if (activeUsers) activeUsers.textContent = data.stats.activeUsers.toLocaleString();
  if (suspendedUsers) suspendedUsers.textContent = data.stats.suspendedUsers.toLocaleString();
  if (newThisWeek) newThisWeek.textContent = data.stats.newThisWeek.toLocaleString();

  applySortAndFilter();
}

document.addEventListener('DOMContentLoaded', () => {
  loadAdminDashboard(adminMockData);
});