/**
 * Revela elementos com [data-reveal] e linhas .split-line ao entrarem na viewport.
 * Também anima contadores [data-count].
 */

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initReveal() {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-group]');

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  // Elementos com clip-path totalmente fechado não geram interseção no Chrome;
  // nesses casos observamos o elemento pai e revelamos os filhos associados.
  const linked = new Map<Element, HTMLElement[]>();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const items = linked.get(entry.target) ?? [entry.target as HTMLElement];
        items.forEach((el) => el.classList.add('is-visible'));
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );

  targets.forEach((el) => {
    const observed = el.dataset.reveal === 'clip' && el.parentElement ? el.parentElement : el;
    if (observed !== el) {
      const list = linked.get(observed) ?? [];
      if (!list.length && observed.hasAttribute('data-reveal')) list.push(observed);
      list.push(el);
      linked.set(observed, list);
    }
    observer.observe(observed);
  });

  initCounters();
}

function initCounters() {
  const counters = document.querySelectorAll<HTMLElement>('[data-count]');
  if (!counters.length) return;

  const format = new Intl.NumberFormat('pt-BR');

  const run = (el: HTMLElement) => {
    const target = Number(el.dataset.count);
    if (prefersReducedMotion()) {
      el.textContent = format.format(target);
      return;
    }
    const duration = 1600;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = format.format(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        run(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.6 },
  );

  counters.forEach((el) => observer.observe(el));
}
