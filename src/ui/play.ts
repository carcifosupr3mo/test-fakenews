import type { Chapter, Node } from '../types';
import { chapterById, chapters, glossary, who } from '../content';
import { applyOption, labelIndex, optionAvailable, settle } from '../engine/runner';
import { store } from '../engine/state';
import { renderActivity } from './activities';
import { evById } from '../content';
import { actScene, evidenceArt, icon, portraitSvg, sceneSvg, type Emo } from './art';
import { btn, clear, fill, h, stars } from './dom';
import { nav } from './nav';

/** Rigiocabilità: cancella i flag impostati dalle scelte di questo capitolo. */
export function resetChapterFlags(ch: Chapter) {
  for (const n of ch.nodes) {
    if (n.t === 'choice') n.options.forEach((o) => o.set && Object.keys(o.set).forEach((k) => delete store.data.flags[k]));
    if (n.t === 'set' && n.flags) Object.keys(n.flags).forEach((k) => delete store.data.flags[k]);
  }
  store.data.seen = store.data.seen.filter((s) => !s.startsWith(ch.id + ':'));
  store.data.done = store.data.done.filter((d) => d !== ch.id);
}

interface LogLine { who: string; text: string }

/** Schermata di gioco: esegue i nodi del capitolo e disegna la scena corrente. */
export function playScreen(chapterId: string, opts: { restart?: boolean } = {}): HTMLElement {
  const ch = chapterById(chapterId)!;
  const labels = labelIndex(ch);
  const log: LogLine[] = [];

  if (opts.restart || store.data.chapter !== ch.id) {
    store.data.chapter = ch.id;
    store.data.pos = 0;
    if (opts.restart) resetChapterFlags(ch);
    store.commit();
  }

  const backdrop = h('div.backdrop', { 'aria-hidden': 'true' });
  const placecard = h('div.placecard');
  const slotL = h('div.cslot.left'); const slotR = h('div.cslot.right');
  const cast = h('div.cast', placecard, slotL, slotR);
  const stage = h('div.stage');
  const root = h('div.play', { 'data-mode': 'talk' },
    backdrop, h('div.veil', { 'aria-hidden': 'true' }),
    h('header.topbar',
      h('button.btn.ghost.small.iconbtn', { type: 'button', onclick: () => nav.home(), 'aria-label': 'Torna al menu' }, h('span', { html: icon('back', 20) }), 'Menu'),
      h('div.crumb', h('strong', `Cap. ${ch.n}`), ' · ', ch.title),
      h('div.top-actions',
        h('button.btn.ghost.small.iconbtn', { type: 'button', onclick: () => showLog() }, h('span', { html: icon('log', 20) }), 'Rileggi'),
        h('button.btn.ghost.small.iconbtn', { type: 'button', onclick: () => nav.notebook('prove') }, h('span', { html: icon('book', 20) }), 'Quaderno'),
        h('button.btn.primary.small.helpnow.iconbtn', { type: 'button', onclick: () => help() }, h('span', { html: icon('bulb', 20) }), 'Aiutami'))),
    cast, stage);

  let mood = 'warm';
  let sceneArt = 'libreria';
  let curArt = '';
  const showArt = (kind: string) => {
    if (kind === curArt) return;
    curArt = kind;
    clear(backdrop).append(h('div.art', { html: sceneSvg(kind) }));
  };
  /** Personaggi presenti nella scena: Marta a sinistra, gli altri a destra. */
  const present: Record<'left' | 'right', { id: string; emo: Emo } | null> = { left: null, right: null };
  const drawSlot = (side: 'left' | 'right', speaker: string | null) => {
    const el = side === 'left' ? slotL : slotR;
    const cur = present[side];
    if (!cur) { clear(el); el.dataset.key = ''; return; }
    const key = cur.id + ':' + cur.emo;
    if (el.dataset.key !== key) {
      const same = el.dataset.key?.split(':')[0] === cur.id;
      el.dataset.key = key;
      clear(el).append(h('div.sprite' + (same ? '' : '.enter'), { html: portraitSvg(cur.id, cur.emo), 'data-emo': cur.emo }));
    }
    el.classList.toggle('speaking', speaker === cur.id);
    el.classList.toggle('quiet', !!speaker && speaker !== cur.id);
    el.setAttribute('aria-label', who(cur.id).name);
  };
  const drawCast = (speaker: string | null) => { drawSlot('left', speaker); drawSlot('right', speaker); };
  const setScene = (n: Extract<Node, { t: 'scene' }>) => {
    mood = n.mood ?? mood;
    sceneArt = n.art ?? sceneArt;
    root.dataset.mood = mood;
    showArt(sceneArt);
    present.left = present.right = null;
    drawCast(null);
    clear(placecard).append(h('p.eyebrow', n.place ?? ''), h('h1', n.title));
    placecard.classList.remove('in'); void placecard.offsetWidth; placecard.classList.add('in');
  };
  const setMode = (m: 'talk' | 'ui', art?: string, ui = 'panel') => {
    root.dataset.ui = ui;
    root.dataset.mode = m;
    showArt(art ?? sceneArt);
  };

  /** Applica i nodi `scene` consecutivi, restituisce la posizione successiva interattiva. */
  const advance = (from: number): number => {
    let pos = settle(ch, from, labels);
    while (ch.nodes[pos]?.t === 'scene') {
      setScene(ch.nodes[pos] as Extract<Node, { t: 'scene' }>);
      pos = settle(ch, pos + 1, labels);
    }
    return pos;
  };
  const sceneBefore = (pos: number) => {
    for (let i = pos; i >= 0; i--) { const n = ch.nodes[i]; if (n.t === 'scene') { setScene(n); return; } }
  };

  /** Avviso discreto quando una prova entra nel quaderno. */
  const toast = (evId: string) => {
    const ev = evById(evId);
    if (!ev) return;
    const t = h('button.toast', { type: 'button', 'aria-label': 'Nuova prova nel quaderno: ' + ev.title, onclick: () => nav.notebook('prove') },
      h('span.toast-art', { html: evidenceArt(ev.id) }),
      h('span.toast-text', h('small', 'Nuova prova nel quaderno'), h('strong', ev.title)));
    root.append(t);
    setTimeout(() => t.remove(), 5200);
  };

  const go = (from: number) => {
    const had = new Set(store.data.evidence);
    const pos = advance(from);
    store.data.evidence.filter((e) => !had.has(e)).forEach(toast);
    store.data.pos = pos;
    store.commit();
    draw(pos);
  };
  const jumpTo = (label: string) => go(labels[label]);

  /** Una riga di istruzione (solo in modalità Guidami), mostrata le prime volte per ogni tipo di schermata. */
  const coach = (key: string, text: string, times = 2) => {
    if (!store.data.settings.guide) return;
    const count = store.data.seen.filter((x) => x === 'coach:' + key).length;
    if (count >= times) return;
    store.data.seen.push('coach:' + key);
    stage.append(h('div.coach',
      h('p', h('span', { 'aria-hidden': 'true' }, '👉 '), text),
      btn('Ho capito, meno indicazioni', () => { store.setSettings({ guide: false }); document.querySelectorAll('.stage > .coach').forEach((e) => e.remove()); }, 'ghost small')));
  };

  let helpText = '';
  /** «Aiutami»: in un'attività apre il suo aiuto, altrove spiega che cosa si può fare adesso. */
  const help = () => {
    const act = stage.querySelector<HTMLElement>('.activity .helpbtn');
    if (act && !act.hasAttribute('disabled')) { act.click(); return; }
    const dlg = h('dialog.logdlg', h('h3', 'Ti aiuto io'),
      h('p', helpText || 'Leggi con calma e tocca «Avanti» quando sei pronta. Non c’è nessuna fretta e non si perde niente.'),
      h('p.muted', 'Il gioco salva da solo: puoi chiudere quando vuoi e ritrovare tutto com’era.'),
      h('div.row', btn('Va bene, torno al gioco', () => { (dlg as HTMLDialogElement).close(); dlg.remove(); }, 'primary'),
        btn('Rileggi cosa è successo', () => { (dlg as HTMLDialogElement).close(); dlg.remove(); showLog(); }),
        btn('Apri il quaderno', () => nav.notebook('prove'), 'ghost')));
    document.body.append(dlg);
    (dlg as HTMLDialogElement).showModal();
  };

  const draw = (pos: number) => {
    clear(stage);
    helpText = '';
    const n = ch.nodes[pos];
    if (!n) return end();
    const next = () => go(pos + 1);
    switch (n.t) {
      case 'say': drawSay(n, next); break;
      case 'chat': drawChat(n, next); break;
      case 'choice': drawChoice(n, pos); break;
      case 'activity': drawActivity(n.id, next); break;
      case 'end': drawEnd(n); break;
      default: next();
    }
    stage.scrollTop = 0;
    window.scrollTo({ top: 0 });
  };

  const drawSay = (n: Extract<Node, { t: 'say' }>, next: () => void) => {
    const c = who(n.who);
    log.push({ who: c.name, text: n.text });
    const narr = n.who === 'narr';
    setMode('talk');
    if (!narr) {
      const side = n.who === 'marta' ? 'left' : 'right';
      present[side] = { id: n.who, emo: ((n.emo as Emo) ?? 'neutral') };
    }
    drawCast(narr ? null : n.who);
    const box = h('div.dialogue' + (narr ? '.narration' : ''), { style: `--c:${c.color}` },
      narr ? null : h('p.nameplate', h('strong', c.name), h('span.role', c.role)),
      h('div.say', termify(n.text)),
      h('button.next', { type: 'button', 'aria-label': 'Avanti', onclick: next }, 'Avanti ', h('span', { html: icon('play', 16) })));
    box.addEventListener('click', (e) => { if (!(e.target as HTMLElement).closest('button')) next(); });
    helpText = 'Stai leggendo la storia. Quando hai finito di leggere, tocca «Avanti» (o un punto qualsiasi del riquadro). Se una parola è sottolineata, toccala per capire cosa vuol dire.';
    coach('say', 'Leggi, poi tocca «Avanti». Le parole sottolineate si possono toccare per avere una spiegazione.');
    stage.append(box);
    (box.querySelector('.next') as HTMLElement).focus({ preventScroll: true });
  };

  const drawChat = (n: Extract<Node, { t: 'chat' }>, next: () => void) => {
    n.msgs.forEach((m) => log.push({ who: m.from, text: m.text }));
    setMode('ui', 'telefono');
    coach('chat', 'Questo è lo schermo del telefono. Leggi i messaggi con calma, poi tocca «Ho letto, continua».', 1);
    stage.append(h('div.phone',
      h('div.phone-bar', h('span', n.app ?? 'Messaggi'), h('strong', n.title)),
      h('div.bubbles', ...n.msgs.map((m) => h('div.bubble' + (m.me ? '.me' : ''),
        m.me ? null : h('span.from', m.from), h('p', m.text), m.time ? h('span.time', m.time) : null)))),
      h('div.row.end', btn('Ho letto, continua', next, 'primary')));
    helpText = 'Questi sono i messaggi arrivati sul telefono. Leggili dall’alto in basso e poi tocca «Ho letto, continua».';
  };

  const drawChoice = (n: Extract<Node, { t: 'choice' }>, pos: number) => {
    helpText = n.help ?? 'Scegli quello che faresti tu, nella vita vera. Non ci sono risposte “sbagliate”: dopo la scelta ti spiego cosa succede e cosa si poteva notare.';
    coach('choice', 'Adesso decidi tu. Scegli quello che faresti davvero: non è un esame, e dopo ti spiego cosa succede.', 2);
    setMode('ui', undefined, 'choice');
    if (n.prompt) stage.append(h('p.prompt', n.prompt));
    const box = h('div.choices', { role: 'group' });
    n.options.forEach((o, i) => {
      const ok = optionAvailable(o);
      box.append(h('button.choice' + (ok ? '' : '.locked'), {
        type: 'button', disabled: !ok, 'data-key': i + 1,
        onclick: () => {
          store.data.seen.push(`${ch.id}:${n.id}:${i}`);
          applyOption(o);
          log.push({ who: 'Tu', text: o.text });
          if (o.to) jumpTo(o.to); else go(pos + 1);
        },
      }, h('span.k', String(i + 1)), h('span', o.text), ok ? null : h('small', o.lockedHint ?? 'Ti serve una prova che non hai ancora.')));
    });
    stage.append(box);
  };

  const drawActivity = (id: string, next: () => void) => {
    const act = ch.activities[id];
    if (!act) throw new Error(`Attività mancante: ${id}`);
    setMode('ui', act.scene ?? actScene(act.kind));
    stage.append(renderActivity(act, {
      onDone: (r) => {
        store.setResult(`${ch.id}:${id}`, r);
        if (r.ok && act.after) store.setFlags(act.after);
        store.data.skills.dettagli += r.stars >= 3 ? 1 : 0;
        store.data.skills.fonti += act.kind === 'factcheck' ? r.stars : 0;
        store.commit();
        next();
      },
    }));
  };

  const drawEnd = (n: Extract<Node, { t: 'end' }>) => {
    setMode('ui', 'valle');
    if (!store.data.done.includes(ch.id)) store.data.done.push(ch.id);
    if (n.ending && !store.data.endings.includes(n.ending)) store.data.endings.push(n.ending);
    store.data.pos = ch.nodes.length;
    store.commit();
    const total = Object.entries(store.data.results).filter(([k]) => k.startsWith(ch.id + ':'));
    const earned = total.reduce((a, [, r]) => a + r.stars, 0);
    const nextCh = chapters.find((c) => c.n === ch.n + 1);
    stage.append(h('div.endcard',
      h('p.eyebrow', nextCh ? 'Capitolo concluso' : 'Indagine conclusa'), h('h2', ch.title),
      n.endingTitle ? h('p.ending', `Finale: ${n.endingTitle}`) : null,
      h('p.stars-big', stars(Math.min(3, Math.round(earned / Math.max(1, total.length))))),
      h('p.muted', `${earned} stelle in ${total.length} attività`),
      h('h3', 'Cosa ti porti via da questo capitolo'),
      h('ul.learned', ...(n.summary ?? []).map((s) => h('li', s))),
      h('div.row',
        nextCh ? btn(`Capitolo ${nextCh.n}: ${nextCh.title}`, () => nav.play(nextCh.id, true), 'primary') : h('p.muted', 'Hai percorso tutta la storia. Puoi rigiocare le scelte dal menu «Capitoli» o allenarti con i casi quotidiani.'),
        btn('Apri il quaderno', () => nav.notebook('prove')),
        btn('Torna al menu', () => nav.home(), 'ghost'))));
  };

  const end = () => drawEnd({ t: 'end' });

  /** Rende toccabili i termini del glossario che compaiono nel testo (prima occorrenza). */
  const termify = (text: string): HTMLElement => {
    const p = h('p.text');
    const panel = h('div.termpanel', { hidden: true, 'aria-live': 'polite' });
    const hits = glossary.flatMap((g) => (g.match ?? []).map((m) => ({ g, m, i: text.toLowerCase().indexOf(m.toLowerCase()) })))
      .filter((x) => x.i >= 0).sort((a, b) => a.i - b.i);
    let cur = 0; const used = new Set<string>();
    for (const x of hits) {
      if (x.i < cur || used.has(x.g.id)) continue;
      used.add(x.g.id);
      p.append(text.slice(cur, x.i));
      p.append(h('button.term', { type: 'button', onclick: () => {
        fill(clear(panel), h('strong', x.g.term), h('p', x.g.short),
          x.g.easy ? btn('Spiegamelo in modo più semplice', () => { clear(panel).append(h('strong', x.g.term), h('p', x.g.easy!)); }, 'ghost small') : null);
        panel.hidden = false; store.learn(x.g.id);
      } }, text.slice(x.i, x.i + x.m.length)));
      cur = x.i + x.m.length;
    }
    p.append(text.slice(cur));
    const wrap = h('div.say-text', p, panel);
    return wrap;
  };

  const showLog = () => {
    const dlg = h('dialog.logdlg', h('h3', 'Cosa è successo finora'),
      h('div.logbody', ...log.slice(-60).map((l) => h('p', h('strong', l.who ? l.who + ': ' : ''), l.text))),
      btn('Chiudi', () => { (dlg as HTMLDialogElement).close(); dlg.remove(); }, 'primary'));
    document.body.append(dlg);
    (dlg as HTMLDialogElement).showModal();
  };

  // tastiera (PC): Spazio/Invio/→ = avanti, 1-9 = scegli
  const onKey = (e: KeyboardEvent) => {
    if (!root.isConnected) { document.removeEventListener('keydown', onKey); return; }
    if ((e.target as HTMLElement)?.closest('input,textarea,select,dialog')) return;
    const nextBtn = stage.querySelector<HTMLElement>('.dialogue .next');
    if (nextBtn && (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); nextBtn.click(); return; }
    const cb = stage.querySelector<HTMLElement>(`.choice[data-key="${e.key}"]`);
    if (cb && !(cb as HTMLButtonElement).disabled) cb.click();
    if (e.key.toLowerCase() === 'q') nav.notebook('prove');
  };
  document.addEventListener('keydown', onKey);

  // avvio / ripresa
  sceneBefore(store.data.pos);
  go(store.data.pos);
  return root;
}

export type { Chapter };
