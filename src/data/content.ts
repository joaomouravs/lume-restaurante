import type { ImageMetadata } from 'astro';

import dishSignature from '@/assets/images/dish-signature.jpg';
import chefPlating from '@/assets/images/chef-plating.jpg';
import winePour from '@/assets/images/wine-pour.jpg';
import chefKitchen from '@/assets/images/chef-kitchen.jpg';
import roomWarm from '@/assets/images/room-warm.jpg';
import roomBar from '@/assets/images/room-bar.jpg';
import roomBarLights from '@/assets/images/room-bar-lights.jpg';
import roomTable from '@/assets/images/room-table.jpg';
import roomDining from '@/assets/images/room-dining.jpg';
import tableWine from '@/assets/images/table-wine.jpg';
import brasaGrill from '@/assets/images/brasa-grill.jpg';
import wineGrapes from '@/assets/images/wine-grapes.jpg';
import dinnerToast from '@/assets/images/dinner-toast.jpg';
import drinkNegroni from '@/assets/images/drink-negroni.jpg';

export type Experience = {
  id: string;
  title: string;
  meta: string[];
  description: string;
  image: ImageMetadata;
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
    image: dishSignature,
    imageAlt: 'Prato do menu degustação apresentado pela equipe de salão',
    cta: { label: 'Reservar degustação', href: '/reservas?experiencia=degustacao' },
  },
  {
    id: 'mesa-do-chef',
    title: 'Mesa do Chef',
    meta: ['8 lugares', 'Balcão da brasa', 'Sex e Sáb'],
    description:
      'Um balcão de oito lugares diante da cozinha aberta. Pratos exclusivos, conversa com a brigada e o calor do fogo a poucos metros.',
    image: chefPlating,
    imageAlt: 'Chef finalizando um prato com pinça na cozinha aberta',
    cta: { label: 'Reservar balcão', href: '/reservas?experiencia=mesa-do-chef' },
  },
  {
    id: 'harmonizacao',
    title: 'Harmonização & Adega',
    meta: ['180 rótulos', 'Sommelière', 'Naturais e clássicos'],
    description:
      'Uma adega com foco em pequenos produtores do Brasil e do Novo Mundo. Harmonizações pensadas tempo a tempo, com ou sem álcool.',
    image: winePour,
    imageAlt: 'Vinho tinto sendo servido em taça sobre mesa escura',
    cta: { label: 'Conhecer a adega', href: '/cardapio#drinks' },
  },
  {
    id: 'eventos',
    title: 'Eventos Privados',
    meta: ['Até 24 pessoas', 'Salão reservado', 'Menu sob medida'],
    description:
      'Jantares de celebração, encontros corporativos e lançamentos em um salão reservado, com menu desenhado junto ao chef.',
    image: dinnerToast,
    imageAlt: 'Convidados brindando à mesa em um jantar à luz de velas',
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
};

export const gallery: GalleryItem[] = [
  { image: roomWarm, alt: 'Salão principal com luz quente e mesas postas', caption: 'Salão principal', layout: 'tall' },
  { image: brasaGrill, alt: 'Costela assando sobre a grelha com a brasa viva por baixo', caption: 'A brasa', layout: 'wide' },
  { image: drinkNegroni, alt: 'Coquetel âmbar com gelo no balcão', caption: 'Bar de coquetelaria', layout: 'square' },
  { image: tableWine, alt: 'Garrafa de vinho e taças em mesa posta sob luz quente', caption: 'Mesa posta', layout: 'square' },
  { image: roomBarLights, alt: 'Bar iluminado por dezenas de lâmpadas pendentes', caption: 'O bar', layout: 'tall' },
  { image: wineGrapes, alt: 'Taça de vinho tinto ao lado de cachos de uva', caption: 'Adega', layout: 'square' },
  { image: roomDining, alt: 'Cliente servindo-se à mesa em ambiente de luz baixa', caption: 'À mesa', layout: 'wide' },
  { image: chefKitchen, alt: 'Cozinheiro finalizando pratos na cozinha aberta', caption: 'Cozinha aberta', layout: 'square' },
  { image: roomBar, alt: 'Balcão de bar com prateleiras de garrafas', caption: 'Balcão', layout: 'square', mobileLayout: 'wide' },
  { image: roomTable, alt: 'Prato servido em mesa com taças de cristal', caption: 'Serviço', layout: 'wide' },
];

export const stats = [
  { value: 38, suffix: '', label: 'pequenos produtores parceiros' },
  { value: 180, suffix: '', label: 'rótulos na adega' },
  { value: 4, suffix: '', label: 'menus por ano, um por estação' },
  { value: 12, suffix: 'h', label: 'de brasa acesa por dia' },
];

export const pillars = ['Brasa', 'Estação', 'Terroir', 'Hospitalidade', 'Pequenos produtores', 'Fermentação'];
