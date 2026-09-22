/**
 * Página de cardápio: scroll-spy da barra de categorias e filtro por restrição alimentar.
 */

export function initMenuPage() {
  initScrollSpy();
  initFilters();
}

function initScrollSpy() {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-spy-link]'));
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-spy]'));
  if (!links.length || !sections.length) return;

  const visible = new Map<string, number>();

  const setActive = (id: string | undefined) => {
    links.forEach((link) => {
      const active = link.dataset.spyLink === id;
      if (active) {
        link.setAttribute('aria-current', 'true');
        // Mantém o link ativo visível na barra rolável (mobile)
        const bar = link.closest('nav');
        if (bar && bar.scrollWidth > bar.clientWidth) {
          bar.scrollTo({ left: link.offsetLeft - 24, behavior: 'smooth' });
        }
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => visible.set((e.target as HTMLElement).dataset.spy!, e.intersectionRatio));
      // A seção com maior área visível vence
      let best: string | undefined;
      let max = 0;
      visible.forEach((ratio, id) => {
        if (ratio > max) {
          max = ratio;
          best = id;
        }
      });
      setActive(best);
    },
    { rootMargin: '-35% 0px -45% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
  );

  sections.forEach((s) => observer.observe(s));
}

function initFilters() {
  const chips = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const status = document.querySelector<HTMLElement>('[data-filter-status]');
  if (!chips.length) return;

  const apply = (filter: string) => {
    let total = 0;

    document.querySelectorAll<HTMLElement>('.menu-cat').forEach((cat) => {
      let count = 0;
      cat.querySelectorAll<HTMLElement>('[data-item]').forEach((li) => {
        const tags = li.querySelector<HTMLElement>('[data-tags]')?.dataset.tags?.split(' ') ?? [];
        const match = filter === 'all' || tags.includes(filter);
        li.hidden = !match;
        if (match) {
          count++;
          li.classList.add('is-visible');
        }
      });
      const empty = cat.querySelector<HTMLElement>('[data-empty]');
      if (empty) empty.hidden = count > 0;
      total += count;
    });

    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === filter)));

    if (status) {
      const label = chips.find((c) => c.dataset.filter === filter)?.textContent?.trim();
      status.textContent =
        filter === 'all' ? `Exibindo todos os ${total} itens do cardápio.` : `${total} itens: ${label?.toLowerCase()}.`;
    }
  };

  chips.forEach((chip) => chip.addEventListener('click', () => apply(chip.dataset.filter ?? 'all')));
}
