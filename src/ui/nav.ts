/** Navigazione tra schermate: le funzioni vengono collegate da app.ts. */
export type NotebookTab = 'prove' | 'bacheca' | 'timeline' | 'glossario' | 'casi';
export const nav = {
  home: (): void => { throw new Error('nav non inizializzata'); },
  play: (_id: string, _restart?: boolean): void => { throw new Error('nav non inizializzata'); },
  notebook: (_tab?: NotebookTab): void => { throw new Error('nav non inizializzata'); },
  screen: (_name: string, _arg?: string): void => { throw new Error('nav non inizializzata'); },
  mount: (_el: HTMLElement): void => { throw new Error('nav non inizializzata'); },
};
