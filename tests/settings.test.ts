import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it } from 'vitest';
import { exportJson, importJson, migrate } from '../src/engine/save';
import { store } from '../src/engine/state';

describe('Impostazioni', () => {
  beforeEach(() => store.reset());

  it('ogni preferenza si modifica e finisce nel salvataggio esportato/importato', () => {
    store.setSettings({ guide: false, calm: true, reduceMotion: true, highContrast: true, readableFont: true, textScale: 1.3 });
    const back = importJson(exportJson(store.data))!;
    expect(back.settings).toMatchObject({ guide: false, calm: true, reduceMotion: true, highContrast: true, readableFont: true, textScale: 1.3 });
    expect(migrate(JSON.parse(JSON.stringify(back)))!.settings.textScale).toBe(1.3);
  });

  it('il CSS non dà a `.slot` (slot di salvataggio) un posizionamento assoluto', () => {
    // Regressione: i personaggi in scena usavano `.slot` con position:absolute e coprivano i controlli delle Impostazioni.
    const css = readFileSync('src/style.css', 'utf8');
    const rules = css.match(/(^|\})\s*\.slot[^{,]*\{[^}]*\}/g) ?? [];
    expect(rules.length).toBeGreaterThan(0);
    for (const r of rules) expect(r).not.toMatch(/position:\s*absolute/);
  });
});
