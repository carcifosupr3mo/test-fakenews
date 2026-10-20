type Child = Node | string | null | undefined | false;
type Attrs = Record<string, unknown>;

/** Mini helper per creare elementi: h('div.card#id', {onclick}, ...figli) */
export function h(sel: string, attrs?: Attrs | Child, ...kids: Child[]): HTMLElement {
  const m = /^([a-z0-9]*)((?:[.#][\w-]+)*)$/i.exec(sel);
  const tag = m?.[1] || 'div';
  const el = document.createElement(tag);
  for (const part of (m?.[2] ?? '').match(/[.#][\w-]+/g) ?? []) {
    if (part[0] === '.') el.classList.add(part.slice(1));
    else el.id = part.slice(1);
  }
  let children = kids;
  if (typeof attrs === 'string' || attrs instanceof Node || attrs === false) children = [attrs as Child, ...kids];
  else if (attrs && typeof attrs === 'object') {
    for (const [k, v] of Object.entries(attrs as Attrs)) {
      if (v === undefined || v === null || v === false) continue;
      if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v as EventListener);
      else if (k === 'class') el.className += ' ' + String(v);
      else if (k === 'html') el.innerHTML = String(v);
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, String(v));
    }
  }
  for (const c of children) if (c !== null && c !== undefined && c !== false) el.append(c as Node | string);
  return el;
}

/** Come append(), ma ignora null/undefined/false. */
export function fill(el: HTMLElement, ...kids: Child[]): HTMLElement {
  for (const k of kids) if (k !== null && k !== undefined && k !== false) el.append(k as Node | string);
  return el;
}
export const clear = (el: HTMLElement) => { while (el.firstChild) el.removeChild(el.firstChild); return el; };

export function btn(label: string | Node, onclick: () => void, cls = ''): HTMLButtonElement {
  return h('button.btn' + (cls ? '.' + cls.split(' ').join('.') : ''), { type: 'button', onclick }, label) as HTMLButtonElement;
}

export function downloadText(name: string, text: string, mime = 'application/json') {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: mime }));
  a.download = name;
  document.body.append(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

export function pickFile(accept: string): Promise<string | null> {
  return new Promise((res) => {
    const i = document.createElement('input');
    i.type = 'file'; i.accept = accept;
    i.onchange = () => {
      const f = i.files?.[0];
      if (!f) return res(null);
      f.text().then(res, () => res(null));
    };
    i.click();
  });
}

export function stars(n: number, max = 3): string {
  return '★'.repeat(n) + '☆'.repeat(Math.max(0, max - n));
}

/** Mescolamento deterministico, per non cambiare l'ordine a ogni rendering. */
export function seeded<T>(arr: T[], seed: string): T[] {
  let s = 0;
  for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0;
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
