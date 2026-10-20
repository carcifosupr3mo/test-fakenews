# VERIFICA — La verità dietro lo schermo

Videogioco investigativo su phishing, fake news e sicurezza digitale.
**iPad = piattaforma principale · PC = ambiente di test.** Un'unica base di codice (TypeScript + PWA).
Funziona offline dopo il primo caricamento, non raccoglie dati, non usa server né IA remote.

> Stato della versione 0.1: motore, tutte le modalità e **tutti gli 8 capitoli giocabili** (trama in `docs/STORIA-COMPLETA.md`, stato dei lavori in `docs/AVANZAMENTO.md`).

## Avvio su PC (test)
Requisiti: Node.js 20+ (testato con 24). La prima volta: `npm install`.

| Cosa | Come |
|---|---|
| Sviluppo con ricaricamento rapido + strumenti di test | doppio clic su `avvia-test-pc.bat` oppure `npm run dev` → apri **http://localhost:5173** |
| Versione finale come la vedrà lei (senza debug) | doppio clic su `gioca-pc.bat` oppure `npm run play` → apri **http://localhost:4173** |
| Fermare | `Ctrl+C` nella finestra del terminale (o chiudila) |
| Test automatici | `npm test` |

**Strumenti di test** (solo in `npm run dev` / `npm run build:test`): `Ctrl+Maiusc+D` (oppure `?debug=1` nell'indirizzo) apre il pannello: salto a capitolo/scena, impostazione flag narrativi (per provare i finali), sblocco prove, note sui problemi (esportabili in `.md` da mandarmi), registro errori, esportazione/azzeramento salvataggi. La build finale (`build:final`) **non contiene** questo codice.

Tasti su PC: Spazio/Invio/→ = avanti · 1-9 = scegli opzione · Q = quaderno.

## Consegna offline (senza hosting)
Vedi **docs/DISTRIBUZIONE.md**. `npm run package:pc` crea in `release/`: lo ZIP Windows portatile (VERIFICA.exe, nessun prerequisito) e il file singolo per iPad. Per l'iPad un HTML locale **non è garantito**: leggi i limiti.

## Installazione su iPad (PWA)
Le PWA su iPad richiedono **HTTPS** (o localhost) per funzionare offline: dal PC in rete locale (http) l'offline non si attiva. La strada più semplice, gratuita e senza App Store:

1. `npm run build:final` → cartella `dist/`.
2. Pubblica `dist/` su un hosting statico gratuito (GitHub Pages, Netlify o Cloudflare Pages). *Non l'ho fatto io: è una pubblicazione e serve la tua decisione.* Il contenuto non è sensibile (nessun dato personale).
3. Su iPad apri l'indirizzo in **Safari** → tasto Condividi → **Aggiungi alla schermata Home**.
4. Apri VERIFICA dall'icona (una volta online, così scarica tutto); da quel momento funziona anche senza Internet.

**Importante per i salvataggi:** la partita in Safari e quella nell'app installata sono *separate*. Gioca sempre dall'icona Home. Per spostare una partita (PC ↔ iPad, o prima dell'installazione) usa *Impostazioni → Esporta / Importa partita*. Esporta ogni tanto un backup: se per mesi non apri l'app, iOS può cancellare i dati dei siti.

## Il ciclo di test
1. Avvia su PC → 2. gioca → 3. annota i problemi (pannello debug → *Segnala un problema*) → 4. mandameli → 5. ricevi la versione corretta → 6. riverifica → 7. stesse correzioni su iPad (stessa base di codice: ripubblica `dist/`).
Checklist: `docs/TEST-CHECKLIST.md`. Cosa è implementato/verificato: `docs/FUNZIONALITA.md`. Revisione per chi non è esperta: `docs/UX.md`; prova di 10 minuti con una persona: `docs/PROVA-CON-UNA-PERSONA.md`.

## Struttura
```
src/content/   storia, personaggi, prove, glossario, casi reali (DATI: qui si modifica la storia)
src/engine/    motore narrativo, stato, salvataggi
src/ui/        schermate, attività interattive, laboratorio, strumenti di test
tests/         test automatici (integrità storia, percorsi, salvataggi)
docs/          bibbia narrativa, architettura, checklist
```
