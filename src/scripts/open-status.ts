/**
 * Indicador "Aberto agora" calculado no fuso de São Paulo,
 * considerando turnos que atravessam a meia-noite.
 */

type Shift = { label: string; open: number; close: number };
type Day = { day: number; short: string; shifts: Shift[] };

const fmt = (minutes: number) => {
  const m = minutes % 1440;
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return mm ? `${hh}h${String(mm).padStart(2, '0')}` : `${hh}h`;
};

/** Dia da semana (0–6) e minutos desde 00:00 no horário de Brasília */
export function nowInSaoPaulo(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '0';
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day: weekday, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

export function getOpenStatus(schedule: Day[], date = new Date()) {
  const { day, minutes } = nowInSaoPaulo(date);
  const byDay = (d: number) => schedule.find((s) => s.day === ((d + 7) % 7));

  // Turno de hoje em andamento
  for (const shift of byDay(day)?.shifts ?? []) {
    if (minutes >= shift.open && minutes < shift.close) {
      return { open: true, text: `Aberto agora · ${shift.label.toLowerCase()} até ${fmt(shift.close)}` };
    }
  }

  // Turno de ontem que atravessou a meia-noite
  for (const shift of byDay(day - 1)?.shifts ?? []) {
    if (shift.close > 1440 && minutes < shift.close - 1440) {
      return { open: true, text: `Aberto agora · até ${fmt(shift.close)}` };
    }
  }

  // Próxima abertura
  for (let offset = 0; offset < 7; offset++) {
    const d = byDay(day + offset);
    const next = d?.shifts.find((s) => offset > 0 || s.open > minutes);
    if (d && next) {
      const when = offset === 0 ? 'hoje' : offset === 1 ? 'amanhã' : d.short.toLowerCase();
      return { open: false, text: `Fechado agora · abre ${when} às ${fmt(next.open)}` };
    }
  }

  return { open: false, text: 'Consulte nossos horários' };
}

export function initOpenStatus() {
  document.querySelectorAll<HTMLElement>('[data-status]').forEach((el) => {
    if (el.dataset.ready) return;
    el.dataset.ready = 'true';
    const schedule = JSON.parse(el.dataset.schedule ?? '[]') as Day[];
    const text = el.querySelector<HTMLElement>('[data-status-text]');
    const update = () => {
      const status = getOpenStatus(schedule);
      el.dataset.open = String(status.open);
      if (text) text.textContent = status.text;
    };
    update();
    window.setInterval(update, 60_000);
  });
}
