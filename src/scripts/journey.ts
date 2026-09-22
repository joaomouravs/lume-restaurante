/**
 * Jornada do Menu Fogo.
 * - Desktop com movimento: seção fixa; a rolagem vertical move o trilho na horizontal,
 *   com parallax nas fotos e marcação do tempo ativo.
 * - Demais casos: trilho com rolagem horizontal nativa (toque, teclado, scroll-snap).
 * Nos dois modos, a barra de progresso e os botões 01–07 navegam pelos tempos.
 */
import { gsap, ScrollTrigger, getLenis, initMotion } from './motion';

export function initJourney() {
  const root = document.querySelector<HTMLElement>('[data-journey]');
  const track = root?.querySelector<HTMLElement>('[data-journey-track]');
  if (!root || !track) return;

  initMotion();

  const steps = Array.from(track.querySelectorAll<HTMLElement>('[data-journey-step]'));
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-journey-goto]'));
  const bar = root.querySelector<HTMLElement>('[data-journey-bar]');

  const setProgress = (p: number) => bar?.style.setProperty('--p', String(Math.min(1, Math.max(0, p))));
  const setActive = (index: number) =>
    buttons.forEach((b, i) => (i === index ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current')));

  // Posição do tempo dentro do trilho (independe de transform e do offsetParent)
  const leftInTrack = (el: HTMLElement) =>
    el.getBoundingClientRect().left - track.getBoundingClientRect().left + (track.classList.contains('is-pinned') ? 0 : track.scrollLeft);

  let goTo = (i: number) => nativeGoTo(i);

  /* ---------- Modo nativo ---------- */
  const nativeGoTo = (i: number) => {
    const step = steps[i];
    if (!step) return;
    track.scrollTo({ left: leftInTrack(step) - (track.clientWidth - step.offsetWidth) / 2, behavior: 'smooth' });
  };

  const onNativeScroll = () => {
    const max = track.scrollWidth - track.clientWidth;
    setProgress(max > 0 ? track.scrollLeft / max : 0);
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    steps.forEach((s, i) => {
      const d = Math.abs(leftInTrack(s) + s.offsetWidth / 2 - center);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  };

  track.addEventListener('scroll', () => requestAnimationFrame(onNativeScroll), { passive: true });
  onNativeScroll();

  buttons.forEach((b, i) => b.addEventListener('click', () => goTo(i)));

  /* ---------- Modo fixo (GSAP) ---------- */
  if (!document.documentElement.classList.contains('has-motion')) return;

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    track.classList.add('is-pinned');
    track.scrollLeft = 0;

    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => setProgress(self.progress),
      },
    });

    // Parallax das fotos e marcação do tempo ativo, relativos ao movimento horizontal
    steps.forEach((step, i) => {
      const img = step.querySelector('[data-journey-img]');
      if (img) {
        gsap.fromTo(
          img,
          { xPercent: -7 },
          {
            xPercent: 7,
            ease: 'none',
            scrollTrigger: { trigger: step, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
          },
        );
      }
      ScrollTrigger.create({
        trigger: step,
        containerAnimation: tween,
        start: 'left 60%',
        end: 'right 40%',
        onToggle: (self) => self.isActive && setActive(i),
      });
    });

    goTo = (i: number) => {
      const st = tween.scrollTrigger;
      const step = steps[i];
      if (!st || !step) return;
      const offset = leftInTrack(step) + step.offsetWidth / 2 - window.innerWidth / 2;
      const ratio = Math.min(1, Math.max(0, offset / distance()));
      const y = st.start + ratio * (st.end - st.start);
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(y, { duration: 1.4 });
      else window.scrollTo({ top: y, behavior: 'smooth' });
    };

    return () => {
      track.classList.remove('is-pinned');
      gsap.set(track, { clearProps: 'transform' });
      goTo = nativeGoTo;
    };
  });
}
