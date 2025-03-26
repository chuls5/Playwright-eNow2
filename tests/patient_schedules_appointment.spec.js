import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/patient.json' });

test('schedule appointment with specific provider', async ({ page }) => {
  // Navigate to dashboard
  await page.goto('/dashboard');

  // Wait for dashboard to load
  await expect(async () => {
    await page.waitForSelector('[data-testid="navigation"]', { timeout: 500 });
    await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
  }).toPass();
  
  // Click on "Schedule an appointment"
  await page.getByText('Schedule an appointment').click();

  // Handle optional skip button
  const skipButton = page.getByRole('button', { name: 'Skip' });
  await expect(async () => {
    await skipButton.waitFor({ timeout: 500 });
    await expect(skipButton).toBeVisible();
  }).toPass();
  await skipButton.click();

  // Change provider
  await changeProvider(page);

  // Select available time slot and complete appointment scheduling
  await selectAvailableTimeSlotAndSchedule(page);
});

async function changeProvider(page) {
  // Click on "Change provider" link
  await page.getByRole('link', { name: 'Change provider' }).click();

  // Select specific provider (Alex Provider)
  const providerLocator = page.locator('div').filter({ 
    hasText: /^Alex ProviderproviderDermatologist, Allergologist$/ 
  }).first();
  await providerLocator.click();

  // Save provider selection
  await page.getByRole('button', { name: 'Save' }).click();
}

async function selectAvailableTimeSlotAndSchedule(page) {
  // Wait for time slots to load
  await expect(async () => {
    await page.waitForSelector('div[class*="_container_5we3n_1"]', { timeout: 500 });
    await expect(page.locator('div[class*="_container_5we3n_1"]').first()).toBeVisible();
  }).toPass();

  // Get all time slots
  const timeSlots = page.locator('div[class*="_container_5we3n_1"]');
  const count = await timeSlots.count();

  // Find and click first available time slot
  for (let i = 0; i < count; i++) {
    const timeSlot = timeSlots.nth(i);
    
    // Check multiple conditions for availability
    const isEnabled = await timeSlot.isEnabled();
    const isVisible = await timeSlot.isVisible();
    const hasNoDisabledClass = !(await timeSlot.getAttribute('class')).includes('disabled');
    
    if (isEnabled && isVisible && hasNoDisabledClass) {
      // Capture time slot text
      const timeSlotText = await timeSlot.textContent();
      console.log('Selected Time Slot:', timeSlotText);
      console.log('Selected provider:', 'Alex Provider');

      // Ensure element is ready and click
      await timeSlot.waitFor({ state: 'visible', timeout: 2000 });
      await timeSlot.click({ force: true, trial: true });
      await timeSlot.click({ force: true });
      
      // Complete appointment scheduling after selecting time slot
      // Check payment option checkbox
      await page.getByRole('radio', { name: 'No, continue paying private' }).check();

      // Check Notice of Consent checkbox
      await page.getByTestId('erroring-text').locator('span').first().click();

      // Click "Schedule visit"
      await page.getByRole('button', { name: 'Schedule visit' }).click();

      // Wait for and click "Go to my appointments" button
      const goButton = page.getByRole('button', { name: 'Go to my appointments' });
      await expect(async () => {
        await goButton.waitFor({ timeout: 5000 });
        await expect(goButton).toBeVisible();
        await expect(goButton).toBeEnabled();
      }).toPass();
      await goButton.click();

      // Wait for dashboard to load
      await expect(async () => {
        await page.waitForSelector('[data-testid="navigation"]', { timeout: 500 });
        await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
      }).toPass();

      break; // Exit loop after first available slot is clicked and scheduling is complete
    }
  }
}

async function logout(page) {
  // Logout process
  await page.locator('span > .sc-bMTdWJ > .sc-hJRrWL > .sc-fwzISk').click();
  await page.getByRole('button', { name: 'LogOut Log out' }).click();
  
  // Verify logout
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
}

