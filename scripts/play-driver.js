(async () => {
  // Gioca il capitolo 1 come una persona: benvenuto, dialoghi, scelte, tre attività. Restituisce un riepilogo in JSON.
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const log = [];
  const pick = (sel, re) => [...document.querySelectorAll(sel)].find((e) => re.test(e.textContent));
  const route = (window.__route ?? 1); // indice della prima scelta: 0 gira, 1 aspetta, 2 non so
  let firstChoice = true;
  const welcomeBtn = () => pick('.btn', /Ho capito, cominciamo/);
  if (!welcomeBtn() && !document.querySelector('.play')) { document.querySelector('.btn.primary.big')?.click(); await sleep(150); }
  if (welcomeBtn()) { log.push('benvenuto'); welcomeBtn().click(); await sleep(150); }
  for (let i = 0; i < 800; i++) {
    await sleep(15);
    const act = document.querySelector('.activity');
    if (act) {
      log.push(act.querySelector('h2').textContent);
      if (document.querySelector('.inspect')) {
        document.querySelectorAll('.hot').forEach((h) => h.click());
        await sleep(20);
        pick('.inspect-main > .btn', /Ho guardato abbastanza/)?.click(); await sleep(20);
        pick('.verdicts .btn', /Non lo giro e prima controllo/).click();
      } else if (document.querySelector('.fact')) {
        for (const s of document.querySelectorAll('.source')) {
          s.click(); await sleep(10);
          if (/Albo|Servizi Idrici|Rotta/.test(s.textContent)) pick('.reader .btn', /affidabile/)?.click();
        }
        await sleep(20);
        pick('.verdicts .btn', /vecchio avviso vero/).click();
      } else if (document.querySelector('.timeline')) {
        pick('.timeline .btn', /Mostrami/).click();
      }
      await sleep(40);
      document.querySelector('.result .btn').click();
      continue;
    }
    const next = document.querySelector('.dialogue .next');
    const choices = document.querySelectorAll('.choice');
    const phone = document.querySelector('.phone ~ .row .btn');
    if (document.querySelector('.endcard')) return JSON.stringify({ log, end: true });
    if (next) next.click();
    else if (choices.length) { choices[firstChoice ? route : 0].click(); firstChoice = false; }
    else if (phone) phone.click();
    else break;
  }
  return JSON.stringify({ log, end: false });
})()
