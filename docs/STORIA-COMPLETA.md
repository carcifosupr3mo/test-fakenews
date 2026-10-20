# Storia completa — VERIFICA, capitoli 1–8

> Complementa `STORIA.md` (la bibbia originale, che resta valida). Qui c'è l'arco completo, capitolo per capitolo, con prove, scelte, conseguenze e come tutto si chiude. Valdorna e tutti i suoi abitanti sono **inventati**; i domini usano il suffisso riservato `.example`, i numeri di telefono sono fittizi, gli IBAN sono sempre mascherati. I casi reali stanno solo nell'Archivio, con fonte (`src/content/cases.ts`).

## Il mistero in una riga
Chi ha fatto girare l'avviso del 2019 come se fosse di oggi, chi ci ha guadagnato e chi ha usato il panico per truffare? La risposta è **a tre livelli** (errore in buona fede → opportunismo → frode anonima) e **un pezzo resta volutamente incerto** (da dove viene il messaggio del «cugino»).

## Cosa vuole Marta, cosa fa Davide
- **Marta Ferri** (libraia): all'inizio vuole solo sapere se può bere l'acqua. Strada facendo vuole proteggere i suoi (zia Lina, mamma, Elio) e capire chi c'è dietro. La sua paura: sbagliare davanti a tutti. Arco: da «condivido per paura» a «dico quanto so e quanto non so».
- **Davide Conti** (giornalista): mentore. Non dà mai la soluzione; ha un errore alle spalle (cap. 4: nel 2017 pubblicò una notizia su una sola fonte e dovette correggerla). Arco: passa da «guida» a «collega»: nel finale propone a Marta di scrivere con lui.

## Personaggi secondari e motivazioni
| Chi | Cosa vuole | Cosa nasconde / sbaglia | Dove |
|---|---|---|---|
| Zia Lina | proteggere la famiglia | si sente giudicata; reazione dipende da come l'hai corretta (cap. 1) | 1, 8 |
| Mamma Anna | tranquillità | ansia | 1, 8 |
| Irene Bassi | difendere il Comune con pochi mezzi | ha cancellato un post per un refuso (falso indizio); il suo comunicato sui lavori era ambiguo | 2, 4, 5, 7 |
| Nicola Moretti | «tenere unita la valle» | ha ritagliato l'avviso (tolta la data) e messo la sua filigrana; fatica a ritrattare | 3, 4, 7, 8 |
| Rocco Serra | vendere depuratori | compra inserzioni sull'emergenza; opportunista, **non provato truffatore** | 3, 7, 8 |
| Paolo Greco (sindaco) | calmare e informare | vittima della voce clonata | 5 |
| Elio Marchetti | vivere tranquillo | fiducioso; bersaglio della telefonata | 2, 6, 8 |
| Truffatori anonimi | soldi e dati | **mai identificati** (come spesso nella realtà) | 2, 5, 6 |

## Fili che ritornano (e dove si risolvono)
1. **SMS di «rimborso»** (cap. 1) → dominio nato il 19 ottobre (cap. 2) → lo stesso nome compare nell'audio del sindaco (cap. 5) → il numero del chiamante a Elio mostra il numero del Comune (cap. 6) → conclusione: stessa campagna *probabile*, autore *non dimostrabile* (cap. 7–8).
2. **Filigrana «Valdorna Informa»** (cap. 1) → foto dell'autobotte senza data nello stesso gruppo (cap. 3) → versioni della catena (cap. 4) → Nicola ammette il ritaglio (cap. 7).
3. **Post cancellato del Comune** (falso indizio, cap. 4) → era un refuso corretto, la bozza esiste ancora (cap. 7).
4. **Il «cugino»** (cap. 1) → mai rintracciato (cap. 4) → resta *non dimostrabile* (cap. 7–8). Il gioco premia chi lo dichiara.
5. **Numeri di telefono nei commenti pubblici** (cap. 2) → ipotesi su come i truffatori hanno trovato Elio, Lina e Mamma (cap. 4, 6) → «probabile», non provato (cap. 7).
6. **Inserzioni di AcquaPura** (cap. 3) → «chi ne approfitta non è per questo chi l'ha creato» (cap. 7).

## Capitolo per capitolo

### 1 · È vero? (già implementato, non modificato)
Messaggio a catena → metodo a quattro passi → avviso 2019 fuori contesto → timeline → SMS di rimborso (gancio).

### 2 · Chi te l'ha mandato? (martedì pomeriggio)
- **Apertura:** Marta ha l'SMS di rimborso in mano; Davide: «Non cliccare. Guardiamolo da vicino».
- **Problema:** l'SMS è vero o no? Si risolve senza tecnica: *chi scrive, a nome di chi, dove porta il link.*
- **Meccaniche:** esame SMS (`inspect sms`) · **scelta** su cosa fare (aprire il link «solo per vedere» / controllare il sito ufficiale / rispondere STOP) · schede dei mittenti (`sort`: è davvero loro o no?) · scena al Comune con Irene: e-mail «Prefettura» (`inspect email`) · consultazione del registro dei domini (`factcheck`).
- **Educativo:** sottodominio ingannevole, mittente ≠ ente, il dominio nato il 19 ottobre, nessun ente serio chiede dati con un SMS a 24 ore; caso reale *SMS truffa / Polizia Postale* (Archivio).
- **Conseguenze:** link aperto → nulla è successo, ma Davide insegna a cosa guardare dopo (nel cap. 6 Marta è più pronta); STOP → altri SMS arrivano (i numeri «attivi» valgono di più); controllo ufficiale → conferma dal gestore.
- **Prove:** SMS rimborso, e-mail «Prefettura», dominio recente.
- **Verso il cap. 3:** Irene: «Ieri mi hanno mandato anche una foto: un'autobotte che scarica nel fiume».

### 3 · La foto racconta tutto? (mercoledì mattina)
- **Apertura:** al bar della piazza, la foto dell'autobotte nel gruppo. Per la prima volta Marta incontra Nicola (e vede Rocco con il suo banchetto).
- **Problema:** la foto è autentica, ma è di *dove e quando*?
- **Meccaniche:** esame della foto (`inspect photo`: stagione, targa, cartello, didascalia) · ricerca inversa e metadati (`factcheck`; i metadati si possono togliere e cambiare: limite dichiarato) · **scelta** su come parlare con Nicola (in pubblico / in privato / lasciar perdere).
- **Educativo:** foto vera fuori contesto (richiama lo *squalo*); ricerca inversa; chi *ne approfitta* (Rocco) non è per questo chi l'ha creata.
- **Conseguenze:** in privato → Nicola ascolta (`nicola_open`); in pubblico → si irrigidisce (`nicola_pride`): il cap. 7 sarà più difficile ma possibile.
- **Prove:** foto dell'autobotte, fonte 2021 (altra valle), inserzioni di AcquaPura (con nota «non prova nulla sull'origine»).

### 4 · Tutti lo condividono (mercoledì sera)
- **Apertura:** il post ha superato le 2.300 condivisioni; la mamma lo rimanda a Marta con «lo dicono tutti».
- **Problema:** ricostruire come la catena è diventata più credibile a ogni passaggio.
- **Meccaniche:** tre versioni dello stesso messaggio (`inspect chat`: a ogni passaggio spariscono data e prudenze, aumentano certezza e fretta) · fonte o eco (`sort`) · **scelta** su cosa scrivere nel gruppo (accusa / fonti con calma / chiedere in privato) · racconto di Davide sul suo errore del 2017.
- **Falso indizio:** circola lo screenshot «il Comune ha cancellato il suo comunicato!». Marta lo annota come *indizio debole*.
- **Educativo:** popolarità ≠ prova; effetto gregge; non accusare senza prove.
- **Conseguenze:** accusa → il gruppo si divide, Nicola risponde ferito (`accused_nicola`); fonti calme → alcuni ringraziano, altri attaccano; privato → nessuna reazione ma anche nessuna correzione.
- **Prove:** versioni della catena, post cancellato (debole), destinatari dell'SMS = commentatori del gruppo (ipotesi).

### 5 · Una voce familiare (giovedì)
- **Apertura:** un vocale con la voce del sindaco: «L'acqua è contaminata e ve l'abbiamo nascosto; per il rimborso seguite il servizio Valdorna Servizi».
- **Problema:** è davvero lui?
- **Meccaniche:** ascolto/analisi del vocale (`inspect audio`: ritmo, pause, frasi mai dette in pubblico; segnali *deboli* dichiarati) · **scelta del secondo canale** (richiamare il sindaco al numero ufficiale / chiedere a Nicola / mandarlo a Davide) · fonti (`factcheck`: smentita e agenda del sindaco, video pubblico del consiglio, «rilevatore» con il 87 % – **non prova**).
- **Educativo:** un audio non è una prova; verifica su un canale indipendente; i rilevatori sbagliano; casi reali *Zelensky* (Archivio).
- **Conseguenze:** cambia chi ti dà l'informazione e quanto tempo passa; tutte le strade convergono sulla smentita.
- **Prove:** vocale, smentita e agenda del sindaco, video del consiglio, risultato del «rilevatore» (debole).

### 6 · Devi farlo subito (venerdì)
- **Apertura:** Marta è in cucina di Elio quando squilla il telefono fisso. Sullo schermo: «Comune di Valdorna».
- **Problema:** la voce dice «sono Paolo, serve un contributo per le cisterne, oggi». È il sindaco?
- **Meccaniche:** la telefonata (`inspect call`, con segnali) · **scelta** su come fermarla (richiamare / affrontare il chiamante / lasciar proseguire «per capire») · cosa fare e non fare (`sort`) · l'IBAN mascherato intestato a un'azienda, non al Comune.
- **Educativo:** il numero sullo schermo si può falsificare; segretezza, urgenza e pagamento; interrompere senza sentirsi in colpa; caso reale *Arup* (Archivio).
- **Conseguenze:** lasciar proseguire → l'interlocutore chiede dati della carta, Marta lo ferma in tempo (`elio_close_call`); in nessun caso Elio perde denaro, ma ricorda il momento.
- **Prove:** telefonata, intestatario non del Comune, numero «falsificabile».

### 7 · Le prove non mentono? (sabato)
- **Apertura:** Davide stende il quaderno sul tavolo: «Adesso vediamo cosa regge».
- **Problema:** tre ipotesi iniziali — Irene ha insabbiato, Rocco è l'autore, il sindaco ha mentito — e le prove le smontano.
- **Meccaniche:** cronologia completa (`timeline`) · cosa è verificato / probabile / non dimostrabile (`sort`) · tre colloqui con scelte che richiedono prove: **Irene** (bozza del refuso), **Nicola** (ammette il ritaglio; con più dolcezza se `nicola_open`), **Rocco** (nessun legame con la frode) · **ripensaci**: scelte bloccate dalle prove mancanti.
- **Educativo:** contraddizione vera vs differenza di contesto; rivedere un'ipotesi; separare fatti da interpretazioni.
- **Conseguenze:** accusare ora è possibile ma Davide e le prove lo smontano subito; il flag `cugino_incerto` si imposta solo se Marta riconosce il limite.
- **Prove:** bozza di Irene (risolve il falso indizio), comunicato sui lavori (causa dell'ansia), ammissione di Nicola, «nessun legame con Rocco», nulla sul «cugino».

### 8 · La tua conclusione (domenica)
- **Apertura:** piazza al tramonto; Marta deve dire in pubblico cosa ha capito.
- **Meccaniche:** controllo prove chiave (se ne manca una, Davide aiuta a recuperarla: **nessun vicolo cieco**) · ricostruzione della sequenza (`timeline`) · tre affermazioni con grado di certezza (scelte bloccate dalle prove) · **cosa fare davvero** (`sort`) · scelta finale: come pubblicare.
- **Finali** (registrati nel salvataggio):
  - **A · La Verifica:** conclusione calibrata, correzione chiesta a Nicola, SMS segnalato, Elio protetto.
  - **B · Il dito puntato:** accusa senza prove; il gruppo si chiude; la smentita si perde. Si può rigiocare l'ultima scelta.
  - **C · Meglio tacere:** non pubblica; la frode continua; Elio perde meno grazie alla banca, ma l'avrebbe evitato.
  - **D · Verità a metà:** conclusione giusta, ma dichiara di sapere chi è il «cugino».
- **Chiusura dei personaggi:** Lina (si ricollega al cap. 1: controlla da sola un nuovo messaggio, o si riconcilia), Elio, Nicola (correzione pubblica o riluttante), Irene, Davide (la proposta).

## Matrice capitolo / meccanica / prove / conseguenze

| Cap. | Meccanica principale | Attività | Prove nuove | Scelta con conseguenza |
|---|---|---|---|---|
| 2 | Mittente e link | inspect sms, inspect email, sort, factcheck | ev_sms_rimborso, ev_mail_prefettura, ev_dominio_recente | `opened_link` / `replied_stop` / `checked_official` |
| 3 | Foto fuori contesto | inspect photo, factcheck | ev_foto_autobotte, ev_foto_2021, ev_inserzioni_rocco | `nicola_open` / `nicola_pride` |
| 4 | Catena e gregge | inspect chat, sort | ev_versioni_catena, ev_post_cancellato (debole), ev_destinatari_sms (debole) | `accused_nicola` / `posted_sources` / `private_route` |
| 5 | Voce e secondo canale | inspect audio, factcheck | ev_audio_sindaco, ev_smentita_sindaco, ev_video_consiglio, ev_rilevatore (debole) | `asked_nicola_audio` / `asked_davide_audio` / `called_mayor` |
| 6 | Pressione e pagamento | inspect call, sort | ev_telefonata_elio, ev_iban_azienda | `elio_close_call` / `elio_calm` |
| 7 | Ricostruire e rivedere | timeline, sort + colloqui | ev_irene_bozza, ev_comunicato_lavori, ev_nicola_ammette, ev_rocco_nessun_legame | `hypothesis_revised`, `cugino_incerto` |
| 8 | Conclusione calibrata | timeline, sort | — (tutte le precedenti) | finali A–D |

## Limiti tecnici e scelte di progetto
- Il motore supporta `if` su un solo flag: per condizioni su prove ho aggiunto il nodo `ifev` (retrocompatibile).
- Le attività avevano uno sfondo fisso per tipo: ho aggiunto `scene` opzionale (di default come prima).
- Il salvataggio **resta alla versione 1**: i nuovi dati sono solo flag e id di prove aggiuntivi. Un salvataggio del cap. 1 si carica e prosegue (test con fixture fedele).
- Niente audio reale (gioco offline, nessun file): il vocale è reso con forma d'onda e trascrizione toccabile, e il testo lo dice.
