/**
 * Carrossel sobre scroll nativo (scroll-snap): setas, barra de progresso
 * e arraste com mouse. Toque e teclado usam o comportamento nativo.
 */

export function initCarousels() {
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((root) => {
    if (root.dataset.ready) return;
    root.dataset.ready = 'true';

    const scope = root.closest('section') ?? document;
    const track = root.querySelector<HTMLElement>('[data-carousel-track]');
    const prev = scope.querySelector<HTMLButtonElement>('[data-carousel-prev]');
    const next = scope.querySelector<HTMLButtonElement>('[data-carousel-next]');
    const progress = scope.querySelector<HTMLElement>('[data-carousel-progress]');
    if (!track) return;

    const step = () => {
      const card = track.firstElementChild as HTMLElement | null;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card ? card.offsetWidth + gap : track.clientWidth * 0.8;
    };

    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const ratio = max > 0 ? track.scrollLeft / max : 1;
      const visible = track.clientWidth / track.scrollWidth;
      progress?.style.setProperty('--progress', String(Math.min(1, visible + ratio * (1 - visible))));
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max - 2;
    };

    prev?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();

    /* Arraste com mouse */
    let startX = 0;
    let startScroll = 0;
    let dragging = false;
    let moved = false;

    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
    });

    window.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        track.style.scrollSnapType = 'none';
        track.style.cursor = 'grabbing';
      }
      if (moved) track.scrollLeft = startScroll - dx;
    });

    window.addEventListener('pointerup', () => {
      if (!dragging) return;
      dragging = false;
      track.style.cursor = '';
      if (moved) {
        // Reativa o snap e alinha ao card mais próximo
        const s = step();
        const target = Math.round(track.scrollLeft / s) * s;
        track.style.scrollSnapType = '';
        track.scrollTo({ left: target, behavior: 'smooth' });
      }
    });

    // Evita que o fim de um arraste dispare o clique no card
    track.addEventListener(
      'click',
      (e) => {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
          moved = false;
        }
      },
      true,
    );

    track.addEventListener('dragstart', (e) => e.preventDefault());
  });
}
