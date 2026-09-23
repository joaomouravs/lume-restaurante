/**
 * Gera o mapa do Brasil usado na seção de produtores.
 *
 * Fonte: Natural Earth 1:50m (domínio público) — países e estados.
 *   node scripts/build-map.mjs <ne_50m_admin_0_countries.geojson> <ne_50m_admin_1_states_provinces.geojson>
 *
 * Saída: src/data/brazil-map.json com os caminhos SVG já projetados e simplificados.
 * A mesma projeção é usada em src/data/map-projection.ts para posicionar os produtores.
 */
import fs from 'node:fs';
import { project, MAP } from '../src/data/map-projection.ts';

const [countriesFile, statesFile] = process.argv.slice(2);
if (!countriesFile || !statesFile) {
  console.error('Uso: node scripts/build-map.mjs <países.geojson> <estados.geojson>');
  process.exit(1);
}

const countries = JSON.parse(fs.readFileSync(countriesFile, 'utf8'));
const states = JSON.parse(fs.readFileSync(statesFile, 'utf8'));

const brazil = countries.features.find((f) => f.properties.ADM0_A3 === 'BRA');
const brStates = states.features.filter((f) => f.properties.adm0_a3 === 'BRA');

/** Douglas–Peucker em coordenadas já projetadas */
function simplify(points, tolerance) {
  if (points.length < 3) return points;
  const sqTol = tolerance * tolerance;
  const sqSegDist = (p, a, b) => {
    let [x, y] = a;
    let dx = b[0] - x;
    let dy = b[1] - y;
    if (dx || dy) {
      const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) [x, y] = b;
      else if (t > 0) {
        x += dx * t;
        y += dy * t;
      }
    }
    dx = p[0] - x;
    dy = p[1] - y;
    return dx * dx + dy * dy;
  };
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [first, last] = stack.pop();
    let maxSq = 0;
    let index = 0;
    for (let i = first + 1; i < last; i++) {
      const d = sqSegDist(points[i], points[first], points[last]);
      if (d > maxSq) {
        maxSq = d;
        index = i;
      }
    }
    if (maxSq > sqTol) {
      keep[index] = 1;
      stack.push([first, index], [index, last]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

const ringToPath = (ring, tolerance, minArea = 0) => {
  const pts = simplify(ring.map(([lng, lat]) => project(lng, lat)), tolerance);
  if (pts.length < 3) return '';
  // Descarta ilhas minúsculas (ruído visual)
  const area = Math.abs(pts.reduce((a, [x, y], i) => {
    const [nx, ny] = pts[(i + 1) % pts.length];
    return a + x * ny - nx * y;
  }, 0)) / 2;
  if (area < minArea) return '';
  return 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') + 'Z';
};

const geometryToPath = (geometry, tolerance, minArea) => {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  return polygons
    .map((poly) => ringToPath(poly[0], tolerance, minArea))
    .filter(Boolean)
    .join('');
};

const out = {
  source: 'Natural Earth 1:50m (domínio público) — naturalearthdata.com',
  viewBox: `0 0 ${MAP.width} ${MAP.height}`,
  outline: geometryToPath(brazil.geometry, 0.9, 12),
  states: brStates
    .map((f) => ({ code: f.properties.postal, name: f.properties.name, d: geometryToPath(f.geometry, 1.1, 30) }))
    .filter((s) => s.d),
};

fs.writeFileSync('src/data/brazil-map.json', JSON.stringify(out));
console.log(
  `✓ mapa gerado: contorno ${(out.outline.length / 1024).toFixed(1)} KB, ${out.states.length} estados, ` +
    `total ${(fs.statSync('src/data/brazil-map.json').size / 1024).toFixed(1)} KB`,
);
