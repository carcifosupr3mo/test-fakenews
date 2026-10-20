import { beforeEach, describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { chapters, evidence } from '../src/content';
import { applyOption, labelIndex, optionAvailable, settle } from '../src/engine/runner';
import { migrate } from '../src/engine/save';
import { store } from '../src/engine/state';
import type { Chapter } from '../src/types';

const mem = new Map<string, string>();
(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v),
  removeItem: (k: string) => void mem.delete(k), clear: () => mem.clear(), key: () => null, get length() { return mem.size; },
} as Storage;

beforeEach(() => { store.reset(); });

type Pick = (choiceId: string, n: number) => number;

/** Gioca un capitolo con una strategia di scelta; restituisce il nodo end raggiunto. */
function play(ch: Chapter, pick: Pick, startFlags: Record<string, boolean> = {}) {
  store.setFlags(startFlags);
  const labels = labelIndex(ch);
  let pos = 0, steps = 0;
  while (steps++ < 3000) {
    pos = settle(ch, pos, labels);
    const n = ch.nodes[pos];
    if (!n) throw new Error(`${ch.id}: finito senza nodo end`);
    if (n.t === 'end') return n;
    if (n.t === 'choice') {
      const avail = n.options.filter(optionAvailable);
      expect(avail.length, `${n.id}: nessuna opzione disponibile`).toBeGreaterThan(0);
      const o = avail[Math.min(pick(n.id, avail.length), avail.length - 1)];
      applyOption(o);
      pos = o.to ? labels[o.to] : pos + 1;
    } else pos++;
  }
  throw new Error(`${ch.id}: ciclo infinito`);
}

const strategies: Record<string, Pick> = {
  prima: () => 0,
  ultima: (_id, n) => n - 1,
  centrale: (_id, n) => Math.floor(n / 2),
};

describe.each(chapters)('Capitolo $n: percorsi', (ch: Chapter) => {
  it.each(Object.keys(strategies))('strategia "%s" arriva alla fine', (s) => {
    const end = play(ch, strategies[s]);
    expect(end.t).toBe('end');
  });
  it('una scelta sbagliata non blocca il finale (tutte le opzioni portano alla fine)', () => {
    for (const n of ch.nodes) {
      if (n.t !== 'choice') continue;
      n.options.forEach((_o, i) => {
        store.reset();
        const end = play(ch, (id, k) => (id === n.id ? Math.min(i, k - 1) : 0));
        expect(end.t).toBe('end');
      });
    }
  });
});

describe('Prove', () => {
  const chOf = (id: string) => evidence.find((e) => e.id === id)?.chapter ?? 0;
  it('gli id delle prove sono univoci', () => {
    const ids = evidence.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('nessun capitolo consegna una prova di un capitolo successivo', () => {
    for (const ch of chapters) for (const n of ch.nodes) {
      if (n.t === 'evidence') expect(chOf(n.id), `${ch.id} → ${n.id}`).toBeLessThanOrEqual(ch.n);
    }
    for (const ch of chapters) for (const a of Object.values(ch.activities)) {
      if (a.kind === 'factcheck') for (const s of a.sources) {
        if (s.evidence) expect(chOf(s.evidence), `${a.id} → ${s.evidence}`).toBeLessThanOrEqual(ch.n);
      }
    }
  });
  it('ogni prova ha almeno un punto in cui viene consegnata', () => {
    const given = new Set<string>();
    for (const ch of chapters) {
      for (const n of ch.nodes) if (n.t === 'evidence') given.add(n.id);
      for (const a of Object.values(ch.activities)) if (a.kind === 'factcheck') a.sources.forEach((s) => s.evidence && given.add(s.evidence));
    }
    // le prove del capitolo 1 possono essere consegnate in altri modi (attività con evidence): le escludiamo
    for (const e of evidence.filter((x) => x.chapter >= 2)) expect(given.has(e.id), e.id).toBe(true);
  });
  it('le prove nuove hanno provenienza e nota educativa', () => {
    for (const e of evidence.filter((x) => x.chapter >= 2)) {
      expect(e.source, e.id).toBeTruthy();
      expect(e.learn, e.id).toBeTruthy();
    }
  });
});

describe('Finali e catch-up', () => {
  const ch8 = chapters[chapters.length - 1];
  it('il capitolo 8 giocato da solo (senza prove precedenti) raggiunge ogni finale', () => {
    const wanted: Record<string, [string, number][]> = {
      A: [['c8_final', 0], ['c8_cousin', 0]],
      B: [['c8_final', 1]],
      C: [['c8_final', 2]],
      D: [['c8_final', 0], ['c8_cousin', 1]],
    };
    for (const [code, forced] of Object.entries(wanted)) {
      store.reset();
      const end = play(ch8, (id, k) => Math.min(forced.find(([f]) => f === id)?.[1] ?? 0, k - 1));
      expect(end.t === 'end' && end.ending, code).toBe(code);
    }
  });
  it('anche con le prove mancanti, la scelta calibrata è disponibile', () => {
    store.reset();
    const end = play(ch8, strategies.prima);
    expect(end.t === 'end' && end.ending).toBe('A');
  });
  it('il capitolo 7 da solo consegna le sue prove', () => {
    const ch7 = chapters.find((c) => c.id === 'ch7')!;
    play(ch7, strategies.prima);
    for (const id of ['ev_irene_bozza', 'ev_comunicato_lavori', 'ev_nicola_ammette', 'ev_rocco_nessun_legame']) {
      expect(store.data.evidence).toContain(id);
    }
  });
  it('le prove non si duplicano giocando due volte', () => {
    const ch5 = chapters.find((c) => c.id === 'ch5')!;
    play(ch5, strategies.prima);
    const once = [...store.data.evidence];
    play(ch5, strategies.prima);
    expect(store.data.evidence.length).toBe(once.length);
  });
});

describe('Contenuti offline', () => {
  const dir = join(__dirname, '..', 'src', 'content');
  it('i capitoli contengono solo URL di fantasia (.example)', () => {
    for (const f of readdirSync(dir).filter((x) => /^ch\d+\.ts$|^evidence2?\.ts$/.test(x))) {
      const urls = readFileSync(join(dir, f), 'utf8').match(/https?:\/\/[^\s'"]+/g) ?? [];
      for (const u of urls) expect(new URL(u).hostname, `${f}: ${u}`).toMatch(/\.example$/);
    }
  });
  it('gli indirizzi di fantasia usano il dominio .example', () => {
    for (const f of readdirSync(dir).filter((x) => /^ch\d+\.ts$/.test(x))) {
      const src = readFileSync(join(dir, f), 'utf8');
      for (const m of src.matchAll(/\b[a-z0-9-]+\.(com|org|net|it|eu|info)\b/gi)) {
        expect(m[0], `${f}: ${m[0]}`).toBeNull();
      }
    }
  });
});

describe('Compatibilità salvataggio capitolo 1', () => {
  const fixture = {
    format: 'verifica-save', version: 1, updated: '2026-10-20T10:00:00.000Z',
    chapter: 'ch1', pos: 12,
    flags: { lina_trust: true, c1_first: 'pause' },
    skills: { fonti: 2, metodo: 1, prudenza: 1, empatia: 1 },
    evidence: ['ev_ordinanza', 'ev_controlli', 'ev_filigrana'],
    learned: ['dominio', 'metadati'],
    cases: [],
    results: {},
    done: [],
    endings: [],
    seen: ['c1_first'],
    settings: { textScale: 1 },
  };
  it('un salvataggio del capitolo 1 si carica e prosegue', () => {
    const m = migrate(fixture)!;
    expect(m).not.toBeNull();
    expect(m.evidence).toContain('ev_filigrana');
    expect(m.settings.textScale).toBe(1);
    expect(m.endings).toEqual([]);
  });
  it('dopo il capitolo 1 si può giocare il capitolo 2 senza errori', () => {
    const m = migrate({ ...fixture, done: ['ch1'] })!;
    store.data = m;
    const ch2 = chapters[1];
    const end = play(ch2, strategies.prima);
    expect(end.t).toBe('end');
    expect(store.data.evidence).toContain('ev_filigrana');
  });
});
