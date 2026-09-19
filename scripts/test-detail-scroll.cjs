const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    
    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Scroll to projects section
    await page.evaluate(() => {
      const el = document.getElementById('projects');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(1000);

    // Click the first project card
    const firstProject = await page.$('#projects .group');
    if (firstProject) {
      await firstProject.click();
      console.log('Clicked first project card');
    }
    await page.waitForTimeout(1000);

    // Scroll inside the modal container
    await page.evaluate(() => {
      const modal = document.querySelector('.fixed.inset-0.overflow-y-auto');
      if (modal) modal.scrollTo(0, 800);
    });
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/detail_test_03_modal_scrolled.png' });
    console.log('Captured scrolled modal');

    // Scroll further down to bottom of modal (Materials & Next/Prev)
    await page.evaluate(() => {
      const modal = document.querySelector('.fixed.inset-0.overflow-y-auto');
      if (modal) modal.scrollTo(0, 1800);
    });
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/detail_test_03_modal_bottom.png' });
    console.log('Captured modal bottom with material palette and next project');

    await browser.close();
    console.log('Modal scroll test complete!');
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
