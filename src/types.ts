export type Skill = 'fonti' | 'dettagli' | 'incertezza' | 'metodo';
export type FlagValue = boolean | number | string;
export type Flags = Record<string, FlagValue>;

export interface Character {
  id: string;
  name: string;
  role: string;
  color: string;
  bio: string;
}

/* ---------- Evidenze e glossario ---------- */
export interface Evidence {
  id: string;
  title: string;
  text: string;
  chapter: number;
  tags: string[]; // persone / temi per la bacheca
  date?: string; // ISO, per la timeline
  dateLabel?: string;
  weak?: boolean; // indizio debole o fuorviante
  why?: string; // «perché è importante», in parole semplici
  source?: string; // da dove arriva la prova nella storia
  fact?: string; // cosa si osserva davvero
  reading?: string; // interpretazione: cosa potrebbe voler dire (e cosa non dimostra)
  links?: string[]; // id di prove collegate (di capitoli precedenti o dello stesso)
  learn?: string; // spiegazione educativa, in parole semplici
}
export interface GlossaryTerm {
  id: string;
  term: string;
  short: string;
  long: string;
  easy?: string; // versione ancora più semplice
  match?: string[]; // parole del testo che diventano toccabili
  example?: string;
}

/* ---------- Nodi narrativi ---------- */
export interface Option {
  text: string;
  to?: string; // etichetta di destinazione
  set?: Flags;
  skill?: Partial<Record<Skill, number>>;
  requiresFlag?: string;
  requiresEvidence?: string;
  lockedHint?: string;
}
export type ChatMsg = { from: string; text: string; me?: boolean; time?: string; note?: string };

export type Node =
  | { t: 'scene'; title: string; place?: string; mood?: 'day' | 'night' | 'warm' | 'cool'; art?: string }
  | { t: 'say'; who: string; text: string; emo?: string }
  | { t: 'chat'; title: string; app?: string; msgs: ChatMsg[] }
  | { t: 'choice'; id: string; prompt?: string; help?: string; options: Option[] }
  | { t: 'activity'; id: string }
  | { t: 'label'; id: string }
  | { t: 'goto'; to: string }
  | { t: 'if'; flag: string; to: string; not?: boolean }
  | { t: 'ifev'; ev: string; to: string; not?: boolean } // salta se la prova è (o non è) nel quaderno
  | { t: 'set'; flags?: Flags; skill?: Partial<Record<Skill, number>> }
  | { t: 'evidence'; id: string }
  | { t: 'learn'; term: string }
  | { t: 'case'; id: string } // sblocca un caso reale nell'archivio
  | { t: 'end'; summary?: string[]; ending?: string; endingTitle?: string };

export interface Chapter {
  id: string;
  n: number;
  title: string;
  subtitle: string;
  goals: string[];
  nodes: Node[];
  activities: Record<string, Activity>;
}

/* ---------- Attività interattive ---------- */
interface ActBase {
  id: string;
  title: string;
  intro: string;
  coach?: string; // una riga di istruzione in modalità Guidami
  hints: [string, string, string]; // lieve, passo-passo, soluzione
  scene?: string; // sfondo dedicato (altrimenti quello predefinito del tipo)
  after?: Flags; // flag impostati al completamento (se tutto ok)
}
export interface Hot {
  title: string;
  why: string;
  easy?: string; // spiegazione ancora più semplice («Spiegamelo in modo più semplice»)
  signal: boolean; // true = segnale rilevante; false = elemento che sembra sospetto ma non prova nulla
  evidence?: string;
}
export type Seg = string | { x: string; h: Hot };
export interface VerdictOption { text: string; ok?: boolean; feedback: string }
export interface InspectAct extends ActBase {
  kind: 'inspect';
  variant: 'chat' | 'email' | 'sms' | 'article' | 'photo' | 'url' | 'audio' | 'call';
  header?: { label: string; value: string; h?: Hot }[];
  art?: string; // markup SVG (foto)
  body: Seg[][]; // paragrafi di segmenti
  need: number; // segnali da trovare per 3a stella
  question: string;
  verdicts: VerdictOption[];
}
export interface Source {
  id: string;
  name: string;
  kind: string; // "Sito ufficiale", "Giornale locale"...
  date: string;
  text: string[];
  who: string;
  when: string;
  proof: string;
  useful: boolean;
  misleading?: boolean;
  note: string;
  evidence?: string;
}
export interface FactAct extends ActBase {
  kind: 'factcheck';
  claim: string;
  sources: Source[];
  question: string;
  verdicts: VerdictOption[];
}
export interface TimelineAct extends ActBase {
  kind: 'timeline';
  prompt: string;
  items: { id: string; text: string; why: string }[]; // in ordine corretto
}
export interface SortAct extends ActBase {
  kind: 'sort';
  prompt: string;
  columns: { id: string; label: string }[];
  items: { id: string; text: string; answer: string; why: string; evidence?: string }[];
}
export type Activity = InspectAct | FactAct | TimelineAct | SortAct;

export interface ActResult { stars: number; hintsUsed: number; ok: boolean }

/* ---------- Casi reali ---------- */
export interface RealCase {
  id: string;
  title: string;
  author: string; // organizzazione o autore della fonte
  date: string;
  url: string;
  context: string;
  facts: string[];
  uncertain: string[];
  lessons: string[];
  category: 'phishing' | 'disinformazione' | 'fuori-contesto' | 'deepfake' | 'truffa';
  checked: string; // data verifica fonte
}

/* ---------- Salvataggio ---------- */
export interface Settings {
  textScale: number; // 1, 1.15, 1.3
  reduceMotion: boolean;
  highContrast: boolean;
  calm: boolean;
  readableFont: boolean;
  guide: boolean; // modalità «Guidami»: indicazioni passo passo
  welcomed: boolean; // la schermata di benvenuto è già stata vista
}
export interface SaveData {
  format: 'verifica-save';
  version: number;
  updated: string;
  chapter: string | null;
  pos: number;
  flags: Flags;
  skills: Record<Skill, number>;
  evidence: string[];
  learned: string[];
  cases: string[];
  results: Record<string, ActResult>;
  done: string[]; // capitoli completati
  endings: string[];
  seen: string[]; // choice id già fatte (per rigiocabilità)
  settings: Settings;
}
export {};
