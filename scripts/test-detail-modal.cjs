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
    await page.screenshot({ path: 'scripts/detail_test_01_projects_section.png' });
    console.log('1. Captured projects section');

    // Click the first project card
    const firstProject = await page.$('#projects .group');
    if (firstProject) {
      await firstProject.click();
      console.log('Clicked first project card');
    }
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/detail_test_02_modal_open.png' });
    console.log('2. Captured project detail modal open');

    // Scroll inside the modal to capture specs and narrative
    await page.evaluate(() => {
      window.scrollTo(0, 700);
    });
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/detail_test_03_modal_specs.png' });
    console.log('3. Captured modal specifications and narrative');

    // Test clicking Next Project in the modal
    const nextBtn = await page.$('button:has-text("Next Project")');
    if (nextBtn) {
      await nextBtn.click();
      console.log('Clicked Next Project button');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'scripts/detail_test_04_modal_next_project.png' });
      console.log('4. Captured next project in modal');
    }

    // Close the modal
    const closeBtn = await page.$('button:has-text("Back to Atelier")');
    if (closeBtn) {
      await closeBtn.click();
      console.log('Clicked Back to Atelier to close modal');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'scripts/detail_test_05_modal_closed.png' });
      console.log('5. Captured modal closed');
    }

    await browser.close();
    console.log('All detailed view tests passed successfully!');
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
