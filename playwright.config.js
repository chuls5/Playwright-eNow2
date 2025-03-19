// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

// Ensure BASE_URL is available
const baseURL = process.env.BASE_URL || 'http://localhost:3000';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],

  // Shared settings for all projects
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL,
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Capture screenshot after each test failure
    screenshot: 'only-on-failure',
    
    // Record video only when retrying a test for the first time
    video: 'on-first-retry',
  },

  // Configure projects for major browsers
  projects: [
    // Setup projects (authentication)
    {
      name: 'patient-setup',
      testMatch: /.*auth\.patient\.setup\.js/,
    },
    {
      name: 'provider-setup',
      testMatch: /.*auth\.provider\.setup\.js/,
    },

    // Main test projects - with authenticated state
    {
      name: 'patient-chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Use the authenticated state
        storageState: 'playwright/.auth/patient.json',
      },
      dependencies: ['patient-setup'],
    },
    {
      name: 'provider-chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Use the authenticated state
        storageState: 'playwright/.auth/provider.json',
      },
      dependencies: ['provider-setup'],
    },
  ],
});