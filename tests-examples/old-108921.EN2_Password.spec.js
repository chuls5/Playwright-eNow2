import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('Verify Content on Password Screen', async ({ page }) => {
  // 1. User enters in registered email into the login screen
  await page.goto(process.env.BASE_URL);
  await page.getByRole('textbox', { name: 'Enter email' }).click();
  await page.getByRole('textbox', { name: 'Enter email' }).fill(process.env.PATIENT_USERNAME);
  
  // 2. Navigate to Password Page
  await page.getByRole('button', { name: 'Next' }).click();

  // 3. Verify the label at the top of the screen
  await expect(page.getByRole('heading')).toContainText('Login');
  
  // 4. Verify the label for the text box
  await expect(page.getByText('Enter your password*')).toBeVisible();
  
  // 5. Verify the password text entry box
  await expect(page.getByRole('textbox', { name: 'Enter your password' })).toBeVisible();

  // 6. Verify the password text entry box supports input masking by default 
  const passwordInput = page.getByRole('textbox', { name: 'Enter your password' });
  await expect(passwordInput).toHaveAttribute('type', 'password');

  // 7. Verify an "eye" icon is present to toggle the password visibility
  const eyeButton = page.getByRole('button', { name: 'Eye' });
  await expect(eyeButton).toBeVisible();
  await expect(eyeButton).toBeEnabled();
  
  // 8. Verify the "Forgot password?" link is present
  const forgotPassword = page.getByRole('link', { name: 'Forgot Password' });
  await expect(forgotPassword).toBeVisible();
  await forgotPassword.click();
  await expect(page.getByRole('heading', { name: 'Forgot Password' })).toBeVisible();
  // Navigate back to the password page
  await page.getByText('Back to password page').click();
  
  // 9. Verify the "Login" button is visible and enabled
  const loginButton = page.getByRole('button', { name: 'Log In' })
  await expect(loginButton).toBeVisible();
  await expect(loginButton).toBeEnabled();
});
