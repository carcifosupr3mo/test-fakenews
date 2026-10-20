// Guscio desktop di VERIFICA. Carica solo il file locale index.html: nessuna rete, nessun devtools.
const { app, BrowserWindow, Menu, shell, session } = require('electron');
const path = require('node:path');

app.setName('VERIFICA');
if (!app.requestSingleInstanceLock()) app.quit();

function create() {
  const win = new BrowserWindow({
    width: 1280, height: 860, minWidth: 720, minHeight: 560,
    title: 'VERIFICA — La verità dietro lo schermo', backgroundColor: '#f4efe6', show: false,
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, devTools: false, spellcheck: false },
  });
  Menu.setApplicationMenu(null);
  win.once('ready-to-show', () => win.show());
  win.loadFile(path.join(__dirname, 'index.html'));

  // Link esterni (fonti dei casi reali): solo https, e solo se la giocatrice li tocca → browser di sistema.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https:\/\//i.test(url)) void shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('file://')) { e.preventDefault(); if (/^https:\/\//i.test(url)) void shell.openExternal(url); }
  });
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
  });
}

app.whenReady().then(() => {
  // Il gioco non deve fare richieste di rete: tutto ciò che non è file/data viene bloccato.
  session.defaultSession.webRequest.onBeforeRequest((d, cb) => cb({ cancel: !/^(file|data|blob|devtools):/i.test(d.url) }));
  session.defaultSession.setPermissionRequestHandler((_wc, _perm, cb) => cb(false));
  create();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) create(); });
});
app.on('second-instance', () => { const w = BrowserWindow.getAllWindows()[0]; if (w) { if (w.isMinimized()) w.restore(); w.focus(); } });
app.on('window-all-closed', () => app.quit());
