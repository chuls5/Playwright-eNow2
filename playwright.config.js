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
  // Maximum time one test can run for
  timeout: 30 * 1000,
  // Run tests in files in parallel
  fullyParallel: true,
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  // Retry tests on CI
  retries: process.env.CI ? 2 : 0,
  // Opt out of parallel tests on CI
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
      testMatch: /.*auth\.setup\.js/,
    },
    {
      name: 'provider-setup',
      testMatch: /.*auth\.setup\.js/,
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

    // Optional: Add mobile viewports if needed
    {
      name: 'patient-mobile',
      use: { 
        ...devices['iPhone 13'],
        storageState: 'playwright/.auth/patient.json',
      },
      dependencies: ['patient-setup'],
    },
    {
      name: 'provider-mobile',
      use: { 
        ...devices['iPhone 13'],
        storageState: 'playwright/.auth/provider.json',
      },
      dependencies: ['provider-setup'],
    },

    // Optional: Add unauthenticated test project for login flows
    {
      name: 'unauthenticated',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Directory where the test outputs should be stored
  outputDir: 'test-results/',

  // Web server to start before running tests (if needed)
  // webServer: {
  //   command: 'npm run start',
  //   url: baseURL,
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});