/**
 * Transição entre páginas com cortina.
 *
 * Saída: intercepta links internos para outra página, cobre a tela e navega.
 * Chegada: um script inline no <head> marca <html class="is-arriving"> quando a
 * navegação veio de uma transição; aqui a cortina é aberta.
 *
 * Fica de fora: âncoras da mesma página, links externos, mailto/tel, nova aba,
 * teclas modificadoras, downloads e prefers-reduced-motion.
 */

const KEY = 'lume:curtain';
const LEAVE_MS = 540;

const labels: Record<string, string> = {
  '/': 'Início',
  '/cardapio': 'Cardápio',
  '/reservas': 'Reservas',
};

const store = {
  get: () => {
    try {
      return sessionStorage.getItem(KEY);
    } catch {
      return null;
    }
  },
  set: (v: string) => {
    try {
      sessionStorage.setItem(KEY, v);
    } catch {
      /* navegação privada: segue sem cortina na chegada */
    }
  },
  clear: () => {
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      /* ignora */
    }
  },
};

export function initTransitions() {
  const html = document.documentElement;
  const curtain = document.querySelector<HTMLElement>('[data-curtain]');
  const label = curtain?.querySelector<HTMLElement>('[data-curtain-label]');
  if (!curtain || !label) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Chegada ---------- */
  const reveal = () => {
    if (!html.classList.contains('is-arriving')) return;
    label.textContent = store.get() ?? '';
    store.clear();
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        html.classList.add('is-revealing');
        const done = () => html.classList.remove('is-arriving', 'is-revealing');
        curtain.addEventListener('transitionend', done, { once: true });
        window.setTimeout(done, 1200);
      }),
    );
  };
  reveal();

  // Voltar/avançar pelo histórico (bfcache): nunca deixa a cortina presa
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) html.classList.remove('is-leaving', 'is-arriving', 'is-revealing');
  });

  if (reduced) return;

  /* ---------- Saída ---------- */
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
    if (!link || link.target || link.hasAttribute('download') || link.dataset.noTransition !== undefined) return;

    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;
    // Mesma página (inclusive âncoras): comportamento normal
    if (url.pathname.replace(/\/$/, '') === location.pathname.replace(/\/$/, '')) return;

    e.preventDefault();
    const path = url.pathname.replace(/\/$/, '') || '/';
    const text = labels[path] ?? link.textContent?.trim().slice(0, 28) ?? '';
    label.textContent = text;
    store.set(text);
    html.classList.add('is-leaving');

    window.setTimeout(() => {
      location.href = url.href;
    }, LEAVE_MS);
  });
}
