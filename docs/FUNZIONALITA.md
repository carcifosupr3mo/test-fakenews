# Funzionalità: stato reale e test eseguiti

Data: 20/10/2026 · Versione 0.1.0

Legenda: ✅ implementato e verificato · 🟡 implementato, da provare a mano da te · ⬜ non ancora fatto

## Campagna
| Elemento | Stato | Note |
|---|---|---|
| Capitolo 1 «È vero?» | ✅ | 3 attività, 3 scelte con conseguenze, ~15 min. Percorsi forward/pause/ignore provati da test automatico e da simulazione nel browser |
| Capitoli 2–8 | ✅ | Giocabili: SMS e mail (2), foto (3), catena e gregge (4), vocale (5), telefonata (6), cronologia e revisione delle ipotesi (7), conclusione con 4 finali (8). Dettagli in `STORIA-COMPLETA.md` |
| Finali A–D | ⬜ | Progettati in `STORIA.md`; si implementano nei cap. 7–8. Il pannello debug ha già l'impostazione dei flag per provarli |
| Durata 4–6 ore | ⬜ | Da misurare con playtest a campagna completa |

## Meccaniche e modalità
| Funzione | Stato |
|---|---|
| Dialoghi, scene, chat simulate, scelte con flag | ✅ |
| Esame messaggi (chat/SMS/e-mail/link) con segnali e distrattori | ✅ |
| Laboratorio di fact-checking (fonti → prove → conclusione) | ✅ |
| Timeline (ordinamento) e classificazione (fatti/opinioni/ipotesi) | ✅ |
| Quaderno: prove, bacheca per tema, timeline degli eventi, glossario, casi reali | ✅ (la bacheca raggruppa per tag; non è trascinabile) |
| Aiuti a 3 livelli, nessuna penalità, nessun timer | ✅ |
| Casi quotidiani (3), Allenamento guidato, Redazione, Recupero account simulato | ✅ (contenuto ridotto: 5 casi) |
| Laboratorio libero (analisi locale di testo/link) | ✅ (euristiche semplici: è un aiuto, non un verdetto) |
| Ripasso | ✅ (si sblocca con ≥2 concetti) |
| «Se succede davvero» | ✅ (5 guide) |
| Casi reali con fonti (4) | ✅ URL e fatti controllati con ricerca il 20/10/2026; la scheda sulla Polizia Postale si basa su sintesi giornalistiche e va riverificata sul sito |
| Mini-giochi fotografici (analisi immagini con SVG) | ⬜ previsto nel cap. 3 |

## Salvataggi
| Funzione | Stato |
|---|---|
| Autosalvataggio a ogni passo, ripresa dall'ultima scena | ✅ |
| 3 slot manuali, esporta/importa JSON, versione del formato + migrazione | ✅ (migrazione testata automaticamente; import/export provato da test, non ancora a mano) |
| Ricominciare un capitolo (azzera i flag di quel capitolo) | ✅ |
| Sincronizzazione automatica PC↔iPad | ❌ non offerta (richiederebbe un server): usare esporta/importa |

## Strumenti di test (solo build di test)
Pannello `Ctrl+Maiusc+D`: salto a scena, flag, sblocco prove, note problemi → `.md`, registro errori, esporta/azzera salvataggi — ✅ implementati; 🟡 il pannello è stato verificato solo come presenza/assenza nelle build, non usato a mano in ogni funzione.

## Test realmente eseguiti
1. `npm test` — **23 test passati** (17 + 6 sulla semplicità): integrità storia (etichette, riferimenti, attività, termini, prove, casi), 3 percorsi di gioco fino alla fine, formato dei casi reali, salvataggi (export/import, versione futura, migrazione), laboratorio libero.
2. `tsc --noEmit` senza errori.
3. Browser (pannello integrato, viewport desktop e 768×1024): home, capitolo 1 giocato dall'inizio alla fine con un driver automatico (clic su tutti i punti, risposta corretta, fonti, timeline, scelte); risultato: capitolo segnato completato, 6 prove nel diario, stelle registrate, nessun errore in console.
4. Build: `build:test` e `build:final` riuscite; la build finale **non contiene** il codice debug (ricerca nel bundle) e non mostra il pannello con `?debug=1`.

## Cosa NON è stato verificato
- **Offline / service worker**: `sw.js` e `manifest.webmanifest` vengono serviti correttamente, ma il browser integrato non permette la registrazione del service worker, quindi l'offline **non è stato provato**. Da verificare su Chrome/Edge (DevTools → Rete → Offline) e su iPad.
- **iPad reale** (Safari, installazione, gesti, rotazione, safe area): non provato. L'emulazione del viewport 768×1024 mostra il layout corretto, nulla di più.
- Accessibilità con VoiceOver; contrasto con strumenti di misura; test con utenti.

## Revisione UX (20/10/2026)
Vedi `docs/UX.md` (modifiche, test, limiti) e `docs/PROVA-CON-UNA-PERSONA.md` (checklist di 10 minuti). Test: 23/23, pacchetto PC 16/16. ⬜ Nessuna prova con persone reali o iPad vero.

## Distribuzione (20/10/2026)
- ✅ Pacchetto Windows `VERIFICA-PC-v0.1.0.zip`: estratto in cartella pulita, `VERIFICA.exe` avviato e pilotato via DevTools Protocol — 16/16 controlli: finestra e gioco caricati da `file://`, nessun debug, nessuna risorsa remota, richieste di rete bloccate, capitolo 1 giocato fino alla fine, autosalvataggio, e dopo chiusura/riavvio la partita è ancora presente.
- 🟡 Non provato su un PC senza Node.js (l'eseguibile non lo usa, ma questa macchina ce l'ha), né su Windows diversi dal 11 di sviluppo, né con SmartScreen reale.
- ⬜ Linux/Debian e macOS: non generati.
- ⬜ iPad: `VERIFICA.html` non provato su iPad; l'esecuzione da file locale è probabilmente bloccata da Safari/File (vedi `DISTRIBUZIONE.md`). La PWA via HTTPS resta la via affidabile ma non è pubblicata.

## Redesign visivo (20/10/2026)
Vedi `docs/VISUAL.md`. Test 23/23, pacchetto PC 16/16; iPad vero e persone reali non provati.
