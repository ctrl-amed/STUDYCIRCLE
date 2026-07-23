document.addEventListener('DOMContentLoaded', () => {
  const footerContainer = document.getElementById('global-footer');
  if (!footerContainer) return;

  footerContainer.innerHTML = `
    <!-- LOWER LEFT BRAND NAME & LOGO -->
    <div class="fixed bottom-3 left-4 z-30 flex items-center gap-2 pointer-events-none select-none">
      <img src="media/kitsu_logo.png" alt="Kitsu Logo" class="h-8 sm:h-9 md:h-10 w-auto block">
      <span class="font-pressstart text-[11px] md:text-[14px] text-[#4A2E21] hidden sm:block">StudyCircle</span>
    </div>

    <!-- UNIFIED BOTTOM NAVIGATION BAR -->
    <div class="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-[680px]">
      <nav class="bg-[#FEF4E0] border-[3px] border-[#3D2013] rounded-[20px] h-[60px] sm:h-[72px] px-1 sm:px-3 relative flex items-center justify-between overflow-visible select-none">
        
        <!-- 1. HOME -->
        <a href="homepage.html" class="group relative flex-1 h-full flex flex-col items-center justify-center transition-colors cursor-pointer rounded-[14px] hover:bg-[#E16F37]/20 overflow-hidden no-underline">
          <svg class="w-5 h-5 sm:w-6 sm:h-6 text-[#3D2013] transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span class="hidden sm:block font-pressstart text-[9px] text-[#3D2013] mt-1 tracking-tighter uppercase">HOME</span>
          <div class="absolute bottom-0 left-1 right-1 h-[3px] bg-[#E16F37] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </a>

        <!-- 2. ROOM -->
        <a href="/room" class="group relative flex-1 h-full flex flex-col items-center justify-center transition-colors cursor-pointer rounded-[14px] hover:bg-[#E16F37]/20 overflow-hidden no-underline">
          <svg class="w-5 h-5 sm:w-6 sm:h-6 text-[#3D2013] transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 6H6v-6h6v6z"/>
          </svg>
          <span class="hidden sm:block font-pressstart text-[9px] text-[#3D2013] mt-1 tracking-tighter uppercase">ROOM</span>
          <div class="absolute bottom-0 left-1 right-1 h-[3px] bg-[#E16F37] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </a>

        <!-- 3. JOIN -->
        <a href="/join" class="group relative flex-1 h-full flex flex-col items-center justify-center transition-colors cursor-pointer rounded-[14px] hover:bg-[#E16F37]/20 overflow-hidden no-underline">
          <svg class="w-5 h-5 sm:w-6 sm:h-6 text-[#3D2013] transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 12l1.41 1.41L16.83 13H7v-2h9.83l-4.42-4.41L11 5l6 6-6 6z"/>
          </svg>
          <span class="hidden sm:block font-pressstart text-[9px] text-[#3D2013] mt-1 tracking-tighter uppercase">JOIN</span>
          <div class="absolute bottom-0 left-1 right-1 h-[3px] bg-[#E16F37] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </a>

        <!-- 4. KITSU AI -->
        <div class="relative flex-1 h-full flex items-center justify-center pointer-events-none">
          <a href="/kitsu-ai" class="pointer-events-auto absolute -top-5 sm:-top-7 flex flex-col items-center group cursor-pointer no-underline">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FEF4E0] border-[3px] border-[#3D2013] flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
              <img src="media/kitsu_logo.png" alt="Kitsu AI" class="w-12 h-12 sm:w-15 sm:h-15 object-contain" onerror="this.style.display='none'; this.nextElementSibling.classList.remove('hidden')">
              <svg class="w-10 h-10 text-[#E16F37] hidden" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2z"/>
              </svg>
            </div>
            <div class="absolute -bottom-4 sm:-bottom-5 bg-[#3D2013] px-1.5 sm:px-2 py-0.5 rounded-[4px] z-10 shadow-sm">
              <span class="font-pressstart text-[7px] sm:text-[9px] text-[#E16F37] block leading-none">KitsuAI</span>
            </div>
          </a>
        </div>

        <!-- 5. AVATAR -->
        <a href="/avatar" class="group relative flex-1 h-full flex flex-col items-center justify-center transition-colors cursor-pointer rounded-[14px] hover:bg-[#E16F37]/20 overflow-hidden no-underline">
          <svg class="w-5 h-5 sm:w-6 sm:h-6 text-[#3D2013] transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.6 4.2l-3.2-2.1c-.4-.3-.9-.2-1.2.2L15 5.2c-.3.4-.3 1 0 1.4l1.3 1.4H7.7L9 6.6c.3-.4.3-1 0-1.4L6.8 2.3c-.3-.4-.8-.5-1.2-.2L2.4 4.2C2.1 4.4 2 4.8 2.1 5.2l1.9 6.8c.1.4.5.7.9.7h1.6v8c0 .6.4 1 1 1h13c.6 0 1-.4 1-1v-8h1.6c.4 0 .8-.3.9-.7l1.9-6.8c.1-.4 0-.8-.3-1z"/>
          </svg>
          <span class="hidden sm:block font-pressstart text-[9px] text-[#3D2013] mt-1 tracking-tighter uppercase">AVATAR</span>
          <div class="absolute bottom-0 left-1 right-1 h-[3px] bg-[#E16F37] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </a>

        <!-- 6. FURNITURE -->
        <a href="/furniture" class="group relative flex-1 h-full flex flex-col items-center justify-center transition-colors cursor-pointer rounded-[14px] hover:bg-[#E16F37]/20 overflow-hidden no-underline">
          <svg class="w-5 h-5 sm:w-6 sm:h-6 text-[#3D2013] transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 10V7c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v3c-1.1 0-2 .9-2 2v5h1.33L4 19h1.67l.67-2h11.33l.67 2H20l.67-2H22v-5c0-1.1-.9-2-2-2zm-9 0H6V7h5v3zm7 0h-5V7h5v3z"/>
          </svg>
          <span class="hidden sm:block font-pressstart text-[9px] text-[#3D2013] mt-1 tracking-tighter uppercase">FURNITURE</span>
          <div class="absolute bottom-0 left-1 right-1 h-[3px] bg-[#E16F37] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </a>

        <!-- 7. PROFILE -->
        <a href="profile.html" class="group relative flex-1 h-full flex flex-col items-center justify-center transition-colors cursor-pointer rounded-[14px] hover:bg-[#E16F37]/20 overflow-hidden no-underline">
          <svg class="w-5 h-5 sm:w-6 sm:h-6 text-[#3D2013] transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span class="hidden sm:block font-pressstart text-[9px] text-[#3D2013] mt-1 tracking-tighter uppercase">PROFILE</span>
          <div class="absolute bottom-0 left-1 right-1 h-[3px] bg-[#E16F37] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </a>

      </nav>
    </div>
  `;
});