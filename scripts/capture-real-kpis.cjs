const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    // Directly open admin hash
    await page.goto('http://localhost:5173/#/admin', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'scripts/admin_real_kpis_live.png' });
    console.log('Admin real KPIs captured');

    await browser.close();
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
