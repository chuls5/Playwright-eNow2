import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Describe the test suite for login flow
test.describe('Password Screen Verification', () => {
  // Setup test with pre-conditions
  test.beforeEach(async ({ page }) => {
    // Navigate to base URL and enter email
    await page.goto(process.env.BASE_URL);
    await page.getByRole('textbox', { name: 'Enter email' }).fill(process.env.PATIENT_USERNAME);
    await page.getByRole('button', { name: 'Next' }).click();
  });

  // Main test case for password screen elements
  test('should display and interact with password screen elements correctly', async ({ page }) => {
    // Heading verification
    await expect(page.getByRole('heading')).toContainText('Login');
    
    // Password input label verification
    await expect(page.getByText('Enter your password*')).toBeVisible();
    
    // Password input field verification
    const passwordInput = page.getByRole('textbox', { name: 'Enter your password' });
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Eye toggle button verification
    const eyeButton = page.getByRole('button', { name: 'Eye' });
    await expect(eyeButton).toBeVisible();
    await expect(eyeButton).toBeEnabled();
    
    // Forgot password link verification
    const forgotPassword = page.getByRole('link', { name: 'Forgot Password' });
    await expect(forgotPassword).toBeVisible();
    
    // Verify forgot password navigation
    await forgotPassword.click();
    await expect(page.getByRole('heading', { name: 'Forgot Password' })).toBeVisible();
    
    // Navigate back to password page
    await page.getByText('Back to password page').click();
    
    // Login button verification
    const loginButton = page.getByRole('button', { name: 'Log In' });
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();
  });

  // Optional: Additional test for eye button functionality
  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByRole('textbox', { name: 'Enter your password' });
    const eyeButton = page.getByRole('button', { name: 'Eye' });

    // Initial state verification
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Toggle password visibility
    await eyeButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Toggle back
    await eyeButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});