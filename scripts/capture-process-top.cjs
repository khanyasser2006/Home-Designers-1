const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto('http://localhost:5173/#/process', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'scripts/verified_process_top.png' });
    console.log('Process top screenshot captured');

    await browser.close();
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
