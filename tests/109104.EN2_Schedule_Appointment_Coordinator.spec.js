import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

test.use({ storageState: 'playwright/.auth/coordinator.json' });

test.describe('Schedule Appointment Coordinator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await expect(async () => {
      await page.waitForSelector('[data-testid="navigation"]', { timeout: 500 });
      await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
    }).toPass();
    // 3. Click on the schedule session button
    await expect(page.getByRole('button', { name: 'CalendarPlus Schedule session' })).toBeVisible();
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();
  });

  test('Verify Schedule Session Screen Content on Clicking "Schedule Session" Button', async ({ page }) => {
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
    // Wait for the date picker to be visible
    await page.waitForSelector('div[class*="react-datepicker"]');

    // Find the element with today's date and click on it
    const todaySelector = 'div[class*="react-datepicker__day"][class*="react-datepicker__day--today"]';
    await page.waitForSelector(todaySelector);
    await page.click(todaySelector);

    // Verify that the selected date is highlighted (has aria-selected="true")
    const selectedDateElement = await page.locator(
        'div[class*="react-datepicker__day"][aria-selected="true"]'
    );

    // Verify the selected date element exists
    await expect(selectedDateElement).toBeVisible();

    // Verify that time-slots are displayed
    await expect(async () => {
      await page.waitForSelector('div[class*="_listTimes_el1gj_20"]', { timeout: 500 });
      await expect(page.locator('div[class*="_listTimes_el1gj_20"]').first()).toBeVisible();
    }).toPass();
  });

  test('Verify Time Slot Selection on Schedule Session Page', async ({ page }) => {
    // Wait for the date picker to be visible
    await page.waitForSelector('div[class*="react-datepicker"]');

    // Find the element with today's date and click on it
    const todaySelector = 'div[class*="react-datepicker__day"][class*="react-datepicker__day--today"]';
    await page.waitForSelector(todaySelector);
    await page.click(todaySelector);

    // Verify that the selected date is highlighted (has aria-selected="true")
    const selectedDateElement = await page.locator(
        'div[class*="react-datepicker__day"][aria-selected="true"]'
    );

    // Verify the selected date element exists
    await expect(selectedDateElement).toBeVisible();

    // Wait for time slots to be displayed and select the first available one
    await expect(async () => {
      await page.waitForSelector('div[class*="_listTimes_el1gj_20"]', { timeout: 500 });
      const timeSlots = page.locator('div[class*="_container_5we3n_1"]');
      const count = await timeSlots.count();
      for (let i = 0; i < count; i++) {
        const timeSlot = timeSlots.nth(i);
        if (await timeSlot.isEnabled() && await timeSlot.isVisible() && !(await timeSlot.getAttribute('class')).includes('disabled')) {
          await timeSlot.click({ force: true });
          break;
        }
      }
      }).toPass();

      // Verify that the selected time slot is highlighted 
      const selectedTimeSlotElement = await page.locator('div[class="_container_5we3n_1 _active_5we3n_24"]');
      await expect(selectedTimeSlotElement).toBeVisible();
  });

  test('Verify File Selection Using "Select File" Link on Schedule Session Page', async ({ page }) => {
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
    await page.getByRole('img', { name: 'XClose' }).getByTestId('icon').click();
    await expect(previewImage).not.toBeVisible();
  });

  test('Verify Session Cancellation Using "Cancel" Button on Schedule Session Page', async ({ page }) => {
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
    // 4. Click on the "Schedule visit" button
    await expect(page.getByRole('button', { name: 'Schedule visit' })).toBeVisible();
    await page.getByRole('button', { name: 'Schedule visit' }).click();

    // Verify error messages
    await expect(page.getByText('Patient is required')).toBeVisible();
    await expect(page.getByText('Time slot is not selected')).toBeVisible();
  });

  test('Verify "Schedule Session" Button Success with All Mandatory Inputs on Schedule Session Page', async ({ page }) => {
    // Select todays date using the calendar tool
    await page.click('div[class*="react-datepicker__day"][class*="react-datepicker__day--today"]');

    // Select Provider
    await page.getByRole('link', { name: 'Change provider' }).click();

    await page.getByRole('textbox', { name: 'Search by name' }).fill('ashley');
    await page.locator('div').filter({ hasText: /^Ashley FloresproviderDentist$/ }).first().click();
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Select Patient
    await page.getByRole('link', { name: 'Change patient' }).click();
    await page.getByRole('textbox', { name: 'Search by name' }).fill('hat');
    await page.locator('div').filter({ hasText: /^Hatsune Mikupatient05\/30\/2000 \(24y\), female$/ }).nth(1).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // Wait for time slots to be displayed and select the first available one
    await expect(async () => {
      await page.waitForSelector('div[class*="_listTimes_el1gj_20"]', { timeout: 500 });
      const timeSlots = page.locator('div[class*="_container_5we3n_1"]');
      const count = await timeSlots.count();
      for (let i = 0; i < count; i++) {
        const timeSlot = timeSlots.nth(i);
        if (await timeSlot.isEnabled() && await timeSlot.isVisible() && !(await timeSlot.getAttribute('class')).includes('disabled')) {
          await timeSlot.click({ force: true });
          break;
        }
      }
    }).toPass();

    // Click on the "Schedule visit" button
    await expect(page.getByRole('button', { name: 'Schedule visit' })).toBeVisible();
    await page.getByRole('button', { name: 'Schedule visit' }).click();

    // Wait for the toast notification to appear
    await expect(async () => {
      await page.waitForSelector('[data-testid="toast"]', { timeout: 5000 });
      await expect(page.getByTestId('toast')).toBeVisible();
    }).toPass();
  });
});