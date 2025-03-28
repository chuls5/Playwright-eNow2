import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Use the Patients stored authentication state
test.use({ storageState: 'playwright/.auth/coordinator.json' });

test.describe('Schedule Appointment Coordinator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await expect(async () => {
      await page.waitForSelector('[data-testid="navigation"]', { timeout: 500 });
      await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
    }).toPass();
  });

  test('Verify Schedule Session Screen Content on Clicking "Schedule Session" Button', async ({ page }) => {
    // 3. Click on the schedule session button
    await expect(page.getByRole('button', { name: 'CalendarPlus Schedule session' })).toBeVisible();
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();

    // Verify Your Appointment Section
    const appointmentHeading = page.getByRole('heading', { name: 'Your appointment' });
    await expect(appointmentHeading).toBeVisible();

    // Verify other elements in the "Your Appointment" section
    await expect(page.locator('div').filter({ hasText: /^Service$/ })).toBeVisible();
    await expect(page.getByText('General Practice')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Change service' })).toBeVisible();
    await expect(page.getByText('Appointment type')).toBeVisible();
    await expect(page.getByText('Video')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Change type' })).toBeVisible();
    await expect(page.getByText('Duration', { exact: true })).toBeVisible();
    await expect(page.getByText('minutes')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Change duration' })).toBeVisible();
    await expect(page.getByText('Provider', { exact: true })).toBeVisible();
    await expect(page.getByText('Any available')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Change provider' })).toBeVisible();
    await expect(page.getByText('Patient', { exact: true })).toBeVisible();
    await expect(page.getByText('-')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Change patient' })).toBeVisible();

    // Select Date and Time Section
    await expect(page.getByRole('heading', { name: 'Select date & time' })).toBeVisible();
    await expect(page.locator('form')).toContainText('Please choose a preferred time slot for your selected day.');
    await expect(page.locator('form div').filter({ hasText: 'Select date & timePlease' }).nth(1)).toBeVisible();

    // Attachments section
    await expect(page.locator('form div').filter({ hasText: 'AttachmentsUpload any' }).nth(1)).toBeVisible();
    await expect(page.locator('form')).toContainText('Upload any relevant documentation that could assist the provider.');

    // Buttons
    await expect(page.getByRole('link', { name: 'Choose files' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Schedule visit' })).toBeVisible();
  });

  test('Verify Date Selection Using Calendar Tool on Schedule Session Page', async ({ page }) => {
    // Placeholder for future implementation
    test.skip(true, 'Verify Date Selection Using Calendar Tool requires additional setup');
  });

  test('Verify Time Slot Selection on Schedule Session Page', async ({ page }) => {
    // 3. Click on the schedule session button
    await expect(page.getByRole('button', { name: 'CalendarPlus Schedule session' })).toBeVisible();
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();
    // 4. Click on a specifc date on calendar tool (see above)
    // Placeholder for future implementation
    test.skip(true, 'Verify Time Slot Selection on Schedule Session Page requires additional setup');
  });

  test('Verify File Selection Using "Select File" Link on Schedule Session Page', async ({ page }) => {
    // 3. Click on the schedule session button
    await expect(page.getByRole('button', { name: 'CalendarPlus Schedule session' })).toBeVisible();
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();

    // 4. Click on "Choose files" link
    await expect(page.getByRole('link', { name: 'Choose files' })).toBeVisible();
    await page.getByRole('link', { name: 'Choose files' }).click();

    // Use path.resolve to get the absolute path to the test image
    const filePath = path.resolve(__dirname, 'miku-image.jpg');

    // Use Playwright's setInputFiles method for more reliable file upload
    const fileChooser = page.locator('input[type="file"]');
    await fileChooser.setInputFiles(filePath);

    // Wait for file preview to appear
    const previewImage = page.getByRole('img', { name: 'document preview' });
    await expect(previewImage).toBeVisible({ timeout: 5000 });

    // Verify you can remove the file
    await expect(page.getByRole('img', { name: 'XClose' }).getByTestId('icon')).toBeVisible();

    // Verify you can download the file
    const [download] = await Promise.all([
      page.waitForEvent('download'), // Wait for the download event
      previewImage.click(),          // Perform the click
    ]);

    // Remove the file
    await page.locator('[data-testid="close-icon"]').click();
    await expect(page.locator('[data-testid="close-icon"]')).not.toBeVisible();
  });

  test('Verify Session Cancellation Using "Cancel" Button on Schedule Session Page', async ({ page }) => {
    // 3. Click on the schedule session button
    await expect(page.getByRole('button', { name: 'CalendarPlus Schedule session' })).toBeVisible();
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();

    // 4. Click on the "Cancel" button
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
      // Verify you are redirected back to the dashboard
    await expect(async () => {
      await page.waitForSelector('[data-testid="navigation"]', { timeout: 500 });
      await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
    }).toPass();
  });

  test('[Negative] Verify "Schedule Session" Button Requires Mandatory Inputs on Schedule Session Page', async ({ page }) => {
    // 3. Click on the schedule session button
    await expect(page.getByRole('button', { name: 'CalendarPlus Schedule session' })).toBeVisible();
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();

    // 4. Click on the "Schedule visit" button
    await expect(page.getByRole('button', { name: 'Schedule visit' })).toBeVisible();
    await page.getByRole('button', { name: 'Schedule visit' }).click();

    // Verify error messages
    await expect(page.getByText('Patient is required')).toBeVisible();
    await expect(page.getByText('Time slot is not selected')).toBeVisible();
  });

});