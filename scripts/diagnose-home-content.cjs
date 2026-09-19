const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    const sections = await page.evaluate(() => {
      const allSections = Array.from(document.querySelectorAll('section, main > *'));
      return allSections.map((s, i) => {
        const rect = s.getBoundingClientRect();
        const style = window.getComputedStyle(s);
        return {
          index: i,
          tagName: s.tagName,
          id: s.id,
          className: s.className,
          top: rect.top,
          height: rect.height,
          opacity: style.opacity,
          display: style.display,
          visibility: style.visibility,
          innerTextPreview: s.innerText.slice(0, 100).replace(/\n/g, ' '),
        };
      });
    });

    console.log('Sections initially found on Home Page:', JSON.stringify(sections, null, 2));

    // Scroll down 4500px (past hero)
    await page.evaluate(() => window.scrollTo(0, 4500));
    await page.waitForTimeout(1000);

    const scrolledSections = await page.evaluate(() => {
      const allSections = Array.from(document.querySelectorAll('section, main > *'));
      return allSections.map((s, i) => {
        const rect = s.getBoundingClientRect();
        const style = window.getComputedStyle(s);
        return {
          index: i,
          tagName: s.tagName,
          id: s.id,
          top: rect.top,
          height: rect.height,
          opacity: style.opacity,
          innerTextPreview: s.innerText.slice(0, 80).replace(/\n/g, ' '),
        };
      });
    });

    console.log('Sections at scrollY=4500:', JSON.stringify(scrolledSections, null, 2));

    await page.screenshot({ path: 'scripts/diag_home_4500.png' });

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/diag_home_bottom.png' });

    await browser.close();
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
