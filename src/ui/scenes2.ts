/* Scene dei capitoli 2–8 (sfondi 1200×700, "slice"). Stesso linguaggio visivo del capitolo 1:
 * illustrazione piatta, luce calda su ombre blu notte, vignettatura finale. Nessuna risorsa esterna. */

const vig = (id: string) => `<radialGradient id="${id}" cx=".5" cy=".5" r=".75"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>`;
const open = (defs: string) => `<svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>${defs}</defs>`;

/** Ufficio del Comune: finestra sulla valle, scrivania con monitor, bacheca degli avvisi. */
export function municipio(): string {
  const notes = Array.from({ length: 6 }, (_, i) => `<rect x="${822 + (i % 3) * 112}" y="${150 + Math.floor(i / 3) * 120}" width="94" height="104" fill="${['#f7f3e8', '#f3e6b8', '#e4eef2'][i % 3]}" transform="rotate(${(i % 3) * 2 - 2} ${870 + (i % 3) * 112} ${200 + Math.floor(i / 3) * 120})"/><path d="M${832 + (i % 3) * 112} ${172 + Math.floor(i / 3) * 120}h70M${832 + (i % 3) * 112} ${186 + Math.floor(i / 3) * 120}h60M${832 + (i % 3) * 112} ${200 + Math.floor(i / 3) * 120}h66" stroke="#9a9078" stroke-width="3"/>`).join('');
  return open(`<linearGradient id="mw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8cdb0"/><stop offset="1" stop-color="#b7a888"/></linearGradient>
<linearGradient id="ms" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9cfe6"/><stop offset="1" stop-color="#e5eef0"/></linearGradient>
<radialGradient id="ml" cx=".25" cy=".1" r=".8"><stop offset="0" stop-color="#ffe2a8" stop-opacity=".4"/><stop offset="1" stop-color="#ffe2a8" stop-opacity="0"/></radialGradient>${vig('mv')}`) +
`<rect width="1200" height="700" fill="url(#mw)"/><rect y="470" width="1200" height="230" fill="#6e5238"/><rect y="470" width="1200" height="12" fill="#8a6a48"/>
<rect x="90" y="110" width="400" height="300" fill="#5a4630"/><rect x="104" y="124" width="372" height="272" fill="url(#ms)"/>
<path d="M104 330l70-90 60 60 70-110 90 140 82-70v136H104Z" fill="#7d96a6"/><path d="M104 360l90-50 110 50 90-40 82 40v36H104Z" fill="#56734a"/>
<path d="M290 124v272M104 260h372" stroke="#5a4630" stroke-width="10"/>
<rect x="800" y="120" width="360" height="270" rx="8" fill="#b88a5a"/><rect x="812" y="132" width="336" height="246" fill="#d9c7a0"/>${notes}
<g transform="translate(560 80)"><circle r="44" fill="#f7f3e8" stroke="#5a4630" stroke-width="8"/><path d="M0 0V-26M0 0l18 10" stroke="#2b2b2b" stroke-width="5" stroke-linecap="round"/></g>
<g transform="translate(560 -10)"><rect x="-70" y="196" width="140" height="40" rx="6" fill="#4d7c4f"/><path d="M-60 206h120" stroke="#eef1ea" stroke-width="4"/><circle cx="-36" cy="216" r="7" fill="#eef1ea"/></g>
<rect width="1200" height="700" fill="url(#ml)"/>
<rect x="250" y="470" width="700" height="34" rx="8" fill="#3b2a1c"/><rect x="270" y="504" width="40" height="140" fill="#3b2a1c"/><rect x="890" y="504" width="40" height="140" fill="#3b2a1c"/>
<rect x="520" y="340" width="220" height="134" rx="10" fill="#10161c"/><rect x="532" y="352" width="196" height="108" rx="4" fill="#dfe8ec"/><rect x="544" y="366" width="90" height="10" rx="4" fill="#3d5a6a"/><rect x="544" y="386" width="150" height="7" rx="3" fill="#9aa9b3"/><rect x="544" y="402" width="130" height="7" rx="3" fill="#9aa9b3"/><rect x="544" y="418" width="160" height="7" rx="3" fill="#9aa9b3"/><path d="M610 474h40l10 -10h-60Z" fill="#10161c"/>
<g transform="translate(300 420)"><rect width="150" height="50" fill="#f3efe4"/><rect y="-22" width="150" height="22" fill="#e6dfcb" transform="rotate(-2)"/><rect y="-40" width="150" height="18" fill="#f7f3e8" transform="rotate(1.5)"/></g>
<g transform="translate(110 440)"><path d="M20 90h60l-8 -50h-44Z" fill="#a85a3a"/><path d="M50 40c-30-10-34-44-8-52 8 24 18 28 8 52Zm0 0c30-6 38-40 14-52-12 22-18 28-14 52Z" fill="#56834f"/></g>
<rect width="1200" height="700" fill="url(#mv)"/></svg>`;
}

/** Piazza di Valdorna: campanile, fontana, bar con tavolini. `sera` = tramonto. */
export function piazza(sera = false): string {
  const sky = sera ? ['#f2a65a', '#c4566b', '#40305f'] : ['#9cc8e6', '#dcebf0', '#f4efe0'];
  const houses = ([[40, 250, 150, 230, '#d7b48b'], [200, 290, 130, 190, '#c98f6b'], [880, 270, 160, 210, '#d1a77c'], [1050, 310, 140, 170, '#bd8864']] as [number, number, number, number, string][])
    .map(([x, y, w, h, c]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/><path d="M${x - 8} ${y}l${w / 2 + 8} -50 ${w / 2 + 8} 50Z" fill="#8c3b2f"/><g fill="${sera ? '#ffd9a0' : '#5d7d90'}"><rect x="${x + 20}" y="${y + 36}" width="28" height="40" rx="3"/><rect x="${x + w - 48}" y="${y + 36}" width="28" height="40" rx="3"/></g>`).join('');
  return open(`<linearGradient id="ps${sera ? 1 : 0}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset=".6" stop-color="${sky[1]}"/><stop offset="1" stop-color="${sky[2]}"/></linearGradient>${vig('pv' + (sera ? 1 : 0))}`) +
`<rect width="1200" height="700" fill="url(#ps${sera ? 1 : 0})"/>
<path d="M0 330l130-120 110 90 150-150 170 160 140-100 160 150 140-110 200 140v250H0Z" fill="${sera ? '#5b4a78' : '#8aa3b5'}" opacity=".85"/>
${houses}
<g transform="translate(560 120)"><rect width="84" height="300" fill="#cdb48c"/><path d="M-10 0l52 -80 52 80Z" fill="#8c3b2f"/><rect x="26" y="40" width="32" height="56" rx="16" fill="#3b2a1c"/><circle cx="42" cy="170" r="22" fill="#f7f3e8" stroke="#6e5238" stroke-width="5"/><path d="M42 170v-14M42 170l9 6" stroke="#2b2b2b" stroke-width="3" stroke-linecap="round"/></g>
<rect y="500" width="1200" height="200" fill="${sera ? '#6e4a3c' : '#b9a58a'}"/><g stroke="${sera ? '#4a2f28' : '#8e7c63'}" stroke-width="3" opacity=".7">${Array.from({ length: 9 }, (_, i) => `<path d="M0 ${510 + i * 22}H1200"/>`).join('')}${Array.from({ length: 24 }, (_, i) => `<path d="M${i * 52} 510v190"/>`).join('')}</g>
<g transform="translate(380 520)"><ellipse cx="90" cy="96" rx="110" ry="26" fill="#000" opacity=".2"/><path d="M10 80h160l-12 -34h-136Z" fill="#9aa3a8"/><rect x="82" y="-6" width="16" height="52" fill="#9aa3a8"/><ellipse cx="90" cy="-8" rx="46" ry="10" fill="#9aa3a8"/><path d="M60 -14q30 -50 60 0" fill="none" stroke="#9fd8ff" stroke-width="5" opacity=".8"/></g>
<g transform="translate(40 410)"><path d="M0 70h250l-18 -70H18Z" fill="#b5532f"/><path d="M0 70q31 22 62 0t62 0 62 0 64 0" fill="#f1e6d2"/><rect x="14" y="70" width="8" height="150" fill="#3b2a1c"/><rect x="228" y="70" width="8" height="150" fill="#3b2a1c"/><rect x="40" y="170" width="76" height="8" fill="#3b2a1c"/><rect x="60" y="178" width="8" height="42" fill="#3b2a1c"/></g>
<g transform="translate(900 470)"><rect width="230" height="110" fill="#f6efe0" stroke="#6e5238" stroke-width="6"/><rect x="14" y="14" width="94" height="52" fill="#2f6b7a"/><text x="61" y="46" font-size="18" text-anchor="middle" fill="#f6efe0" font-family="Georgia,serif">AcquaPura</text><rect x="122" y="14" width="94" height="52" fill="#e8b45c"/><text x="169" y="46" font-size="22" text-anchor="middle" fill="#2b2b2b" font-family="Georgia,serif" font-weight="700">−30%</text><rect x="14" y="76" width="200" height="8" rx="3" fill="#9a9078"/></g>
<rect width="1200" height="700" fill="url(#pv${sera ? 1 : 0})"/></svg>`;
}

/** Cucina di Elio: tovaglia a quadri, tazza, telefono fisso a parete. */
export function cucina(): string {
  const tiles = Array.from({ length: 11 }, (_, r) => Array.from({ length: 24 }, (_, c) => `<rect x="${c * 52}" y="${r * 30}" width="50" height="28" fill="${(r + c) % 2 ? '#e7dcc2' : '#dfd2b4'}"/>`).join('')).join('');
  return open(`<radialGradient id="cl" cx=".7" cy=".1" r=".9"><stop offset="0" stop-color="#ffd9a0" stop-opacity=".45"/><stop offset="1" stop-color="#ffd9a0" stop-opacity="0"/></radialGradient>${vig('cv')}`) +
`<rect width="1200" height="700" fill="#c9b48e"/><g>${tiles}</g><rect y="330" width="1200" height="370" fill="#a8774a"/><rect y="330" width="1200" height="14" fill="#7d5636"/>
<rect x="110" y="90" width="260" height="220" fill="#6e5238"/><rect x="124" y="104" width="232" height="192" fill="#bcd7e8"/><path d="M240 104v192M124 200h232" stroke="#6e5238" stroke-width="8"/><path d="M124 296l60-50 40 30 50-44 82 64Z" fill="#7d96a6"/>
<g transform="translate(830 120)"><rect width="110" height="170" rx="16" fill="#efe6cf" stroke="#6e5238" stroke-width="6"/><rect x="22" y="22" width="66" height="34" rx="6" fill="#2b3a42"/><text x="55" y="45" font-size="12" text-anchor="middle" fill="#9fd8ff" font-family="monospace">Comune</text><g fill="#6e5238">${Array.from({ length: 12 }, (_, i) => `<circle cx="${30 + (i % 3) * 25}" cy="${78 + Math.floor(i / 3) * 22}" r="7"/>`).join('')}</g><path d="M-6 40q-30 40 0 90" fill="none" stroke="#2b2b2b" stroke-width="7"/><g class="ring" fill="none" stroke="#e8b45c" stroke-width="5" stroke-linecap="round" opacity=".9"><path d="M-30 20q-14 -10 -8 -26"/><path d="M-44 12q-22 -14 -12 -42"/></g></g>
<rect width="1200" height="700" fill="url(#cl)"/>
<g transform="translate(260 440)"><rect width="700" height="48" rx="6" fill="#8c3b2f"/><g fill="#f6efe0" opacity=".9">${Array.from({ length: 14 }, (_, i) => `<rect x="${i * 50}" y="0" width="25" height="48" opacity=".5"/>`).join('')}</g><rect x="40" y="48" width="30" height="170" fill="#4e3322"/><rect x="630" y="48" width="30" height="170" fill="#4e3322"/></g>
<g transform="translate(470 392)"><rect width="64" height="62" rx="9" fill="#e9dfcf"/><ellipse cx="32" cy="4" rx="32" ry="7" fill="#3b2418"/><path d="M64 16q24 2 16 26-4 8-16 6" stroke="#e9dfcf" stroke-width="8" fill="none"/><path class="steam" d="M22 -8q-8 -14 0 -26M40 -8q-8 -14 0 -26" stroke="#fff" stroke-opacity=".5" stroke-width="4" fill="none" stroke-linecap="round"/></g>
<g transform="translate(660 408)"><rect width="150" height="40" rx="6" fill="#f1e8d5"/><rect x="12" y="8" width="126" height="6" rx="3" fill="#b4a98d"/><rect x="12" y="20" width="96" height="6" rx="3" fill="#b4a98d"/></g>
<g transform="translate(120 520)"><ellipse cx="60" cy="150" rx="70" ry="14" fill="#000" opacity=".25"/><rect x="20" y="40" width="80" height="108" rx="8" fill="#5b6b8c"/><rect x="14" y="20" width="92" height="30" rx="10" fill="#6d7ea1"/></g>
<rect width="1200" height="700" fill="url(#cv)"/></svg>`;
}

/** Sala del consiglio comunale: scranno, microfoni, telecamera fissa, sedie. */
export function sala(): string {
  const chairs = Array.from({ length: 3 }, (_, r) => Array.from({ length: 9 }, (_, c) => `<rect x="${150 + c * 110 - r * 8}" y="${470 + r * 64}" width="62" height="48" rx="8" fill="${r % 2 ? '#3a4468' : '#2f3a5c'}"/>`).join('')).join('');
  return open(`<linearGradient id="sa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a3f2b"/><stop offset="1" stop-color="#2f2118"/></linearGradient>
<radialGradient id="sb" cx=".5" cy=".15" r=".7"><stop offset="0" stop-color="#ffe2a8" stop-opacity=".45"/><stop offset="1" stop-color="#ffe2a8" stop-opacity="0"/></radialGradient>${vig('sv2')}`) +
`<rect width="1200" height="700" fill="url(#sa)"/><g stroke="#000" stroke-opacity=".25" stroke-width="4">${Array.from({ length: 14 }, (_, i) => `<path d="M${i * 90} 0v420"/>`).join('')}</g>
<rect x="470" y="40" width="260" height="170" fill="#e8dfc8" stroke="#a88a5a" stroke-width="8"/><path d="M600 70l36 20v40c0 26-16 46-36 56-20-10-36-30-36-56V90Z" fill="#4d7c4f"/><path d="M600 96v70M578 126h44" stroke="#f1ead2" stroke-width="6"/>
<rect width="1200" height="700" fill="url(#sb)"/>
<rect y="420" width="1200" height="280" fill="#3b2a1c"/><rect y="420" width="1200" height="14" fill="#6e4a30"/>
<g transform="translate(240 300)"><rect width="720" height="120" rx="8" fill="#8a5a38"/><rect y="0" width="720" height="14" fill="#a8744a"/><g fill="#1b2430">${[120, 330, 540].map((x) => `<rect x="${x}" y="-34" width="10" height="36"/><ellipse cx="${x + 5}" cy="-38" rx="14" ry="8"/>`).join('')}</g><rect x="330" y="20" width="60" height="26" fill="#f7f3e8"/></g>
<g transform="translate(1010 250)"><rect width="120" height="64" rx="8" fill="#10161c"/><circle cx="60" cy="32" r="18" fill="#222c36"/><circle cx="60" cy="32" r="8" fill="#9fd8ff"/><circle cx="104" cy="12" r="4" fill="#d9534f"/><path d="M60 64v60" stroke="#10161c" stroke-width="10"/></g>
${chairs}
<rect width="1200" height="700" fill="url(#sv2)"/></svg>`;
}
