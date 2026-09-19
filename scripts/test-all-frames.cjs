const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.setViewportSize({ width: 1440, height: 900 });
    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Scroll to 25% (Foyer/Living)
    await page.evaluate(() => window.scrollTo(0, 900));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'scripts/frame_test_25.png' });

    // Scroll to 50% (Hallway)
    await page.evaluate(() => window.scrollTo(0, 1800));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'scripts/frame_test_50.png' });

    // Scroll to 75% (Kitchen/Master)
    await page.evaluate(() => window.scrollTo(0, 2700));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'scripts/frame_test_75.png' });

    // Scroll to 95% (Approaching bedroom/pool window)
    await page.evaluate(() => window.scrollTo(0, 3400));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'scripts/frame_test_95.png' });

    // Scroll to 100% of hero animation (Final frame out the window)
    await page.evaluate(() => window.scrollTo(0, 3600));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'scripts/frame_test_100_final.png' });

    await browser.close();
    console.log('All frame progression tests completed!');
  } catch (err) {
    console.error('Playwright error:', err.message);
  }
})();
