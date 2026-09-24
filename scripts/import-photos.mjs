/**
 * Importa as fotos geradas para o site (photos/fotos-new) → src/assets/images.
 *
 * As fotos novas já foram produzidas com a direção de arte do Lume (luz baixa,
 * paleta âmbar), então NÃO recebem o tratamento de `grade-photos.mjs` — isso
 * as deixaria tratadas duas vezes. Aqui só convertemos PNG → JPEG otimizado
 * com nomes padronizados. Uso: `npm run photos:import`
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

sharp.cache(false);

const SRC = 'photos/fotos-new';
const OUT = 'src/assets/images';

/** Arquivo recebido → nome no projeto (seção entre comentários) */
const MAP = {
  // A Casa
  'A Casa.png': 'about-table.jpg',
  'o fogo.png': 'about-fire.jpg',
  // Assinaturas
  'Figos na brasa.png': 'sig-figos.jpg',
  'Ancho maturado 45 dias.png': 'sig-ancho.jpg',
  'Cacau 70% da Bahia.png': 'sig-cacau.jpg',
  'Negroni de cumaru.png': 'sig-negroni.jpg',
  // O Chef
  'O Chef retrato (desktop).png': 'chef-portrait-desktop.jpg',
  'O Chef retrato (mobile).png': 'chef-portrait-mobile.jpg',
  'O Chef faixa Fogo & alma (desktop).png': 'chef-banner-desktop.jpg',
  'O Chef faixa Fogo & alma (mobile).png': 'chef-banner-mobile.jpg',
  // Cardápio da estação (home) + capas do /cardapio
  'Entradas (Creme de abóbora cabotiá).png': 'cover-entradas.jpg',
  'Principais (Peixe do dia na folha de bananeira).png': 'cover-principais.jpg',
  'Sobremesas (Mil-folhas de doce de leite).png': 'cover-sobremesas.jpg',
  'Drinks (Rabo de galo Lume).png': 'cover-drinks.jpg',
  // Jornada do Menu Fogo
  'Pão de fermentação natural.png': 'journey-1-pao.jpg',
  'Figos na brasa (porção de degustação).png': 'journey-2-figos.jpg',
  'Caldo de abóbora cabotiá.png': 'journey-3-caldo.jpg',
  'Peixe da costa, tucupi e jambu.png': 'journey-4-peixe.jpg',
  'Ancho maturado 45 dias - 2.png': 'journey-5-ancho.jpg',
  'Pré-sobremesa de cambuci.png': 'journey-6-cambuci.jpg',
  'Cacau 70% da Bahia - 2.png': 'journey-7-cacau.jpg',
  // Experiências
  'Menu Fogo (desktop).png': 'exp-menu-fogo-desktop.jpg',
  'Menu Fogo (mobile).png': 'exp-menu-fogo-mobile.jpg',
  'Mesa do Chef (desktop).png': 'exp-mesa-chef-desktop.jpg',
  'Mesa do Chef (mobile).png': 'exp-mesa-chef-mobile.jpg',
  'Harmonização & Adega (desktop).png': 'exp-adega-desktop.jpg',
  'Harmonização & Adega (mobile).png': 'exp-adega-mobile.jpg',
  'Eventos Privados (desktop).png': 'exp-eventos-desktop.jpg',
  'Eventos Privados (mobile).png': 'exp-eventos-mobile.jpg',
  // Galeria
  'Salão principal (alta).png': 'gallery-salao.jpg',
  'A brasa (larga).png': 'gallery-brasa.jpg',
  'Bar de coquetelaria (quadrada).png': 'gallery-coquetelaria.jpg',
  'Mesa posta (quadrada).png': 'gallery-mesa-posta.jpg',
  'O bar (alta).png': 'gallery-bar.jpg',
  'Adega (quadrada).png': 'gallery-adega.jpg',
  'À mesa (larga).png': 'gallery-a-mesa.jpg',
  'Cozinha aberta (quadrada).png': 'gallery-cozinha.jpg',
  'Balcão (larga).png': 'gallery-balcao.jpg',
  'Serviço (larga).png': 'gallery-servico.jpg',
  // Visite · Faixa de reserva
  'Visite fachada (desktop).png': 'visit-facade-desktop.jpg',
  'Visite fachada (mobile).png': 'visit-facade-mobile.jpg',
  'Faixa - Reserve a sua noite (desktop).png': 'reserve-band-desktop.jpg',
  'Faixa Reserve a sua noite (mobile).png': 'reserve-band-mobile.jpg',
  // /cardapio
  'Página cardapio (desktop).png': 'page-cardapio-desktop.jpg',
  'Página cardapio (mobile).png': 'page-cardapio-mobile.jpg',
  'Menu degustação (foto do passe).png': 'tasting-pass.jpg',
  'Pão de fermentação natural - 2.png': 'thumb-pao.jpg',
  'Tartare de wagyu.png': 'thumb-tartare.jpg',
  'Vieiras seladas.png': 'thumb-vieiras.jpg',
  'Queijos artesanais brasileiros.png': 'thumb-queijos.jpg',
  'Capim-santo & limão (sem álcool).png': 'thumb-capim-santo.jpg',
  'Costela de porco preto.png': 'thumb-costela.jpg',
  // /reservas · compartilhamento
  'Página reservas (desktop).png': 'page-reservas-desktop.jpg',
  'Página reservas (mobile).png': 'page-reservas-mobile.jpg',
  'Compartilhamento (WhatsApp e redes).png': 'og-share.jpg',
};

// Unicode normalizado: nomes com acento podem vir em NFD do sistema de arquivos
const norm = (s) => s.normalize('NFC');
const files = fs.readdirSync(SRC).filter((f) => f.toLowerCase().endsWith('.png'));
const map = Object.fromEntries(Object.entries(MAP).map(([k, v]) => [norm(k), v]));

const unmapped = files.filter((f) => !map[norm(f)]);
const missing = Object.keys(map).filter((k) => !files.some((f) => norm(f) === k));
if (unmapped.length || missing.length) {
  console.error('Sem destino:', unmapped, '\nNão encontrados:', missing);
  process.exit(1);
}

let bytes = 0;
await Promise.all(
  files.map(async (f) => {
    const out = path.join(OUT, map[norm(f)]);
    await sharp(path.join(SRC, f)).jpeg({ quality: 88, mozjpeg: true }).toFile(out);
    bytes += fs.statSync(out).size;
  }),
);
console.log(`✓ ${files.length} fotos → ${OUT} (${(bytes / 1024 / 1024).toFixed(1)} MB)`);
