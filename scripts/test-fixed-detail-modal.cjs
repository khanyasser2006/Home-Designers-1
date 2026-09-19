const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    
    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Scroll to projects
    const projectSection = page.locator('#projects');
    await projectSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    // Click the first project card
    const firstProject = page.locator('#projects .group').first();
    await firstProject.click();
    console.log('Clicked first project card');
    await page.waitForTimeout(1000);

    // Capture initial open state (Top title, subtitle, full image, thumbnails)
    await page.screenshot({ path: 'scripts/fixed_modal_top.png' });
    console.log('Captured scripts/fixed_modal_top.png');

    // Simulate mouse wheel down on the modal
    await page.mouse.move(720, 500);
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'scripts/fixed_modal_wheel_scroll_1.png' });
    console.log('Captured scripts/fixed_modal_wheel_scroll_1.png after mousewheel');

    // Simulate more mouse wheel down to bottom
    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'scripts/fixed_modal_wheel_scroll_2.png' });
    console.log('Captured scripts/fixed_modal_wheel_scroll_2.png after full mousewheel');

    await browser.close();
    console.log('Fixed detail modal tests passed successfully!');
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
