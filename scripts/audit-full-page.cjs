const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    
    console.log('Navigating...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    // 1. Hero entry
    await page.screenshot({ path: 'scripts/audit_01_hero.png' });
    console.log('1/10 Hero');

    // 2. Scroll into hero mid
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/audit_02_hero_mid.png' });
    console.log('2/10 Hero mid');

    // 3. Material Provenance
    await page.evaluate(() => {
      const sections = document.querySelectorAll('section');
      if (sections[0]) sections[0].scrollIntoView({ block: 'start' });
    });
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/audit_03_material_provenance.png' });
    console.log('3/10 Material Provenance');

    // 4. Philosophy top
    await page.evaluate(() => {
      const el = document.getElementById('philosophy');
      if (el) el.scrollIntoView({ block: 'start' });
    });
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/audit_04_philosophy.png' });
    console.log('4/10 Philosophy');

    // 5. Philosophy bottom (image + cards)
    await page.evaluate(() => {
      const el = document.getElementById('philosophy');
      if (el) window.scrollTo(0, el.offsetTop + 500);
    });
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/audit_05_philosophy_cards.png' });
    console.log('5/10 Philosophy cards');

    // 6. Featured Projects
    await page.evaluate(() => {
      const el = document.getElementById('projects');
      if (el) el.scrollIntoView({ block: 'start' });
    });
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/audit_06_projects.png' });
    console.log('6/10 Projects');

    // 7. Living Spaces / Materials Matrix
    await page.evaluate(() => {
      const el = document.getElementById('projects');
      if (el) window.scrollTo(0, el.offsetTop + el.offsetHeight + 100);
    });
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/audit_07_living_spaces.png' });
    console.log('7/10 Living Spaces');

    // 8. Process
    await page.evaluate(() => {
      const el = document.getElementById('process');
      if (el) el.scrollIntoView({ block: 'start' });
    });
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/audit_08_process.png' });
    console.log('8/10 Process');

    // 9. Testimonial
    await page.evaluate(() => {
      const el = document.getElementById('process');
      if (el) window.scrollTo(0, el.offsetTop + el.offsetHeight + 100);
    });
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/audit_09_testimonial.png' });
    console.log('9/10 Testimonial');

    // 10. Contact + Footer
    await page.evaluate(() => {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ block: 'start' });
    });
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/audit_10_contact.png' });
    console.log('10/10 Contact');

    await browser.close();
    console.log('Full audit complete!');
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
