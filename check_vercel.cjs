const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  await page.goto('https://champions-hq.vercel.app/', { waitUntil: 'networkidle0' }).catch(e => console.log('nav error', e.message));
  const html = await page.content();
  console.log(html);
  await browser.close();
})();
