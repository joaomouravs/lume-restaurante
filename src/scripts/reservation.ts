/**
 * Fluxo de reserva em três etapas.
 * - Horários gerados a partir do funcionamento real de cada dia
 * - Validação acessível (aria-invalid + mensagens associadas)
 * - Pré-preenchimento via query string (?data=&horario=&pessoas=&experiencia=)
 * - Envio simulado: integrar aqui com a API/serviço de reservas do restaurante
 */

type Shift = { label: string; open: number; close: number };
type Day = { day: number; shifts: Shift[] };

const LAST_SEATING = 90; // minutos antes do fechamento
const SLOT_STEP = 30;
const MAX_DAYS_AHEAD = 30;

const pad = (n: number) => String(n).padStart(2, '0');
const slotLabel = (m: number) => `${pad(Math.floor((m % 1440) / 60))}h${pad(m % 60)}`;
const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromISO = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export function initReservation() {
  const form = document.querySelector<HTMLFormElement>('[data-reserve-form]');
  if (!form) return;

  const schedule = JSON.parse(form.dataset.schedule ?? '[]') as Day[];
  const steps = Array.from(form.querySelectorAll<HTMLFieldSetElement>('[data-step]'));
  const indicators = Array.from(document.querySelectorAll<HTMLElement>('[data-step-indicator]'));
  const slotsBox = form.querySelector<HTMLElement>('[data-slots]')!;
  const dateInput = form.querySelector<HTMLInputElement>('#r-date')!;
  const guestsInput = form.querySelector<HTMLInputElement>('#r-guests')!;
  const phoneInput = form.querySelector<HTMLInputElement>('[data-phone]')!;
  const notes = form.querySelector<HTMLTextAreaElement>('#r-notes')!;
  const counter = form.querySelector<HTMLElement>('[data-counter]')!;
  const success = document.querySelector<HTMLElement>('[data-success]')!;
  const stepsList = document.querySelector<HTMLElement>('[data-steps]');
  let current = 1;
  let chosenSlot = '';

  /* ---------- Datas ---------- */
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + MAX_DAYS_AHEAD);
  dateInput.min = toISO(today);
  dateInput.max = toISO(maxDate);

  const params = new URLSearchParams(location.search);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  dateInput.value = params.get('data') ?? toISO(tomorrow);
  chosenSlot = params.get('horario') ?? '';

  const guests = Number(params.get('pessoas'));
  if (guests >= 1 && guests <= 24) guestsInput.value = String(guests);

  const exp = params.get('experiencia');
  const expRadio = exp && form.querySelector<HTMLInputElement>(`input[name="experiencia"][value="${CSS.escape(exp)}"]`);
  if (expRadio) expRadio.checked = true;

  const experience = () => form.querySelector<HTMLInputElement>('input[name="experiencia"]:checked')?.value ?? 'carta';

  /* ---------- Horários ---------- */
  const shiftsFor = (date: Date) => {
    const day = date.getDay();
    let shifts = schedule.find((d) => d.day === day)?.shifts ?? [];
    const e = experience();
    if (e === 'degustacao') shifts = shifts.filter((s) => s.label === 'Jantar');
    if (e === 'mesa-do-chef') shifts = day === 5 || day === 6 ? shifts.filter((s) => s.label === 'Jantar') : [];
    return shifts;
  };

  const renderSlots = () => {
    slotsBox.replaceChildren();
    const value = dateInput.value;
    if (!value) {
      slotsBox.innerHTML = '<p class="slots__empty">Escolha uma data para ver os horários.</p>';
      return;
    }

    const date = fromISO(value);
    const shifts = shiftsFor(date);
    if (!shifts.length) {
      const msg =
        experience() === 'mesa-do-chef'
          ? 'A Mesa do Chef acontece às sextas e sábados, no jantar. Escolha outra data.'
          : 'Não abrimos neste dia. Que tal escolher outra data?';
      slotsBox.innerHTML = `<p class="slots__empty">${msg}</p>`;
      return;
    }

    const isToday = value === toISO(today);
    const nowMinutes = today.getHours() * 60 + today.getMinutes() + 60; // pelo menos 1h de antecedência

    shifts.forEach((shift) => {
      const group = document.createElement('div');
      group.className = 'slots__shift';
      group.innerHTML = `<p class="slots__shift-title">${shift.label}</p>`;
      const grid = document.createElement('div');
      grid.className = 'slots__grid';

      for (let m = shift.open; m <= shift.close - LAST_SEATING; m += SLOT_STEP) {
        const label = slotLabel(m);
        const disabled = isToday && m < nowMinutes;
        const item = document.createElement('label');
        item.className = 'slot';
        item.innerHTML = `<input type="radio" name="horario" value="${label}" ${disabled ? 'disabled' : ''} ${
          label === chosenSlot && !disabled ? 'checked' : ''
        } /><span>${label}</span>`;
        grid.append(item);
      }
      group.append(grid);
      slotsBox.append(group);
    });
  };

  slotsBox.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.name === 'horario') {
      chosenSlot = t.value;
      clearError('horario');
    }
  });

  dateInput.addEventListener('change', () => {
    clearError('data');
    renderSlots();
  });
  form.querySelectorAll('input[name="experiencia"]').forEach((r) => r.addEventListener('change', renderSlots));
  renderSlots();

  /* ---------- Pessoas ---------- */
  const syncGuests = () => {
    const n = Math.min(24, Math.max(1, Number(guestsInput.value) || 1));
    guestsInput.value = String(n);
    form.querySelector<HTMLButtonElement>('[data-guests="-1"]')!.disabled = n <= 1;
    form.querySelector<HTMLButtonElement>('[data-guests="1"]')!.disabled = n >= 24;
  };
  form.querySelectorAll<HTMLButtonElement>('[data-guests]').forEach((btn) =>
    btn.addEventListener('click', () => {
      guestsInput.value = String(Number(guestsInput.value) + Number(btn.dataset.guests));
      syncGuests();
    }),
  );
  guestsInput.addEventListener('change', syncGuests);
  syncGuests();

  /* ---------- Máscara de telefone e contador ---------- */
  phoneInput.addEventListener('input', () => {
    const d = phoneInput.value.replace(/\D/g, '').slice(0, 11);
    let out = d;
    if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 6) out = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
    phoneInput.value = out;
  });

  const updateCounter = () => (counter.textContent = `${notes.value.length} / ${notes.maxLength}`);
  notes.addEventListener('input', updateCounter);

  /* ---------- Validação ---------- */
  const errorEl = (name: string) => form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);

  function setError(name: string, message: string, field?: HTMLElement | null) {
    const el = errorEl(name);
    if (el) el.textContent = message;
    field?.setAttribute('aria-invalid', 'true');
  }

  function clearError(name: string) {
    const el = errorEl(name);
    if (el) el.textContent = '';
    form!.querySelectorAll(`[name="${name}"]`).forEach((f) => f.removeAttribute('aria-invalid'));
  }

  const validators: Record<number, () => HTMLElement | null> = {
    1: () => {
      let first: HTMLElement | null = null;
      const mark = (el: HTMLElement) => (first ??= el);

      clearError('data');
      clearError('horario');
      if (!dateInput.value) {
        setError('data', 'Escolha a data da sua reserva.', dateInput);
        mark(dateInput);
      } else if (dateInput.value < dateInput.min || dateInput.value > dateInput.max) {
        setError('data', `Aceitamos reservas de hoje até ${MAX_DAYS_AHEAD} dias à frente.`, dateInput);
        mark(dateInput);
      } else if (!shiftsFor(fromISO(dateInput.value)).length) {
        setError('data', 'Não há horários disponíveis nesta data para a experiência escolhida.', dateInput);
        mark(dateInput);
      }

      if (!first && !form.querySelector('input[name="horario"]:checked')) {
        setError('horario', 'Selecione um dos horários disponíveis.');
        mark(slotsBox.querySelector<HTMLElement>('input:not(:disabled)') ?? slotsBox);
      }
      return first;
    },
    2: () => {
      let first: HTMLElement | null = null;
      const checks: [string, string][] = [
        ['nome', 'Informe seu nome completo.'],
        ['telefone', 'Informe um celular válido, com DDD. Ex.: (11) 98765-4321'],
        ['email', 'Informe um e-mail válido. Ex.: nome@email.com'],
        ['politica', 'Para continuar, confirme que está ciente da política de reservas.'],
      ];
      checks.forEach(([name, msg]) => {
        const field = form.querySelector<HTMLInputElement>(`[name="${name}"]`)!;
        clearError(name);
        if (!field.checkValidity()) {
          setError(name, msg, field);
          first ??= field;
        }
      });
      return first;
    },
  };

  // Limpa o erro assim que o campo é corrigido
  form.querySelectorAll<HTMLInputElement>('#r-name, #r-phone, #r-email, input[name="politica"]').forEach((f) =>
    f.addEventListener(f.type === 'checkbox' ? 'change' : 'input', () => {
      if (f.getAttribute('aria-invalid') === 'true' && f.checkValidity()) clearError(f.name);
    }),
  );

  /* ---------- Navegação entre etapas ---------- */
  const goTo = (n: number) => {
    current = n;
    steps.forEach((s) => (s.hidden = Number(s.dataset.step) !== n));
    indicators.forEach((ind) => {
      const i = Number(ind.dataset.stepIndicator);
      ind.classList.toggle('is-current', i === n);
      ind.classList.toggle('is-done', i < n);
      if (i === n) ind.setAttribute('aria-current', 'step');
      else ind.removeAttribute('aria-current');
    });
    if (n === 3) renderSummary();

    const top = (stepsList ?? form).getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top, behavior: 'smooth' });
    steps[n - 1].querySelector<HTMLElement>('legend')?.focus({ preventScroll: true });
  };

  form.querySelectorAll('[data-next]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const invalid = validators[current]?.();
      if (invalid) {
        invalid.focus();
        return;
      }
      goTo(current + 1);
    }),
  );
  form.querySelectorAll('[data-prev]').forEach((btn) => btn.addEventListener('click', () => goTo(current - 1)));

  /* ---------- Resumo ---------- */
  const expLabel = () =>
    form.querySelector<HTMLInputElement>('input[name="experiencia"]:checked')?.closest('label')?.querySelector('.exp-option__title')
      ?.textContent ?? '';

  const longDate = (iso: string) =>
    new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(fromISO(iso));

  function renderSummary() {
    const data = new FormData(form!);
    const n = Number(data.get('pessoas'));
    const rows: [string, string, boolean?][] = [
      ['Experiência', expLabel()],
      ['Pessoas', `${n} ${n === 1 ? 'pessoa' : 'pessoas'}`],
      ['Data', longDate(String(data.get('data')))],
      ['Horário', String(data.get('horario'))],
      ['Nome', String(data.get('nome'))],
      ['Contato', `${data.get('telefone')} · ${data.get('email')}`],
      ['Ocasião', String(data.get('ocasiao'))],
      ['Observações', String(data.get('observacoes') || '—'), true],
    ];
    const dl = form!.querySelector<HTMLElement>('[data-summary]')!;
    dl.replaceChildren(
      ...rows.map(([dt, dd, wide]) => {
        const div = document.createElement('div');
        if (wide || dt === 'Contato') div.className = 'is-wide';
        const t = document.createElement('dt');
        t.textContent = dt;
        const d = document.createElement('dd');
        d.textContent = dd;
        div.append(t, d);
        return div;
      }),
    );
  }

  /* ---------- Envio ---------- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (current !== 3) return;

    const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    const original = submit.innerHTML;
    submit.textContent = 'Enviando…';

    // Simulação de requisição — substituir pela integração real
    await new Promise((r) => setTimeout(r, 900));

    const data = new FormData(form);
    const code = `LU-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const firstName = String(data.get('nome')).split(' ')[0];
    success.querySelector('[data-success-code]')!.textContent = code;
    success.querySelector('[data-success-text]')!.textContent =
      `Tudo certo, ${firstName}. Recebemos seu pedido para ${longDate(String(data.get('data')))}, às ${data.get(
        'horario',
      )}. Você receberá a confirmação por e-mail e WhatsApp em até duas horas.`;

    success.querySelector<HTMLButtonElement>('[data-ics]')!.onclick = () => downloadICS(data, code);

    form.hidden = true;
    stepsList?.setAttribute('hidden', '');
    success.hidden = false;
    success.focus();
    submit.disabled = false;
    submit.removeAttribute('aria-busy');
    submit.innerHTML = original;
  });
}

/** Gera um arquivo .ics para adicionar a reserva ao calendário */
function downloadICS(data: FormData, code: string) {
  const [h, m] = String(data.get('horario')).split('h').map(Number);
  const start = fromISO(String(data.get('data')));
  start.setHours(h, m);
  const end = new Date(start.getTime() + 2.5 * 60 * 60 * 1000);
  const fmt = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Lume//Reservas//PT-BR',
    'BEGIN:VEVENT',
    `UID:${code}@lumerestaurante.com.br`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    'SUMMARY:Jantar no Lume — Cozinha de Fogo',
    `DESCRIPTION:Reserva ${code} para ${data.get('pessoas')} pessoa(s).`,
    'LOCATION:Rua Joaquim Antunes\\, 377 — Jardins\\, São Paulo',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: `reserva-lume-${code}.ics` });
  a.click();
  URL.revokeObjectURL(url);
}
