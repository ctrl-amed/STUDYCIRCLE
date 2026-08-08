const API_BASE_URL = "http://127.0.0.1:5000";

/**
 * Live Data Store for Admin Rooms
 */
let adminRoomsData = {
  administrator: {
    name: "Admin",
    role: "System Admin",
    pfpUrl: ""
  },
  stats: {
    totalRooms: 0,
    activeRooms: 0,
    privateRooms: 0,
    publicRooms: 0
  },
  rooms: []
};

// State Variables
let filteredRooms = [];
let currentPage = 1;
const pageSize = 5;
let selectedRoomId = null;
let currentSortOrder = 'desc'; // Default sort order

/**
 * Fetch real rooms data from backend
 */
async function fetchAdminRoomsData() {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (!token) {
        window.location.href = 'authentication.html';
        return;
    }

    try {
        // 1. Fetch current logged-in admin user info for header badge
        const profileRes = await fetch(`${API_BASE_URL}/me`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (profileRes.ok) {
            const userData = await profileRes.json();
            const adminNameEl = document.getElementById('admin-name');
            if (adminNameEl) {
                adminNameEl.textContent = userData.username || userData.name || "Administrator";
            }

            if (userData.avatar_url) {
                const pfpImg = document.getElementById('admin-pfp');
                const pfpPlaceholder = document.getElementById('admin-pfp-placeholder');
                if (pfpImg && pfpPlaceholder) {
                    pfpImg.src = typeof userData.avatar_url === 'string' && userData.avatar_url.startsWith('{') 
                        ? JSON.parse(userData.avatar_url).url || "" 
                        : userData.avatar_url;
                    pfpImg.classList.remove('hidden');
                    pfpPlaceholder.classList.add('hidden');
                }
            }
        }

        // 2. Fetch live rooms and statistics from database
        const response = await fetch(`${API_BASE_URL}/api/admin/rooms`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            const result = await response.json();
            adminRoomsData.stats = result.stats;
            adminRoomsData.rooms = result.rooms;
            filteredRooms = [...adminRoomsData.rooms];
            loadAdminDashboard(adminRoomsData);
        } else {
            console.error("Failed to load admin rooms");
        }
    } catch (err) {
        console.error("Backend connection error:", err);
    }
}

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
 * Dynamic Sorter Handlers
 */
function handleSortCategoryChange() {
  const category = document.getElementById('sort-category').value;
  
  const dateSorter = document.getElementById('date-sorter-container');
  const nameSorter = document.getElementById('name-sorter-container');
  const memberSorter = document.getElementById('member-sorter-container');
  const statusSorter = document.getElementById('status-sorter-container');

  // Hide containers
  dateSorter.classList.add('hidden');
  nameSorter.classList.add('hidden');
  memberSorter.classList.add('hidden');
  statusSorter.classList.add('hidden');

  // Reset direction to descending by default
  currentSortOrder = 'desc';
  updateSortOrderIcon();

  if (category === 'created') {
    dateSorter.classList.remove('hidden');
    dateSorter.classList.add('flex');
    
    // Auto-encode Oldest/Newest dates
    const dates = adminRoomsData.rooms.map(r => r.createdAt).sort();
    if (dates.length > 0) {
      document.getElementById('date-from').value = dates[0];
      document.getElementById('date-to').value = dates[dates.length - 1];
    }
  } else if (category === 'name') {
    nameSorter.classList.remove('hidden');
    nameSorter.classList.add('flex');
  } else if (category === 'members') {
    memberSorter.classList.remove('hidden');
    memberSorter.classList.add('flex');
    
    const members = adminRoomsData.rooms.map(r => r.maxMembers);
    document.getElementById('num-min').value = Math.min(...members);
    document.getElementById('num-max').value = Math.max(...members);
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
  const iconText = currentSortOrder === 'desc' ? '▼' : '▲';
  ['date-sort-order-icon', 'name-sort-order-icon', 'num-sort-order-icon'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = iconText;
  });
}

/**
 * Core Sort & Filter Logic
 */
function applySortAndFilter() {
  const category = document.getElementById('sort-category').value;
  const searchQuery = document.getElementById('room-search-input').value.toLowerCase().trim();

  // Filter by search query
  let list = adminRoomsData.rooms.filter(r => r.name.toLowerCase().includes(searchQuery));

  if (category) {
    if (category === 'created') {
      const from = document.getElementById('date-from').value;
      const to = document.getElementById('date-to').value;

      if (from) list = list.filter(r => r.createdAt >= from);
      if (to) list = list.filter(r => r.createdAt <= to);

      list.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return currentSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });

    } else if (category === 'name') {
      list.sort((a, b) => {
        return currentSortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      });

    } else if (category === 'members') {
      const minInput = document.getElementById('num-min').value;
      const maxInput = document.getElementById('num-max').value;
      
      const min = minInput !== '' ? parseInt(minInput, 10) : -Infinity;
      const max = maxInput !== '' ? parseInt(maxInput, 10) : Infinity;

      list = list.filter(r => r.maxMembers >= min && r.maxMembers <= max);

      list.sort((a, b) => {
        return currentSortOrder === 'asc' ? a.maxMembers - b.maxMembers : b.maxMembers - a.maxMembers;
      });

    } else if (category === 'status') {
      const statusFilter = document.getElementById('status-filter').value;
      if (statusFilter !== 'all') {
        list = list.filter(r => r.type.toLowerCase() === statusFilter.toLowerCase());
      }
    }
  }

  filteredRooms = list;
  currentPage = 1;
  renderRoomTable();
}

/**
 * Live Search Trigger
 */
function handleLiveSearch() {
  applySortAndFilter();
}

/**
 * Render Table & Mobile Cards with Pagination
 */
function renderRoomTable() {
  const tbody = document.getElementById('room-table-body');
  const mobileList = document.getElementById('room-card-mobile-list');
  if (!tbody && !mobileList) return;

  if (tbody) tbody.innerHTML = '';
  if (mobileList) mobileList.innerHTML = '';

  const totalRooms = filteredRooms.length;
  const totalPages = Math.ceil(totalRooms / pageSize) || 1;

  if (currentPage > totalPages) currentPage = totalPages;

  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalRooms);
  const pageItems = filteredRooms.slice(startIdx, endIdx);

  if (pageItems.length === 0) {
    const emptyHtml = `
      <div class="p-6 text-center text-[#3D2013]/60 italic font-pressstart text-[10px]">
        No rooms found matching current filter/search.
      </div>
    `;
    if (tbody) tbody.innerHTML = `<tr><td colspan="6">${emptyHtml}</td></tr>`;
    if (mobileList) mobileList.innerHTML = emptyHtml;
  } else {
    pageItems.forEach(r => {
      const typeBadge = r.type === 'Public' 
        ? `<span class="bg-[#CDECCF] text-[#5C8D57] border border-[#5C8D57] px-2 py-0.5 rounded-md text-[9px] inline-block">Public</span>`
        : `<span class="bg-[#F7CACA] text-[#944444] border border-[#944444] px-2 py-0.5 rounded-md text-[9px] inline-block">Private</span>`;

      const creatorAvatar = r.creatorPfp 
        ? `<img src="${r.creatorPfp}" class="w-full h-full object-cover">` 
        : `<svg class="w-3.5 h-3.5 text-[#3D2013]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;

      if (tbody) {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-[#FAE9CE]/50 transition-colors font-pressstart text-[10px]";
        tr.innerHTML = `
          <td class="p-3.5 font-pixel text-[15px] lg:text-[20px] truncate max-w-[150px]">${r.name}</td>
          
          <td class="p-3.5 text-center font-pixel text-[15px] lg:text-[20px]">
            <span class="text-[#261A36] rounded-md px-2 py-1 inline-block font-pixel text-[15px] lg:text-[20px]">
              ${r.maxMembers}
            </span>
          </td>

          <td class="p-3.5 text-center">${typeBadge}</td>

          <td class="p-3.5">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-full bg-[#FAE9CE] border border-[#3D2013] flex items-center justify-center shrink-0 overflow-hidden">
                ${creatorAvatar}
              </div>
              <span class="truncate max-w-[120px]">${r.creatorName}</span>
            </div>
          </td>

          <td class="p-3.5 text-center text-[9px] text-[#3D2013]/70">${r.createdAt}</td>
          
          <td class="p-3.5 text-center">
            <div class="flex items-center justify-center gap-2">
              <button onclick="handleViewRoom(${r.id})" title="View Details"
                      class="bg-[#FEF4E0] border-[2px] border-[#3D2013] p-1.5 flex items-center justify-center rounded-[6px] transition-all duration-150 retro-shadow shrink-0 cursor-pointer hover:scale-105">
                <svg class="w-4 h-4 text-[#3D2013]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </button>

              <button onclick="handleEditRoom(${r.id})" title="Edit Details"
                      class="bg-[#FFE680] border-[2px] border-[#3D2013] p-1.5 flex items-center justify-center rounded-[6px] transition-all duration-150 retro-shadow shrink-0 cursor-pointer hover:scale-105">
                <svg class="w-4 h-4 text-[#3D2013]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </button>
              
              <button onclick="handleRemoveRoom(${r.id})" title="Remove Room"
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
            <span class="font-pixel text-[15px] lg:text-[20px] text-[11px] text-[#3D2013] truncate max-w-[160px]">${r.name}</span>
            <div class="flex items-center gap-1.5">
              <button onclick="handleViewRoom(${r.id})" title="View Details"
                      class="bg-[#FEF4E0] border-[1.5px] border-[#3D2013] p-1 flex items-center justify-center rounded-[5px] active:scale-95">
                <svg class="w-3.5 h-3.5 text-[#3D2013]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </button>
              <button onclick="handleEditRoom(${r.id})" title="Edit Details"
                      class="bg-[#FD923E] border-[1.5px] border-[#3D2013] p-1 flex items-center justify-center rounded-[5px] active:scale-95">
                <svg class="w-3.5 h-3.5 text-[#FEF4E0]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </button>
              <button onclick="handleRemoveRoom(${r.id})" title="Remove Room"
                      class="bg-[#A53914] border-[1.5px] border-[#3D2013] p-1 flex items-center justify-center rounded-[5px] active:scale-95">
                <svg class="w-3.5 h-3.5 text-[#FEF4E0]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between text-[9px]">
            <div class="flex items-center gap-1.5">
              <div class="w-5 h-5 rounded-full bg-[#FEF4E0] border border-[#3D2013] flex items-center justify-center overflow-hidden">
                ${creatorAvatar}
              </div>
              <span>${r.creatorName}</span>
            </div>
            <span class="bg-[#E3D2E5] text-[#261A36] border border-[#261A36] rounded px-1.5 py-0.5 font-pixel text-[15px] lg:text-[20px]">
              ${r.currentMembers} / ${r.maxMembers}
            </span>
          </div>

          <div class="flex items-center justify-between text-[8px] text-[#3D2013]/70 pt-1 border-t border-[#3D2013]/10">
            <span>Created: ${r.createdAt}</span>
            <div>${typeBadge}</div>
          </div>
        `;
        mobileList.appendChild(card);
      }
    });
  }

  // Pagination Info & Controls
  const paginationInfo = document.getElementById('pagination-info');
  if (paginationInfo) {
    const from = totalRooms === 0 ? 0 : startIdx + 1;
    paginationInfo.textContent = `Showing ${from}-${endIdx} of ${totalRooms} Rooms`;
  }

  const paginationControls = document.getElementById('pagination-controls');
  if (paginationControls) {
    paginationControls.innerHTML = '';

    if (currentPage > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.className = "font-pressstart text-[9px] bg-[#FEF4E0] border-[2px] border-[#3D2013] text-[#3D2013] px-2.5 py-1 rounded-[6px] hover:bg-[#FAE9CE] transition-all cursor-pointer";
      prevBtn.textContent = "◄ PREV";
      prevBtn.onclick = () => { currentPage--; renderRoomTable(); };
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
      nextBtn.onclick = () => { currentPage++; renderRoomTable(); };
      paginationControls.appendChild(nextBtn);
    }
  }
}

/**
 * Tab Switcher for View Room Details Modal
 */
function switchRoomTab(tabName) {
  const overviewTab = document.getElementById('room-tab-overview');
  const membersTab = document.getElementById('room-tab-members');
  const overviewBtn = document.getElementById('tab-overview-btn');
  const membersBtn = document.getElementById('tab-members-btn');

  if (tabName === 'overview') {
    overviewTab.classList.remove('hidden');
    membersTab.classList.add('hidden');

    overviewBtn.className = "px-3 py-1.5 rounded-t-md border-t-2 border-x-2 border-[#3D2013] bg-[#FD923E] text-[#FEF4E0] font-pixel text-[15px] lg:text-[20px] cursor-pointer";
    membersBtn.className = "px-3 py-1.5 rounded-t-md border-t-2 border-x-2 border-transparent text-[#3D2013]/60 hover:text-[#3D2013] cursor-pointer";
  } else {
    overviewTab.classList.add('hidden');
    membersTab.classList.remove('hidden');

    membersBtn.className = "px-3 py-1.5 rounded-t-md border-t-2 border-x-2 border-[#3D2013] bg-[#FD923E] text-[#FEF4E0] font-pixel text-[15px] lg:text-[20px] cursor-pointer";
    overviewBtn.className = "px-3 py-1.5 rounded-t-md border-t-2 border-x-2 border-transparent text-[#3D2013]/60 hover:text-[#3D2013] cursor-pointer";
  }
}

/**
 * Utility function to mask an email string.
 */
function maskEmail(email) {
  if (!email || !email.includes('@')) return email;
  const [username, domain] = email.split('@');
  if (username.length <= 1) {
    return `*@${domain}`;
  } else if (username.length === 2) {
    return `${username[0]}*@${domain}`;
  } else {
    const maskedUsername = username[0] + '*'.repeat(username.length - 2) + username[username.length - 1];
    return `${maskedUsername}@${domain}`;
  }
}

/**
 * Enhanced View Room Handler
 */
function handleViewRoom(id) {
  const room = adminRoomsData.rooms.find(r => r.id === id);
  if (!room) return;

  switchRoomTab('overview');

  const container = document.getElementById('view-room-details');
  const typeBadge = room.type === 'Public' 
    ? `<span class="bg-[#CDECCF] text-[#5C8D57] border border-[#5C8D57] px-2 py-1 rounded-md font-pixel text-[15px] lg:text-[20px] inline-block text-center">Public</span>`
    : `<span class="bg-[#F7CACA] text-[#944444] border border-[#944444] px-2 py-1 rounded-md font-pixel text-[15px] lg:text-[20px] inline-block text-center">Private</span>`;

  container.innerHTML = `
    <div class="flex flex-col gap-4 text-[10px]">
      <div class="flex items-center justify-between pb-2 border-b border-[#3D2013]/20">
        <span class="font-pixel text-[15px] lg:text-[20px] text-sm text-[#3D2013]">${room.name}</span>
        ${typeBadge}
      </div>

      <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 items-center">
        <span class="text-[#3D2013]/80">Current Members:</span>
        <span class="font-pixel text-[15px] lg:text-[20px] text-[#5C8D57]">${room.currentMembers} Players</span>

        <span class="text-[#3D2013]/80">Max Members:</span>
        <span class="font-pixel text-[15px] lg:text-[20px]">${room.maxMembers} Players</span>

        <span class="text-[#3D2013]/80">Created By:</span>
        <div class="flex items-center gap-2 font-pixel text-[15px] lg:text-[20px]">
          <div class="w-5 h-5 rounded-full bg-[#FAE9CE] border border-[#3D2013] flex items-center justify-center overflow-hidden shrink-0">
            ${room.creatorPfp ? `<img src="${room.creatorPfp}" class="w-full h-full object-cover">` : `<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-[#3D2013]" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path fill="currentColor" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4" /></svg>`}
          </div>
          <span>${room.creatorName}</span>
        </div>

        <span class="text-[#3D2013]/80">Created At:</span>
        <span class="font-pixel text-[15px] lg:text-[20px]">${room.createdAt}</span>
      </div>
    </div>
  `;

  const membersListContainer = document.getElementById('view-room-members-list');
  const memberData = room.memberDetails || Array.from({ length: room.currentMembers }, (_, index) => ({
    username: index === 0 ? room.creatorName : `User_${index + 1}`,
    email: index === 0 ? `${room.creatorName.toLowerCase()}@mail.com` : `user_${index + 1}@mail.com`,
    pfp: index === 0 ? room.creatorPfp : ""
  }));

  membersListContainer.innerHTML = memberData.map(m => `
    <tr class="hover:bg-[#FAE9CE]/80 transition-colors">
      <td class="p-2.5">
        <div class="w-6 h-6 rounded-full bg-[#FEF4E0] border border-[#3D2013] flex items-center justify-center overflow-hidden shrink-0">
          ${m.pfp ? `<img src="${m.pfp}" class="w-full h-full object-cover">` : `<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-[#3D2013]" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path fill="currentColor" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4" /></svg>`}
        </div>
      </td>
      <td class="p-2.5 font-pixel text-[15px] lg:text-[20px] truncate max-w-[100px]">${m.username}</td>
      <td class="p-2.5 text-[#3D2013]/70 truncate max-w-[140px]">${maskEmail(m.email)}</td>
    </tr>
  `).join('');

  openModal('view-room-modal');
}

function handleEditRoom(id) {
  const room = adminRoomsData.rooms.find(r => r.id === id);
  if (!room) return;
  selectedRoomId = id;

  document.getElementById('edit-room-name').value = room.name || '';
  document.getElementById('edit-room-type').value = room.type || 'Public';
  document.getElementById('edit-room-members').value = room.maxMembers || 6;
  document.getElementById('edit-room-topic').value = room.topic || '';
  document.getElementById('edit-room-technique').value = room.studyTechnique || 'Pomodoro';
  document.getElementById('edit-room-sessions').value = room.sessions || 1;

  openModal('edit-room-modal');
}

async function saveRoomDetails() {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  const updatedData = {
    name: document.getElementById('edit-room-name').value,
    type: document.getElementById('edit-room-type').value,
    maxMembers: parseInt(document.getElementById('edit-room-members').value, 10) || 6,
    topic: document.getElementById('edit-room-topic').value,
    studyTechnique: document.getElementById('edit-room-technique').value,
    sessions: parseInt(document.getElementById('edit-room-sessions').value, 10) || 1
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/rooms/${selectedRoomId}`, {
      method: "PUT",
      headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(updatedData)
    });

    if (response.ok) {
      await fetchAdminRoomsData();
    }
  } catch (err) {
    console.error("Error updating room:", err);
  }
  closeModal('edit-room-modal');
}

function showRoomDeletedToast(roomName) {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = "bg-[#FBF2E3] border-4 border-[#3D2013] p-4 flex flex-col gap-2 relative shadow-md transition-all duration-300 max-w-xs retro-shadow pointer-events-auto opacity-0 translate-y-[-20px] !rounded-none overflow-hidden";
  toast.style.boxShadow = "4px 4px 0px #3D2013";

  toast.innerHTML = `
    <div class="flex items-center gap-3 pr-2">
      <svg class="w-5 h-5 flex-shrink-0 text-[#A53914]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
      </svg>
      <span class="font-pressstart text-[11px] text-[#482A1D] tracking-wide">
        "${roomName}" removed successfully!
      </span>
    </div>
    <div class="w-full bg-transparent h-1.5 flex justify-center mt-auto overflow-hidden">
      <div class="w-full h-full bg-[#A53914] animate-progress-center"></div>
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

function handleRemoveRoom(id) {
  const room = adminRoomsData.rooms.find(r => r.id === id);
  if (!room) return;
  selectedRoomId = id;

  document.getElementById('remove-room-text').textContent = `Are you sure you want to remove room "${room.name}"?`;
  openModal('remove-room-modal');
}

async function confirmRemoveRoom() {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  const room = adminRoomsData.rooms.find(r => r.id === selectedRoomId);
  if (!room) return;

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/rooms/${selectedRoomId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.ok) {
      showRoomDeletedToast(room.name);
      await fetchAdminRoomsData();
    }
  } catch (err) {
    console.error("Error deleting room:", err);
  }
  closeModal('remove-room-modal');
}

/**
 * Load Dashboard Data & Stats
 */
function loadAdminDashboard(data) {
  const adminName = document.getElementById('admin-name');
  const adminRole = document.getElementById('admin-role');

  if (adminName) adminName.textContent = data.administrator.name;
  if (adminRole) adminRole.textContent = data.administrator.role;

  const totalRooms = document.getElementById('stat-total-rooms');
  const activeRooms = document.getElementById('stat-active-rooms');
  const privateRooms = document.getElementById('stat-private-rooms');
  const publicRooms = document.getElementById('stat-public-rooms');

  if (totalRooms) totalRooms.textContent = data.stats.totalRooms.toLocaleString();
  if (activeRooms) activeRooms.textContent = data.stats.activeRooms.toLocaleString();
  if (privateRooms) privateRooms.textContent = data.stats.privateRooms.toLocaleString();
  if (publicRooms) publicRooms.textContent = data.stats.publicRooms.toLocaleString();

  applySortAndFilter();
}

document.addEventListener('DOMContentLoaded', () => {
  fetchAdminRoomsData();
});