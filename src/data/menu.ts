import type { ImageMetadata } from 'astro';

import dishFigs from '@/assets/images/dish-figs.jpg';
import dishPumpkin from '@/assets/images/dish-pumpkin.jpg';
import dishAncho from '@/assets/images/dish-ancho.jpg';
import dishFish from '@/assets/images/dish-fish.jpg';
import dishPappardelle from '@/assets/images/dish-pappardelle.jpg';
import dishSalmon from '@/assets/images/dish-salmon.jpg';
import dishSignature from '@/assets/images/dish-signature.jpg';
import heroPlate from '@/assets/images/hero-plate.png';
import dessertCacao from '@/assets/images/dessert-cacao.jpg';
import dessertBerries from '@/assets/images/dessert-berries.jpg';
import dessertLayers from '@/assets/images/dessert-layers.jpg';
import drinkNegroni from '@/assets/images/drink-negroni.jpg';
import drinkBotanical from '@/assets/images/drink-botanical.jpg';
import drinkPour from '@/assets/images/drink-pour.jpg';
import drinkMartini from '@/assets/images/drink-martini.jpg';
import bread from '@/assets/images/bread.jpg';
import soupDark from '@/assets/images/soup-dark.jpg';
import fishBroth from '@/assets/images/fish-broth.jpg';
import cacaoBundt from '@/assets/images/cacao-bundt.jpg';

export type DietTag = 'veg' | 'sg' | 'sl';

export const dietLabels: Record<DietTag, { short: string; label: string }> = {
  veg: { short: 'V', label: 'Vegetariano' },
  sg: { short: 'SG', label: 'Sem glúten' },
  sl: { short: 'SL', label: 'Sem lactose' },
};

export type MenuItem = {
  name: string;
  description: string;
  price: number;
  tags?: DietTag[];
  signature?: boolean;
  image?: ImageMetadata;
  imageAlt?: string;
};

export type MenuCategory = {
  id: string;
  title: string;
  kicker: string;
  note?: string;
  cover: ImageMetadata;
  coverAlt: string;
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    id: 'entradas',
    title: 'Entradas',
    kicker: 'Para começar',
    cover: dishFigs,
    coverAlt: 'Figos assados servidos em prato branco sobre fundo escuro',
    items: [
      {
        name: 'Pão de fermentação natural',
        description: 'Manteiga de garrafa defumada na brasa e flor de sal de Mossoró.',
        price: 28,
        tags: ['veg'],
      },
      {
        name: 'Figos na brasa',
        description: 'Burrata cremosa, mel de jataí, castanha-do-pará tostada e folhas da horta.',
        price: 64,
        tags: ['veg', 'sg'],
        signature: true,
        image: dishFigs,
        imageAlt: 'Figos assados com frutas vermelhas em prato branco',
      },
      {
        name: 'Creme de abóbora cabotiá',
        description: 'Coalhada de cabra, óleo de sálvia e sementes caramelizadas.',
        price: 52,
        tags: ['veg', 'sg'],
        image: dishPumpkin,
        imageAlt: 'Creme de abóbora com coalhada e ervas em prato fundo',
      },
      {
        name: 'Tartare de wagyu',
        description: 'Gema curada, tucupi negro, alcaparras de capuchinha e chips de mandioca.',
        price: 78,
        tags: ['sg', 'sl'],
      },
      {
        name: 'Vieiras seladas',
        description: 'Beurre blanc de maracujá, pupunha grelhada e crocante de quinoa.',
        price: 86,
        tags: ['sg'],
      },
    ],
  },
  {
    id: 'principais',
    title: 'Principais',
    kicker: 'Do fogo à mesa',
    cover: dishAncho,
    coverAlt: 'Ancho fatiado ao ponto sobre tábua escura',
    items: [
      {
        name: 'Ancho maturado 45 dias',
        description: 'Assado na brasa de lenha de laranjeira, farofa de tutano e chimichurri de ervas frescas.',
        price: 168,
        tags: ['sg', 'sl'],
        signature: true,
        image: dishAncho,
        imageAlt: 'Ancho fatiado, suculento e ao ponto',
      },
      {
        name: 'Peixe do dia na folha de bananeira',
        description: 'Moqueca leve de coco queimado, farofa de dendê e arroz de coentro.',
        price: 142,
        tags: ['sg', 'sl'],
        image: dishFish,
        imageAlt: 'Filé de peixe grelhado sobre legumes em prato escuro',
      },
      {
        name: 'Risoto de Canastra e trufa negra',
        description: 'Arroz carnaroli, queijo Canastra meia-cura, trufa fresca e manjericão.',
        price: 124,
        tags: ['veg', 'sg'],
        signature: true,
        image: heroPlate,
        imageAlt: 'Risoto cremoso com lascas de queijo e trufa em prato branco',
      },
      {
        name: 'Pappardelle de ovos caipiras',
        description: 'Ragu de cordeiro cozido por 12 horas, pecorino e gremolata de limão-cravo.',
        price: 118,
        image: dishPappardelle,
        imageAlt: 'Pappardelle com ragu em bowl escuro',
      },
      {
        name: 'Salmão confitado',
        description: 'Beterraba tostada, romã, aspargos grelhados e agrião d’água.',
        price: 136,
        tags: ['sg', 'sl'],
        image: dishSalmon,
        imageAlt: 'Salmão confitado com romã e aspargos',
      },
      {
        name: 'Costela de porco preto',
        description: 'Laqueada em rapadura e cachaça, purê de mandioquinha e couve crocante.',
        price: 138,
        tags: ['sg'],
        image: dishSignature,
        imageAlt: 'Prato principal servido em prato branco com ervas',
      },
    ],
  },
  {
    id: 'sobremesas',
    title: 'Sobremesas',
    kicker: 'Para encerrar',
    cover: dessertCacao,
    coverAlt: 'Brownie de cacau com sorvete e calda de chocolate',
    items: [
      {
        name: 'Cacau 70% da Bahia',
        description: 'Bolo úmido de cacau, sorvete de baunilha do cerrado e calda quente.',
        price: 48,
        tags: ['veg'],
        signature: true,
        image: dessertCacao,
        imageAlt: 'Bolo de chocolate com sorvete de baunilha',
      },
      {
        name: 'Pão de ló de frutas vermelhas',
        description: 'Creme leve de requeijão, framboesas frescas e merengue tostado.',
        price: 44,
        tags: ['veg'],
        image: dessertBerries,
        imageAlt: 'Fatia de bolo com framboesas frescas',
      },
      {
        name: 'Mil-folhas de doce de leite',
        description: 'Massa folhada caramelizada, doce de leite de Minas e flor de sal.',
        price: 46,
        tags: ['veg'],
        image: dessertLayers,
        imageAlt: 'Mil-folhas em camadas com cacau',
      },
      {
        name: 'Queijos artesanais brasileiros',
        description: 'Seleção de três queijos de pequenas queijarias, compotas e pão de mel.',
        price: 72,
        tags: ['veg'],
      },
    ],
  },
  {
    id: 'drinks',
    title: 'Drinks',
    kicker: 'Coquetelaria autoral',
    note: 'Carta de vinhos com 180 rótulos — peça ao nosso sommelier.',
    cover: drinkNegroni,
    coverAlt: 'Coquetel âmbar com gelo sobre balcão escuro',
    items: [
      {
        name: 'Negroni de cumaru',
        description: 'Gin, vermute rosso infusionado com cumaru e bitter da casa.',
        price: 46,
        tags: ['sg'],
        signature: true,
        image: drinkNegroni,
        imageAlt: 'Negroni servido em copo baixo com gelo',
      },
      {
        name: 'Rabo de galo Lume',
        description: 'Cachaça envelhecida em amburana, vermute, Cynar e casca de laranja queimada.',
        price: 42,
        tags: ['sg'],
        image: drinkPour,
        imageAlt: 'Coquetel sendo servido sobre gelo',
      },
      {
        name: 'Botânico',
        description: 'Gin, cambuci, xarope de hibisco e tônica artesanal.',
        price: 44,
        tags: ['sg'],
        image: drinkBotanical,
        imageAlt: 'Coquetel rosado com laranja desidratada',
      },
      {
        name: 'Martini de caju',
        description: 'Vodka, destilado de caju, vermute seco e azeitona verde.',
        price: 48,
        tags: ['sg'],
        image: drinkMartini,
        imageAlt: 'Martini em taça clássica com azeitonas',
      },
      {
        name: 'Capim-santo & limão (sem álcool)',
        description: 'Limonada de capim-santo, gengibre fresco e água com gás.',
        price: 24,
        tags: ['sg', 'sl'],
      },
    ],
  },
];

export type TastingStep = {
  title: string;
  description: string;
  origin: string; // região / bioma de onde vem o ingrediente principal
  ingredient: string;
  image: ImageMetadata;
  imageAlt: string;
};

const tastingSteps: TastingStep[] = [
  {
    title: 'Pão de fermentação natural',
    description: 'Fermentação de 48 horas, manteiga de garrafa defumada na brasa e flor de sal.',
    origin: 'Serra da Mantiqueira · MG',
    ingredient: 'Manteiga de garrafa',
    image: bread,
    imageAlt: 'Pães rústicos de fermentação natural com ramos de trigo',
  },
  {
    title: 'Figos na brasa',
    description: 'Burrata, mel de jataí e castanha de baru tostada.',
    origin: 'Cerrado · GO',
    ingredient: 'Mel de jataí',
    image: dishFigs,
    imageAlt: 'Figos assados com frutas vermelhas em prato branco',
  },
  {
    title: 'Caldo de abóbora cabotiá',
    description: 'Abóbora assada nas cinzas, coalhada de cabra e óleo de ervas da horta.',
    origin: 'Mata Atlântica · SP',
    ingredient: 'Abóbora cabotiá',
    image: soupDark,
    imageAlt: 'Caldo cremoso de abóbora com ervas em tigela escura',
  },
  {
    title: 'Peixe da costa, tucupi e jambu',
    description: 'Peixe do dia selado na folha de bananeira, caldo de tucupi negro e jambu.',
    origin: 'Amazônia · PA',
    ingredient: 'Tucupi negro',
    image: fishBroth,
    imageAlt: 'Peixe servido em caldo dourado dentro de tigela metálica',
  },
  {
    title: 'Ancho maturado 45 dias',
    description: 'Assado na lenha de laranjeira, farofa de tutano e chimichurri de ervas.',
    origin: 'Pampa · RS',
    ingredient: 'Gado de pasto',
    image: dishAncho,
    imageAlt: 'Ancho fatiado ao ponto sobre tábua escura',
  },
  {
    title: 'Pré-sobremesa de cambuci',
    description: 'Pão de ló leve, sorbet de cambuci e frutas vermelhas da estação.',
    origin: 'Mata Atlântica · SP',
    ingredient: 'Cambuci',
    image: dessertBerries,
    imageAlt: 'Fatia de pão de ló com framboesas frescas',
  },
  {
    title: 'Cacau 70% da Bahia',
    description: 'Bolo úmido de cacau fino, calda quente e sorvete de baunilha do cerrado.',
    origin: 'Sul da Bahia · BA',
    ingredient: 'Cacau cabruca',
    image: cacaoBundt,
    imageAlt: 'Bolo de chocolate com calda escorrendo sobre fundo escuro',
  },
];

export const tastingMenu = {
  name: 'Menu Fogo',
  courses: tastingSteps.length,
  price: 420,
  pairing: 290,
  duration: '2h30',
  description:
    'Uma travessia pelos biomas brasileiros em sete tempos, conduzida pela brasa e pela estação. Servido de terça a sábado, exclusivamente no jantar.',
  steps: tastingSteps,
};

export const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 0 }).format(value);
