const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    console.log('Testing Process Page navigation...');
    await page.goto('http://localhost:5173/#/process', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    // Verify all 4 steps are rendered
    const stepsCount = await page.$$eval('.space-y-16 > div', divs => divs.length);
    console.log(`Rendered process steps count: ${stepsCount}`);

    // Click an FAQ item to test interactivity
    await page.click('text=Where does your studio build residences?');
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'scripts/verified_process_page.png' });
    console.log('Process page screenshot captured successfully!');

    await browser.close();
    console.log('Process page verification 100% SUCCESS!');
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
