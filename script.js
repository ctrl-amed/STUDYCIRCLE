const container = document.getElementById('slideshow-container');
const dots = document.querySelectorAll('#pagination-dots span');
let originalCards = Array.from(container.getElementsByClassName('card-item'));
const totalOriginals = originalCards.length;

let activeIndex = 0;
let autoSlideInterval;
let isHovered = false;
let isTransitioning = false;

// Helpers to identify gap properties based on layout size
function getGapSize() {
  return window.innerWidth < 640 ? 16 : 24; // matches gap-4 (16px) vs gap-6 (24px)
}

function getCardWidth() {
  return originalCards[0].offsetWidth;
}

// Setup Infinite Cloning Elements
function setupInfiniteLoop() {
  const clonesToAppend = originalCards.map(card => card.cloneNode(true));
  const clonesToPrepend = originalCards.map(card => card.cloneNode(true));

  clonesToPrepend.reverse().forEach(clone => {
    container.insertBefore(clone, container.firstChild);
  });
  clonesToAppend.forEach(clone => {
    container.appendChild(clone);
  });

  // Re-bind hover shadow properties to newly generated nodes
  const allCards = container.querySelectorAll('.card-item');
  allCards.forEach(card => {
    card.addEventListener('mouseenter', () => { isHovered = true; });
    card.addEventListener('mouseleave', () => { isHovered = false; });
  });

  resetToStartNoAnimation();
}

// Move scroll state straight to the identical Card 1 index copy without animation transition
function resetToStartNoAnimation() {
  const cardWidth = getCardWidth();
  const gap = getGapSize();
  
  // Calculate relative starting point centering the card
  const firstRealCardOffset = (cardWidth + gap) * totalOriginals - (container.offsetWidth / 2) + (cardWidth / 2);
  
  container.style.scrollBehavior = 'auto';
  container.scrollLeft = firstRealCardOffset;
  activeIndex = 0;
  updateDots();
}

function updateDots() {
  dots.forEach((dot, idx) => {
    dot.style.opacity = idx === activeIndex ? '1' : '0.4';
  });
}

function scrollToCard(index, smooth = true) {
  if (isTransitioning) return;
  isTransitioning = true;

  const cardWidth = getCardWidth();
  const gap = getGapSize();
  const targetScrollLeft = (cardWidth + gap) * (totalOriginals + index) - (container.offsetWidth / 2) + (cardWidth / 2);

  container.style.scrollBehavior = smooth ? 'smooth' : 'auto';
  container.scrollLeft = targetScrollLeft;

  setTimeout(() => {
    activeIndex = index;

    // Handle instant reset if we reach the duplicated bounds
    if (activeIndex >= totalOriginals) {
      container.style.scrollBehavior = 'auto';
      container.scrollLeft = (cardWidth + gap) * totalOriginals - (container.offsetWidth / 2) + (cardWidth / 2);
      activeIndex = 0;
    } else if (activeIndex < 0) {
      container.style.scrollBehavior = 'auto';
      container.scrollLeft = (cardWidth + gap) * (totalOriginals * 2 - 1) - (container.offsetWidth / 2) + (cardWidth / 2);
      activeIndex = totalOriginals - 1;
    }
    
    updateDots();
    isTransitioning = false;
  }, 400); // Wait for transition finish
}

function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    if (!isHovered && !isTransitioning) {
      scrollToCard(activeIndex + 1);
    }
  }, 2600);
}

// Update dots manually when users swipe
container.addEventListener('scroll', () => {
  if (isTransitioning) return;
  const cardWidth = getCardWidth() + getGapSize();
  const scrollPosition = container.scrollLeft;

  // Track coordinates relative to centering rules
  const activePositionIdx = Math.round((scrollPosition + (container.offsetWidth / 2) - (getCardWidth() / 2)) / cardWidth) - totalOriginals;
  
  if (activePositionIdx >= 0 && activePositionIdx < totalOriginals) {
    activeIndex = activePositionIdx;
    updateDots();
  }
});

// Re-adjust card alignments dynamically if the viewport is resized
window.addEventListener('resize', () => {
  resetToStartNoAnimation();
});

window.addEventListener('load', () => {
  setupInfiniteLoop();
  startAutoSlide();
});