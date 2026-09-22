/**
 * Hero: vídeo da brasa (carregado após a página) e transição cinematográfica.
 *
 * - O vídeo só é baixado depois do `load`, nunca com Save-Data ou movimento reduzido.
 * - Pausa sozinho fora da tela; botão explícito de pausar/reproduzir (WCAG 2.2.2).
 * - Desktop com movimento: a seção fica fixa enquanto o recorte da mídia se abre
 *   até a tela cheia, o texto sai e o prato gira até o centro sobre o fogo.
 */
import { gsap, ScrollTrigger, initMotion, reducedMotion } from './motion';

export function initHero() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;
  initVideo(hero);
  initScrollScene(hero);
}

function initVideo(hero: HTMLElement) {
  const video = hero.querySelector<HTMLVideoElement>('[data-hero-video]');
  const toggle = hero.querySelector<HTMLButtonElement>('[data-video-toggle]');
  const label = hero.querySelector<HTMLElement>('[data-video-label]');
  if (!video) return;

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (reducedMotion() || connection?.saveData) return;

  let userPaused = false;
  let inView = true;

  const sync = () => {
    const shouldPlay = !userPaused && inView && !document.hidden;
    if (shouldPlay && video.paused) video.play().catch(() => {});
    if (!shouldPlay && !video.paused) video.pause();
    toggle?.setAttribute('aria-pressed', String(userPaused));
    if (label) label.textContent = userPaused ? 'Reproduzir vídeo' : 'Pausar vídeo';
  };

  const load = () => {
    const wide = window.matchMedia('(min-width: 768px)').matches;
    video.src = (wide ? video.dataset.srcDesktop : video.dataset.srcMobile) ?? '';
    video.addEventListener(
      'playing',
      () => {
        video.classList.add('is-playing');
        if (toggle) toggle.hidden = false;
      },
      { once: true },
    );
    sync();
  };

  // Não compete com o carregamento inicial (LCP é a imagem de capa)
  const schedule = () =>
    'requestIdleCallback' in window
      ? (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(load)
      : setTimeout(load, 300);
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });

  toggle?.addEventListener('click', () => {
    userPaused = !userPaused;
    sync();
  });

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (video.src) sync();
  }).observe(hero);

  document.addEventListener('visibilitychange', () => video.src && sync());
}

function initScrollScene(hero: HTMLElement) {
  initMotion();
  if (!document.documentElement.classList.contains('has-motion')) return;

  const media = hero.querySelector<HTMLElement>('[data-hero-media]');
  const plate = hero.querySelector<HTMLElement>('[data-hero-plate]');
  const caption = hero.querySelector<HTMLElement>('[data-hero-caption]');
  const fades = hero.querySelectorAll<HTMLElement>('[data-hero-fade]');
  if (!media || !plate) return;

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1024px)', () => {
    const radius = () => Math.min(300, Math.max(120, window.innerWidth * 0.16));

    // Deslocamento do prato até o centro do hero
    const toCenter = () => {
      const h = hero.getBoundingClientRect();
      const p = plate.getBoundingClientRect();
      return {
        x: h.left + h.width / 2 - (p.left + p.width / 2),
        y: h.top + h.height / 2 - (p.top + p.height / 2),
      };
    };
    let delta = { x: 0, y: 0 };

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=85%',
        scrub: 0.8,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefreshInit: () => {
          gsap.set(plate, { x: 0, y: 0 });
          delta = toCenter();
        },
      },
    });

    tl.fromTo(
      media,
      { clipPath: () => `inset(0% 0% 0% 48% round 0px 0px 0px ${radius()}px)` },
      { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', duration: 1 },
      0,
    )
      .to(fades, { yPercent: -18, autoAlpha: 0, duration: 0.55, stagger: 0.08 }, 0)
      .to(plate, { x: () => delta.x, y: () => delta.y, rotate: 150, scale: 0.92, duration: 1 }, 0)
      .fromTo(caption, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.7);

    return () => gsap.set([media, plate, ...fades, caption], { clearProps: 'all' });
  });

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}
