import type { Chapter, Node } from '../types';
import { act, caso, choice, chat, ev, go, ifFlag, label, learn, say, scene } from './helpers';

/** Forma d’onda del vocale (resa a barre: il gioco è offline e non contiene audio). */
const WAVE = (() => {
  const h = [8, 14, 22, 30, 18, 12, 26, 34, 28, 16, 10, 24, 32, 20, 14, 28, 36, 22, 12, 18, 30, 26, 14, 10, 20, 32, 24, 16, 12, 26, 34, 18];
  const bars = h.map((v, i) => `<rect x="${20 + i * 11}" y="${50 - v}" width="6" height="${v * 2}" rx="3" fill="${i < 14 ? '#2f6b7a' : '#9aa9b3'}"/>`).join('');
  return `<svg viewBox="0 0 400 100" role="img" aria-label="Forma d’onda di un vocale di 38 secondi, con un solo segno di avanzamento: nessun silenzio, nessun rumore di fondo"><rect width="400" height="100" rx="12" fill="#f2f6f8"/>${bars}<path d="M174 8v84" stroke="#b5532f" stroke-width="3"/><text x="180" y="18" font-size="9" fill="#b5532f" font-family="sans-serif">0:14</text><text x="20" y="96" font-size="9" fill="#5d6b73" font-family="sans-serif">0:00</text><text x="364" y="96" font-size="9" fill="#5d6b73" font-family="sans-serif">0:38</text></svg>`;
})();

const nodes: Node[] = [
  scene('Capitolo 5 — Una voce familiare', 'Valdorna · libreria “Il Segnalibro” · giovedì mattina', 'cool', 'libreria-cool'),
  say('narr', 'Giovedì mattina. Il vocale ha fatto il giro di mezza valle prima delle otto: qualcuno lo ha mandato in cinque gruppi, qualcuno lo ha cambiato di nome per farlo sembrare più “ufficiale”.'),
  say('davide', 'Ascoltiamolo una volta sola, insieme. Poi lo mettiamo da parte. Ricorda: non è una prova, è un oggetto da esaminare.'),
  say('marta', '(sottovoce) Sembra proprio lui. Quel tono calmo che ha quando parla in consiglio.', 'worried'),
  act('a5_audio'),

  ev('ev_audio_sindaco'),
  say('marta', 'Quindi non posso dire che sia lui, e nemmeno che non lo sia.', 'thinking'),
  say('davide', 'Esatto. Dire «non lo so ancora» è la risposta onesta. Adesso però serve un secondo canale: un modo di controllare che non passi da chi ci scrive.'),
  learn('secondo-canale'),
  choice('c5_second', 'Come verifichi se quella voce è davvero del sindaco?', [
    { text: 'Chiamo il Comune al numero ufficiale, quello del sito, non quello da cui è arrivato il vocale.', to: 'r5_call', set: { called_mayor: true }, skill: { metodo: 1, fonti: 1 } },
    { text: 'Chiedo a Nicola: lui conosce tutti in paese.', to: 'r5_nicola', set: { asked_nicola_audio: true } },
    { text: 'Mando il vocale a Davide e gli chiedo se secondo lui è vero.', to: 'r5_davide', set: { asked_davide_audio: true } },
  ], 'Il secondo canale va scelto da te: un numero che trovi tu, una persona che puoi controllare. Mai quello che ti propone il messaggio.'),

  label('r5_nicola'),
  chat('Nicola Moretti', 'Messaggi', [
    { from: 'Marta', me: true, text: 'Nicola, hai sentito il vocale del sindaco? Secondo te è lui?', time: '08:34', },
  ]),
  ifFlag('nicola_open', 'n_open'),
  say('nicola', 'Sembra proprio lui! L’ho ricevuto da quattro persone. Se è vero bisogna dirlo a tutti, subito.', 'worried'),
  say('marta', 'Aspetta, per favore. Non lo giro. Provo a verificarlo con il Comune e ti dico.', 'neutral'),
  say('nicola', 'Va bene. Ma se è vero me lo dici subito, eh.', 'neutral'),
  go('r5_call'),
  label('n_open'),
  say('nicola', 'Sembra proprio lui. Però, dopo la foto del 2021, io stavolta aspetto: non lo giro finché non lo sappiamo. Tienimi aggiornato.', 'smile'),
  say('marta', 'Grazie Nicola. Ti scrivo appena so.'),
  go('r5_call'),

  label('r5_davide'),
  say('davide', 'Posso dirti cosa penso: questa voce somiglia a quella del sindaco. Ma a orecchio non si può dire se è vera o fabbricata, e anche gli esperti usano strumenti. Il modo più rapido è chiedere a lui.'),
  go('r5_call'),

  label('r5_call'),
  scene('In Comune', 'Municipio di Valdorna · ufficio del sindaco', 'day', 'municipio'),
  say('narr', 'Il numero del Comune è quello stampato in cima al sito. Risponde Irene al terzo squillo.'),
  say('irene', 'Marta! Stavo per chiamarti. Sì, il vocale… siamo già in allerta. Il sindaco è qui, vieni.', 'worried'),
  say('paolo', 'Marta, grazie di essere venuta. Mi hanno detto che il vocale gira da stamattina. Non l’ho mai registrato.', 'worried'),
  say('marta', 'Dove era alle otto e quaranta?'),
  say('paolo', 'In Giunta. È una riunione aperta, c’era anche un gruppo di cittadini e la diretta registrata. Irene le dà il link. Sentirmi parlare lì, nell’orario in cui dicono sia stato registrato il vocale, è la prova più facile da controllare.'),
  say('irene', 'La riunione dura dalle 8:30 alle 10. Nel video si vede il sindaco che parla alle 8:40.'),
  act('a5_check'),

  ev('ev_rilevatore'),
  say('davide', 'Prima, giusto per curiosità, ho provato un sito che promette di riconoscere le voci false. Guarda cosa dice.'),
  say('narr', 'Sullo schermo: «Probabilità di voce sintetica: 87%». Poi Davide carica una registrazione vera del sindaco, presa dalla diretta di stamattina: il sito risponde «41%».'),
  say('marta', 'Ma… su una registrazione vera dice 41%?', 'surprised'),
  say('davide', 'Appunto. Questi strumenti possono aiutare, ma sbagliano in entrambi i sensi. Una percentuale non è una prova. Fa piacere che il caso abbia un secondo canale vero.'),
  learn('voce-clonata'),
  caso('zelensky'),
  say('davide', 'Nell’Archivio ho aggiunto un caso vero, quello del video falso di Zelensky: anche lì la smentita è arrivata dalla persona stessa, non da un software.'),
  say('paolo', 'Una cosa mi dispiace. Sono anni che registriamo e pubblichiamo ogni consiglio, per trasparenza. È un diritto dei cittadini. Ma il materiale è lì, per chi vuole copiarlo.', 'hurt'),
  say('marta', 'La trasparenza non è un errore, signor sindaco. Il problema è chi ne approfitta.'),
  say('paolo', 'Mi aiuti: ho preparato una smentita ufficiale. Come pensa che si debba diffondere?'),
  choice('c5_share', 'Il sindaco chiede come far girare la smentita. Cosa suggerisci?', [
    { text: 'Pubblico la smentita con il link al sito del Comune, senza rimettere in giro il vocale.', to: 'r5_denial', set: { posted_denial: true }, skill: { fonti: 1 } },
    { text: 'Faccio uno screenshot della trascrizione del vocale e lo allego, così si capisce a cosa mi riferisco.', to: 'r5_reshare', set: { reshared_fake: true } },
    { text: 'Aspetto che sia il Comune a pubblicare.', to: 'r5_wait', set: { waited_denial: true } },
  ], 'Pensa a chi leggerà: vedrà prima il falso o la smentita?'),
  label('r5_denial'),
  say('davide', 'Ottimo. Quando smentisci un falso, descrivilo ma non rilanciarlo: chi vede solo il falso in miniatura potrebbe ricordare quello.'),
  go('after_share'),
  label('r5_reshare'),
  say('davide', 'Capisco il gesto, ma quella trascrizione contiene proprio le frasi false: chi la vede scorrendo può ricordare quelle. Meglio una smentita che descriva senza riportare.'),
  say('marta', 'Hai ragione. La tolgo e riscrivo.', 'worried'),
  go('after_share'),
  label('r5_wait'),
  say('paolo', 'La pubblicheremo noi, ma nel frattempo il vocale gira. Se può aiutarci, ci farebbe comodo.'),
  say('davide', 'Il Comune ha il canale ufficiale, ma tu puoi dare una mano a farla arrivare a chi legge: la smentita con il link, senza il falso.'),
  go('after_share'),

  label('after_share'),
  scene('Collegamenti', 'Libreria · pomeriggio', 'day', 'scrivania'),
  say('marta', 'Mi colpisce una cosa. Nel vocale dice «servizio rimborsi Valdorna Servizi». Lo stesso nome dell’SMS.', 'thinking'),
  say('davide', 'Sì. Stesso nome, stessa fretta, stessa promessa di rimborso. Può essere la stessa regia o qualcuno che ha copiato l’idea. Non lo sappiamo.'),
  say('marta', 'Possiamo scriverlo nel quaderno?'),
  say('davide', 'Possiamo scrivere i fatti: lo stesso nome compare in due messaggi diversi. Quanto al resto, per ora è una supposizione.'),
  chat('Elio Marchetti', 'Messaggi', [
    { from: 'Elio Marchetti', text: 'Marta, domani mattina passi da me? Mi hai promesso di spiegarmi come si legge la bolletta. Ti preparo il caffè.', time: '17:48' },
  ]),
  say('marta', 'Va bene, Elio. Alle nove.', 'smile'),
  { t: 'end', summary: [
    'Una voce che somiglia a quella di una persona nota non basta: anche i falsi migliori sembrano veri.',
    'Un audio non è una prova da solo: serve un secondo canale che scegli tu (un numero ufficiale, una persona che puoi controllare).',
    'I rilevatori di deepfake aiutano ma non sono infallibili: una percentuale non è una prova.',
    'Quando smentisci un falso, descrivilo senza rilanciarlo e rimanda alla smentita ufficiale.',
    'Chi parla spesso in pubblico lascia molti campioni della sua voce: non è colpa sua.',
  ] },
];

export const ch5: Chapter = {
  id: 'ch5', n: 5, title: 'Una voce familiare', subtitle: 'Audio, video e contenuti manipolati',
  goals: ['Capire che un audio non è una prova', 'Usare un secondo canale indipendente', 'Non fidarsi ciecamente dei rilevatori'],
  nodes,
  activities: {
    a5_audio: {
      id: 'a5_audio', kind: 'inspect', variant: 'audio', title: 'Il vocale del sindaco',
      intro: 'Qui il gioco non riproduce suoni: ti mostro la forma del vocale e la trascrizione. Tocca le parti sottolineate: alcune sono segnali, altre non dicono nulla da sole.',
      coach: 'Guarda la forma del vocale e tocca le frasi sottolineate. Quando hai guardato abbastanza, vai avanti.',
      art: WAVE,
      header: [
        { label: 'Arrivato da', value: 'numero sconosciuto, inoltrato più volte', h: { title: 'Non si sa chi l’abbia registrato', why: 'Nessuno si assume la responsabilità di averlo registrato: è passato di telefono in telefono. Un messaggio ufficiale arriva da un canale ufficiale.', easy: 'Non si sa da chi sia partito.', signal: true } },
        { label: 'Voce', value: 'molto simile a quella del sindaco', h: { title: 'Somiglia, ma non basta', why: 'Una voce può essere imitata con il computer a partire da registrazioni vere. Riconoscerla a orecchio non è una prova.', easy: 'Una voce che somiglia non dice chi parla.', signal: false } },
        { label: 'Qualità', value: 'ritmo regolare, nessun rumore di fondo', h: { title: 'Troppo pulita? Non si può dire', why: 'Un audio troppo regolare può insospettire, ma anche una registrazione vera, fatta bene, lo è. Da solo non dice se è falso.', easy: 'Può insospettire, ma non prova nulla.', signal: false } },
      ],
      body: [
        [{ x: '«Concittadini, sono Paolo Greco.»', h: { title: 'Si presenta con il nome', why: 'Chiunque può dire un nome. Quello che conta è come lo verifichi, non come si presenta.', easy: 'Dire il nome non basta.', signal: false } }],
        [{ x: '«L’acqua è contaminata e in Comune lo abbiamo nascosto.»', h: { title: 'Si accusa da solo, in un vocale', why: 'Un sindaco che avesse nascosto dei dati non lo annuncerebbe in un vocale anonimo: lo direbbe con un atto ufficiale. È strano, e non coincide con nulla di pubblicato.', easy: 'Dice una cosa grave in un modo strano.', signal: true } }],
        [{ x: '«Per un rimborso rapido, seguite il servizio rimborsi Valdorna Servizi.»', h: { title: 'Lo stesso nome dell’SMS', why: 'Questo nome compare anche nell’SMS di ieri e nel sito nato il 19 ottobre. Non dimostra che sia lo stesso autore, ma è un collegamento da annotare.', easy: 'È lo stesso nome dell’SMS.', signal: true } }],
        [{ x: '«Fate in fretta, entro stasera, e passate parola.»', h: { title: 'Fretta e passaparola', why: 'È la solita urgenza artificiale: ti chiede di fare in fretta e di diffondere.', easy: 'Ti mette fretta.', signal: true } }],
      ],
      need: 3,
      question: 'Che cosa puoi dire di questo audio, senza altre verifiche?',
      verdicts: [
        { text: 'Non posso dire se è lui: la voce somiglia, ma devo controllare con un altro canale.', ok: true, feedback: 'Esatto. È la risposta più solida: separi quello che senti da quello che puoi dimostrare.' },
        { text: 'È lui: la voce è identica.', feedback: 'Riconoscere una voce non basta: le voci si possono imitare. Prima di crederci, conviene controllare in un altro modo.' },
        { text: 'È sicuramente falso: si sente che è finto.', feedback: 'A orecchio non si può dire: i falsi migliori sembrano veri e alcuni audio veri sembrano strani. Meglio controllare.' },
      ],
      hints: [
        'Chiediti: da dove arriva? chi lo ha registrato? cosa dice di strano?',
        'La voce simile e l’audio pulito non provano nulla. Guarda il modo in cui è arrivato e cosa dice.',
        'Segnali: arrivo anonimo, auto-accusa strana, stesso nome dell’SMS, fretta. La risposta più solida: non posso dire se è lui, controllo con un altro canale.',
      ],
    },

    a5_check: {
      id: 'a5_check', kind: 'factcheck', title: 'È davvero il sindaco?',
      scene: 'sala',
      intro: 'Ora hai il sindaco davanti e un’agenda pubblica. Leggi le fonti e tieni come prove quelle solide.',
      coach: 'Tocca una fonte per leggerla. Dopo almeno due, potrai rispondere.',
      claim: '«Il vocale è davvero del sindaco Paolo Greco.»',
      sources: [
        { id: 's_smentita', name: 'Comunicato del sindaco: «Non ho mai registrato quel messaggio»', kind: 'Sito del Comune', date: 'Giovedì, 10:30', evidence: 'ev_smentita_sindaco', useful: true,
          text: ['«Non ho mai registrato quel messaggio. Alle 8:40 ero in riunione di Giunta, aperta al pubblico. Invito a non diffondere il vocale e a segnalarlo.»'],
          who: 'Il diretto interessato, con nome e carica.', when: 'Oggi.', proof: 'Rimanda a una riunione pubblica registrata.',
          note: 'Fonte diretta e verificabile: la persona interessata. Ma da sola potrebbe essere di parte: conta di più insieme all’agenda.' },
        { id: 's_agenda', name: 'Agenda e registrazione della Giunta', kind: 'Sito del Comune', date: 'Giovedì mattina', useful: true,
          text: ['Riunione di Giunta dalle 8:30 alle 10:00, aperta al pubblico. Registrazione integrale disponibile. Alle 8:40 interviene il sindaco.'],
          who: 'Il Comune, con orari e video.', when: 'Oggi.', proof: 'Un video con orario, controllabile da chiunque.',
          note: 'È la prova indipendente dalla sua parola: puoi guardarla tu. Rende molto improbabile che il vocale sia suo.' },
        { id: 's_video', name: 'Archivio video dei consigli comunali', kind: 'Sito del Comune', date: 'Aggiornato ogni mese', evidence: 'ev_video_consiglio', useful: true,
          text: ['Registrazioni integrali di tutti i consigli comunali dal 2016, con la voce del sindaco.'],
          who: 'Il Comune, per trasparenza.', when: 'Dal 2016.', proof: 'Video pubblici.',
          note: 'Spiega come sia possibile copiare la voce, non prova che sia stato fatto né da chi.' },
        { id: 's_rilev', name: '«Rileva la voce falsa»', kind: 'Sito di analisi automatica', date: 'Oggi', useful: false, misleading: true,
          text: ['«Probabilità di voce sintetica: 87%».'],
          who: 'Un sito che non dice chi lo gestisce né come funziona.', when: 'Oggi.', proof: 'Nessuna spiegazione.',
          note: 'Su una registrazione vera dà 41%. Uno strumento può sbagliare: la percentuale non è una prova.' },
        { id: 's_amici', name: 'Messaggio inoltrato: «È proprio la sua voce, la riconosco!»', kind: 'Messaggio inoltrato', date: 'Oggi', useful: false, misleading: true,
          text: ['«L’ho sentita cento volte in consiglio: è lui, ne sono sicura.»'],
          who: 'Una persona del paese.', when: 'Oggi.', proof: 'Nessuna.',
          note: 'Riconoscere una voce non basta quando le voci si possono copiare.' },
      ],
      question: 'Alla luce di quello che hai letto, cosa concludi?',
      verdicts: [
        { text: '«Molto probabilmente non è lui: ha smentito e ha un orario verificabile. Chi l’abbia fatto, non lo sappiamo.»', ok: true, feedback: 'Esatto: ti fermi al “molto probabile” e dichiari ciò che non sai. È una conclusione onesta e solida.' },
        { text: '«È lui: la voce è identica e lo dicono in tanti.»', feedback: 'Che molti lo dicano non lo rende vero, e le voci si possono copiare. C’è una smentita e un orario verificabile.' },
        { text: '«È un deepfake: e sappiamo chi l’ha fatto, chi vende i depuratori.»', feedback: 'Non c’è nessuna prova che colleghi qualcuno a quel vocale. Una conclusione comoda non è una conclusione dimostrata.' },
      ],
      hints: [
        'Chiediti: quale fonte è indipendente da chi mi scrive? Quale posso controllare io stessa?',
        'La smentita e l’agenda con la registrazione sono fonti dirette e verificabili. Il sito di analisi e i commenti no.',
        'Tieni smentita, agenda e video (per la possibilità). Conclusione: molto probabilmente non è lui, e non sappiamo chi l’abbia fatto.',
      ],
    },
  },
};
