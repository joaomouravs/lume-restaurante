/**
 * Informações institucionais do restaurante.
 * Fonte única de verdade para header, footer, SEO (JSON-LD) e páginas.
 */

export const site = {
  name: 'Lume',
  fullName: 'Lume — Cozinha de Fogo',
  tagline: 'Cozinha contemporânea brasileira, guiada pelo fogo',
  description:
    'Lume é um restaurante de cozinha contemporânea brasileira em São Paulo. Ingredientes de pequenos produtores, cocção na brasa e uma experiência gastronômica intimista nos Jardins.',
  locale: 'pt_BR',
  foundingYear: 2016,
  priceRange: 'R$$$',
  cuisine: ['Brasileira contemporânea', 'Cozinha de fogo', 'Menu degustação'],

  contact: {
    phone: '+55 11 3062-4580',
    phoneHref: 'tel:+551130624580',
    whatsapp: '+55 11 98765-4321',
    whatsappHref: 'https://wa.me/5511987654321',
    email: 'reservas@lumerestaurante.com.br',
    events: 'eventos@lumerestaurante.com.br',
  },

  address: {
    street: 'Rua Joaquim Antunes, 377',
    district: 'Jardins',
    city: 'São Paulo',
    region: 'SP',
    postalCode: '05415-010',
    country: 'BR',
    mapsUrl: 'https://maps.google.com/?q=Rua+Joaquim+Antunes+377+Sao+Paulo',
    geo: { lat: -23.5642, lng: -46.6795 },
    parking: 'Valet no local · R$ 35',
  },

  social: [
    { label: 'Instagram', handle: '@lume.restaurante', href: 'https://instagram.com/' },
    { label: 'Spotify', handle: 'Playlist da casa', href: 'https://open.spotify.com/' },
    { label: 'TripAdvisor', handle: 'Avaliações', href: 'https://tripadvisor.com.br/' },
  ],
} as const;

/**
 * Horário de funcionamento.
 * `day` segue Date.getDay(): 0 = domingo … 6 = sábado.
 * Cada turno usa minutos desde 00:00; valores > 1440 atravessam a meia-noite.
 */
export type Shift = { label: string; open: number; close: number };
export type DaySchedule = { day: number; name: string; short: string; shifts: Shift[] };

const h = (hours: number, minutes = 0) => hours * 60 + minutes;

export const schedule: DaySchedule[] = [
  { day: 1, name: 'Segunda-feira', short: 'Seg', shifts: [] },
  { day: 2, name: 'Terça-feira', short: 'Ter', shifts: [{ label: 'Jantar', open: h(19), close: h(23, 30) }] },
  { day: 3, name: 'Quarta-feira', short: 'Qua', shifts: [{ label: 'Jantar', open: h(19), close: h(23, 30) }] },
  { day: 4, name: 'Quinta-feira', short: 'Qui', shifts: [{ label: 'Jantar', open: h(19), close: h(23, 30) }] },
  {
    day: 5,
    name: 'Sexta-feira',
    short: 'Sex',
    shifts: [
      { label: 'Almoço', open: h(12), close: h(15, 30) },
      { label: 'Jantar', open: h(19), close: h(24, 30) },
    ],
  },
  {
    day: 6,
    name: 'Sábado',
    short: 'Sáb',
    shifts: [
      { label: 'Almoço', open: h(12, 30), close: h(16) },
      { label: 'Jantar', open: h(19), close: h(24, 30) },
    ],
  },
  { day: 0, name: 'Domingo', short: 'Dom', shifts: [{ label: 'Almoço', open: h(12, 30), close: h(17) }] },
];

export const formatTime = (minutes: number) => {
  const m = minutes % 1440;
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return mm === 0 ? `${hh}h` : `${hh}h${String(mm).padStart(2, '0')}`;
};

export const formatShift = (s: Shift) => `${formatTime(s.open)} – ${formatTime(s.close)}`;

export const navigation = [
  { label: 'A Casa', href: '/#a-casa' },
  { label: 'Cardápio', href: '/cardapio' },
  { label: 'Experiências', href: '/#experiencias' },
  { label: 'Galeria', href: '/#galeria' },
  { label: 'Visite', href: '/#visite' },
] as const;
