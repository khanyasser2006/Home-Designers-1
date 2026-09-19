const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    
    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Scroll to living spaces
    const kitchenTab = page.locator('button:has-text("THE MODERN KITCHEN")');
    await kitchenTab.scrollIntoViewIfNeeded();
    await kitchenTab.click();
    await page.waitForTimeout(500);

    // Click "View Full Room Dossier"
    const viewBtn = page.locator('button:has-text("View Full Room Dossier")');
    await viewBtn.click();
    console.log('Clicked View Full Room Dossier');
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/space_modal_test.png' });
    console.log('Captured space modal');

    await browser.close();
    console.log('Space modal test passed!');
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
