import { test, expect } from '@playwright/test';

test.describe('Login Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in');
  });

  test('Verify Login Page Content', async ({ page }) => {
    const languageDropdown = page.getByTestId('popover-trigger').locator('div').filter({ hasText: 'English' }).first();
    await expect(languageDropdown).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.locator('#root')).toContainText('Welcome back!');
    const emailField = page.getByRole('textbox', { name: 'Enter email' });
    await expect(emailField).toBeVisible();
    await expect(page.locator('label')).toContainText('Email*');
    const nextButton = page.getByRole('button', { name: 'Next' });
    await expect(nextButton).toBeVisible();
    const footer = page.getByText('© 2002-2025 GlobalMed®. All Rights Reserved');
    await expect(footer).toBeVisible();
  });

  test('Verify Language Dropdown Functionality', async ({ page }) => {
    const languageDropdown = page.getByTestId('popover-trigger').first();
    const languageIcon = page.getByTestId('icon');
    await expect(languageDropdown.locator('div').filter({ hasText: 'English' }).first()).toBeVisible();

    // Change to Spanish
    await languageIcon.click();
    await page.getByTestId('item Spanish').click();
    await expect(languageDropdown.locator('div').filter({ hasText: 'Spanish' }).first()).toBeVisible();

    // Change back to English
    await languageIcon.click();
    await page.getByTestId('item English').click();
    await expect(languageDropdown.locator('div').filter({ hasText: 'English' }).first()).toBeVisible();
  });

  test('Validate Empty Email Field', async ({ page }) => {
    const nextButton = page.getByRole('button', { name: 'Next' });
    
    // Click Next without entering email
    await nextButton.click();
    await expect(page.getByTestId('input').getByRole('paragraph'))
      .toContainText('Enter an email');
    
    // Button should remain enabled
    await expect(nextButton).toBeEnabled();
  });

  test('Validate Invalid Email Format', async ({ page }) => {
    const emailField = page.getByRole('textbox', { name: 'Enter email' });
    const nextButton = page.getByRole('button', { name: 'Next' });

    // Enter invalid email
    await emailField.fill('invalid-email');
    await nextButton.click();

    // Validate error messages
    await expect(page.getByTestId('input').getByRole('paragraph'))
      .toContainText('Please enter a valid email address');
  });

  test('Login with Registered Email', async ({ page }) => {
    const emailField = page.getByRole('textbox', { name: 'Enter email' });
    const nextButton = page.getByRole('button', { name: 'Next' });

    // Enter registered email
    await emailField.fill(process.env.PATIENT_USERNAME);
    await nextButton.click();

    // Verify password screen
    await expect(page.getByText('Enter your password')).toBeVisible();
  });

  test('Login Attempt with Unregistered Email', async ({ page }) => {
    const emailField = page.getByRole('textbox', { name: 'Enter email' });
    const nextButton = page.getByRole('button', { name: 'Next' });

    // Enter unregistered email
    await emailField.fill('valid-email991@gmail.com');
    await nextButton.click();

    // Verify error message
    await expect(page.getByText('Couldn\'t find an account for')).toBeVisible();
  });

  test('Successful Login', async ({ page }) => {
    // Email step
    const emailField = page.getByRole('textbox', { name: 'Enter email' });
    await emailField.fill(process.env.PATIENT_USERNAME);
    await page.getByRole('button', { name: 'Next' }).click();

    // Password step
    const passwordField = page.getByRole('textbox', { name: 'Enter your password' });
    await passwordField.fill(process.env.PATIENT_PASSWORD);
    await page.getByRole('button', { name: 'Log In' }).click();

    // Verify Dashboard Navigation
    await expect(async () => {
      await page.waitForSelector('[data-testid="navigation"]', { timeout: 500 });
      await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
    }).toPass();
  });
});