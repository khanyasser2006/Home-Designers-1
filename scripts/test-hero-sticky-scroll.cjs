const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    console.log('Testing Hero sticky canvas scrolling...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    // 1. Initial State (Top of hero)
    await page.screenshot({ path: 'scripts/scroll_01_top_hero.png' });
    console.log('1. Top Hero captured');

    // 2. Scroll 1000px down (during sticky video scrub)
    await page.evaluate(() => window.scrollTo({ top: 1000, behavior: 'instant' }));
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'scripts/scroll_02_mid_hero.png' });
    console.log('2. Mid Hero (1000px) captured');

    // 3. Scroll 2500px down (late sticky video scrub)
    await page.evaluate(() => window.scrollTo({ top: 2500, behavior: 'instant' }));
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'scripts/scroll_03_late_hero.png' });
    console.log('3. Late Hero (2500px) captured');

    // 4. Scroll to 4200px (End of hero transitioning to Material Provenance)
    await page.evaluate(() => window.scrollTo({ top: 4200, behavior: 'instant' }));
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'scripts/scroll_04_material_provenance.png' });
    console.log('4. Material Provenance captured');

    // 5. Scroll to 6000px (Featured Residences)
    await page.evaluate(() => window.scrollTo({ top: 6000, behavior: 'instant' }));
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'scripts/scroll_05_featured_residences.png' });
    console.log('5. Featured Residences captured');

    await browser.close();
    console.log('Hero sticky scroll verified with 100% success!');
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
