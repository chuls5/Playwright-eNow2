import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/patient.json' });

test('test login spike', async ({ page }) => {
  await page.goto('/dashboard');

  // Wait for dashboard to load
  await expect(async () => {
    await page.waitForSelector('[data-testid="navigation"]', { timeout: 500 });
    await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
  }).toPass();
  
  // Click on "Schedule an appointment"
  await page.getByText('Schedule an appointment').click();

  // Optional~
  // Wait for the "Skip" button to load & then click it
  // const skipButton = page.getByRole('button', { name: 'Skip' });
  // await expect(async () => {
  //   await skipButton.waitFor({ timeout: 500 });
  //   await expect(skipButton).toBeVisible();
  // }).toPass();
  // await skipButton.click();

  //Otherwise~
    // Patient goes through the questionare
  await page.locator('label:nth-child(2) > .sc-dKpdpM').first().check();
  await page.locator('div:nth-child(2) > .sc-cJAKoS > .sc-gWijiA > label:nth-child(2) > .sc-dKpdpM').check();
  await page.locator('div:nth-child(3) > .sc-cJAKoS > .sc-gWijiA > label:nth-child(2) > .sc-dKpdpM').check();
  await page.locator('div:nth-child(4) > .sc-cJAKoS > .sc-gWijiA > label:nth-child(2) > .sc-dKpdpM').check();
  await page.locator('div:nth-child(5) > .sc-cJAKoS > .sc-gWijiA > label:nth-child(2) > .sc-dKpdpM').check();
  await page.locator('div:nth-child(6) > .sc-cJAKoS > .sc-gWijiA > label:nth-child(2) > .sc-dKpdpM').check();
  await page.locator('div:nth-child(7) > .sc-cJAKoS > .sc-gWijiA > label:nth-child(2) > .sc-dKpdpM').check();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('heading', { name: 'Add your symptoms' })).toBeVisible();
  await page.getByRole('combobox').click();
  await page.getByRole('combobox').fill('Insomnia');
  await page.getByRole('option', { name: 'Insomnia', exact: true }).click();
  await expect(page.getByTestId('tag')).toBeVisible();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('heading', { name: 'Select regions' })).toBeVisible();
  await page.locator('label').filter({ hasText: 'United States and Canada' }).locator('span').click();
  await page.locator('label').filter({ hasText: 'United States and Canada' }).locator('div').nth(2).click();
  await page.locator('label').filter({ hasText: 'United States and Canada' }).locator('label div').click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('heading', { name: 'Do you have any of the' }).click();
  await expect(page.getByRole('heading', { name: 'Do you have any of the' })).toBeVisible();
  await page.locator('label').filter({ hasText: 'Trouble completing tasks' }).locator('span').click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('radio', { name: 'No', exact: true }).first().check();
  await page.getByRole('radio', { name: 'No', exact: true }).nth(1).check();
  await page.getByRole('radio', { name: 'No', exact: true }).nth(2).check();
  await page.getByRole('radio', { name: 'No', exact: true }).nth(3).check();
  await page.getByRole('radio', { name: 'Yes' }).nth(4).check();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('heading', { name: 'Have you ever had a diagnosed' })).toBeVisible();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByRole('heading', { name: 'Have you experienced periods' })).toBeVisible();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByRole('heading', { name: 'How long has the longest' })).toBeVisible();
  await page.getByRole('radio', { name: 'Between 4 and 6 days' }).check();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('heading', { name: 'How would you describe your' })).toBeVisible();
  await page.getByRole('radio', { name: 'Higher than normal; elevated' }).check();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('heading', { name: 'Do you tend to do bold or' })).toBeVisible();
  await page.getByRole('button', { name: 'Yes' }).click();


  // Wait for the time slots to load
  await expect(async () => {
    await page.waitForSelector('div[class*="_container_5we3n_1"]', { timeout: 500 });
    await expect(page.locator('div[class*="_container_5we3n_1"]').first()).toBeVisible();
  }).toPass();

  // Get the first available enabled time slot and click it
  const timeSlots = page.locator('div[class*="_container_5we3n_1"]');
  const count = await timeSlots.count();

  for (let i = 0; i < count; i++) {
    const timeSlot = timeSlots.nth(i);
    
    // Check multiple conditions for availability
    const isEnabled = await timeSlot.isEnabled();
    const isVisible = await timeSlot.isVisible();
    const hasNoDisabledClass = !(await timeSlot.getAttribute('class')).includes('disabled');
    
    if (isEnabled && isVisible && hasNoDisabledClass) {
      // Use waitFor to ensure the element is ready
      await timeSlot.waitFor({ state: 'visible', timeout: 2000 });
        
      // Use click with force option and retry
      await timeSlot.click({ force: true, trial: true });
      await timeSlot.click({ force: true });
      break; // Exit loop after first available slot is clicked
    }
  }

  await page.getByRole('radio', { name: 'No, continue paying private' }).check();
  await page.getByTestId('erroring-text').locator('span').first().click();
  await page.getByRole('button', { name: 'Schedule visit' }).click();

  // Wait for the "Go to appointments" button to load & then click it
  const goButton = page.getByRole('button', { name: 'Go to my appointments' });
  await expect(async () => {
    await goButton.waitFor({ timeout: 5000 });
    await expect(goButton).toBeVisible();
    await expect(goButton).toBeEnabled();
  }).toPass();

  // Wait for dashboard to load
  await expect(async () => {
    await page.waitForSelector('[data-testid="navigation"]', { timeout: 500 });
    await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
  }).toPass();

  // Logout
  await page.locator('span > .sc-bMTdWJ > .sc-hJRrWL > .sc-fwzISk').click();
  await page.getByRole('button', { name: 'LogOut Log out' }).click();
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
});