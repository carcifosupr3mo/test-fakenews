# Pubblicazione su GitHub Pages

Stato: **preparata e verificata in locale, NON pubblicata.** Nessun push, nessuna impostazione remota toccata.

## Cosa c'è
- `.github/workflows/pages.yml`: `npm ci` → test → typecheck → `build:final` → pubblica solo `dist/`. Permessi minimi (`contents: read`; `pages`/`id-token: write` solo nel job di deploy). Si avvia **solo a mano** (`workflow_dispatch`): nessuna pubblicazione involontaria.
- `vite.config.ts` non è stato modificato: `base: './'` (percorsi relativi) funziona in qualunque sottopercorso (`https://<account>.github.io/<repo>/`), quindi non serve conoscere il nome del repository. Manifest e service worker usano `./` come scope.
- `.gitignore`: esclusi `dist-standalone`, `release` (pacchetti PC/iPad, 150 MB), `.env*`, `.claude`.

## Verifiche fatte
- `dist/` servito sotto `/miorepo/` con un server statico di prova: tutte le risorse 200, nessun 404, nessuna richiesta fuori dall'origine.
- Chrome reale: service worker registrato con scope `/miorepo/`, 10 file in precache, ricarica **con il server spento** → il gioco si apre (simulazione su localhost, non su dispositivo reale).
- Nel pannello integrato del Claude desktop i service worker sono bloccati: lì non verificabile.
- `dist/` non contiene sourcemap, strumenti di debug, `.env`, log, pacchetti o documenti.

## Cosa serve da te (il repository non esiste ancora: la cartella non è un repo Git)
1. Crea su GitHub un repository (nome a tua scelta) e carica il contenuto della cartella `verifica` (senza `node_modules`, già ignorata).
2. Sul repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. **Actions → "Pubblica su GitHub Pages" → Run workflow.**
4. L'URL sarà `https://<tuo-account>.github.io/<nome-repo>/` (comparirà nel job `deploy`).

## Privacy
- Un sito GitHub Pages è **pubblico a chiunque abbia il link**, anche se il repository è privato (le Pages private richiedono piani Enterprise Cloud: verifica il tuo piano). Il gioco non contiene dati personali, analytics o servizi esterni.
- Il repository, se pubblico, espone anche sorgenti e `docs/`.

## Salvataggi
- `localStorage` del browser (chiave `verifica.save.auto` + slot manuali): sopravvivono alla chiusura del browser; sono **separati** per browser e dispositivo; nessun cloud. Esportazione/importazione JSON dalle Impostazioni per spostarli.
- Con un account GitHub Pages `<account>.github.io` l'origine è condivisa tra tutti i progetti dello stesso account: salvataggi e dati di altri siti coesistono (chiavi distinte).
- Aggiornamenti: formato salvataggio versione 1 con `migrate()`; un salvataggio del capitolo 1 resta compatibile (testato con fixture). Il service worker è in `autoUpdate`: la nuova versione si attiva al caricamento successivo alla pubblicazione.
- Safari su iPad può cancellare i dati di siti non usati per un certo periodo: esportare la partita è la protezione.

## Limiti
- Non provato su iPad fisico (né installazione sulla Home, né uso offline su iPadOS).
- Il primo caricamento richiede connessione; poi funziona offline.
