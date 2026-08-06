/**
 * Retro Loading Overlay Controller
 */

// Collection of study & focus quotes to randomly cycle through
const RETRO_QUOTES = [
  "Success comes from consistent, small efforts...",
  "Press onward, one pomodoro at a time!",
  "Great achievements require time and patience.",
  "Focus is a muscle. Train it every day.",
  "Your future self will thank you for today's focus.",
  "Small daily steps lead to huge long-term results.",
  "Rest when you're done, not when you're tired.",
  "Distraction is the enemy of deep work.",
  "Clear minds yield the sharpest focus.",
  "Consistency beats intensity every single time."
];

let quoteInterval = null;

/**
 * Returns a random quote that isn't the current quote text
 */
function getRandomQuote(currentQuote = "") {
  const filtered = RETRO_QUOTES.filter(q => q !== currentQuote);
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

/**
 * Injects the Loading Overlay DOM elements if they don't already exist
 */
function ensureOverlayInDOM() {
  if (document.getElementById('loading-overlay')) return;

  const overlayHTML = `
    <div id="loading-overlay" class="fixed inset-0 bg-[#FBF2E3] flex flex-col items-center justify-center z-50 hidden select-none transition-colors duration-300">
      <!-- Line texture layer -->
      <div class="absolute inset-0 pointer-events-none style-strips" 
           style="background-image: linear-gradient(rgba(61, 32, 19, 0.08) 1px, transparent 1px); background-size: 100% 5px;">
      </div>

      <!-- Centered Cozy Ambient Glow -->
      <div class="absolute w-[50%] h-[50%] sm:w-[25%] sm:h-[50%] max-w-xl rounded-full pointer-events-none opacity-75 filter blur-3xl z-0"
           style="background: radial-gradient(circle, rgba(253, 146, 62, 0.5) 0%, rgba(253, 146, 62, 0) 100%);">
      </div>

      <!-- Content Container -->
      <div class="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center">
        <!-- Pixel Fox Mascot -->
        <img src="media/kitsu_logo.png" alt="StudyCircle Fox" class="w-24 h-24 mb-4 object-contain animate-bounce" style="animation-duration: 2s;">

        <!-- StudyCircle Title Logo -->
        <h1 id="loading-title" class="font-pixel text-4xl text-[#3D2013] tracking-wide mb-2 drop-shadow-[2px_2px_0px_rgba(232,115,57,0.4)]">StudyCircle</h1>
        
        <!-- Dynamic Status Subtitle -->
        <p id="loading-status" class="font-pixel text-xs text-[#E87339] tracking-widest uppercase mb-8">◆ Loading ◆</p>

        <!-- Retro Progress Container -->
        <div id="loading-bar-border" class="w-full max-w-xs border-4 border-[#3D2013] bg-[#F8E9D2] p-1 shadow-[4px_4px_0px_#3D2013]">
          <div class="h-5 bg-[#E87339] w-0 transition-all duration-200 ease-out" id="loading-bar"></div>
        </div>

        <!-- Retro Bar Footnotes -->
        <div id="loading-text-container" class="w-full max-w-xs flex justify-between font-pixel text-[#3D2013] text-lg mt-1 px-1">
          <span>LOADING</span>
          <span id="loading-percentage">0%</span>
        </div>

        <!-- Dynamic Motivational Quote Footer -->
        <p id="loading-quote" class="font-pixel text-[#3D2013] text-xl italic tracking-wide mt-12 opacity-90 max-w-xs leading-snug transition-opacity duration-300">
          "${getRandomQuote()}"
        </p>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', overlayHTML);
}

/**
 * Starts cycling quotes every 5 seconds with a smooth cross-fade effect
 */
function startQuoteRotation() {
  stopQuoteRotation();

  const quoteEl = document.getElementById("loading-quote");
  if (!quoteEl) return;

  // Set initial quote
  quoteEl.textContent = `"${getRandomQuote()}"`;

  quoteInterval = setInterval(() => {
    // Fade out text briefly before updating
    quoteEl.classList.add("opacity-0");

    setTimeout(() => {
      const currentText = quoteEl.textContent.replace(/^"|"$/g, '');
      quoteEl.textContent = `"${getRandomQuote(currentText)}"`;
      quoteEl.classList.remove("opacity-0");
    }, 300);
  }, 5000);
}

/**
 * Stops quote rotation interval
 */
function stopQuoteRotation() {
  if (quoteInterval) {
    clearInterval(quoteInterval);
    quoteInterval = null;
  }
}

/**
 * Shows the overlay with custom status message & updates theme if admin
 * @param {string} statusText - Text displayed under title
 * @param {boolean} isAdmin - Set to true if logging in/redirecting to admin dashboard
 */
function showLoadingOverlay(statusText = "Loading...", isAdmin = false) {
  ensureOverlayInDOM();

  const overlay = document.getElementById("loading-overlay");
  const statusEl = document.getElementById("loading-status");
  const loadingBar = document.getElementById("loading-bar");
  const loadingPercentage = document.getElementById("loading-percentage");
  const loadingTitle = document.getElementById("loading-title");
  const textContainer = document.getElementById("loading-text-container");
  const quoteEl = document.getElementById("loading-quote");
  const barBorder = document.getElementById("loading-bar-border");
  const styleStrips = overlay ? overlay.querySelector(".style-strips") : null;

  if (statusEl) statusEl.textContent = `◆ ${statusText} ◆`;
  if (loadingBar) loadingBar.style.width = "0%";
  if (loadingPercentage) loadingPercentage.textContent = "0%";

  // Adjust theme background and text colors directly
  if (overlay) {
    if (isAdmin) {
      // Dark Admin Theme
      overlay.style.backgroundColor = "#3D2013";
      
      // Make texture lines light/cream so they show against dark background
      if (styleStrips) {
        styleStrips.style.backgroundImage = "linear-gradient(rgba(251, 242, 227, 0.15) 1px, transparent 1px)";
      }

      if (loadingTitle) {
        loadingTitle.style.color = "#FBF2E3";
      }
      if (statusEl) {
        statusEl.style.color = "#FD923E";
      }
      if (textContainer) {
        textContainer.style.color = "#FBF2E3";
      }
      if (quoteEl) {
        quoteEl.style.color = "#FBF2E3";
      }
      if (barBorder) {
        barBorder.style.borderColor = "#FBF2E3";
        barBorder.style.backgroundColor = "#2A160D";
        barBorder.style.boxShadow = "4px 4px 0px #FD923E";
      }
    } else {
      // Default Light User Theme
      overlay.style.backgroundColor = "#FBF2E3";
      
      // Dark lines for light background
      if (styleStrips) {
        styleStrips.style.backgroundImage = "linear-gradient(rgba(61, 32, 19, 0.08) 1px, transparent 1px)";
      }

      if (loadingTitle) {
        loadingTitle.style.color = "#3D2013";
      }
      if (statusEl) {
        statusEl.style.color = "#E87339";
      }
      if (textContainer) {
        textContainer.style.color = "#3D2013";
      }
      if (quoteEl) {
        quoteEl.style.color = "#3D2013";
      }
      if (barBorder) {
        barBorder.style.borderColor = "#3D2013";
        barBorder.style.backgroundColor = "#F8E9D2";
        barBorder.style.boxShadow = "4px 4px 0px #3D2013";
      }
    }

    overlay.classList.remove("hidden");
    overlay.classList.add("flex");
  }

  startQuoteRotation();
}

/**
 * Hides the loading overlay and stops quote rotation
 */
function hideLoadingOverlay() {
  const overlay = document.getElementById("loading-overlay");
  if (overlay) {
    overlay.classList.add("hidden");
    overlay.classList.remove("flex");
  }
  stopQuoteRotation();
}

/**
 * Updates progress bar percentage directly
 * @param {number} percent - Value from 0 to 100
 */
function updateLoadingProgress(percent) {
  const clamped = Math.min(100, Math.max(0, percent));
  const loadingBar = document.getElementById("loading-bar");
  const loadingPercentage = document.getElementById("loading-percentage");

  if (loadingBar) loadingBar.style.width = `${clamped}%`;
  if (loadingPercentage) loadingPercentage.textContent = `${Math.round(clamped)}%`;
}

/**
 * Helper to run a simulated progress load animation, then call a callback or redirect.
 * Auto-detects admin redirects (e.g., targetUrl includes 'admin-dashboard.html').
 * 
 * @param {string} statusText - Status message display
 * @param {number} durationMs - Animation duration in ms (default: 2000ms)
 * @param {function|string} target - Callback function OR target URL string (e.g., "admin-dashboard.html")
 * @param {boolean} [isAdmin=false] - Optional explicit admin flag
 */
function startSimulatedLoad(statusText, durationMs = 2000, target = null, isAdmin = false) {
  // Automatically set admin flag if redirect target contains admin-dashboard.html
  const isTargetAdmin = isAdmin || (typeof target === 'string' && target.includes('admin-dashboard.html'));

  showLoadingOverlay(statusText, isTargetAdmin);

  let current = 0;
  const stepTime = 50;
  const increment = 100 / (durationMs / stepTime);

  const timer = setInterval(() => {
    current += increment + (Math.random() * 2); // Random variation for realistic load feel
    
    if (current >= 100) {
      current = 100;
      updateLoadingProgress(100);
      clearInterval(timer);

      setTimeout(() => {
        if (typeof target === 'function') {
          target();
        } else if (typeof target === 'string') {
          window.location.href = target;
        } else {
          hideLoadingOverlay();
        }
      }, 200);
    } else {
      updateLoadingProgress(current);
    }
  }, stepTime);
}