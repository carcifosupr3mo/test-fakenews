import type { Chapter, Node, Option, Flags } from '../types';
import { store } from './state';

/** Indice delle etichette di un capitolo. */
export function labelIndex(ch: Chapter): Record<string, number> {
  const m: Record<string, number> = {};
  ch.nodes.forEach((n, i) => { if (n.t === 'label') m[n.id] = i; });
  return m;
}

export function optionAvailable(o: Option): boolean {
  if (o.requiresFlag && !store.flag(o.requiresFlag)) return false;
  if (o.requiresEvidence && !store.data.evidence.includes(o.requiresEvidence)) return false;
  return true;
}

/**
 * Esegue i nodi "silenziosi" (label, goto, if, set, evidence, learn, case) a partire da `pos`
 * e restituisce la posizione del prossimo nodo che richiede interazione.
 */
export function settle(ch: Chapter, pos: number, labels = labelIndex(ch)): number {
  let guard = 0;
  while (pos < ch.nodes.length && guard++ < 5000) {
    const n: Node = ch.nodes[pos];
    switch (n.t) {
      case 'label': pos++; break;
      case 'goto': pos = jump(labels, n.to, ch); break;
      case 'if': {
        const v = !!store.flag(n.flag);
        pos = (n.not ? !v : v) ? jump(labels, n.to, ch) : pos + 1;
        break;
      }
      case 'ifev': {
        const v = store.data.evidence.includes(n.ev);
        pos = (n.not ? !v : v) ? jump(labels, n.to, ch) : pos + 1;
        break;
      }
      case 'set':
        if (n.flags) Object.assign(store.data.flags, n.flags);
        if (n.skill) store.addSkill(n.skill);
        store.commit();
        pos++;
        break;
      case 'evidence': store.addEvidence(n.id); pos++; break;
      case 'learn': store.learn(n.term); pos++; break;
      case 'case': store.unlockCase(n.id); pos++; break;
      default: return pos;
    }
  }
  return pos;
}

function jump(labels: Record<string, number>, to: string, ch: Chapter): number {
  if (!(to in labels)) throw new Error(`Etichetta "${to}" inesistente nel capitolo ${ch.id}`);
  return labels[to];
}

export function applyOption(o: Option): void {
  if (o.set) store.setFlags(o.set as Flags);
  if (o.skill) store.addSkill(o.skill);
}
