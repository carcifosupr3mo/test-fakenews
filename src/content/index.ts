import type { Chapter } from '../types';
import { ch1 } from './ch1';
import { ch2 } from './ch2';
import { ch3 } from './ch3';
import { ch4 } from './ch4';
import { ch5 } from './ch5';
import { ch6 } from './ch6';
import { ch7 } from './ch7';
import { ch8 } from './ch8';

export const chapters: Chapter[] = [ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8];

/** Capitoli pianificati e non ancora giocabili (tutti i capitoli sono ora giocabili). */
export const planned: { n: number; title: string; subtitle: string }[] = [];

export const chapterById = (id: string) => chapters.find((c) => c.id === id);
export { characters, who } from './characters';
export { glossary, termById } from './glossary';
export { evidence, evById } from './evidence';
export { realCases, caseById } from './cases';
export { dailyCases } from './daily';
