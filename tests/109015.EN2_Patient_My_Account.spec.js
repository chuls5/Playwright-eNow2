import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path'; // Add this line

// Load environment variables from .env file
dotenv.config();

// Use the Patients stored authentication state
test.use({ storageState: 'playwright/.auth/patient.json' });

test('Verify Patient View and Content Display on Account Settings Page', async ({ page }) => {
  await page.goto('/account-settings/my-account');
  await expect(page).toHaveURL(/.*\/account-settings\/my-account/);
  await expect(page.getByRole('heading', { name: 'Account settings' })).toBeVisible();
  await expect(page.locator('div').filter({ hasText: 'My accountUpdate and manage your accountHMHatsune Mikuchuls+pat1@globalmed.' }).nth(3)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Download Upload photo' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Trash Delete photo' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Edit Edit' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'My account' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Notifications' })).toBeVisible();
  await page.getByRole('button', { name: 'Edit Edit' }).click();
  await page.getByRole('textbox', { name: 'First name' }).click();
  await page.getByRole('textbox', { name: 'First name' }).fill('Hatsune');
  await page.getByRole('textbox', { name: 'Last name' }).click();
  await page.getByRole('textbox', { name: 'Last name' }).fill('Miku');
  await page.getByRole('textbox', { name: 'MM/DD/YYYY' }).click();
  await page.getByRole('option', { name: 'Choose Monday, May 29th,' }).click();
  await page.locator('div').filter({ hasText: /^Female$/ }).nth(2).click();
  await page.getByTestId('custom-dropdown-item-Female').click();
  await page.getByRole('textbox', { name: '(555) 000-' }).click();
  await page.getByRole('textbox', { name: '(555) 000-' }).fill('(602) 911 - 9111_');
  await page.locator('div').filter({ hasText: /^United States of America$/ }).nth(2).click();
  await page.getByTestId('custom-dropdown-item-United States of America').getByText('United States of America').click();
  await page.locator('div').filter({ hasText: /^Arizona$/ }).nth(2).click();
  await page.getByTestId('custom-dropdown-item-Arizona').click();
  await page.getByRole('textbox', { name: 'City' }).click();
  await page.getByRole('textbox', { name: 'City' }).fill('Scottsdale');
  await page.getByRole('textbox', { name: 'Zip code' }).click();
  const randomZipCode = Math.floor(10000 + Math.random() * 90000).toString(); // Generate 5 random numbers
  await page.getByRole('textbox', { name: 'Zip code' }).fill(randomZipCode);
  await page.getByRole('textbox', { name: 'Address line 1' }).click();
  await page.getByRole('textbox', { name: 'Address line 1' }).fill('5416 E. Emile Zola');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByTestId('toast')).toBeVisible();
  await page.getByRole('link', { name: 'Change language' }).click();
  await page.getByTestId('custom-select-item-wrapper').locator('div').filter({ hasText: 'English' }).click();
  await page.getByTestId('custom-dropdown-item-Spanish').click();
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByText('Éxito', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Cambiar idioma' }).click();
  await page.getByTestId('custom-select-item-wrapper').locator('div').filter({ hasText: 'Spanish' }).click();
  await page.getByTestId('custom-dropdown-item-English').click();
  await page.getByRole('button', { name: 'Guardar cambios' }).click();
  await expect(page.getByText('Success', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Change time zone' }).click();
  await page.getByTestId('switch-div').click();
  await page.getByRole('button', { name: 'Save changes' }).click();
  await page.getByRole('link', { name: 'Change time zone' }).click();
  await page.getByTestId('switch-div').locator('div').first().click();
  await page.getByRole('button', { name: 'Save changes' }).click();
  await page.getByRole('link', { name: 'Change time zone' }).click();
  await page.getByTestId('custom-select-item-wrapper').click();
  await page.getByText('(GMT-11:00) Niue Time - Niue').click();
  await page.getByRole('button', { name: 'Save changes' }).click();
  await page.getByRole('link', { name: 'Change time zone' }).click();
  await page.getByTestId('switch-div').click();
  await page.getByRole('button', { name: 'Save changes' }).click();
  await page.getByRole('link', { name: 'Change time zone' }).click();
  await page.getByTestId('switch-div').locator('div').first().click();
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByText('Delete account')).toBeVisible();
});

test('Verify Upload Photo Functionality', async ({ page }) => {
  await page.goto('/account-settings/my-account');
  await expect(page).toHaveURL(/.*\/account-settings\/my-account/);
  await expect(page.getByRole('heading', { name: 'Account settings' })).toBeVisible();

  // Click the button to delete the existing photo
  await page.getByRole('button', { name: 'Trash Delete photo' }).click();
  await expect(page.getByTestId('toast')).toBeVisible();

  // Click the button to upload a new photo
  await page.getByRole('button', { name: 'Download Upload photo' }).click();

  // Upload a photo
  // const filePath = path.join(__dirname, 'patient-image.jpg'); // Adjust the path to your image file
  // await page.setInputFiles('input[type="file"]', filePath);
});