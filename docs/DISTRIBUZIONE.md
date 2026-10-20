# Distribuzione offline

Ambiente di sviluppo rilevato: **Windows 11**. Quindi posso generare e verificare **solo il pacchetto Windows**. Linux/Debian e macOS: **non generati, non verificati**.

## PC (Windows) — consegna: `release/VERIFICA-PC-v0.1.0.zip` (≈151 MB)
- Contiene `VERIFICA.exe` (runtime Electron incluso) e il gioco. **Non serve Node.js, npm, Internet né installazioni.**
- Uso: estrai lo ZIP → doppio clic su `VERIFICA.exe`. Dentro c'è anche `LEGGIMI.txt` e un file di riserva `VERIFICA (solo browser).html`.
- Windows può mostrare «Windows ha protetto il PC» (SmartScreen) perché l'eseguibile non ha la firma a pagamento: *Ulteriori informazioni → Esegui comunque*. Un certificato di firma costa e non è stato acquistato (non autorizzato).
- Privacy/offline: la finestra carica solo il file locale; le richieste di rete sono bloccate dal programma; devtools disattivati; nessun codice di debug.
- Salvataggi: nel profilo dell'app (`%APPDATA%\VERIFICA`); restano dopo la chiusura e il riavvio. Esporta/importa partita disponibile in *Impostazioni*.
- Ricostruire il pacchetto: `npm run package:pc` (poi `node scripts/verify-pc.mjs release\VERIFICA-PC-v0.1.0.zip` per riverificarlo).

## iPad — cosa è realmente possibile
Consegna: `release/VERIFICA-iPad-v0.1.0.zip` → `VERIFICA.html` (un solo file, 96 kB, tutto incorporato). **Non provato su iPad.**

| Opzione | Esito |
|---|---|
| **HTML singolo aperto da Safari / dall'app File** | **Non affidabile.** Le fonti consultate (forum utenti, non documentazione Apple) riportano che da *File* l'HTML si apre senza CSS/JavaScript e che Safari non apre file locali. Il gioco ha bisogno di JavaScript → probabilmente **non parte**. |
| **HTML singolo in un'app di terze parti** (es. «Documents» di Readdle) | Possibile ma **non verificato**: non ho trovato conferma che esegua JavaScript e conservi i salvataggi. Da provare in 2 minuti sull'iPad (vedi `LEGGIMI-iPad.txt`). Se funziona è la via più semplice senza hosting; i progressi sono comunque esportabili. |
| **ZIP** | Un ZIP è solo un contenitore: **non è un'app installabile** e non risolve il punto sopra. |
| **PWA da `file://`** | **Impossibile**: manifest, service worker e «Aggiungi alla Home» richiedono HTTPS. |
| **PWA via HTTPS** (hosting statico gratuito: GitHub Pages/Netlify/Cloudflare Pages) | **La via affidabile.** Serve pubblicare la cartella `dist/` (`npm run build:final`) **una volta**; lei la apre su Safari, «Aggiungi alla schermata Home» e da lì funziona offline. Richiede una tua autorizzazione esplicita (pubblicazione online): **non l'ho fatta**. Il contenuto non contiene dati personali. |
| **App iOS nativa** | Richiede un Mac con Xcode. Con Apple ID gratuito l'app scade dopo 7 giorni (va reinstallata); con il programma a pagamento (≈99 $/anno) dura di più. Nell'ambiente disponibile (Windows) **non è realizzabile** né verificabile. Strumenti come AltStore/Sideloadly esistono ma hanno la stessa scadenza settimanale: non li consiglio per un regalo. |

**Raccomandazione:** prova prima l'HTML in «Documents» (gratis, 2 minuti). Se non va, dammi l'ok per pubblicare `dist/` su un hosting statico gratuito: è l'unico modo che garantisce offline e salvataggi stabili su iPad senza App Store.

## Un'unica base di codice
Pacchetto PC e file iPad contengono **lo stesso identico `index.html`** (verificato con confronto byte a byte), generato da `npm run build:standalone` (Vite + `vite-plugin-singlefile`). La build PWA (`dist/`) usa gli stessi sorgenti e aggiunge solo il service worker.
