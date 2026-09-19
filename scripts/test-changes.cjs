const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.setViewportSize({ width: 1440, height: 900 });
    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // 1. Initial State: No Navbar, No Vignette, Text at Bottom-Left
    await page.screenshot({ path: 'scripts/verify_1_hero_start.png' });
    console.log('Saved scripts/verify_1_hero_start.png');

    // 2. Mid Scroll (40%): No Navbar, Text at Top-Right
    await page.evaluate(() => window.scrollTo(0, 1600));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/verify_2_hero_mid.png' });
    console.log('Saved scripts/verify_2_hero_mid.png');

    // 3. Late Scroll (75%): No Navbar, Text at Bottom-Right
    await page.evaluate(() => window.scrollTo(0, 3000));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/verify_3_hero_late.png' });
    console.log('Saved scripts/verify_3_hero_late.png');

    // 4. Past Hero (into Philosophy): Navbar MUST BE VISIBLE!
    await page.evaluate(() => {
      const el = document.getElementById('philosophy');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/verify_4_navbar_visible.png' });
    console.log('Saved scripts/verify_4_navbar_visible.png');

    await browser.close();
    console.log('All verifications completed successfully!');
  } catch (err) {
    console.error('Playwright error:', err.message);
  }
})();
