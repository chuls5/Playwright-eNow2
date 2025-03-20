import { test, expect } from '@playwright/test';
import { it } from 'node:test';

// Use the Patients stored authentication state
test.use({ storageState: 'playwright/.auth/patient.json' });

test('Verify Patient Dashboard Accessibility', async ({ page }) => {
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
  await expect(page.locator('[data-testid="dropselect"]')).toBeVisible();
  
  const tableData = page.locator('[data-testid="table"]');
  await expect(tableData).toBeVisible();
  await expect(tableData).toContainText('Date');
  await expect(tableData).toContainText('Service');
  await expect(tableData).toContainText('Specialist');
  await expect(tableData).toContainText('Type');
  await expect(tableData).toContainText('Actual duration');
  
  // 7. Verify the "View details" link is visible, enabled and clickable
  const viewDetailsLink = page.getByRole('link', { name: 'View details' }).first();
  await expect(viewDetailsLink).toBeVisible();
  await expect(viewDetailsLink).toBeEnabled();
});


test("Verify 'Schedule an Appointment' button", async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/.*\/dashboard/);

  // 2. Verify the "Schedule an Appointment" button is displayed
  const scheduleAppointmentButton = page.getByText('Schedule an Appointment');
  await scheduleAppointmentButton.waitFor({ state: 'visible' });
  await scheduleAppointmentButton.click();

  // 4. Assert that you are now at the expected URL
  await expect(page).toHaveURL(/.*\/dashboard\/schedule-appointment/);
});


test("Verify 'See a Provider Now' Button", async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/.*\/dashboard/);

  const seeProviderButton = page.getByText('See a provider now');
  await seeProviderButton.waitFor({ state: 'visible' });
  await seeProviderButton.click();

  await expect(page).toHaveURL(/.*\/dashboard\/see-provider-now/);
});


test("Verify 'Appointment Details' button", async ({ page }) => {
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
  await expect(viewDetailsLink).toBeVisible().toBeEnabled();
});


test("Verify 'Join Session' button", async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/.*\/dashboard/);

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
    // If no "Join session" button is available, skip the test with a message
    test.skip(true, 'No "Join session" button found');
  }
});


test("Verify 'Reschedule session' button", async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/.*\/dashboard/);

  await page.getByRole('button', { name: 'DotsV' }).first().click();
  await page.getByRole('button', { name: 'CalendarRepeat Reschedule' }).click();
  await expect(page.getByRole('heading', { name: 'Select new date & time' })).toBeVisible();
});


test("Verify 'Cancel session' button", async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/.*\/dashboard/);

  await page.getByRole('button', { name: 'DotsV' }).first().click();
  await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
  await page.getByRole('button', { name: 'Yes, cancel' }).click();

  const successMessage = page.getByText('Session canceled');
  await expect(successMessage).toBeVisible();
});


test("Verify 'Year' selector for past appointments", async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/.*\/dashboard/);

  await page.getByRole('heading', { name: 'Past appointments' }).waitFor({ state: 'visible' });

  const yearSelector = page.getByRole('link', { name: 'ChevronDown' }).filter({ visible: true });

  if (yearSelector.isVisible()) {
    await yearSelector.click();
    
    const itemsWrapper = page.locator('[data-testid="items-wrapper"]').filter({ visible: true });
    await expect(itemsWrapper).toBeVisible();
    
    await itemsWrapper.click();
  } else {
    test.skip(true, 'Year selector not found in the past appointments section');
  }
});



test("Verify 'Check' button for confirming appointments", async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/.*\/dashboard/);

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
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/.*\/dashboard/);

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