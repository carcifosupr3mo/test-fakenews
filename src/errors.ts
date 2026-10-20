/** Registro locale degli errori tecnici (ultimi 50). Visibile solo dagli strumenti di test. */
const KEY = 'verifica.errors';
export interface ErrRec { at: string; msg: string }

export function getErrors(): ErrRec[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { return []; }
}
export function clearErrors() { try { localStorage.removeItem(KEY); } catch { /* ignore */ } }
function push(msg: string) {
  try {
    const l = getErrors(); l.push({ at: new Date().toISOString(), msg: msg.slice(0, 500) });
    localStorage.setItem(KEY, JSON.stringify(l.slice(-50)));
  } catch { /* ignore */ }
}
export function installErrorLog() {
  window.addEventListener('error', (e) => push(`${e.message} @ ${e.filename}:${e.lineno}`));
  window.addEventListener('unhandledrejection', (e) => push('promise: ' + String(e.reason)));
}
