/* Strumenti di test — inclusi SOLO nella build "test" (vite build --mode test / npm run dev).
   La build finale rimuove questo modulo: vedi __DEBUG_BUILD__ in main.ts. */
import { chapters } from '../content';
import { evidence } from '../content';
import { clearAll, exportJson } from '../engine/save';
import { labelIndex } from '../engine/runner';
import { store } from '../engine/state';
import { btn, clear, downloadText, h } from './dom';
import { nav } from './nav';
import { getErrors, clearErrors } from '../errors';

const NOTES_KEY = 'verifica.debug.notes';
const readNotes = (): { at: string; where: string; text: string }[] => { try { return JSON.parse(localStorage.getItem(NOTES_KEY) ?? '[]'); } catch { return []; } };

export function installDebug() {
  let panel: HTMLElement | null = null;
  const toggle = () => {
    if (panel) { panel.remove(); panel = null; return; }
    panel = build(); document.body.append(panel);
  };
  document.addEventListener('keydown', (e) => { if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') { e.preventDefault(); toggle(); } });
  if (new URLSearchParams(location.search).has('debug')) toggle();

  function build(): HTMLElement {
    const out = h('pre.dbg-out');
    const log = (s: string) => { out.textContent = s; };
    const chSel = h('select', ...chapters.map((c) => h('option', { value: c.id }, `Cap. ${c.n} — ${c.title}`))) as HTMLSelectElement;
    const lblSel = h('select') as HTMLSelectElement;
    const fillLabels = () => {
      clear(lblSel).append(h('option', { value: '' }, 'Inizio'));
      const ch = chapters.find((c) => c.id === chSel.value)!;
      Object.keys(labelIndex(ch)).forEach((l) => lblSel.append(h('option', { value: l }, l)));
    };
    chSel.onchange = fillLabels; fillLabels();
    const flagIn = h('input', { placeholder: 'flag=valore (es. lina_trust=true)', style: 'width:100%' }) as HTMLInputElement;
    const note = h('textarea', { rows: 3, placeholder: 'Descrivi il problema osservato…', style: 'width:100%' }) as HTMLTextAreaElement;

    return h('aside.dbg', { role: 'dialog', 'aria-label': 'Strumenti di test' },
      h('header', h('strong', 'Strumenti di test'), btn('✕', toggle, 'ghost small')),
      h('p.muted', 'Solo build di test. Ctrl+Maiusc+D per aprire/chiudere.'),
      h('section', h('h4', 'Vai a…'), chSel, lblSel,
        btn('Vai alla scena', () => {
          const ch = chapters.find((c) => c.id === chSel.value)!;
          const idx = lblSel.value ? labelIndex(ch)[lblSel.value] : 0;
          store.data.chapter = ch.id; store.data.pos = idx; store.commit();
          toggle(); nav.play(ch.id);
        }, 'small primary')),
      h('section', h('h4', 'Flag narrativi'), flagIn,
        h('div.row', btn('Imposta', () => {
          const [k, v] = flagIn.value.split('='); if (!k) return;
          const val = v === 'true' ? true : v === 'false' ? false : v !== undefined && v !== '' && !isNaN(Number(v)) ? Number(v) : v ?? true;
          store.setFlags({ [k.trim()]: val }); log(JSON.stringify(store.data.flags, null, 2));
        }, 'small'), btn('Mostra', () => log(JSON.stringify(store.data.flags, null, 2)), 'small'),
          btn('Azzera flag', () => { store.data.flags = {}; store.commit(); log('flag azzerati'); }, 'small'))),
      h('section', h('h4', 'Prove e capitoli'),
        h('div.row', btn('Sblocca tutte le prove', () => { evidence.forEach((e) => store.addEvidence(e.id)); log('prove sbloccate'); }, 'small'),
          btn('Segna capitoli completati', () => { chapters.forEach((c) => { if (!store.data.done.includes(c.id)) store.data.done.push(c.id); }); store.commit(); log('ok'); }, 'small'))),
      h('section', h('h4', 'Segnala un problema'), note,
        h('div.row', btn('Salva nota', () => {
          const n = readNotes(); n.push({ at: new Date().toISOString(), where: `${store.data.chapter}@${store.data.pos}`, text: note.value });
          localStorage.setItem(NOTES_KEY, JSON.stringify(n)); note.value = ''; log(`${n.length} note salvate`);
        }, 'small'), btn('Esporta note (.md)', () => {
          const md = ['# Problemi segnalati in VERIFICA', '', ...readNotes().map((n) => `- **${n.at}** · \`${n.where}\` — ${n.text}`), '', '## Stato', '```json', JSON.stringify({ chapter: store.data.chapter, pos: store.data.pos, flags: store.data.flags, ua: navigator.userAgent, viewport: `${innerWidth}x${innerHeight}` }, null, 2), '```'].join('\n');
          downloadText('verifica-problemi.md', md, 'text/markdown');
        }, 'small'))),
      h('section', h('h4', 'Diagnostica'),
        h('div.row', btn('Errori tecnici', () => log(getErrors().map((e) => `${e.at} ${e.msg}`).join('\n') || 'nessun errore registrato'), 'small'),
          btn('Svuota errori', () => { clearErrors(); log('svuotato'); }, 'small'),
          btn('Esporta salvataggio', () => downloadText('verifica-save-debug.json', exportJson(store.data)), 'small'))),
      h('section', h('h4', 'Zona pericolosa'),
        btn('Azzera tutti i salvataggi', () => { if (confirm('Cancellare tutti i salvataggi?')) { clearAll(); store.reset(); log('azzerato'); nav.home(); } }, 'small danger')),
      out);
  }
}
