import type { Activity } from '../types';

/** Casi quotidiani brevi, allenamento, redazione e recupero account: stesse meccaniche della campagna. */
export const dailyCases: Activity[] = [
  {
    id: 'd_pacco', kind: 'inspect', variant: 'sms', title: 'Il pacco in giacenza',
    intro: 'Ti arriva questo SMS mentre aspetti davvero un pacco. Esaminalo con calma: nessuna fretta.',
    header: [{ label: 'Da', value: '+39 342 555 0188 (numero sconosciuto)' }],
    body: [[
      { x: 'POSTE ITALIANE:', h: { title: 'Nome di un ente noto', why: 'Chiunque può scrivere il nome di un ente in un SMS. Il nome, da solo, non dimostra nulla.', signal: false } },
      ' il tuo pacco è in giacenza. Per riceverlo ',
      { x: 'paga 1,99 € di spese entro 24 ore', h: { title: 'Pagamento con scadenza', why: 'Una piccola somma con una scadenza ravvicinata è lo schema classico: serve a farti inserire i dati della carta.', signal: true } },
      ': ',
      { x: 'http://poste-italiane-consegne.top/ritiro', h: { title: 'Indirizzo del sito', why: 'Il vero nome del sito è la parte prima di “.top”: “poste-italiane-consegne.top”. Non è il sito di Poste Italiane (poste.it). L’ente vero non userebbe questo indirizzo.', signal: true } },
    ]],
    need: 2,
    question: 'Che cosa fai?',
    verdicts: [
      { text: 'Clicco: se è vero, perdo il pacco.', feedback: 'Il rischio di cliccare supera quello di aspettare: se il pacco esiste, puoi controllarlo dal sito o dall’app ufficiale.' },
      { text: 'Non clicco. Se aspetto un pacco, controllo dal sito o dall’app ufficiale del corriere.', ok: true, feedback: 'Perfetto. Vai tu alla fonte, con un indirizzo che conosci, invece di seguire il link ricevuto. E puoi segnalare l’SMS.' },
      { text: 'Rispondo “STOP” per non ricevere più messaggi.', feedback: 'Rispondere conferma che il numero è attivo e può attirare altri messaggi. Meglio non rispondere.' },
    ],
    hints: ['Guarda l’indirizzo del link: è quello del sito ufficiale?', 'Il vero nome del sito è la parte che sta prima dell’ultimo punto. Qui c’è una scadenza e un pagamento: due campanelli d’allarme.', 'Non cliccare. Cerca l’app o il sito ufficiale scrivendo l’indirizzo tu.'],
  },
  {
    id: 'd_dentista', kind: 'inspect', variant: 'sms', title: 'Il promemoria del dentista',
    intro: 'Non tutto è una truffa. Guarda questo messaggio e decidi con equilibrio.',
    header: [{ label: 'Da', value: 'Studio Dentistico Rossi (numero già salvato in rubrica)' }],
    body: [[
      'Buongiorno Marta, le ricordiamo l’appuntamento di giovedì alle 15:30. Se non può venire, ci chiami allo studio. ',
      { x: 'Grazie!', h: { title: 'Tono cordiale e senza fretta', why: 'Nessuna pressione, nessun link, nessuna richiesta di dati: è normale amministrazione.', signal: false } },
    ]],
    need: 0,
    question: 'Che cosa pensi?',
    verdicts: [
      { text: 'Sembra regolare: numero noto, nessun link, nessuna richiesta di dati o pagamenti.', ok: true, feedback: 'Esatto. Saper riconoscere un messaggio regolare è importante quanto individuare quelli falsi: non serve sospettare di tutto.' },
      { text: 'È una truffa: nessuno scrive più i promemoria.', feedback: 'Qui non c’è nessun campanello d’allarme: il numero è già in rubrica, non c’è alcun link e non viene chiesto nulla. Diffidare di tutto stanca e non protegge meglio.' },
    ],
    hints: ['Cerca i campanelli d’allarme: fretta? link? richieste di dati?', 'Non ce ne sono. Controlla anche il numero: lo conosci già?', 'Messaggio regolare.'],
  },
  {
    id: 'd_mail', kind: 'inspect', variant: 'email', title: '«Il tuo account verrà sospeso»',
    intro: 'Arriva questa e-mail che sembra della tua banca.',
    header: [
      { label: 'Da', value: 'Servizio Clienti <assistenza@banca-sicura-online.example>', h: { title: 'Da quale indirizzo scrive', why: 'Il nome “Servizio Clienti” si può scrivere a piacere; conta l’indirizzo vero. Qui il nome del sito non è quello della tua banca.', signal: true } },
      { label: 'Oggetto', value: 'ULTIMO AVVISO: conto sospeso entro 12 ore' },
    ],
    body: [
      ['Gentile cliente,'],
      [{ x: 'abbiamo rilevato un accesso sospetto. Il suo conto verrà sospeso entro 12 ore', h: { title: 'Minaccia e scadenza', why: 'Una minaccia con un tempo strettissimo serve a non farti pensare. Le banche non funzionano così.', signal: true } }, ' se non conferma i dati.'],
      [{ x: 'Gentile cliente', h: { title: 'Saluto generico', why: 'Una banca che ti contatta di solito conosce il tuo nome. Un saluto generico è un indizio, non una prova.', signal: true } }, ' — ', { x: 'Conferma ora i tuoi dati', h: { title: 'Pulsante che chiede dati', why: 'Non inserire mai password o codici seguendo un link ricevuto. Apri l’app o il sito digitando tu l’indirizzo.', signal: true } }],
    ],
    need: 3,
    question: 'Che cosa fai?',
    verdicts: [
      { text: 'Clicco e conferma i dati, per sicurezza.', feedback: 'È esattamente ciò che desidera chi ha scritto il messaggio. Meglio non seguire il link.' },
      { text: 'Non clicco. Apro l’app della banca da sola, e se serve chiamo il numero ufficiale sul sito.', ok: true, feedback: 'Perfetto: usi un canale che hai scelto tu, non quello che ti è stato imposto dal messaggio.' },
      { text: 'Rispondo all’e-mail per chiedere spiegazioni.', feedback: 'Rispondere non è utile e conferma che l’indirizzo è attivo. Usa un canale ufficiale.' },
    ],
    hints: ['Guarda chi scrive davvero e cosa chiede.', 'Cerca: chi scrive è strano, minaccia con scadenza, saluto generico, richiesta di dati.', 'Non cliccare: apri l’app o il sito da solo.'],
  },
  {
    id: 'd_account', kind: 'timeline', title: 'Recupero simulato di un account',
    intro: 'Hai inserito la password su una pagina sospetta. Respira: si può rimediare. Metti i passaggi nell’ordine migliore. (È una simulazione: nessun account vero viene toccato.)',
    prompt: 'In che ordine reagisci?',
    items: [
      { id: 'r1', text: 'Vai al sito o all’app ufficiale digitando tu l’indirizzo (non da un link).', why: 'Prima di tutto un luogo sicuro da cui agire.' },
      { id: 'r2', text: 'Cambia la password dell’account coinvolto, con una nuova e lunga.', why: 'Chi ha la vecchia password non la potrà più usare.' },
      { id: 'r3', text: 'Cambia la password anche negli altri siti dove usavi la stessa.', why: 'Se la password è riutilizzata, va cambiata ovunque.' },
      { id: 'r4', text: 'Attiva la verifica in due passaggi.', why: 'Anche se qualcuno scoprisse la password, gli servirebbe un secondo codice.' },
      { id: 'r5', text: 'Controlla i dispositivi collegati ed esci da quelli che non riconosci.', why: 'Per essere sicura che nessuno sia ancora dentro.' },
      { id: 'r6', text: 'Avvisa le persone di cui sei in contatto, se hai ricevuto o inviato messaggi strani.', why: 'Per proteggere anche gli altri.' },
    ],
    hints: ['Parti dal luogo sicuro, poi dalla password.', 'Prima si chiude la porta (password), poi si mette una seconda serratura (verifica in due passaggi), poi si controlla chi è dentro.', 'Ordine: sito ufficiale → password → altre password → verifica a due passaggi → dispositivi → avvisare.'],
  },
  {
    id: 'd_redazione', kind: 'sort', title: 'Redazione: fatti, opinioni, ipotesi',
    intro: 'In redazione si impara prima di tutto a separare ciò che è dimostrato da ciò che è solo detto. Assegna ogni frase alla casella giusta.',
    prompt: 'Dove va ciascuna frase?',
    columns: [{ id: 'fatto', label: 'Fatto verificato' }, { id: 'opinione', label: 'Opinione' }, { id: 'ipotesi', label: 'Ipotesi / da verificare' }],
    items: [
      { id: 'x1', text: 'Il Comune ha revocato l’ordinanza il 19 marzo 2019.', answer: 'fatto', why: 'C’è un atto numerato e datato che lo dimostra.' },
      { id: 'x2', text: 'Il gruppo “Valdorna Informa” fa solo disinformazione.', answer: 'opinione', why: 'È un giudizio generale, non dimostrato da un singolo caso.' },
      { id: 'x3', text: 'Forse chi ha tolto la data voleva far paura.', answer: 'ipotesi', why: 'Può essere vero, ma non lo sappiamo: potrebbe anche essere un ritaglio fatto per caso.' },
      { id: 'x4', text: 'I controlli dell’acquedotto di ieri sono nei limiti di legge.', answer: 'fatto', why: 'Lo riporta il gestore con i dati pubblicati.' },
      { id: 'x5', text: 'È una vergogna diffondere certe cose.', answer: 'opinione', why: 'È un giudizio morale, non un fatto.' },
    ],
    hints: ['Chiediti: posso mostrare una prova? Allora è un fatto.', 'Un giudizio (“vergogna”) è un’opinione. Un “forse” è un’ipotesi.', 'Fatti: x1, x4. Opinioni: x2, x5. Ipotesi: x3.'],
  },
];
