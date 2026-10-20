import { beforeEach, describe, expect, it } from 'vitest';
import { caseById, chapters, dailyCases, evById, glossary, realCases, termById, who } from '../src/content';
import { labelIndex, settle } from '../src/engine/runner';
import { defaultSave, exportJson, importJson, migrate } from '../src/engine/save';
import { store } from '../src/engine/state';
import { analyzeText } from '../src/ui/lab';
import type { Chapter } from '../src/types';

// localStorage minimale per l'ambiente di test (Node)
const mem = new Map<string, string>();
(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v),
  removeItem: (k: string) => void mem.delete(k), clear: () => mem.clear(), key: () => null, get length() { return mem.size; },
} as Storage;

beforeEach(() => { store.reset(); });

describe.each(chapters)('Capitolo $n: integrità del contenuto', (ch: Chapter) => {
  const labels = labelIndex(ch);
  it('ogni goto/if/choice punta a un’etichetta esistente', () => {
    for (const n of ch.nodes) {
      if (n.t === 'goto' || n.t === 'if') expect(labels, `${n.t} -> ${n.to}`).toHaveProperty(n.to);
      if (n.t === 'choice') n.options.forEach((o) => o.to && expect(labels, `opzione -> ${o.to}`).toHaveProperty(o.to));
    }
  });
  it('le etichette sono univoche', () => {
    const ids = ch.nodes.filter((n) => n.t === 'label').map((n) => (n as { id: string }).id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('personaggi, attività, prove, termini e casi referenziati esistono', () => {
    for (const n of ch.nodes) {
      if (n.t === 'say') expect(who(n.who).id, `personaggio ${n.who}`).toBe(n.who);
      if (n.t === 'activity') expect(ch.activities, n.id).toHaveProperty(n.id);
      if (n.t === 'evidence') expect(evById(n.id), n.id).toBeTruthy();
      if (n.t === 'learn') expect(termById(n.term), n.term).toBeTruthy();
      if (n.t === 'case') expect(caseById(n.id), n.id).toBeTruthy();
    }
  });
  it('termina con un nodo end raggiungibile', () => {
    expect(ch.nodes.some((n) => n.t === 'end')).toBe(true);
  });
  it.each(['forward', 'pause', 'ignore'])('percorso "%s": si arriva alla fine senza errori', (route) => {
    // simula il giocatore: sceglie sempre la prima opzione disponibile (o quella indicata) e completa le attività
    const first = ch.nodes.find((n) => n.t === 'choice' && n.id === 'c1_first');
    let pos = 0, steps = 0;
    const picks: Record<string, number> = { forward: 0, pause: 1, ignore: 2 };
    while (steps++ < 2000) {
      pos = settle(ch, pos, labels);
      const n = ch.nodes[pos];
      if (!n || n.t === 'end') break;
      if (n.t === 'choice') {
        const o = n.options[n === first ? picks[route] : 0];
        if (o.set) store.setFlags(o.set);
        pos = o.to ? labels[o.to] : pos + 1;
      } else pos++;
    }
    expect(ch.nodes[pos]?.t).toBe('end');
    expect(steps).toBeLessThan(2000);
  });
  it('ogni attività ha 3 suggerimenti e almeno una risposta corretta', () => {
    for (const a of Object.values(ch.activities)) {
      expect(a.hints.every((x) => x.length > 10), a.id).toBe(true);
      if (a.kind === 'inspect' || a.kind === 'factcheck') expect(a.verdicts.filter((v) => v.ok)).toHaveLength(1);
      if (a.kind === 'factcheck') expect(a.sources.some((s) => s.useful)).toBe(true);
      if (a.kind === 'inspect') {
        const signals = [...(a.header ?? []).filter((x) => x.h?.signal), ...a.body.flat().filter((s) => typeof s !== 'string' && s.h.signal)];
        expect(signals.length, `${a.id} segnali`).toBeGreaterThanOrEqual(a.need);
      }
    }
  });
});

describe('Attività quotidiane', () => {
  it('sono ben formate', () => {
    for (const a of dailyCases) {
      expect(a.hints).toHaveLength(3);
      if (a.kind === 'inspect') {
        expect(a.verdicts.filter((v) => v.ok)).toHaveLength(1);
        const signals = [...(a.header ?? []).filter((x) => x.h?.signal), ...a.body.flat().filter((s) => typeof s !== 'string' && s.h.signal)];
        expect(signals.length, a.id).toBeGreaterThanOrEqual(a.need);
      }
      if (a.kind === 'sort') for (const it of a.items) expect(a.columns.map((c) => c.id)).toContain(it.answer);
    }
  });
});

describe('Casi reali', () => {
  it('hanno fonte, URL https e data di verifica', () => {
    for (const c of realCases) {
      expect(c.url).toMatch(/^https:\/\//);
      expect(c.facts.length).toBeGreaterThan(0);
      expect(c.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
  it('il glossario ha id univoci', () => {
    expect(new Set(glossary.map((g) => g.id)).size).toBe(glossary.length);
  });
});

describe('Salvataggi', () => {
  it('esporta e reimporta senza perdite', () => {
    store.setFlags({ lina_trust: true });
    const back = importJson(exportJson(store.data));
    expect(back?.flags.lina_trust).toBe(true);
  });
  it('rifiuta file non validi o da versione futura', () => {
    expect(importJson('non json')).toBeNull();
    expect(migrate({ format: 'altro', version: 1 })).toBeNull();
    expect(migrate({ ...defaultSave(), version: 99 })).toBeNull();
  });
  it('completa i campi mancanti di un vecchio salvataggio', () => {
    const old = { format: 'verifica-save', version: 1, flags: { a: 1 } };
    const m = migrate(old)!;
    expect(m.skills.fonti).toBe(0);
    expect(m.settings.textScale).toBe(1);
  });
});

describe('Laboratorio libero', () => {
  it('riconosce urgenza, dati e dominio sospetto', () => {
    const r = analyzeText('URGENTE: il tuo conto sarà sospeso entro 24 ore. Conferma la password su http://poste-italiane-consegne.top/ritiro');
    const titles = r.findings.map((f) => f.title).join('|');
    expect(titles).toMatch(/Fretta/);
    expect(titles).toMatch(/dati riservati/);
    expect(r.links[0].domain).toBe('poste-italiane-consegne.top');
  });
  it('non segnala nulla su un messaggio ordinario', () => {
    expect(analyzeText('Ci vediamo giovedì alle 15:30 allo studio, grazie.').findings).toHaveLength(0);
  });
  it('mostra il dominio vero dietro i sottodomini ingannevoli', () => {
    const r = analyzeText('vai su https://poste.it.accesso-sicuro.example/login');
    expect(r.links[0].domain).toBe('accesso-sicuro.example');
  });
});

describe('semplicità e tono (revisione UX)', () => {
  const strings = (): string[] => {
    const out: string[] = [];
    const walk = (v: unknown) => { if (typeof v === 'string') out.push(v); else if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') Object.values(v).forEach(walk); };
    chapters.forEach((c) => walk([c.nodes, c.activities]));
    walk(dailyCases);
    return out;
  };
  it('nessuna formula da esame o di colpa nei testi', () => {
    const bad = /risposta (errata|sbagliata)|hai fallito|dovevi saperlo|hai sbagliato tutto|game over/i;
    expect(strings().filter((s) => bad.test(s))).toEqual([]);
  });
  it('le scelte della storia hanno da 2 a 3 opzioni', () => {
    for (const c of chapters) for (const n of c.nodes) if (n.t === 'choice') expect(n.options.length, n.id).toBeGreaterThanOrEqual(2), expect(n.options.length, n.id).toBeLessThanOrEqual(3);
  });
  it('le domande delle attività hanno da 2 a 3 risposte', () => {
    for (const c of chapters) for (const a of Object.values(c.activities)) if (a.kind === 'inspect' || a.kind === 'factcheck') expect(a.verdicts.length, a.id).toBeLessThanOrEqual(3);
  });
  it('ogni scelta importante ha un aiuto contestuale e ogni attività una riga di guida', () => {
    for (const c of chapters) {
      c.nodes.forEach((n) => n.t === 'choice' && n.id === 'c1_first' && expect(n.help, n.id).toBeTruthy());
      Object.values(c.activities).forEach((a) => expect(a.coach, a.id).toBeTruthy());
    }
  });
  it('i termini del glossario con parole toccabili hanno una spiegazione semplice', () => {
    glossary.filter((g) => g.match?.length).forEach((g) => expect(g.easy, g.id).toBeTruthy());
  });
  it('un salvataggio vecchio senza le nuove impostazioni parte con «Guidami» acceso', () => {
    const old = JSON.parse(exportJson(defaultSave()));
    delete old.settings.guide; delete old.settings.welcomed;
    const m = migrate(old)!;
    expect(m.settings.guide).toBe(true);
    expect(m.settings.welcomed).toBe(false);
  });
});
