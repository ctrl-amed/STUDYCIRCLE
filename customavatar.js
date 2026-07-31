// ==========================================
// CUSTOM AVATAR PAGE LOGIC & CONTROLLER
// ==========================================

// 1. Asset Configuration & Catalog Prices
// Free assets updated: BODY1-3, HAIR3-4, TOP5-6, SHOE1, SHOE6
const ASSET_CATALOG = {
  body: [
    { id: "BODY1", price: 0, hex: "#F3D0B1" },
    { id: "BODY2", price: 0, hex: "#D89D71" },
    { id: "BODY3", price: 0, hex: "#734226" }
  ],
  face: [
    { id: "FACE1", price: 0 },
    { id: "FACE2", price: 100 },
    { id: "FACE3", price: 150 },
    { id: "FACE4", price: 200 },
    { id: "FACE5", price: 250 }
  ],
  hair: [
    { id: "HAIR1", price: 100 },
    { id: "HAIR2", price: 120 },
    { id: "HAIR3", price: 0 },
    { id: "HAIR4", price: 0 },
    { id: "HAIR5", price: 280 },
    { id: "HAIR6", price: 350 }
  ],
  clothe: [ 
    { id: "TOP1", price: 100 },
    { id: "TOP2", price: 150 },
    { id: "TOP3", price: 200 },
    { id: "TOP4", price: 250 },
    { id: "TOP5", price: 0 },
    { id: "TOP6", price: 0 }
  ],
  short: [ 
    { id: "BOTTOM1", price: 100 },
    { id: "BOTTOM2", price: 120 },
    { id: "BOTTOM3", price: 150 },
    { id: "BOTTOM4", price: 0 },
    { id: "BOTTOM5", price: 250 }
  ],
  accessory: [
    { id: "ACCESSORY1", price: 100 },
    { id: "ACCESSORY2", price: 120 },
    { id: "ACCESSORY3", price: 180 },
    { id: "ACCESSORY4", price: 220 },
    { id: "ACCESSORY5", price: 280 }
  ],
  shoe: [
    { id: "SHOE1", price: 0 },
    { id: "SHOE2", price: 80 },
    { id: "SHOE3", price: 140 },
    { id: "SHOE4", price: 180 },
    { id: "SHOE5", price: 220 },
    { id: "SHOE6", price: 0 }
  ]
};

// Category mapping helper
const CATEGORY_MAP = {
  body: { folder: "BODY", layerKey: "body" },
  face: { folder: "FACE", layerKey: "face" },
  hair: { folder: "HAIR", layerKey: "hair" },
  clothe: { folder: "TOPS", layerKey: "tops" },
  short: { folder: "BOTTOMS", layerKey: "bottoms" },
  accessory: { folder: "ACCESSORIES", layerKey: "accessories" },
  shoe: { folder: "SHOES", layerKey: "shoes" }
};

// 2. Global State Variables
let currentCategory = "face";
let activeConfig = {};
let historyStack = [];
let userCoins = 0;

// Track owned assets from localStorage
let ownedAssets = JSON.parse(localStorage.getItem("ownedAssets")) || [];

// 3. Initialization
// 3. Initialization in customavatar.html
document.addEventListener("DOMContentLoaded", () => {
  if (typeof getCoins === "function") {
    userCoins = getCoins();
  }

  const isJustSignedUp = localStorage.getItem("justSignedUp") === "true";
  const savedConfig = window.getSavedAvatarConfig ? window.getSavedAvatarConfig() : null;

  if (isJustSignedUp) {
    // New Signup Flow: Mark tutorial as pending for next page load
    localStorage.removeItem("justSignedUp");
    localStorage.setItem("pendingTutorial", "true"); // 👈 Set flag for tutorial

    activeConfig = {
      body: "BODY1",
      face: "FACE1",
      hair: "",
      tops: "TOP7",
      bottoms: "BOTTOM6",
      accessories: "",
      shoes: ""
    };
    if (!ownedAssets.includes("FACE1")) ownedAssets.push("FACE1");
    if (!ownedAssets.includes("BODY1")) ownedAssets.push("BODY1");
    localStorage.setItem("ownedAssets", JSON.stringify(ownedAssets));
  } else if (savedConfig && Object.keys(savedConfig).length > 0) {
    activeConfig = savedConfig;
  } else {
    activeConfig = {
      body: "BODY1",
      face: "FACE1",
      hair: "",
      tops: "TOP7",
      bottoms: "BOTTOM6",
      accessories: "",
      shoes: ""
    };
  }

  historyStack.push(JSON.parse(JSON.stringify(activeConfig)));
  updateCoinsDisplay();
  renderBodySection();
  switchCategory("face");
  updateAvatarPreview();
});

// Helper: Generates Coin Overlay Badge HTML
function getCoinBadgeHTML(item) {
  if (ownedAssets.includes(item.id)) {
    return ""; // Hide badge if already owned
  }

  return `
    <div class="absolute bottom-1 left-1/2 -translate-x-1/2 bg-[#FAE9CE]/90 border border-[#3D2013] rounded-full px-1.5 py-0.5 flex items-center gap-0.5 shadow-xs z-10 pointer-events-none w-max">
      <img src="media/coin_logo.png" alt="Coin" class="w-4 h-4 object-contain" onerror="this.style.display='none'">
      <span class="text-[9px] text-[#3D2013] font-pressstart leading-none">${item.price}</span>
    </div>
  `;
}

// Update Coins UI
function updateCoinsDisplay() {
  // Always get fresh coin count from storage if available
  if (typeof getCoins === "function") {
    userCoins = getCoins();
  }

  // Update elements in customavatar page
  const coinsElem = document.getElementById("coins-count");
  const modalCoinsElem = document.getElementById("modal-coins-count");

  if (coinsElem) coinsElem.textContent = userCoins.toLocaleString();
  if (modalCoinsElem) modalCoinsElem.textContent = userCoins.toLocaleString();

  // Also trigger central display updater to sync header/modal badges
  if (typeof updateCoinDisplays === "function") {
    updateCoinDisplays();
  }
}

function switchCategory(cat) {
  currentCategory = cat;

  const categories = ['face', 'hair', 'clothe', 'short', 'accessory', 'shoe'];

  const activeClasses = [
    'bg-[#F3CBA8]',
    'text-black',
    "after:content-['']",
    'after:absolute',
    'after:bottom-0',
    'after:left-0',
    'after:right-0',
    'after:h-[3px]',
    'after:bg-[#D75C2D]'
  ];

  const inactiveClasses = ['text-[#A59385]', 'hover:text-[#3D2013]'];

  categories.forEach(category => {
    const btn = document.getElementById(`nav-${category}`);
    if (!btn) return;

    if (category === cat) {
      btn.classList.remove(...inactiveClasses);
      btn.classList.add(...activeClasses, 'active');
    } else {
      btn.classList.remove(...activeClasses);
      btn.classList.add(...inactiveClasses);
    }
  });

  const bodySec = document.getElementById("body-section");
  if (bodySec) {
    bodySec.classList.toggle("hidden", cat !== "face");
  }

  const titles = {
    face: "Face",
    hair: "Hairs",
    clothe: "Tops",
    short: "Bottoms",
    accessory: "Accessories",
    shoe: "Shoes"
  };

  const titleElem = document.getElementById("active-category-title");
  if (titleElem) {
    titleElem.textContent = titles[cat] || cat;
  }

  if (typeof renderAssets === 'function') {
    renderAssets();
  }
}

// Render Skin Tone Section
function renderBodySection() {
  const container = document.getElementById("body-asset-grid");
  if (!container) return;

  container.innerHTML = ASSET_CATALOG.body.map(item => {
    const isSelected = activeConfig.body === item.id;
    return `
      <div onclick="selectAsset('body', '${item.id}')"
           style="background: linear-gradient(180deg, #FFF2DD 0%, #FFEAC8 100%);"
           class="relative aspect-square border-[2.5px] ${isSelected ? 'border-[#E87339] ring-2 ring-[#E87339]' : 'border-[#3D2013]'} rounded-[8px] p-2 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-xs overflow-hidden">
        <div class="w-full h-12 rounded-[4px] border border-[#3D2013]/30 mb-2" style="background-color: ${item.hex}"></div>
        ${getCoinBadgeHTML(item)}
      </div>
    `;
  }).join("");
}

// Clear current category asset (Returns layer to default empty state)
// Excludes 'body' and 'face'
function clearCategory(category) {
  if (category === "body" || category === "face") return;

  const meta = CATEGORY_MAP[category];
  if (!meta) return;

  historyStack.push(JSON.parse(JSON.stringify(activeConfig)));
  activeConfig[meta.layerKey] = "";
  
  updateAvatarPreview();
  renderAssets();
}

// Render Current Category Assets
function renderAssets() {
  const container = document.getElementById("asset-grid");
  if (!container) return;

  const items = ASSET_CATALOG[currentCategory] || [];
  const meta = CATEGORY_MAP[currentCategory];

  let htmlMarkup = "";

  // Insert No Asset / Clear Button for all categories EXCEPT body and face
  if (currentCategory !== "body" && currentCategory !== "face") {
    const isNoneSelected = !activeConfig[meta.layerKey] || activeConfig[meta.layerKey] === "";
    
    htmlMarkup += `
      <div onclick="clearCategory('${currentCategory}')"
           style="background: linear-gradient(180deg, #FFF2DD 0%, #FFEAC8 100%);"
           class="relative aspect-square border-[2.5px] ${isNoneSelected ? 'border-[#E87339] ring-2 ring-[#E87339]' : 'border-[#3D2013]'} rounded-[8px] p-1.5 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-xs overflow-hidden">
        <div class="w-full h-full flex flex-col items-center justify-center gap-1 text-[#3D2013]">
          <svg class="w-8 h-8 opacity-70" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
          </svg>
          <span class="text-[8px] font-pressstart uppercase">NONE</span>
        </div>
      </div>
    `;
  }

  // Render grid items
  htmlMarkup += items.map(item => {
    const isSelected = activeConfig[meta.layerKey] === item.id;
    const imgPath = `ASSETS/${meta.folder}/${item.id}.png`;

    return `
      <div onclick="selectAsset('${currentCategory}', '${item.id}')"
           style="background: linear-gradient(180deg, #FFF2DD 0%, #FFEAC8 100%);"
           class="relative aspect-square border-[2.5px] ${isSelected ? 'border-[#E87339] ring-2 ring-[#E87339]' : 'border-[#3D2013]'} rounded-[8px] p-1.5 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-xs overflow-hidden">
        <div class="w-full h-full flex items-center justify-center overflow-hidden pb-3">
          <img src="${imgPath}" alt="${item.id}" class="max-h-full max-w-full object-contain pointer-events-none" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\'><text x=\\'50%\\' y=\\'50%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' font-size=\\'10\\'>📦</text></svg>'">
        </div>
        ${getCoinBadgeHTML(item)}
      </div>
    `;
  }).join("");

  container.innerHTML = htmlMarkup;
}

// Asset Selection Event
// Asset Selection Event (With Toggle/Unequip Logic)
function selectAsset(category, assetId) {
  const meta = CATEGORY_MAP[category];
  if (!meta) return;

  historyStack.push(JSON.parse(JSON.stringify(activeConfig)));

  // If clicking an already equipped asset (excluding body and face), unequip it
  if (category !== "body" && category !== "face" && activeConfig[meta.layerKey] === assetId) {
    activeConfig[meta.layerKey] = "";
  } else {
    // Otherwise, equip the selected asset
    activeConfig[meta.layerKey] = assetId;
  }

  updateAvatarPreview();
  if (category === "face" || category === "body") {
    renderBodySection();
  }
  renderAssets();
}

function updateAvatarPreview() {
  const preview = document.getElementById("main-avatar-preview");
  if (preview) {
    preview.setAttribute("config", JSON.stringify(activeConfig));
  }

  const unownedItems = getUnownedSelectedItems();
  let totalCost = 0;

  unownedItems.forEach(item => {
    const catalogItem = ASSET_CATALOG[item.cat]?.find(i => i.id === item.id);
    if (catalogItem) totalCost += catalogItem.price;
  });

  // Update additional cost readout
  const costDisplay = document.getElementById("additional-cost-display");
  if (costDisplay) {
    costDisplay.textContent = totalCost.toLocaleString();
  }

  // Update main action button text
  const mainBtn = document.getElementById("main-action-btn");
  if (mainBtn) {
    mainBtn.textContent = unownedItems.length > 0 ? "BUY AND SAVE" : "SAVE";
  }
}

// Stack Controls: Dice Randomizer
function randomizeAvatar() {
  historyStack.push(JSON.parse(JSON.stringify(activeConfig)));

  Object.keys(CATEGORY_MAP).forEach(cat => {
    const list = ASSET_CATALOG[cat];
    if (cat === "accessory") {
      const equipAccessory = Math.random() > 0.5;
      if (equipAccessory) {
        const randomItem = list[Math.floor(Math.random() * list.length)];
        activeConfig[CATEGORY_MAP[cat].layerKey] = randomItem.id;
      } else {
        activeConfig[CATEGORY_MAP[cat].layerKey] = "";
      }
    } else {
      const randomItem = list[Math.floor(Math.random() * list.length)];
      activeConfig[CATEGORY_MAP[cat].layerKey] = randomItem.id;
    }
  });

  updateAvatarPreview();
  renderBodySection();
  renderAssets();
}

// Stack Controls: Undo
function undoLastAction() {
  if (historyStack.length > 1) {
    activeConfig = historyStack.pop();
    updateAvatarPreview();
    renderBodySection();
    renderAssets();
  }
}

// Stack Controls: Camera Snapshot
function captureSnapshot() {
  const container = document.getElementById("snapshot-preview-container");
  if (!container) return;

  container.innerHTML = `<custom-avatar id="snapshot-avatar" class="w-full h-full" config='${JSON.stringify(activeConfig)}'></custom-avatar>`;
  
  const downloadBtn = document.getElementById("download-photo-btn");
  if (downloadBtn) {
    downloadBtn.onclick = downloadAvatarSnapshot;
  }

  openModal("snapshot-modal");
}

function downloadAvatarSnapshot() {
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
      triggerImageDownload(canvas.toDataURL("image/png"));
    }).catch(err => {
      console.warn("html2canvas export failed, trying direct Canvas fallback:", err);
      fallbackDirectCanvasDownload(container);
    });
  } else {
    fallbackDirectCanvasDownload(container);
  }
}

function fallbackDirectCanvasDownload(container) {
  const images = Array.from(container.querySelectorAll("img"));
  const canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#FAE9CE";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (images.length === 0) {
    const svgElem = container.querySelector("svg");
    if (svgElem) {
      const svgData = new XMLSerializer().serializeToString(svgElem);
      const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        triggerImageDownload(canvas.toDataURL("image/png"));
      };
      img.src = url;
      return;
    }
  }

  let loadedCount = 0;
  const total = images.length;

  if (total === 0) {
    triggerImageDownload(canvas.toDataURL("image/png"));
    return;
  }

  images.forEach(imgSource => {
    const layerImg = new Image();
    layerImg.crossOrigin = "anonymous";
    layerImg.onload = () => {
      ctx.drawImage(layerImg, 0, 0, canvas.width, canvas.height);
      loadedCount++;
      if (loadedCount === total) {
        triggerImageDownload(canvas.toDataURL("image/png"));
      }
    };
    layerImg.onerror = () => {
      loadedCount++;
      if (loadedCount === total) {
        triggerImageDownload(canvas.toDataURL("image/png"));
      }
    };
    layerImg.src = imgSource.src;
  });
}

function triggerImageDownload(dataUrl) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `avatar-snapshot-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  closeModal("snapshot-modal");
}

// Purchase Modal Open & Item Breakdown
function openPurchaseModal() {
  const itemList = [];
  let totalCost = 0;

  Object.keys(CATEGORY_MAP).forEach(cat => {
    const meta = CATEGORY_MAP[cat];
    const layerKey = meta.layerKey;
    const currentId = activeConfig[layerKey];

    // Check for selected assets that are NOT yet in ownedAssets
    if (currentId && !ownedAssets.includes(currentId)) {
      const item = ASSET_CATALOG[cat].find(i => i.id === currentId);
      if (item) {
        totalCost += item.price;
        itemList.push({
          id: item.id,
          price: item.price,
          category: cat,
          folder: meta.folder,
          hex: item.hex || null
        });
      }
    }
  });

  const listContainer = document.getElementById("modal-item-list");

  if (itemList.length === 0) {
    listContainer.className = "flex items-center justify-center min-h-[100px]";
    listContainer.innerHTML = `<p class="text-[8px] text-[#3D2013]/60 italic text-center font-pressstart">No new unowned items selected.</p>`;
  } else {
    listContainer.className = "grid grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto p-1";
    listContainer.innerHTML = itemList.map(i => {
      const content = i.category === 'body' 
        ? `<div class="w-full h-10 rounded-[4px] border border-[#3D2013]/30" style="background-color: ${i.hex}"></div>`
        : `<img src="ASSETS/${i.folder}/${i.id}.png" alt="${i.id}" class="max-h-full max-w-full object-contain pointer-events-none" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\'><text x=\\'50%\\' y=\\'50%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' font-size=\\'10\\'>📦</text></svg>'">`;

      return `
        <div style="background: linear-gradient(180deg, #FFF2DD 0%, #FFEAC8 100%);"
             class="relative aspect-square border-[2px] border-[#3D2013] rounded-[8px] p-2 flex flex-col items-center justify-between shadow-xs overflow-hidden">
          <div class="w-full h-full flex items-center justify-center overflow-hidden pb-4">
            ${content}
          </div>
          <div class="absolute bottom-1 left-1/2 -translate-x-1/2 bg-[#FAE9CE]/90 border border-[#3D2013] rounded-full px-1.5 py-0.5 flex items-center gap-1 shadow-xs z-10 pointer-events-none w-max">
            <img src="media/coin_logo.png" alt="Coin" class="w-3 h-3 object-contain">
            <span class="text-[8px] text-[#3D2013] font-pressstart leading-none">${i.price}</span>
          </div>
        </div>
      `;
    }).join("");
  }

  const modalTotalCost = document.getElementById("modal-total-cost");
  if (modalTotalCost) modalTotalCost.textContent = totalCost.toLocaleString();
  
  document.getElementById("insufficient-coins-msg")?.classList.add("hidden");
  document.getElementById("no-items-selected-msg")?.classList.add("hidden");
  
  openModal("buy-modal");
}

// Confirm Purchase & Save Configuration
// Confirm Purchase & Save Configuration
function confirmPurchaseAndSave() {
  const unownedItems = [];

  Object.keys(CATEGORY_MAP).forEach(cat => {
    const layerKey = CATEGORY_MAP[cat].layerKey;
    const currentId = activeConfig[layerKey];
    if (currentId && !ownedAssets.includes(currentId)) {
      unownedItems.push({ cat, id: currentId });
    }
  });

  const noItemsMsg = document.getElementById("no-items-selected-msg");
  const insufficientCoinsMsg = document.getElementById("insufficient-coins-msg");

  noItemsMsg?.classList.add("hidden");
  insufficientCoinsMsg?.classList.add("hidden");

  if (unownedItems.length === 0) {
    noItemsMsg?.classList.remove("hidden");
    return;
  }

  let totalCost = 0;
  unownedItems.forEach(item => {
    const catalogItem = ASSET_CATALOG[item.cat].find(i => i.id === item.id);
    if (catalogItem) totalCost += catalogItem.price;
  });

  // Check balance using central function if available
  const currentBalance = typeof getCoins === "function" ? getCoins() : userCoins;

  if (currentBalance < totalCost) {
    insufficientCoinsMsg?.classList.remove("hidden");
    return;
  }

  // Deduct coins via add-coins.js helper
  if (typeof deductCoins === "function") {
    deductCoins(totalCost); // Deducts & automatically updates localStorage and UI
    userCoins = getCoins();
  } else {
    // Fallback if add-coins.js is missing
    userCoins -= totalCost;
    updateCoinsDisplay();
  }

  // Register newly owned items
  unownedItems.forEach(item => {
    ownedAssets.push(item.id);
  });
  localStorage.setItem("ownedAssets", JSON.stringify(ownedAssets));

  if (window.saveAvatarConfig) {
    window.saveAvatarConfig(activeConfig);
  }

  renderBodySection();
  renderAssets();
  updateAvatarPreview();

  closeModal("buy-modal");
  showCustomizerSuccessToast("Avatar Saved!");
}

// Retro Toast Helper
function showCustomizerSuccessToast(message = "Purchase Successful!") {
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

// Helper: Get array of currently selected unowned items
function getUnownedSelectedItems() {
  const unownedItems = [];
  Object.keys(CATEGORY_MAP).forEach(cat => {
    const layerKey = CATEGORY_MAP[cat].layerKey;
    const currentId = activeConfig[layerKey];
    if (currentId && !ownedAssets.includes(currentId)) {
      unownedItems.push({ cat, id: currentId });
    }
  });
  return unownedItems;
}

// Action button click handler
function handleSaveOrBuy() {
  const unownedItems = getUnownedSelectedItems();

  if (unownedItems.length > 0) {
    // Has unowned items -> Open Purchase Modal
    openPurchaseModal();
  } else {
    // Only equipped owned items -> Directly Save Configuration
    if (window.saveAvatarConfig) {
      window.saveAvatarConfig(activeConfig);
    }
    showCustomizerSuccessToast("Avatar saved");
  }
}

// Modal Utilities
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("hidden");
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("hidden");
}

// Sync avatar page userCoins when coins are purchased or updated in storage
window.addEventListener("storage", (event) => {
  if (event.key === "player_user_coins") {
    if (typeof getCoins === "function") {
      userCoins = getCoins();
    }
    updateCoinsDisplay();
  }
});