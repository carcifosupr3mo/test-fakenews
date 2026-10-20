import type { SaveData } from '../types';

export const SAVE_VERSION = 1;
const KEY_AUTO = 'verifica.save.auto';
const KEY_SLOT = (n: number) => `verifica.save.slot${n}`;

export const defaultSave = (): SaveData => ({
  format: 'verifica-save',
  version: SAVE_VERSION,
  updated: new Date().toISOString(),
  chapter: null,
  pos: 0,
  flags: {},
  skills: { fonti: 0, dettagli: 0, incertezza: 0, metodo: 0 },
  evidence: [],
  learned: [],
  cases: [],
  results: {},
  done: [],
  endings: [],
  seen: [],
  settings: { textScale: 1, reduceMotion: false, highContrast: false, calm: false, readableFont: false, guide: true, welcomed: false },
});

/** Porta un salvataggio di qualsiasi versione precedente al formato corrente. */
export function migrate(raw: unknown): SaveData | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (r.format !== 'verifica-save' || typeof r.version !== 'number') return null;
  if (r.version > SAVE_VERSION) return null; // creato da una versione più nuova
  // Qui andranno i passaggi v1 -> v2 ecc. Per ora basta completare i campi mancanti.
  const base = defaultSave();
  const merged = { ...base, ...(r as object) } as SaveData;
  merged.settings = { ...base.settings, ...(r.settings as object) };
  merged.skills = { ...base.skills, ...(r.skills as object) };
  merged.version = SAVE_VERSION;
  return merged;
}

function read(key: string): SaveData | null {
  try {
    const s = localStorage.getItem(key);
    return s ? migrate(JSON.parse(s)) : null;
  } catch {
    return null;
  }
}
function write(key: string, d: SaveData): boolean {
  try {
    d.updated = new Date().toISOString();
    localStorage.setItem(key, JSON.stringify(d));
    return true;
  } catch {
    return false;
  }
}

export const loadAuto = () => read(KEY_AUTO);
export const saveAuto = (d: SaveData) => write(KEY_AUTO, d);
export const loadSlot = (n: number) => read(KEY_SLOT(n));
export const saveSlot = (n: number, d: SaveData) => write(KEY_SLOT(n), structuredClone(d));
export const clearSlot = (n: number) => {
  try { localStorage.removeItem(KEY_SLOT(n)); } catch { /* ignore */ }
};
export const clearAll = () => {
  try {
    for (const k of Object.keys(localStorage)) if (k.startsWith('verifica.save.')) localStorage.removeItem(k);
  } catch { /* ignore */ }
};

export function exportJson(d: SaveData): string {
  return JSON.stringify(d, null, 2);
}
export function importJson(text: string): SaveData | null {
  try { return migrate(JSON.parse(text)); } catch { return null; }
}
