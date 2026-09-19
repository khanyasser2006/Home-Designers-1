const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    // ─── 1. Verify Navbar is HIDDEN on Home during Hero Animation ───
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    const isNavHiddenInitial = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      return nav && (nav.classList.contains('opacity-0') || nav.classList.contains('-translate-y-full'));
    });
    console.log('1. Navbar hidden on initial Home page load:', isNavHiddenInitial);

    // Scroll 500px down (still in hero) -> Navbar should STILL be hidden
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(400);
    const isNavHiddenMidHero = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      return nav && (nav.classList.contains('opacity-0') || nav.classList.contains('-translate-y-full'));
    });
    console.log('2. Navbar still hidden during mid-hero scrub (500px):', isNavHiddenMidHero);

    // Scroll 4000px down (past hero animation) -> Navbar should APPEAR
    await page.evaluate(() => window.scrollTo(0, 4200));
    await page.waitForTimeout(600);
    const isNavVisiblePostHero = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      return nav && nav.classList.contains('opacity-100');
    });
    console.log('3. Navbar appears after hero animation completes:', isNavVisiblePostHero);
    await page.screenshot({ path: 'scripts/verified_navbar_behavior.png' });

    // ─── 2. Test Admin Panel Edit -> Live Website Sync ───
    await page.goto('http://localhost:5173/#/admin', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    // Click 05 Hero Headlines tab
    await page.click('button:has-text("Hero Headlines")');
    await page.waitForTimeout(500);

    // Edit Main Headline
    const testHeadline = 'Private Sanctuaries of Pure Light';
    await page.fill('input[value*="We design homes"]', testHeadline);
    await page.click('button:has-text("Save Hero Typography")');
    await page.waitForTimeout(800);

    // Navigate to Live Website
    await page.click('button:has-text("View Live Website")');
    await page.waitForTimeout(1200);

    // Check if the live hero headline matches our edited text
    const liveHeadlineText = await page.textContent('.hero-phrase-1 h1');
    console.log('4. Live Headline on website after admin save:', liveHeadlineText.trim());

    await page.screenshot({ path: 'scripts/verified_live_admin_sync.png' });

    await browser.close();
    console.log('All navbar and live sync tests completed successfully!');
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
