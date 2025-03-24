import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use the Patients stored authentication state
test.use({ storageState: 'playwright/.auth/patient.json' });

test.describe('Patient Logged-IN Dashboard Tests', () => {

  test('Verify Patient Dashboard Accessibility', async ({ page }) => {
    // 1. Patient is on dashboard
    await page.goto('/dashboard');

    // 2. Verify the header/top nav bar 
    await expect(async () => {
      await page.waitForSelector('[data-testid="navigation"]', { timeout: 500 });
      await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
    }).toPass();

    // 3. Verify the "Schedule an Appointment" button is displayed
    await expect(async () => {
      await page.waitForSelector('text=Schedule an Appointment', { timeout: 500 });
      await expect(page.getByText('Schedule an Appointment')).toBeVisible();
    }).toPass();

    // 4. Verify the "See a provider now" button is displayed
    await expect(page.getByText('See a provider now')).toBeVisible();

    // 5. Verify the "Upcoming appointments" section is displayed
    await expect(page.getByText('Upcoming appointments')).toBeVisible();

    // 6. Verify the "Past appointments" section is displayed
    await expect(page.getByText('Past appointments')).toBeVisible();

    const tableData = page.locator('[data-testid="table"]');
    await expect(tableData).toBeVisible();

    const expectedHeaders = ['Date', 'Service', 'Specialist', 'Type', 'Actual duration'];
    for (const header of expectedHeaders) {
      await expect(tableData).toContainText(header);
    }
    
    const viewDetailsLink = page.getByRole('link', { name: 'View details' }).first();
    await expect(viewDetailsLink).toBeVisible();
    await expect(viewDetailsLink).toBeEnabled();
  });

  test("Verify 'Schedule an Appointment' button", async ({ page }) => {
    // 1. Patient is on the dashboard
    await page.goto('/dashboard');

    // 2. Verify the "Schedule an Appointment" button is displayed
    const scheduleAppointmentButton = page.getByText('Schedule an Appointment');
    await scheduleAppointmentButton.waitFor({ state: 'visible' });

    // 3. Click the "Schedule an Appointment" button & Assert the URL
    await scheduleAppointmentButton.click();
    await expect(page).toHaveURL(/.*\/dashboard\/schedule-appointment/);
  });

  test("Verify 'See a Provider Now' Button", async ({ page }) => {
    // 1. Patient is on the dashboard
    await page.goto('/dashboard');

    // 2. Verify the "See a provider now" button is displayed
    const seeProviderButton = page.getByText('See a provider now');
    await seeProviderButton.waitFor({ state: 'visible' });

    // 3. Click the "See a provider now" button & Assert the URL
    await seeProviderButton.click();
    await expect(page).toHaveURL(/.*\/dashboard\/see-provider-now/);
  });

  test("Verify 'Appointment Details' button", async ({ page }) => {
    // 1. Patient is on the dashboard
    await page.goto('/dashboard');

    // 2. Observe a module in the "Upcoming Appointments"
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

  test("Verify 'Join Session' button", async ({ page }) => {
    // 1. Patient is on the dashboard
    await page.goto('/dashboard');

    // 2. Observe a module with the "Join session" button
    await page.locator('span').filter({ hasText: 'General Practice' }).first().click();
    const joinSessionButton = page.getByRole('button', { name: 'Video Join video session' });

    const isJoinSessionButtonVisible = await joinSessionButton.isVisible();

    if (isJoinSessionButtonVisible) {
      await expect(joinSessionButton).toBeEnabled();

      // 3. Click the "Join session" button
      await joinSessionButton.click();
      await expect(page.locator('.VideoSetUp')).toBeVisible();
    } else {
      test.skip(true, 'No "Join session" button found');
    }
  });

  test("Verify 'Year' selector for past appointments", async ({ page }) => {
    // 1. Patient is on the dashboard
    await page.goto('/dashboard');

    await page.getByRole('heading', { name: 'Past appointments' }).waitFor({ state: 'visible' });

    const yearSelector = page.getByRole('link', { name: 'ChevronDown' }).filter({ visible: true });

    if (await yearSelector.isVisible()) {
      await yearSelector.click();
      
      const itemsWrapper = page.locator('[data-testid="items-wrapper"]').filter({ visible: true });
      await expect(itemsWrapper).toBeVisible();
      
      await itemsWrapper.click();
    } else {
      test.skip(true, 'Year selector not found in the past appointments section');
    }
  });

  test("Verify 'Check' button for confirming appointments", async ({ page }) => {
    // 1. Patient is on the dashboard
    await page.goto('/dashboard');

    await page.waitForSelector('[data-testid="main-card"]', { state: 'visible' });

    const hasCheckButton = await page.getByRole('button', { name: 'Check' }).count() > 0;
    
    if (hasCheckButton) {
      await page.getByRole('button', { name: 'Check' }).first().click();
      
      await expect(page.getByTestId('toast')).toBeVisible();
      
      await expect(page.getByText('Session request accepted')).toBeVisible();
      await expect(page.getByRole('link', { name: 'XClose' })).toBeVisible();
    } else {
      test.skip(true, 'No appointments requiring confirmation found');
    }
  });

  test("Verify 'XClose' button for canceling appointments", async ({ page }) => {
    // 1. Patient is on the dashboard
    await page.goto('/dashboard');

    await page.waitForSelector('[data-testid="main-card"]', { state: 'visible' });
    
    const hasXCloseButton = await page.getByRole('button', { name: 'XClose' }).count() > 0;
    
    if (hasXCloseButton) {
      await page.getByRole('button', { name: 'XClose' }).first().click();
      await expect(page.getByTestId('toast')).toBeVisible();
      await expect(page.getByText('Session request declined')).toBeVisible();
    } else {
      test.skip(true, 'No appointments requiring cancellation found');
    }
  });

  test("Verify 'Reschedule session' button", async ({ page }) => {
    // 1. Patient is on the dashboard
    await page.goto('/dashboard');

    // 2. Observe a module with the "Reschedule session" button
    await page.getByRole('button', { name: 'DotsV' }).first().click();
    await page.getByRole('button', { name: 'CalendarRepeat Reschedule' }).click();
    await expect(page.getByRole('heading', { name: 'Select new date & time' })).toBeVisible();
  });

  test("Verify 'Cancel session' button", async ({ page }) => {
    // 1. Patient is on the dashboard
    await page.goto('/dashboard');

    // 2. Click cancel session 
    await page.getByRole('button', { name: 'DotsV' }).first().click();
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();

    // 3. Verify success message
    const successMessage = page.getByText('Session canceled');
    await expect(successMessage).toBeVisible();
  });
});