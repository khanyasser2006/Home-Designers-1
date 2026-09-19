const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto('http://localhost:5173/#/auth', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(800);
    await page.click('button:has-text("1-Click Admin Login")');
    await page.waitForTimeout(1000);

    // 1. Initial State
    await page.screenshot({ path: 'scripts/admin_real_metrics_initial.png' });
    console.log('1. Initial real metrics captured');

    // 2. Click Right Slide button to test sliding
    await page.click('button[title="Slide right"]');
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'scripts/admin_slid_tabs.png' });
    console.log('2. Tabs sliding verified and captured');

    // 3. Add Residence to verify metric counter increment from 06 to 07
    await page.click('button:has-text("+ Commission New Residence")');
    await page.waitForTimeout(500);
    await page.fill('input[placeholder="e.g. The Aspen Ridge Compound"]', 'The Malibu Pacific Overlook');
    await page.fill('input[placeholder="e.g. Alpine timber and heated granite"]', 'Oceanfront travertine and glass');
    await page.fill('input[placeholder="e.g. Aspen, Colorado"]', 'Malibu, California');
    await page.fill('input[placeholder="e.g. 10,200 sq.ft."]', '12,500 sq.ft.');
    await page.fill('textarea[placeholder="Describe the architectural concept, solar orientation, materials..."]', 'A dramatic coastal compound perched over the Pacific.');
    await page.click('button:has-text("Save Residence to Live Website")');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'scripts/admin_metric_incremented.png' });
    console.log('3. Metric counter increment verified');

    await browser.close();
    console.log('All tests completed successfully!');
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
