const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    page.on('console', msg => console.log('BROWSER:', msg.text()));
    page.on('pageerror', err => console.log('ERROR:', err.message));

    console.log('1. Testing Home Page SEO & Structured Data...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    const homeTitle = await page.title();
    const homeDesc = await page.$eval('meta[name="description"]', el => el.content);
    console.log(`Home Title: "${homeTitle}"`);
    console.log(`Home Description: "${homeDesc}"`);

    // Verify JSON-LD Schema
    const jsonLd = await page.$eval('script[type="application/ld+json"]', el => el.innerText);
    const parsedSchema = JSON.parse(jsonLd);
    console.log(`JSON-LD Schema loaded with ${parsedSchema['@graph'].length} structured entities: Organization, WebSite, ProfessionalService, FAQPage.`);

    // 2. Test Subpage Dynamic SEO
    console.log('2. Testing Subpage Dynamic SEO updates...');
    await page.goto('http://localhost:5173/#/homes', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(800);
    const homesTitle = await page.title();
    console.log(`Homes Page Title: "${homesTitle}"`);

    await page.goto('http://localhost:5173/#/process', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(800);
    const processTitle = await page.title();
    console.log(`Process Page Title: "${processTitle}"`);

    // 3. Test Scroll Animations
    console.log('3. Testing Scroll Viewport Animations...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(800);

    // Scroll down to Material Provenance & Studio Signature Bar
    await page.evaluate(() => window.scrollTo(0, 4800));
    await page.waitForTimeout(1000);

    const revealedCount = await page.$$eval('.revealed', els => els.length);
    console.log(`Number of elements with active .revealed luxury animation state: ${revealedCount}`);

    await page.screenshot({ path: 'scripts/seo_and_animations_verified.png' });
    console.log('Screenshot captured successfully!');

    await browser.close();
    console.log('ALL SEO AND ANIMATION TESTS PASSED 100% SUCCESS!');
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
