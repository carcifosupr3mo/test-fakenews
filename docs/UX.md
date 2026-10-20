# Revisione UX (20/10/2026): il gioco per chi non è esperta

Principio: la giocatrice deve sapere sempre **cosa succede, cosa fare, dove toccare, perché, e cosa segue**. Se si blocca, è colpa dell'interfaccia.

## Modifiche principali
1. **Benvenuto in 4 righe** (una volta sola, prima della prima partita): leggi → scegli → «Aiutami» → salva da solo. Dice chiaramente che non è un esame.
2. **Modalità «Guidami»** (attiva all'inizio): una riga gialla «👉» spiega cosa fare nel momento in cui serve (dialogo, chat, scelta, ogni attività). Compare solo le prime volte; «Ho capito, meno indicazioni» la spegne, come l'interruttore in Impostazioni.
3. **Pulsante «💡 Aiutami» sempre in alto**, in ogni schermata di gioco:
   - in un'attività apre l'aiuto a 3 livelli (*Dove guardare → Ecco l'indizio → Ti spiego passo passo*), senza togliere stelle;
   - altrove spiega cosa si può fare adesso (testo specifico per le scelte) e offre «Rileggi cosa è successo» e il quaderno.
4. **«Spiegamelo in modo più semplice»** su ogni spiegazione di indizio e di parola.
5. **Parole tecniche toccabili** nei dialoghi (sottolineate): breve spiegazione al tocco, senza interrompere la storia. Aggiunti termini: phishing, indirizzo (URL), dominio, deepfake, controllare una notizia, con spiegazioni semplici.
6. **Scelte a 2–3 opzioni in italiano naturale**, formulate come azioni concrete («Non lo giro e prima controllo…»), mai come definizioni da esame. Terza opzione sempre «Non so cosa fare / aiutami», che porta avanti la storia (nessun vicolo cieco).
7. **Tono non giudicante**: niente «errata/hai fallito». Le risposte meno solide ricevono una spiegazione gentile («Capisco il pensiero, ma…») e si può riprovare. Dopo 3 tentativi si mostra la strada più sicura. Un test automatico controlla l'assenza di formule da esame.
8. **Meno informazioni per volta**:
   - esame del messaggio: la decisione compare solo dopo aver guardato qualcosa e toccato «Ho guardato abbastanza: e ora?»;
   - verifica delle fonti: la decisione compare dopo aver letto almeno due fonti (con un messaggio che spiega perché);
   - 3 risposte invece di 4.
9. **Linguaggio**: «segnale» → «campanello d'allarme»; «fonte primaria/secondaria», «filigrana», «inoltro», «gestore», «albo pretorio» riscritti o spiegati; i pulsanti dicono cosa succede («Ho letto, continua», «Continua la storia», «Questa mi sembra affidabile: tienila come prova», «▲ Su / ▼ Giù»).
10. **Niente solo colori**: ✓/✗ e etichette di testo (⚠ «Qui qualcosa non torna», ℹ «Da solo non dice molto»).
11. **Home essenziale**: un grande pulsante «▶ Comincia/Continua la storia» e 5 riquadri con icona + parola (Quaderno, Capitoli, Allenamento, Se succede davvero, Impostazioni). Meno testo, nessuna dashboard.
12. **Quaderno semplice**: schede «Cose scoperte», «Persone e fonti», «La storia finora», «Parole», «Casi veri». Nessuna parola bloccata con lucchetto; «Torna alla storia» dal quaderno.
13. **Modalità extra rinominate**: «Situazioni di tutti i giorni», «Allenamento con guida», «In redazione», «E se ho sbagliato?», «Prova un tuo messaggio», «Rinfresca la memoria» (non più un quiz), «Storie vere».

## Schermate e meccaniche semplificate
Home · benvenuto · dialoghi (parole toccabili) · chat sul telefono · scelte · esame del messaggio · verifica delle fonti · timeline · quaderno · menu allenamento · glossario/ripasso · impostazioni (Guidami).

## Non toccato (come richiesto)
Motore unico, salvataggi (autosalvataggio, 3 slot, esporta/importa, migrazione: un vecchio salvataggio parte con «Guidami» acceso), capitolo 1 e prove, quaderno, build con debug solo di sviluppo, protezioni offline, pacchetti PC/iPad. Nessuna dipendenza aggiunta.

## Verifiche eseguite
- `npm test`: **23/23** (17 precedenti + 6 sul tono, sul numero di opzioni, su aiuti/guida, sul glossario toccabile e sulla migrazione delle impostazioni).
- `tsc --noEmit` pulito.
- Browser integrato, viewport iPad 768×1024: benvenuto, dialoghi con indicazioni, chat, scelta, «Aiutami» su una scelta e in un'attività (3 livelli), esame del messaggio (tocco, «Spiegamelo più semplice», decisione, risposta non solida con feedback gentile, risposta solida), verifica delle fonti, quaderno (5 schede), menu allenamento e un caso quotidiano (solo aperto e letto, non giocato); capitolo 1 giocato fino in fondo dal driver automatico (percorso «giro il messaggio» + correzione); nessun errore in console.
- Pacchetto Windows rigenerato e riverificato: **16/16** controlli su `VERIFICA.exe` estratto da zip (nessun debug, nessuna rete, benvenuto alla prima partita, capitolo 1 completato, salvataggio e persistenza dopo il riavvio, benvenuto non ripetuto).

## Limiti rimasti (onesti)
- **Nessuna prova con una persona reale** né su un iPad vero: tutto è verificato con pilotaggio automatico e rilettura dei testi. Usa `docs/PROVA-CON-UNA-PERSONA.md`.
- Il testo dei capitoli 2–8 non esiste ancora (solo il capitolo 1): quando verranno scritti dovranno seguire gli stessi criteri (2–3 scelte, linguaggio semplice, `coach`/`help`).
- I casi quotidiani (`daily.ts`) hanno ricevuto solo ritocchi lessicali, non una riscrittura completa; hanno comunque «Aiutami» a 3 livelli, ma non tutti hanno testi «più semplici».
- La riga «Guidami» nelle attività è sempre visibile finché la modalità è accesa (non solo le prime volte).
- Accessibilità con VoiceOver e contrasto misurato: non verificati.
