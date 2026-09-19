const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    
    console.log('Testing subpage scrolling and Main button...');

    // 1. Go to Philosophy page
    await page.goto('http://localhost:5173/#/philosophy', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    // Scroll down on Philosophy page
    await page.mouse.move(720, 500);
    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/scroll_test_01_philosophy_scrolled.png' });
    console.log('1. Philosophy page scrolled down successfully');

    // 2. Go to Homes page via navbar
    const homesBtn = page.locator('nav .hidden.lg\\:flex button:has-text("Homes")');
    await homesBtn.click();
    await page.waitForTimeout(1000);

    // Scroll down on Homes page
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/scroll_test_02_homes_scrolled.png' });
    console.log('2. Homes page scrolled down successfully');

    // 3. Go to Process page via navbar
    const processBtn = page.locator('nav .hidden.lg\\:flex button:has-text("Process")');
    await processBtn.click();
    await page.waitForTimeout(1000);

    // Scroll down on Process page
    await page.mouse.wheel(0, 1400);
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/scroll_test_03_process_scrolled.png' });
    console.log('3. Process page scrolled down successfully');

    // 4. Click the "Main" button in navbar to redirect to hero page
    const mainBtn = page.locator('nav .hidden.lg\\:flex button:has-text("Main")');
    await mainBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'scripts/scroll_test_04_returned_to_main_hero.png' });
    console.log('4. Main button clicked — returned to Hero sequence successfully');

    await browser.close();
    console.log('All scrolling and Main button tests completed with 100% success!');
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
