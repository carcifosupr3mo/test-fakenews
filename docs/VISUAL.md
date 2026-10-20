# Redesign visivo (20/10/2026): da «sito» a videogioco narrativo

## Direzione artistica
- **Stile:** illustrazione piatta, luce calda su ombre blu notte; scene a tutto schermo, personaggi a mezzo busto, riquadro di dialogo con targhetta del nome.
- **Palette:** notte `#0f1424`, crema `#f6efe0`, oro `#e8b45c` (azioni principali), terracotta `#b5532f` (indizi), verde-azzurro `#2f6b7a`.
- **Tipografia:** solo font di sistema (serif per storia e titoli, sans per l'interfaccia). Nessun font remoto.
- **Icone:** set SVG proprio (`icon()` in `src/ui/art.ts`); niente emoji nell'interfaccia di gioco.
- **Mai solo colore:** gli indizi hanno anche ⚠/ℹ e testo; le scelte hanno il numero.

## Dove sta cosa
- `src/ui/art.ts`: tutta l'arte, generata nel codice (nessun file immagine): 8 ritratti (Marta, Lina, Davide, Mamma, Nicola, Irene, Rocco, Elio) con 6 espressioni (neutra, preoccupata, sorriso, sorpresa, ferita, pensosa); 8 scene; 7 illustrazioni delle prove; icone.
- `src/ui/play.ts`: layout visual novel (sfondo, personaggi in scena — Marta a sinistra, l'interlocutore a destra, chi non parla si oscura —, dialogo con targhetta), telefono nella chat, avviso «Nuova prova nel quaderno» quando una prova entra nel diario.
- `src/style.css`: sezioni «gioco», «redesign: home e benvenuto», «quaderno come diario», «indagine».
- Contenuti: `scene.art` e `say.emo` (opzionali) in `ch1.ts`; `Evidence.why` («Perché è importante») in `evidence.ts`. Trama, personaggi, conseguenze e fatti non sono cambiati.

## I sei momenti del capitolo 1
1. **Dove arriva il messaggio:** libreria all'alba con nebbia, telefono sul bancone.
2. **Telefonata con Davide / dopo:** libreria in toni freddi; **conversazione con zia Lina:** corsia del supermercato con l'acqua (il suo mondo).
3. **Il messaggio a catena:** telefono come oggetto (cornice, notch, fumetti che compaiono uno a uno); l'esame usa la scena «telefono» e i dettagli toccabili ricevono un ⚠/ℹ e un'onda di evidenziazione.
4. **Analisi delle prove:** bacheca di sughero con foglietti (timeline).
5. **Laboratorio di verifica:** scrivania con monitor e lente.
6. **Conclusione:** libreria a mezzogiorno; schermata finale su valle al tramonto.

## Home, benvenuto, quaderno
- **Home:** schermata titolo con la valle di notte, Marta e Davide, «Comincia/Continua la storia» in evidenza, Quaderno/Capitoli/Allenamento/Se succede davvero/Impostazioni, indicatore degli 8 capitoli (in orizzontale la composizione passa su due colonne).
- **Benvenuto:** pannello sulla scena della libreria, con Davide che sorride.
- **Quaderno:** diario con spirale e schede; ogni prova ha foto-illustrazione, testo e riquadro «Perché è importante»; la bacheca usa le stesse immagini.

## Animazioni
Cambio scena (dissolvenza), cartello del luogo, ingresso del personaggio, dialogo che sale, fumetti, scelte con ingresso sfalsato, onda sugli indizi trovati, avviso prova. Tutte brevi e non bloccanti; disattivate da `prefers-reduced-motion` e da «Meno animazioni» nelle impostazioni.

## Dimensioni
`dist-standalone/index.html` (iPad): **155 kB** (era ~110 kB); pacchetto iPad zip 54 kB. Nessuna libreria aggiunta, nessuna risorsa remota (ricerca di URL esterni nel bundle: nessuno).

## Verifiche eseguite
- `npm test` 23/23; `tsc --noEmit` pulito; build finale e standalone riuscite; pacchetti PC e iPad rigenerati.
- `verify-pc.mjs` su `VERIFICA.exe` estratto dallo zip: **16/16** (il selettore «home visibile» è stato aggiornato al nuovo layout).
- Browser integrato: viewport 768×1024, 1024×768 e finestra desktop; capitolo 1 giocato fino in fondo dal driver automatico; quaderno con 6 prove e «Perché è importante»; home, benvenuto, dialogo, chat, scelta e schermata finale controllati a vista.

## Limiti onesti
- **Nessuna prova su un iPad vero** né con una persona reale (safe area, rotazione, VoiceOver, contrasto misurato non verificati).
- Non ho riguardato a vista ogni schermata secondaria (menu allenamento, casi quotidiani, laboratorio, impostazioni): ereditano il nuovo sfondo/colori solo in parte e restano nello stile carta precedente.
- I ritratti sono semplici (illustrazione vettoriale parametrica): sono pronti per i capitoli 2–8 (altri personaggi già definiti) ma non sono arte disegnata a mano.
- Le espressioni sono assegnate a mano solo su ~10 battute del capitolo 1; le altre usano l'espressione neutra.
