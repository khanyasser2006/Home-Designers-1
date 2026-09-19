const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // 1. Go to Homes page to verify new residence is live on public site
    await page.goto('http://localhost:5173/#/homes', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/admin_test_03_public_homes_live.png' });
    console.log('1. Public Homes page screenshot with new residence captured');

    // 2. Go to Admin Inquiries Tab
    await page.goto('http://localhost:5173/#/admin', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Client Inquiries")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/admin_test_04_inquiries_tab.png' });
    console.log('2. Inquiries tab captured');

    // 3. Test Process Tab
    await page.click('button:has-text("Design Steps")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/admin_test_05_process_tab.png' });
    console.log('3. Process tab captured');

    await browser.close();
    console.log('All verification screenshots captured successfully!');
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
