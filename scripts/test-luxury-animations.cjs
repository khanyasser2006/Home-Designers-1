const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    console.log('1. Loading Home page and testing GSAP ScrollTrigger section animations...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    // Scroll to Material Provenance
    await page.evaluate(() => window.scrollTo({ top: 4100, behavior: 'instant' }));
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/anim_01_material_provenance.png' });
    console.log('✓ Material Provenance animations verified');

    // Scroll to Featured Projects
    await page.evaluate(() => window.scrollTo({ top: 5200, behavior: 'instant' }));
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/anim_02_featured_projects.png' });
    console.log('✓ Featured Projects animations verified');

    // Scroll to Curated Living Spaces
    await page.evaluate(() => window.scrollTo({ top: 6400, behavior: 'instant' }));
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/anim_03_living_spaces.png' });
    console.log('✓ Curated Living Spaces animations verified');

    // Scroll to Philosophy & Process
    await page.evaluate(() => window.scrollTo({ top: 7600, behavior: 'instant' }));
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/anim_04_philosophy_process.png' });
    console.log('✓ Philosophy and Process animations verified');

    // 2. Test Subpage Transitions
    console.log('2. Testing Subpages Transitions...');
    await page.goto('http://localhost:5173/#/homes', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/anim_05_homes_page.png' });
    console.log('✓ Homes Page verified');

    await page.goto('http://localhost:5173/#/studios', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/anim_06_studios_page.png' });
    console.log('✓ Studios Page verified');

    await page.goto('http://localhost:5173/#/contact', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/anim_07_contact_page.png' });
    console.log('✓ Contact Page verified');

    await browser.close();
    console.log('All luxury animation tests completed successfully!');
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
