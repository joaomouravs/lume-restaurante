/**
 * Lightbox sobre <dialog> nativo: foco gerenciado pelo navegador,
 * Esc fecha, setas navegam, swipe no toque e clique fora fecha.
 */

export function initLightbox() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox]');
  const triggers = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-gallery-open]'));
  if (!dialog || !triggers.length) return;

  const img = dialog.querySelector<HTMLImageElement>('[data-lightbox-img]')!;
  const caption = dialog.querySelector<HTMLElement>('[data-lightbox-caption]')!;
  const count = dialog.querySelector<HTMLElement>('[data-lightbox-count]')!;
  let index = 0;
  let lastTrigger: HTMLButtonElement | null = null;

  const show = (i: number) => {
    index = (i + triggers.length) % triggers.length;
    const t = triggers[index];
    img.classList.add('is-loading');
    img.onload = () => img.classList.remove('is-loading');
    img.src = t.dataset.full ?? '';
    img.alt = t.dataset.alt ?? '';
    caption.textContent = t.dataset.caption ?? '';
    count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(triggers.length).padStart(2, '0')}`;

    // Pré-carrega a próxima imagem
    const next = triggers[(index + 1) % triggers.length]?.dataset.full;
    if (next) new Image().src = next;
  };

  const open = (i: number, trigger: HTMLButtonElement) => {
    lastTrigger = trigger;
    show(i);
    dialog.showModal();
    document.body.classList.add('is-locked');
  };

  dialog.addEventListener('close', () => {
    document.body.classList.remove('is-locked');
    lastTrigger?.focus();
  });

  triggers.forEach((t, i) => t.addEventListener('click', () => open(i, t)));
  dialog.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-lightbox-next]')?.addEventListener('click', () => show(index + 1));
  dialog.querySelector('[data-lightbox-close]')?.addEventListener('click', () => dialog.close());

  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });

  // Clique no fundo (fora da imagem e dos botões) fecha
  dialog.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('lightbox__inner') || target === dialog) dialog.close();
  });

  // Swipe horizontal
  let startX = 0;
  dialog.addEventListener('touchstart', (e) => (startX = e.touches[0].clientX), { passive: true });
  dialog.addEventListener(
    'touchend',
    (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    },
    { passive: true },
  );
}
