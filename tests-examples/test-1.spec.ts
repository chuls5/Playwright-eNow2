import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/patient.json' });

test('test', async ({ page }) => {
  // Navigate to dashboard
  await page.goto('/dashboard');

  // Wait for dashboard to load
  await expect(async () => {
    await page.waitForSelector('[data-testid="navigation"]', { timeout: 500 });
    await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
  }).toPass();

  // 2. Navigate to Account Settings
  await page.locator('div').filter({ hasText: /^Available$/ }).getByTestId('popover-trigger').click();
  await page.getByRole('button', { name: 'SettingsGear Account settings' }).click();
  
  // 3. Click on the 'Calander' tab
  await page.getByRole('button', { name: 'Calendar' }).click();
  await expect(page).toHaveURL(/.*\/calendar/);
  const discription = page.locator('div').filter({ hasText: /^Manage your time zone and daily working hours$/ }).first(); 
  await expect(discription).toBeVisible();

  // 4. Verify the 'Time zone' section
  await expect(page.getByText('Time zone', { exact: true })).toBeVisible();
  await expect(page.getByText('No timezone selected')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Change time zone' })).toBeVisible();

  // 5. Verify the 'Daily avalibility' section
  await expect(page.getByText('Daily availabilityEditMonday12:00 AM — 11:59 PMTuesday12:00 AM — 11:59')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Edit Edit' })).toBeVisible();
  await page.getByRole('button', { name: 'Edit Edit' }).isEnabled();

});