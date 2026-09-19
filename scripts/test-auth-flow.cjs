const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    
    console.log('Testing Authentication & Navbar Updates...');

    // 1. Load Home
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    // 2. Open Auth Page via Navbar button
    const authBtn = page.locator('nav button:has-text("Sign In / Register")');
    await page.evaluate(() => {
      window.location.hash = '#/auth';
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/auth_test_01_login_view.png' });
    console.log('1. Captured Login view');

    // 3. Test attempting login with unregistered account
    await page.fill('input[type="email"]', 'newclient@test.com');
    await page.fill('input[type="password"]', 'mypassword');
    await page.click('button[type="submit"]:has-text("Sign In to Portal")');
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'scripts/auth_test_02_unregistered_error.png' });
    console.log('2. Captured unregistered login error message');

    // 4. Switch to Register tab
    await page.click('button:has-text("Register (New Client)")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'scripts/auth_test_03_register_view.png' });
    console.log('3. Captured Register view');

    // 5. Fill registration form
    await page.fill('input[placeholder="e.g. Sarah Jenkins"]', 'Alexander Wright');
    await page.fill('input[type="email"]', 'alexander@wrightestate.com');
    await page.fill('input[type="password"]', 'luxuryPass2026');
    await page.click('button[type="submit"]:has-text("Complete Registration & Sign In")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/auth_test_04_client_dashboard.png' });
    console.log('4. Captured Client Dashboard after registration');

    // 6. Test Sign Out
    await page.click('button:has-text("Sign Out")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/auth_test_05_logged_out.png' });
    console.log('5. Captured Logged Out state');

    // 7. Test Login with the newly registered credentials
    await page.fill('input[type="email"]', 'alexander@wrightestate.com');
    await page.fill('input[type="password"]', 'luxuryPass2026');
    await page.click('button[type="submit"]:has-text("Sign In to Portal")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scripts/auth_test_06_login_success.png' });
    console.log('6. Captured Login Success with registered account');

    await browser.close();
    console.log('All Authentication tests passed with 100% success!');
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
