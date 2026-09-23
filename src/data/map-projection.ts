/**
 * Projeção do mapa do Brasil (equirretangular com correção de latitude).
 * Compartilhada entre o gerador do mapa (scripts/build-map.mjs) e a seção de produtores,
 * para que os pontos caiam exatamente sobre o contorno.
 */

const BOUNDS = { west: -74.2, east: -34.6, north: 5.4, south: -33.9 };
const REF_LAT = -14; // latitude de referência para compensar o achatamento
const K = Math.cos((REF_LAT * Math.PI) / 180);

const WIDTH = 1000;
const HEIGHT = Math.round((WIDTH * (BOUNDS.north - BOUNDS.south)) / ((BOUNDS.east - BOUNDS.west) * K));

export const MAP = { width: WIDTH, height: HEIGHT };

/** Converte longitude/latitude em coordenadas do SVG */
export function project(lng: number, lat: number): [number, number] {
  const x = ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * WIDTH;
  const y = ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * HEIGHT;
  return [x, y];
}

/** Distância em km entre dois pontos (fórmula de haversine) */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}
