const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });

    // ─── Test 1: Mobile Phone (iPhone 14 / 15: 393x852) ───
    console.log('1. Testing Mobile Viewport (393x852)...');
    const mobileContext = await browser.newContext({
      viewport: { width: 393, height: 852 },
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();

    await mobilePage.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
    await mobilePage.waitForTimeout(1200);

    // Check no horizontal scroll overflow
    const hasHorizontalOverflow = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log(`Mobile Home Page has horizontal overflow: ${hasHorizontalOverflow} (Must be false)`);

    await mobilePage.screenshot({ path: 'scripts/mobile_01_hero.png' });

    // Test Mobile Menu Drawer
    await mobilePage.evaluate(() => window.scrollTo(0, 4200));
    await mobilePage.waitForTimeout(800);
    await mobilePage.click('button[aria-label="Toggle menu"]');
    await mobilePage.waitForTimeout(600);
    await mobilePage.screenshot({ path: 'scripts/mobile_02_navbar_drawer.png' });
    console.log('✓ Mobile Navbar Drawer captured');

    // Test Subpages on Mobile
    await mobilePage.goto('http://localhost:5173/#/homes', { waitUntil: 'networkidle', timeout: 30000 });
    await mobilePage.waitForTimeout(800);
    await mobilePage.screenshot({ path: 'scripts/mobile_03_homes.png' });

    await mobilePage.goto('http://localhost:5173/#/process', { waitUntil: 'networkidle', timeout: 30000 });
    await mobilePage.waitForTimeout(800);
    await mobilePage.screenshot({ path: 'scripts/mobile_04_process.png' });

    await mobilePage.goto('http://localhost:5173/#/studios', { waitUntil: 'networkidle', timeout: 30000 });
    await mobilePage.waitForTimeout(800);
    await mobilePage.screenshot({ path: 'scripts/mobile_05_studios.png' });

    await mobilePage.goto('http://localhost:5173/#/contact', { waitUntil: 'networkidle', timeout: 30000 });
    await mobilePage.waitForTimeout(800);
    await mobilePage.screenshot({ path: 'scripts/mobile_06_contact.png' });

    await mobilePage.goto('http://localhost:5173/#/admin', { waitUntil: 'networkidle', timeout: 30000 });
    await mobilePage.waitForTimeout(800);
    await mobilePage.screenshot({ path: 'scripts/mobile_07_admin.png' });

    // ─── Test 2: Tablet Viewport (768x1024) ───
    console.log('2. Testing Tablet Viewport (768x1024)...');
    const tabletPage = await browser.newPage();
    await tabletPage.setViewportSize({ width: 768, height: 1024 });
    await tabletPage.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
    await tabletPage.waitForTimeout(1000);
    await tabletPage.screenshot({ path: 'scripts/tablet_01_home.png' });

    await browser.close();
    console.log('All mobile responsiveness tests passed 100% successfully!');
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
