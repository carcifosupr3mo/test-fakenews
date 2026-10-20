// Crea il pacchetto portatile per Windows: VERIFICA.exe (runtime Electron incluso) + il gioco.
// Nessun Node.js né installazione necessari sul PC di destinazione.
import { cpSync, rmSync, mkdirSync, writeFileSync, renameSync, existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const version = JSON.parse(readFileSync('package.json', 'utf8')).version;
const outRoot = path.join(root, 'release');
const folder = path.join(outRoot, 'VERIFICA-PC');
const electronDist = path.join(root, 'node_modules', 'electron', 'dist');
const html = path.join(root, 'dist-standalone', 'index.html');

if (process.platform !== 'win32') throw new Error('Questo script genera il pacchetto Windows: eseguilo su Windows.');
if (!existsSync(electronDist)) throw new Error('Binario Electron mancante: esegui "node node_modules/electron/install.js"');
if (!existsSync(html)) throw new Error('Esegui prima "npm run build:standalone"');

rmSync(outRoot, { recursive: true, force: true });
mkdirSync(folder, { recursive: true });
cpSync(electronDist, folder, { recursive: true });
renameSync(path.join(folder, 'electron.exe'), path.join(folder, 'VERIFICA.exe'));
rmSync(path.join(folder, 'resources', 'default_app.asar'), { force: true });

const app = path.join(folder, 'resources', 'app');
mkdirSync(app, { recursive: true });
cpSync(path.join(root, 'electron', 'main.cjs'), path.join(app, 'main.cjs'));
cpSync(html, path.join(app, 'index.html'));
writeFileSync(path.join(app, 'package.json'), JSON.stringify({ name: 'verifica', productName: 'VERIFICA', version, main: 'main.cjs' }, null, 2));

// Copia di riserva: il gioco come unico file HTML (si apre con Chrome/Edge/Firefox con doppio clic).
cpSync(html, path.join(folder, 'VERIFICA (solo browser).html'));
writeFileSync(path.join(folder, 'LEGGIMI.txt'), [
  'VERIFICA — La verità dietro lo schermo',
  '',
  'COME GIOCARE',
  '1. Se è uno ZIP: tasto destro → "Estrai tutto…" e apri la cartella estratta.',
  '2. Doppio clic su  VERIFICA.exe',
  '3. Se Windows mostra "Windows ha protetto il PC": clicca "Ulteriori informazioni" → "Esegui comunque".',
  '   (Succede perché il programma non ha una firma a pagamento: il gioco è locale e non si collega a Internet.)',
  '',
  'Non serve Internet, né installare nulla. La partita si salva da sola.',
  'F11 = schermo intero. Spazio/Invio = avanti. Per salvare una copia: Impostazioni → Esporta partita.',
  '',
  'Se VERIFICA.exe non si avvia: apri "VERIFICA (solo browser).html" con un doppio clic (Chrome, Edge o Firefox).',
  '(In quel caso i salvataggi restano nel browser usato: usa sempre lo stesso.)',
  '',
  `Versione ${version}`,
].join('\r\n'));

// File per iPad: lo stesso identico HTML. ATTENZIONE: l'apertura da file locale su iPadOS NON è stata verificata.
const ipad = path.join(outRoot, 'VERIFICA-iPad');
mkdirSync(ipad, { recursive: true });
cpSync(html, path.join(ipad, 'VERIFICA.html'));
cpSync(path.join(root, 'docs', 'LEGGIMI-iPad.txt'), path.join(ipad, 'LEGGIMI-iPad.txt'));

// ZIP (Compress-Archive di Windows)
const zip = path.join(outRoot, `VERIFICA-PC-v${version}.zip`);
execFileSync('powershell', ['-NoProfile', '-Command', `Compress-Archive -Path '${folder}' -DestinationPath '${zip}' -CompressionLevel Optimal`], { stdio: 'inherit' });
const zipIpad = path.join(outRoot, `VERIFICA-iPad-v${version}.zip`);
execFileSync('powershell', ['-NoProfile', '-Command', `Compress-Archive -Path '${ipad}' -DestinationPath '${zipIpad}' -CompressionLevel Optimal`], { stdio: 'inherit' });
console.log('Pacchetti pronti:', zip, zipIpad);
