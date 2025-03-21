// @ts-check
import { defineConfig, devices, expect } from '@playwright/test';
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
  timeout: 100000, 
  expect: {
    timeout: 100000, 
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1, // Ensure this line is correct
  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],

  // Shared settings for all projects
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'patient-setup',
      testMatch: /.*auth\.patient\.setup\.js/,
    },
    {
      name: 'provider-setup',
      testMatch: /.*auth\.provider\.setup\.js/,
    },

    {
      name: 'patient-chromium',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/patient.json',
      },
      dependencies: ['patient-setup'],
    },
    {
      name: 'provider-chromium',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/provider.json',
      },
      dependencies: ['provider-setup'],
    },
    {
      name: 'patient-safari',
      use: { 
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/patient.json',
      },
      dependencies: ['patient-setup'],
    },
    {
      name: 'patient-edge',
      use: { 
        ...devices['Desktop Edge'],
        storageState: 'playwright/.auth/patient.json',
      },
      dependencies: ['patient-setup'],
    },
  ],
});