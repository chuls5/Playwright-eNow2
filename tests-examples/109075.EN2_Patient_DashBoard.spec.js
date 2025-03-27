import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use the Patients stored authentication state
test.use({ storageState: 'playwright/.auth/patient.json' });

test.describe('Patient Dashboard', () => {
  // Reusable setup to navigate to dashboard before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    // Wait for main content to load
    await expect(async () => {
        await page.waitForSelector('[data-testid="navigation"]', { timeout: 500 });
        await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
      }).toPass();
  });

  test('Verify Dashboard Accessibility and Core Elements', async ({ page }) => {
    // Navigation Bar
    await expect(page.locator('[data-testid="navigation"]')).toBeVisible();

    // Main Action Buttons
    const actionButtons = [
      'Schedule an Appointment',
      'See a provider now'
    ];
    for (const buttonText of actionButtons) {
      await expect(page.getByText(buttonText)).toBeVisible();
    }

    // Appointment Sections
    const appointmentSections = [
      'Upcoming appointments',
      'Past appointments'
    ];
    for (const sectionText of appointmentSections) {
      await expect(page.getByText(sectionText)).toBeVisible();
    }

    // Table Verification
    const tableData = page.locator('[data-testid="table"]');
    await expect(tableData).toBeVisible();

    const expectedHeaders = ['Date', 'Service', 'Specialist', 'Type', 'Actual duration'];
    for (const header of expectedHeaders) {
      await expect(tableData).toContainText(header);
    }

    // View Details Link
    const viewDetailsLink = page.getByRole('link', { name: 'View details' }).first();
    await expect(viewDetailsLink).toBeVisible();
    await expect(viewDetailsLink).toBeEnabled();
  });

  test('Navigate to Schedule Appointment', async ({ page }) => {
    const scheduleButton = page.getByText('Schedule an Appointment');
    await scheduleButton.click();
    await expect(page).toHaveURL(/.*\/dashboard\/schedule-appointment/);
  });

  test('Navigate to See Provider Now', async ({ page }) => {
    const seeProviderButton = page.getByText('See a provider now');
    await seeProviderButton.click();
    await expect(page).toHaveURL(/.*\/dashboard\/see-provider-now/);
  });

  test('Interact with Appointment Details', async ({ page }) => {
    // Open Session Details
    const generalPracticeSession = page.locator('span').filter({ hasText: 'General Practice' }).first();
    await generalPracticeSession.click();
    await expect(page.getByText('Session Details')).toBeVisible();

    // Close Session Details
    await page.getByRole('button', { name: 'XClose' }).click();
  });

  test('Join Video Session', async ({ page }) => {
    const generalPracticeSession = page.locator('span').filter({ hasText: 'General Practice' }).first();
    await generalPracticeSession.click();

    const joinSessionButton = page.getByRole('button', { name: 'Video Join video session' });
    
    if (await joinSessionButton.isVisible()) {
      await expect(joinSessionButton).toBeEnabled();
      await joinSessionButton.click();
      await expect(page.locator('.VideoSetUp')).toBeVisible();
    } else {
      test.skip(true, 'No "Join session" button found');
    }
  });

  test('Select Year in Past Appointments', async ({ page }) => {
    const yearSelector = page.getByRole('link', { name: 'ChevronDown' }).filter({ visible: true });

    if (await yearSelector.isVisible()) {
      await yearSelector.click();
      
      const itemsWrapper = page.locator('[data-testid="items-wrapper"]').filter({ visible: true });
      await expect(itemsWrapper).toBeVisible();
      
      await itemsWrapper.click();
    } else {
      test.skip(true, 'Year selector not found in past appointments');
    }
  });

  test('Confirm Appointment', async ({ page }) => {
    const checkButton = page.getByRole('button', { name: 'Check' }).first();
    
    if (await checkButton.count() > 0) {
      await checkButton.click();
      
      await expect(page.getByTestId('toast')).toBeVisible();
      await expect(page.getByText('Session request accepted')).toBeVisible();
      await expect(page.getByRole('link', { name: 'XClose' })).toBeVisible();
    } else {
      test.skip(true, 'No appointments requiring confirmation');
    }
  });

  test('Cancel Appointment Request', async ({ page }) => {
    const xCloseButton = page.getByRole('button', { name: 'XClose' }).first();
    
    if (await xCloseButton.count() > 0) {
      await xCloseButton.click();
      await expect(page.getByTestId('toast')).toBeVisible();
      await expect(page.getByText('Session request declined')).toBeVisible();
    } else {
      test.skip(true, 'No appointments requiring cancellation');
    }
  });

  test('Reschedule session', async ({ page }) => {
    const dotsVButton = page.getByRole('button', { name: 'DotsV' }).first();
    // Skip test if no sessions are available to reschedule
    test.skip(await dotsVButton.count() === 0, 'No sessions available to reschedule');
    await dotsVButton.click();
    await page.getByRole('button', { name: 'CalendarRepeat Reschedule' }).click();
    await expect(page.getByRole('heading', { name: 'Select new date & time' })).toBeVisible();
  });

  test('Cancel Existing Session', async ({ page }) => {
    const dotsVButton = page.getByRole('button', { name: 'DotsV' }).first();
    // Skip test if no sessions are available to cancel
    test.skip(await dotsVButton.count() === 0, 'No sessions available to cancel');
    await page.getByRole('button', { name: 'DotsV' }).first().click();
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();
    const successMessage = page.getByText('Session canceled');
    await expect(successMessage).toBeVisible();
  });
});