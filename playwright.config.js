import { defineConfig, devices, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 1,
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
      name: 'admin-setup', // New project for admin setup
      testMatch: /.*auth\.admin\.setup\.js/, // Match your admin setup file
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
      name: 'admin-chromium', // New project for admin role
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json', // Specify the storage state for admin
      },
      dependencies: ['admin-setup'], // Ensure admin setup runs before this
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