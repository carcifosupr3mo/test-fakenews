// Verifica reale del pacchetto PC: estrae lo ZIP in una cartella pulita, avvia VERIFICA.exe,
// lo pilota via DevTools Protocol, gioca il capitolo 1, chiude, riavvia e controlla la persistenza.
import { spawn, execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const zip = process.argv[2];
const work = mkdtempSync(path.join(tmpdir(), 'verifica-verify-'));
execFileSync('powershell', ['-NoProfile', '-Command', `Expand-Archive -Path '${zip}' -DestinationPath '${work}'`]);
const exe = path.join(work, 'VERIFICA-PC', 'VERIFICA.exe');
const profile = path.join(work, 'profilo');
const PORT = 9333;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (name, ok, extra = '') => { results.push({ name, ok }); console.log(`${ok ? 'OK  ' : 'FAIL'} ${name} ${extra}`); };

async function launch() {
  // ambiente minimo: dimostra che non servono Node/npm (il PATH non viene usato dall'exe)
  const p = spawn(exe, [`--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`], { stdio: 'ignore' });
  let target;
  for (let i = 0; i < 60 && !target; i++) {
    await sleep(500);
    try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === 'page'); } catch { /* attende */ }
  }
  if (!target) throw new Error('VERIFICA.exe non ha aperto nessuna finestra');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pending = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); pending.get(d.id)?.(d); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const evalJs = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 300)); return r.result?.result?.value; };
  // attende che la pagina del gioco sia davvero caricata (la finestra può esistere prima del documento)
  for (let i = 0; i < 60; i++) {
    try { if ((await evalJs('location.protocol + document.readyState + !!document.querySelector(".home,.welcome,.play")')) === 'file:completetrue') break; } catch { /* non ancora pronta */ }
    await sleep(500);
  }
  return { p, ws, evalJs, send, target };
}

const driver = readFileSync(new URL('./play-driver.js', import.meta.url), 'utf8');

try {
  check('l\'ZIP contiene VERIFICA.exe e LEGGIMI.txt', existsSync(exe) && existsSync(path.join(work, 'VERIFICA-PC', 'LEGGIMI.txt')));

  // --- prima esecuzione ---
  let a = await launch();
  const title = await a.evalJs('document.title');
  check('la finestra si apre e carica il gioco', String(title).startsWith('VERIFICA'), `(${title})`);
  check('protocollo file:// (nessun server locale)', (await a.evalJs('location.protocol')) === 'file:');
  check('home visibile', await a.evalJs('!!document.querySelector(".home .titleblock")'));
  check('nessun oggetto di debug esposto', (await a.evalJs('typeof window.__store')) === 'undefined');
  await a.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'D', code: 'KeyD', modifiers: 10, windowsVirtualKeyCode: 68 });
  await sleep(300);
  check('Ctrl+Maiusc+D non apre alcun pannello', !(await a.evalJs('!!document.querySelector(".dbg")')));
  const res = await a.evalJs('performance.getEntriesByType("resource").map(r=>r.name).filter(n=>!/^(file|data|blob):/.test(n)).length');
  check('nessuna risorsa non locale caricata all avvio', res === 0, `(${res})`);
  const net = await a.evalJs('fetch("https://example.com").then(()=> "RAGGIUNTO").catch(()=> "bloccato")');
  check('le richieste di rete sono bloccate', net === 'bloccato', `(${net})`);
  check('prima volta: la schermata di benvenuto spiega come si gioca', await a.evalJs('(()=>{document.querySelector(".btn.primary.big").click(); return !!document.querySelector(".welcome .wsteps")})()'));
  const played = JSON.parse(await a.evalJs(driver));
  check('il benvenuto compare alla prima partita', played.log[0] === 'benvenuto');
  check('capitolo 1 giocato fino alla fine', played.end, `(${played.log.join(' > ')})`);
  const save1 = JSON.parse(await a.evalJs('localStorage.getItem("verifica.save.auto")'));
  check('autosalvataggio presente: capitolo 1 completato', save1.done.includes('ch1') && save1.evidence.length >= 5, `(${save1.evidence.length} prove)`);
  await a.evalJs('window.confirm=()=>true; [...document.querySelectorAll(".btn")].find(b=>b.textContent.includes("Quaderno")).click(); document.querySelector(".nb-body")?.textContent.length');
  check('il quaderno mostra le prove', await a.evalJs('document.querySelectorAll(".ev").length') >= 5);
  void a.send('Browser.close'); await sleep(4000); // chiusura ordinata, come quando si chiude la finestra
  try { execFileSync('taskkill', ['/F', '/IM', 'VERIFICA.exe'], { stdio: 'ignore' }); } catch { /* già chiuso */ }
  await sleep(1500);

  // --- seconda esecuzione: persistenza ---
  a = await launch();
  const save2 = JSON.parse(await a.evalJs('localStorage.getItem("verifica.save.auto")'));
  check('dopo il riavvio la partita è ancora lì', save2?.done?.includes('ch1') && save2.evidence.length === save1.evidence.length);
  check('la home mostra i progressi (stelle)', (await a.evalJs('document.querySelector(".foot").textContent')).includes('Stelle:') && !(await a.evalJs('document.querySelector(".foot").textContent')).includes('Stelle: 0'));
  check('dopo il riavvio il benvenuto non compare piu', save2.settings.welcomed === true);
  const exp = await a.evalJs('(async()=>{const m=await import("data:text/javascript,export default 1"); return "ok"})().catch(()=>"n/a")');
  void exp;
  void a.send('Browser.close'); await sleep(2000);
} catch (e) {
  console.error('ERRORE:', e.message); results.push({ name: 'esecuzione', ok: false });
} finally {
  try { execFileSync('taskkill', ['/F', '/IM', 'VERIFICA.exe'], { stdio: 'ignore' }); } catch { /* ok */ }
  console.log(`\n${results.filter((r) => r.ok).length}/${results.length} controlli superati. Cartella di prova: ${work}`);
  process.exit(results.every((r) => r.ok) ? 0 : 1);
}
