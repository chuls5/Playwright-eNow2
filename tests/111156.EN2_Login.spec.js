import { test, expect } from '@playwright/test';

// Setup a test suite with beforeEach to reduce repetition
test.describe('Login Page Tests', () => {
  // Reusable setup to navigate to sign-in page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in');
  });

  // Content Verification Test
  test('Verify Login Page Content', async ({ page }) => {
    // Language Dropdown
    const languageDropdown = page.getByTestId('popover-trigger').locator('div').filter({ hasText: 'English' }).first();
    await expect(languageDropdown).toBeVisible();

    // Screen Elements
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.locator('#root')).toContainText('Welcome back!');

    // Email Field
    const emailField = page.getByRole('textbox', { name: 'Enter email' });
    await expect(emailField).toBeVisible();
    await expect(page.locator('label')).toContainText('Email*');

    // Next Button
    const nextButton = page.getByRole('button', { name: 'Next' });
    await expect(nextButton).toBeVisible();

    // Footer
    const footer = page.getByText('© 2002-2025 GlobalMed®. All Rights Reserved');
    await expect(footer).toBeVisible();
  });

  // Language Dropdown Test
  test('Verify Language Dropdown Functionality', async ({ page }) => {
    const languageDropdown = page.getByTestId('popover-trigger').first();
    const languageIcon = page.getByTestId('icon');

    // Initial English state
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

  // Negative Email Validation Tests
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

  // Login Flow Tests
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

    // Verify dashboard
    await expect(page.getByText('Dashboard')).toBeVisible();
  });
});