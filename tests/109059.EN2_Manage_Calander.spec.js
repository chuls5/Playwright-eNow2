import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Manage Calander Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    // Verify Dashboard Navigation
    await expect(async () => {
        await page.waitForSelector('[data-testid="navigation"]', { timeout: 500 });
        await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
    }).toPass();
    // Navigate to Account Settings Page
    await page.locator('div:nth-child(2) > .sc-fwzISk').click();
    await page.getByRole('button', { name: 'SettingsGear Account settings' }).click();
    // Click on Calendar
    await page.getByRole('button', { name: 'Calendar' }).click();
    // Verify 'Calendar' tab
    await expect(page.getByRole('paragraph').filter({ hasText: 'Calendar' })).toBeVisible();
    await expect(page.locator('#root')).toContainText('(GMT-07:00) Mountain Standard Time - Phoenix');
  });

  test('Verify View on Calendar Screen', async ({ page }) => {
    // Verify the'Time Zone' section
    await expect(page.getByText('Time zone', { exact: true })).toBeVisible();
    await expect(page.locator('#root')).toContainText('(GMT-07:00) Mountain Standard Time - Phoenix');
    await expect(page.getByRole('link', { name: 'Change time zone' })).toBeVisible();
  });

  test('Verify View on Edit Daily Availability Modal', async ({ page }) => {
    // Click on the "Edit" button for "Daily Availability"
    await page.getByRole('button', { name: 'Edit Edit' }).click();
    await expect(page.getByText('Edit daily availability')).toBeVisible();

    await expect(page.getByText('Monday:—:')).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Monday' }).getByTestId('switch-div')).toBeVisible();
    await expect(page.locator('._timeSettings_1rb2i_11').first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Monday:—:$/ }).getByRole('link').first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Monday:—:$/ }).getByRole('link').nth(1)).toBeVisible();

    await expect(page.getByText('Tuesday:—:')).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Tuesday' }).getByTestId('switch-div')).toBeVisible();
    await expect(page.locator('div:nth-child(4) > ._timeList_tg75d_1 > ._container_1rb2i_1 > ._timeSettings_1rb2i_11')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Tuesday:—:$/ }).getByRole('link').first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Tuesday:—:$/ }).getByRole('link').nth(1)).toBeVisible();

    await expect(page.getByText('Wednesday:—:')).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Wednesday' }).getByTestId('switch-div')).toBeVisible();
    await expect(page.locator('div:nth-child(6) > ._timeList_tg75d_1 > ._container_1rb2i_1 > ._timeSettings_1rb2i_11')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Wednesday:—:$/ }).getByRole('link').first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Wednesday:—:$/ }).getByRole('link').nth(1)).toBeVisible();

    await expect(page.getByText('Thursday:—:')).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Thursday' }).getByTestId('switch-div')).toBeVisible();
    await expect(page.locator('div:nth-child(8) > ._timeList_tg75d_1 > ._container_1rb2i_1 > ._timeSettings_1rb2i_11')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Thursday:—:$/ }).getByRole('link').first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Thursday:—:$/ }).getByRole('link').nth(1)).toBeVisible();

    await expect(page.getByText('Friday:—:')).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Friday' }).getByTestId('switch-div')).toBeVisible();
    await expect(page.locator('div:nth-child(10) > ._timeList_tg75d_1 > ._container_1rb2i_1 > ._timeSettings_1rb2i_11')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Friday:—:$/ }).getByRole('link').first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Friday:—:$/ }).getByRole('link').nth(1)).toBeVisible();

    await expect(page.getByText('Saturday:—:')).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Saturday' }).getByTestId('switch-div')).toBeVisible();
    await expect(page.locator('div:nth-child(12) > ._timeList_tg75d_1 > ._container_1rb2i_1 > ._timeSettings_1rb2i_11')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Saturday:—:$/ }).getByRole('link').first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Saturday:—:$/ }).getByRole('link').nth(1)).toBeVisible();

    await expect(page.getByText('Sunday:—:')).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Sunday' }).getByTestId('switch-div')).toBeVisible();
    await expect(page.locator('div:nth-child(14) > ._timeList_tg75d_1 > ._container_1rb2i_1 > ._timeSettings_1rb2i_11')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Sunday:—:$/ }).getByRole('link').first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Sunday:—:$/ }).getByRole('link').nth(1)).toBeVisible();

    await expect(page.getByRole('button', { name: 'Save changes' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeDisabled();  // should be disabled by default *BUG*
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeEnabled();
  });

  test('Verify Toggle Functionality on Edit Daily Avalibility Modal', async ({ page }) => {
    // Click on the "Edit" button for "Daily Availability"
    await page.getByRole('button', { name: 'Edit Edit' }).click();
    await expect(page.getByText('Edit daily availability')).toBeVisible();
    // Toggle off
    await page.locator('label').filter({ hasText: 'Monday' }).getByTestId('switch-div').click();
    await page.locator('label').filter({ hasText: 'Tuesday' }).getByTestId('switch-div').click();
    await page.locator('label').filter({ hasText: 'Wednesday' }).getByTestId('switch-div').click();
    await page.locator('label').filter({ hasText: 'Thursday' }).getByTestId('switch-div').click();
    await page.locator('label').filter({ hasText: 'Friday' }).getByTestId('switch-div').click();
    await page.locator('label').filter({ hasText: 'Saturday' }).getByTestId('switch-div').click();
    await page.locator('label').filter({ hasText: 'Sunday' }).getByTestId('switch-div').click();
    // Verify Toggle off
    await expect(page.locator('.sc-kXaPYj').first()).toHaveValue('Day off');
    await expect(page.locator('div:nth-child(4) > ._timeList_tg75d_1 > .sc-boxNXC > .sc-ebFFfp > .sc-fIymDE > .sc-kXaPYj')).toHaveValue('Day off');
    await expect(page.locator('div:nth-child(6) > ._timeList_tg75d_1 > .sc-boxNXC > .sc-ebFFfp > .sc-fIymDE > .sc-kXaPYj')).toHaveValue('Day off');
    await expect(page.locator('div:nth-child(8) > ._timeList_tg75d_1 > .sc-boxNXC > .sc-ebFFfp > .sc-fIymDE > .sc-kXaPYj')).toHaveValue('Day off');
    await expect(page.locator('div:nth-child(12) > ._timeList_tg75d_1 > .sc-boxNXC > .sc-ebFFfp > .sc-fIymDE > .sc-kXaPYj')).toHaveValue('Day off');
    await expect(page.locator('div:nth-child(14) > ._timeList_tg75d_1 > .sc-boxNXC > .sc-ebFFfp > .sc-fIymDE > .sc-kXaPYj')).toHaveValue('Day off');
    // Toggle on
    await page.locator('label').filter({ hasText: 'Monday' }).getByTestId('switch-div').click();
    await page.locator('label').filter({ hasText: 'Tuesday' }).getByTestId('switch-div').click();
    await page.locator('label').filter({ hasText: 'Wednesday' }).getByTestId('switch-div').click();
    await page.locator('label').filter({ hasText: 'Thursday' }).getByTestId('switch-div').click();
    await page.locator('label').filter({ hasText: 'Friday' }).getByTestId('switch-div').click();
    await page.locator('label').filter({ hasText: 'Saturday' }).getByTestId('switch-div').click();
    await page.locator('label').filter({ hasText: 'Sunday' }).getByTestId('switch-div').click();
    // Verify Toggle on
    await expect(page.locator('._timeSettings_1rb2i_11').first()).toBeVisible();
    await expect(page.locator('div:nth-child(4) > ._timeList_tg75d_1 > ._container_1rb2i_1 > ._timeSettings_1rb2i_11')).toBeVisible();
    await expect(page.locator('div:nth-child(6) > ._timeList_tg75d_1 > ._container_1rb2i_1 > ._timeSettings_1rb2i_11')).toBeVisible();
    await expect(page.locator('div:nth-child(8) > ._timeList_tg75d_1 > ._container_1rb2i_1 > ._timeSettings_1rb2i_11')).toBeVisible();
    await expect(page.locator('div:nth-child(10) > ._timeList_tg75d_1 > ._container_1rb2i_1 > ._timeSettings_1rb2i_11')).toBeVisible();
    await expect(page.locator('div:nth-child(12) > ._timeList_tg75d_1 > ._container_1rb2i_1 > ._timeSettings_1rb2i_11')).toBeVisible();
    await expect(page.locator('div:nth-child(14) > ._timeList_tg75d_1 > ._container_1rb2i_1 > ._timeSettings_1rb2i_11')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeEnabled();
    await page.getByRole('button', { name: 'Cancel' }).click();
  });

  test('Verify Delete Start/End Time Pair Functionality on Edit Daily Availability Modal', async ({ page }) => {
    // Click on the "Edit" button for "Daily Availability"
    await page.getByRole('button', { name: 'Edit Edit' }).click();
    await expect(page.getByText('Edit daily availability')).toBeVisible();

    // Click on the "Delete" button for "Start/End Time Pair"
    await page.locator('div').filter({ hasText: /^Monday:—:$/ }).getByRole('link').first().click();
    await expect(page.getByTestId('input').getByRole('textbox')).toHaveValue('Day off');
  });

  test('Verify Add Start/End Time Pair Functionality on Edit Daily Availability Modal', async ({ page }) => {
    // Click on the "Edit" button for "Daily Availability"
    await page.getByRole('button', { name: 'Edit Edit' }).click();
    await expect(page.getByText('Edit daily availability')).toBeVisible();

    // Click on the "Add" icon for a day of the week
    await page.locator('div').filter({ hasText: /^Monday:—:$/ }).getByRole('link').nth(1).click();
    await expect(page.locator('div:nth-child(2) > ._timeSettings_1rb2i_11')).toBeVisible();
    await expect(page.locator('._timeList_tg75d_1 > div:nth-child(2)')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^:—::—:$/ }).getByRole('link').nth(1)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeEnabled();
  });

  test('Verify Cancel Button Functionality on Edit Daily Avalibility Modal', async ({ page }) => {
    // Click on the "Edit" button for "Daily Availability"
    await page.getByRole('button', { name: 'Edit Edit' }).click();
    await expect(page.getByText('Edit daily availability')).toBeVisible();

    // Click on the "Delete" button for "Start/End Time Pair"
    await page.locator('div').filter({ hasText: /^Monday:—:$/ }).getByRole('link').first().click();
    await expect(page.getByTestId('input').getByRole('textbox')).toHaveValue('Day off');
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Verify the changes were not saved
    await page.getByRole('button', { name: 'Edit Edit' }).click();
    await expect(page.getByText('Edit daily availability')).toBeVisible();
    await expect(page.locator('._timeSettings_1rb2i_11').first()).toBeVisible();
  });

  test('Verify Save Changes Validation for Incomplete Times on Edit Daily Availability Modal', async ({ page }) => {
    // Click on the "Edit" button for "Daily Availability"
    await page.getByRole('button', { name: 'Edit Edit' }).click();
    await expect(page.getByText('Edit daily availability')).toBeVisible();

    // Click on the "Add" icon for a day of the week
    await page.locator('div').filter({ hasText: /^Monday:—:$/ }).getByRole('link').nth(1).click();
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('All times must have a value selected')).toBeVisible(); // error message says 'Required' by default *BUG*
  });

  test('Verify Save Changes with All Times Populated on Edit Daily Availability Modal', async ({ page }) => {
    // Click on the "Edit" button for "Daily Availability"
    await page.getByRole('button', { name: 'Edit Edit' }).click();
    await expect(page.getByText('Edit daily availability')).toBeVisible();

    // Ensure all start/end time pairs have values selected
    await page.locator('div').filter({ hasText: /^Monday:—:$/ }).locator('path').first().click();
    await page.getByTestId('custom-dropdown-item-08:00 AM').click();
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('Monday08:00 AM — 11:59 PM')).toBeVisible();
    await page.getByRole('button', { name: 'Edit Edit' }).click();
    await page.locator('div').filter({ hasText: /^Monday:—:$/ }).locator('path').first().click();
    await page.getByTestId('custom-dropdown-item-12:00 AM').click();
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('Monday12:00 AM — 11:59 PM')).toBeVisible();
  });

  test('Verify Change My Time Zone Modal Display', async ({ page }) => {
    // Click on the "Change time zone" link
    await page.getByRole('link', { name: 'Change time zone' }).click();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeDisabled();

    await page.getByTestId('switch-div').click();
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('Success', { exact: true })).toBeVisible();
    await expect(page.getByText('Time zone updated')).toBeVisible();
    await page.getByRole('link', { name: 'Change time zone' }).click();
    await page.getByTestId('switch-div').click();
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('Time zone updated')).toBeVisible();
    await expect(page.locator('#root')).toContainText('(GMT-07:00) Mountain Standard Time - Phoenix');
  });


    


});