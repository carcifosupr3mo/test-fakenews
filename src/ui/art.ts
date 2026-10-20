/**
 * Arte di VERIFICA: tutto disegnato in SVG, generato nel codice (nessuna immagine esterna).
 * Stile: illustrazione piatta con luce calda e ombre blu, adatta a un'avventura investigativa.
 * Contenuto: scene (sfondi), ritratti con espressioni, icone, illustrazioni delle prove.
 */

/* ---------- utilità ---------- */
const rng = (seed: number) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const f = (n: number) => Math.round(n * 10) / 10;

/* =====================================================================
 *  ICONE (24×24, tratto)
 * ===================================================================== */
const ICONS: Record<string, string> = {
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/>',
  book: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z"/><path d="M5 17a3 3 0 0 1 3-3h11"/><path d="M9 8h6"/>',
  books: '<path d="M4 4h4v16H4zM10 6h4v14h-4z"/><path d="m16 8 3.7-1 3 12.4-3.7 1z" transform="translate(-2 0)"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  puzzle: '<path d="M10 4a2 2 0 1 1 4 0v2h4v4h-2a2 2 0 1 0 0 4h2v4h-4v-2a2 2 0 1 0-4 0v2H6v-4h2a2 2 0 1 0 0-4H6V6h4Z"/>',
  sos: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="m5.6 5.6 3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9"/>',
  back: '<path d="m15 5-7 7 7 7"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
  pin: '<path d="M9 3h6l-1 6 3 3H7l3-3-1-6Z"/><path d="M12 12v9"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  play: '<path d="M7 4.5v15l12-7.5-12-7.5Z"/>',
  warn: '<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 10v4.5M12 17.2v.1"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.7v.1"/>',
  log: '<path d="M5 5h14v10H9l-4 4V5Z"/><path d="M9 9h6M9 12h4"/>',
  star: '<path d="m12 3 2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8L12 3Z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  save: '<path d="M5 4h11l3 3v13H5V4Z"/><path d="M8 4v5h7V4M8 20v-6h8v6"/>',
};
import { municipio, piazza, cucina, sala } from './scenes2';
export function icon(name: string, size = 22): string {
  return `<svg class="ico-svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name] ?? ''}</svg>`;
}

/* =====================================================================
 *  RITRATTI
 * ===================================================================== */
export type Emo = 'neutral' | 'worried' | 'smile' | 'surprised' | 'hurt' | 'thinking';
interface Look {
  skin: string; hair: string; style: 'long' | 'bun' | 'short' | 'bob' | 'bald' | 'tied' | 'wavy';
  cloth: string; shirt: string; glasses?: boolean; beard?: 'stubble' | 'mustache'; earrings?: boolean; eye?: string; collar?: 'v' | 'round' | 'scarf';
}
const LOOKS: Record<string, Look> = {
  marta: { skin: '#e7b08c', hair: '#4a2a1e', style: 'wavy', cloth: '#b5532f', shirt: '#f1e6d2', eye: '#3b2a20', collar: 'v' },
  lina: { skin: '#e8bf9f', hair: '#cfcac6', style: 'bun', cloth: '#8a5a8f', shirt: '#efe3f0', glasses: true, earrings: true, eye: '#4a3b34', collar: 'round' },
  davide: { skin: '#d49d78', hair: '#25262c', style: 'short', cloth: '#2f6b7a', shirt: '#e8e2d2', beard: 'stubble', eye: '#2a2a2a', collar: 'scarf' },
  mamma: { skin: '#e9b997', hair: '#7a4a2a', style: 'bob', cloth: '#c07a4c', shirt: '#f4e7d6', earrings: true, eye: '#4a3322', collar: 'round' },
  nicola: { skin: '#e4b898', hair: '#e8e6e2', style: 'short', cloth: '#8a6d1f', shirt: '#efe6cc', glasses: true, beard: 'mustache', eye: '#3a3a3a', collar: 'v' },
  irene: { skin: '#dcab88', hair: '#1f1a1a', style: 'tied', cloth: '#4d7c4f', shirt: '#eef1ea', eye: '#2a2020', collar: 'v' },
  rocco: { skin: '#d9a281', hair: '#2b211c', style: 'short', cloth: '#7a3b3b', shirt: '#e7ddd0', beard: 'stubble', eye: '#222', collar: 'round' },
  paolo: { skin: '#d7a47f', hair: '#6b6b6e', style: 'short', cloth: '#2b3a5c', shirt: '#eef0f2', glasses: true, eye: '#2f2a26', collar: 'scarf' },
  elio: { skin: '#e3b494', hair: '#e5e2dd', style: 'bald', cloth: '#5b6b8c', shirt: '#e8e6e0', glasses: true, eye: '#3a3a3a', collar: 'v' },
};
const EMO: Record<Emo, { brow: [number, number, number]; eyes: number; mouth: string; blush?: boolean; look?: [number, number]; extra?: string }> = {
  neutral: { brow: [0, 0, 0], eyes: 7, mouth: 'M98 169 Q110 173 122 169' },
  worried: { brow: [3, -6, 0], eyes: 7.5, mouth: 'M98 173 Q110 166 122 173', look: [0, 1] },
  smile: { brow: [-1, -1, 0], eyes: 4.5, mouth: 'M93 164 Q110 184 127 164 Q110 172 93 164Z', blush: true },
  surprised: { brow: [-2, -3, -6], eyes: 9, mouth: 'M110 166 m-6 0 a6 8 0 1 0 12 0 a6 8 0 1 0 -12 0' },
  hurt: { brow: [3, -7, 0], eyes: 6.5, mouth: 'M98 175 Q110 166 122 175', look: [0, 2], extra: '<path d="M127 142q4 6 0 11" fill="#9ec9e8" stroke="none" opacity=".8"/>' },
  thinking: { brow: [0, 0, -5], eyes: 6.5, mouth: 'M100 170 Q113 166 124 162', look: [-3, -2] },
};
function hairBack(l: Look): string {
  const c = l.hair;
  switch (l.style) {
    case 'long': case 'wavy': return `<path d="M58 118C46 160 52 205 70 232L150 232C168 205 174 160 162 118Z" fill="${c}"/>`;
    case 'bun': return `<circle cx="110" cy="62" r="22" fill="${c}"/><path d="M70 118c0 20 4 40 12 52L138 170c8-12 12-32 12-52Z" fill="${c}"/>`;
    case 'bob': return `<path d="M56 112C50 150 56 182 66 192L154 192C164 182 170 150 164 112Z" fill="${c}"/>`;
    case 'tied': return `<path d="M156 100c22 6 30 30 20 60-6-14-16-20-26-20Z" fill="${c}"/>`;
    default: return '';
  }
}
function hairFront(l: Look): string {
  const c = l.hair;
  const hi = `<path d="M78 84c14-10 34-12 52-8" stroke="#fff" stroke-opacity=".18" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  switch (l.style) {
    case 'wavy': return `<path d="M60 124C54 78 84 62 112 62c30 0 52 18 48 62-6-22-18-34-34-38-14 12-36 16-66 38Z" fill="${c}"/>${hi}`;
    case 'long': return `<path d="M60 124C54 78 84 62 112 62c30 0 52 18 48 62-8-20-22-32-44-36-14 12-34 18-56 36Z" fill="${c}"/>${hi}`;
    case 'bun': return `<path d="M62 118C58 80 84 66 112 66c28 0 50 14 46 52-10-18-24-26-46-28-20 2-38 10-50 28Z" fill="${c}"/>${hi}`;
    case 'bob': return `<path d="M58 126C52 78 80 62 112 62s60 16 52 64c-4-22-14-34-34-40-22 8-46 14-72 40Z" fill="${c}"/>${hi}`;
    case 'tied': return `<path d="M62 120C58 78 84 64 112 64c28 0 48 14 46 56-12-20-28-28-46-28s-36 8-50 28Z" fill="${c}"/>${hi}`;
    case 'short': return `<path d="M62 116C60 76 84 66 112 66c28 0 50 10 48 50-8-16-22-24-48-24s-42 8-50 24Z" fill="${c}"/>${hi}`;
    case 'bald': return `<path d="M62 132c-4-16 0-30 6-38-4 14-2 28 4 38ZM158 132c4-16 0-30-6-38 4 14 2 28-4 38Z" fill="${c}"/>`;
  }
}
const portraitCache = new Map<string, string>();
export function portraitSvg(id: string, emo: Emo = 'neutral'): string {
  const key = id + ':' + emo;
  const hit = portraitCache.get(key);
  if (hit) return hit;
  const l = LOOKS[id] ?? LOOKS.marta;
  const e = EMO[emo];
  const dark = '#2a1d17';
  const [dyo, dyi, dyr] = e.brow;
  const ey = 128;
  const look = e.look ?? [0, 0];
  const eye = (cx: number) => e.eyes < 5
    ? `<path d="M${cx - 9} ${ey + 1}Q${cx} ${ey - 8} ${cx + 9} ${ey + 1}" stroke="${dark}" stroke-width="3" fill="none" stroke-linecap="round"/>`
    : `<ellipse cx="${cx}" cy="${ey}" rx="9.5" ry="${e.eyes}" fill="#fff"/><circle cx="${cx + look[0]}" cy="${ey + look[1]}" r="4.6" fill="${l.eye ?? '#333'}"/><circle cx="${cx + look[0] + 1.6}" cy="${ey + look[1] - 1.6}" r="1.3" fill="#fff"/>`;
  const brow = (x1: number, x2: number, extra = 0) => `<path d="M${x1} ${f(110 + (x1 < 110 ? dyo : dyi) + extra)}L${x2} ${f(110 + (x1 < 110 ? dyi : dyo) + extra)}" stroke="${l.style === 'bald' || l.hair === '#e8e6e2' || l.hair === '#cfcac6' ? '#9a948c' : l.hair}" stroke-width="4.2" stroke-linecap="round"/>`;
  const collar = l.collar === 'scarf'
    ? `<path d="M78 214Q110 244 142 214L146 236Q110 262 74 236Z" fill="#d8b365"/><path d="M96 236l6 28 14-4-8-26Z" fill="#c29c4a"/>`
    : l.collar === 'round'
      ? `<path d="M82 214Q110 246 138 214L130 210Q110 232 90 210Z" fill="${l.shirt}"/>`
      : `<path d="M82 214L110 258 138 214 126 208 110 232 94 208Z" fill="${l.shirt}"/>`;
  const glasses = l.glasses ? `<g fill="none" stroke="#3b2f2a" stroke-width="3"><circle cx="90" cy="${ey}" r="15"/><circle cx="130" cy="${ey}" r="15"/><path d="M105 ${ey - 1}h10"/></g>` : '';
  const beard = l.beard === 'stubble'
    ? `<path d="M64 142Q66 196 110 202Q154 196 156 142Q146 176 110 176Q74 176 64 142Z" fill="${l.hair}" opacity=".42"/>`
    : l.beard === 'mustache' ? `<path d="M92 162Q101 156 110 162Q119 156 128 162Q119 170 110 166Q101 170 92 162Z" fill="${l.hair}"/>` : '';
  const svg = `<svg class="portrait-svg" viewBox="0 0 220 300" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Ritratto">
<ellipse cx="110" cy="294" rx="82" ry="8" fill="#000" opacity=".22"/>
${hairBack(l)}
<path d="M18 300C18 236 56 214 110 214s92 22 92 86Z" fill="${l.cloth}"/>
<path d="M18 300C18 236 56 214 110 214s92 22 92 86Z" fill="url(#sh)" opacity=".5"/>
<path d="M96 168h28v52q-14 14-28 0Z" fill="${l.skin}"/><path d="M96 190q14 14 28 0v-14h-28Z" fill="#000" opacity=".12"/>
${collar}
<ellipse cx="62" cy="138" rx="8" ry="12" fill="${l.skin}"/><ellipse cx="158" cy="138" rx="8" ry="12" fill="${l.skin}"/>
${l.earrings ? '<circle cx="61" cy="154" r="3.4" fill="#f4efe2"/><circle cx="159" cy="154" r="3.4" fill="#f4efe2"/>' : ''}
<ellipse cx="110" cy="130" rx="48" ry="56" fill="${l.skin}"/>
<path d="M110 74a48 56 0 0 1 0 112c34-8 52-40 44-82-6-20-22-30-44-30Z" fill="#000" opacity=".07"/>
${beard}
${hairFront(l)}
${e.blush ? '<ellipse cx="82" cy="152" rx="8" ry="5" fill="#e77" opacity=".28"/><ellipse cx="138" cy="152" rx="8" ry="5" fill="#e77" opacity=".28"/>' : ''}
${eye(90)}${eye(130)}${glasses}
${brow(78, 102)}${brow(118, 142, dyr)}
<path d="M110 134q-6 14 3 18" stroke="#000" stroke-opacity=".22" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="${e.mouth}" fill="${emo === 'smile' || emo === 'surprised' ? '#7a2e2e' : 'none'}" stroke="#7a2e2e" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
${emo === 'smile' ? '<path d="M96 166Q110 174 124 166" fill="#fff" opacity=".9"/>' : ''}
${e.extra ?? ''}
<defs><linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient></defs>
</svg>`;
  portraitCache.set(key, svg);
  return svg;
}
export const hasPortrait = (id: string) => id in LOOKS;
export const portraitIds = Object.keys(LOOKS);

/* =====================================================================
 *  SCENE (sfondi 1200×700, ritagliati con "slice")
 * ===================================================================== */
export type SceneArt = 'libreria' | 'libreria-cool' | 'libreria-noon' | 'scrivania' | 'supermercato' | 'bacheca' | 'telefono' | 'valle' | 'municipio' | 'piazza' | 'piazza-sera' | 'cucina' | 'sala';
export const sceneKinds: SceneArt[] = ['libreria', 'libreria-cool', 'libreria-noon', 'scrivania', 'supermercato', 'bacheca', 'telefono', 'valle', 'municipio', 'piazza', 'piazza-sera', 'cucina', 'sala'];

const BOOKS = ['#8c3b2f', '#c0873f', '#2f5d6b', '#56734a', '#7a4f7d', '#d9c7a0', '#3a4468', '#a85a3a', '#b8a06a'];
function shelf(x: number, y: number, w: number, h: number, r: () => number, wood: string, back: string, dim: number): string {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${wood}"/>`;
  const rows = 4, rh = h / rows;
  for (let row = 0; row < rows; row++) {
    const yy = y + row * rh;
    s += `<rect x="${x + 6}" y="${f(yy + 6)}" width="${w - 12}" height="${f(rh - 8)}" fill="${back}"/>`;
    let bx = x + 10;
    while (bx < x + w - 26) {
      const bw = 11 + r() * 17, bh = rh * (0.52 + r() * 0.36);
      const col = BOOKS[Math.floor(r() * BOOKS.length)];
      s += `<rect x="${f(bx)}" y="${f(yy + rh - 7 - bh)}" width="${f(bw)}" height="${f(bh)}" rx="1.5" fill="${col}"/><rect x="${f(bx)}" y="${f(yy + rh - 7 - bh + 6)}" width="${f(bw)}" height="2.5" fill="#fff" opacity=".22"/>`;
      bx += bw + 1.2;
      if (r() < 0.07) bx += 20;
    }
    s += `<rect x="${x}" y="${f(yy + rh - 4)}" width="${w}" height="6" fill="${wood}"/><rect x="${x}" y="${f(yy + rh + 1)}" width="${w}" height="3" fill="#000" opacity=".25"/>`;
  }
  return s + (dim ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#000" opacity="${dim}"/>` : '');
}
interface LibPal { wallA: string; wallB: string; wood: string; back: string; floor: string; light: string; la: number; lamp: string; counter: string; top: string; over: string; sky: [string, string] }
const LIB: Record<string, LibPal> = {
  'libreria': { wallA: '#cfa578', wallB: '#9a6e4a', wood: '#4e3322', back: '#33210f', floor: '#6b4a32', light: '#e3eef3', la: 0.34, lamp: '#ffcf7a', counter: '#3d281b', top: '#7a5234', over: 'rgba(40,55,95,.16)', sky: ['#dfe9ee', '#aebfc9'] },
  'libreria-cool': { wallA: '#4a6b7f', wallB: '#2c4555', wood: '#2b2f3f', back: '#1c202c', floor: '#2f3442', light: '#a8cfdf', la: 0.3, lamp: '#ffd9a0', counter: '#222637', top: '#3d4560', over: 'rgba(15,35,80,.3)', sky: ['#8fb4c6', '#5d7f93'] },
  'libreria-noon': { wallA: '#ecd0a0', wallB: '#c99f6c', wood: '#6a4a33', back: '#4d3322', floor: '#8a6444', light: '#fff4cf', la: 0.55, lamp: '#ffe9b0', counter: '#5a3c28', top: '#93683f', over: 'rgba(255,220,140,.1)', sky: ['#fff6dc', '#dfe9ee'] },
};
function libreria(kind: string): string {
  const p = LIB[kind]; const r = rng(7);
  const mount = '<path d="M0 230 190 110l140 90 120-70 170 120H0Z" fill="#6d8292"/><path d="M0 260 150 170l110 60 150-80 140 110H0Z" fill="#4e6575"/>';
  return `<svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="lw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.wallA}"/><stop offset="1" stop-color="${p.wallB}"/></linearGradient>
<linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky[0]}"/><stop offset="1" stop-color="${p.sky[1]}"/></linearGradient>
<linearGradient id="lb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.light}" stop-opacity="${p.la}"/><stop offset="1" stop-color="${p.light}" stop-opacity="0"/></linearGradient>
<radialGradient id="lv" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
<radialGradient id="lh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${p.lamp}" stop-opacity=".75"/><stop offset="1" stop-color="${p.lamp}" stop-opacity="0"/></radialGradient>
<clipPath id="lc"><rect x="448" y="108" width="304" height="290" rx="6"/></clipPath>
</defs>
<rect width="1200" height="700" fill="url(#lw)"/>
${shelf(30, 60, 340, 440, r, p.wood, p.back, 0.12)}${shelf(830, 60, 340, 440, r, p.wood, p.back, 0.12)}
<rect x="430" y="90" width="340" height="326" rx="10" fill="${p.wood}"/>
<g clip-path="url(#lc)"><rect x="448" y="108" width="304" height="290" fill="url(#lg)"/><g transform="translate(448 150) scale(.9)">${mount}</g>
<ellipse cx="560" cy="300" rx="190" ry="42" fill="#fff" opacity=".5"/><ellipse cx="660" cy="340" rx="200" ry="36" fill="#fff" opacity=".55"/><ellipse cx="500" cy="372" rx="240" ry="30" fill="#fff" opacity=".6"/>
<path d="M448 352Q560 332 752 366V398H448Z" fill="#7d97a6" opacity=".7"/></g>
<path d="M600 108v290M448 252h304" stroke="${p.wood}" stroke-width="8"/>
<polygon points="448,398 752,398 980,640 300,640" fill="url(#lb)"/>
<rect y="500" width="1200" height="200" fill="${p.floor}"/>
<g stroke="#000" stroke-opacity=".18" stroke-width="2">${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 150 - 40} 500L${i * 200 - 300} 700"/>`).join('')}</g>
<g transform="translate(150 20)"><path d="M0 0v90" stroke="#222" stroke-width="3"/><path d="M-34 90h68l-14-36h-40Z" fill="#2a2a2a"/><ellipse cx="0" cy="96" rx="80" ry="56" fill="url(#lh)"/><ellipse cx="0" cy="94" rx="22" ry="5" fill="${p.lamp}"/></g>
<g transform="translate(1050 20)"><path d="M0 0v90" stroke="#222" stroke-width="3"/><path d="M-34 90h68l-14-36h-40Z" fill="#2a2a2a"/><ellipse cx="0" cy="96" rx="80" ry="56" fill="url(#lh)"/><ellipse cx="0" cy="94" rx="22" ry="5" fill="${p.lamp}"/></g>
<path d="M0 548H1200V700H0Z" fill="${p.counter}"/><rect y="528" width="1200" height="28" fill="${p.top}"/><rect y="552" width="1200" height="5" fill="#000" opacity=".3"/>
<g transform="translate(120 440)"><path d="M0 88h70l-8-34H8Z" fill="#6d4a33"/><path d="M35 54c-30-10-38-40-10-52 6 20 20 22 34 20-6 14-8 24-24 32Z" fill="#4e7d4a"/><path d="M35 54c24-14 34-36 22-52" stroke="#3b6a3b" stroke-width="3" fill="none"/></g>
<g transform="translate(980 470)"><rect width="104" height="14" fill="#8c3b2f"/><rect y="14" width="112" height="14" fill="#2f5d6b"/><rect y="28" width="100" height="14" fill="#c0873f"/><rect width="104" height="3" y="0" fill="#fff" opacity=".2"/></g>
<g transform="translate(360 470)"><rect width="52" height="54" rx="8" fill="#e9dfcf"/><ellipse cx="26" cy="4" rx="26" ry="6" fill="#3b2418"/><path d="M52 14q22 2 14 24-4 8-14 6" stroke="#e9dfcf" stroke-width="7" fill="none"/><path class="steam" d="M18 -8q-8-12 0-22M32 -8q-8-12 0-22" stroke="#fff" stroke-opacity=".55" stroke-width="4" fill="none" stroke-linecap="round"/></g>
<g transform="translate(756 410) rotate(-7)"><ellipse cx="40" cy="104" rx="110" ry="30" fill="#8fd0ff" opacity=".2" class="glow"/><rect width="78" height="132" rx="13" fill="#12151f"/><rect x="6" y="9" width="66" height="114" rx="8" fill="#a9d9f5" class="screen"/><rect x="14" y="26" width="44" height="12" rx="6" fill="#fff" opacity=".85"/><rect x="22" y="46" width="44" height="12" rx="6" fill="#fff" opacity=".7"/><rect x="14" y="66" width="48" height="12" rx="6" fill="#fff" opacity=".85"/></g>
<rect width="1200" height="700" fill="${p.over}"/><rect width="1200" height="700" fill="url(#lv)"/></svg>`;
}

function scrivania(): string {
  const r = rng(11);
  const blurShelf = Array.from({ length: 22 }, (_, i) => `<rect x="${40 + i * 52}" y="${60 + (i % 3) * 8}" width="${22 + r() * 18}" height="${90 + r() * 60}" fill="${BOOKS[i % BOOKS.length]}" opacity=".22"/>`).join('');
  return `<svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs><linearGradient id="sw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b4552"/><stop offset="1" stop-color="#16222c"/></linearGradient>
<radialGradient id="sg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#9fd8ff" stop-opacity=".55"/><stop offset="1" stop-color="#9fd8ff" stop-opacity="0"/></radialGradient>
<radialGradient id="sl" cx=".3" cy=".1" r=".9"><stop offset="0" stop-color="#ffd9a0" stop-opacity=".32"/><stop offset="1" stop-color="#ffd9a0" stop-opacity="0"/></radialGradient>
<radialGradient id="sv" cx=".5" cy=".5" r=".75"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient></defs>
<rect width="1200" height="700" fill="url(#sw)"/>${blurShelf}<rect width="1200" height="700" fill="url(#sl)"/>
<ellipse cx="600" cy="330" rx="420" ry="300" fill="url(#sg)"/>
<rect x="360" y="110" width="480" height="310" rx="16" fill="#0d1117"/><rect x="376" y="126" width="448" height="270" rx="6" fill="#f2f6f8"/>
<rect x="376" y="126" width="448" height="30" rx="6" fill="#d4dde3"/><circle cx="394" cy="141" r="5" fill="#e87"/><circle cx="412" cy="141" r="5" fill="#eb7"/><circle cx="430" cy="141" r="5" fill="#7c8"/><rect x="460" y="132" width="250" height="18" rx="9" fill="#fff"/>
<rect x="392" y="172" width="150" height="100" rx="6" fill="#cfd8dd"/><rect x="556" y="172" width="250" height="14" rx="4" fill="#3d5a6a"/><rect x="556" y="196" width="240" height="8" rx="4" fill="#9aa9b3"/><rect x="556" y="212" width="220" height="8" rx="4" fill="#9aa9b3"/><rect x="556" y="228" width="236" height="8" rx="4" fill="#9aa9b3"/>
<rect x="392" y="288" width="414" height="12" rx="4" fill="#9aa9b3"/><rect x="392" y="310" width="360" height="8" rx="4" fill="#bcc8cf"/><rect x="392" y="326" width="390" height="8" rx="4" fill="#bcc8cf"/><rect x="392" y="342" width="300" height="8" rx="4" fill="#bcc8cf"/>
<circle cx="650" cy="258" r="46" fill="#cfe9ff" fill-opacity=".35" stroke="#b5532f" stroke-width="9"/><path d="M684 292l46 46" stroke="#b5532f" stroke-width="13" stroke-linecap="round"/>
<path d="M560 420h80l20 50H540Z" fill="#1b2430"/><rect x="480" y="470" width="240" height="14" rx="6" fill="#1b2430"/>
<rect y="500" width="1200" height="200" fill="#5a3c28"/><rect y="500" width="1200" height="14" fill="#7d5636"/>
<rect x="440" y="528" width="320" height="34" rx="8" fill="#26313c"/><g fill="#38465a">${Array.from({ length: 12 }, (_, i) => `<rect x="${452 + i * 25}" y="535" width="20" height="9" rx="2"/>`).join('')}</g>
<g transform="translate(120 440)"><path d="M0 110h110" stroke="#111" stroke-width="10"/><path d="M40 110L70 20" stroke="#222" stroke-width="7"/><path d="M70 20l50 -6" stroke="#222" stroke-width="7"/><path d="M104 -4l40 10-14 30-40-12Z" fill="#2a2a2a"/><ellipse cx="146" cy="60" rx="70" ry="50" fill="#ffd9a0" opacity=".18"/></g>
<g transform="translate(920 450)"><rect width="56" height="58" rx="8" fill="#e9dfcf"/><ellipse cx="28" cy="4" rx="28" ry="6" fill="#3b2418"/><path d="M56 14q22 2 14 24-4 8-14 6" stroke="#e9dfcf" stroke-width="7" fill="none"/><path class="steam" d="M20-8q-8-12 0-22M34-8q-8-12 0-22" stroke="#fff" stroke-opacity=".5" stroke-width="4" fill="none" stroke-linecap="round"/></g>
<g transform="translate(790 580) rotate(-6)"><rect width="300" height="110" rx="6" fill="#f1e8d5"/><path d="M150 0v110" stroke="#c9bd9f" stroke-width="3"/><g stroke="#b4a98d" stroke-width="3">${Array.from({ length: 6 }, (_, i) => `<path d="M16 ${22 + i * 14}h120M164 ${22 + i * 14}h120"/>`).join('')}</g></g>
<rect x="260" y="590" width="70" height="70" fill="#f7e08a" transform="rotate(-8 295 625)"/><rect x="340" y="610" width="64" height="64" fill="#9fd1b8" transform="rotate(6 372 642)"/>
<rect width="1200" height="700" fill="url(#sv)"/></svg>`;
}

function supermercato(): string {
  const bottle = (x: number, y: number) => `<rect x="${x}" y="${y}" width="22" height="58" rx="7" fill="#9fd0f0" opacity=".9"/><rect x="${x + 6}" y="${y - 8}" width="10" height="10" rx="2" fill="#2f6b9a"/><rect x="${x + 2}" y="${y + 20}" width="18" height="18" fill="#fff" opacity=".8"/>`;
  let bays = '';
  for (let b = 0; b < 3; b++) {
    const x0 = 60 + b * 380;
    bays += `<rect x="${x0}" y="130" width="340" height="330" fill="#b8c2cc"/><rect x="${x0 + 8}" y="138" width="324" height="314" fill="#e8edf1"/>`;
    for (let row = 0; row < 3; row++) {
      bays += `<rect x="${x0 + 8}" y="${200 + row * 100}" width="324" height="8" fill="#8793a0"/>`;
      for (let i = 0; i < 12; i++) bays += bottle(x0 + 18 + i * 26, 142 + row * 100);
    }
  }
  const pack = (x: number, y: number) => `<rect x="${x}" y="${y}" width="110" height="64" rx="6" fill="#cfe6f6"/><rect x="${x}" y="${y}" width="110" height="10" rx="4" fill="#2f6b9a"/><g fill="#8fc4ea">${Array.from({ length: 6 }, (_, i) => `<rect x="${x + 8 + i * 16}" y="${y + 18}" width="12" height="40" rx="5"/>`).join('')}</g>`;
  return `<svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs><linearGradient id="mw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9eef0"/><stop offset="1" stop-color="#c9d3d8"/></linearGradient><radialGradient id="mv" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient></defs>
<rect width="1200" height="700" fill="url(#mw)"/>
<g fill="#fff">${Array.from({ length: 4 }, (_, i) => `<rect x="${110 + i * 280}" y="20" width="200" height="14" rx="7"/><rect x="${110 + i * 280}" y="34" width="200" height="50" fill="#fff" opacity=".18"/>`).join('')}</g>
<rect x="470" y="60" width="260" height="46" rx="8" fill="#2f6b9a"/><text x="600" y="94" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="30" fill="#fff" letter-spacing="6">ACQUA</text><path d="M520 60v-30M680 60v-30" stroke="#555" stroke-width="3"/>
${bays}
<rect y="470" width="1200" height="230" fill="#aab5bd"/><g stroke="#8d9aa4" stroke-width="3">${Array.from({ length: 10 }, (_, i) => `<path d="M${i * 130} 470L${i * 190 - 300} 700"/>`).join('')}<path d="M0 560H1200M0 640H1200"/></g>
${pack(420, 520)}${pack(540, 520)}${pack(660, 520)}${pack(480, 456)}${pack(600, 456)}${pack(540, 392)}
<g transform="translate(60 520)"><path d="M0 0h150l-20 90H20Z" fill="#6b7782"/><g stroke="#4b5560" stroke-width="3"><path d="M30 0l8 90M60 0l4 90M90 0v90M120 0l-4 90"/></g><path d="M-10 -20L0 0" stroke="#4b5560" stroke-width="6"/><circle cx="34" cy="108" r="12" fill="#333"/><circle cx="124" cy="108" r="12" fill="#333"/></g>
<rect width="1200" height="700" fill="url(#mv)"/></svg>`;
}

function bacheca(): string {
  const r = rng(5);
  const specks = Array.from({ length: 260 }, () => `<circle cx="${f(r() * 1200)}" cy="${f(r() * 700)}" r="${f(1 + r() * 3)}" fill="${r() < 0.5 ? '#8a5f34' : '#c79a62'}" opacity=".5"/>`).join('');
  const paper = (x: number, y: number, w: number, h: number, rot: number, tint: string, lines = 5) => `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><rect x="${x + 5}" y="${y + 6}" width="${w}" height="${h}" fill="#000" opacity=".25"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${tint}"/>${Array.from({ length: lines }, (_, i) => `<rect x="${x + 12}" y="${y + 18 + i * 14}" width="${w - 24 - (i % 3) * 18}" height="5" rx="2" fill="#3b3a38" opacity=".45"/>`).join('')}<circle cx="${x + w / 2}" cy="${y + 8}" r="6" fill="#d63b3b"/><circle cx="${x + w / 2 - 2}" cy="${y + 6}" r="2" fill="#fff" opacity=".6"/></g>`;
  return `<svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs><radialGradient id="bv" cx=".5" cy=".5" r=".75"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient></defs>
<rect width="1200" height="700" fill="#b4834f"/>${specks}
<rect x="14" y="14" width="1172" height="672" fill="none" stroke="#5a3b1e" stroke-width="26"/>
<path d="M240 160L560 120 880 200 360 350 760 460" stroke="#c23b3b" stroke-width="3" fill="none" opacity=".85"/>
${paper(150, 110, 190, 130, -4, '#f4ead4')}${paper(470, 90, 200, 120, 3, '#e9e2c6')}${paper(790, 150, 210, 140, -3, '#f4ead4', 6)}${paper(260, 300, 200, 130, 4, '#eadfc3')}${paper(660, 400, 220, 140, -5, '#f4ead4', 6)}${paper(960, 380, 170, 120, 5, '#dfe7d8', 4)}${paper(80, 470, 180, 110, -2, '#f2e4c9', 4)}
<rect width="1200" height="700" fill="url(#bv)"/></svg>`;
}

function telefono(): string {
  return `<svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs><linearGradient id="tw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2740"/><stop offset="1" stop-color="#0f1624"/></linearGradient>
<radialGradient id="tl" cx=".72" cy=".05" r=".8"><stop offset="0" stop-color="#ffd9a0" stop-opacity=".5"/><stop offset="1" stop-color="#ffd9a0" stop-opacity="0"/></radialGradient>
<radialGradient id="tv" cx=".5" cy=".5" r=".75"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".65"/></radialGradient></defs>
<rect width="1200" height="700" fill="url(#tw)"/><polygon points="840,60 1000,60 1140,640 620,640" fill="url(#tl)"/>
<g transform="translate(850 10)"><path d="M0 0h140" stroke="#222" stroke-width="8"/><path d="M70 0v50" stroke="#222" stroke-width="5"/><path d="M20 50h100l-16 44H36Z" fill="#2a2a2a"/></g>
<rect y="500" width="1200" height="200" fill="#4a3022"/><rect y="500" width="1200" height="10" fill="#6d4a33"/>
<g transform="translate(130 560) rotate(-5)"><rect width="190" height="120" rx="4" fill="#efe6d3"/><g stroke="#b3a88e" stroke-width="3">${Array.from({ length: 6 }, (_, i) => `<path d="M14 ${24 + i * 15}h160"/>`).join('')}</g></g>
<g transform="translate(980 540)"><rect width="56" height="58" rx="8" fill="#e9dfcf"/><ellipse cx="28" cy="4" rx="28" ry="6" fill="#3b2418"/><path d="M56 14q22 2 14 24-4 8-14 6" stroke="#e9dfcf" stroke-width="7" fill="none"/><path class="steam" d="M20-8q-8-12 0-22M34-8q-8-12 0-22" stroke="#fff" stroke-opacity=".45" stroke-width="4" fill="none" stroke-linecap="round"/></g>
<g transform="translate(360 600)" fill="none" stroke="#c9b27a" stroke-width="5"><circle cx="20" cy="20" r="20"/><circle cx="76" cy="20" r="20"/><path d="M40 20h16"/></g>
<rect width="1200" height="700" fill="url(#tv)"/></svg>`;
}

function valle(): string {
  const r = rng(3);
  const stars = Array.from({ length: 50 }, () => `<circle cx="${f(r() * 1200)}" cy="${f(r() * 260)}" r="${f(0.6 + r() * 1.6)}" fill="#fff" opacity="${f(0.3 + r() * 0.6)}"/>`).join('');
  const houses = Array.from({ length: 14 }, (_, i) => {
    const x = 60 + i * 78 + r() * 20, w = 44 + r() * 26, h = 40 + r() * 36, y = 520 - h;
    const lit = r() < 0.55;
    return `<g><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="#1a2238"/><path d="M${f(x - 4)} ${f(y)}l${f(w / 2 + 4)} -24 ${f(w / 2 + 4)} 24Z" fill="#232c46"/>${lit ? `<rect x="${f(x + 8)}" y="${f(y + 12)}" width="10" height="12" fill="#ffcf7a"/>` : ''}${lit && r() < 0.5 ? `<rect x="${f(x + w - 18)}" y="${f(y + 12)}" width="10" height="12" fill="#ffcf7a"/>` : ''}</g>`;
  }).join('');
  return `<svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs><linearGradient id="vs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#141b3a"/><stop offset=".55" stop-color="#3f4f7c"/><stop offset="1" stop-color="#e9a77d"/></linearGradient>
<radialGradient id="vm" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff6d6" stop-opacity=".9"/><stop offset="1" stop-color="#fff6d6" stop-opacity="0"/></radialGradient>
<radialGradient id="vv" cx=".5" cy=".5" r=".78"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient></defs>
<rect width="1200" height="700" fill="url(#vs)"/>${stars}
<circle cx="930" cy="150" r="120" fill="url(#vm)"/><circle cx="930" cy="150" r="42" fill="#fff6d6"/>
<path d="M0 420 160 250l120 110 150-170 160 190 120-110 170 160 130-120 190 170v320H0Z" fill="#2b3556"/>
<path d="M0 470 200 330l140 90 180-130 150 120 160-80 200 130 170-100v270H0Z" fill="#1f2846"/>
<ellipse cx="300" cy="500" rx="420" ry="34" fill="#cfd9ee" opacity=".22"/><ellipse cx="900" cy="520" rx="380" ry="30" fill="#cfd9ee" opacity=".2"/>
<rect y="520" width="1200" height="180" fill="#121a30"/>${houses}
<path d="M0 600Q300 560 620 600T1200 590V700H0Z" fill="#0c1326"/><path d="M0 640Q320 612 640 636T1200 630" stroke="#6f86b8" stroke-opacity=".5" stroke-width="3" fill="none"/>
<g fill="#0a1020">${Array.from({ length: 9 }, (_, i) => `<path d="M${40 + i * 140} 700l20-110 20 110Z"/><path d="M${52 + i * 140} 640l8-70 8 70Z"/>`).join('')}</g>
<rect width="1200" height="700" fill="url(#vv)"/></svg>`;
}

const sceneCache = new Map<string, string>();
export function sceneSvg(kind: SceneArt | string): string {
  const k = (sceneKinds as string[]).includes(kind) ? kind : 'libreria';
  let s = sceneCache.get(k);
  if (!s) {
    s = k.startsWith('libreria') ? libreria(k) : k === 'scrivania' ? scrivania() : k === 'supermercato' ? supermercato() : k === 'bacheca' ? bacheca() : k === 'telefono' ? telefono() : k === 'municipio' ? municipio() : k === 'piazza' ? piazza() : k === 'piazza-sera' ? piazza(true) : k === 'cucina' ? cucina() : k === 'sala' ? sala() : valle();
    sceneCache.set(k, s);
  }
  return s;
}
/** Sfondo predefinito di un'attività, se la scena non ne indica uno. */
export const actScene = (kind: string): SceneArt => (kind === 'inspect' ? 'telefono' : kind === 'factcheck' ? 'scrivania' : kind === 'timeline' ? 'bacheca' : 'bacheca');

/* =====================================================================
 *  Illustrazioni delle prove (quaderno)
 * ===================================================================== */
const EV_KIND: Record<string, string> = {
  ev_catena: 'chat', ev_ordinanza: 'doc', ev_controlli: 'water', ev_voce2019: 'news', ev_post_fb: 'social', ev_filigrana: 'mark', ev_blog: 'blog',
  ev_sms_rimborso: 'sms', ev_mail_prefettura: 'mail', ev_dominio_recente: 'domain',
  ev_foto_autobotte: 'photo', ev_foto_2021: 'news', ev_inserzioni_rocco: 'ad',
  ev_versioni_catena: 'versions', ev_post_cancellato: 'deleted', ev_destinatari_sms: 'people',
  ev_audio_sindaco: 'audio', ev_smentita_sindaco: 'agenda', ev_video_consiglio: 'video', ev_rilevatore: 'detector',
  ev_telefonata_elio: 'call', ev_iban_azienda: 'bank',
  ev_irene_bozza: 'draft', ev_comunicato_lavori: 'doc', ev_nicola_ammette: 'talk', ev_rocco_nessun_legame: 'check',
};
export function evidenceArt(id: string): string {
  const k = EV_KIND[id] ?? 'doc';
  const frame = (inner: string, bg = '#e9dfc8') => `<svg class="ev-art" viewBox="0 0 160 110" aria-hidden="true"><rect width="160" height="110" fill="${bg}"/>${inner}</svg>`;
  switch (k) {
    case 'chat': return frame('<rect x="14" y="14" width="86" height="30" rx="12" fill="#fff"/><rect x="60" y="52" width="86" height="26" rx="12" fill="#cfe8d5"/><rect x="14" y="84" width="70" height="16" rx="8" fill="#fff"/><g fill="#b5532f"><rect x="24" y="24" width="50" height="5" rx="2"/><rect x="24" y="33" width="34" height="5" rx="2"/></g><path d="M118 20l8 14h-16Z" fill="#d6492f"/><text x="118" y="32" text-anchor="middle" font-size="9" fill="#fff" font-weight="700">!</text>', '#dbe7ea');
    case 'doc': return frame('<rect x="34" y="8" width="92" height="96" fill="#fffdf6" stroke="#c9bd9f"/><g fill="#8b8574"><rect x="44" y="20" width="60" height="5" rx="2"/><rect x="44" y="32" width="72" height="4" rx="2"/><rect x="44" y="42" width="66" height="4" rx="2"/><rect x="44" y="52" width="70" height="4" rx="2"/></g><circle cx="100" cy="82" r="14" fill="none" stroke="#b5532f" stroke-width="3"/><text x="100" y="86" text-anchor="middle" font-size="9" fill="#b5532f" font-weight="700">2019</text>');
    case 'water': return frame('<path d="M80 14c18 24 28 36 28 52a28 28 0 1 1-56 0c0-16 10-28 28-52Z" fill="#8fc4ea"/><path d="M66 70q6 10 18 8" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/><path d="M118 90l10 8 18-24" stroke="#2f6b4a" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>', '#e2eef2');
    case 'news': return frame('<rect x="22" y="12" width="116" height="86" fill="#f7f3e8" stroke="#bdb49b"/><rect x="30" y="20" width="100" height="14" fill="#2b2b2b"/><g fill="#8b8574"><rect x="30" y="42" width="46" height="26" fill="#c3c9cc"/><rect x="82" y="42" width="48" height="4" rx="2"/><rect x="82" y="52" width="40" height="4" rx="2"/><rect x="82" y="62" width="48" height="4" rx="2"/><rect x="30" y="76" width="100" height="4" rx="2"/><rect x="30" y="86" width="86" height="4" rx="2"/></g>');
    case 'social': return frame('<rect x="16" y="12" width="128" height="86" rx="10" fill="#fff"/><circle cx="34" cy="30" r="9" fill="#9aa9b3"/><rect x="48" y="24" width="50" height="6" rx="3" fill="#6b7782"/><rect x="26" y="46" width="108" height="22" fill="#d8dfe3"/><path d="M30 86c0-6 8-6 8 0 0-6 8-6 8 0 0 6-8 10-8 10s-8-4-8-10Z" fill="#d6492f"/><text x="64" y="90" font-size="9" fill="#555" font-weight="700">2.300</text><text x="104" y="90" font-size="9" fill="#555">condivisioni</text>', '#e1e8f0');
    case 'mark': return frame('<rect x="14" y="12" width="132" height="86" fill="#f4ead4" stroke="#bdb49b"/><g fill="#8b8574" opacity=".7"><rect x="26" y="26" width="80" height="5" rx="2"/><rect x="26" y="38" width="100" height="5" rx="2"/><rect x="26" y="50" width="90" height="5" rx="2"/></g><rect x="14" y="12" width="40" height="86" fill="#f4ead4"/><text x="144" y="94" text-anchor="end" font-size="8" fill="#b5532f" font-weight="700" opacity=".8">Valdorna Informa</text><circle cx="108" cy="70" r="20" fill="#cfe9ff" fill-opacity=".4" stroke="#b5532f" stroke-width="4"/><path d="M122 84l14 14" stroke="#b5532f" stroke-width="6" stroke-linecap="round"/>');
    case 'blog': return frame('<circle cx="80" cy="42" r="20" fill="#59606b"/><path d="M40 100c0-26 18-38 40-38s40 12 40 38Z" fill="#59606b"/><text x="80" y="52" text-anchor="middle" font-size="26" fill="#e9dfc8" font-weight="700">?</text>', '#d9dce0');

    case 'sms': return frame('<rect x="40" y="6" width="80" height="98" rx="12" fill="#2b3a42"/><rect x="46" y="14" width="68" height="82" rx="6" fill="#f2f6f8"/><rect x="52" y="22" width="48" height="22" rx="8" fill="#cfe8d5"/><rect x="52" y="48" width="56" height="26" rx="8" fill="#fff" stroke="#c9bd9f"/><path d="M58 60h40" stroke="#b5532f" stroke-width="3"/><circle cx="104" cy="22" r="8" fill="#b5532f"/><text x="104" y="26" font-size="11" text-anchor="middle" fill="#fff" font-weight="700">!</text>');
    case 'mail': return frame('<rect x="18" y="22" width="124" height="74" rx="6" fill="#fffdf6" stroke="#c9bd9f"/><path d="M18 26l62 40 62-40" fill="none" stroke="#9a9078" stroke-width="3"/><rect x="104" y="64" width="34" height="22" fill="#b5532f"/><path d="M110 72h22M110 78h14" stroke="#fff" stroke-width="3"/>');
    case 'domain': return frame('<rect x="14" y="30" width="132" height="34" rx="17" fill="#fff" stroke="#9a9078" stroke-width="2"/><rect x="24" y="40" width="14" height="14" rx="3" fill="#b5532f"/><rect x="44" y="42" width="66" height="10" rx="4" fill="#bcc8cf"/><rect x="116" y="42" width="20" height="10" rx="4" fill="#b5532f"/><rect x="40" y="76" width="80" height="22" rx="6" fill="#f3e6b8" stroke="#c9a54d"/><path d="M52 87h56" stroke="#7a6a2f" stroke-width="3"/>', '#e3ecee');
    case 'photo': return frame('<rect x="22" y="12" width="116" height="86" fill="#fff"/><rect x="28" y="18" width="104" height="62" fill="#a9cfe6"/><path d="M28 80l30-30 24 20 22-24 28 34Z" fill="#7d96a6"/><rect x="46" y="52" width="46" height="16" rx="3" fill="#b5532f"/><circle cx="56" cy="70" r="5" fill="#222"/><circle cx="80" cy="70" r="5" fill="#222"/><rect x="28" y="84" width="60" height="6" rx="3" fill="#9a9078"/>', '#e4dcc5');
    case 'ad': return frame('<rect x="20" y="14" width="120" height="82" rx="8" fill="#fff"/><rect x="28" y="22" width="104" height="38" fill="#2f6b7a"/><text x="80" y="46" font-size="14" text-anchor="middle" fill="#f6efe0" font-weight="700">-30%</text><rect x="28" y="66" width="70" height="6" rx="3" fill="#9a9078"/><rect x="28" y="78" width="50" height="6" rx="3" fill="#bcc8cf"/><rect x="104" y="72" width="28" height="16" rx="4" fill="#e8b45c"/>');
    case 'versions': return frame('<g fill="#fff" stroke="#c9bd9f"><rect x="14" y="14" width="56" height="40" rx="6"/><rect x="52" y="34" width="56" height="40" rx="6"/><rect x="90" y="56" width="56" height="40" rx="6"/></g><g fill="#9a9078"><rect x="22" y="24" width="38" height="4" rx="2"/><rect x="22" y="34" width="28" height="4" rx="2"/><rect x="60" y="44" width="38" height="4" rx="2"/><rect x="98" y="66" width="38" height="4" rx="2"/></g><g fill="#b5532f"><rect x="98" y="76" width="38" height="6" rx="2"/><rect x="98" y="86" width="26" height="4" rx="2"/></g>');
    case 'deleted': return frame('<rect x="22" y="12" width="116" height="86" rx="8" fill="#fff" stroke-dasharray="6 5" stroke="#9a9078" stroke-width="3"/><rect x="34" y="26" width="60" height="6" rx="3" fill="#cfd5d9"/><rect x="34" y="40" width="86" height="6" rx="3" fill="#cfd5d9"/><rect x="34" y="54" width="74" height="6" rx="3" fill="#cfd5d9"/><path d="M104 66l16 16M120 66l-16 16" stroke="#b5532f" stroke-width="5" stroke-linecap="round"/>', '#e6e2d8');
    case 'draft': return frame('<rect x="34" y="8" width="92" height="96" fill="#fffdf6" stroke="#c9bd9f"/><rect x="44" y="20" width="60" height="5" rx="2" fill="#8b8574"/><rect x="44" y="32" width="72" height="4" rx="2" fill="#8b8574"/><path d="M44 44h38" stroke="#b5532f" stroke-width="3"/><rect x="44" y="54" width="66" height="4" rx="2" fill="#8b8574"/><path d="M88 78l10 10 20-24" stroke="#2f6b7a" stroke-width="5" fill="none" stroke-linecap="round"/>');
    case 'people': return frame('<g fill="#9aa9b3"><circle cx="40" cy="38" r="12"/><circle cx="80" cy="30" r="12"/><circle cx="120" cy="38" r="12"/><path d="M20 78c0-16 10-24 20-24s20 8 20 24Zm40-8c0-16 10-24 20-24s20 8 20 24Zm40 8c0-16 10-24 20-24s20 8 20 24Z"/></g><path d="M40 90h80" stroke="#b5532f" stroke-width="3" stroke-dasharray="4 4"/>', '#e9e2cf');
    case 'audio': return frame('<rect x="14" y="26" width="132" height="58" rx="12" fill="#fff" stroke="#c9bd9f"/><path d="M24 44v22M32 38v34M40 48v14M48 34v42M56 44v22M64 40v30M72 46v18M80 36v38M88 46v18M96 40v30M104 48v14M112 36v38M120 44v22M128 48v14" stroke="#2f6b7a" stroke-width="4" stroke-linecap="round"/>', '#e3ecee');
    case 'agenda': return frame('<rect x="26" y="10" width="108" height="92" rx="6" fill="#fffdf6" stroke="#c9bd9f"/><rect x="26" y="10" width="108" height="18" fill="#4d7c4f"/><g fill="#8b8574"><rect x="36" y="38" width="30" height="5" rx="2"/><rect x="74" y="38" width="50" height="5" rx="2"/><rect x="36" y="52" width="30" height="5" rx="2"/><rect x="74" y="52" width="40" height="5" rx="2"/><rect x="36" y="66" width="30" height="5" rx="2"/></g><rect x="70" y="62" width="58" height="14" rx="4" fill="#f3e6b8" stroke="#c9a54d"/><path d="M96 90l8 8 16-18" stroke="#2f6b7a" stroke-width="5" fill="none" stroke-linecap="round"/>');
    case 'video': return frame('<rect x="18" y="14" width="124" height="78" rx="8" fill="#10161c"/><rect x="24" y="20" width="112" height="66" fill="#3a4468"/><circle cx="80" cy="46" r="12" fill="#d7a47f"/><path d="M56 86c0-18 10-26 24-26s24 8 24 26Z" fill="#2b3a5c"/>', '#dfe5ea');
    case 'detector': return frame('<circle cx="80" cy="62" r="40" fill="#fff" stroke="#c9bd9f" stroke-width="3"/><path d="M80 62l-24 -4" stroke="#b5532f" stroke-width="5" stroke-linecap="round"/><path d="M48 76a40 40 0 0 1 64 0" fill="none" stroke="#e8b45c" stroke-width="6"/>', '#ece5d2');
    case 'call': return frame('<path d="M44 74c-10-20 4-48 28-56l12 20-12 8c4 10 10 18 20 24l8-10 20 12c-8 24-36 32-50 18-10-4-20-10-26-16Z" fill="#2f6b7a"/><g fill="none" stroke="#e8b45c" stroke-width="5" stroke-linecap="round"><path d="M104 28q16 6 20 22"/><path d="M110 14q28 8 32 40"/></g><rect x="92" y="78" width="54" height="22" rx="6" fill="#fff" stroke="#c9bd9f"/>', '#e3ecee');
    case 'bank': return frame('<path d="M80 14l56 24H24Z" fill="#9aa9b3"/><g fill="#cfd5d9"><rect x="34" y="44" width="14" height="38"/><rect x="62" y="44" width="14" height="38"/><rect x="90" y="44" width="14" height="38"/><rect x="118" y="44" width="14" height="38"/></g><rect x="22" y="86" width="116" height="12" fill="#9aa9b3"/>', '#e9e2cf');
    case 'talk': return frame('<rect x="18" y="16" width="70" height="42" rx="14" fill="#fff" stroke="#c9bd9f"/><rect x="72" y="62" width="70" height="36" rx="14" fill="#cfe8d5"/><g fill="#8b8574"><rect x="30" y="28" width="46" height="5" rx="2"/><rect x="30" y="40" width="34" height="5" rx="2"/><rect x="84" y="72" width="46" height="5" rx="2"/></g>');
    case 'check': return frame('<rect x="26" y="12" width="108" height="86" rx="8" fill="#fffdf6" stroke="#c9bd9f"/><g fill="#8b8574"><rect x="38" y="26" width="64" height="5" rx="2"/><rect x="38" y="42" width="84" height="5" rx="2"/><rect x="38" y="58" width="70" height="5" rx="2"/></g><circle cx="112" cy="76" r="14" fill="#cfe8d5" stroke="#4d7c4f" stroke-width="3"/><path d="M105 76l5 5 9-11" stroke="#4d7c4f" stroke-width="4" fill="none" stroke-linecap="round"/>');
  }
  return frame('');
}
