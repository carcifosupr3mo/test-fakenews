import type { Activity, FactAct, Hot, InspectAct, SortAct, TimelineAct, ActResult, Seg } from '../types';
import { btn, clear, fill, h, seeded, stars } from './dom';
import { store } from '../engine/state';

export interface ActCtx {
  onDone: (r: ActResult) => void;
  /** Se true l'attività è un esercizio libero: nessun effetto sulla storia. */
  free?: boolean;
}

/* ============ cornice comune: titolo, introduzione, aiuti a 3 livelli ============ */
function frame(act: Activity, ctx: ActCtx, build: (area: HTMLElement) => void): { el: HTMLElement; hintsUsed: () => number } {
  let level = 0;
  const hintBox = h('div.hintbox', { hidden: true, 'aria-live': 'polite' });
  const hintBtn = btn('💡 Aiutami', () => {
    level = Math.min(3, level + 1);
    const labels = ['', 'Dove guardare', 'Ecco l’indizio', 'Ti spiego passo passo'];
    clear(hintBox).append(h('strong', labels[level]), h('p', act.hints[level - 1]),
      level < 3 ? h('p.muted', 'Se non basta, tocca di nuovo «Aiutami»: ti dirò di più.') : h('p.muted', 'Questo è tutto l’aiuto che posso dare. Nessuna stella viene tolta.'));
    hintBox.hidden = false;
    hintBtn.textContent = level < 3 ? '💡 Ancora un aiuto' : '💡 Aiuto completo';
    hintBox.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, 'helpbtn');
  const area = h('div.act-area');
  const guided = store.data.settings.guide;
  const el = h('section.activity',
    h('header.act-head',
      h('div', h('p.eyebrow', actKindLabel(act)), h('h2', act.title)),
      hintBtn),
    h('p.act-intro', act.intro),
    guided ? h('div.coach', h('p', h('span', { 'aria-hidden': 'true' }, '👉 '), act.coach ?? defaultCoach(act))) : null,
    hintBox,
    area);
  build(area);
  return { el, hintsUsed: () => level };
}
function actKindLabel(a: Activity) {
  return { inspect: 'Leggi con attenzione', factcheck: 'Cerchiamo conferme', timeline: 'Rimettiamo in ordine', sort: 'Mettiamo ordine' }[a.kind];
}
function defaultCoach(a: Activity) {
  return {
    inspect: 'Tocca le parti sottolineate del messaggio: ognuna ti dirà qualcosa. Quando hai guardato abbastanza, vai avanti.',
    factcheck: 'Tocca una fonte per leggerla. Poi scegli quali tenere come prove.',
    timeline: 'Usa i pulsanti «Su» e «Giù» per spostare gli eventi, poi tocca «Controlla l’ordine».',
    sort: 'Tocca una carta, poi tocca la casella in cui metterla.',
  }[a.kind];
}

/* ============ risultato ============ */
function resultPanel(n: number, ok: boolean, text: string, next: () => void, label = 'Continua la storia'): HTMLElement {
  return h('div.result', { role: 'status' },
    h('div.stars', stars(n)),
    h('p', text),
    btn(label, next, 'primary'));
}

const narrow = () => window.matchMedia('(max-width: 699px)').matches;

/* ============ INSPECT ============ */
function hotBtn(label: string, hot: Hot, st: { seen: Set<string>; show: (k: string, h: Hot) => void }, key: string, ctxExtra = ''): HTMLElement {
  const b = h('button.hot' + ctxExtra, { type: 'button', onclick: () => st.show(key, hot) }, label);
  if (st.seen.has(key)) b.classList.add(hot.signal ? 'seen-signal' : 'seen-decoy');
  return b;
}
function renderInspect(a: InspectAct, ctx: ActCtx): HTMLElement {
  const seen = new Set<string>();
  const signals = new Set<string>();
  const collect = (key: string, hot?: Hot) => { if (hot?.signal) signals.add(key); };
  a.header?.forEach((hd, i) => collect('h' + i, hd.h));
  a.body.forEach((p, pi) => p.forEach((s, si) => { if (typeof s !== 'string') collect(`b${pi}.${si}`, s.h); }));
  let attempts = 0, firstTry = true, done = false;
  const guided = store.data.settings.guide;

  const note = h('div.note', { 'aria-live': 'polite' }, h('p', { class: 'muted' }, '👆 Tocca una parte sottolineata del messaggio: qui comparirà la spiegazione.'));
  const counter = h('p.counter');
  const verdictBox = h('div.verdicts');
  const feedback = h('div.feedback', { 'aria-live': 'polite' });
  const decide = h('div.decide', { hidden: true }, h('h3', a.question), verdictBox, feedback);
  const goOn = btn('Ho guardato abbastanza: e ora?', () => { decide.hidden = false; goOn.hidden = true; decide.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 'primary');
  goOn.hidden = a.need > 0;
  if (a.need === 0) { decide.hidden = false; goOn.hidden = true; }

  const updateCounter = () => {
    const f = [...seen].filter((k) => signals.has(k)).length;
    counter.textContent = a.need > 0 ? `Campanelli d’allarme notati: ${f} su ${signals.size}` : 'Non c’è niente da cercare a tutti i costi: osserva e decidi.';
  };
  const show = (key: string, hot: Hot) => {
    seen.add(key);
    if (hot.evidence) store.addEvidence(hot.evidence);
    const why = h('p', hot.why);
    const body: (HTMLElement | null)[] = [
      h('span.tag.' + (hot.signal ? 'signal' : 'decoy'), hot.signal ? '⚠ Qui qualcosa non torna' : 'ℹ Da solo non dice molto'),
      h('h4', hot.title), why,
      hot.easy ? btn('Spiegamelo in modo più semplice', () => { why.textContent = hot.easy!; }, 'ghost small') : null,
    ];
    clear(note).append(...(body.filter(Boolean) as HTMLElement[]));
    paint(); updateCounter();
    if (a.need > 0 && decide.hidden) goOn.hidden = false;
    if (narrow()) note.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };
  const st = { seen, show };

  const doc = h('div.doc.' + a.variant);
  const paint = () => {
    clear(doc);
    if (a.art) doc.append(h('div.art', { html: a.art, 'aria-hidden': 'true' }));
    if (a.header?.length) {
      doc.append(h('dl.doc-head', ...a.header.flatMap((hd, i) => [
        h('dt', hd.label),
        h('dd', hd.h ? hotBtn(hd.value, hd.h, st, 'h' + i) : hd.value),
      ])));
    }
    a.body.forEach((para, pi) => {
      doc.append(h('p.doc-line', ...para.map((s: Seg, si) => typeof s === 'string' ? s : hotBtn(s.x, s.h, st, `b${pi}.${si}`))));
    });
    if (guided && seen.size === 0) doc.querySelector('.hot')?.classList.add('nudge');
  };
  paint(); updateCounter();

  a.verdicts.forEach((v) => {
    verdictBox.append(btn(v.text, () => {
      if (done) return;
      attempts++;
      if (v.ok) {
        done = true;
        const found = [...seen].filter((k) => signals.has(k)).length;
        const s = 1 + (firstTry ? 1 : 0) + (found >= a.need ? 1 : 0);
        verdictBox.querySelectorAll('button').forEach((b) => b.setAttribute('disabled', ''));
        const missed = signals.size - found;
        fill(clear(feedback), h('p.ok', v.feedback), missed > 0 && a.need > 0 ? h('p.muted', `Nel messaggio c’erano ancora ${missed} campanelli d’allarme da scoprire: puoi toccarli sopra, se ti va.`) : null,
          resultPanel(s, true, 'Bene, ce l’hai fatta.', () => ctx.onDone({ stars: s, hintsUsed: 0, ok: true })));
      } else {
        firstTry = false;
        if (attempts >= 3) {
          done = true;
          const right = a.verdicts.find((x) => x.ok)!;
          verdictBox.querySelectorAll('button').forEach((b) => b.setAttribute('disabled', ''));
          clear(feedback).append(h('p.soft', v.feedback), h('p', h('strong', 'Ti mostro la strada più sicura: '), right.text), h('p', right.feedback),
            resultPanel(1, false, 'Capita a tutti: l’importante è aver capito il ragionamento.', () => ctx.onDone({ stars: 1, hintsUsed: 0, ok: false })));
        } else {
          clear(feedback).append(h('p.soft', v.feedback), h('p.muted', 'Scegli di nuovo quando vuoi. Nessuna penalità: puoi anche toccare «Aiutami».'));
        }
      }
    }, 'choice'));
  });

  return h('div.inspect',
    h('div.inspect-main', doc, counter, goOn),
    h('aside.inspect-side', note, decide));
}

/* ============ FACTCHECK ============ */
function renderFact(a: FactAct, ctx: ActCtx): HTMLElement {
  const opened = new Set<string>();
  const picked = new Set<string>();
  let current: string | null = null;
  let attempts = 0, firstTry = true, done = false;

  const list = h('div.sources');
  const reader = h('div.reader', h('p.muted', '👆 Tocca una fonte qui a sinistra per leggerla.'));
  const verdictBox = h('div.verdicts');
  const feedback = h('div.feedback', { 'aria-live': 'polite' });

  const paint = () => {
    clear(list);
    a.sources.forEach((s) => {
      list.append(h('button.source' + (current === s.id ? '.on' : '') + (picked.has(s.id) ? '.picked' : ''), { type: 'button', onclick: () => open(s.id) },
        h('span.s-kind', s.kind), h('strong', s.name), h('span.s-date', s.date),
        picked.has(s.id) ? h('span.s-flag', '✓ la tengo come prova') : opened.has(s.id) ? h('span.s-flag.muted', 'già letta') : h('span.s-flag.muted', 'da leggere')));
    });
  };
  let open = (id: string) => {
    current = id; opened.add(id);
    const s = a.sources.find((x) => x.id === id)!;
    clear(reader).append(
      h('p.eyebrow', s.kind), h('h3', s.name), h('p.s-date', s.date),
      h('blockquote', ...s.text.map((t) => h('p', t))),
      h('ul.checks',
        h('li', h('b', '👤 Chi parla? '), s.who),
        h('li', h('b', '📅 Quando? '), s.when),
        h('li', h('b', '🔎 Come lo dimostra? '), s.proof)),
      h('p.note-line', s.note),
      btn(picked.has(id) ? '✓ La tengo come prova (tocca per toglierla)' : 'Questa mi sembra affidabile: tienila come prova', () => {
        if (picked.has(id)) picked.delete(id); else picked.add(id);
        paint(); open(id);
      }, picked.has(id) ? 'ghost' : 'primary'));
    paint();
    if (narrow()) reader.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };
  paint();

  const gate = h('p.gate');
  const decide = h('div.decide', h('h3', a.question), verdictBox, feedback);
  const refreshGate = () => {
    const ready = opened.size >= 2;
    decide.hidden = !ready;
    gate.hidden = ready;
    gate.textContent = `Per decidere servono almeno due fonti lette (finora: ${opened.size}). Una sola non basta mai.`;
  };
  refreshGate();
  const origOpen = open;
  open = (id: string) => { origOpen(id); refreshGate(); };

  a.verdicts.forEach((v) => {
    verdictBox.append(btn(v.text, () => {
      if (done) return;
      attempts++;
      const must = a.sources.filter((s) => s.useful).map((s) => s.id);
      const bad = a.sources.filter((s) => s.misleading).map((s) => s.id);
      const goodPick = must.every((id) => picked.has(id)) && !bad.some((id) => picked.has(id));
      if (v.ok) {
        done = true;
        const s = 1 + (firstTry ? 1 : 0) + (goodPick ? 1 : 0);
        verdictBox.querySelectorAll('button').forEach((b) => b.setAttribute('disabled', ''));
        const missing = must.filter((id) => !picked.has(id)).map((id) => a.sources.find((x) => x.id === id)!.name);
        const wrong = bad.filter((id) => picked.has(id)).map((id) => a.sources.find((x) => x.id === id)!.name);
        a.sources.filter((x) => x.useful && x.evidence).forEach((x) => store.addEvidence(x.evidence!));
        fill(clear(feedback), h('p.ok', v.feedback),
          missing.length ? h('p.muted', 'Fonti utili che non avevi tenuto come prove: ' + missing.join('; ') + '.') : null,
          wrong.length ? h('p.muted', 'Fonti deboli che avevi tenuto: ' + wrong.join('; ') + '. Ricorda: popolarità e anonimato non sono prove.') : null,
          resultPanel(s, true, 'Bene! Le cose scoperte sono nel tuo quaderno.', () => ctx.onDone({ stars: s, hintsUsed: 0, ok: true })));
      } else {
        firstTry = false;
        if (attempts >= 3) {
          done = true;
          const right = a.verdicts.find((x) => x.ok)!;
          verdictBox.querySelectorAll('button').forEach((b) => b.setAttribute('disabled', ''));
          a.sources.filter((x) => x.useful && x.evidence).forEach((x) => store.addEvidence(x.evidence!));
          clear(feedback).append(h('p.soft', v.feedback), h('p', h('strong', 'La conclusione più sicura era: '), right.text), h('p', right.feedback),
            resultPanel(1, false, 'Ho aggiunto io le cose utili al tuo quaderno.', () => ctx.onDone({ stars: 1, hintsUsed: 0, ok: false })));
        } else {
          clear(feedback).append(h('p.soft', v.feedback), h('p.muted', 'Puoi riprovare quando vuoi, senza penalità. Se serve, tocca «Aiutami».'));
        }
      }
    }, 'choice'));
  });

  return h('div.fact',
    h('blockquote.claim', h('p.eyebrow', 'Controlliamo questa frase'), h('p', a.claim)),
    h('div.fact-grid', list, reader),
    gate, decide);
}

/* ============ TIMELINE ============ */
function renderTimeline(a: TimelineAct, ctx: ActCtx): HTMLElement {
  let order = seeded(a.items.map((i) => i.id), a.id);
  if (order.join() === a.items.map((i) => i.id).join()) order = [...order.slice(1), order[0]];
  const byId = Object.fromEntries(a.items.map((i) => [i.id, i]));
  const correct = a.items.map((i) => i.id);
  let checks = 0, done = false;
  const marks: Record<string, boolean> = {};
  const listEl = h('ol.tl');
  const feedback = h('div.feedback', { 'aria-live': 'polite' });

  const paint = () => {
    clear(listEl);
    order.forEach((id, i) => {
      const cls = marks[id] === true ? '.good' : marks[id] === false ? '.bad' : '';
      listEl.append(h('li.tl-item' + cls,
        h('div.tl-text', marks[id] === true ? '✓ ' : marks[id] === false ? '✗ ' : null, byId[id].text, done ? h('small', byId[id].why) : null),
        done ? null : h('div.tl-btns',
          h('button.icon', { type: 'button', 'aria-label': 'Sposta su', disabled: i === 0, onclick: () => move(i, -1) }, '▲ Su'),
          h('button.icon', { type: 'button', 'aria-label': 'Sposta giù', disabled: i === order.length - 1, onclick: () => move(i, 1) }, '▼ Giù'))));
    });
  };
  const move = (i: number, d: number) => {
    [order[i], order[i + d]] = [order[i + d], order[i]];
    for (const k of Object.keys(marks)) delete marks[k];
    clear(feedback); paint();
  };
  paint();

  const finish = (s: number, ok: boolean, msg: string) => {
    done = true; order = [...correct]; for (const k of Object.keys(marks)) marks[k] = true;
    paint(); checkBtn.remove(); showBtn.remove();
    clear(feedback).append(h('p.ok', msg), resultPanel(s, ok, 'Ordine ricostruito.', () => ctx.onDone({ stars: s, hintsUsed: 0, ok })));
  };
  const checkBtn = btn('Controlla l’ordine', () => {
    checks++;
    let right = 0;
    order.forEach((id, i) => { marks[id] = id === correct[i]; if (marks[id]) right++; });
    paint();
    if (right === order.length) finish(checks === 1 ? 3 : checks <= 3 ? 2 : 1, true, 'Ordine esatto, bravissima.');
    else clear(feedback).append(h('p.soft', `${right} eventi su ${order.length} sono al posto giusto. Quelli con ✗ vanno ripensati: chiediti cosa è successo prima. Puoi usare «Aiutami».`));
  }, 'primary');
  const showBtn = btn('Mostrami l’ordine corretto', () => finish(1, false, 'Ecco l’ordine corretto, con le spiegazioni.'), 'ghost');

  return h('div.timeline', h('h3', a.prompt), listEl, h('div.row', checkBtn, showBtn), feedback);
}

/* ============ SORT (bacheca a colonne) ============ */
function renderSort(a: SortAct, ctx: ActCtx): HTMLElement {
  const place: Record<string, string | null> = Object.fromEntries(a.items.map((i) => [i.id, null]));
  const marks: Record<string, boolean> = {};
  let selected: string | null = null, checks = 0, done = false;
  const pool = h('div.pool');
  const cols = h('div.cols');
  const feedback = h('div.feedback', { 'aria-live': 'polite' });

  const card = (id: string) => {
    const it = a.items.find((i) => i.id === id)!;
    const cls = (selected === id ? '.sel' : '') + (marks[id] === true ? '.good' : marks[id] === false ? '.bad' : '');
    return h('button.card' + cls, { type: 'button', onclick: () => {
      if (done) return;
      if (place[id]) { place[id] = null; selected = null; } else selected = selected === id ? null : id;
      delete marks[id]; paint();
    } }, marks[id] === true ? '✓ ' : marks[id] === false ? '✗ ' : null, it.text, done ? h('small', it.why) : null);
  };
  const paint = () => {
    clear(pool); clear(cols);
    a.items.filter((i) => !place[i.id]).forEach((i) => pool.append(card(i.id)));
    if (!pool.childElementCount) pool.append(h('p.muted', 'Tutto è stato assegnato: ora puoi controllare.'));
    a.columns.forEach((c) => {
      const col = h('div.col' + (selected ? '.drop' : ''),
        { role: 'group', 'aria-label': c.label },
        h('button.col-head', { type: 'button', onclick: () => { if (selected && !done) { place[selected] = c.id; selected = null; paint(); } } }, c.label),
        ...a.items.filter((i) => place[i.id] === c.id).map((i) => card(i.id)));
      cols.append(col);
    });
  };
  paint();

  const finish = (s: number, ok: boolean) => {
    done = true;
    a.items.forEach((i) => { place[i.id] = i.answer; marks[i.id] = true; if (i.evidence) store.addEvidence(i.evidence); });
    paint(); checkBtn.remove(); showBtn.remove();
    clear(feedback).append(resultPanel(s, ok, 'Ecco la classificazione con le spiegazioni.', () => ctx.onDone({ stars: s, hintsUsed: 0, ok })));
  };
  const checkBtn = btn('Controlla', () => {
    if (a.items.some((i) => !place[i.id])) { clear(feedback).append(h('p.soft', 'Assegna prima tutte le carte: tocca una carta, poi la casella.')); return; }
    checks++;
    let right = 0;
    a.items.forEach((i) => { marks[i.id] = place[i.id] === i.answer; if (marks[i.id]) right++; });
    paint();
    if (right === a.items.length) finish(checks === 1 ? 3 : checks <= 3 ? 2 : 1, true);
    else clear(feedback).append(h('p.soft', `${right} carte su ${a.items.length} sono al posto giusto. Rivedi quelle con ✗: tocca una carta per riprenderla e spostarla.`));
  }, 'primary');
  const showBtn = btn('Mostrami la soluzione', () => finish(1, false), 'ghost');

  return h('div.sort', h('h3', a.prompt), h('p.muted', '1) Tocca una carta. 2) Tocca la casella in cui metterla.'), pool, cols, h('div.row', checkBtn, showBtn), feedback);
}

/* ============ ingresso ============ */
export function renderActivity(a: Activity, ctx: ActCtx): HTMLElement {
  const wrapped: ActCtx = { ...ctx, onDone: (r) => ctx.onDone({ ...r, hintsUsed: fr.hintsUsed() }) };
  const fr = frame(a, wrapped, (area) => {
    switch (a.kind) {
      case 'inspect': area.append(renderInspect(a, wrapped)); break;
      case 'factcheck': area.append(renderFact(a, wrapped)); break;
      case 'timeline': area.append(renderTimeline(a, wrapped)); break;
      case 'sort': area.append(renderSort(a, wrapped)); break;
    }
  });
  return fr.el;
}
