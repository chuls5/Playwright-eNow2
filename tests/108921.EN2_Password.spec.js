import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Password Screen Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL);
    await page.getByRole('textbox', { name: 'Enter email' }).fill(process.env.PATIENT_USERNAME);
    await page.getByRole('button', { name: 'Next' }).click();
  });

  test('should display and interact with password screen elements correctly', async ({ page }) => {
    await expect(page.getByRole('heading')).toContainText('Login');
    await expect(page.getByText('Enter your password*')).toBeVisible();
    const passwordInput = page.getByRole('textbox', { name: 'Enter your password' });
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');
    const eyeButton = page.getByRole('button', { name: 'Eye' });
    await expect(eyeButton).toBeVisible();
    await expect(eyeButton).toBeEnabled();
    const forgotPassword = page.getByRole('link', { name: 'Forgot Password' });
    await expect(forgotPassword).toBeVisible();
    await forgotPassword.click();
    await expect(page.getByRole('heading', { name: 'Forgot Password' })).toBeVisible();
    await page.getByText('Back to password page').click();
    const loginButton = page.getByRole('button', { name: 'Log In' });
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();
  });

  test('Verify Password masking and visibility toggle on Password Page', async ({ page }) => {
    const passwordInput = page.getByRole('textbox', { name: 'Enter your password' });
    const eyeButton = page.getByRole('button', { name: 'Eye' });
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await eyeButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await eyeButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('Verify Log In click with no password on Password Page', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: 'Log In' });
    await loginButton.click();
    await expect(page.getByText('Enter a password')).toBeVisible();
    await expect(page.getByTestId('input')).toContainText('Enter your password*Enter a password');
    await expect(loginButton).toBeEnabled();
  });

  test('Validate Password complexity on password page', async ({ page }) => {
    const passwordInput = page.getByRole('textbox', { name: 'Enter your password' });
    const loginButton = page.getByRole('button', { name: 'Log In' });

    // Verify password complexity validation with correct/VALID password
    await passwordInput.fill(process.env.PATIENT_PASSWORD); 
    await loginButton.click();

    // Verify that you've logged in
    await expect(async () => {
      await page.waitForSelector('[data-testid="navigation"]', { timeout: 500 });
      await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
    }).toPass();
  });

  test('[Negative] Validate Password Complexity on Password Page', async ({ page }) => {
    const passwordInput = page.getByRole('textbox', { name: 'Enter your password' });
    const loginButton = page.getByRole('button', { name: 'Log In' });

    // Verify password complexity validation with incorrect/INVALID password 
    await passwordInput.fill('password');
    await loginButton.click();

    // Verify error message
    await expect(page.getByText('Wrong password. Try again or')).toBeVisible();
    await expect(page.getByTestId('input').getByRole('paragraph')).toContainText('Wrong password. Try again or click ‘Forgot password’ to reset it.');
  });

  test('Process Log In with Valid Password on Password Page', async ({ page }) => {
    const passwordInput = page.getByRole('textbox', { name: 'Enter your password' });
    const loginButton = page.getByRole('button', { name: 'Log In' });

    // Verify password complexity validation
    await passwordInput.fill(process.env.PATIENT_PASSWORD);
    await loginButton.click();

    // Verify that you've logged in
    await expect(async () => {
      await page.waitForSelector('[data-testid="navigation"]', { timeout: 500 });
      await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
    }).toPass();
  });

  test('[Negative] Verify Password Mismatch on Password Page', async ({ page }) => {
    const passwordInput = page.getByRole('textbox', { name: 'Enter your password' });
    const loginButton = page.getByRole('button', { name: 'Log In' });

    // Verify password complexity validation
    await passwordInput.fill('password');
    await loginButton.click();

    // Verify error message
    await expect(page.getByText('Wrong password. Try again or')).toBeVisible();
    await expect(page.getByTestId('input').getByRole('paragraph')).toContainText('Wrong password. Try again or click ‘Forgot password’ to reset it.');
  });

  test('Verify Functionality on Create New Password Page', async ({ page }) => {
      // Placeholder for future implementation
      test.skip(true, 'Verify Functionality on Create New Password Page requires additional setup');
  });

  test('Verify Time Pass Functionality on Password Changed Page', async ({ page }) => {
      // Placeholder for future implementation
      test.skip(true, 'Verify Time Pass Functionality requires additional setup');
  });

  test('[Negative] Verify Functionality on Create a New Password Page', async ({ page }) => {
      // Placeholder for future implementation
      test.skip(true, '[Negative] Verify Functionality on Create a New Password Page requires additional setup');
  });

  test('Verify redirect on "Not you?" link click', async ({ page }) => {
      // Click on the "Not you?" link
      test.skip(true, '[Negative] Verify Functionality on Create a New Password Page requires additional setup');
  });

  test('[Negative] Verify Case Sensitivity in Passwords on Password Page', async ({ page }) => {
      // Navigate to Password Page
      test.skip(true, '[Negative] Verify Functionality on Create a New Password Page requires additional setup');
  });
  

});