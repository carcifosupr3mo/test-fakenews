import type { Chapter, Node } from '../types';
import { act, caso, choice, chat, ev, go, label, learn, say, scene } from './helpers';

const WAVE = (() => {
  const h = [10, 18, 26, 16, 8, 22, 30, 20, 12, 28, 34, 18, 10, 24, 30, 14, 20, 32, 22, 12];
  const bars = h.map((v, i) => `<rect x="${24 + i * 18}" y="${50 - v}" width="8" height="${v * 2}" rx="4" fill="#2f6b7a"/>`).join('');
  return `<svg viewBox="0 0 400 100" role="img" aria-label="Schermo del telefono fisso con la scritta Comune di Valdorna e la durata della chiamata"><rect width="400" height="100" rx="12" fill="#f2f6f8"/>${bars}<text x="24" y="16" font-size="10" fill="#5d6b73" font-family="sans-serif">Comune di Valdorna · chiamata in corso</text></svg>`;
})();

const nodes: Node[] = [
  scene('Capitolo 6 — Devi farlo subito', 'Valdorna · cucina di Elio · venerdì mattina', 'warm', 'cucina'),
  say('narr', 'Venerdì, nove e mezza. Elio ha preparato il caffè e ha steso sul tavolo tre bollette, una sopra l’altra. Marta sta per spiegargli dove si legge il consumo, quando squilla il telefono fisso.'),
  say('elio', 'Strano, a quest’ora… guarda, c’è scritto «Comune di Valdorna». Rispondo.', 'surprised'),
  say('narr', 'Elio mette il vivavoce per farle sentire. La voce è calma, familiare.'),
  act('a6_call'),

  ev('ev_telefonata_elio'),
  say('elio', 'Ma allora… devo fare questo bonifico? Il sindaco non mi chiamerebbe mai per niente.', 'worried'),
  say('marta', 'Fermiamoci un momento, Elio. Non dobbiamo rispondere subito: possiamo prendere tempo.', 'thinking'),
  learn('secondo-canale'),
  choice('c6_call', 'Il chiamante è ancora in linea e aspetta una risposta. Cosa fai?', [
    { text: 'Dico che richiamo io, riaggancio e chiamo il Comune al numero del sito.', to: 'r6_callback', set: { hung_up_called_back: true }, skill: { metodo: 1, fonti: 1 } },
    { text: 'Gli chiedo di dimostrare che è il sindaco, facendogli domande.', to: 'r6_quiz', set: { questioned_caller: true } },
    { text: 'Lascio che continui a parlare, per capire cosa vuole davvero.', to: 'r6_listen', set: { let_it_go_on: true } },
  ], 'Chi chiama decide il ritmo. Interrompere non è maleducato: è l’unico modo di riprendere in mano la situazione.'),

  label('r6_callback'),
  say('marta', 'Sa cosa? Preferisco richiamare io. Mi dica il suo nome e il reparto, e chiamo il centralino.', 'neutral'),
  say('narr', 'Dall’altra parte c’è un silenzio, poi: «Non c’è tempo, ne parli con me ora». Marta riaggancia con calma.'),
  say('elio', 'Ho il cuore che batte forte. Ma ho fatto bene a non dire niente.', 'worried'),
  say('marta', 'Hai fatto benissimo. Succede a molti: la fretta è fatta apposta per questo.'),
  go('after_call'),

  label('r6_quiz'),
  say('marta', 'Mi dica una cosa che solo il sindaco può sapere: il nome del suo cane?', 'neutral'),
  say('narr', 'La voce esita, poi cambia tono: «Questi sono dettagli. Il tempo stringe, mi dia i dati del conto di Elio così faccio io il bonifico».'),
  say('marta', 'No, grazie. Riaggancio e richiamo il Comune.', 'worried'),
  say('davide', '(al telefono, dopo) Le domande personali possono funzionare a volte, ma chi ha informazioni su di lui le sa: non è un metodo affidabile. Quello che conta è richiamare tu.'),
  go('after_call'),

  label('r6_listen'),
  say('narr', 'Il chiamante continua: «Poi per sicurezza mi serve il numero della sua carta, solo per una verifica». Elio guarda Marta.'),
  say('marta', 'Basta così. Riaggancio.', 'worried'),
  say('elio', 'Per un attimo stavo per dargli retta. Mi vergogno un po’.', 'hurt'),
  say('marta', 'Non c’è nulla di cui vergognarsi, Elio. Queste telefonate sono costruite per funzionare. Ti sei fermato in tempo, ed è quello che conta.'),
  go('after_call'),

  label('after_call'),
  say('narr', 'Il telefono resta muto. Marta apre il quaderno e annota quello che ha sentito, finché è fresco.'),
  act('a6_iban'),

  ev('ev_iban_azienda'),
  caso('arup'),
  say('marta', 'Un contributo “al Comune” su un conto privato… non mi torna.', 'thinking'),
  say('narr', 'Marta chiama il centralino del Comune al numero stampato sul sito. Risponde Irene.'),
  say('irene', 'Nessuno ha chiamato Elio da qui. E il Comune non chiede mai contributi per bonifico a un cittadino al telefono. Fai bene a dirmelo: lo segnaliamo.', 'worried'),
  say('marta', 'Dopo il vocale e l’SMS, questa è la terza cosa che ha lo stesso odore: fretta, un rimborso o un contributo, un ente conosciuto.', 'thinking'),
  say('davide', 'Possiamo annotare una cosa: in tre messaggi diversi compare lo stesso schema. Non sappiamo se dietro ci sia la stessa persona.'),
  act('a6_sort'),

  say('elio', 'Quindi la regola è: se mi mettono fretta, mi fermo e richiamo io.', 'smile'),
  say('marta', 'Esatto. E se qualcuno ti chiede di non dirlo a nessuno, è proprio il momento di dirlo a qualcuno.'),
  chat('Davide Rinaldi', 'Messaggi', [
    { from: 'Davide Rinaldi', text: 'Domani mattina in libreria, alle dieci. Ho messo tutto nel quaderno in ordine di tempo. Ora vediamo cosa regge e cosa no. Porta anche Nicola, se vuole venire.', time: '18:20' },
  ]),
  say('marta', 'Ci sarò.', 'smile'),
  { t: 'end', summary: [
    'Il numero sul display si può falsificare: non è una prova di chi chiama.',
    'Segretezza, fretta e bonifico sono la combinazione tipica della pressione.',
    'Interrompere una telefonata non è maleducato: richiama tu, su un numero che trovi da solo.',
    'Un ente pubblico non chiede pagamenti al telefono su conti privati.',
    'Chi si ferma in tempo ha fatto la cosa giusta, anche se per un attimo ha creduto.',
  ] },
];

export const ch6: Chapter = {
  id: 'ch6', n: 6, title: 'Devi farlo subito', subtitle: 'Urgenza, pressione e ingegneria sociale',
  goals: ['Riconoscere fretta e segretezza', 'Interrompere e richiamare da soli', 'Non vergognarsi di essersi fermati in tempo'],
  nodes,
  activities: {
    a6_call: {
      id: 'a6_call', kind: 'inspect', variant: 'call', title: 'La telefonata',
      scene: 'cucina',
      intro: 'Il gioco non riproduce suoni: leggi la telefonata come se la sentissi. Tocca le parti sottolineate.',
      coach: 'Tocca le frasi sottolineate. Quando hai guardato abbastanza, vai avanti.',
      art: WAVE,
      header: [
        { label: 'Sul display', value: '«Comune di Valdorna»', h: { title: 'Il nome sullo schermo non è una prova', why: 'Chi chiama può far comparire il nome o il numero che vuole. Il display dice cosa appare, non chi chiama.', easy: 'Il nome sullo schermo si può falsificare.', signal: true } },
        { label: 'Voce', value: 'calma, simile a quella del sindaco', h: { title: 'Somiglia, ma non basta', why: 'Dopo il vocale del giovedì, una voce familiare non prova nulla da sola.', easy: 'Una voce che somiglia non dice chi parla.', signal: false } },
      ],
      body: [
        [{ x: '«Sono Paolo, serve un contributo di 400 euro per le cisterne di Borgo Alto, oggi.»', h: { title: 'Una richiesta di denaro, oggi', why: 'Un contributo si chiede con un atto ufficiale e con tempi normali, non con una telefonata a un cittadino.', easy: 'Chiede soldi per telefono, in giornata.', signal: true } }],
        [{ x: '«Non lo dica a nessuno, è una cosa riservata.»', h: { title: 'Segretezza', why: 'Chiederti di non parlarne ti isola proprio da chi potrebbe aiutarti a controllare.', easy: 'Ti chiede di non parlarne con nessuno.', signal: true } }],
        [{ x: '«Faccia un bonifico adesso, le detto io il conto.»', h: { title: 'Pagamento immediato su un conto dettato a voce', why: 'Un ente pubblica i propri conti sul proprio sito. Un conto detto a voce, al telefono, è un campanello.', easy: 'Vuole un bonifico subito, su un conto che detta lui.', signal: true } }],
        [{ x: '«Si fida di me, vero? Siamo vicini di valle.»', h: { title: 'Appello alla fiducia', why: 'Far leva sul rapporto personale è un modo per non farti controllare.', easy: 'Usa la fiducia per non farti controllare.', signal: true } }],
      ],
      need: 3,
      question: 'Cosa ti dice di più, in questa telefonata?',
      verdicts: [
        { text: 'Il comportamento: fretta, segretezza e bonifico su un conto dettato a voce.', ok: true, feedback: 'Esatto. Più della voce o del display, a pesare è quello che ti chiede di fare e come.' },
        { text: 'La voce: somiglia al sindaco, quindi è lui.', feedback: 'Dopo il vocale di ieri sappiamo che le voci si possono imitare. Conta quello che ti chiede.' },
        { text: 'Il display: dice “Comune di Valdorna”.', feedback: 'Il nome sullo schermo si può falsificare: non prova chi chiama.' },
      ],
      hints: [
        'Non guardare solo chi sembra. Guarda cosa ti chiede di fare.',
        'Fretta, segretezza, bonifico su un conto dettato a voce: sono i tre segnali.',
        'La risposta è il comportamento: fretta, segretezza e bonifico.',
      ],
    },

    a6_iban: {
      id: 'a6_iban', kind: 'factcheck', title: 'Il conto è del Comune?',
      scene: 'cucina',
      intro: 'Marta ha annotato un IBAN (mascherato). Controlla a chi è intestato e dove un ente pubblica i propri conti.',
      coach: 'Tocca una fonte per leggerla. Dopo almeno due, potrai rispondere.',
      claim: '«Il conto detto al telefono è quello del Comune di Valdorna.»',
      sources: [
        { id: 's_iban', name: 'Conto annotato da Marta: IT00 XXXX… intestato a “Cisterne Alpine Servizi S.r.l.s.”', kind: 'Appunto di Marta', date: 'Venerdì, 09:55', evidence: 'ev_iban_azienda', useful: true,
          text: ['Il nome della ditta (inventato) è quello che il chiamante ha detto per l’intestazione. Il conto è privato.'],
          who: 'Annotato da Marta mentre il chiamante dettava.', when: 'Oggi.', proof: 'Un appunto: non è un documento.',
          note: 'È un fatto riportato da chi era presente: l’intestatario non è il Comune. Non dice chi sia dietro la ditta.' },
        { id: 's_sito', name: 'Pagina “Pagamenti” del sito del Comune', kind: 'Sito del Comune', date: 'Consultata oggi', useful: true,
          text: ['Il Comune pubblica i propri conti correnti e invita a verificare sempre l’intestazione. Non chiede contributi per telefono.'],
          who: 'Il Comune, sul proprio sito.', when: 'Aggiornata quest’anno.', proof: 'Un elenco ufficiale che chiunque può consultare.',
          note: 'Fonte ufficiale da cercare da soli: se il conto non è in questa pagina, non è del Comune.' },
        { id: 's_voce', name: '«L’ho sentito io, era proprio lui»', kind: 'Parere di un conoscente', date: 'Oggi', useful: false, misleading: true,
          text: ['«Era identico, di sicuro è il Comune.»'],
          who: 'Un conoscente.', when: 'Oggi.', proof: 'Nessuna.',
          note: 'Riconoscere una voce non basta, e non dice nulla su di chi sia il conto.' },
      ],
      question: 'A chi è intestato il conto, secondo quello che hai controllato?',
      verdicts: [
        { text: 'A una ditta privata, non al Comune: quel conto non è tra quelli pubblicati dall’ente.', ok: true, feedback: 'Esatto. Dici cosa sai (intestatario e confronto col sito) senza accusare nessuno.' },
        { text: 'Al Comune: lo ha detto una voce che somiglia al sindaco.', feedback: 'La voce non basta. L’intestazione e la pagina ufficiale dicono il contrario.' },
        { text: 'A una ditta privata che quindi è sicuramente la truffatrice.', feedback: 'Non sai chi ci sia dietro quella ditta. Dire “conto non del Comune” è solido; accusare la ditta no.' },
      ],
      hints: [
        'Dove un ente pubblica i propri conti? Cosa dice l’intestazione?',
        'L’appunto dà l’intestatario, la pagina del Comune dà l’elenco ufficiale. I pareri non contano.',
        'Conto privato, non nell’elenco del Comune. Non accusare nessuno senza prove.',
      ],
    },

    a6_sort: {
      id: 'a6_sort', kind: 'sort', title: 'Cosa fare, cosa evitare',
      scene: 'cucina',
      intro: 'Elio vuole una piccola regola da tenere vicino al telefono. Metti ogni mossa nella casella giusta.',
      coach: 'Tocca una carta, poi tocca la casella in cui metterla.',
      prompt: 'Cosa aiuta davvero quando qualcuno ti mette fretta?',
      columns: [{ id: 'fare', label: 'Aiuta' }, { id: 'evitare', label: 'Da evitare' }],
      items: [
        { id: 'k1', text: 'Dire «ti richiamo io» e riagganciare', answer: 'fare', why: 'Ti ridà il controllo del tempo.' },
        { id: 'k2', text: 'Cercare il numero ufficiale da soli', answer: 'fare', why: 'Il secondo canale lo scegli tu.' },
        { id: 'k3', text: 'Parlarne con una persona di fiducia', answer: 'fare', why: 'La segretezza è proprio ciò che la pressione vuole.' },
        { id: 'k4', text: 'Fare il bonifico «poi si sistema»', answer: 'evitare', why: 'Un bonifico è difficile da recuperare.' },
        { id: 'k5', text: 'Dare i dati della carta «per verifica»', answer: 'evitare', why: 'Una verifica vera non passa da lì.' },
        { id: 'k6', text: 'Richiamare il numero che compare sul display', answer: 'evitare', why: 'Potrebbe portare di nuovo a chi ha chiamato.' },
      ],
      hints: [
        'Chiediti: questa mossa mi dà tempo e controllo, oppure li toglie?',
        'Ricontrollare e parlarne aiuta. Pagare subito e dare dati no.',
        'Aiuta: k1, k2, k3. Da evitare: k4, k5, k6.',
      ],
    },
  },
};
