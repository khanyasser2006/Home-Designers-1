const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.setViewportSize({ width: 1440, height: 900 });
    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // 1. Hero with cursive signature
    await page.screenshot({ path: 'scripts/ultra_1_hero.png' });
    console.log('Saved scripts/ultra_1_hero.png');

    // 2. Material Provenance & Philosophy
    await page.evaluate(() => {
      const el = document.getElementById('philosophy');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/ultra_2_provenance_philosophy.png' });
    console.log('Saved scripts/ultra_2_provenance_philosophy.png');

    // 3. Asymmetric Monographs Portfolio
    await page.evaluate(() => {
      const el = document.getElementById('projects');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/ultra_3_monographs.png' });
    console.log('Saved scripts/ultra_3_monographs.png');

    // 4. Contact Underline-Only Form
    await page.evaluate(() => {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/ultra_4_contact.png' });
    console.log('Saved scripts/ultra_4_contact.png');

    await browser.close();
    console.log('Ultra luxury test completed!');
  } catch (err) {
    console.error('Playwright error:', err.message);
  }
})();
