/**
 * Abas acessíveis (WAI-ARIA Tabs, ativação automática).
 * Setas ← → / ↑ ↓, Home e End navegam entre as abas.
 * Elementos [data-tab-image] sincronizam com a aba ativa.
 */

export function initTabs() {
  document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((root) => {
    if (root.dataset.ready) return;
    root.dataset.ready = 'true';

    const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const panels = Array.from(root.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
    const images = Array.from(root.querySelectorAll<HTMLElement>('[data-tab-image]'));
    const indicator = root.querySelector<HTMLElement>('[data-tabs-indicator]');
    if (!tabs.length) return;

    const moveIndicator = (tab: HTMLElement) => {
      if (!indicator) return;
      indicator.style.setProperty('--x', `${tab.offsetLeft}px`);
      indicator.style.setProperty('--w', `${tab.offsetWidth}px`);
    };

    const select = (tab: HTMLButtonElement, focus = false) => {
      const id = tab.dataset.tab;
      tabs.forEach((t) => {
        const active = t === tab;
        t.setAttribute('aria-selected', String(active));
        t.tabIndex = active ? 0 : -1;
      });
      panels.forEach((p) => (p.hidden = p.dataset.panel !== id));
      images.forEach((img) => img.classList.toggle('is-active', img.dataset.tabImage === id));
      moveIndicator(tab);
      if (focus) tab.focus({ preventScroll: true });

      // Mantém a aba visível em listas com rolagem horizontal, sem mover a página
      const list = tab.parentElement;
      if (list && list.scrollWidth > list.clientWidth) {
        list.scrollTo({ left: tab.offsetLeft - list.clientWidth / 2 + tab.offsetWidth / 2, behavior: 'smooth' });
      }
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        const keys: Record<string, number> = {
          ArrowRight: i + 1,
          ArrowDown: i + 1,
          ArrowLeft: i - 1,
          ArrowUp: i - 1,
          Home: 0,
          End: tabs.length - 1,
        };
        if (!(e.key in keys)) return;
        e.preventDefault();
        const next = tabs[(keys[e.key] + tabs.length) % tabs.length];
        select(next, true);
      });
    });

    const current = tabs.find((t) => t.getAttribute('aria-selected') === 'true') ?? tabs[0];
    moveIndicator(current);
    window.addEventListener('resize', () => {
      const active = tabs.find((t) => t.getAttribute('aria-selected') === 'true');
      if (active) moveIndicator(active);
    });
    // Recalcula após o carregamento das fontes (larguras mudam)
    document.fonts?.ready.then(() => moveIndicator(tabs.find((t) => t.tabIndex === 0) ?? tabs[0]));
  });
}
