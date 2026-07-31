// Triggered when clicking "Back to Tools" button in the header
function handleBackToTools() {
  const step2Container = document.getElementById('step-2-generated-container');
  const isStep2Active = step2Container && !step2Container.classList.contains('hidden');

  // If user is currently in Step 2, show confirmation modal
  if (isStep2Active) {
    openBackModal();
  } else {
    // If in Step 1 or another view, go directly back without prompt
    resetToolsView();
  }
}

// Open Back Confirmation Modal
function openBackModal() {
  const modal = document.getElementById('back-confirmation-modal');
  const card = document.getElementById('back-modal-card');

  if (modal && card) {
    modal.classList.remove('hidden');
    setTimeout(() => {
      card.classList.remove('scale-95', 'opacity-0');
      card.classList.add('scale-100', 'opacity-100');
    }, 10);
  }
}

// Close Back Confirmation Modal
function closeBackModal(callback) {
  const modal = document.getElementById('back-confirmation-modal');
  const card = document.getElementById('back-modal-card');

  if (modal && card) {
    card.classList.remove('scale-100', 'opacity-100');
    card.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
      if (callback) callback();
    }, 200);
  }
}

// Modal Option 1: "Back" - Discard progress and reset to main tools menu
function confirmDiscardAndGoBack() {
  closeBackModal(() => {
    currentGeneratedItem = null; // Discard changes
    resetToolsView();
  });
}

// Modal Option 2: "Save" - Persist state/progress and reset to main tools menu
function confirmSaveAndGoBack() {
  closeBackModal(() => {
    saveAndFinishToolItem();
  });
}

// Step 2 Action: Save Item & Inflate to Main Tools Menu (Preserving Progress)
function saveAndFinishToolItem() {
  if (currentGeneratedItem) {
    // 1. If active tool is a quiz, persist current progress state into currentGeneratedItem
    if (currentActiveTool === 'Pre-quiz' || currentActiveTool === 'Post-quiz') {
      currentGeneratedItem.quizState = JSON.parse(JSON.stringify(quizState));
    }

    // 2. Prevent re-inflating duplicates if item already exists in saved list
    const existingIndex = generatedItems.findIndex(item => item.id === currentGeneratedItem.id);
    
    if (existingIndex !== -1) {
      // Update existing item in-place so state changes persist when saved multiple times
      generatedItems[existingIndex] = { ...currentGeneratedItem };
    } else {
      // Add new generated item to the beginning of array
      generatedItems.unshift({ ...currentGeneratedItem });
    }

    renderGeneratedItemsList();
    currentGeneratedItem = null; // Clear reference after saving
  }

  resetToolsView();
}

// Reset Back to Tools Main View
function resetToolsView() {
  const titleElem = document.getElementById('tools-header-title');
  if (titleElem) titleElem.textContent = 'Tools';

  // Reset form views
  document.getElementById('tools-form-view').classList.add('hidden');
  document.getElementById('step-1-source-select').classList.remove('hidden');
  document.getElementById('step-2-generated-container').classList.add('hidden');
  document.getElementById('tools-main-menu').classList.remove('hidden');
}