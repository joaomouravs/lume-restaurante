import type { ImageMetadata } from 'astro';

// Assinaturas
import sigFigos from '@/assets/images/sig-figos.jpg';
import sigAncho from '@/assets/images/sig-ancho.jpg';
import heroPlate from '@/assets/images/hero-plate.png';
import sigCacau from '@/assets/images/sig-cacau.jpg';
import sigNegroni from '@/assets/images/sig-negroni.jpg';
// Capas das categorias (também são as fotos dos pratos correspondentes)
import coverEntradas from '@/assets/images/cover-entradas.jpg';
import coverPrincipais from '@/assets/images/cover-principais.jpg';
import coverSobremesas from '@/assets/images/cover-sobremesas.jpg';
import coverDrinks from '@/assets/images/cover-drinks.jpg';
// Miniaturas dos demais pratos
import thumbPao from '@/assets/images/thumb-pao.jpg';
import thumbTartare from '@/assets/images/thumb-tartare.jpg';
import thumbVieiras from '@/assets/images/thumb-vieiras.jpg';
import thumbCostela from '@/assets/images/thumb-costela.jpg';
import thumbQueijos from '@/assets/images/thumb-queijos.jpg';
import thumbCapimSanto from '@/assets/images/thumb-capim-santo.jpg';
import dishPappardelle from '@/assets/images/dish-pappardelle.jpg';
import dishSalmon from '@/assets/images/dish-salmon.jpg';
import dessertBerries from '@/assets/images/dessert-berries.jpg';
import drinkBotanical from '@/assets/images/drink-botanical.jpg';
import drinkMartini from '@/assets/images/drink-martini.jpg';
// Jornada do Menu Fogo
import journeyPao from '@/assets/images/journey-1-pao.jpg';
import journeyFigos from '@/assets/images/journey-2-figos.jpg';
import journeyCaldo from '@/assets/images/journey-3-caldo.jpg';
import journeyPeixe from '@/assets/images/journey-4-peixe.jpg';
import journeyAncho from '@/assets/images/journey-5-ancho.jpg';
import journeyCambuci from '@/assets/images/journey-6-cambuci.jpg';
import journeyCacau from '@/assets/images/journey-7-cacau.jpg';

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
    cover: coverEntradas,
    coverAlt: 'Creme de abóbora cabotiá com coalhada de cabra e óleo de sálvia em prato fundo escuro',
    items: [
      {
        name: 'Pão de fermentação natural',
        description: 'Manteiga de garrafa defumada na brasa e flor de sal de Mossoró.',
        price: 28,
        tags: ['veg'],
        image: thumbPao,
        imageAlt: 'Pão de fermentação natural partido, com manteiga de garrafa e flor de sal',
      },
      {
        name: 'Figos na brasa',
        description: 'Burrata cremosa, mel de jataí, castanha-do-pará tostada e folhas da horta.',
        price: 64,
        tags: ['veg', 'sg'],
        signature: true,
        image: sigFigos,
        imageAlt: 'Figos caramelizados na brasa sobre burrata, com mel e castanha-do-pará',
      },
      {
        name: 'Creme de abóbora cabotiá',
        description: 'Coalhada de cabra, óleo de sálvia e sementes caramelizadas.',
        price: 52,
        tags: ['veg', 'sg'],
        image: coverEntradas,
        imageAlt: 'Creme de abóbora cabotiá com coalhada de cabra e óleo de sálvia',
      },
      {
        name: 'Tartare de wagyu',
        description: 'Gema curada, tucupi negro, alcaparras de capuchinha e chips de mandioca.',
        price: 78,
        tags: ['sg', 'sl'],
        image: thumbTartare,
        imageAlt: 'Tartare de wagyu com gema curada, tucupi negro e chips de mandioca',
      },
      {
        name: 'Vieiras seladas',
        description: 'Beurre blanc de maracujá, pupunha grelhada e crocante de quinoa.',
        price: 86,
        tags: ['sg'],
        image: thumbVieiras,
        imageAlt: 'Vieiras seladas sobre beurre blanc de maracujá com pupunha e quinoa crocante',
      },
    ],
  },
  {
    id: 'principais',
    title: 'Principais',
    kicker: 'Do fogo à mesa',
    cover: coverPrincipais,
    coverAlt: 'Peixe do dia com a pele dourada sobre folha de bananeira, moqueca de coco e farofa de dendê',
    items: [
      {
        name: 'Ancho maturado 45 dias',
        description: 'Assado na brasa de lenha de laranjeira, farofa de tutano e chimichurri de ervas frescas.',
        price: 168,
        tags: ['sg', 'sl'],
        signature: true,
        image: sigAncho,
        imageAlt: 'Ancho fatiado ao ponto sobre tábua, com farofa de tutano e chimichurri',
      },
      {
        name: 'Peixe do dia na folha de bananeira',
        description: 'Moqueca leve de coco queimado, farofa de dendê e arroz de coentro.',
        price: 142,
        tags: ['sg', 'sl'],
        image: coverPrincipais,
        imageAlt: 'Peixe do dia sobre folha de bananeira com moqueca de coco e arroz de coentro',
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
        image: thumbCostela,
        imageAlt: 'Costela de porco laqueada sobre purê de mandioquinha e couve crocante',
      },
    ],
  },
  {
    id: 'sobremesas',
    title: 'Sobremesas',
    kicker: 'Para encerrar',
    cover: coverSobremesas,
    coverAlt: 'Mil-folhas de massa caramelizada e doce de leite com flor de sal',
    items: [
      {
        name: 'Cacau 70% da Bahia',
        description: 'Bolo úmido de cacau, sorvete de baunilha do cerrado e calda quente.',
        price: 48,
        tags: ['veg'],
        signature: true,
        image: sigCacau,
        imageAlt: 'Bolo úmido de cacau com calda quente e sorvete de baunilha',
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
        image: coverSobremesas,
        imageAlt: 'Mil-folhas caramelizado com doce de leite e flor de sal',
      },
      {
        name: 'Queijos artesanais brasileiros',
        description: 'Seleção de três queijos de pequenas queijarias, compotas e pão de mel.',
        price: 72,
        tags: ['veg'],
        image: thumbQueijos,
        imageAlt: 'Tábua com três queijos artesanais, compotas e pão de mel',
      },
    ],
  },
  {
    id: 'drinks',
    title: 'Drinks',
    kicker: 'Coquetelaria autoral',
    note: 'Carta de vinhos com 180 rótulos — peça ao nosso sommelier.',
    cover: coverDrinks,
    coverAlt: 'Rabo de galo âmbar em copo baixo com casca de laranja queimada',
    items: [
      {
        name: 'Negroni de cumaru',
        description: 'Gin, vermute rosso infusionado com cumaru e bitter da casa.',
        price: 46,
        tags: ['sg'],
        signature: true,
        image: sigNegroni,
        imageAlt: 'Negroni de cumaru em copo baixo com gelo e casca de laranja',
      },
      {
        name: 'Rabo de galo Lume',
        description: 'Cachaça envelhecida em amburana, vermute, Cynar e casca de laranja queimada.',
        price: 42,
        tags: ['sg'],
        image: coverDrinks,
        imageAlt: 'Rabo de galo em copo baixo com casca de laranja queimada',
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
        image: thumbCapimSanto,
        imageAlt: 'Limonada de capim-santo com gelo e limão em copo alto',
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
    image: journeyPao,
    imageAlt: 'Pão de fermentação natural partido sobre tábua, com manteiga de garrafa e flor de sal',
  },
  {
    title: 'Figos na brasa',
    description: 'Burrata, mel de jataí e castanha de baru tostada.',
    origin: 'Cerrado · GO',
    ingredient: 'Mel de jataí',
    image: journeyFigos,
    imageAlt: 'Meio figo caramelizado sobre burrata com mel de jataí e baru, em prato pequeno',
  },
  {
    title: 'Caldo de abóbora cabotiá',
    description: 'Abóbora assada nas cinzas, coalhada de cabra e óleo de ervas da horta.',
    origin: 'Mata Atlântica · SP',
    ingredient: 'Abóbora cabotiá',
    image: journeyCaldo,
    imageAlt: 'Caldo de abóbora assada nas cinzas com coalhada de cabra em tigela escura',
  },
  {
    title: 'Peixe da costa, tucupi e jambu',
    description: 'Peixe do dia selado na folha de bananeira, caldo de tucupi negro e jambu.',
    origin: 'Amazônia · PA',
    ingredient: 'Tucupi negro',
    image: journeyPeixe,
    imageAlt: 'Peixe selado em caldo de tucupi negro com jambu, em tigela de latão',
  },
  {
    title: 'Ancho maturado 45 dias',
    description: 'Assado na lenha de laranjeira, farofa de tutano e chimichurri de ervas.',
    origin: 'Pampa · RS',
    ingredient: 'Gado de pasto',
    image: journeyAncho,
    imageAlt: 'Duas fatias de ancho ao ponto com farofa de tutano e chimichurri',
  },
  {
    title: 'Pré-sobremesa de cambuci',
    description: 'Pão de ló leve, sorbet de cambuci e frutas vermelhas da estação.',
    origin: 'Mata Atlântica · SP',
    ingredient: 'Cambuci',
    image: journeyCambuci,
    imageAlt: 'Sorbet de cambuci sobre pão de ló, com frutas vermelhas e cambuci cortado ao meio',
  },
  {
    title: 'Cacau 70% da Bahia',
    description: 'Bolo úmido de cacau fino, calda quente e sorvete de baunilha do cerrado.',
    origin: 'Sul da Bahia · BA',
    ingredient: 'Cacau cabruca',
    image: journeyCacau,
    imageAlt: 'Bolo de cacau com calda quente, sorvete de baunilha e nibs de cacau',
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
