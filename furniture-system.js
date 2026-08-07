// ==========================================
// CENTRALIZED ROOM / FURNITURE CUSTOMIZATION SYSTEM
// ==========================================

// DEFAULT_FURNITURE_CONFIG (fallback when no saved room exists)
const DEFAULT_FURNITURE_CONFIG = {
  room: "ROOM1"
};

// 1. Helper to fetch saved configuration from sessionStorage
window.getSavedFurnitureConfig = function () {
  const saved = sessionStorage.getItem("user_furniture_config");
  if (!saved) return { ...DEFAULT_FURNITURE_CONFIG };
  try {
    return { ...DEFAULT_FURNITURE_CONFIG, ...JSON.parse(saved) };
  } catch (e) {
    return { ...DEFAULT_FURNITURE_CONFIG };
  }
};

// 2. Helper to save configuration to sessionStorage and notify all components
window.saveFurnitureConfig = function (newConfig) {
  sessionStorage.setItem("user_furniture_config", JSON.stringify(newConfig));
  // Fire event so all <custom-room> elements update instantly without page refresh
  window.dispatchEvent(new CustomEvent("furniture-updated", { detail: newConfig }));
};

// 3. Helper to build image path dynamically based on folder structure
function getFurnitureAssetPath(folder, assetName) {
  if (!assetName || assetName.toUpperCase() === "NONE") return null;
  return `ASSETS/${folder}/${assetName}.png`;
}

// 4. Custom Room Web Component
class CustomRoom extends HTMLElement {
  static get observedAttributes() {
    return ["config"];
  }

  connectedCallback() {
    this.render();

    // Listen for live furniture updates from shop/modal
    this._onUpdate = (e) => this.render(e.detail);
    window.addEventListener("furniture-updated", this._onUpdate);
  }

  disconnectedCallback() {
    window.removeEventListener("furniture-updated", this._onUpdate);
  }

  attributeChangedCallback() {
    this.render();
  }

  render(overrideConfig = null) {
    // Priority: Explicit inline attribute > Event detail > sessionStorage saved
    const rawAttrConfig = this.getAttribute("config");
    let config = overrideConfig;

    if (!config && rawAttrConfig) {
      try {
        config = JSON.parse(rawAttrConfig);
      } catch (e) {
        config = null;
      }
    }

    if (!config) {
      config = window.getSavedFurnitureConfig();
    }

    config = { ...DEFAULT_FURNITURE_CONFIG, ...config };

    // 2. Get asset path (e.g., ASSETS/ROOM/ROOM1.png)
    const imagePath = getFurnitureAssetPath("ROOMS", config.room);

    // 3. Render image inside the custom element
    this.innerHTML = `
      <div class="room-container relative w-full h-full flex items-center justify-center">
        <img
          src="${imagePath}"
          alt="Room Background"
          class="w-full h-full object-contain drop-shadow-md pointer-events-none"
          onerror="console.error('Room image failed to load at path:', this.src)"
        />
      </div>
    `;
  }
}

// Register component
if (!customElements.get("custom-room")) {
  customElements.define("custom-room", CustomRoom);
}
