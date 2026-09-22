/**
 * Carrossel de depoimentos com autoplay acessível:
 * pausa em hover/foco, botão explícito de pausa e respeito a reduced-motion.
 */

const DURATION = 8000;

export function initQuotes() {
  const root = document.querySelector<HTMLElement>('[data-quotes]');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-quote]'));
  const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-quotes-dot]'));
  const track = root.querySelector<HTMLElement>('[data-quotes-track]');
  const pauseBtn = root.querySelector<HTMLButtonElement>('[data-quotes-pause]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let index = 0;
  let timer: number | undefined;
  let userPaused = reduced;
  let hoverPaused = false;
  let inView = false;

  root.style.setProperty('--quote-duration', `${DURATION}ms`);

  const go = (i: number, announce = false) => {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => {
      const active = n === index;
      s.classList.toggle('is-active', active);
      if (active) s.removeAttribute('aria-hidden');
      else s.setAttribute('aria-hidden', 'true');
    });
    dots.forEach((d, n) => {
      if (n === index) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });
    // Navegação manual é anunciada; troca automática não
    track?.setAttribute('aria-live', announce ? 'polite' : 'off');
    restart();
  };

  const playing = () => !userPaused && !hoverPaused && inView;

  const restart = () => {
    window.clearTimeout(timer);
    root.dataset.playing = String(playing());
    // Reinicia a animação da barra de progresso
    const activeDot = dots[index]?.querySelector('span');
    if (activeDot) {
      activeDot.style.animation = 'none';
      void activeDot.offsetWidth;
      activeDot.style.animation = '';
    }
    if (playing()) timer = window.setTimeout(() => go(index + 1), DURATION);
  };

  root.querySelector('[data-quotes-prev]')?.addEventListener('click', () => go(index - 1, true));
  root.querySelector('[data-quotes-next]')?.addEventListener('click', () => go(index + 1, true));
  dots.forEach((d, n) => d.addEventListener('click', () => go(n, true)));

  pauseBtn?.addEventListener('click', () => {
    userPaused = !userPaused;
    pauseBtn.setAttribute('aria-pressed', String(userPaused));
    pauseBtn.textContent = userPaused ? 'Reproduzir' : 'Pausar';
    restart();
  });

  if (reduced && pauseBtn) {
    pauseBtn.setAttribute('aria-pressed', 'true');
    pauseBtn.textContent = 'Reproduzir';
  }

  const setHover = (v: boolean) => {
    hoverPaused = v;
    restart();
  };
  root.addEventListener('mouseenter', () => setHover(true));
  root.addEventListener('mouseleave', () => setHover(false));
  root.addEventListener('focusin', () => setHover(true));
  root.addEventListener('focusout', (e) => {
    if (!root.contains(e.relatedTarget as Node)) setHover(false);
  });

  // Só roda quando visível
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    restart();
  }, { threshold: 0.3 }).observe(root);
}
