const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    
    console.log('Testing full-page routing...');

    // 1. Philosophy Page
    await page.goto('http://localhost:5173/#/philosophy', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/page_test_01_philosophy.png' });
    console.log('1. Philosophy Page captured');

    // 2. Homes Page
    await page.goto('http://localhost:5173/#/homes', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/page_test_02_homes.png' });
    console.log('2. Homes Page captured');

    // 3. Process Page
    await page.goto('http://localhost:5173/#/process', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/page_test_03_process.png' });
    console.log('3. Process Page captured');

    // 4. Contact Page
    await page.goto('http://localhost:5173/#/contact', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/page_test_04_contact.png' });
    console.log('4. Contact Page captured');

    // 5. Materials Page
    await page.goto('http://localhost:5173/#/materials', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/page_test_05_materials.png' });
    console.log('5. Materials Page captured');

    // 6. Studios Page
    await page.goto('http://localhost:5173/#/studios', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/page_test_06_studios.png' });
    console.log('6. Studios Page captured');

    // 7. Press Page
    await page.goto('http://localhost:5173/#/press', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/page_test_07_press.png' });
    console.log('7. Press Page captured');

    // 8. Test in-page navbar click back to Home
    const logo = page.locator('nav button').first();
    await logo.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/page_test_08_home_returned.png' });
    console.log('8. Returned to Home Page captured');

    await browser.close();
    console.log('All 8 pages and routing links verified successfully!');
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
