import type { ActResult, Flags, Settings, SaveData, Skill } from '../types';
import { defaultSave, loadAuto, saveAuto } from './save';

type Listener = () => void;

class Store {
  data: SaveData = loadAuto() ?? defaultSave();
  private ls = new Set<Listener>();

  subscribe(l: Listener) { this.ls.add(l); return () => this.ls.delete(l); }
  commit() { saveAuto(this.data); this.ls.forEach((l) => l()); }

  replace(d: SaveData) { this.data = d; this.commit(); }
  reset() { this.data = defaultSave(); this.commit(); }

  setFlags(f: Flags) { Object.assign(this.data.flags, f); this.commit(); }
  flag(k: string) { return this.data.flags[k]; }
  addSkill(s: Partial<Record<Skill, number>>) {
    for (const [k, v] of Object.entries(s)) this.data.skills[k as Skill] += v ?? 0;
  }
  addEvidence(id: string) { if (!this.data.evidence.includes(id)) this.data.evidence.push(id); this.commit(); }
  learn(id: string) { if (!this.data.learned.includes(id)) this.data.learned.push(id); this.commit(); }
  unlockCase(id: string) { if (!this.data.cases.includes(id)) this.data.cases.push(id); this.commit(); }
  setResult(id: string, r: ActResult) {
    const old = this.data.results[id];
    this.data.results[id] = old ? { ...r, stars: Math.max(old.stars, r.stars) } : r;
    this.commit();
  }
  setSettings(s: Partial<Settings>) { Object.assign(this.data.settings, s); this.commit(); }
  get totalStars() { return Object.values(this.data.results).reduce((a, r) => a + r.stars, 0); }
}
export const store = new Store();
