/**
 * sidebar-overlay.js
 * Creates a responsive sidebar overlay with a line-texture pattern, 
 * bottom ambient glow, smooth desktop collapse/expand transitions, 
 * full-screen mobile wipe transitions, and persistent collapse state.
 */

(function () {
  // Inject required dynamic styling for line texture and smooth text fades
  const styleTag = document.createElement("style");
  styleTag.textContent = `
    .style-strips {
      background-image: linear-gradient(rgba(0, 0, 0, 0.25) 1px, transparent 1px);
      background-size: 100% 5px;
    }
    .collapse-text-fade {
      transition: opacity 200ms ease-in-out, max-width 300ms ease-in-out, margin 200ms ease-in-out;
      overflow: hidden;
      white-space: nowrap;
    }
  `;
  document.head.appendChild(styleTag);

  // SVG Icons
  const icons = {
    hamburger: `<svg class="w-6 h-6 stroke-[#FAE9CE]" fill="none" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>`,
    collapseLeft: `<svg class="w-5 h-5 stroke-[#FAE9CE]" fill="none" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>`,
    expandRight: `<svg class="w-5 h-5 stroke-[#FAE9CE]" fill="none" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>`,
    home: `<svg class="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
    user: `<svg class="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`,
    door: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path fill="currentColor" d="M4 21q-.425 0-.712-.288T3 20t.288-.712T4 19h1V5q0-.825.588-1.412T7 3h10q.825 0 1.413.588T19 5v14h1q.425 0 .713.288T21 20t-.288.713T20 21zm6.713-8.287Q11 12.425 11 12t-.288-.712T10 11t-.712.288T9 12t.288.713T10 13t.713-.288" /></svg>`,
  };

  // Read saved state from localStorage, default to true (collapsed) if not set
  const savedState = localStorage.getItem("sidebar_collapsed");
  let isCollapsed = savedState !== null ? JSON.parse(savedState) : true;

  // Detect current page filename to set initial active state automatically
  const currentPath = window.location.pathname.split("/").pop() || "admin-dashboard.html";

  // Navigation Items with custom page paths
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: icons.home, path: "admin-dashboard.html" },
    { id: "users", label: "Users", icon: icons.user, path: "admin-users.html" },
    { id: "rooms", label: "Rooms", icon: icons.door, path: "admin-rooms.html" },
  ];

  function createSidebar() {
    if (document.getElementById("sidebar-overlay")) return;

    // Fixed Floating Mobile Toggle Button
    const mobileTrigger = document.createElement("button");
    mobileTrigger.id = "sidebar-mobile-trigger";
    mobileTrigger.className = "fixed top-4 left-4 z-50 md:hidden p-2 bg-[#3D2013] rounded-lg border border-[#FAE9CE]/30 shadow-md focus:outline-none transition-opacity duration-200";
    mobileTrigger.innerHTML = icons.hamburger;
    mobileTrigger.addEventListener("click", openMobileSidebar);
    document.body.appendChild(mobileTrigger);

    // Initial width class based on saved state
    const widthClass = isCollapsed ? "md:w-20" : "md:w-[20%]";
    const iconState = isCollapsed ? icons.expandRight : icons.collapseLeft;

    // Sidebar Container
    const sidebar = document.createElement("aside");
    sidebar.id = "sidebar-overlay";
    sidebar.className = `
      fixed top-0 left-0 h-screen z-50 bg-[#3D2013] text-[#FAE9CE]
      transition-all duration-300 ease-in-out flex flex-col justify-between overflow-hidden
      w-full -translate-x-full md:translate-x-0 ${widthClass}
    `.trim();

    // Inner Shell with Texture and Ambient Glow
    sidebar.innerHTML = `
      <!-- Line texture layer -->
      <div class="absolute inset-0 pointer-events-none style-strips z-0"></div>

      <!-- Ambient Glow (Positioned at Bottom) -->
      <div class="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] rounded-full pointer-events-none opacity-50 filter blur-3xl mix-blend-screen z-0"
           style="background: radial-gradient(circle, rgba(253, 146, 62, 0.45) 0%, rgba(253, 146, 62, 0) 70%);">
      </div>

      <!-- Foreground Sidebar Content -->
      <div class="relative z-10 flex flex-col h-full w-full">
        
        <!-- Header -->
        <div class="flex items-center justify-between p-4 sm:p-6 border-b border-[#FAE9CE]">
          <div id="sidebar-brand" class="flex items-center space-x-3 overflow-hidden">
            <img src="./media/kitsu_logo.png" alt="Kitsu Logo" class="w-8 h-8 object-contain flex-shrink-0" onerror="this.src='https://via.placeholder.com/32?text=K'" />
            <span id="sidebar-title" class="collapse-text-fade max-w-0 opacity-0 text-xl font-bold tracking-wide text-[#FAE9CE]">
              StudyCircle
            </span>
          </div>
          
          <!-- Collapse / Left Arrow Button -->
          <button id="sidebar-collapse-btn" class="p-1.5 rounded-lg border border-[#FAE9CE]/30 hover:bg-[#FAE9CE]/10 focus:outline-none transition-colors flex-shrink-0">
            ${iconState}
          </button>
        </div>

        <!-- Navigation Links -->
        <nav class="flex-1 px-4 py-6 space-y-3 overflow-y-auto" id="sidebar-nav-list">
          ${renderNavItems()}
        </nav>

      </div>
    `;

    document.body.appendChild(sidebar);

    // Attach Event Listeners
    document.getElementById("sidebar-collapse-btn").addEventListener("click", handleCollapseOrClose);
    attachNavListeners();

    // Ensure correct text visibility state based on screen size on initial load
    updateTextState();
    window.addEventListener("resize", updateTextState);
  }

  function renderNavItems() {
    return navItems.map((item) => {
      const isActive = currentPath === item.path || (currentPath === "" && item.id === "dashboard");
      const borderClasses = isActive ? "border border-[#FAE9CE] rounded-xl" : "border border-transparent";

      return `
        <a href="${item.path}" 
           data-id="${item.id}"
           class="nav-item flex items-center px-4 py-3 text-[#FAE9CE] transition-all duration-200 ${borderClasses} hover:bg-[#FAE9CE]/5 group">
          <span class="flex-shrink-0">${item.icon}</span>
          <span class="nav-label collapse-text-fade max-w-0 opacity-0 ml-0 font-medium text-base">
            ${item.label}
          </span>
        </a>
      `;
    }).join("");
  }

  function attachNavListeners() {
    const navList = document.getElementById("sidebar-nav-list");
    if (!navList) return;

    navList.querySelectorAll(".nav-item").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 768) {
          closeMobileSidebar();
        }
      });
    });
  }

  function updateTextState() {
    const isMobile = window.innerWidth < 768;
    const title = document.getElementById("sidebar-title");
    const labels = document.querySelectorAll(".nav-label");

    if (isMobile || !isCollapsed) {
      if (title) {
        title.classList.remove("opacity-0", "max-w-0");
        title.classList.add("opacity-100", "max-w-[200px]");
      }
      labels.forEach((label) => {
        label.classList.remove("opacity-0", "max-w-0", "ml-0");
        label.classList.add("opacity-100", "max-w-[200px]", "ml-3");
      });
    } else {
      if (title) {
        title.classList.remove("opacity-100", "max-w-[200px]");
        title.classList.add("opacity-0", "max-w-0");
      }
      labels.forEach((label) => {
        label.classList.remove("opacity-100", "max-w-[200px]", "ml-3");
        label.classList.add("opacity-0", "max-w-0", "ml-0");
      });
    }
  }

  function handleCollapseOrClose() {
    if (window.innerWidth < 768) {
      closeMobileSidebar();
    } else {
      toggleCollapseDesktop();
    }
  }

  function toggleCollapseDesktop() {
    const sidebar = document.getElementById("sidebar-overlay");
    const collapseBtn = document.getElementById("sidebar-collapse-btn");

    isCollapsed = !isCollapsed;

    // Save state so it persists across page navigations
    localStorage.setItem("sidebar_collapsed", JSON.stringify(isCollapsed));

    if (isCollapsed) {
      sidebar.classList.remove("md:w-[20%]");
      sidebar.classList.add("md:w-20");
      collapseBtn.innerHTML = icons.expandRight;
    } else {
      sidebar.classList.remove("md:w-20");
      sidebar.classList.add("md:w-[20%]");
      collapseBtn.innerHTML = icons.collapseLeft;
    }

    updateTextState();
  }

  function openMobileSidebar() {
    const sidebar = document.getElementById("sidebar-overlay");
    const mobileTrigger = document.getElementById("sidebar-mobile-trigger");

    sidebar.classList.remove("-translate-x-full");
    if (mobileTrigger) mobileTrigger.classList.add("opacity-0", "pointer-events-none");
    updateTextState();
  }

  function closeMobileSidebar() {
    const sidebar = document.getElementById("sidebar-overlay");
    const mobileTrigger = document.getElementById("sidebar-mobile-trigger");

    sidebar.classList.add("-translate-x-full");
    if (mobileTrigger) mobileTrigger.classList.remove("opacity-0", "pointer-events-none");
  }

  // Initialize on DOM load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createSidebar);
  } else {
    createSidebar();
  }
})();