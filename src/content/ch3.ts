import type { Chapter, Node } from '../types';
import { act, caso, choice, chat, ev, go, ifFlag, label, learn, say, scene } from './helpers';

/** La “foto” del capitolo 3: illustrazione originale, senza nulla di reale. */
const PHOTO = `<svg viewBox="0 0 400 240" role="img" aria-label="Fotografia sgranata: un’autobotte su un ponte versa acqua in un fiume. Sul ponte un cartello.">
<defs><linearGradient id="phs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9d5db"/><stop offset="1" stop-color="#e8eef0"/></linearGradient>
<linearGradient id="phr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5d7f8f"/><stop offset="1" stop-color="#35505d"/></linearGradient></defs>
<rect width="400" height="240" fill="url(#phs)"/>
<path d="M0 120l60-48 50 34 70-60 80 70 60-36 80 52v68H0Z" fill="#8aa0ab"/>
<path d="M0 130l50-20 60 24 70-26 80 30 60-18 80 22v58H0Z" fill="#6f8e63"/>
<g fill="#4f8a47">${Array.from({ length: 11 }, (_, i) => `<circle cx="${18 + i * 38}" cy="${128 + (i % 3) * 5}" r="${15 + (i % 2) * 5}"/>`).join('')}</g>
<g fill="#3e7339">${Array.from({ length: 8 }, (_, i) => `<circle cx="${34 + i * 50}" cy="${140 + (i % 2) * 6}" r="${13 + (i % 3) * 3}"/>`).join('')}</g>
<rect y="170" width="400" height="70" fill="url(#phr)"/>
<path d="M0 190q50-8 100 0t100 0 100 0 100 0" stroke="#fff" stroke-opacity=".28" stroke-width="3" fill="none"/>
<path d="M0 210q60-8 120 0t120 0 120 0" stroke="#fff" stroke-opacity=".2" stroke-width="3" fill="none"/>
<rect y="150" width="400" height="22" fill="#a39b8c"/><rect y="170" width="400" height="6" fill="#7a735f"/>
<g fill="#7a735f">${Array.from({ length: 8 }, (_, i) => `<rect x="${i * 54}" y="176" width="14" height="40"/>`).join('')}</g>
<rect x="300" y="108" width="82" height="34" rx="3" fill="#2f5d6b" stroke="#fff" stroke-width="2"/><text x="341" y="123" font-size="8" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="700">COMUNITÀ</text><text x="341" y="134" font-size="9" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="700">VAL SORANA</text><rect x="338" y="142" width="6" height="12" fill="#555"/>
<g transform="translate(84 92)"><rect x="0" y="14" width="124" height="46" rx="22" fill="#3f6fa8"/><rect x="0" y="14" width="124" height="14" rx="7" fill="#fff" opacity=".18"/><rect x="118" y="26" width="48" height="34" rx="4" fill="#d9d9d9"/><rect x="130" y="30" width="26" height="14" fill="#8fb1c8"/><circle cx="28" cy="66" r="12" fill="#222"/><circle cx="106" cy="66" r="12" fill="#222"/><circle cx="148" cy="66" r="10" fill="#222"/><rect x="62" y="58" width="22" height="9" fill="#cfcfcf"/><rect x="62" y="58" width="22" height="9" fill="#999" opacity=".6"/><path d="M4 56q-24 4-30 36" stroke="#333" stroke-width="5" fill="none"/></g>
<path d="M54 150q-12 18-10 32" stroke="#bfe3f2" stroke-width="7" fill="none" stroke-linecap="round" opacity=".85"/><ellipse cx="42" cy="196" rx="20" ry="6" fill="#fff" opacity=".5"/>
<rect width="400" height="240" fill="#000" opacity=".06"/></svg>`;

const nodes: Node[] = [
  scene('Capitolo 3 — La foto racconta tutto?', 'Valdorna · piazza e Bar Sport · mercoledì mattina', 'day', 'piazza'),
  say('narr', 'Mercoledì mattina la piazza è piena di gente che non compra niente: capannelli, telefoni in mano, voci basse. Dalla fontana arriva il solito rumore d’acqua, e per la prima volta qualcuno lo guarda con diffidenza.'),
  ifFlag('replied_stop', 'ch3_stop', false),
  go('ch3_start'),
  label('ch3_stop'),
  say('narr', 'Nel frattempo, il telefono vibra: un altro SMS di “rimborso”, uguale a quello di ieri, con un altro link. Rispondere «STOP», ieri, non ha fermato niente.'),
  say('marta', 'Lo segnalo e lo cancello. Ora so come funziona.', 'neutral'),
  label('ch3_start'),
  say('narr', 'Davide ti aspetta al Bar Sport con due brioche e il portatile chiuso accanto.'),
  say('davide', 'Hai visto cosa gira? La chiamano “la prova fotografica”. Dammi un secondo: ho paura di quella parola.', 'neutral'),
  chat('Valdorna Informa', 'Gruppo', [
    { from: 'Gianni B.', text: 'ECCO COSA BUTTANO NELL’ORNA!!! Autobotte alle 5 di mattina. Guardate con i vostri occhi. CONDIVIDETE!!!', time: 'ieri, 21:30' },
    { from: 'Paola R.', text: 'Vergogna!! Io l’acqua non la bevo più.', time: 'ieri, 21:41' },
    { from: 'Sponsorizzato · AcquaPura Valdorna', text: 'Emergenza acqua? Depuratori −30% fino a sabato. Chiedi un preventivo gratuito.', time: 'ieri, 21:50' },
  ]),
  say('marta', 'Beh, qui l’immagine c’è. Si vede l’autobotte e il fiume. Non è un messaggio a catena: è una foto.', 'worried'),
  say('davide', 'Proprio per questo funziona. Una foto sembra “la prova” anche quando non lo è. Ci sono due domande che non si vedono: dove? quando?'),
  act('a3_photo'),

  ev('ev_foto_autobotte'),
  say('marta', 'Quindi la foto è reale, ma non sappiamo di dove e di quando.', 'thinking'),
  say('davide', 'Esatto. Adesso proviamo a cercarlo, con gli strumenti che hanno tutti.'),
  learn('ricerca-immagine'),

  scene('La ricerca', 'Bar Sport · il portatile di Davide', 'day', 'scrivania'),
  act('a3_search'),

  say('marta', 'Maggio 2021, Val Sorana. Cinque anni fa e in un’altra valle!', 'surprised'),
  say('davide', 'Nota la prudenza: questa è la comparsa più antica che abbiamo trovato, non per forza la prima in assoluto. Ma per questa storia basta e avanza.'),
  learn('metadati'),
  caso('squalo'),
  say('davide', 'Ricordi lo squalo sull’autostrada allagata? Stessa tecnica, altro luogo: una foto vera, una didascalia sbagliata.'),

  scene('Il banchetto', 'Piazza di Valdorna', 'day', 'piazza'),
  say('narr', 'Passando per la piazza, vedi un banchetto con un cartello: «AcquaPura — depuratori −30%». Un uomo in giacca verde sistema le brochure.'),
  say('rocco', 'Buongiorno! Vi vedo preoccupati. Ho una soluzione per ogni rubinetto: sul serio, venite a vedere.', 'smile'),
  ev('ev_inserzioni_rocco'),
  say('davide', 'Quella è la stessa ditta dell’inserzione sotto il post. Fai attenzione: chi ci guadagna non per questo ha creato la foto.'),
  choice('c3_rocco', 'Rocco ti guarda in attesa. Come ti comporti?', [
    { text: '«Scusi, è lei che ha messo in giro quella foto?»', to: 'r3_ask', set: { rocco_hostile: true } },
    { text: '«Come funzionano le inserzioni che compra? Da dove prende i contatti?»', to: 'r3_ads', set: { rocco_talked: true }, skill: { fonti: 1 } },
    { text: 'Sorrido e proseguo: non ho elementi per dire niente.', to: 'r3_pass' },
  ], 'Pensa a quello che sai davvero: sai che compra pubblicità, non sai altro.'),
  label('r3_ask'),
  say('rocco', 'Io?! Se avessi voluto fare una cosa così, ci avrei scritto sopra il mio nome? Faccio il mio lavoro. Se la gente ha paura, non è che l’ho inventata io.', 'hurt'),
  say('davide', 'Hai fatto una domanda legittima, ma l’hai fatta come un’accusa. Adesso Rocco si è chiuso. Con una domanda più aperta avremmo saputo di più.'),
  go('after_rocco'),
  label('r3_ads'),
  say('rocco', 'Dalla pagina: scelgo la zona e l’età. Le foto non le tocco, non le faccio: io faccio il mio annuncio e basta. Ho anche le fatture, se volete.', 'smile'),
  say('marta', 'Grazie. Era quello che volevo capire.'),
  go('after_rocco'),
  label('r3_pass'),
  say('narr', 'Prendi un volantino per cortesia e prosegui. Hai fatto bene: l’unica cosa che sai è che compra pubblicità.'),
  go('after_rocco'),

  label('after_rocco'),
  say('davide', 'Segnati questa differenza: chi sfrutta un’emergenza non è automaticamente chi l’ha creata. Magari lo è, ma servono prove diverse.'),

  scene('Nicola', 'Bar Sport · tavolino sotto il portico', 'warm', 'piazza'),
  say('narr', 'Al tavolino accanto c’è un uomo con i capelli bianchi e un giubbotto beige. Ha davanti un tablet, e con il pollice scorre le notifiche con evidente soddisfazione.'),
  say('davide', 'Nicola Moretti. Ex insegnante, fondatore di “Valdorna Informa”. È il tipo che risponde a tutti.'),
  say('nicola', 'Davide! Hai visto? Il mio post di domenica ha passato le duemilatrecento condivisioni. Valdorna si sveglia, finalmente.', 'smile'),
  say('marta', 'Nicola, quella foto dell’autobotte… da dove viene?'),
  say('nicola', 'Me l’ha mandata un iscritto. Sembrava utile e non l’ho tolta: meglio avvisare tutti, no? Se sbagliamo, avremo sbagliato per eccesso di zelo.', 'neutral'),
  choice('c3_nicola', 'Hai la ricerca in mano: la foto è del 2021, in un’altra valle. Come lo dici a Nicola?', [
    { text: 'Lo prendo da parte e gli mostro la ricerca, in privato.', to: 'r3_priv', set: { nicola_open: true }, skill: { metodo: 1 } },
    { text: 'Scrivo sotto il suo post, davanti a tutti: «Questa foto è del 2021, smettetela di condividerla!»', to: 'r3_pub', set: { nicola_pride: true } },
    { text: 'Non dico niente: è il suo gruppo.', to: 'r3_silent', set: { nicola_silent: true } },
  ], 'Non c’è una scelta giusta da indovinare: guarda come potrebbe reagire una persona che ha lavorato una vita per “tenere unita” la valle.'),
  label('r3_priv'),
  say('marta', 'Nicola, ti faccio vedere una cosa. Posso?'),
  say('nicola', 'Hmm. Maggio 2021… Val Sorana… Accidenti. Non ci avevo pensato. Se lo sapessero tutti ci resterei male, lo sai com’è.', 'worried'),
  say('marta', 'Lo so. Per questo te lo faccio vedere a te per primo.'),
  say('nicola', 'Grazie. Dammi un po’ di tempo per pensare a come correggere.', 'smile'),
  go('after_nicola'),
  label('r3_pub'),
  say('narr', 'Il commento esce subito. Nicola lo legge sul tablet e si irrigidisce.'),
  say('nicola', '“Smettetela”? Io faccio questo gruppo gratis, da anni, per tutti voi. Se l’avessi saputo avrei tolto la foto, bastava dirlo.', 'hurt'),
  say('davide', 'Il contenuto era giusto, il modo ha fatto male. Si può rimediare, ma ci vorrà un po’.'),
  go('after_nicola'),
  label('r3_silent'),
  say('narr', 'Resti zitta. Nel frattempo la foto continua a salire di condivisioni, una dopo l’altra.'),
  say('davide', 'Capisco il rispetto per il suo gruppo. Ma finché nessuno gli dice niente, la catena corre. Dirlo con garbo non è un’offesa.'),
  go('after_nicola'),

  label('after_nicola'),
  scene('Gancio', 'Piazza · mezzogiorno', 'day', 'piazza'),
  say('narr', 'Il telefono vibra: è la mamma.'),
  chat('Mamma', 'Messaggi', [
    { from: 'Mamma', text: 'Marta, l’hanno condivisa in duemila! Anche don Piero! Dicono che anche i giornali ne parlano…', time: '12:03' },
    { from: 'Mamma', text: 'Se lo dicono tutti sarà vero, no?', time: '12:04' },
  ]),
  say('marta', 'Se lo dicono tutti… Come si fa, a capire come cresce una cosa così?', 'thinking'),
  say('davide', 'Si fa risalendo la catena. Stasera abbiamo un appuntamento con tutte le versioni del messaggio.'),
  { t: 'end', summary: [
    'Una foto vera può raccontare un’altra storia: chiediti sempre dove e quando è stata scattata.',
    'La ricerca per immagine mostra dove una foto è già comparsa. Non dice chi l’ha scattata.',
    'Chi guadagna da un’emergenza non è per questo chi l’ha provocata: servono prove diverse.',
    'Correggere una persona in privato e con garbo di solito funziona meglio che farlo davanti a tutti.',
  ] },
];

export const ch3: Chapter = {
  id: 'ch3', n: 3, title: 'La foto racconta tutto?', subtitle: 'Immagini autentiche e contesti falsi',
  goals: ['Chiedersi dove e quando è stata scattata una foto', 'Usare la ricerca per immagine', 'Non confondere chi ci guadagna con chi ha creato'],
  nodes,
  activities: {
    a3_photo: {
      id: 'a3_photo', kind: 'inspect', variant: 'photo', title: 'Che cosa mostra la foto',
      intro: 'Guarda la foto e tocca le parti sottolineate sotto. Alcune sono dettagli che aiutano, altre sembrano importanti ma non lo sono.',
      coach: 'Guarda la foto, poi tocca le frasi sottolineate. Quando hai guardato abbastanza, vai avanti.',
      art: PHOTO,
      body: [
        [{ x: 'La foto è nitida e sembra vera.', h: { title: 'Sembrare vera non basta', why: 'Una foto autentica può dire una cosa falsa se è usata fuori luogo. “Sembra vera” non risponde a “dove e quando?”.', easy: 'Una foto reale può essere usata nel posto sbagliato.', signal: false } }],
        ['Sul ponte, un cartello: ', { x: '«COMUNITÀ VAL SORANA».', h: { title: 'Il cartello nomina un’altra valle', why: 'La valle del nostro paese è Valdorna, sul fiume Orna. Un cartello con un altro nome è un indizio che la foto potrebbe essere stata scattata altrove.', easy: 'Sul cartello c’è scritto un altro posto, non il nostro.', signal: true } }],
        ['Gli alberi hanno ', { x: 'tutte le foglie, ancora verdi.', h: { title: 'La stagione non torna', why: 'Siamo a ottobre e qui le foglie stanno già ingiallendo. Non è una prova: dice però che la foto potrebbe non essere di questi giorni.', easy: 'Le foglie sono verdi, ma adesso non lo sono più.', signal: true } }],
        [{ x: 'Sull’autobotte non c’è il nome della ditta e la targa è sfocata.', h: { title: 'Niente che permetta di controllare', why: 'Se ci fosse un nome o una targa leggibile si potrebbe chiedere alla ditta. Così non si può verificare nulla.', easy: 'Non si legge né il nome della ditta né la targa.', signal: true } }],
        [{ x: 'Dall’autobotte esce un liquido trasparente.', h: { title: 'Non si capisce cosa sia', why: 'Da una foto non si capisce se esca acqua pulita o altro. Chi dà la risposta sta interpretando, non osservando.', easy: 'Dalla foto non puoi sapere che cosa sia.', signal: false } }],
        ['Il post che la accompagna dice: ', { x: '«Autobotte alle 5 di mattina, guardate con i vostri occhi».', h: { title: 'Un orario che nessuno può controllare', why: 'Il post dà un orario preciso senza dire chi ha visto, dove e come lo sa. Un dettaglio preciso e non verificabile non è una prova.', easy: 'L’orario sembra preciso, ma nessuno può controllarlo.', signal: true } }],
        [{ x: '1.100 condivisioni in una notte.', h: { title: 'Tante condivisioni', why: 'Quanto è condivisa non dice se è vera. Dice solo che spaventa o interessa.', easy: 'Tanti la condividono, ma questo non la rende vera.', signal: false } }],
      ],
      need: 3,
      question: 'Che cosa dice questa foto, da sola?',
      verdicts: [
        { text: 'Che il Comune sta inquinando l’Orna.', feedback: 'La foto non dice né dove né quando. Per dirlo servono altre fonti.' },
        { text: 'Mostra un’autobotte che versa un liquido in un fiume: non dice dove, quando né che cosa.', ok: true, feedback: 'Esatto. È la risposta più onesta: descrive ciò che si vede e non va oltre.' },
        { text: 'È sicuramente un montaggio fatto da qualcuno.', feedback: 'Non ci sono segni di montaggio. Dire «è falsa» è un’altra supposizione: una foto può essere vera e fuori posto.' },
      ],
      hints: [
        'Guarda cosa si legge nella foto: cartelli, targhe, stagioni. Poi cosa dice il post.',
        'Il cartello «Val Sorana», le foglie verdi e l’orario non controllabile sono dettagli che aiutano. Nitidezza e condivisioni no.',
        'Dettagli che aiutano: cartello, foglie, ditta e targa illeggibili, orario. La risposta più onesta: descrive solo ciò che si vede.',
      ],
    },

    a3_search: {
      id: 'a3_search', kind: 'factcheck', title: 'Da dove viene la foto',
      intro: 'Davide ha lanciato la ricerca per immagine. Leggi i risultati e le fonti: per ognuna chiediti chi parla, quando e come lo dimostra.',
      coach: 'Tocca una fonte per leggerla. Poi tieni come prove quelle che ti sembrano solide.',
      claim: '«La foto mostra il Comune che scarica nell’Orna stamattina.»',
      sources: [
        { id: 's_ricerca', name: 'Risultati della ricerca per immagine', kind: 'Motore di ricerca', date: 'Oggi', evidence: 'ev_foto_2021', useful: true,
          text: ['Risultato più antico: «Corriere della Val Sorana», 14 maggio 2021.', 'Altri risultati: un blog (2023), tre pagine social (da ieri sera) con la stessa immagine e didascalie diverse.'],
          who: 'Un motore di ricerca, che raccoglie dove l’immagine è già comparsa.', when: 'La data più vecchia trovata è maggio 2021.', proof: 'Ogni risultato ha un indirizzo che puoi aprire.',
          note: 'Utile: ti dice che la foto era in giro prima. Ricorda che “più antico trovato” non vuol dire “il primo in assoluto”.' },
        { id: 's_articolo', name: '«Pulita la condotta di Ponte Basso»', kind: 'Giornale di un’altra valle', date: '14 maggio 2021', evidence: 'ev_foto_2021', useful: true,
          text: ['«…la ditta ha svuotato nel torrente l’acqua pulita residua dopo il collaudo della condotta. Nella foto l’autobotte sul ponte di Ponte Basso…»'],
          who: 'Una testata con firma, nella Val Sorana.', when: '14 maggio 2021, quasi cinque anni fa.', proof: 'Articolo firmato, con data e luogo.',
          note: 'Una fonte con data e firma che racconta la stessa immagine con tutt’altro contesto.' },
        { id: 's_comune', name: 'Comune di Valdorna — Cantieri in corso', kind: 'Sito del Comune', date: 'Aggiornato lunedì', useful: true,
          text: ['«Nessun intervento con autobotti sull’Orna in programma questa settimana. Lavori di manutenzione alla rete: zona Borgo Alto, dal 26 ottobre».'],
          who: 'Il Comune, che però è anche una parte in causa.', when: 'Lunedì.', proof: 'Elenco ufficiale dei cantieri.',
          note: 'Conta, ma da solo non basta: il Comune potrebbe avere interesse a negare. È la data 2021 a fare la differenza.' },
        { id: 's_metadati', name: 'Dati nascosti nel file (metadati)', kind: 'Informazioni del file', date: 'senza data', useful: false,
          text: ['Nel file che circola non ci sono né data né luogo di scatto.'],
          who: 'Il file, dopo essere passato da molte app.', when: 'Non c’è.', proof: 'Nessuna.',
          note: 'Le app di messaggi li tolgono quasi sempre. L’assenza di metadati non dice niente, e quando ci sono si possono modificare: sono un indizio, mai una prova.' },
        { id: 's_post', name: 'Il post nel gruppo', kind: 'Post sui social', date: 'Ieri sera, 21:30', useful: false, misleading: true,
          text: ['«ECCO COSA BUTTANO NELL’ORNA!!! Autobotte alle 5 di mattina. Guardate con i vostri occhi. CONDIVIDETE!!!»', '1.100 condivisioni.'],
          who: 'Un iscritto al gruppo.', when: 'Oggi, ma l’immagine non ha data.', proof: 'Nessuna: solo la didascalia.',
          note: 'Una didascalia non è una fonte. E le condivisioni non misurano la verità.' },
      ],
      question: 'Alla luce di quello che hai letto, cosa dici?',
      verdicts: [
        { text: '«È una foto vera ma del 2021 e di un’altra valle: usata fuori contesto.»', ok: true, feedback: 'Esatto. Un contenuto autentico mostrato nel momento sbagliato. Ti fermi a ciò che i dati dicono.' },
        { text: '«È un falso fatto da qualcuno per far paura.»', feedback: 'Non abbiamo prove che sia stata falsificata né che ci sia un autore malintenzionato. La foto è vera: è la didascalia che inganna.' },
        { text: '«Dimostra l’inquinamento dell’Orna: l’autobotte c’è.»', feedback: 'La foto mostra un’autobotte, ma non qui e non ora. Senza questo, non dimostra nulla sull’Orna.' },
      ],
      hints: [
        'Chiediti: quale fonte può dirmi quando e dove è stata scattata la foto?',
        'La ricerca per immagine e l’articolo del 2021 hanno data e firma. Il post e i metadati assenti non dicono niente.',
        'Tieni la ricerca, l’articolo e (con cautela) il Comune. Conclusione: foto vera, ma del 2021 e di un’altra valle.',
      ],
    },
  },
};
