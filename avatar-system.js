// ==========================================
// CENTRALIZED AVATAR CUSTOMIZATION SYSTEM
// ==========================================

// DEFAULT_AVATAR_CONFIG (fallback when no saved avatar exists)
const DEFAULT_AVATAR_CONFIG = {
  body: "BODY1",
  face: "FACE1",
  tops: "TOP7",
  bottoms: "BOTTOM6",
  shoes: "",
  hair: "",
  accessories: ""
};

// 1. Helper to fetch saved configuration from SessionStorage
window.getSavedAvatarConfig = function () {
  const saved = sessionStorage.getItem("user_avatar_config");
  if (!saved) return { ...DEFAULT_AVATAR_CONFIG };
  try {
    return { ...DEFAULT_AVATAR_CONFIG, ...JSON.parse(saved) };
  } catch (e) {
    return { ...DEFAULT_AVATAR_CONFIG };
  }
};

// 2. Helper to save configuration to SessionStorage and notify all components
window.saveAvatarConfig = function (newConfig) {
  sessionStorage.setItem("user_avatar_config", JSON.stringify(newConfig));
  // Fire event so all <custom-avatar> elements update instantly without page refresh
  window.dispatchEvent(new CustomEvent("avatar-updated", { detail: newConfig }));
};

// 3. Helper to build image path dynamically based on folder structure
function getAssetPath(folder, assetName) {
  if (!assetName || assetName.toUpperCase() === "NONE") return null;
  return `ASSETS/${folder}/${assetName}.png`;
}

// 4. Custom Web Component: <custom-avatar>
class CustomAvatar extends HTMLElement {
  static get observedAttributes() {
    return ["config", "state"];
  }

  connectedCallback() {
    this.render();
    // Re-render when global character update occurs (e.g., customizer saved)
    this._onUpdate = (e) => this.render(e.detail);
    window.addEventListener("avatar-updated", this._onUpdate);
  }

  disconnectedCallback() {
    window.removeEventListener("avatar-updated", this._onUpdate);
  }

  attributeChangedCallback() {
    this.render();
  }

  render(overrideConfig = null) {
    // Priority: Explicit inline attribute > Event detail > SessionStorage saved
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
      config = window.getSavedAvatarConfig();
    }

    const animState = this.getAttribute("state") || "idle";

    // Strictly ordered layers (Back to Front)
    const layers = [
      { id: "body", folder: "BODY", name: config.body, z: 10 },
      { id: "bottoms", folder: "BOTTOMS", name: config.bottoms, z: 20 },
      { id: "shoes", folder: "SHOES", name: config.shoes, z: 25 },
      { id: "tops", folder: "TOPS", name: config.tops, z: 30 },
      { id: "face", folder: "FACE", name: config.face, z: 40 },
      { id: "hair", folder: "HAIR", name: config.hair, z: 50 },
      { id: "accessories", folder: "ACCESSORIES", name: config.accessories, z: 60 }
    ];

    // Build template HTML
    const layerImagesHTML = layers
      .map((layer) => {
        const src = getAssetPath(layer.folder, layer.name);
        if (!src) return "";
        return `<img src="${src}" 
                     alt="${layer.id}" 
                     class="avatar-layer layer-${layer.id} absolute inset-0 w-full h-full object-contain pointer-events-none" 
                     style="z-index: ${layer.z};" />`;
      })
      .join("");

    this.innerHTML = `
      <div class="avatar-container relative w-full h-full flex items-center justify-center state-${animState}">
        ${layerImagesHTML}
      </div>
    `;
  }
}

// Register component
if (!customElements.get("custom-avatar")) {
  customElements.define("custom-avatar", CustomAvatar);
}