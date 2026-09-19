const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/#/admin', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    await browser.close();
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
