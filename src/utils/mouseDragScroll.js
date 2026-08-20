/* ==========================================================================
   VALO OS - MOUSE DRAG & WHEEL SCROLL UTILITY (Desktop & Laptop UX)
   Enables natural swipe-dragging with mouse and vertical-to-horizontal wheel scrolling
   ========================================================================== */

export function enableHorizontalScroll(el) {
  if (!el) return;

  // 1. Mouse Wheel -> Horizontal Scroll
  el.addEventListener('wheel', (e) => {
    if (e.deltaY !== 0 && el.scrollWidth > el.clientWidth) {
      e.preventDefault();
      el.scrollLeft += e.deltaY * 0.9;
    }
  }, { passive: false });

  // 2. Mouse Click & Drag (Grab to Swipe like on mobile)
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let hasDragged = false;

  el.style.cursor = 'grab';

  el.addEventListener('mousedown', (e) => {
    // Avoid triggering on inputs or select elements
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
    
    isDown = true;
    hasDragged = false;
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
  });

  window.addEventListener('mouseleave', () => {
    if (isDown) {
      isDown = false;
      el.style.cursor = 'grab';
      el.style.removeProperty('user-select');
    }
  });

  window.addEventListener('mouseup', () => {
    if (isDown) {
      isDown = false;
      el.style.cursor = 'grab';
      el.style.removeProperty('user-select');
    }
  });

  el.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 4) {
      hasDragged = true;
    }
    el.scrollLeft = scrollLeft - walk;
  });

  // Prevent accidental clicks when dragging
  el.addEventListener('click', (e) => {
    if (hasDragged) {
      e.stopPropagation();
      e.preventDefault();
      hasDragged = false;
    }
  }, true);
}
