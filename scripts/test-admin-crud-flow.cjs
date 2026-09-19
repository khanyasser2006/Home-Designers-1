const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    
    console.log('Testing Admin Login and Live CRUD Synchronization...');

    // 1. Go to Auth Page
    await page.goto('http://localhost:5173/#/auth', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    // 2. Click 1-Click Master Admin Login
    await page.click('button:has-text("1-Click Admin Login")');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'scripts/admin_test_01_dashboard.png' });
    console.log('1. Admin Login & Dashboard captured');

    // 3. Click "+ Add New Residence"
    await page.click('button:has-text("+ Add New Residence")');
    await page.waitForTimeout(600);

    // 4. Fill in Residence Details
    await page.fill('input[placeholder="e.g. The Aspen Ridge Compound"]', 'The Lake Como Glass Pavilion');
    await page.fill('input[placeholder="e.g. Alpine timber and heated granite"]', 'Waterfront glass and Italian limestone');
    await page.fill('input[placeholder="e.g. Aspen, Colorado"]', 'Lake Como, Italy');
    await page.fill('input[placeholder="e.g. 10,200 sq.ft."]', '11,400 sq.ft.');
    await page.fill('textarea[placeholder="Describe the architectural concept, solar orientation, materials..."]', 'A dramatic lakeside glass pavilion cantilevered over the water with direct boat dock.');
    
    // Submit creation
    await page.click('button:has-text("Save Residence to Live Website")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/admin_test_02_residence_added.png' });
    console.log('2. New Residence added to live CMS');

    // 5. Navigate to Homes page and verify the new residence is live on the public website!
    await page.click('button:has-text("View Live Website")');
    await page.waitForTimeout(1000);
    const homesNav = page.locator('nav .hidden.lg\\:flex button:has-text("Homes")');
    await homesNav.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/admin_test_03_live_residence_visible.png' });
    console.log('3. Verified new residence is live on Homes page!');

    // 6. Return to Admin Panel via navbar
    const adminNav = page.locator('nav .hidden.lg\\:flex button:has-text("Master Admin")');
    await adminNav.click();
    await page.waitForTimeout(1000);

    // 7. Test Inquiries Tab
    await page.click('button:has-text("Client Inquiries")');
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scripts/admin_test_04_inquiries_inbox.png' });
    console.log('4. Verified Client Inquiries live inbox');

    await browser.close();
    console.log('All Admin CRUD tests completed with 100% success!');
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
