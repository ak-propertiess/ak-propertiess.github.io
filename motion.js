/* Small progressive enhancements; the site remains fully usable without them. */
(() => {
  const scene = document.querySelector('.hero-architecture');
  if (!scene) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const has3d = window.CSS?.supports?.('transform', 'perspective(10px) rotateY(1deg)') ?? false;
  if (!has3d) scene.classList.add('architecture-flat');
  if (reduceMotion.matches) return;

  const door = document.querySelector('.hero-door');
  if (door && has3d) {
    let doorFrame = 0;
    const openDoorOnScroll = () => {
      if (doorFrame) return;
      doorFrame = requestAnimationFrame(() => {
        doorFrame = 0;
        const bounds = door.closest('.hero-image').getBoundingClientRect();
        const amount = Math.max(0, Math.min(1, 1 - bounds.top / Math.max(innerHeight, 1)));
        door.style.setProperty('--door-left-angle', `${(-amount * 88).toFixed(1)}deg`);
        door.style.setProperty('--door-right-angle', `${(amount * 88).toFixed(1)}deg`);
        door.dataset.open = amount > 0.82 ? 'true' : 'false';
      });
    };
    window.addEventListener('scroll', openDoorOnScroll, { passive: true });
    window.addEventListener('resize', openDoorOnScroll, { passive: true });
    openDoorOnScroll();
  }

  const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (canTilt.matches && has3d) {
    const frame = scene.closest('.hero-image');
    let pointerFrame = 0;
    frame?.addEventListener('pointermove', event => {
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        const bounds = frame.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        scene.style.setProperty('--scene-y', `${(x * 5).toFixed(2)}deg`);
        scene.style.setProperty('--scene-x', `${(-y * 3).toFixed(2)}deg`);
      });
    }, { passive: true });
    frame?.addEventListener('pointerleave', () => {
      scene.style.setProperty('--scene-x', '0deg');
      scene.style.setProperty('--scene-y', '0deg');
    }, { passive: true });
  }

  let scrollFrame = 0;
  const updateDepth = () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      const bounds = scene.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > innerHeight) return;
      const progress = (innerHeight - bounds.top) / (innerHeight + bounds.height);
      scene.style.setProperty('--scroll-depth', `${((progress - 0.5) * -10).toFixed(1)}px`);
    });
  };
  window.addEventListener('scroll', updateDepth, { passive: true });
  window.addEventListener('resize', updateDepth, { passive: true });
  updateDepth();
})();
