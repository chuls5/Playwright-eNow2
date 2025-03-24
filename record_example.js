const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://app.dev-encounterservices.com/sign-in');
  // await expect(page.getByText('EnglishLoginWelcome back!Email*Next© 2002-2025 GlobalMed®. All Rights Reserved')).toBeVisible();
  // await expect(page.locator('#root')).toMatchAriaSnapshot(`
  //   - img "English"
  //   - paragraph: English
  //   - img "ChevronDown":
  //     - img
  //   - heading "Login" [level=1]
  //   - text: Welcome back! Email*
  //   - textbox "Enter email"
  //   - button "Next"
  //   - text: /© \\d+-\\d+ GlobalMed®\\. All Rights Reserved/
  //   `);
  // await expect(page.getByRole('img', { name: 'welcome' })).toBeVisible();
  // await expect(page.getByText('EnglishLoginWelcome back!Email*Next© 2002-2025 GlobalMed®. All Rights Reserved')).toBeVisible();
  await page.getByTestId('popover-trigger').locator('div').filter({ hasText: 'English' }).click();
  await page.getByTestId('item English').click();
  // await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  // await expect(page.getByRole('heading')).toContainText('Login');
  // await expect(page.locator('#root')).toContainText('Welcome back!');
  await page.getByText('EnglishLoginWelcome back!Email*Next© 2002-2025 GlobalMed®. All Rights Reserved').click();
  // await expect(page.locator('label')).toContainText('Email*');
  // await expect(page.getByRole('button')).toContainText('Next');
  // await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
  await page.getByText('© 2002-2025 GlobalMed®. All').click();
  // await expect(page.getByText('© 2002-2025 GlobalMed®. All')).toBeVisible();
  await page.close();

  // ---------------------
  await context.close();
  await browser.close();
})();