import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://portal.sandbox-encounterservices.com/sign-in');
  await page.getByRole('textbox', { name: 'Enter email' }).click();
  await page.getByRole('textbox', { name: 'Enter email' }).fill(process.env.PATIENT_USERNAME);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill(process.env.PATIENT_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.goto('https://portal.sandbox-encounterservices.com/dashboard');
  await page.waitForSelector('[data-testid="navigation"]', { timeout: 60000 });
  await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Upcoming appointments' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Past appointments' })).toBeVisible();
  await page.getByText('Schedule an appointment').click();
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
  await expect(page.getByRole('heading', { name: 'Consult a doctor' })).toBeVisible();
  await page.getByRole('link', { name: 'Change provider' }).click();

  // Select the FIRST Provider in the list and click on it
  // ...
  // TODO

  // Make javascript function that selects the time slot
  // 1. Wait for the time slots to be visible
  // 2. Select the first available time slot
  // 3. Click on the time slot
  // 4. Click on the "No, continue paying private" radio button
  // 5. Click on the "Schedule visit" button
  // 6. Go to the confirmation page
  // 7. Click on the "Go to my appointments" button

  // From Anthropic~

  // More general time selection based on content rather than classes
  console.log('Looking for available time slots by text content...');
  const timeTexts = ["10:15 AM", "10:30 AM", "10:45 AM", "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM", 
                    "12:00 PM", "12:15 PM", "12:30 PM", "12:45 PM"];

  let timeSelected = false;
  let selectedTimeText = '';

  // First wait for any time to be visible
  await page.waitForFunction(() => {
    return document.body.innerText.includes('AM') || document.body.innerText.includes('PM');
  }, { timeout: 60000 });

  console.log('Time indicators detected on page, proceeding with selection...');

  // Try to find and select a time
  for (const timeText of timeTexts) {
    if (timeSelected) break;
    
    try {
      // Try with exact text match first
      const timeLocator = page.getByText(timeText, { exact: true });
      const isVisible = await timeLocator.isVisible({ timeout: 1000 }).catch(() => false);
      
      if (isVisible) {
        console.log(`Found time slot: ${timeText}`);
        await timeLocator.click();
        timeSelected = true;
        selectedTimeText = timeText;
        console.log(`Selected time: ${timeText}`);
      }
    } catch (error) {
      console.log(`Time ${timeText} not accessible, trying next...`);
      continue;
    }
  }

  if (!timeSelected) {
    console.log('No specific time found, trying to click any visible time...');
    try {
      // Try to click any element containing AM or PM
      const anyTimeLocator = page.locator('div:has-text("AM"), div:has-text("PM")').first();
      await anyTimeLocator.click();
      selectedTimeText = await anyTimeLocator.textContent() || "Unknown time";
      timeSelected = true;
      console.log(`Selected generic time: ${selectedTimeText}`);
    } catch (e) {
      await page.screenshot({ path: 'time-selection-failed.png' });
      throw new Error('Failed to select any time slot');
    }
  }






  await page.getByRole('radio', { name: 'No, continue paying private' }).check();
  await page.getByTestId('erroring-text').locator('span').first().click();
  await page.getByRole('button', { name: 'Schedule visit' }).click();
  await page.goto('https://portal.sandbox-encounterservices.com/dashboard/schedule-appointment-confirmed');
  await expect(page.locator('div').filter({ hasText: /^Appointment confirmed$/ })).toBeVisible();
  await page.getByRole('button', { name: 'Go to my appointments' }).click();
  await page.locator('span > .sc-bMTdWJ > .sc-hJRrWL > .sc-fwzISk').click();
  await page.getByRole('button', { name: 'LogOut Log out' }).click();
  await page.getByRole('textbox', { name: 'Enter email' }).click();
  await page.getByRole('textbox', { name: 'Enter email' }).fill('chuls+pat1@globalmed.com');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('Password1Password1!');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.goto('https://portal.sandbox-encounterservices.com/dashboard');
  await expect(page.locator('div').filter({ hasText: /^MAR2812:00 PM - 12:15 PMGeneral PracticeCody Huls \(Psychiatrist\)$/ }).nth(1)).toBeVisible();
  await page.locator('span > .sc-bMTdWJ > .sc-hJRrWL > .sc-fwzISk').click();
  await page.getByRole('button', { name: 'LogOut Log out' }).click();
});