import type { Chapter, Node } from '../types';
import { act, choice, ev, go, ifEv, ifFlag, label, learn, say, scene } from './helpers';

/** Prove chiave per la conclusione: se una manca, Davide la riporta in tavola (nessun vicolo cieco). */
const KEY: { id: string; line: string }[] = [
  { id: 'ev_filigrana', line: 'l’avviso del 2019 con la filigrana, che prova da dove viene il ritaglio' },
  { id: 'ev_dominio_recente', line: 'il sito del finto rimborso, nato il 19 ottobre' },
  { id: 'ev_smentita_sindaco', line: 'la smentita del sindaco, con la riunione di Giunta alle 8:40' },
  { id: 'ev_iban_azienda', line: 'il conto della telefonata, intestato a una ditta privata' },
  { id: 'ev_irene_bozza', line: 'la bozza di Irene, che spiega il post sparito' },
  { id: 'ev_nicola_ammette', line: 'l’ammissione di Nicola sul ritaglio' },
  { id: 'ev_rocco_nessun_legame', line: 'l’assenza di legami provati tra Rocco e la frode' },
];

const catchUp: Node[] = KEY.flatMap(({ id, line }, i): Node[] => [
  ifEv(id, `ku_${i}`),
  say('davide', `Qui ho ancora ${line}. Mettiamolo nel quaderno.`),
  ev(id),
  label(`ku_${i}`),
]);

const nodes: Node[] = [
  scene('Capitolo 8 — La tua conclusione', 'Valdorna · piazza · domenica, al tramonto', 'warm', 'piazza-sera'),
  say('narr', 'Domenica, le sei meno dieci. Sulla piazza ci sono una trentina di persone: qualcuno con la sedia portata da casa, qualcuno in piedi vicino al forno. Il sindaco ha chiesto a Marta di parlare.'),
  say('davide', 'Una cosa sola, prima di cominciare. Controlliamo il quaderno: voglio che tu parta da quello che hai davvero.'),
  ...catchUp,
  act('a8_timeline'),
  say('marta', '(tra sé) Alcune cose le so, altre le penso, altre ancora non le so affatto. Devo dirle tutte e tre, con parole diverse.', 'thinking'),
  learn('certezza'),
  act('a8_sort'),
  say('davide', 'Ultima cosa. Quello che dirai in piazza lo rileggeranno in tanti. Come vuoi dirlo?'),

  choice('c8_final', 'Davanti alla piazza, che cosa dici?', [
    { text: 'Racconto cosa sappiamo, cosa è probabile e cosa non sappiamo. Indico le fonti e chiedo a chi ha inoltrato di correggere.', to: 'pre_a', requiresEvidence: 'ev_rocco_nessun_legame', lockedHint: 'Ti manca ancora la prova su Rocco: torna sul quaderno.', skill: { metodo: 1, fonti: 1 } },
    { text: 'Faccio il nome di chi secondo me è il colpevole: Rocco, perché è l’unico che ci guadagna.', to: 'end_b', set: { final_b: true } },
    { text: 'Non dico nulla: meglio non sbilanciarsi, sono solo indizi.', to: 'end_c', set: { final_c: true } },
  ], 'Non esiste una risposta che dimostri tutto. Esiste quella che dice la verità sul grado di certezza.'),

  label('pre_a'),
  say('marta', 'Racconto la storia in ordine: avviso del 2019, SMS, vocale, telefonata. Poi arrivo al punto più delicato.', 'neutral'),
  choice('c8_cousin', 'Rimane una domanda: chi ha scritto il messaggio del “cugino” e chi c’è dietro la frode?', [
    { text: 'Dico chiaramente che non lo sappiamo e non faccio nomi.', to: 'end_a', set: { final_a: true }, skill: { metodo: 2 } },
    { text: 'Dico che il “cugino” è un amico di Nicola e che la frode è una sola dall’inizio alla fine.', to: 'end_d', set: { final_d: true } },
  ], 'Cosa fai con un buco che le prove non colmano?'),

  label('end_a'),
  say('marta', 'Quello che sappiamo è questo: l’avviso del 2019 era vero ed è stato revocato dopo cinque giorni. Quello che gira adesso è un ritaglio senza data.', 'neutral'),
  say('marta', 'Quello che è probabile: il vocale è stato fabbricato copiando la voce dai video del consiglio. Il sindaco era in Giunta alle 8:40, e c’è la registrazione.', 'neutral'),
  say('marta', 'Quello che non sappiamo: chi ha scritto il messaggio del “cugino” e chi c’è dietro il finto rimborso. Non faccio nomi, perché non ho prove.', 'neutral'),
  ifFlag('nicola_corrects', 'a_nicola'),
  say('marta', 'Chi ha inoltrato l’avviso: se vuole, lo corregga nel gruppo.', 'smile'),
  go('a_close'),
  label('a_nicola'),
  say('nicola', 'Io ho ritagliato quell’immagine. Ho già scritto la correzione con la foto vera e la data: la trovate nel gruppo.', 'hurt'),
  label('a_close'),
  say('irene', 'Domani sul sito troverete il comunicato corretto, con scritto che l’acqua è potabile e i controlli del gestore.', 'smile'),
  say('paolo', 'E d’ora in poi chi riceve una richiesta che sembra mia, può chiamare il Comune su questo numero. Quello del sito, non quello del display.', 'smile'),
  say('elio', 'Io l’ho imparato in cucina. Se qualcuno mi mette fretta, riaggancio e chiamo io.', 'smile'),
  say('lina', 'Marta, stamattina mi è arrivato un altro messaggio sull’acqua. Prima di inoltrarlo ho guardato la data e il sito del Comune. Era vecchio.', 'smile'),
  say('davide', 'Hai detto quello che sai, quello che pensi e quello che non sai. Più di così, una verifica non può fare.', 'smile'),
  { t: 'end', ending: 'A', endingTitle: 'La Verifica', summary: [
    'Hai separato ciò che è dimostrato da ciò che è probabile e da ciò che non si sa.',
    'Hai indicato le fonti e non hai fatto nomi senza prove.',
    'Chi aveva sbagliato in buona fede ha potuto correggere senza essere messo alla gogna.',
    'Una conclusione calibrata non è la più clamorosa: è quella che regge.',
  ] },

  label('end_b'),
  say('marta', 'Il colpevole è Rocco. Ha pagato le inserzioni, è l’unico che ci guadagna.', 'worried'),
  say('narr', 'Il brusio cambia direzione. Qualcuno annuisce, qualcun altro si volta. Rocco, in fondo alla piazza, resta fermo.'),
  say('rocco', 'Io le inserzioni le ho pagate, è vero. Ma non ho scritto nessun SMS. Mi state mettendo in mezzo alla gente senza una prova.', 'hurt'),
  say('davide', 'Marta, “ci guadagna” non è una prova. Adesso la smentita del sindaco si perde dietro a una nuova accusa.', 'worried'),
  say('marta', 'Hai ragione. Ho detto più di quanto so.', 'hurt'),
  say('davide', 'Si può ancora riparare: correggere in pubblico, rileggere il quaderno, dire cosa sappiamo davvero. Se vuoi, ripetiamo l’ultima scelta insieme.'),
  { t: 'end', ending: 'B', endingTitle: 'Il dito puntato', summary: [
    'Accusare senza prove sposta l’attenzione dalla smentita all’accusa.',
    '“Ci guadagna” è un motivo, non una prova.',
    'Si può riparare: correggere in pubblico è sempre possibile. Puoi rigiocare l’ultima scelta.',
  ] },

  label('end_c'),
  say('marta', 'Ho riletto tutto. Per ora preferisco non dire nulla: sono solo indizi.', 'worried'),
  say('narr', 'La piazza si svuota in silenzio. Il vocale continua a girare nei gruppi, e il finto sito resta online.'),
  say('elio', 'Io almeno non ho pagato. Ma pensavo che qualcuno lo dicesse a tutti.', 'worried'),
  say('davide', 'Il silenzio è una scelta. Ma c’era qualcosa di dimostrato da dire: il vocale è smentito, il conto non è del Comune. Non dirlo lascia spazio solo a chi mette fretta.'),
  { t: 'end', ending: 'C', endingTitle: 'Meglio tacere', summary: [
    'Non dire nulla non è neutrale: lascia il campo a chi diffonde il falso.',
    'Si può essere prudenti e utili insieme: dire ciò che è dimostrato, tacere ciò che non lo è.',
    'Puoi rigiocare l’ultima scelta.',
  ] },

  label('end_d'),
  say('marta', 'Il “cugino” è un amico di Nicola, e la frode è una sola dall’inizio alla fine.', 'worried'),
  say('nicola', 'Io non conosco nessun cugino. Non lo so da dove sia uscito. Sai qualcosa che io non so?', 'hurt'),
  say('davide', 'Marta, sulla parte del ritaglio e del vocale hai detto cose giuste. Ma su queste due non abbiamo prove: sono ipotesi presentate come fatti.', 'worried'),
  say('marta', 'Avevo la sensazione di dover chiudere il cerchio.', 'hurt'),
  say('davide', 'La voglia di una storia completa è comprensibile. Una verifica accetta anche i buchi.'),
  { t: 'end', ending: 'D', endingTitle: 'Verità a metà', summary: [
    'Una conclusione giusta può essere rovinata da un’aggiunta senza prove.',
    'Dichiarare cosa non sai rende più credibile ciò che sai.',
    'Puoi rigiocare l’ultima scelta.',
  ] },
];

export const ch8: Chapter = {
  id: 'ch8', n: 8, title: 'La tua conclusione', subtitle: 'Presentazione dei risultati e finali alternativi',
  goals: ['Riassumere con onestà', 'Dichiarare il grado di certezza', 'Correggere senza accusare'],
  nodes,
  activities: {
    a8_timeline: {
      id: 'a8_timeline', kind: 'timeline', title: 'La storia che racconti',
      scene: 'piazza-sera',
      intro: 'Prima di parlare, rimetti in ordine la storia. Il filo è quello che racconterai in piazza.',
      coach: 'Usa «Su» e «Giù» per spostare ogni riquadro. Quando ti sembra giusto, tocca «Controlla l’ordine».',
      prompt: 'Come sono andate le cose, in breve?',
      items: [
        { id: 'u1', text: 'Un avviso vero del 2019 viene ritagliato e condiviso senza data.', why: 'L’origine: un ritaglio in buona fede.' },
        { id: 'u2', text: 'Gira l’SMS del finto rimborso con un sito nato il 19 ottobre.', why: 'La frode si innesta sull’ansia.' },
        { id: 'u3', text: 'Un vocale con la voce del sindaco, smentito con l’agenda della Giunta.', why: 'Una voce copiata dai video pubblici.' },
        { id: 'u4', text: 'Una telefonata a Elio chiede un bonifico su un conto privato.', why: 'Il passo concreto, fermato in tempo.' },
      ],
      hints: [
        'Parti dall’avviso del 2019 ritagliato. La frode viene dopo.',
        'SMS, poi vocale, poi telefonata: lo stesso schema che sale di livello.',
        'Ordine: ritaglio → SMS → vocale → telefonata.',
      ],
    },

    a8_sort: {
      id: 'a8_sort', kind: 'sort', title: 'Cosa dire, cosa non dire',
      scene: 'piazza-sera',
      intro: 'Quali frasi puoi dire in piazza senza aver bisogno di altre prove?',
      coach: 'Tocca una carta, poi tocca la casella in cui metterla.',
      prompt: 'Cosa è solido e cosa no?',
      columns: [{ id: 'dire', label: 'Posso dirlo' }, { id: 'no', label: 'Non lo dico come fatto' }],
      items: [
        { id: 'z1', text: 'Il vocale è smentito: alle 8:40 il sindaco era in Giunta.', answer: 'dire', why: 'Smentita e registrazione verificabili.' },
        { id: 'z2', text: 'Il conto della telefonata non è del Comune.', answer: 'dire', why: 'Intestatario e pagina ufficiale lo mostrano.' },
        { id: 'z3', text: 'Il sito del rimborso è stato registrato il 19 ottobre.', answer: 'dire', why: 'Dato verificabile.' },
        { id: 'z4', text: 'Rocco ha organizzato la frode.', answer: 'no', why: 'Nessuna prova lo lega alla frode.' },
        { id: 'z5', text: 'Il Comune ha cancellato il post per nascondere qualcosa.', answer: 'no', why: 'La bozza spiega il refuso.' },
        { id: 'z6', text: 'Il “cugino” è un amico di Nicola.', answer: 'no', why: 'Non abbiamo nessuna prova.' },
      ],
      hints: [
        'Chiediti: ho una prova verificabile? Altrimenti non è un fatto.',
        'Smentita, intestazione del conto e data di registrazione sono fatti. Le accuse no.',
        'Posso dire: z1, z2, z3. Non lo dico come fatto: z4, z5, z6.',
      ],
    },
  },
};
