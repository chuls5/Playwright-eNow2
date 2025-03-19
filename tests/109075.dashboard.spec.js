import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/patient.json' });

test('Verify Patient Dashboard Accessibility', async ({ page }) => {
  await page.goto('/dashboard');

  // 1. Verify the precondition that patient is logged-in on the Dashboard page
  await expect(page).toHaveURL(/.*\/dashboard/);

  // 2. Verify the header/top navigation bar is displayed
  await expect(page.locator('[data-testid="navigation"]')).toBeVisible();

  // 3. Verify the "Schedule an Appointment" button is displayed 
  const scheduleButton = page.getByText('Schedule an Appointment');
  await expect(scheduleButton).toBeVisible();

  // 4. Verify the "See a provider now" button is displayed 
  await expect(page.getByText('See a provider now')).toBeVisible();

  // 5. Check the "Upcoming Appointments" section is displayed
  await expect(page.getByText('Upcoming appointments')).toBeVisible();
  await expect(page.locator('[data-testid="main-card"]')).toBeVisible();
  await expect(page.locator('[data-testid="date-card"]')).toBeVisible();

  // 6. Check the "Past Appointments" section is displayed
  await expect(page.getByText('Past appointments')).toBeVisible();
  await expect(page.locator('[data-testid="table"]')).toBeVisible();
  await expect(page.locator('[data-testid="dropselect"]')).toBeVisible();
  
  // Table header verification
  const tableHeaders = ['Date', 'Service', 'Specialist', 'Type', 'Actual duration'];
  for (const header of tableHeaders) {
    await expect(page.getByText(header)).toBeVisible();
  }
  
  // 7. Verify the "View details" link is visible, enabled and clickable
  const viewDetailsLink = page.getByRole('link', { name: 'View details' }).first();
  await expect(viewDetailsLink).toBeVisible();
  await expect(viewDetailsLink).toBeEnabled();
});

test('Verify Schedule an Appointment button', async ({ page }) => {
  await page.goto('/dashboard');

  // 1. Verify the precondition that patient is logged-in on the Dashboard page
  await expect(page).toHaveURL(/.*\/dashboard/);

  // 2. Verify the "Schedule an Appointment" button is displayed and click it
  const scheduleButton = page.getByText('Schedule an Appointment');
  await expect(scheduleButton).toBeVisible();
  await scheduleButton.click();

  // 3. Assert that you are now at the expected URL
  await expect(page).toHaveURL(/.*\/dashboard\/schedule-appointment/);
});

test('Verify See a Provider Now Button', async ({ page }) => {
  await page.goto('/dashboard');

  // 1. Verify the precondition that patient is logged-in on the Dashboard page
  await expect(page).toHaveURL(/.*\/dashboard/);

  // 2. Locate the "See a Provider now" button and click it
  const providerButton = page.getByText('See a provider now');
  await expect(providerButton).toBeVisible();
  await providerButton.click();

  // 3. Assert that you are now at the expected URL
  await expect(page).toHaveURL(/.*\/dashboard\/see-provider-now/);
});