# Avanzamento — capitoli 2–8

Stato: **tutti gli 8 capitoli sono giocabili.** Il capitolo 1 è invariato.

## Cosa è stato fatto
- `docs/STORIA-COMPLETA.md`: trama, personaggi, fili ricorrenti, matrice capitolo/meccanica/prove/conseguenze.
- Capitoli: `src/content/ch2.ts` … `ch8.ts`; prove in `evidence2.ts`; costruttori comuni in `helpers.ts`.
- Motore (retrocompatibile): nodo `ifev` (condizione su una prova), `end` con `ending`/`endingTitle`, `scene` opzionale nelle attività, varianti `audio` e `call`.
- Salvataggio: resta alla versione 1; i nuovi dati sono solo flag e id di prove. Test con fixture del capitolo 1.
- Finali A–D registrati in `endings`; il capitolo 8 recupera da solo le prove mancanti (nessun vicolo cieco).

## Verifiche eseguite
- `npm test`: 125 test (integrità, percorsi con 3 strategie, ogni opzione di ogni scelta arriva alla fine, ch7/ch8 da soli, prove senza duplicati e senza anticipi, URL solo `.example`, fixture di salvataggio).
- `npm run typecheck`, `build:final`, `build:standalone`: puliti.
- Browser (pannello integrato, localhost): partita automatica dal capitolo 1 al finale «La Verifica» senza errori in console; attività del vocale controllata a vista.
- Pacchetto PC: `scripts/verify-pc.mjs` 16/16 sul nuovo ZIP (capitolo 1, salvataggio, riavvio, rete bloccata).

## Limiti e punti non verificati
- Nessuna prova su iPad fisico (apertura del file locale su iPadOS non verificata).
- Nessun audio reale: il vocale è una forma d'onda con trascrizione toccabile.
- Giocati in automatico solo i percorsi «prima opzione» in browser; gli altri percorsi sono coperti dai test sul motore, non da prova visiva.
- Layout verticale/orizzontale iPad controllati solo a 768×1024 su una schermata; non su ogni attività dei capitoli 2–8.
- I finali B, C, D sono provati dai test, non riletti a schermo.
