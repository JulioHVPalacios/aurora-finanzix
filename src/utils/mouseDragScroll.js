/* ==========================================================================
   VALO OS - MOUSE DRAG & WHEEL SCROLL UTILITY (Desktop & Laptop UX)
   Enables natural swipe-dragging with mouse and vertical-to-horizontal wheel scrolling
   ========================================================================== */

export function enableHorizontalScroll(el) {
  if (!el) return;

  // 1. Mouse Wheel -> Gentle Horizontal Scroll
  el.addEventListener('wheel', (e) => {
    if (e.deltaY !== 0 && el.scrollWidth > el.clientWidth) {
      e.preventDefault();
      el.scrollLeft += e.deltaY * 0.6;
    }
  }, { passive: false });

  // 2. Mouse Click & Drag (Smooth 1:1 Fluid Dragging)
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let hasDragged = false;

  el.style.cursor = 'grab';

  el.addEventListener('mousedown', (e) => {
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
    
    isDown = true;
    hasDragged = false;
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';
    el.style.scrollBehavior = 'auto';
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
  });

  const stopDrag = () => {
    if (isDown) {
      isDown = false;
      el.style.cursor = 'grab';
      el.style.removeProperty('user-select');
    }
  };

  window.addEventListener('mouseleave', stopDrag);
  window.addEventListener('mouseup', stopDrag);

  el.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX);
    if (Math.abs(walk) > 3) {
      hasDragged = true;
    }
    el.scrollLeft = scrollLeft - walk;
  });

  // Prevent click on child items if user was dragging
  el.addEventListener('click', (e) => {
    if (hasDragged) {
      e.stopPropagation();
      e.preventDefault();
      hasDragged = false;
    }
  }, true);
}
