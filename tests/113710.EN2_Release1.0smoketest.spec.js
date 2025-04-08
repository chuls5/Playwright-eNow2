import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

// Common selectors used across tests
const selectors = {
  login: {
    emailInput: 'input[name="email"]',
    passwordInput: 'input[name="password"]',
    nextButton: 'button:has-text("Next")',
    loginButton: 'button:has-text("Log In")'
  },
  navigation: {
    notificationBell: 'a[aria-label="Bell"]',
    profileIcon: 'div:nth-child(2) > .sc-fwzISk',
    closeButton: 'button[aria-label="XClose"]'
  },
  accountSettings: {
    myAccountTab: 'button:has-text("My account")',
    calendarTab: 'button:has-text("Calendar")',
    notificationsTab: 'button:has-text("Notifications")',
    uploadPhotoButton: 'button:has-text("Upload photo")',
    deletePhotoButton: 'button:has-text("Delete photo")',
    backButton: '[data-testid="icon"]'
  },
  profileMenu: {
    accountSettingsButton: 'button:has-text("Account settings")',
    helpButton: 'button:has-text("Help")',
    privacyPolicyButton: 'button:has-text("Privacy policy")',
    logoutButton: 'button:has-text("Log out")'
  }
};

const expectedContent = {
  loginPage: 'EnglishLoginWelcome back!Email*Next© 2002-2025 GlobalMed®. All Rights Reserved',
  passwordPage: 'Enter your password*Forgot PasswordLog In',
  notifications: {
    header: 'Notifications',
    noNotifications: 'No notifications received',
    clearAll: 'Clear all'
  }
};

// Helper functions to reduce code duplication
async function login(page, username, password) {
  await page.goto(process.env.BASE_URL);
  await expect(page.getByText(expectedContent.loginPage)).toBeVisible();
  await expect(page.getByRole('img', { name: 'welcome' })).toBeVisible();
  
  await page.getByRole('textbox', { name: 'Enter email' }).fill(username);
  await page.getByRole('button', { name: 'Next' }).click();
  
  await expect(page.getByText(expectedContent.passwordPage)).toBeVisible();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill(password);
  await page.getByRole('button', { name: 'Log In' }).click();
  
  // Wait for navigation to complete
  await expect(page.getByTestId('toast')).toBeVisible();
  await expect(page.getByTestId('navigation')).toBeVisible();
}

async function checkNotifications(page) {
  await page.getByRole('link', { name: 'Bell' }).click();
  
  await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();
  await expect(page.getByTestId('card')).toBeVisible();
  await expect(page.getByText('No notifications received')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Eraser Clear all' })).toBeVisible();
  
  await page.getByRole('button', { name: 'XClose' }).click();
}

async function openProfileMenu(page) {
  await page.locator(selectors.navigation.profileIcon).click();
  
  // Verify menu items
  await expect(page.getByRole('button', { name: 'SettingsGear Account settings' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'InfoCircle Help' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Policy Privacy policy' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'LogOut Log out' })).toBeVisible();
}

async function checkAccountSettings(page, role) {
  await page.getByRole('button', { name: 'SettingsGear Account settings' }).click();
  await expect(page.getByRole('heading', { name: 'Account settings' })).toBeVisible();
  
  // Common elements for all roles
  await expect(page.getByRole('button', { name: 'My account' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Notifications' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Download Upload photo' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Trash Delete photo' })).toBeVisible();
  
  // Check profile details section
  await expect(page.getByText('Profile details')).toBeVisible();
  await expect(page.getByText('First name')).toBeVisible();
  await expect(page.getByText('Last name')).toBeVisible();
  
  // Role-specific checks
  if (role === 'patient') {
    await expect(page.getByText('DOB')).toBeVisible();
    await expect(page.getByText('Sex assigned at birth')).toBeVisible();
  } else {
    // Provider, Admin, Coordinator
    if (role !== 'patient') {
      await expect(page.getByRole('button', { name: 'Calendar' })).toBeVisible();
      await expect(page.getByText('License to practice')).toBeVisible();
    }
  }
  
  await expect(page.getByText('Application language')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Change language' })).toBeVisible();
  await expect(page.getByText('Account', { exact: true })).toBeVisible();
  await expect(page.getByText('Delete account')).toBeVisible();
}

async function checkNotificationsTab(page) {
  await page.getByRole('button', { name: 'Notifications' }).click();
  
  await expect(page.getByRole('paragraph').filter({ hasText: 'Notifications' })).toBeVisible();
  await expect(page.getByText('Manage your notification')).toBeVisible();
  await expect(page.getByText('Notification methods')).toBeVisible();
  await expect(page.getByText('Email')).toBeVisible();
  await expect(page.getByText('SMS')).toBeVisible();
  await expect(page.getByText('In-app')).toBeVisible();
  await expect(page.getByText('Session reminder')).toBeVisible();
  await expect(page.getByText('Set the time you\'d like to be')).toBeVisible();
  await expect(page.getByText('Remind me')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Change' })).toBeVisible();
  
  await page.getByTestId('icon').click();
}

async function checkCalendarTab(page) {
  await page.getByRole('button', { name: 'Calendar' }).click();
  
  await expect(page.getByRole('paragraph').filter({ hasText: 'Calendar' })).toBeVisible();
  await expect(page.getByText('Manage your time zone and')).toBeVisible();
  await expect(page.getByText('Time zone', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Change time zone' })).toBeVisible();
  await expect(page.getByText('Daily availability')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Edit Edit' })).toBeVisible();
}

async function logout(page) {
  await page.locator(selectors.navigation.profileIcon).click();
  await page.getByRole('button', { name: 'LogOut Log out' }).click();
  
  // Verify we're back at the login page
  await expect(page.getByText(expectedContent.loginPage)).toBeVisible();
}

// Test suite
test.describe('Smoke Tests', () => {
  test('Patient - Login/Account Settings', async ({ page }) => {
    await login(page, process.env.PATIENT_USERNAME, process.env.PATIENT_PASSWORD);
    await checkNotifications(page);
    await openProfileMenu(page);
    await checkAccountSettings(page, 'patient');
    await checkNotificationsTab(page);
    await logout(page);
  });

  test('Provider - Login/Account Settings', async ({ page }) => {
    await login(page, process.env.PROVIDER_USERNAME, process.env.PROVIDER_PASSWORD);
    
    // Provider-specific check - Available toggle
    await expect(page.getByTestId('switch-div')).toBeVisible();
    await expect(page.getByText('Available')).toBeVisible();
    
    await checkNotifications(page);
    await openProfileMenu(page);
    await checkAccountSettings(page, 'provider');
    await checkCalendarTab(page);
    await checkNotificationsTab(page);
    await logout(page);
  });

  test('Admin - Login/Account Settings', async ({ page }) => {
    await login(page, process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
    await checkNotifications(page);
    await openProfileMenu(page);
    await checkAccountSettings(page, 'admin');
    await checkCalendarTab(page);
    await checkNotificationsTab(page);
    await logout(page);
  });

  test('Coordinator - Login/Account Settings', async ({ page }) => {
    await login(page, process.env.COORDINATOR_USERNAME, process.env.COORDINATOR_PASSWORD);
    await checkNotifications(page);
    await openProfileMenu(page);
    await checkAccountSettings(page, 'coordinator');
    await checkCalendarTab(page);
    await checkNotificationsTab(page);
    await logout(page);
  });
});