# Bibbia narrativa — VERIFICA

> Valdorna e tutti i suoi abitanti sono **inventati**. I casi reali (squalo, Zelensky, Arup, SMS truffa) stanno solo nell'Archivio, con fonte, e sono sempre dichiarati come reali.

## Premessa
Marta Ferri, 30 anni, libraia a Valdorna (paese di montagna, valle del fiume Orna), riceve dalla zia Lina un messaggio: «l'acqua è contaminata». Il gioco segue la sua indagine in 8 capitoli: da dove viene, chi l'ha amplificato, chi ne approfitta, come i truffatori usano la paura. Tono: curiosità e calore, mai terrore.

## Cosa è successo davvero (verità di fondo, nota solo al design)
| Quando | Evento | Certezza |
|---|---|---|
| 14 mar 2019 | Rottura di una condotta: ordinanza n. 14, divieto d'uso potabile **solo a Borgo Alto** | Certo (atti del Comune) |
| 15 mar 2019 | La Voce della Valle racconta l'episodio | Certo |
| 19 mar 2019 | Ordinanza n. 15: revoca | Certo |
| ~10 ott | Il Comune (ufficio di Irene) annuncia lavori di manutenzione con possibile "torbidità temporanea": comunicato scritto male, ambiguo | Certo |
| 18 ott, mattina | Nicola Moretti posta nel gruppo "Valdorna Informa" la foto dell'avviso 2019 «per ricordare com'è andata l'altra volta». Ritagliando lo screenshot ha tolto la data. Aggiunge la sua filigrana | Probabile (Nicola lo ammette solo nel cap. 7) |
| 18 ott | Irene pubblica e poi **cancella** un chiarimento (per un refuso). Sembra un insabbiamento: **falso indizio** | Certo |
| 18–19 ott | Rocco Serra (AcquaPura) compra inserzioni "Depuratori −30% per l'emergenza acqua" sotto il post | Certo (inserzioni pubbliche) |
| 19 ott sera | Compare il messaggio WhatsApp "me l'ha detto un cugino": **origine mai accertata** | Incerto — resta aperto di proposito |
| 19 ott | Registrato il dominio `valdorna-servizi.rimborso-acqua…` (pochi giorni di vita) | Certo (cap. 2) |
| 20 ott | SMS di "rimborso" a numeri raccolti dai commenti pubblici del gruppo | Probabile |
| cap. 5 | Audio con la voce clonata del sindaco Paolo Greco (da un video pubblico del consiglio) | Certo (analisi + smentita) |
| cap. 6 | Telefonata a Elio: "sono il sindaco, serve un contributo per le cisterne" | Certo |

**Non c'è un cattivo unico.** Tre livelli: (1) un errore in buona fede amplificato dalla paura, (2) un opportunista che ne approfitta senza violare la legge, (3) truffatori anonimi (mai identificati nel gioco, come spesso nella realtà) che sfruttano il clima.

## Personaggi
| Personaggio | Ruolo | Motivazione / segreto |
|---|---|---|
| **Marta Ferri** (tu) | libraia, protagonista | vuole capire, ha paura di sbagliare davanti ai suoi |
| **Zia Lina** | inoltra il messaggio | proteggere la famiglia; si sente giudicata se corretta male |
| **Davide Conti** | giornalista freelance, mentore | insegna il metodo, non dà mai la soluzione; ha sbagliato una notizia in passato (cap. 4) |
| **Irene Bassi** | comunicazione del Comune | pochi mezzi, difensiva; ha cancellato il post per un refuso (falso indizio) |
| **Nicola Moretti** | admin di "Valdorna Informa" | ex insegnante; errore in buona fede; l'orgoglio gli impedisce di ritrattare |
| **Rocco Serra** | AcquaPura Valdorna | sfrutta la paura; moralmente discutibile, non provato truffatore |
| **Elio Marchetti** | vicino di casa, 79 anni | bersaglio della telefonata con voce clonata |
| **Paolo Greco** | sindaco (compare nel cap. 5) | vittima della clonazione vocale |
| **Mamma (Anna)** | famiglia | ansia, dà peso emotivo |

## Falsi indizi (indicati come "indizio debole" nel diario)
Popolarità del post (2.300 condivisioni); blog anonimo "SvegliaValdorna"; cancellazione del post di Irene; il nome "Valdorna Informa" nella filigrana (indica il passaggio, non l'intenzione); "lavora all'acquedotto" del cugino.

## Capitoli
1. **È vero?** ✅ *implementato* — messaggio a catena, metodo a 4 passi, fuori contesto, timeline; hook: SMS rimborso.
2. **Chi te l'ha mandato?** — analisi e-mail e SMS: domini, mittenti, registrazione recente del dominio; e-mail falsa "Prefettura" al Comune. Caso reale: SMS truffa/Polizia Postale. Meccanica: ispezione link, confronto mittenti.
3. **La foto racconta tutto?** — foto dell'"autobotte che scarica nel fiume" (autentica, altra valle/anno). Ricerca inversa, metadati, didascalie. Caso reale: squalo.
4. **Tutti lo condividono** — viralità, effetto gregge, Nicola e il gruppo; fonti vs. eco. Davide e il suo errore passato.
5. **Una voce familiare** — audio del sindaco. Segnali e limiti dei rilevatori. Casi: Zelensky, Arup.
6. **Devi farlo subito** — telefonata a Elio, pressione e urgenza; Marta lo aiuta a fermarsi. "Se succede davvero".
7. **Le prove non mentono?** — cronologia completa, contraddizioni, il post cancellato; Nicola ammette; limiti delle prove (resta incerto il "cugino").
8. **La tua conclusione** — Marta redige la sua conclusione: cosa afferma, con quanta certezza, cosa raccomanda.

## Finali (condizioni principali; i flag verranno definiti nei cap. 7–8)
- **A · La Verifica** — Conclusione calibrata: distingue errore, sfruttamento, frode; non accusa senza prove; chiede a Nicola una correzione; segnala il phishing; Elio protetto. *Richiede:* prove chiave (filigrana, ordinanza 2019, dominio recente, smentita del sindaco), nessuna accusa non supportata, rimedio ai propri eventuali inoltri.
- **B · Il dito puntato** — Marta accusa Rocco (o Nicola) di essere l'autore della truffa senza prove. Il gruppo si chiude, la smentita si perde, rischio di diffamazione. L'ultima scelta si può rigiocare.
- **C · Meglio tacere** — Marta sa tutto ma non pubblica nulla per paura. La frode continua; la banca blocca in tempo solo in parte il pagamento di Elio. Insegna il costo del silenzio.
- **D · Verità a metà** — Conclusione corretta ma senza confidenza calibrata (nessuna incertezza dichiarata sul "cugino").

## Tono e regole di scrittura
Mai umiliare; errori spiegati con calma; nessun conto alla rovescia; tensione = curiosità. Marta decide, i personaggi di supporto suggeriscono metodi.
