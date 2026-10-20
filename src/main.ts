import './style.css';
import { installErrorLog } from './errors';
import { store } from './engine/state';
import { clear } from './ui/dom';
import { nav } from './ui/nav';
import { playScreen } from './ui/play';
import { applySettings, chaptersScreen, dailyScreen, guideScreen, homeScreen, labScreen, modesScreen, notebookScreen, reviewScreen, settingsScreen } from './ui/screens';

installErrorLog();
const root = document.getElementById('app')!;
const mount = (el: HTMLElement) => { clear(root).append(el); window.scrollTo({ top: 0 }); root.focus({ preventScroll: true }); };

nav.mount = mount;
nav.home = () => mount(homeScreen());
nav.play = (id, restart) => mount(playScreen(id, { restart }));
nav.notebook = (tab) => mount(notebookScreen(tab));
nav.screen = (name, arg) => {
  const screens: Record<string, () => HTMLElement> = {
    capitoli: chaptersScreen, modalita: modesScreen, lab: labScreen, ripasso: reviewScreen,
    guide: guideScreen, impostazioni: settingsScreen, daily: () => dailyScreen(arg ?? 'quotidiani'),
  };
  mount((screens[name] ?? homeScreen)());
};

applySettings();
nav.home();

// richiede archiviazione persistente (riduce il rischio che il browser cancelli i salvataggi)
try { void navigator.storage?.persist?.(); } catch { /* ignore */ }

// funzionamento offline: service worker (solo nelle build di produzione/test, non in `npm run dev`)
// (non esiste in file:// né nella build standalone: lì si usa il file locale)
if (import.meta.env.PROD && /^https?:$/.test(location.protocol)) {
  void import('virtual:pwa-register').then((m) => m.registerSW({ immediate: true }));
}

if (__DEBUG_BUILD__) {
  void import('./ui/debug').then((m) => m.installDebug());
}
// per i test manuali dalla console del browser (solo build di test)
if (__DEBUG_BUILD__) (window as unknown as Record<string, unknown>).__store = store;
