import { test, expect } from '@playwright/test';
import { it } from 'node:test';

// Use the Patients stored authentication state
test.use({ storageState: 'playwright/.auth/patient.json' });

test('Verify Patient Dashboard Accessibility', async ({ page }) => {
  // 1. Verify the precondition that patient is logged-in on the Dashboard page
  await page.goto('/dashboard');
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
  // 1. Verify the precondition that patient is logged-in on the Dashboard page
  await page.goto('/dashboard');
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
  // 1. Verify the precondition that patient is logged-in on the Dashboard page
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/.*\/dashboard/);

  // 2. Locate the "See a Provider now" button
  await page.waitForSelector('text=See a Provider now', { state: 'visible' });
  await expect(page.getByText('See a provider now')).toBeVisible();

  // 3. Click the "Schedule an Appointment" button
  await page.getByText('See a provider now').click();

  // 4. Assert that you are now at the expected URL
  await expect(page).toHaveURL(/.*\/dashboard\/see-provider-now/);
});


test('Verify Appointment Details button', async ({ page }) => {
  // 1. Verify the precondition that patient is logged-in on the Dashboard page
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/.*\/dashboard/);

  // 2. Observe a module in the "Upcomming Appointments"
  await page.locator('span').filter({ hasText: 'General Practice' }).first().click();
  await expect(page.getByText('Session Details')).toBeVisible();

  // 3. Observe a module in the "Past Appointments" section
  await expect(page.getByText('Past appointments')).toBeVisible();
  await page.getByRole('button', { name: 'XClose' }).click();

  // 4. Click on the "View details" link
  const viewDetailsLink = page.getByRole('link', { name: 'View details' }).first();
  await expect(viewDetailsLink).toBeVisible();
  await expect(viewDetailsLink).toBeEnabled();
});


test('Verify Join Session button', async ({ page }) => {
  await page.goto('/dashboard');

  // 1. Verify the precondition that patient is logged-in on the Dashboard page
  await expect(page).toHaveURL(/.*\/dashboard/);

  // 2. Observe a module with the "Join session" button
  await page.locator('span').filter({ hasText: 'General Practice' }).first().click();
  await expect(page.getByRole('button', { name: 'Video Join video session' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Video Join video session' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Video Join video session' })).toBeEnabled();

  // 3. Click the "Join session" button
  await page.getByRole('button', { name: 'Video Join video session' }).click();
  await expect(page.locator('.VideoSetUp')).toBeVisible();
});


test('Verify Reschedule session button', async ({ page }) => {
  await page.goto('/dashboard');

  // 1. Verify the precondition that patient is logged-in on the Dashboard page
  await expect(page).toHaveURL(/.*\/dashboard/);

  // 2. Observe a module with the "Reschedule session" button
  await page.getByRole('button', { name: 'DotsV' }).first().click();
  await page.getByRole('button', { name: 'CalendarRepeat Reschedule' }).click();
  await expect(page.getByRole('heading', { name: 'Select new date & time' })).toBeVisible();
});


test('Verify Cancel session button', async ({ page }) => {
  await page.goto('/dashboard');

  // 1. Verify the precondition that patient is logged-in on the Dashboard page
  await expect(page).toHaveURL(/.*\/dashboard/);

  // 2. Observe a module with the "Cancel session" button
  await page.getByRole('button', { name: 'DotsV' }).first().click();
  await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
  await expect(page.getByText('Cancel session?')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Yes, cancel' })).toBeVisible();
});


test('Verify Year selector for past appointments', async ({ page }) => {
  await page.goto('/dashboard');

  // 1. Verify the precondition that patient is logged-in on the Dashboard page
  await expect(page).toHaveURL(/.*\/dashboard/);

  // 2. Locate the year selector in the past appointments section
  await expect(page.getByRole('link', { name: 'ChevronDown' })).toBeVisible({ timeout: 10000 });
  await page.getByRole('link', { name: 'ChevronDown' }).click();
  await expect(page.locator('[data-testid="items-wrapper"]')).toBeVisible();
  await page.locator('[data-testid="items-wrapper"]').click();

});