import type { Evidence } from '../types';
import { evidence2 } from './evidence2';

export const evidence: Evidence[] = [
  { id: 'ev_catena', title: 'Il messaggio a catena', chapter: 1, tags: ['Messaggio', 'Zia Lina'],
    text: 'Messaggio inoltrato più volte: nessuna data, nessun autore, fonte “un cugino”. Molti segnali d’allarme, ma da solo non dimostra che sia falso.', date: '2026-10-19T21:00', dateLabel: 'Ieri sera' },
  { id: 'ev_ordinanza', title: 'Ordinanza n. 14/2019 (Borgo Alto)', chapter: 1, tags: ['Comune', 'Avviso 2019'],
    text: 'Il Comune vietò l’uso potabile dell’acqua nella sola frazione di Borgo Alto dopo la rottura di una condotta. Revocata dopo 5 giorni (ordinanza n. 15, 19 marzo 2019).', date: '2019-03-14', dateLabel: '14 marzo 2019' },
  { id: 'ev_controlli', title: 'Controlli attuali dell’acquedotto', chapter: 1, tags: ['Acquedotto', 'Dati attuali'],
    text: 'Il gestore pubblica campionamenti settimanali: tutti i parametri nei limiti di legge, nessuna ordinanza in vigore.', date: '2026-10-19T16:30', dateLabel: 'Ieri pomeriggio' },
  { id: 'ev_voce2019', title: 'Articolo “La Voce della Valle” (2019)', chapter: 1, tags: ['Avviso 2019', 'Giornale'],
    text: 'Il giornale locale raccontò l’episodio del 2019: cinque giorni di acqua non potabile solo a Borgo Alto.', date: '2019-03-15', dateLabel: '15 marzo 2019' },
  { id: 'ev_post_fb', title: 'Il post nel gruppo “Valdorna Informa”', chapter: 1, tags: ['Valdorna Informa', 'Nicola'],
    text: 'Foto ritagliata di un avviso, senza data, con migliaia di condivisioni. La popolarità non è una prova. Il post è la prima comparsa dell’immagine in rete.', date: '2026-10-18T10:15', dateLabel: 'Due giorni fa', weak: true },
  { id: 'ev_filigrana', title: 'La filigrana sull’immagine', chapter: 1, tags: ['Valdorna Informa', 'Nicola'],
    text: 'Nell’angolo dell’immagine, quasi invisibile: “Valdorna Informa”. Qualcuno ha ritagliato l’avviso togliendo la data e ci ha messo il suo marchio.' },
  { id: 'ev_blog', title: 'Blog anonimo “SvegliaValdorna”', chapter: 1, tags: ['Blog'],
    text: 'Afferma che l’acqua è “avvelenata da anni”: nessun autore, nessuna prova. Un indizio debole, da non usare.', weak: true },
];
export const evById = (id: string) => evidence.find((e) => e.id === id);

/** «Perché è importante»: una riga per prova, mostrata nel quaderno. */
const WHY: Record<string, string> = {
  ev_catena: 'È il punto di partenza: tanti campanelli d’allarme, ma da soli dicono “controlla”, non “è falso”.',
  ev_ordinanza: 'Dimostra che l’avviso è esistito davvero, ma nel 2019 e solo per una frazione: è la chiave per capire il trucco.',
  ev_controlli: 'Sono i dati di oggi di chi gestisce l’acqua: la fonte più adatta per rispondere alla domanda di adesso.',
  ev_voce2019: 'Un secondo racconto indipendente dell’episodio del 2019: conferma date e luogo.',
  ev_post_fb: 'Mostra dove l’immagine è comparsa per la prima volta in rete. Tante condivisioni non vogliono dire che sia vero.',
  ev_filigrana: 'Indica da dove è passata l’immagine, non chi volesse ingannare: un indizio da usare con prudenza.',
  ev_blog: 'Serve a ricordare cosa NON usare: senza autore e senza prove, un’affermazione forte non vale come fonte.',
};
evidence.forEach((e) => { e.why = WHY[e.id]; });
evidence.push(...evidence2);
