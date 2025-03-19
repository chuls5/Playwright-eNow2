import { test, expect } from '@playwright/test';
import { it } from 'node:test';

// Use the stored authentication state from your setup file
test.use({ storageState: 'playwright/.auth/patient.json' });

test('Verify Patient Dashboard Accessibility', async ({ page }) => {
  await page.goto('/dashboard');

  // 1. Verify the precondition that patient is logged-in on the Dashboard page
  await expect(page).toHaveURL(/.*\/dashboard/);

  // 2. Verify the header/top navigation bar is displayed
  await page.waitForSelector('[data-testid="navigation"]', { timeout: 60000 }); // 60 seconds
  await expect(page.locator('[data-testid="navigation"]')).toBeVisible();

  // 3. Verify the "Schedule an Appointment" button is displayed 
  await page.waitForSelector('text=Schedule an Appointment', { state: 'visible' });
  await expect(page.getByText('Schedule an Appointment')).toBeVisible();

  // 4. Verify the "See a provider now" button is displayed 
  await expect(page.getByText('See a provider now')).toBeVisible();

  // 5. Check the "Upcoming Appointments" section is displayed
  await expect(page.getByText('Upcoming appointments')).toBeVisible();
  await page.waitForSelector('[data-testid="main-card"]', { state: 'visible' });
  await page.waitForSelector('[data-testid="date-card"]', { state: 'visible' });

  // 6. Check the "Past Appointments" section is displayed
  await expect(page.getByText('Past appointments')).toBeVisible();
  await expect(page.locator('[data-testid="table"]')).toBeVisible();
  await expect(page.locator('[data-testid="dropselect"]')).toBeVisible();
  await expect(page.getByText('Date')).toBeVisible();
  await expect(page.getByText('Service')).toBeVisible();
  await expect(page.getByText('Specialist')).toBeVisible();
  await expect(page.getByText('Type')).toBeVisible();
  await expect(page.getByText('Actual duration')).toBeVisible();
  
  // 7. Verify the "View details" link is visible, enabled and clickable
  const viewDetailsLink = page.getByRole('link', { name: 'View details' }).first();
  await expect(viewDetailsLink).toBeVisible();
  await expect(viewDetailsLink).toBeEnabled();
});


test('Verify Schedule an Appointment button', async ({ page }) => {
  await page.goto('/dashboard');

  // 1. Verify the precondition that patient is logged-in on the Dashboard page
  await expect(page).toHaveURL(/.*\/dashboard/);

  // 2. Verify the "Schedule an Appointment" button is displayed
  await page.waitForSelector('text=Schedule an Appointment', { state: 'visible' });
  await expect(page.getByText('Schedule an Appointment')).toBeVisible();

  // 3. Click the "Schedule an Appointment" button
  await page.getByText('Schedule an Appointment').click();

  // 4. Assert that you are now at the expected URL
  await expect(page).toHaveURL(/.*\/dashboard\/schedule-appointment/);
});


test('Verify See a Provider Now Button', async ({ page }) => {
  await page.goto('/dashboard');

  // 1. Verify the precondition that patient is logged-in on the Dashboard page
  await expect(page).toHaveURL(/.*\/dashboard/);

  // 2. Locate the "See a Provider now" button
  await page.waitForSelector('text=See a Provider now', { state: 'visible' });
  await expect(page.getByText('See a provider now')).toBeVisible();

  // 3. Click the "Schedule an Appointment" button
  await page.getByText('See a provider now').click();

  // 4. Assert that you are now at the expected URL
  await expect(page).toHaveURL(/.*\/dashboard\/see-provider-now/);
});