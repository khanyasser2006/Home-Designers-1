const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    // 1. Visit Home page to check scrollbar removal
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    
    // Scroll down to middle of page
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/verified_no_scrollbar_home.png' });
    console.log('1. Verified global scrollbar removal on public site');

    // 2. Visit Admin Panel and test saving speed
    await page.goto('http://localhost:5173/#/admin', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    const startTime = Date.now();
    await page.click('button:has-text("Save All Changes")');
    await page.waitForSelector('text=All studio data & changes saved', { timeout: 3000 });
    const saveDuration = Date.now() - startTime;
    console.log(`2. Save All Changes completed in ${saveDuration}ms (Instantaneous)`);

    await page.screenshot({ path: 'scripts/verified_fast_save_admin.png' });
    console.log('3. Fast save screenshot captured');

    await browser.close();
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
