import type { RealCase } from '../types';

/**
 * CASI REALI. Ogni scheda riporta solo ciò che le fonti consultate dicono esplicitamente.
 * Data di verifica delle fonti: 20/10/2026. Prima di aggiungere un caso: aprire la fonte, annotare URL e data.
 */
export const realCases: RealCase[] = [
  {
    id: 'squalo',
    title: 'Lo “squalo sull’autostrada allagata”',
    author: 'Snopes (verifica dei fatti)',
    date: '2011 (prima diffusione); riproposta in più occasioni fino al 2017',
    url: 'https://www.snopes.com/fake-photographs-hurricane-harvey-edition/',
    category: 'fuori-contesto',
    context: 'Durante diversi uragani una foto di uno squalo che nuota su una strada allagata è circolata come se fosse stata scattata sul momento.',
    facts: [
      'Secondo Snopes è un montaggio di due immagini distinte, non una foto autentica di un’alluvione.',
      'È comparsa nel 2011 con la didascalia “Porto Rico, uragano Irene” ed è ricomparsa con didascalie diverse (New York 2012, South Carolina 2015, Florida 2016, Texas 2017).',
    ],
    uncertain: ['Le fonti consultate non concordano su quale rivista abbia pubblicato la foto dello squalo originale (si citano Africa Geographic e National Geographic).'],
    lessons: ['La stessa immagine può cambiare didascalia a ogni emergenza.', 'Se un’immagine “spunta” a ogni catastrofe, è un campanello d’allarme.'],
    checked: '2026-10-20',
  },
  {
    id: 'zelensky',
    title: 'Il video-deepfake di Zelensky che “ordina la resa”',
    author: 'Euronews',
    date: '16 marzo 2022',
    url: 'https://www.euronews.com/my-europe/2022/03/16/deepfake-zelenskyy-surrender-video-is-the-first-intentionally-used-in-ukraine-war',
    category: 'deepfake',
    context: 'Nel marzo 2022 è circolato un video in cui il presidente ucraino sembrava invitare i soldati a deporre le armi.',
    facts: [
      'Il video è comparso sul sito dell’emittente ucraina TV24, che ha dichiarato di essere stata hackerata.',
      'Meta ha dichiarato di averlo rimosso perché violava la politica sui contenuti manipolati.',
      'Zelensky ha pubblicato un video sul proprio profilo Instagram smentendo di aver detto quelle cose.',
      'Chi ha osservato il filmato ha notato che la testa appariva più grande e più sgranata del corpo e che la voce era più profonda di quella reale.',
    ],
    uncertain: ['Le fonti consultate non stabiliscono chi abbia realizzato il video.'],
    lessons: ['I difetti visibili aiutano, ma i deepfake migliorano: non fidarti solo dell’occhio.', 'Cerca una smentita o conferma dalla persona o dall’ente direttamente coinvolti.'],
    checked: '2026-10-20',
  },
  {
    id: 'arup',
    title: 'La videochiamata con i “colleghi” falsi (Arup, Hong Kong)',
    author: 'CNN (K. Magramo)',
    date: '16 maggio 2024',
    url: 'https://edition.cnn.com/2024/05/16/tech/arup-deepfake-scam-loss-hong-kong-intl-hnk',
    category: 'truffa',
    context: 'Un dipendente di Arup a Hong Kong ha effettuato bonifici dopo una videochiamata con persone che credeva fossero il direttore finanziario e altri colleghi.',
    facts: [
      'Secondo la polizia di Hong Kong, il direttore finanziario e gli altri partecipanti alla videochiamata erano ricostruzioni deepfake.',
      'Sono stati trasferiti circa 200 milioni di dollari di Hong Kong (circa 25 milioni di dollari USA), in 15 operazioni.',
      'Il dipendente aveva inizialmente sospettato un’e-mail di phishing, ma i dubbi erano svaniti dopo la videochiamata.',
      'Arup ha dichiarato che i sistemi interni non sono stati compromessi.',
    ],
    uncertain: ['Le fonti consultate non indicano che gli autori siano stati identificati.'],
    lessons: ['Anche una videochiamata con volti noti può essere falsificata.', 'Per richieste di denaro, verifica con un secondo canale che hai scelto tu (un numero che già conosci).'],
    checked: '2026-10-20',
  },
  {
    id: 'smishing-polizia',
    title: 'SMS truffa: i consigli della Polizia Postale',
    author: 'Polizia Postale (portale commissariatodips.it) — consigli riportati da fonti giornalistiche',
    date: 'avvisi ricorrenti (2022–2025)',
    url: 'https://www.commissariatodips.it',
    category: 'phishing',
    context: 'La Polizia di Stato e la Polizia Postale diffondono ripetutamente avvisi su SMS finti (pacchi in giacenza, banche, forze dell’ordine) che portano a pagine clonate.',
    facts: [
      'Gli SMS truffa più segnalati riguardano finte consegne di pacchi e finti avvisi bancari, con link verso pagine che imitano siti reali.',
      'Il consiglio ripetuto è non cliccare sui link, ma andare direttamente sul sito o sull’app ufficiale.',
      'Banche e polizia non contattano i cittadini via WhatsApp o SMS per operazioni sospette sul conto.',
      'Le segnalazioni si possono fare online sul portale della Polizia Postale (sezione “Segnala online”).',
    ],
    uncertain: ['I singoli avvisi cambiano nel tempo: controlla sempre la pagina ufficiale per quelli attuali. Questa scheda si basa su sintesi giornalistiche, da riverificare sul sito.'],
    lessons: ['Non cliccare: apri tu il sito o l’app.', 'Segnalare aiuta anche gli altri.'],
    checked: '2026-10-20',
  },
];
export const caseById = (id: string) => realCases.find((c) => c.id === id);
