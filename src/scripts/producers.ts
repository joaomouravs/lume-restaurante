/**
 * Mapa dos produtores: seleção pela lista (controle principal e acessível),
 * pelos pontos do mapa ou pelas setas do cartão. A rota do produtor ativo
 * se desenha até a cozinha a cada troca.
 */

type ProducerView = {
  id: string;
  name: string;
  place: string;
  region: string;
  ingredient: string;
  dish: string;
  since: number;
  note: string;
  distance: string;
};

export function initProducers() {
  const root = document.querySelector<HTMLElement>('[data-producers]');
  if (!root) return;

  const data = JSON.parse(root.dataset.payload ?? '[]') as ProducerView[];
  const card = root.querySelector<HTMLElement>('[data-card]');
  const map = root.querySelector<HTMLElement>('[data-map]');
  const chips = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-select]'));
  const points = Array.from(root.querySelectorAll<SVGGElement>('[data-point]'));
  const routes = Array.from(root.querySelectorAll<SVGPathElement>('[data-route]'));
  if (!card || !data.length) return;

  const field = (name: string) => card.querySelector<HTMLElement>(`[data-f="${name}"]`);
  let current = 0;
  let swapTimer: number | undefined;

  const fill = (p: ProducerView, index: number) => {
    field('index')!.textContent = String(index + 1).padStart(2, '0');
    (['region', 'ingredient', 'name', 'place', 'note', 'dish', 'distance'] as const).forEach((k) => {
      const el = field(k);
      if (el) el.textContent = String(p[k]);
    });
    field('since')!.textContent = String(p.since);
  };

  const select = (index: number, opts: { scrollChip?: boolean } = {}) => {
    index = (index + data.length) % data.length;
    if (index === current && card.dataset.ready) return;
    current = index;
    const p = data[index];

    // Troca o conteúdo com um fade curto
    window.clearTimeout(swapTimer);
    card.classList.add('is-changing');
    swapTimer = window.setTimeout(() => {
      fill(p, index);
      card.classList.remove('is-changing');
    }, 180);

    chips.forEach((c, i) => c.setAttribute('aria-pressed', String(i === index)));
    points.forEach((pt, i) => pt.classList.toggle('is-active', i === index));

    // Reinicia o desenho da rota
    routes.forEach((r, i) => {
      if (i === index) {
        r.classList.remove('is-active');
        void r.getBoundingClientRect();
        r.classList.add('is-active');
      } else {
        r.classList.remove('is-active');
      }
    });

    if (opts.scrollChip) {
      const chip = chips[index];
      const list = chip.closest('ul');
      if (list && list.scrollWidth > list.clientWidth) {
        const left = chip.getBoundingClientRect().left - list.getBoundingClientRect().left + list.scrollLeft;
        list.scrollTo({ left: left - 24, behavior: 'smooth' });
      }
    }
  };

  card.dataset.ready = 'true';

  chips.forEach((chip, i) => chip.addEventListener('click', () => select(i)));
  points.forEach((pt, i) => pt.addEventListener('click', () => select(i, { scrollChip: true })));
  card.querySelectorAll<HTMLButtonElement>('[data-step]').forEach((btn) =>
    btn.addEventListener('click', () => select(current + Number(btn.dataset.step), { scrollChip: true })),
  );

  // Setas do teclado percorrem a lista de produtores
  root.querySelector('.producers__list')?.addEventListener('keydown', (e) => {
    const ev = e as KeyboardEvent;
    if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
    ev.preventDefault();
    const next = (current + (ev.key === 'ArrowRight' ? 1 : -1) + data.length) % data.length;
    select(next, { scrollChip: true });
    chips[next].focus();
  });

  // Desenha o mapa quando a seção entra na tela
  if (map) {
    if (!('IntersectionObserver' in window)) {
      map.classList.add('is-drawn');
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        map.classList.add('is-drawn');
        // Redesenha a rota inicial depois que o contorno aparece
        window.setTimeout(() => {
          const r = routes[current];
          r?.classList.remove('is-active');
          void r?.getBoundingClientRect();
          r?.classList.add('is-active');
        }, 1600);
        io.disconnect();
      },
      { threshold: 0.25 },
    );
    io.observe(map);
  }
}
