/**
 * Foto que segue o cursor sobre itens de cardápio ([data-cursor-src]).
 * Movimento suavizado (lerp) com inclinação proporcional à velocidade.
 * Desativado em telas de toque e com prefers-reduced-motion.
 */

export function initCursorImage() {
  const root = document.querySelector<HTMLElement>('[data-cursor-img]');
  const img = root?.querySelector<HTMLImageElement>('[data-cursor-img-el]');
  const targets = document.querySelectorAll<HTMLElement>('[data-cursor-src]');
  if (!root || !img || !targets.length) return;

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canHover || reduced) return;

  const pos = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  let rotation = 0;
  let visible = false;
  let running = false;
  let current = '';
  const preloaded = new Set<string>();

  const preload = (src: string) => {
    if (preloaded.has(src)) return;
    preloaded.add(src);
    new Image().src = src;
  };

  const loop = () => {
    const dx = target.x - pos.x;
    const dy = target.y - pos.y;
    pos.x += dx * 0.16;
    pos.y += dy * 0.16;
    rotation += (Math.max(-12, Math.min(12, dx * 0.12)) - rotation) * 0.12;

    const w = root.offsetWidth;
    const h = root.offsetHeight;
    // Imagem à direita do cursor; vira para a esquerda perto da borda
    const offsetX = target.x + w + 48 > window.innerWidth ? -w - 32 : 32;
    root.style.transform = `translate3d(${pos.x + offsetX}px, ${pos.y - h / 2}px, 0) rotate(${rotation}deg)`;

    if (visible || Math.abs(dx) + Math.abs(dy) > 0.5) {
      requestAnimationFrame(loop);
    } else {
      running = false;
    }
  };

  const start = () => {
    if (running) return;
    running = true;
    requestAnimationFrame(loop);
  };

  window.addEventListener(
    'pointermove',
    (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        // Primeira aparição nasce no próprio cursor, sem "voar" de outro ponto
        pos.x = target.x;
        pos.y = target.y;
      }
      if (visible) start();
    },
    { passive: true },
  );

  const show = (el: HTMLElement) => {
    const src = el.dataset.cursorSrc!;
    root.classList.toggle('is-cutout', el.hasAttribute('data-cursor-cutout'));
    if (src !== current) {
      if (current && visible) {
        img.classList.add('is-swapping');
        setTimeout(() => {
          img.src = src;
          img.classList.remove('is-swapping');
        }, 120);
      } else {
        img.src = src;
      }
      current = src;
    }
    visible = true;
    root.classList.add('is-visible');
    start();
  };

  const hide = () => {
    visible = false;
    root.classList.remove('is-visible');
  };

  const lists = new Set<Element>();

  targets.forEach((el) => {
    el.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      show(el);
    });
    el.addEventListener('pointerleave', hide);

    // Pré-carrega as fotos de uma lista quando o cursor entra nela
    const list = el.closest('ul, ol');
    if (list && !lists.has(list)) {
      lists.add(list);
      list.addEventListener(
        'pointerenter',
        () => list.querySelectorAll<HTMLElement>('[data-cursor-src]').forEach((t) => preload(t.dataset.cursorSrc!)),
        { once: true },
      );
    }
  });

  // Rolando com o cursor parado: acompanha o item que passa sob ele
  let scrollTick = false;
  window.addEventListener(
    'scroll',
    () => {
      if (scrollTick || (!visible && !current)) return;
      scrollTick = true;
      requestAnimationFrame(() => {
        scrollTick = false;
        const under = document.elementFromPoint(target.x, target.y)?.closest<HTMLElement>('[data-cursor-src]');
        if (under) show(under);
        else if (visible) hide();
      });
    },
    { passive: true },
  );
}
