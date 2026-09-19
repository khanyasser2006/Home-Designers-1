const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.setViewportSize({ width: 1440, height: 900 });
    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    // 1. Hero initial
    await page.screenshot({ path: 'scripts/luxury_1_hero.png' });
    console.log('Saved scripts/luxury_1_hero.png');

    // 2. Signature Bar & Philosophy
    await page.evaluate(() => {
      const el = document.getElementById('philosophy');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/luxury_2_philosophy.png' });
    console.log('Saved scripts/luxury_2_philosophy.png');

    // 3. Featured Projects
    await page.evaluate(() => {
      const el = document.getElementById('projects');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/luxury_3_projects.png' });
    console.log('Saved scripts/luxury_3_projects.png');

    // 4. Process & Methodology
    await page.evaluate(() => {
      const el = document.getElementById('process');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/luxury_4_process.png' });
    console.log('Saved scripts/luxury_4_process.png');

    // 5. Contact & Atelier
    await page.evaluate(() => {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/luxury_5_contact.png' });
    console.log('Saved scripts/luxury_5_contact.png');

    await browser.close();
    console.log('Luxury visual verification completed!');
  } catch (err) {
    console.error('Playwright error:', err.message);
  }
})();
