# Architettura

## Scelta tecnologica
**PWA con TypeScript + Vite, senza framework UI** (DOM diretto, ~80 kB di JS). Una sola base di codice serve:
- **PC**: `npm run dev` (ricaricamento rapido) o `npm run play` (build finale), nel browser.
- **iPad**: la stessa app, installata dalla schermata Home via Safari (standalone, offline tramite service worker).

### Perché non altro
| Opzione | Esito |
|---|---|
| App nativa iOS (Swift / Capacitor / Flutter) | Richiede un Mac e un account Apple Developer (99 $/anno) oppure profili di firma che scadono dopo 7 giorni: contraddice «nessuna pubblicazione / abbonamento obbligatori». |
| Electron (PC) | Possibile come extra, ma non serve all'iPad e duplicherebbe il lavoro. Non scelto. |
| PWA | Un solo codice, nessun costo, offline, installabile. **Scelta.** |

### Limiti noti della PWA su iPadOS
- Service worker e installazione richiedono **HTTPS** (o localhost): serve un hosting statico gratuito per la prima installazione.
- Safari e l'app installata hanno **storage separati**: salvataggi da esportare/importare per passare dall'uno all'altro.
- iOS può eliminare i dati dei siti non usati da molto: backup con *Esporta partita*; l'app chiede anche `navigator.storage.persist()`.
- Non c'è accesso diretto ai file: l'import usa il selettore file.
- **Non verificato su un iPad reale in questa sessione** (vedi `FUNZIONALITA.md`).

## Struttura del codice
- `src/types.ts` — modello dati: nodi narrativi (`say`, `chat`, `choice`, `activity`, `if`, `goto`, `set`, `evidence`, `learn`, `case`, `end`) e attività.
- `src/content/` — **tutta la storia è dati**: un capitolo = array di nodi + dizionario di attività. Aggiungere un capitolo = creare `chN.ts` e inserirlo in `content/index.ts`. I test di integrità controllano etichette, riferimenti e percorsi.
- `src/engine/runner.ts` — `settle()` esegue i nodi non interattivi (label, goto, if, set, evidence…) e restituisce il prossimo nodo che richiede il giocatore. La posizione salvata è l'indice del nodo.
- `src/engine/state.ts` + `save.ts` — stato unico, salvataggio automatico a ogni passo, 3 slot manuali, esportazione/importazione JSON con `format` + `version` e migrazione (`migrate`).
- `src/ui/activities.ts` — 4 meccaniche riusabili: **inspect** (messaggi, e-mail, SMS, link, articoli, foto con punti toccabili e distrattori), **factcheck** (fonti → prove → conclusione), **timeline** (ordinamento), **sort** (classificazione a colonne). Ogni attività ha 3 livelli di aiuto e **nessuna penalità**: le stelle non diminuiscono mai e chiedere aiuto non le riduce.
- `src/ui/play.ts` — schermata di gioco; `screens.ts` — menu, capitoli, quaderno (prove, bacheca, timeline, glossario, casi), modalità, impostazioni; `lab.ts` — analisi locale per il Laboratorio libero.
- `src/ui/debug.ts` — solo in build di test: `__DEBUG_BUILD__` vale `false` nella build finale e il modulo non viene incluso (verificato: nessuna stringa del pannello in `dist/`).

## Stesso gioco, interfacce diverse
Layout adattivo via CSS: da 700 px in su (iPad e PC) pannelli affiancati per esame e prove; aree di tocco ≥44–48 px; tastiera su PC. La logica (prove, condizioni, finali) è identica e non dipende dall'interfaccia.

## Privacy
Nessuna rete in gioco, nessun analytics, salvataggi solo in `localStorage`. I link ai casi reali sono `<a>` facoltativi.
