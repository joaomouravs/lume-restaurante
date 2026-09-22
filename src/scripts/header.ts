/**
 * Header: estados de rolagem (sólido / oculto) e menu em tela cheia acessível.
 */

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const label = document.querySelector<HTMLElement>('[data-menu-label]');
  if (!header || !menu || !toggle) return;

  /* ---------- Rolagem ---------- */
  let lastY = window.scrollY;
  let ticking = false;
  let menuOpen = false;

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 24);

    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    if (!menuOpen && goingDown && y > window.innerHeight * 0.6) header.classList.add('is-hidden');
    if (goingUp || y < 120) header.classList.remove('is-hidden');

    lastY = y;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true },
  );
  onScroll();

  // Ao receber foco por teclado, o header nunca deve ficar escondido
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));

  /* ---------- Menu ---------- */
  const setOpen = (open: boolean) => {
    menuOpen = open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    if (label) label.textContent = open ? 'Fechar' : 'Menu';
    header.classList.toggle('is-menu-open', open);
    header.classList.remove('is-hidden');
    document.body.classList.toggle('is-locked', open);

    if (open) {
      menu.hidden = false;
      // força reflow para a transição de clip-path acontecer
      void menu.offsetWidth;
      menu.classList.add('is-open');
      menu.querySelector<HTMLElement>('[data-menu-link]')?.focus({ preventScroll: true });
    } else {
      menu.classList.remove('is-open');
      const onEnd = () => {
        if (!menuOpen) menu.hidden = true;
      };
      menu.addEventListener('transitionend', onEnd, { once: true });
      window.setTimeout(onEnd, 900);
    }
  };

  toggle.addEventListener('click', () => {
    const wasOpen = menuOpen;
    setOpen(!menuOpen);
    if (wasOpen) toggle.focus();
  });

  document.addEventListener('keydown', (e) => {
    if (!menuOpen) return;

    if (e.key === 'Escape') {
      setOpen(false);
      toggle.focus();
      return;
    }

    // Mantém o foco entre o botão do header e o conteúdo do menu
    if (e.key === 'Tab') {
      const items = [toggle, ...menu.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null || el === toggle,
      );
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Links de âncora na mesma página fecham o menu
  menu.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
    link.addEventListener('click', () => {
      const url = new URL(link.href, location.href);
      if (url.pathname === location.pathname) setOpen(false);
    });
  });

  // Pré-visualização de imagem por link
  const previews = menu.querySelectorAll<HTMLElement>('[data-preview-img]');
  menu.querySelectorAll<HTMLElement>('[data-menu-link]').forEach((link) => {
    const show = () => {
      const idx = link.dataset.preview;
      previews.forEach((p) => p.classList.toggle('is-active', p.dataset.previewImg === idx));
    };
    link.addEventListener('mouseenter', show);
    link.addEventListener('focus', show);
  });
}
