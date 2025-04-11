// providers-patients-connection.spec.js
const { test, expect } = require('@playwright/test');
import dotenv from 'dotenv';

dotenv.config();

const multiUserTest = test.extend({
  // Create provider page
  providerPage: async ({ browser }, use) => {
    const providerContext = await browser.newContext({
        permissions: ['camera', 'microphone'],
        });
    const providerPage = await providerContext.newPage();
    await use(providerPage);
    await providerContext.close();
  },
  
  // Create patient page
  patientPage: async ({ browser }, use) => {
    const patientContext = await browser.newContext({
        permissions: ['camera', 'microphone'],
      });
    const patientPage = await patientContext.newPage();
    await use(patientPage);
    await patientContext.close();
  }
});

// Helper functions for common actions
async function loginAsProvider(page) {
  await page.goto(process.env.BASE_URL);
  
  // Email step
  const emailField = page.getByRole('textbox', { name: 'Enter email' });
  await emailField.fill(process.env.SMOKE_PROVIDER_USERNAME);
  await page.getByRole('button', { name: 'Next' }).click();
  
  // Password step
  const passwordField = page.getByRole('textbox', { name: 'Enter your password' });
  await passwordField.fill(process.env.SMOKE_PROVIDER_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  
  // Verify Dashboard Navigation
  await expect(async () => {
    await page.waitForSelector('[data-testid="navigation"]', { timeout: 5000 });
    await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
  }).toPass();
}

async function loginAsPatient(page) {
  await page.goto(process.env.BASE_URL);
  
  // Email step
  const emailField = page.getByRole('textbox', { name: 'Enter email' });
  await emailField.fill(process.env.SMOKE_PATIENT_USERNAME);
  await page.getByRole('button', { name: 'Next' }).click();
  
  // Password step
  const passwordField = page.getByRole('textbox', { name: 'Enter your password' });
  await passwordField.fill(process.env.SMOKE_PATIENT_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();
  
  // Verify Dashboard Navigation
  await expect(async () => {
    await page.waitForSelector('[data-testid="navigation"]', { timeout: 5000 });
    await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
  }).toPass();
}

async function setProviderAvailable(page) {
  // Check current availability status
  const availabilityToggle = page.locator('.sc-fDeYYK.iTrYlt', { name: 'Available' });
  const isAvailable = await availabilityToggle.isChecked();
  
  // Toggle if not already available
  if (!isAvailable) {
    await availabilityToggle.click();
    // Wait for the availability status to be updated in the backend
    await page.waitForTimeout(1000);
  }
}

multiUserTest('Basic Smoke Test EN2 Workflow - Patient can see provider now', async ({ providerPage, patientPage }) => {
  // Set a longer timeout for this test as it involves multiple steps
  test.setTimeout(240000);

  // Get browser contexts from the pages
  const providerContext = providerPage.context();
  const patientContext = patientPage.context();
  
  // Setup web socket listener for debugging (optional)
  await providerPage.on('websocket', ws => {
    console.log(`Provider WebSocket opened: ${ws.url()}`);
    ws.on('framesent', event => console.log('Provider sent: ' + event.payload));
    ws.on('framereceived', event => console.log('Provider received: ' + event.payload));
    ws.on('close', () => console.log('Provider WebSocket closed'));
  });
  
  await patientPage.on('websocket', ws => {
    console.log(`Patient WebSocket opened: ${ws.url()}`);
    ws.on('framesent', event => console.log('Patient sent: ' + event.payload));
    ws.on('framereceived', event => console.log('Patient received: ' + event.payload));
    ws.on('close', () => console.log('Patient WebSocket closed'));
  });
  
  // 1. Provider Login
  await loginAsProvider(providerPage);
  await setProviderAvailable(providerPage);
  console.log('Provider logged in and set as available');
  
  // 2. Patient Login and request care
  await loginAsPatient(patientPage);
  console.log('Patient logged in');
  
  // Navigate to dashboard and click "See a provider now"
  await patientPage.getByText('See a provider now').click();
  
  // Click continue with improved resilience
  await expect(async () => {
    // Wait for the continue button to be visible and stable
    const skipButton = patientPage.getByRole('button', { name: 'Skip' });
    await skipButton.waitFor({ state: 'visible', timeout: 10000 });
    await skipButton.click();
  }).toPass({ timeout: 15000 });
  
  // Change service
  // await patientPage.getByText('Change Service').click();
  // await patientPage.getByText('General Practice').click();
  // try {
  //   await patientPage.getByRole('button', { name: 'Save' }).click();
  //   console.log('Clicked Save button');
  // } catch (error) {
  //   console.log('Save button not found or not clickable, trying Cancel button');
  //   await patientPage.getByRole('button', { name: 'Cancel' }).click();
  // }
  
  // Continue with payment options
  await patientPage.getByText('No, continue paying private').click();
  
  // Accept consent
  await patientPage.locator('.sc-kwFycn.bZoXji').click();
  
  // Wait for the button to be enabled before clicking
  await expect(async () => {
      const button = patientPage.getByRole('button', { name: 'Request on demand care' });
      expect(await button.isDisabled()).toBeFalsy();
  }).toPass({ timeout: 10000 });
  
  // Now click the button when it's enabled
  await patientPage.getByRole('button', { name: 'Request on demand care' }).click();
  console.log('Patient requested on-demand care');
  
  // Wait for the patient to be redirected to the confirmation page
  await patientPage.waitForURL('https://portal.sandbox-encounterservices.com/dashboard/see-provider-now-confirmed', { timeout: 30000 });
  console.log('Patient redirected to confirmation page');
  
  // Wait for the request to appear on provider's side
  await providerPage.waitForSelector('[data-testid="modal"]', { timeout: 30000 });
  
  // 3. Provider accepts call
  console.log('Provider sees the call request');
  
  // Start listening for new pages on both contexts before clicking the buttons that open new tabs
  const providerPagePromise = providerContext.waitForEvent('page');
  const patientPagePromise = patientContext.waitForEvent('page');

  // Provider clicks "Accept"
  await providerPage.getByRole('button', { name: 'Accept' }).click();
  console.log('Provider clicked Accept');

  // Wait for both new pages to be opened
  const providerCallPage = await providerPagePromise;
  const patientCallPage = await patientPagePromise;

  // Ensure both pages are fully loaded
  await providerCallPage.waitForLoadState('networkidle');
  await patientCallPage.waitForLoadState('networkidle');
  console.log('Both provider and patient call pages opened');
  
  // 4. Both join the video call
  // Provider clicks "Join Call"
  await providerCallPage.locator('.sc-frniUE.sbnRw').click();
  console.log('Provider joined the call');

  // Patient clicks "Join Call"
  await patientCallPage.locator('.sc-frniUE.sbnRw').click();
  console.log('Patient joined the call');
  
  // Wait for the call to be established
  await providerCallPage.waitForTimeout(5000); // Adjust timeout as needed

  // 5. Provider clicks 'end call for all'
  await providerCallPage.getByRole('button', { name: 'End call for all' }).click();

  // Verify patient is redirected to the dashboard
  await patientCallPage.waitForURL('https://portal.sandbox-encounterservices.com/dashboard', { timeout: 30000 });

  // Verify provider is redirected to the dashboard
  await providerCallPage.waitForURL('https://portal.sandbox-encounterservices.com/dashboard', { timeout: 30000 });

  // Tear down the test
  await providerCallPage.close();
  await patientCallPage.close();
  await providerPage.close();
  await patientPage.close();
});