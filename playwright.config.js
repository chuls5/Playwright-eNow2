import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

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
    // Authentication Setup Projects
    {
      name: 'patient-setup',
      testMatch: /.*auth\.patient\.setup\.js/,
    },
    {
      name: 'provider-setup',
      testMatch: /.*auth\.provider\.setup\.js/,
    },
    {
      name: 'admin-setup',
      testMatch: /.*auth\.admin\.setup\.js/,
    },
    {
      name: 'coordinator-setup',
      testMatch: /.*auth\.coordinator\.setup\.js/,
    },
    
    // Patient Test Projects
    {
      name: 'patient-chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/patient.json',
      },
      dependencies: ['patient-setup'],
      testMatch: [
        /108921\.EN2_Password\.spec\.js/,
        /108922\.EN2_Forgot_Password\.spec\.js/,
        /109075\.EN2_Patient_DashBoard\.spec\.js/,
        /111156\.EN2_Login\.spec\.js/
      ],
    },
    {
      name: 'patient-safari',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/patient.json',
      },
      dependencies: ['patient-setup'],
      testMatch: [
        /108921\.EN2_Password\.spec\.js/,
        /108922\.EN2_Forgot_Password\.spec\.js/,
        /109075\.EN2_Patient_DashBoard\.spec\.js/,
        /111156\.EN2_Login\.spec\.js/
      ],
    },
    {
      name: 'patient-edge',
      use: {
        ...devices['Desktop Edge'],
        storageState: 'playwright/.auth/patient.json',
      },
      dependencies: ['patient-setup'],
      testMatch: [
        /108921\.EN2_Password\.spec\.js/,
        /108922\.EN2_Forgot_Password\.spec\.js/,
        /109075\.EN2_Patient_DashBoard\.spec\.js/,
        /111156\.EN2_Login\.spec\.js/
      ],
    },
    
    // Admin Test Projects
    {
      name: 'admin-chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json',
      },
      dependencies: ['admin-setup'],
      testMatch: [
        /111360\.EN2_Admin_User_Management\.spec\.js/
      ],
    },
    {
      name: 'admin-safari',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/admin.json',
      },
      dependencies: ['admin-setup'],
      testMatch: [
        /111360\.EN2_Admin_User_Management\.spec\.js/
      ],
    },
    {
      name: 'admin-edge',
      use: {
        ...devices['Desktop Edge'],
        storageState: 'playwright/.auth/admin.json',
      },
      dependencies: ['admin-setup'],
      testMatch: [
        /111360\.EN2_Admin_User_Management\.spec\.js/
      ],
    },
  ],
});