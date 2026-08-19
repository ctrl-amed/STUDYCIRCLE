function switchProfileTab(tabName) {
  const iframe = document.getElementById("profile-iframe");
  const avatarBtn = document.getElementById("tab-avatar-btn");
  const roomBtn = document.getElementById("tab-room-btn");

  if (!iframe || !avatarBtn || !roomBtn) return;

  if (tabName === 'avatar') {
    // Load avatar source if not already loaded
    if (!iframe.src.includes('customavatar.html')) {
      iframe.src = 'customavatar.html';
    }
    // Update active tab button styles (Active Avatar)
    avatarBtn.className = "flex-1 font-pressstart text-[10px] sm:text-[12px] py-2.5 text-center cursor-pointer transition-all text-[#E16F37] border-b-2 border-[#E16F37]";
    roomBtn.className = "flex-1 font-pressstart text-[10px] sm:text-[12px] py-2.5 text-center cursor-pointer transition-all text-[#3D2013] border-b-2 border-transparent";
  } else if (tabName === 'room') {
    // Load room source if not already loaded
    if (!iframe.src.includes('customroom.html')) {
      iframe.src = 'customroom.html';
    }
    // Update active tab button styles (Active Room)
    roomBtn.className = "flex-1 font-pressstart text-[10px] sm:text-[12px] py-2.5 text-center cursor-pointer transition-all text-[#E16F37] border-b-2 border-[#E16F37]";
    avatarBtn.className = "flex-1 font-pressstart text-[10px] sm:text-[12px] py-2.5 text-center cursor-pointer transition-all text-[#3D2013] border-b-2 border-transparent";
  }
}