const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto('http://localhost:5173/#/auth', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(800);
    await page.click('button:has-text("1-Click Admin Login")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/admin_full_coverage_overview.png' });
    console.log('100% full coverage Admin overview captured');

    await browser.close();
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
