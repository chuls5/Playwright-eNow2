const { test, expect } = require('@playwright/test');
import dotenv from 'dotenv';

dotenv.config();

// Get environment variable to determine if running in CI
const isCI = process.env.CI === 'true';

const multiUserTest = test.extend({
  providerPage: async ({ browser }, use) => {
    const providerContext = await browser.newContext({
      permissions: ['camera', 'microphone'],
    });
    const providerPage = await providerContext.newPage();
    await use(providerPage);
    await providerContext.close();
  },

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
  await page.goto(process.env.BASE_URL, { timeout: 60000 });
  
  // Email step with retry logic
  await expect(async () => {
    const emailField = page.getByRole('textbox', { name: 'Enter email' });
    await emailField.waitFor({ state: 'visible', timeout: 10000 });
    await emailField.fill(process.env.SMOKE_PROVIDER_USERNAME);
    await page.getByRole('button', { name: 'Next' }).click();
  }).toPass({ timeout: 15000 });
  
  // Password step with retry logic
  await expect(async () => {
    const passwordField = page.getByRole('textbox', { name: 'Enter your password' });
    await passwordField.waitFor({ state: 'visible', timeout: 10000 });
    await passwordField.fill(process.env.SMOKE_PROVIDER_PASSWORD);
    await page.getByRole('button', { name: 'Log In' }).click();
  }).toPass({ timeout: 15000 });
  
  // Verify Dashboard Navigation
  await expect(async () => {
    await page.waitForSelector('[data-testid="navigation"]', { timeout: 500 });
    await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
  }).toPass({ timeout: 20000 });
}

async function loginAsPatient(page) {
  await page.goto(process.env.BASE_URL, { timeout: 60000 });
  
  // Email step with retry logic
  await expect(async () => {
    const emailField = page.getByRole('textbox', { name: 'Enter email' });
    await emailField.waitFor({ state: 'visible', timeout: 10000 });
    await emailField.fill(process.env.SMOKE_PATIENT_USERNAME);
    await page.getByRole('button', { name: 'Next' }).click();
  }).toPass({ timeout: 15000 });
  
  // Password step with retry logic
  await expect(async () => {
    const passwordField = page.getByRole('textbox', { name: 'Enter your password' });
    await passwordField.waitFor({ state: 'visible', timeout: 10000 });
    await passwordField.fill(process.env.SMOKE_PATIENT_PASSWORD);
    await page.getByRole('button', { name: 'Log In' }).click();
  }).toPass({ timeout: 15000 });
  
  // Verify Dashboard Navigation
  await expect(async () => {
    await page.waitForSelector('[data-testid="navigation"]', { timeout: 500 });
    await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
  }).toPass({ timeout: 20000 });
}

async function setProviderAvailable(page) {
  try {
    // Check current availability status with explicit wait
    const availabilityToggle = page.locator('.sc-fDeYYK.iTrYlt');
    await availabilityToggle.waitFor({ state: 'visible', timeout: 10000 });
    
    const isAvailable = await availabilityToggle.getAttribute('aria-checked') === 'true';
    
    // Toggle if not already available
    if (!isAvailable) {
      await availabilityToggle.click();
    }
  } catch (error) {
    console.error('Error setting provider availability:', error);
    throw error; // Re-throw for test to fail properly
  }
}

multiUserTest('Basic Smoke Test EN2 Workflow - Patient can see provider now', async ({ providerPage, patientPage }) => {
  // Set a reasonable timeout for CI environment
  test.setTimeout(isCI ? 180000 : 240000);

  // Get browser contexts from the pages
  const providerContext = providerPage.context();
  const patientContext = patientPage.context();
  
  // Enable WebSocket logging with environment variable control
  const enableWebSocketLogging = isCI ? process.env.DEBUG_WEBSOCKETS === 'true' : true;
  
  if (enableWebSocketLogging) {
    await providerPage.on('websocket', ws => {
      console.log(`Provider WebSocket opened: ${ws.url()}`);
      ws.on('close', () => console.log('Provider WebSocket closed'));
    });
    
    await patientPage.on('websocket', ws => {
      console.log(`Patient WebSocket opened: ${ws.url()}`);
      ws.on('close', () => console.log('Patient WebSocket closed'));
    });
  }
  
  try {
    // 1. Provider Login
    await loginAsProvider(providerPage);
    await setProviderAvailable(providerPage);
    console.log('Provider logged in and set as available');
    
    // 2. Patient Login and request care
    await loginAsPatient(patientPage);
    console.log('Patient logged in');
    
    // Navigate to dashboard and click "See a provider now"
    const seeProviderButton = patientPage.getByText('See a provider now');
    await seeProviderButton.waitFor({ state: 'visible', timeout: 10000 });
    await seeProviderButton.click();
    
    // Click continue with improved resilience
    await expect(async () => {
      // Wait for the continue button to be visible and stable
      const skipButton = patientPage.getByRole('button', { name: 'Skip' });
      await skipButton.waitFor({ state: 'visible', timeout: 10000 });
      await skipButton.click();
    }).toPass({ timeout: 15000 });
    
    // Continue with payment options
    const privatePaymentOption = patientPage.getByText('No, continue paying private');
    await privatePaymentOption.waitFor({ state: 'visible', timeout: 10000 });
    await privatePaymentOption.click();
    
    // Accept consent
    const consentCheckbox = patientPage.locator('.sc-kwFycn.bZoXji');
    await consentCheckbox.waitFor({ state: 'visible', timeout: 10000 });
    await consentCheckbox.click();
    
    // Wait for the button to be enabled before clicking
    const requestCareButton = patientPage.getByRole('button', { name: 'Request on demand care' });
    await expect(requestCareButton).toBeEnabled({ timeout: 15000 });
    
    // Now click the button when it's enabled
    await requestCareButton.click();
    console.log('Patient requested on-demand care');
    
    // Wait for the patient to be redirected to the confirmation page
    await patientPage.waitForURL('**/dashboard/see-provider-now-confirmed', { timeout: 30000 });
    console.log('Patient redirected to confirmation page');
    
    // Wait for the request to appear on provider's side
    await expect(providerPage.locator('[data-testid="modal"]')).toBeVisible({ timeout: 30000 });
    
    // 3. Provider accepts call
    console.log('Provider sees the call request');
    
    // Start listening for new pages on both contexts before clicking the buttons that open new tabs
    const providerPagePromise = providerContext.waitForEvent('page', { timeout: 30000 });
    const patientPagePromise = patientContext.waitForEvent('page', { timeout: 30000 });

    // Provider clicks "Accept"
    const acceptButton = providerPage.getByRole('button', { name: 'Accept' });
    await acceptButton.waitFor({ state: 'visible', timeout: 10000 });
    await acceptButton.click();
    console.log('Provider clicked Accept');

    // Wait for both new pages to be opened
    const providerCallPage = await providerPagePromise;
    const patientCallPage = await patientPagePromise;

    // Ensure both pages are fully loaded
    await providerCallPage.waitForLoadState('networkidle', { timeout: 30000 });
    await patientCallPage.waitForLoadState('networkidle', { timeout: 30000 });
    console.log('Both provider and patient call pages opened');
    
    // 4. Both join the video call
    // Provider clicks "Join Call"
    const providerJoinButton = providerCallPage.locator('.sc-frniUE.sbnRw');
    await providerJoinButton.waitFor({ state: 'visible', timeout: 15000 });
    await providerJoinButton.click();
    console.log('Provider joined the call');

    // Patient clicks "Join Call"
    const patientJoinButton = patientCallPage.locator('.sc-frniUE.sbnRw');
    await patientJoinButton.waitFor({ state: 'visible', timeout: 15000 });
    await patientJoinButton.click();
    console.log('Patient joined the call');
    
    // Wait for call controls to become visible to confirm call is connected
    await expect(providerCallPage.getByRole('button', { name: 'End call for all' }))
      .toBeVisible({ timeout: 20000 });
    console.log('Call connected for both provider and patient');

    // 5. Provider clicks 'end call for all'
    const endCallButton = providerCallPage.getByRole('button', { name: 'End call for all' });
    await endCallButton.click();
    console.log('Provider ended the call for all');

    // Verify patient is redirected to the dashboard
    await patientCallPage.waitForURL('**/dashboard', { timeout: 30000 });

    // Verify provider is redirected to the dashboard
    await providerCallPage.waitForURL('**/dashboard', { timeout: 30000 });
  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  }
});
