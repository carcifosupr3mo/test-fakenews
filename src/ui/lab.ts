export interface Finding { title: string; why: string }
export interface LinkInfo { raw: string; host: string; parts: string[]; domain: string; notes: string[] }

const SUSPECT_TLDS = ['top', 'xyz', 'click', 'icu', 'buzz', 'live', 'rest', 'cfd', 'sbs', 'shop', 'site', 'online'];
const SHORTENERS = ['bit.ly', 'tinyurl.com', 't.co', 'cutt.ly', 'is.gd', 'rb.gy', 'ow.ly'];
const TWO_LEVEL = ['co.uk', 'com.au', 'co.jp', 'com.br'];

/** Analisi molto semplice e locale: nessun dato lascia il dispositivo. */
export function analyzeText(text: string): { findings: Finding[]; links: LinkInfo[] } {
  const findings: Finding[] = [];
  const t = text.toLowerCase();
  const add = (cond: boolean, title: string, why: string) => { if (cond) findings.push({ title, why }); };

  add(/\b(urgente|subito|immediatamente|ultimo avviso|ultime ore|entro \d+ ?(ore|giorni|minuti))\b/.test(t), 'Fretta',
    'Frasi che mettono fretta servono a non farti controllare. Chi è davvero interessato a te di solito ti lascia il tempo di verificare.');
  add(/\b(sospes[oa]|bloccat[oa]|chiuso|scadr[àa]|disattivat[oa])\b/.test(t) && /\b(account|conto|carta|profilo|servizio)\b/.test(t), 'Minaccia sul tuo account',
    'Una minaccia (“sarà sospeso”) è un modo classico per spingerti a cliccare. Verifica aprendo tu l’app o il sito ufficiale.');
  add(/\b(password|pin|codice (otp|di sicurezza|di verifica)|iban|cvv|numero della carta|credenziali)\b/.test(t), 'Richiesta di dati riservati',
    'Nessun ente serio chiede password, PIN o codici tramite messaggio o link.');
  add(/\b(rimborso|vincita|hai vinto|premio|gratis|regalo)\b/.test(t), 'Promessa di denaro o premi',
    'Rimborsi e premi inattesi sono un’esca frequente. Se non l’aspettavi, chiediti perché ti sia arrivato proprio ora.');
  add(/\b(inoltra|condividi|passaparola|diffondi|manda a tutti)\b/.test(t), 'Richiesta di diffusione',
    'Chiedere di diffondere è tipico dei messaggi a catena: prima di inoltrare, cerca la fonte.');
  add(/(!{2,}|‼️)/.test(text), 'Molti punti esclamativi',
    'Enfasi eccessiva: da sola non prova nulla, ma serve a farti agire d’impulso.');
  const letters = text.replace(/[^A-Za-zÀ-ÿ]/g, '');
  const upper = text.replace(/[^A-ZÀ-Ý]/g, '');
  add(letters.length > 30 && upper.length / letters.length > 0.4, 'Molto testo in maiuscolo', 'Il maiuscolo richiama la paura e l’urgenza.');
  add(/\b(gentile (cliente|utente)|caro (cliente|utente))\b/.test(t), 'Saluto generico', 'Un ente con cui hai un rapporto di solito usa il tuo nome. Indizio debole: da valutare insieme agli altri.');
  add(/\b(me l.?ha detto|un amico|un cugino|pare che|si dice|dicono che)\b/.test(t), 'Fonte di seconda mano', '“Me l’ha detto qualcuno” non si può controllare: chiediti qual è la fonte diretta.');
  add(!/\b(\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}|gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\b/.test(t) && /\b(oggi|attenzione|avviso|notizia)\b/.test(t), 'Nessuna data',
    'Una notizia senza data può essere vecchia e fuori contesto.');

  const links: LinkInfo[] = [];
  for (const raw of text.match(/(?:https?:\/\/|www\.)[^\s)>"']+|\b[a-z0-9-]+(?:\.[a-z0-9-]+)+\/[^\s)>"']*/gi) ?? []) {
    try {
      const u = new URL(/^https?:/i.test(raw) ? raw : 'http://' + raw);
      const host = u.hostname.toLowerCase();
      const parts = host.split('.');
      const tail2 = parts.slice(-2).join('.');
      const keep = TWO_LEVEL.includes(tail2) ? 3 : 2;
      const domain = parts.slice(-keep).join('.');
      const notes: string[] = [];
      if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) notes.push('È un numero (indirizzo IP) invece di un nome: raro per i siti legittimi.');
      if (u.protocol === 'http:') notes.push('Non usa il lucchetto (https). Da solo non prova nulla, ma non inserire dati.');
      if (SUSPECT_TLDS.includes(parts[parts.length - 1])) notes.push(`La terminazione “.${parts[parts.length - 1]}” è molto usata in siti truffa (ma non esclusiva).`);
      if (SHORTENERS.includes(domain)) notes.push('È un link accorciato: nasconde la destinazione. Non puoi sapere dove porta.');
      if (parts.length > keep + 1) notes.push(`Il nome in evidenza all’inizio (“${parts.slice(0, -keep).join('.')}”) non è il sito vero: conta ${domain}.`);
      if (host.includes('-') && /(poste|banca|bank|inps|agenzia|spedizion|amazon|paypal)/.test(host)) notes.push('Un nome con trattini che imita un ente noto è un campanello d’allarme.');
      links.push({ raw, host, parts, domain, notes });
    } catch { /* non è un URL valido */ }
  }
  if (links.some((l) => l.notes.length)) findings.push({ title: 'Indirizzo web da guardare', why: 'Il vero nome di un sito è la parte prima della terminazione: guarda i dettagli sopra.' });
  return { findings, links };
}
