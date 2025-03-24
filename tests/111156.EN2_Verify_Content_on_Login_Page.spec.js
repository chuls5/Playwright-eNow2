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