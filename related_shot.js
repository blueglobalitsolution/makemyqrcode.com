const puppeteer = require('puppeteer');
(async () => {
  const [url, out, vw] = process.argv.slice(2);
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  await page.setViewport({ width: Number(vw||1280), height: 900 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 1200));
  const blocks = await page.$$('.qr-related');
  if (!blocks.length) { console.log('no .qr-related found'); await browser.close(); return; }
  const info = await page.evaluate(() => [...document.querySelectorAll('.qr-related')].map(b => {
    const r = b.getBoundingClientRect();
    return { title: b.querySelector('h2')?.innerText, items: b.querySelectorAll('li').length, w: Math.round(r.width), h: Math.round(r.height) };
  }));
  console.log(url, JSON.stringify(info));
  const last = blocks[blocks.length - 1];
  await last.scrollIntoView();
  await new Promise(r => setTimeout(r, 400));
  await last.screenshot({ path: out });
  console.log('saved', out);
  await browser.close();
})();
