import type { Node, Option, Flags, Skill } from '../types';

/** Costruttori di nodi condivisi dai capitoli 2–8 (il capitolo 1 ha i propri, identici nel risultato). */
export const scene = (title: string, place?: string, mood?: 'day' | 'night' | 'warm' | 'cool', art?: string): Node => ({ t: 'scene', title, place, mood, art });
export const say = (who: string, text: string, emo?: string): Node => ({ t: 'say', who, text, emo });
export const label = (id: string): Node => ({ t: 'label', id });
export const go = (to: string): Node => ({ t: 'goto', to });
export const ifFlag = (flag: string, to: string, not = false): Node => ({ t: 'if', flag, to, ...(not ? { not } : {}) });
export const ifEv = (ev: string, to: string, not = false): Node => ({ t: 'ifev', ev, to, ...(not ? { not } : {}) });
export const ev = (id: string): Node => ({ t: 'evidence', id });
export const learn = (term: string): Node => ({ t: 'learn', term });
export const act = (id: string): Node => ({ t: 'activity', id });
export const set = (flags?: Flags, skill?: Partial<Record<Skill, number>>): Node => ({ t: 'set', flags, skill });
export const caso = (id: string): Node => ({ t: 'case', id });
export const choice = (id: string, prompt: string, options: Option[], help?: string): Node => ({ t: 'choice', id, prompt, options, help });
export const chat = (title: string, app: string, msgs: { from: string; text: string; me?: boolean; time?: string }[]): Node => ({ t: 'chat', title, app, msgs });
