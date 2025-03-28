import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.locator('body').click();
  await page.goto('https://portal.sandbox-encounterservices.com/sign-in');
  await page.getByRole('textbox', { name: 'Enter email' }).click();
  await page.getByRole('textbox', { name: 'Enter email' }).fill('cody.harrison.huls@gmail.com');

  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('Password1Password1!');
  await page.getByRole('textbox', { name: 'Enter your password' }).press('Enter');
  await page.getByRole('button', { name: 'Log In' }).click();
  await expect(page.getByTestId('navigation')).toBeVisible();

  await expect(page.getByRole('button', { name: 'CalendarPlus Schedule session' })).toBeVisible();
  await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();
  await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - text: Schedule a session
    - heading "Your appointment" [level=5]
    - img
    - paragraph: Service
    - paragraph: ~"General Practice"
    - link ~"Change service"
    - img
    - paragraph: Appointment type
    - paragraph: ~"Video"
    - link ~"Change type"
    - img
    - paragraph: Duration
    - paragraph: /\\d+ minutes/
    - link ~"Change duration"
    - img
    - paragraph: Provider
    - paragraph: ~"Any available"
    - link ~"Change provider"
    - img
    - paragraph: Patient
    - paragraph: "-"
    - link ~"Change patient"
    - heading "Select date & time" [level=5]
    - paragraph: ~"Please choose a preferred time slot"
    - dialog "Choose Date":
      - link
      - button
      - text: /Mo.*Su/
      - listbox /Month .*, \d+/:
        - option /Choose .*, \d+/
      - text: /\d+:\d+ [AP]M/
    - heading "Attachments" [level=5]
    - paragraph: ~"Upload any relevant documentation"
    - img
    - paragraph: ~"Upload files"
    - link ~"Choose files"
    - button: "Cancel"
    - button: "Schedule visit"
    - paragraph: ~"Experiencing issues"
    - paragraph: ~"We're sorry"
    - link ~"support"
  `);
  
});
