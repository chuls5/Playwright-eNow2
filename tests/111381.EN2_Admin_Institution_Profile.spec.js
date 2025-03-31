import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Institution Profile Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Institution settings
    await page.goto(`/institution-settings`);
  });

  test('Verify Institution Profile Details', async ({ page }) => {
    // Click on Profile button
    await page.getByRole('button', { name: 'Profile' }).click();
    
    // Wait for institution profile content to load
    await expect(page.getByText('Institution name')).toBeVisible();

    // Verify Institution Settings section
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - heading "Institution settings" [level=2]
      - text: Institution name
      - textbox "Example Name": GM Healthcare
      - text: Patient Registration Link
      - link "https://portal.sandbox-encounterservices.com/signup/INSOYP73J85JLR2KDGM1GPX"
      - button "Copy link"
      - text: Phone number
      - textbox /\\+\\d+-XX-XXXX-XXXX/
      - text: How would you like to receive notifications?
      - checkbox "Check SMS" [checked]
      - img "Check":
        - img
      - text: SMS
      - checkbox "Check Email" [checked]
      - img "Check":
        - img
      - text: Email
    `);

    // Verify Institution Address section
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - heading "Institution Address" [level=2]
      - text: Street
      - textbox "Street name example"
      - text: Apt, Suite, Etc
      - textbox "Apt, Suite, Etc"
      - text: ZIP code
      - textbox "XXXX": acf4
      - text: City
      - textbox "City example"
      - text: Country
      - paragraph: United States of America
      - img "ChevronDown":
        - img
      - text: State
      - paragraph: Arizona
      - img "ChevronDown":
        - img
    `);

    // Verify POC Details section
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - heading "POC Details" [level=2]
      - text: Name
      - textbox "John Doe": Emily Johnson
      - text: Title
      - textbox "Title example"
      - text: Phone number
      - textbox /\\+\\d+-XX-XXXX-XXXX/
      - text: Email
      - textbox "example@mail.com": emilyjwellnesscare.com
    `);

    // Verify POC Address section
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - heading "POC Address" [level=2]
      - text: Street
      - textbox "Street name example"
      - text: Apt, Suite, Etc
      - textbox "Apt, Suite, Etc"
      - text: ZIP code
      - textbox "XXXX"
      - text: City
      - textbox "City example"
      - text: Country
      - paragraph: Country
      - img "ChevronDown":
        - img
      - text: State
      - paragraph: State
      - img "ChevronDown":
        - img
    `);

    // Verify the presence of the 'Save changes' button
    const saveButton = page.getByRole('button', { name: 'Save changes' });
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeDisabled();
  });

  test('Verify Editing and Saving Institution Information on Profile tab', async ({ page }) => {
    // Click on Profile button
    await page.getByRole('button', { name: 'Profile' }).click();
    
    // Wait for institution profile content to load
    await expect(page.getByText('Institution name')).toBeVisible();

    // Edit Institution Name
    const institutionNameInput = page.getByRole('textbox', { name: 'Example Name' });
    const randomInstitutionName = `GM Healthcare: ${Math.floor(100 + Math.random() * 900)}`;
    await institutionNameInput.fill(randomInstitutionName);

    // Edit Phone Number
    const phoneNumberInput = page.getByRole('textbox', { name: '+381-XX-XXXX-XXXX' }).first();
    // Generate a random phone number in the format +1 (XXX)-XXX-XXXX
    const randomPhoneNumber = `+1 (${Math.floor(100 + Math.random() * 900)})-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;
    await phoneNumberInput.fill(randomPhoneNumber);

    // Toggle SMS
    const smsToggle = page.locator('label').filter({ hasText: 'SMS' }).locator('span').nth(1);
    await smsToggle.click();

    // Toggle Email
    const emailToggle = page.locator('div').filter({ hasText: /^SMSEmail$/ }).locator('span').nth(3);
    await emailToggle.click();

    // Verify save changes is enabled since changes were made
    const saveButton = page.getByRole('button', { name: 'Save changes' });
    await expect(saveButton).toBeEnabled();

    // Update the Institution Address fields
    const streetInput = page.locator('div').filter({ hasText: /^StreetApt, Suite, EtcZIP codeCityCountryUnited States of AmericaStateArizona$/ }).getByPlaceholder('Street name example');
    const randomStreetNumber = Math.floor(1000 + Math.random() * 9000);
    await streetInput.fill(`${randomStreetNumber} Mars Hill Rd.`);

    // Refine the locator for "Apt, Suite, Etc"
    const aptInput = page.locator('div').filter({ hasText: /^StreetApt, Suite, EtcZIP codeCityCountryUnited States of AmericaStateArizona$/ }).getByPlaceholder('Apt, Suite, Etc');
    const randomAptNumber = `Apt ${Math.floor(1 + Math.random() * 100)}`;
    await aptInput.fill(randomAptNumber);

    const zipInput = page.getByRole('textbox', { name: 'XXXX' }).nth(1);
    await zipInput.fill('85032');

    // Refine the locator for "City example"
    const cityInput = page.locator('div').filter({ hasText: /^StreetApt, Suite, EtcZIP codeCityCountryUnited States of AmericaStateArizona$/ }).getByPlaceholder('City example');
    await cityInput.fill('Phoenix');

    await page.locator('div').filter({ hasText: /^CountryUnited States of America$/ }).getByTestId('icon').click();
    await page.getByTestId('custom-dropdown-item-United States of America').click();

    await page.locator('div').filter({ hasText: /^StateArizona$/ }).getByTestId('icon').click();
    await page.getByTestId('custom-dropdown-item-Arizona').click();

    // Click on Save changes button
    await saveButton.click();

    // Wait for the success message to appear
    const successMessage = page.getByText('Info updated successfully');
    await expect(successMessage).toBeVisible();

    // Verfiy that the updated information is displayed
    await expect(institutionNameInput).toHaveValue(randomInstitutionName);
    await expect(phoneNumberInput).toHaveValue(randomPhoneNumber);
    await page.locator('label').filter({ hasText: 'SMS' }).locator('label span').click();
    await page.locator('div').filter({ hasText: /^SMSEmail$/ }).locator('span').nth(3).click();
    await expect(streetInput).toHaveValue(`${randomStreetNumber} Mars Hill Rd.`);
    await expect(aptInput).toHaveValue(randomAptNumber);
    await expect(zipInput).toHaveValue('85032');
    await expect(cityInput).toHaveValue('Phoenix');
    await expect(page.getByText('United States of America')).toBeVisible();
    await expect(page.getByText('Arizona')).toBeVisible();
    await saveButton.click();

  });

  test('Verify Notification Preferences Functionality on Institution Settings Screen', async ({ page }) => {
    // Click on Profile button
    await page.getByRole('button', { name: 'Profile' }).click();
    
    // Wait for institution profile content to load
    await expect(page.getByText('Institution name')).toBeVisible();

    // Toggle SMS
    const smsToggle = page.locator('label').filter({ hasText: 'SMS' }).locator('span').nth(1);
    await smsToggle.click();

    // Toggle Email
    const emailToggle = page.locator('div').filter({ hasText: /^SMSEmail$/ }).locator('span').nth(3);
    await emailToggle.click();

    // Save changes
    const saveButton = page.getByRole('button', { name: 'Save changes' });
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    // Wait for the success message to appear
    const successMessage = page.getByText('Info updated successfully');
    await expect(successMessage).toBeVisible();

    // Toggle SMS again
    await smsToggle.click();

    // Toggle Email again
    await emailToggle.click();
    
    // Save changes again
    await expect(saveButton).toBeEnabled();
    await saveButton.click();
  });

  test('Verify Editing and Saving POC (Point of Contact) Details on Profile tab', async ({ page }) => {
    // Click on Profile button
    await page.getByRole('button', { name: 'Profile' }).click();

    // Wait for institution profile content to load
    await expect(page.getByText('Institution name')).toBeVisible();

    // Update the Name field
    const pocNameInput = page.getByRole('textbox', { name: 'John Doe' });
    const randomPocName = `Emily Johnson: ${Math.floor(100 + Math.random() * 900)}`;
    await pocNameInput.fill(randomPocName);

    // Update the Title field
    const pocTitleInput = page.getByRole('textbox', { name: 'Title example' });
    const randomPocTitle = `Coordinator: ${Math.floor(100 + Math.random() * 900)}`;
    await pocTitleInput.fill(randomPocTitle);

    // Update the Phone Number field
    const pocPhoneNumberInput = page.locator('div').filter({ hasText: /^NameTitlePhone numberEmail$/ }).getByPlaceholder('+381-XX-XXXX-XXXX');
    const randomPocPhoneNumber = `+1 (${Math.floor(100 + Math.random() * 900)})-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;
    await pocPhoneNumberInput.fill(randomPocPhoneNumber);

    // Update the Email field
    const pocEmailInput = page.getByRole('textbox', { name: 'example@mail.com' });
    const randomPocEmail = `emily${Math.floor(100 + Math.random() * 900)}johnson@gmail.com`;
    await pocEmailInput.fill(randomPocEmail);

    // Click on Save changes button
    const saveButton = page.getByRole('button', { name: 'Save changes' });
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    // Wait for the success message to appear
    const successMessage = page.getByText('Info updated successfully');
    await expect(successMessage).toBeVisible();

    // Verify that the updated information is displayed
    await expect(pocNameInput).toHaveValue(randomPocName);
    await expect(pocTitleInput).toHaveValue(randomPocTitle);
    await expect(pocPhoneNumberInput).toHaveValue(randomPocPhoneNumber);
    await expect(pocEmailInput).toHaveValue(randomPocEmail);
    await saveButton.toBeDisabled();
  });

  test('Verify Save Changes Button is Disabled When No Changes are Made', async ({ page }) => {
    // Click on Profile button
    await page.getByRole('button', { name: 'Profile' }).click();
    
    // Wait for institution profile content to load
    await expect(page.getByText('Institution name')).toBeVisible();

    // Verify save changes is disabled since no changes were made
    const saveButton = page.getByRole('button', { name: 'Save changes' });
    await expect(saveButton).toBeDisabled();
  });

  test('Verify Navigating Away Discards Unsaved Changes', async ({ page }) => {
    // Click on Profile button
    await page.getByRole('button', { name: 'Profile' }).click();
    
    // Wait for institution profile content to load
    await expect(page.getByText('Institution name')).toBeVisible();

    // Capture Institution Name before editing
    const institutionName = await page.getByRole('textbox', { name: 'Example Name' }).inputValue();

    // Edit Institution Name
    const institutionNameInput = page.getByRole('textbox', { name: 'Example Name' });
    const randomInstitutionName = `GM Healthcare: ${Math.floor(100 + Math.random() * 900)}`;
    await institutionNameInput.fill(randomInstitutionName);

    // Click on another tab
    await page.locator('a').filter({ hasText: 'Users' }).click();

    // Confirm discard changes if a confirmation dialog appears
    const discardDialog = page.locator('text=Discard changes?');
    if (await discardDialog.isVisible()) {
      await page.getByRole('button', { name: 'Discard' }).click();
    }

    // Navigate back to Institution settings
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();

    // Wait for institution profile content to load
    await expect(page.getByText('Institution name')).toBeVisible();
    
    // Verify that the Institution Name is unchanged
    const updatedInstitutionName = await page.getByRole('textbox', { name: 'Example Name' }).inputValue();
    await expect(updatedInstitutionName).toBe(institutionName);
  });

});