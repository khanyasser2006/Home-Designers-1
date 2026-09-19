const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Scroll to MaterialsMatrix
    await page.evaluate(() => {
      window.scrollTo(0, 6800);
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/luxury_materials.png' });
    console.log('Saved scripts/luxury_materials.png');

    await browser.close();
  } catch (err) {
    console.error('Playwright error:', err.message);
  }
})();
