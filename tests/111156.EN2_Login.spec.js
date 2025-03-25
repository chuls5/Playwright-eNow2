import { test, expect } from '@playwright/test';

test('Verify Content on Login Page', async ({ page }) => {
  // 1. Go to login page
  await page.goto('/sign-in');

  // 2. Observe login page!
    // Left side
  await expect(page.getByText('EnglishLoginWelcome back!Email*Next© 2002-2025 GlobalMed®. All Rights Reserved')).toBeVisible();
  await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img "English"
    - paragraph: English
    - img "ChevronDown":
      - img
    - heading "Login" [level=1]
    - text: Welcome back! Email*
    - textbox "Enter email"
    - button "Next"
    - text: /© \\d+-\\d+ GlobalMed®\\. All Rights Reserved/
  `);
    // Right side
  await expect(page.getByText('EnglishLoginWelcome back!Email*Next© 2002-2025 GlobalMed®. All Rights Reserved')).toBeVisible();
  await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img "English"
    - paragraph: English
    - img "ChevronDown":
      - img
    - heading "Login" [level=1]
    - text: Welcome back! Email*
    - textbox "Enter email"
    - button "Next"
    - text: /© \\d+-\\d+ GlobalMed®\\. All Rights Reserved/
  `);
  await expect(page.getByRole('img', { name: 'welcome' })).toBeVisible();

  // 3. Verify that the following elements are displayed
    // Language dropdown
  await expect(page.getByTestId('popover-trigger').locator('div').filter({ hasText: 'English' })).toBeVisible();
    // Screen label
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  await expect(page.getByRole('heading')).toContainText('Login');
    // Welcome message
  await expect(page.locator('#root')).toContainText('Welcome back!');
    // Email field
  await expect(page.locator('label')).toContainText('Email*');
  const placeholder = page.getByRole('textbox', { name: 'Enter email' });
  await expect(placeholder).toBeVisible();
    // Next button
  const nextButton = page.getByRole('button', { name: 'Next' });
  await expect(nextButton).toBeVisible();
    // Footer text
  const footer = page.getByText('© 2002-2025 GlobalMed®. All Rights Reserved');
  await expect(footer).toBeVisible();
}
);

test('Verify "Language" Dropdown on Login Page', async ({ page }) => {
  // 1. Go to login page
  await page.goto('/sign-in');

  // 2. Verify the "Language" dropdown is visible at the top left of the page
  await expect(page.getByTestId('popover-trigger').locator('div').filter({ hasText: 'English' })).toBeVisible();
  await expect(page.getByRole('paragraph')).toContainText('English');

  // 3. Click on the Language dropdown
  await page.getByTestId('icon').click();

  // 4. Select Spanish 
  await page.getByTestId('item Spanish').click();
  await expect(page.getByTestId('popover-trigger').locator('div').filter({ hasText: 'Spanish' })).toBeVisible();

  // 5. Confirm that dropdown menu is closed
  await page.getByTestId('icon').click();
  await page.getByTestId('item English').click();
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
}
);

test('[Negative] Verify Login Behavior with Empty Email Field', async ({ page }) => {
  // 1. Go to login page
  await page.goto('/sign-in');

  // 2. Verify that email textbox is displayed with the correct placeholder
  const emailField = page.getByRole('textbox', { name: 'Enter email' });
  await expect(emailField).toBeVisible();

  // 3. Click on Next button without entering an email
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByTestId('input').getByRole('paragraph')).toContainText('Enter an email');
  
  // 4. Observe the "Next" button 
  await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled();
}
);

test('[Negative] Verify Email Text Box Validation on Login Page', async ({ page }) => {
  // 1. Go to login page
  await page.goto('/sign-in');

  // 2. Enter an invalid email address
  const emailField = page.getByRole('textbox', { name: 'Enter email' });
  await expect(emailField).toBeVisible();

  // 3. Leave the invalid email in the textbox and attempt to click next 
  await emailField.fill('invalid-email');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByTestId('input').getByRole('paragraph')).toContainText('Please enter a valid email address');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText('Please enter a valid email')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByText('Please enter a valid email').click();
  await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled();
}
);

test('Verify Email Text Box Validation on Login Page', async ({ page }) => {
  // 1. Go to login page
  await page.goto('/sign-in');

  // 2. Enter a valid email address
  const emailField = page.getByRole('textbox', { name: 'Enter email' });
  await expect(emailField).toBeVisible();

  // 3. Enter a valid email address and click Next
  await emailField.fill(process.env.PATIENT_USERNAME);
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('textbox', { name: 'Enter your password' })).toBeVisible();
}
);

test('Verify Next Button - Valid Email Entered in Text Box', async ({ page }) => {
  // 1. Go to login page
  await page.goto('/sign-in');

  // 2. Enter a valid email address
  const emailField = page.getByRole('textbox', { name: 'Enter email' });
  await expect(emailField).toBeVisible();

  // 3. Enter a valid email address and click Next
  await emailField.fill('invalid-email');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByTestId('input').getByRole('paragraph')).toContainText('Please enter a valid email address');
  await emailField.fill(process.env.PATIENT_USERNAME);
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('textbox', { name: 'Enter your password' })).toBeVisible();
}
);