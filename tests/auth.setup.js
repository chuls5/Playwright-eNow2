import { test as setup, expect } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

setup('authenticate patient', async ({ page }) => {
  // Navigate to the sign-in page using BASE_URL from .env
  await page
    .goto(process.env.BASE_URL);
  
  // Fill email and click Next in one sequence
  await page
    .getByRole('textbox', { name: 'Enter email' })
    .fill(process.env.PATIENT_USERNAME);
  
  await page
    .getByRole('button', { name: 'Next' }).click();
  
  // Fill password and click Log In in one sequence
  await page
    .getByRole('textbox', { name: 'Enter your password' })
    .fill(process.env.PATIENT_PASSWORD);
  
  await page
    .getByRole('button', { name: 'Log In' }).click();
  
  // Wait for successful login and store authentication state
  await page.waitForURL('**/dashboard');
  await page.context().storageState({ path: 'playwright/.auth/patient.json' });
});

setup('authenticate provider', async ({ page }) => {
  // Navigate to the sign-in page using BASE_URL from .env
  await page
    .goto(process.env.BASE_URL);
  
  // Fill email and click Next in one sequence
  await page
    .getByRole('textbox', { name: 'Enter email' })
    .fill(process.env.PROVIDER_USERNAME);
  
  await page
    .getByRole('button', { name: 'Next' }).click();
  
  // Fill password and click Log In in one sequence
  await page
    .getByRole('textbox', { name: 'Enter your password' })
    .fill(process.env.PROVIDER_PASSWORD);
  
  await page
    .getByRole('button', { name: 'Log In' }).click();
  
  // Wait for successful login and store authentication state
  await page.waitForURL('**/dashboard');
  await page.context().storageState({ path: 'playwright/.auth/provider.json' });
});
