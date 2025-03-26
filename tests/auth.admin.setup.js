import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

test.describe('admin-setup', () => {
  test('authenticate patient', async ({ page }) => {
    // Navigate to the sign-in page using BASE_URL from .env
    await page.goto(process.env.BASE_URL);
    
    // Fill email and click Next in one sequence
    await page.getByRole('textbox', { name: 'Enter email' }).fill(process.env.ADMIN_USERNAME);
    await page.getByRole('button', { name: 'Next' }).click();
    
    // Fill password and click Log In in one sequence
    await page.getByRole('textbox', { name: 'Enter your password' }).fill(process.env.ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Log In' }).click();
    
    // Wait for successful login and store authentication state
    await page.waitForURL('**/users-table');
    await page.context().storageState({ path: 'playwright/.auth/admin.json' });
  });
});
