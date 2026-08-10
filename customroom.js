// ==========================================
// CUSTOM ROOM PAGE LOGIC & CONTROLLER
// ==========================================

// 1. Asset Configuration & Catalog Prices
const ROOM_ASSET_CATALOG = {
  room: [
    { id: "ROOM1", price: 0 },
    { id: "ROOM2", price: 100 },
    { id: "ROOM3", price: 200 },
    { id: "ROOM4", price: 300 },
    { id: "ROOM5", price: 500 }
  ]
};

const ROOM_CATEGORY_MAP = {
  room: { folder: "ROOMS", layerKey: "room", title: "Rooms" }
};

// 2. Global State Variables
let currentRoomCategory = "room";
let activeRoomConfig = { room: "ROOM1" };
let roomHistoryStack = [];
let userCoins = 0;

let ownedFurniture = JSON.parse(sessionStorage.getItem("ownedFurniture")) || [];

function ensureDefaultOwnedFurniture() {
  if (!ownedFurniture.includes("ROOM1")) {
    ownedFurniture.push("ROOM1");
    sessionStorage.setItem("ownedFurniture", JSON.stringify(ownedFurniture));
  }
}

// 3. Initialization - Sync with Backend Database
document.addEventListener("DOMContentLoaded", async () => {
  ensureDefaultOwnedFurniture();

  const token = sessionStorage.getItem("token");

  if (token) {
    try {
      const response = await fetch("http://127.0.0.1:5000/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        // Set userCoins exactly to what the database says
        if (typeof userData.coins === "number") {
          userCoins = userData.coins;
        }
      }
    } catch (err) {
      console.warn("Failed to fetch coins from backend:", err);
    }
  }

  // Fallback if fetch fails
  if (userCoins === 0 && typeof getCoins === "function") {
    userCoins = getCoins();
  }

  const savedConfig = window.getSavedFurnitureConfig ? window.getSavedFurnitureConfig() : { room: "ROOM1" };
  activeRoomConfig = normalizeRoomConfig(savedConfig);

  roomHistoryStack.push(cloneRoomConfig(activeRoomConfig));
  
  // Render and update UI after fetching
  updateCoinsDisplay();
  switchRoomCategory("room");
  updateRoomPreview();
});

function normalizeRoomConfig(config) {
  const validRooms = ROOM_ASSET_CATALOG.room.map(item => item.id);
  const room = config && validRooms.includes(config.room) ? config.room : "ROOM1";
  return { room };
}

function cloneRoomConfig(config) {
  return JSON.parse(JSON.stringify(config));
}

function getRoomItem(roomId) {
  return ROOM_ASSET_CATALOG.room.find(item => item.id === roomId);
}

function getCoinBadgeHTML(item) {
  if (ownedFurniture.includes(item.id)) return "";

  return `
    <div class="absolute bottom-1 left-1/2 -translate-x-1/2 bg-[#FAE9CE]/90 border border-[#3D2013] rounded-full px-1.5 py-0.5 flex items-center gap-0.5 shadow-xs z-10 pointer-events-none w-max">
      <img src="media/coin_logo.png" alt="Coin" class="w-4 h-4 object-contain" onerror="this.style.display='none'">
      <span class="text-[9px] text-[#3D2013] font-pressstart leading-none">${item.price}</span>
    </div>
  `;
}

function updateCoinsDisplay() {
  // Update all instances of user coin display matching this class or ID
  const coinElements = document.querySelectorAll(".user-coin-balance, #coins-count, #modal-coins-count");
  coinElements.forEach(el => {
    if (el) {
      el.textContent = userCoins.toLocaleString();
    }
  });

  if (typeof updateCoinDisplays === "function") {
    updateCoinDisplays();
  }
}

function switchRoomCategory(cat) {
  currentRoomCategory = cat;

  const btn = document.getElementById(`nav-${cat}`);
  if (btn) {
    btn.classList.add(
      "bg-[#F3CBA8]",
      "text-black",
      "after:content-['']",
      "after:absolute",
      "after:bottom-0",
      "after:left-0",
      "after:right-0",
      "after:h-[3px]",
      "after:bg-[#D75C2D]",
      "active"
    );
    btn.classList.remove("text-[#A59385]", "hover:text-[#3D2013]");
  }

  const titleElem = document.getElementById("active-category-title");
  if (titleElem) {
    titleElem.textContent = ROOM_CATEGORY_MAP[cat]?.title || "Rooms";
  }

  renderRoomAssets();
}

function renderRoomAssets() {
  const container = document.getElementById("asset-grid");
  if (!container) return;

  const items = ROOM_ASSET_CATALOG[currentRoomCategory] || [];
  const meta = ROOM_CATEGORY_MAP[currentRoomCategory];

  container.innerHTML = items.map(item => {
    const isSelected = activeRoomConfig[meta.layerKey] === item.id;
    const imgPath = `ASSETS/${meta.folder}/${item.id}.png`;

    return `
      <div onclick="selectRoomAsset('${currentRoomCategory}', '${item.id}')"
           style="background: linear-gradient(180deg, #FFF2DD 0%, #FFEAC8 100%);"
           class="relative aspect-[4/3] border-[2.5px] ${isSelected ? "border-[#E87339] ring-2 ring-[#E87339]" : "border-[#3D2013]"} rounded-[8px] p-1.5 flex flex-col items-center justify-center cursor-pointer hover:scale-[1.02] transition-transform shadow-xs overflow-hidden">
        <div class="w-full h-full flex items-center justify-center overflow-hidden pb-4">
          <img src="${imgPath}" alt="${item.id}" class="max-h-full max-w-full object-contain pointer-events-none" onerror="this.style.display='none'; this.nextElementSibling.classList.remove('hidden')">
          <span class="hidden text-[8px] text-[#3D2013] font-pressstart">${item.id}</span>
        </div>
        ${getCoinBadgeHTML(item)}
      </div>
    `;
  }).join("");
}

function selectRoomAsset(category, assetId) {
  const meta = ROOM_CATEGORY_MAP[category];
  if (!meta || activeRoomConfig[meta.layerKey] === assetId) return;

  roomHistoryStack.push(cloneRoomConfig(activeRoomConfig));
  activeRoomConfig[meta.layerKey] = assetId;

  updateRoomPreview();
  renderRoomAssets();
}

function updateRoomPreview() {
  const preview = document.getElementById("main-room-preview");
  if (preview) {
    preview.setAttribute("config", JSON.stringify(activeRoomConfig));
  }

  const unownedItems = getUnownedSelectedFurniture();
  const totalCost = unownedItems.reduce((sum, item) => {
    const catalogItem = getRoomItem(item.id);
    return sum + (catalogItem ? catalogItem.price : 0);
  }, 0);

  const costDisplay = document.getElementById("additional-cost-display");
  if (costDisplay) {
    costDisplay.textContent = totalCost.toLocaleString();
  }

  const mainBtn = document.getElementById("main-action-btn");
  if (mainBtn) {
    mainBtn.textContent = unownedItems.length > 0 ? "BUY AND SAVE" : "SAVE";
  }
}

function randomizeRoom() {
  const rooms = ROOM_ASSET_CATALOG.room;
  if (!rooms.length) return;

  roomHistoryStack.push(cloneRoomConfig(activeRoomConfig));
  const randomItem = rooms[Math.floor(Math.random() * rooms.length)];
  activeRoomConfig.room = randomItem.id;

  updateRoomPreview();
  renderRoomAssets();
}

function undoLastAction() {
  if (roomHistoryStack.length > 1) {
    activeRoomConfig = roomHistoryStack.pop();
    updateRoomPreview();
    renderRoomAssets();
  }
}

function captureRoomSnapshot() {
  const container = document.getElementById("snapshot-preview-container");
  if (!container) return;

  container.innerHTML = `<custom-room id="snapshot-room" class="w-full h-full" config='${JSON.stringify(activeRoomConfig)}'></custom-room>`;

  const downloadBtn = document.getElementById("download-photo-btn");
  if (downloadBtn) {
    downloadBtn.onclick = downloadRoomSnapshot;
  }

  openModal("snapshot-modal");
}

function downloadRoomSnapshot() {
  const container = document.getElementById("snapshot-preview-container");
  if (!container) return;

  if (typeof html2canvas === "function") {
    html2canvas(container, {
      scale: 3,
      backgroundColor: "#FAE9CE",
      useCORS: true,
      allowTaint: true,
      logging: false
    }).then(canvas => {
      triggerRoomImageDownload(canvas.toDataURL("image/png"));
    }).catch(err => {
      console.warn("html2canvas export failed, trying direct Canvas fallback:", err);
      fallbackDirectRoomCanvasDownload(container);
    });
  } else {
    fallbackDirectRoomCanvasDownload(container);
  }
}

function fallbackDirectRoomCanvasDownload(container) {
  const images = Array.from(container.querySelectorAll("img"));
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 675;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#FAE9CE";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (images.length === 0) {
    triggerRoomImageDownload(canvas.toDataURL("image/png"));
    return;
  }

  let loadedCount = 0;

  images.forEach(imgSource => {
    const layerImg = new Image();
    layerImg.crossOrigin = "anonymous";
    layerImg.onload = () => {
      ctx.drawImage(layerImg, 0, 0, canvas.width, canvas.height);
      loadedCount++;
      if (loadedCount === images.length) {
        triggerRoomImageDownload(canvas.toDataURL("image/png"));
      }
    };
    layerImg.onerror = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        triggerRoomImageDownload(canvas.toDataURL("image/png"));
      }
    };
    layerImg.src = imgSource.src;
  });
}

function triggerRoomImageDownload(dataUrl) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `room-snapshot-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  closeModal("snapshot-modal");
}

function getUnownedSelectedFurniture() {
  const unownedItems = [];
  const currentId = activeRoomConfig.room;

  if (currentId && !ownedFurniture.includes(currentId)) {
    unownedItems.push({ cat: "room", id: currentId });
  }

  return unownedItems;
}

function openPurchaseModal() {
  const itemList = getUnownedSelectedFurniture();
  const totalCost = itemList.reduce((sum, i) => {
    const item = getRoomItem(i.id);
    return sum + (item ? item.price : 0);
  }, 0);

  const listContainer = document.getElementById("modal-item-list");

  if (listContainer) {
    if (itemList.length === 0) {
      listContainer.className = "flex items-center justify-center min-h-[100px]";
      listContainer.innerHTML = `<p class="text-[8px] text-[#3D2013]/60 italic text-center font-pressstart">No new unowned rooms selected.</p>`;
    } else {
      listContainer.className = "grid grid-cols-1 gap-2.5 max-h-[260px] overflow-y-auto p-1";
      listContainer.innerHTML = itemList.map(i => {
        const item = getRoomItem(i.id);
        return `
          <div style="background: linear-gradient(180deg, #FFF2DD 0%, #FFEAC8 100%);"
               class="relative aspect-[4/3] border-[2px] border-[#3D2013] rounded-[8px] p-2 flex flex-col items-center justify-between shadow-xs overflow-hidden">
            <div class="w-full h-full flex items-center justify-center overflow-hidden pb-5">
              <img src="ASSETS/ROOMS/${i.id}.png" alt="${i.id}" class="max-h-full max-w-full object-contain pointer-events-none">
            </div>
            <div class="absolute bottom-1 left-1/2 -translate-x-1/2 bg-[#FAE9CE]/90 border border-[#3D2013] rounded-full px-1.5 py-0.5 flex items-center gap-1 shadow-xs z-10 pointer-events-none w-max">
              <img src="media/coin_logo.png" alt="Coin" class="w-3 h-3 object-contain">
              <span class="text-[8px] text-[#3D2013] font-pressstart leading-none">${item ? item.price : 0}</span>
            </div>
          </div>
        `;
      }).join("");
    }
  }

  const modalTotalCost = document.getElementById("modal-total-cost");
  if (modalTotalCost) modalTotalCost.textContent = totalCost.toLocaleString();

  document.getElementById("insufficient-coins-msg")?.classList.add("hidden");
  document.getElementById("no-items-selected-msg")?.classList.add("hidden");

  openModal("buy-modal");
}

function confirmPurchaseAndSave() {
  const unownedItems = getUnownedSelectedFurniture();
  const noItemsMsg = document.getElementById("no-items-selected-msg");
  const insufficientCoinsMsg = document.getElementById("insufficient-coins-msg");

  noItemsMsg?.classList.add("hidden");
  insufficientCoinsMsg?.classList.add("hidden");

  if (unownedItems.length === 0) {
    noItemsMsg?.classList.remove("hidden");
    return;
  }

  const totalCost = unownedItems.reduce((sum, i) => {
    const item = getRoomItem(i.id);
    return sum + (item ? item.price : 0);
  }, 0);

  const currentBalance = typeof getCoins === "function" ? getCoins() : userCoins;

  if (currentBalance < totalCost) {
    insufficientCoinsMsg?.classList.remove("hidden");
    return;
  }

  if (typeof deductCoins === "function") {
    const didDeduct = deductCoins(totalCost);
    if (!didDeduct) {
      insufficientCoinsMsg?.classList.remove("hidden");
      return;
    }
    userCoins = getCoins();
  } else {
    userCoins -= totalCost;
    sessionStorage.setItem("player_user_coins", String(userCoins));
    updateCoinsDisplay();
  }

  unownedItems.forEach(item => {
    if (!ownedFurniture.includes(item.id)) {
      ownedFurniture.push(item.id);
    }
  });
  sessionStorage.setItem("ownedFurniture", JSON.stringify(ownedFurniture));

  saveActiveRoomConfig();

  renderRoomAssets();
  updateRoomPreview();
  updateCoinsDisplay();
  closeModal("buy-modal");
  showRoomCustomizerSuccessToast("Room Saved!");
}

async function saveRoomToBackend(config) {
    try {
        const token = sessionStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:5000/api/update-room", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ config: config })
        });
        
        const data = await response.json();
        if (!response.ok) {
            console.error("Failed to sync room to database:", data.error);
        } else {
            console.log("Room successfully synced to Supabase!", data);
        }
    } catch (err) {
        console.error("Network error while saving room:", err);
    }
}

function saveActiveRoomConfig() {
  if (window.saveFurnitureConfig) {
    window.saveFurnitureConfig(activeRoomConfig);
  } else {
    sessionStorage.setItem("user_furniture_config", JSON.stringify(activeRoomConfig));
    window.dispatchEvent(new CustomEvent("furniture-updated", { detail: activeRoomConfig }));
  }

  // Sync room configuration to backend Supabase database
  saveRoomToBackend(activeRoomConfig);
}

function handleSaveOrBuy() {
  const unownedItems = getUnownedSelectedFurniture();

  if (unownedItems.length > 0) {
    openPurchaseModal();
    return;
  }

  saveActiveRoomConfig();
  showRoomCustomizerSuccessToast("Room saved");
}

function showRoomCustomizerSuccessToast(message = "Room saved") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className =
    "bg-[#FBF2E3] border-4 border-[#3D2013] p-4 flex flex-col gap-2 relative shadow-md " +
    "transition-all duration-300 max-w-xs retro-shadow pointer-events-auto " +
    "opacity-0 translate-y-[-20px] !rounded-none overflow-hidden";
  toast.style.boxShadow = "4px 4px 0px #3D2013";

  toast.innerHTML = `
    <div class="flex items-center gap-3 pr-2">
      <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="#788D55" stroke-width="4" stroke-linecap="square" stroke-linejoin="square"/>
      </svg>
      <span class="font-pressstart text-[11px] text-[#482A1D] tracking-wide">${message}</span>
    </div>
    <div class="w-full bg-transparent h-1.5 flex justify-center mt-auto overflow-hidden">
      <div class="w-full h-full bg-[#788D55] animate-progress-center"></div>
    </div>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove("opacity-0", "translate-y-[-20px]");
    toast.classList.add("opacity-100", "translate-y-0");
  });

  setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-y-0");
    toast.classList.add("opacity-0", "translate-y-[-20px]");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

if (typeof window.openModal !== "function") {
  window.openModal = function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove("hidden");
  };
}

if (typeof window.closeModal !== "function") {
  window.closeModal = function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  };
}

window.addEventListener("storage", (event) => {
  if (event.key === "player_user_coins") {
    if (typeof getCoins === "function") {
      userCoins = getCoins();
    }
    updateCoinsDisplay();
  }

  if (event.key === "ownedFurniture") {
    ownedFurniture = JSON.parse(sessionStorage.getItem("ownedFurniture")) || [];
    ensureDefaultOwnedFurniture();
    renderRoomAssets();
    updateRoomPreview();
  }
});