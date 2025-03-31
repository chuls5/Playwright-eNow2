import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

const baseURL = process.env.BASE_URL ?? 'http://localhost:3000';

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
  
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],
  
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  
  projects: [
    // Authentication Setup Projects (always run first)
    {
      name: 'patient-setup',
      testMatch: /.*auth\.patient\.setup\.js$/i,
    },
    {
      name: 'provider-setup',
      testMatch: /.*auth\.provider\.setup\.js$/i,
    },
    {
      name: 'admin-setup',
      testMatch: /.*auth\.admin\.setup\.js$/i,
    },
    {
      name: 'coordinator-setup',
      testMatch: /.*auth\.coordinator\.setup\.js$/i,
    },
    
    // Patient Test Projects (Chromium, Safari, Edge)
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
        /111156\.EN2_Login\.spec\.js/
      ]
    },
    {
      name: 'patient-safari',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/patient.json',
      },
      dependencies: ['patient-setup'],
      testMatch: [
        // /108921\.EN2_Password\.spec\.js/,
        // /108922\.EN2_Forgot_Password\.spec\.js/,
        // /111156\.EN2_Login\.spec\.js/
      ]
    },
    {
      name: 'patient-edge',
      use: {
        ...devices['Desktop Edge'],
        storageState: 'playwright/.auth/patient.json',
      },
      dependencies: ['patient-setup'],
      testMatch: [
        // /108921\.EN2_Password\.spec\.js/,
        // /108922\.EN2_Forgot_Password\.spec\.js/,
        // /111156\.EN2_Login\.spec\.js/
      ]
    },

    // Provider Test Projects (Chromium, Safari, Edge)
    {
      name: 'provider-chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/provider.json',
      },
      dependencies: ['provider-setup'],
      testMatch: [
        // Add specific provider tests here if needed
      ]
    },
    {
      name: 'provider-safari',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/provider.json',
      },
      dependencies: ['provider-setup'],
      testMatch: [
        // Add specific provider tests here if needed
      ]
    },
    {
      name: 'provider-edge',
      use: {
        ...devices['Desktop Edge'],
        storageState: 'playwright/.auth/provider.json',
      },
      dependencies: ['provider-setup'],
      testMatch: [
        // Add specific provider tests here if needed
      ]
    },

    // Coordinator Test Projects (Chromium, Safari, Edge)
    {
      name: 'coordinator-chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/coordinator.json',
      },
      dependencies: ['coordinator-setup'],
      testMatch: [
        /109104\.EN2_Schedule_Appointment_Coordinator\.spec\.js/
      ],
    },
    {
      name: 'coordinator-safari',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/coordinator.json',
      },
      dependencies: ['coordinator-setup'],
      testMatch: [
        // /109104\.EN2_Schedule_Appointment_Coordinator\.spec\.js/
      ],
    },
    {
      name: 'coordinator-edge',
      use: {
        ...devices['Desktop Edge'],
        storageState: 'playwright/.auth/coordinator.json',
      },
      dependencies: ['coordinator-setup'],
      testMatch: [
        // /109104\.EN2_Schedule_Appointment_Coordinator\.spec\.js/
      ],
    },

    // Admin Test Projects (Chromium, Safari, Edge)
    {
      name: 'admin-chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json',
      },
      dependencies: ['admin-setup'],
      testMatch: [
        /111360\.EN2_Admin_User_Management\.spec\.js/,
        /111381\.EN2_Admin_Institution_Profile\.spec\.js/
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
        // /111360\.EN2_Admin_User_Management\.spec\.js/
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
        // /111360\.EN2_Admin_User_Management\.spec\.js/
      ],
    },
  ],
});