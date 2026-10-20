import type { Activity, Settings } from '../types';
import { caseById, chapters, dailyCases, evidence, glossary, planned, realCases, termById } from '../content';
import { clearAll, exportJson, importJson, loadSlot, saveSlot, clearSlot } from '../engine/save';
import { store } from '../engine/state';
import { renderActivity } from './activities';
import { evidenceArt, icon, portraitSvg, sceneSvg } from './art';
import { btn, clear, downloadText, h, pickFile, seeded } from './dom';
import { nav, type NotebookTab } from './nav';
import { analyzeText } from './lab';
import { resetChapterFlags } from './play';

const shell = (title: string, back: () => void, ...kids: (Node | null)[]) =>
  h('div.screen',
    h('header.topbar', btn('‹ Indietro', back, 'ghost small'), h('div.crumb', h('strong', title)), h('div.top-actions')),
    h('main.content', ...kids));

/* ---------------- HOME ---------------- */
const scenery = (kind: string, ...kids: (Node | null)[]) => [h('div.backdrop', { 'aria-hidden': 'true' }, h('div.art', { html: sceneSvg(kind) })), h('div.veil', { 'aria-hidden': 'true' }), ...kids];

/** Benvenuto, mostrato una sola volta prima di iniziare: dice in quattro righe come si gioca. */
export function welcomeScreen(onStart: () => void): HTMLElement {
  const step = (n: string, t: string, d: string) => h('li', h('span.wn', n), h('div', h('b', t), h('p', d)));
  return h('div.welcome',
    ...scenery('libreria-cool'),
    h('div.welcome-guide', { 'aria-hidden': 'true', html: portraitSvg('davide', 'smile') }),
    h('div.welcome-card',
      h('p.eyebrow', 'Prima di cominciare'),
      h('h1', 'Benvenuta in «Dietro lo Schermo»'),
      h('p.lead', 'È una storia investigativa. Leggi, scegli, scopri. Non è un esame e non puoi “perdere”: se sbagli, ti spiego con calma cosa è successo.'),
      h('ol.wsteps',
        step('1', 'Leggi la storia', 'Tocca «Avanti» per proseguire, quando hai finito di leggere.'),
        step('2', 'Scegli cosa faresti', 'Ogni tanto ti chiedo cosa faresti tu. Rispondi come nella vita vera.'),
        step('3', 'Se sei in dubbio, tocca «Aiutami»', 'Il pulsante è sempre in alto. Non toglie niente e non ti giudica.'),
        step('4', 'Il gioco salva da solo', 'Puoi chiudere quando vuoi e riprendere da dove eri.')),
      h('p.muted', 'All’inizio ti darò qualche indicazione in più (modalità «Guidami»). Quando ti senti sicura, puoi ridurla toccando «Ho capito, meno indicazioni», o dalle Impostazioni.'),
      h('div.row', btn('Ho capito, cominciamo', () => { store.setSettings({ welcomed: true }); onStart(); }, 'primary big'))));
}

export function homeScreen(): HTMLElement {
  const d = store.data;
  const cur = d.chapter ? chapters.find((c) => c.id === d.chapter) : null;
  const inProgress = cur && !d.done.includes(cur.id);
  const firstUndone = chapters.find((c) => !d.done.includes(c.id));
  const start = (id: string, restart?: boolean) => () => {
    if (!store.data.settings.welcomed) { nav.mount(welcomeScreen(() => nav.play(id, restart))); return; }
    nav.play(id, restart);
  };
  const small = (ic: string, title: string, f: () => void) => btn(h('span', h('span.ico', { 'aria-hidden': 'true', html: icon(ic, 26) }), h('b', title)), f, 'tile');
  const playIco = (t: string) => h('b', h('span.ico', { 'aria-hidden': 'true', html: icon('play', 20) }), ' ' + t);
  const shown = firstUndone ?? chapters[chapters.length - 1];
  const dots = Array.from({ length: 8 }, (_, i) => {
    const c = chapters.find((x) => x.n === i + 1);
    const st = c && d.done.includes(c.id) ? 'done' : c && c.id === shown.id ? 'now' : 'soon';
    return h('li.' + st, { 'aria-label': `Capitolo ${i + 1}: ${st === 'done' ? 'completato' : st === 'now' ? 'in corso' : 'in arrivo'}` }, String(i + 1));
  });
  return h('div.home',
    ...scenery('valle'),
    h('header.titleblock',
      h('p.eyebrow', 'Un’indagine in otto capitoli'),
      h('h1', 'Dietro lo Schermo'),
      h('p.tag', 'Un’indagine a Valdorna')),
    h('div.home-cast', { 'aria-hidden': 'true' },
      h('div.hc.l', { html: portraitSvg('marta', 'neutral') }), h('div.hc.r', { html: portraitSvg('davide', 'thinking') })),
    h('nav.menu', { 'aria-label': 'Menu principale' },
      inProgress ? btn(h('span', playIco('Continua la storia'), h('small', `Capitolo ${cur!.n} · ${cur!.title}`)), start(cur!.id), 'primary big')
        : firstUndone ? btn(h('span', playIco(d.done.length ? 'Prossimo capitolo' : 'Comincia la storia'), h('small', `Capitolo ${firstUndone.n} · ${firstUndone.title}`)), start(firstUndone.id), 'primary big')
          : btn(h('span', h('b', 'Hai percorso tutta la storia'), h('small', 'Puoi rigiocare un capitolo dal menu Capitoli')), () => nav.screen('capitoli'), 'primary big'),
      h('div.tiles',
        small('book', 'Quaderno', () => nav.notebook('prove')),
        small('books', 'Capitoli', () => nav.screen('capitoli')),
        small('puzzle', 'Allenamento', () => nav.screen('modalita')),
        small('sos', 'Se succede davvero', () => nav.screen('guide')),
        small('gear', 'Impostazioni', () => nav.screen('impostazioni'))),
      h('ol.chapdots', { 'aria-label': 'Capitoli della storia' }, ...dots)),
    h('footer.foot', `Stelle: ${store.totalStars} · Il gioco funziona anche senza Internet e tutto resta sul tuo dispositivo.`));
}

/* ---------------- CAPITOLI ---------------- */
export function chaptersScreen(): HTMLElement {
  const d = store.data;
  const items = chapters.map((c) => {
    const done = d.done.includes(c.id);
    const earned = Object.entries(d.results).filter(([k]) => k.startsWith(c.id + ':')).reduce((a, [, r]) => a + r.stars, 0);
    return h('article.chap',
      h('div.chap-n', String(c.n)),
      h('div.chap-body', h('h3', c.title), h('p.muted', c.subtitle),
        h('ul.goals', ...c.goals.map((g) => h('li', g))),
        done ? h('p.done', `✓ Completato · ${earned} stelle`) : null),
      h('div.chap-actions',
        d.chapter === c.id && !done ? btn('Continua', () => nav.play(c.id), 'primary') : null,
        btn(done || d.chapter === c.id ? 'Ricomincia' : 'Inizia', () => {
          if (d.chapter === c.id || done) { if (!confirm(`Ricominciare il capitolo ${c.n}? Le scelte di questo capitolo verranno azzerate (le prove già trovate restano nel quaderno).`)) return; resetChapterFlags(c); }
          nav.play(c.id, true);
        }, done ? '' : 'primary')));
  });
  const soon = planned.map((p) => h('article.chap.soon', h('div.chap-n', String(p.n)), h('div.chap-body', h('h3', p.title), h('p.muted', p.subtitle), h('p.muted', 'In arrivo nelle prossime versioni.'))));
  return shell('Capitoli', nav.home, ...items, ...soon);
}

/* ---------------- QUADERNO ---------------- */
export function notebookScreen(tab: NotebookTab = 'prove'): HTMLElement {
  const tabs: [NotebookTab, string][] = [['prove', 'Cose scoperte'], ['bacheca', 'Persone e fonti'], ['timeline', 'La storia finora'], ['glossario', 'Parole'], ['casi', 'Casi veri']];
  const tabIco: Record<string, string> = { prove: 'search', bacheca: 'pin', timeline: 'clock', glossario: 'book', casi: 'star' };
  const body = h('div.nb-body');
  const have = evidence.filter((e) => store.data.evidence.includes(e.id));

  if (tab === 'prove') {
    body.append(h('p.muted', `Qui trovi le cose che hai scoperto finora (${have.length}). Quelle segnate «Indizio debole» non bastano da sole.`));
    if (!have.length) body.append(h('p', 'Ancora niente: le scoperte compariranno qui mentre giochi.'));
    have.forEach((e, i) => body.append(h('article.ev' + (e.weak ? '.weak' : ''), { style: `--tilt:${(i % 2 ? 1 : -1) * (0.4 + (i % 3) * 0.3)}deg` },
      h('div.ev-img', { html: evidenceArt(e.id), 'aria-hidden': 'true' }),
      h('div.ev-body', h('h3', e.title), e.weak ? h('span.tag.decoy', 'Indizio debole') : null, h('p', e.text),
        e.source ? h('p.ev-line', h('b', 'Da dove viene: '), e.source) : null,
        e.fact ? h('p.ev-line.fact', h('b', 'Cosa si vede: '), e.fact) : null,
        e.reading ? h('p.ev-line.reading', h('b', 'Cosa può voler dire (non è certo): '), e.reading) : null,
        e.links?.some((l) => store.data.evidence.includes(l)) ? h('p.ev-line', h('b', 'Si collega a: '), e.links.filter((l) => store.data.evidence.includes(l)).map((l) => evidence.find((x) => x.id === l)?.title ?? l).join(' · ')) : null,
        e.learn ? h('p.ev-line.learn', h('b', 'Da ricordare: '), e.learn) : null,
        e.why ? h('p.why', h('span', { html: icon('info', 18), 'aria-hidden': 'true' }), h('span', h('b', 'Perché è importante: '), e.why)) : null,
        e.dateLabel ? h('small', e.dateLabel) : null))));
  }
  if (tab === 'bacheca') {
    const tags = [...new Set(have.flatMap((e) => e.tags))];
    body.append(h('p.muted', 'Le cose scoperte, raggruppate per persona o per argomento.'));
    if (!tags.length) body.append(h('p', 'Si riempirà quando troverai le prime scoperte.'));
    const board = h('div.board');
    tags.forEach((t) => board.append(h('section.col-b', h('h3', t), ...have.filter((e) => e.tags.includes(t)).map((e) => h('div.pin' + (e.weak ? '.weak' : ''), h('div.pin-img', { html: evidenceArt(e.id), 'aria-hidden': 'true' }), h('strong', e.title), h('small', e.weak ? 'Indizio debole' : e.dateLabel ?? ''))))));
    body.append(board);
  }
  if (tab === 'timeline') {
    const dated = have.filter((e) => e.date).sort((a, b) => a.date!.localeCompare(b.date!));
    body.append(h('p.muted', 'Gli avvenimenti in ordine di tempo, secondo quello che hai scoperto.'));
    if (!dated.length) body.append(h('p', 'Per ora non c’è ancora niente da raccontare.'));
    body.append(h('ol.tlv', ...dated.map((e) => h('li', h('time', e.dateLabel ?? e.date!), h('strong', e.title), h('p', e.text)))));
  }
  if (tab === 'glossario') {
    const learned = store.data.learned;
    body.append(h('p.muted', 'Le parole nuove compaiono qui quando le incontri nella storia. Tocca una parola per leggere cosa vuol dire.'));
    const known = glossary.filter((g) => learned.includes(g.id));
    if (!known.length) body.append(h('p', 'Ancora nessuna parola nuova: arriveranno giocando.'));
    known.forEach((g) => {
      const more = h('p', g.long);
      body.append(h('details.term', h('summary', g.term),
        h('div', h('p', h('b', g.short)), g.easy ? btn('Spiegamelo in modo più semplice', () => { more.textContent = g.easy!; }, 'ghost small') : null, more, g.example ? h('p.muted', 'Esempio: ' + g.example) : null)));
    });
  }
  if (tab === 'casi') {
    body.append(h('p.muted', 'Storie vere, successe davvero, con le fonti dove controllarle. La storia di Valdorna invece è inventata. I link sono facoltativi e servono Internet.'));
    const unlocked = realCases.filter((c) => store.data.cases.includes(c.id));
    if (!unlocked.length) body.append(h('p', 'Ancora nessun caso: li scoprirai andando avanti nella storia.'));
    unlocked.forEach((c) => body.append(caseCard(c.id)));
    const locked = realCases.length - unlocked.length;
    if (locked) body.append(h('p.muted', `${locked} casi da sbloccare proseguendo nella storia.`));
  }

  const el = shell('Quaderno', () => (store.data.chapter && !store.data.done.includes(store.data.chapter) ? nav.play(store.data.chapter) : nav.home()),
    h('div.tabs', { role: 'tablist' }, ...tabs.map(([k, l]) => h('button.tab' + (k === tab ? '.on' : ''), { role: 'tab', 'aria-selected': k === tab, onclick: () => nav.notebook(k) }, h('span', { html: icon(tabIco[k], 18), 'aria-hidden': 'true' }), l))), body);
  el.classList.add('notebook');
  const inStory = !!store.data.chapter && !store.data.done.includes(store.data.chapter);
  const backBtn = el.querySelector('.topbar .btn'); if (backBtn) backBtn.textContent = inStory ? '‹ Torna alla storia' : '‹ Indietro';
  return el;
}

function caseCard(id: string): HTMLElement {
  const c = caseById(id)!;
  return h('article.case',
    h('p.eyebrow', `Caso reale · ${c.category}`), h('h3', c.title),
    h('p.muted', `${c.author} · ${c.date}`),
    h('p', c.context),
    h('h4', 'Cosa sappiamo di sicuro'), h('ul', ...c.facts.map((f) => h('li', f))),
    h('h4', 'Cosa non si sa ancora'), h('ul', ...c.uncertain.map((f) => h('li', f))),
    h('h4', 'Cosa possiamo imparare'), h('ul', ...c.lessons.map((f) => h('li', f))),
    h('p.src', 'Fonte: ', h('a', { href: c.url, target: '_blank', rel: 'noopener noreferrer' }, c.url), ` · verificata il ${c.checked}`));
}

/* ---------------- MODALITÀ ---------------- */
export function modesScreen(): HTMLElement {
  const m = (title: string, sub: string, f: () => void) => btn(h('span', h('b', title), h('small', sub)), f, 'big');
  return shell('Allenamento', nav.home,
    h('div.menu',
      m('Situazioni di tutti i giorni', 'Brevi messaggi da valutare, senza fretta', () => nav.screen('daily', 'quotidiani')),
      m('Allenamento con guida', 'Le stesse situazioni, con i quattro passi spiegati', () => nav.screen('daily', 'guidato')),
      m('In redazione', 'Distingui ciò che è dimostrato da ciò che è solo detto', () => nav.screen('daily', 'redazione')),
      m('E se ho sbagliato? (simulazione)', 'Cosa fare dopo aver scritto una password su un sito sospetto', () => nav.screen('daily', 'account')),
      m('Prova un tuo messaggio', 'Incolla un messaggio o un indirizzo e guardalo insieme a me (resta sul tuo dispositivo)', () => nav.screen('lab')),
      m('Rinfresca la memoria', 'Rivedi con calma le parole incontrate', () => nav.screen('ripasso')),
      m('Storie vere', 'Casi accaduti davvero, con le fonti', () => nav.notebook('casi'))));
}

export function dailyScreen(kind: string): HTMLElement {
  const sets: Record<string, { title: string; ids: string[]; guided: boolean }> = {
    quotidiani: { title: 'Situazioni di tutti i giorni', ids: ['d_pacco', 'd_dentista', 'd_mail'], guided: false },
    guidato: { title: 'Allenamento con guida', ids: ['d_pacco', 'd_mail'], guided: true },
    redazione: { title: 'In redazione', ids: ['d_redazione'], guided: false },
    account: { title: 'E se ho sbagliato?', ids: ['d_account'], guided: false },
  };
  const set = sets[kind];
  const acts = set.ids.map((id) => dailyCases.find((a) => a.id === id)!) as Activity[];
  const body = h('div.daily');
  let i = 0;
  const run = () => {
    clear(body);
    if (i >= acts.length) {
      body.append(h('div.endcard', h('h2', 'Sessione finita'), h('p', 'Bene così. Puoi ripetere quando vuoi: non cambia nulla se sbagli.'), btn('Torna al menu', () => nav.screen('modalita'), 'primary')));
      return;
    }
    const a = acts[i];
    if (set.guided) body.append(h('div.guide-steps', h('p.eyebrow', 'I quattro passi'), h('ol', h('li', h('b', 'Fermati'), ' — non toccare link e non rispondere.'), h('li', h('b', 'Guarda'), ' — chi scrive? cosa chiede? c’è fretta?'), h('li', h('b', 'Confronta'), ' — controlla da una fonte che scegli tu.'), h('li', h('b', 'Decidi'), ' — rispondi alla domanda sotto.'))));
    body.append(h('p.muted', `Caso ${i + 1} di ${acts.length}`), renderActivity(a, {
      free: true,
      onDone: (r) => { store.setResult('free:' + a.id, r); i++; run(); },
    }));
  };
  run();
  return shell(set.title, () => nav.screen('modalita'), body);
}

/* ---------------- LABORATORIO LIBERO ---------------- */
export function labScreen(): HTMLElement {
  const ta = h('textarea', { rows: 6, placeholder: 'Incolla qui un messaggio, un’e-mail o un indirizzo web. Il testo resta sul tuo dispositivo.', 'aria-label': 'Testo da osservare' }) as HTMLTextAreaElement;
  const out = h('div.lab-out', { 'aria-live': 'polite' });
  const run = () => {
    const r = analyzeText(ta.value);
    clear(out);
    if (!ta.value.trim()) return;
    if (r.links.length) out.append(h('section', h('h3', 'Indirizzi trovati nel testo'), ...r.links.map((l) => h('div.linkbox',
      h('code', ...l.parts.map((p, i) => h('span.' + (i === l.parts.length - 1 ? 'real' : i === l.parts.length - 2 ? 'real' : 'sub'), p + (i < l.parts.length - 1 ? '.' : '')))),
      h('p', h('b', 'Il sito vero è probabilmente: '), l.domain), ...l.notes.map((n) => h('p.muted', n))))));
    out.append(h('section', h('h3', r.findings.length ? 'Cose che mi hanno colpito' : 'Non ho notato niente di strano'),
      r.findings.length ? h('ul', ...r.findings.map((f) => h('li', h('b', f.title + ': '), f.why))) : h('p', 'Nessun segnale tra quelli che questo strumento sa riconoscere. Non significa che sia sicuro.'),
      h('p.muted', 'Questo strumento è un aiuto, non un verdetto: non sostituisce il controllo della fonte (chi scrive? posso verificarlo da un canale che scelgo io?).')));
  };
  return shell('Prova un tuo messaggio', () => nav.screen('modalita'), ta, h('div.row', btn('Guardiamolo insieme', run, 'primary'), btn('Svuota', () => { ta.value = ''; clear(out); }, 'ghost')), out);
}

/* ---------------- RIPASSO ---------------- */
export function reviewScreen(): HTMLElement {
  const learned = glossary.filter((g) => store.data.learned.includes(g.id));
  const body = h('div.review');
  if (learned.length < 2) { body.append(h('p', 'Qui potrai rivedere le parole nuove, dopo che ne avrai incontrate almeno due nella storia.')); return shell('Rinfresca la memoria', () => nav.screen('modalita'), body); }
  let i = 0;
  const q = () => {
    clear(body);
    const g = learned[i % learned.length];
    const others = seeded(glossary.filter((x) => x.id !== g.id), g.id + i).slice(0, 2);
    const opts = seeded([g, ...others], g.id + 'o' + i);
    body.append(h('p.muted', `Giochiamo con le parole · ${i + 1}`), h('h3', `Ti ricordi cosa vuol dire «${g.term}»?`));
    const fb = h('div.feedback');
    opts.forEach((o) => body.append(btn(o.short, () => {
      if (o.id === g.id) clear(fb).append(h('p.ok', 'Proprio così.'), h('p', g.long), btn('Avanti', () => { i++; q(); }, 'primary'));
      else clear(fb).append(h('p.soft', 'Quasi: questa frase parla di un’altra cosa («' + (termById(o.id)?.term ?? '') + '»).'), h('p.muted', 'Riprova quando vuoi, non conta niente.'));
    }, 'choice')));
    body.append(fb);
  };
  q();
  return shell('Rinfresca la memoria', () => nav.screen('modalita'), body);
}

/* ---------------- SE SUCCEDE DAVVERO ---------------- */
export function guideScreen(): HTMLElement {
  const g = (title: string, steps: string[]) => h('details.guide', h('summary', title), h('ol', ...steps.map((s) => h('li', s))));
  return shell('Se succede davvero', nav.home,
    h('p.lead', 'Respira. Quasi tutti, prima o poi, ci cascano: l’importante è sapere cosa fare subito dopo.'),
    g('Ho ricevuto un messaggio sospetto', [
      'Non rispondere, non cliccare, non inoltrare.',
      'Controlla chi scrive con un canale che scegli tu (il sito o l’app ufficiale, o un numero che già conosci).',
      'Se è un tentativo di truffa, segnalalo (Polizia Postale: commissariatodips.it) e poi cancellalo.',
    ]),
    g('Ho cliccato su un link', [
      'Chiudi la pagina. Non inserire nulla.',
      'Se hai inserito dati o password, passa alla guida “Ho divulgato una password”.',
      'Se il telefono ti ha chiesto di installare qualcosa, non farlo; se l’hai fatto, disinstalla l’app e chiedi aiuto a una persona di fiducia.',
      'Cliccare, da solo, di rado basta a creare un danno, ma conviene controllare gli account principali nei giorni seguenti.',
    ]),
    g('Ho divulgato una password', [
      'Dal sito o dall’app ufficiale (digitando tu l’indirizzo), cambia subito la password.',
      'Cambiala anche in tutti i siti in cui usavi la stessa.',
      'Attiva la verifica in due passaggi.',
      'Controlla i dispositivi collegati ed esci da quelli che non riconosci.',
      'Avvisa chi è in contatto con te se qualcuno potrebbe aver scritto a suo nome.',
    ]),
    g('Ho autorizzato un pagamento', [
      'Chiama subito la banca al numero ufficiale (sul retro della carta o sul sito) e chiedi di bloccare la carta e di contestare l’operazione.',
      'Conserva le prove: screenshot, messaggi, ricevute.',
      'Presenta denuncia alle forze dell’ordine o online alla Polizia Postale.',
      'Non fidarti di chi ti chiama “dalla banca” per aiutarti: richiama tu, dal numero ufficiale.',
    ]),
    g('Non so cosa fare', [
      'Fermati e chiedi a una persona di fiducia: confrontarsi non è un segno di debolezza.',
      'Scrivi cosa è successo, ora e con quali dispositivi: aiuta chi ti dà una mano.',
      'Nessuna vergogna: queste truffe sono progettate da professionisti per ingannare chiunque.',
    ]));
}

/* ---------------- IMPOSTAZIONI E SALVATAGGI ---------------- */
export function settingsScreen(): HTMLElement {
  const s = store.data.settings;
  const toggle = (key: keyof Settings, label: string, hint?: string) => h('label.toggle', h('input', { type: 'checkbox', checked: !!s[key], onchange: (e: Event) => { store.setSettings({ [key]: (e.target as HTMLInputElement).checked } as Partial<Settings>); applySettings(); } }), h('span', h('b', label), hint ? h('small', hint) : null));
  const slot = (n: number) => {
    const d = loadSlot(n);
    return h('div.slot', h('div', h('b', `Slot ${n}`), h('small', d ? ` · ${d.chapter ?? '—'} · ${new Date(d.updated).toLocaleString('it-IT')}` : ' · vuoto')),
      h('div.row', btn('Salva qui', () => { saveSlot(n, store.data); nav.screen('impostazioni'); }, 'small'),
        d ? btn('Carica', () => { if (confirm('Caricare questo salvataggio? La partita attuale verrà sostituita (resta nell’autosalvataggio fino al prossimo passo).')) { store.replace(structuredClone(d)); applySettings(); nav.home(); } }, 'small') : null,
        d ? btn('Elimina', () => { if (confirm('Eliminare questo slot?')) { clearSlot(n); nav.screen('impostazioni'); } }, 'ghost small') : null));
  };
  const msg = h('p.muted', { 'aria-live': 'polite' });
  return shell('Impostazioni', nav.home,
    h('section', h('h3', 'Lettura e comfort'),
      h('label.toggle', h('span', h('b', 'Dimensione del testo')), h('select', { onchange: (e: Event) => { store.setSettings({ textScale: Number((e.target as HTMLSelectElement).value) }); applySettings(); } },
        ...[[1, 'Normale'], [1.15, 'Grande'], [1.3, 'Molto grande']].map(([v, l]) => h('option', { value: v, selected: s.textScale === v }, String(l))))),
      toggle('guide', 'Guidami', 'Mostra le indicazioni passo passo (consigliato all’inizio). Spegnile quando ti senti sicura.'),
      toggle('calm', 'Modalità tranquilla', 'Nessun timer, nessuna penalità, spiegazioni sempre calme (il gioco è già senza timer: questa modalità mantiene tutto più morbido).'),
      toggle('reduceMotion', 'Riduci le animazioni'), toggle('highContrast', 'Contrasto alto'), toggle('readableFont', 'Carattere molto leggibile')),
    h('section', h('h3', 'Salvataggi'),
      h('p.muted', 'Il gioco salva da solo a ogni passo, su questo dispositivo: non devi fare niente. Per portare la partita da un dispositivo all’altro (per esempio da PC a iPad) usa «Esporta» e «Importa».'),
      slot(1), slot(2), slot(3),
      h('div.row',
        btn('Esporta partita (file)', () => downloadText(`verifica-salvataggio-${new Date().toISOString().slice(0, 10)}.json`, exportJson(store.data)), ''),
        btn('Importa partita', async () => { const t = await pickFile('.json,application/json'); if (!t) return; const d = importJson(t); if (!d) { msg.textContent = 'File non valido o creato da una versione più nuova del gioco.'; return; } if (confirm('Importare? La partita attuale verrà sostituita.')) { store.replace(d); applySettings(); nav.home(); } }, '')),
      msg),
    h('section', h('h3', 'Azzera'),
      btn('Cancella tutti i dati del gioco…', () => { if (confirm('Cancellare TUTTI i progressi e i salvataggi su questo dispositivo? Non si può annullare. Prima puoi esportare la partita.')) { clearAll(); store.reset(); applySettings(); nav.home(); } }, 'danger')),
    h('section', h('h3', 'Informazioni'), h('p.muted', `Dietro lo Schermo v${__APP_VERSION__}. Funziona offline, non raccoglie dati e non contatta alcun server. I personaggi e la storia di Valdorna sono inventati; i casi reali sono indicati come tali con la fonte.`)));
}

export function applySettings() {
  const s = store.data.settings, r = document.documentElement;
  r.style.setProperty('--scale', String(s.textScale));
  r.dataset.motion = s.reduceMotion ? 'reduce' : 'full';
  r.dataset.contrast = s.highContrast ? 'high' : 'normal';
  r.dataset.font = s.readableFont ? 'readable' : 'normal';
}

