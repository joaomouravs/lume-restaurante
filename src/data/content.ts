import type { ImageMetadata } from 'astro';

// Experiências: versão desktop (paisagem) e mobile (vertical, outro enquadramento)
import expMenuFogo from '@/assets/images/exp-menu-fogo-desktop.jpg';
import expMenuFogoMobile from '@/assets/images/exp-menu-fogo-mobile.jpg';
import expMesaChef from '@/assets/images/exp-mesa-chef-desktop.jpg';
import expMesaChefMobile from '@/assets/images/exp-mesa-chef-mobile.jpg';
import expAdega from '@/assets/images/exp-adega-desktop.jpg';
import expAdegaMobile from '@/assets/images/exp-adega-mobile.jpg';
import expEventos from '@/assets/images/exp-eventos-desktop.jpg';
import expEventosMobile from '@/assets/images/exp-eventos-mobile.jpg';
// Galeria
import gallerySalao from '@/assets/images/gallery-salao.jpg';
import galleryBrasa from '@/assets/images/gallery-brasa.jpg';
import galleryCoquetelaria from '@/assets/images/gallery-coquetelaria.jpg';
import galleryMesaPosta from '@/assets/images/gallery-mesa-posta.jpg';
import galleryBar from '@/assets/images/gallery-bar.jpg';
import galleryAdega from '@/assets/images/gallery-adega.jpg';
import galleryAMesa from '@/assets/images/gallery-a-mesa.jpg';
import galleryCozinha from '@/assets/images/gallery-cozinha.jpg';
import galleryBalcao from '@/assets/images/gallery-balcao.jpg';
import galleryServico from '@/assets/images/gallery-servico.jpg';

export type Experience = {
  id: string;
  title: string;
  meta: string[];
  description: string;
  image: ImageMetadata;
  /** Enquadramento vertical próprio para o celular */
  imageMobile: ImageMetadata;
  imageAlt: string;
  cta: { label: string; href: string };
};

export const experiences: Experience[] = [
  {
    id: 'degustacao',
    title: 'Menu Fogo',
    meta: ['7 tempos', '2h30', 'Jantar'],
    description:
      'Nossa narrativa completa: sete tempos que atravessam os biomas brasileiros, do litoral ao cerrado, com a brasa como fio condutor.',
    image: expMenuFogo,
    imageMobile: expMenuFogoMobile,
    imageAlt: 'Garçom servindo um tempo do menu degustação a um casal, à luz de velas',
    cta: { label: 'Reservar degustação', href: '/reservas?experiencia=degustacao' },
  },
  {
    id: 'mesa-do-chef',
    title: 'Mesa do Chef',
    meta: ['8 lugares', 'Balcão da brasa', 'Sex e Sáb'],
    description:
      'Um balcão de oito lugares diante da cozinha aberta. Pratos exclusivos, conversa com a brigada e o calor do fogo a poucos metros.',
    image: expMesaChef,
    imageMobile: expMesaChefMobile,
    imageAlt: 'Chef finalizando pratos no balcão da brasa diante dos convidados',
    cta: { label: 'Reservar balcão', href: '/reservas?experiencia=mesa-do-chef' },
  },
  {
    id: 'harmonizacao',
    title: 'Harmonização & Adega',
    meta: ['180 rótulos', 'Sommelière', 'Naturais e clássicos'],
    description:
      'Uma adega com foco em pequenos produtores do Brasil e do Novo Mundo. Harmonizações pensadas tempo a tempo, com ou sem álcool.',
    image: expAdega,
    imageMobile: expAdegaMobile,
    imageAlt: 'Sommelière servindo vinho tinto diante da parede da adega',
    cta: { label: 'Conhecer a adega', href: '/cardapio#drinks' },
  },
  {
    id: 'eventos',
    title: 'Eventos Privados',
    meta: ['Até 24 pessoas', 'Salão reservado', 'Menu sob medida'],
    description:
      'Jantares de celebração, encontros corporativos e lançamentos em um salão reservado, com menu desenhado junto ao chef.',
    image: expEventos,
    imageMobile: expEventosMobile,
    imageAlt: 'Mesa longa posta à luz de velas com convidados brindando no salão privativo',
    cta: { label: 'Solicitar proposta', href: '/reservas?experiencia=eventos' },
  },
];

export type Testimonial = { quote: string; author: string; context: string; source: string };

export const testimonials: Testimonial[] = [
  {
    quote:
      'Uma das experiências mais marcantes que tivemos em São Paulo. O ancho na brasa é inesquecível e o serviço tem uma gentileza rara.',
    author: 'Mariana C.',
    context: 'Jantar de aniversário',
    source: 'Google',
  },
  {
    quote:
      'O Menu Fogo é uma viagem pelo Brasil contada com técnica e afeto. Cada tempo surpreende, e a harmonização é precisa sem ser pretensiosa.',
    author: 'Eduardo M.',
    context: 'Menu degustação',
    source: 'TripAdvisor',
  },
  {
    quote:
      'Luz baixa, música na medida e uma carta de vinhos impecável. Virou o nosso lugar para celebrar as datas importantes.',
    author: 'Juliana & Pedro',
    context: 'Cliente desde 2019',
    source: 'Google',
  },
  {
    quote:
      'A Mesa do Chef vale cada minuto: ver a brigada trabalhando com o fogo é um espetáculo à parte. Voltarei com certeza.',
    author: 'Rodrigo A.',
    context: 'Mesa do Chef',
    source: 'Instagram',
  },
];

export type GalleryItem = {
  image: ImageMetadata;
  alt: string;
  caption: string;
  layout: 'tall' | 'wide' | 'square';
  /** Formato na grade de 2 colunas do celular, quando diferente (evita vãos) */
  mobileLayout?: 'wide';
  /** Formato na grade de 4 colunas do desktop, quando diferente (fecha o mosaico sem vão) */
  desktopLayout?: 'wide';
};

export const gallery: GalleryItem[] = [
  { image: gallerySalao, alt: 'Salão principal com mesas postas, velas e luminárias de latão', caption: 'Salão principal', layout: 'tall' },
  { image: galleryBrasa, alt: 'Parrilla com carnes, legumes e peixe sobre a brasa de lenha', caption: 'A brasa', layout: 'wide' },
  { image: galleryCoquetelaria, alt: 'Bartender finalizando um coquetel âmbar com casca de laranja', caption: 'Bar de coquetelaria', layout: 'square' },
  { image: galleryMesaPosta, alt: 'Mesa para dois posta vista de cima, com velas e alecrim', caption: 'Mesa posta', layout: 'square' },
  { image: galleryBar, alt: 'Bar iluminado por lâmpadas pendentes, com banquetas de couro', caption: 'O bar', layout: 'tall' },
  { image: galleryAdega, alt: 'Taça de vinho tinto sobre barril de carvalho com cacho de uvas', caption: 'Adega', layout: 'square' },
  { image: galleryAMesa, alt: 'Cliente servindo-se de um prato compartilhado à luz de velas', caption: 'À mesa', layout: 'wide' },
  { image: galleryCozinha, alt: 'Cozinha aberta durante o serviço, com pendentes de cobre', caption: 'Cozinha aberta', layout: 'square' },
  { image: galleryBalcao, alt: 'Balcão de pedra do bar com coquetéis e prateleiras de garrafas', caption: 'Balcão', layout: 'square', mobileLayout: 'wide', desktopLayout: 'wide' },
  { image: galleryServico, alt: 'Garçom servindo um prato principal em mesa com taças de cristal', caption: 'Serviço', layout: 'wide' },
];

export const stats = [
  { value: 38, suffix: '', label: 'pequenos produtores parceiros' },
  { value: 180, suffix: '', label: 'rótulos na adega' },
  { value: 4, suffix: '', label: 'menus por ano, um por estação' },
  { value: 12, suffix: 'h', label: 'de brasa acesa por dia' },
];

export const pillars = ['Brasa', 'Estação', 'Terroir', 'Hospitalidade', 'Pequenos produtores', 'Fermentação'];
