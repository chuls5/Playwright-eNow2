import { test, expect } from '@playwright/test';

test('Verify Schedule Session Screen Content on Clicking "Schedule Session" Button', async ({ page }) => {
  // Login steps using COORDINATOR credentials
  await page.goto(process.env.TEST_URL || 'https://portal.sandbox-encounterservices.com/sign-in');
  await page.getByRole('textbox', { name: 'Enter email' }).fill(process.env.COORDINATOR_EMAIL || 'coordinator@example.com');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill(process.env.COORDINATOR_PASSWORD || 'coordinator_password');
  await page.getByRole('button', { name: 'Log In' }).click();

  // Navigate to Schedule Session
  await expect(page.getByTestId('navigation')).toBeVisible();
  await expect(page.getByRole('button', { name: 'CalendarPlus Schedule session' })).toBeVisible();
  await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();

  // Verify Screen Sections
  const screenLocator = page.locator('#root');

  // Your Appointment Section
  await expect(screenLocator.getByRole('heading', { name: 'Your appointment', level: 5 })).toBeVisible();
  
  // Service Section
  await expect(screenLocator.getByText('Service')).toBeVisible();
  await expect(screenLocator.getByText('General Practice')).toBeVisible();
  await expect(screenLocator.getByRole('link', { name: /Change service/i })).toBeVisible();

  // Appointment Type Section
  await expect(screenLocator.getByText('Appointment type')).toBeVisible();
  await expect(screenLocator.getByText('Video')).toBeVisible();
  await expect(screenLocator.getByRole('link', { name: /Change type/i })).toBeVisible();

  // Duration Section
  await expect(screenLocator.getByText('Duration')).toBeVisible();
  await expect(screenLocator.getByText(/\d+ minutes/)).toBeVisible();
  await expect(screenLocator.getByRole('link', { name: /Change duration/i })).toBeVisible();

  // Provider Section
  await expect(screenLocator.getByText('Provider')).toBeVisible();
  await expect(screenLocator.getByText('Any available')).toBeVisible();
  await expect(screenLocator.getByRole('link', { name: /Change provider/i })).toBeVisible();

  // Patient Section
  await expect(screenLocator.getByText('Patient')).toBeVisible();
  await expect(screenLocator.getByText('-')).toBeVisible();
  await expect(screenLocator.getByRole('link', { name: /Change patient/i })).toBeVisible();

  // Select Date & Time Section
  await expect(screenLocator.getByRole('heading', { name: 'Select date & time', level: 5 })).toBeVisible();
  await expect(screenLocator.getByText(/Please choose a preferred time slot/)).toBeVisible();

  // Attachments Section
  await expect(screenLocator.getByRole('heading', { name: 'Attachments', level: 5 })).toBeVisible();
  await expect(screenLocator.getByText(/Upload any relevant documentation/)).toBeVisible();
  await expect(screenLocator.getByText('Upload files')).toBeVisible();
  await expect(screenLocator.getByRole('link', { name: /Choose files/i })).toBeVisible();

  // Buttons
  await expect(screenLocator.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await expect(screenLocator.getByRole('button', { name: 'Schedule visit' })).toBeVisible();

  // Support Section
  await expect(screenLocator.getByText(/Experiencing issues/)).toBeVisible();
  await expect(screenLocator.getByText(/We're sorry/)).toBeVisible();
  await expect(screenLocator.getByRole('link', { name: /support/i })).toBeVisible();
});