import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Smoke Test', () => {
    test('Patient - Login/Account Settings - SmokeTest', async ({ page }) => {
        //Verify Login Page
        await page.goto(process.env.BASE_URL);
        await expect(page.getByText('EnglishLoginWelcome back!Email*Next© 2002-2025 GlobalMed®. All Rights Reserved')).toBeVisible();
        await expect(page.getByRole('img', { name: 'welcome' })).toBeVisible();
        await page.getByRole('textbox', { name: 'Enter email' }).click();
        await page.getByRole('textbox', { name: 'Enter email' }).fill(process.env.PATIENT_USERNAME);
        await page.getByRole('button', { name: 'Next' }).click();

        //Verify Password Page
        await expect(page.getByText('Enter your password*Forgot PasswordLog In')).toBeVisible();
        await expect(page.getByRole('textbox', { name: 'Enter your password' })).toBeVisible();

        await page.getByRole('textbox', { name: 'Enter your password' }).click();
        await page.getByRole('textbox', { name: 'Enter your password' }).fill(process.env.PATIENT_PASSWORD);
        await page.getByRole('button', { name: 'Log In' }).click();
        
        //Verify Notifications Module 
        await expect(page.getByTestId('toast')).toBeVisible();
        await expect(page.getByTestId('navigation')).toBeVisible();
        await page.getByRole('link', { name: 'Bell' }).click();
        await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();
        await expect(page.getByTestId('card')).toBeVisible();
        await expect(page.getByText('No notifications received')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Eraser Clear all' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'XClose' })).toBeVisible();
        await page.getByRole('button', { name: 'XClose' }).click();

        //Verify Profile Icon Module
        await page.locator('div:nth-child(2) > .sc-fwzISk').click();
        await expect(page.getByRole('button', { name: 'SettingsGear Account settings' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'InfoCircle Help' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Policy Privacy policy' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'LogOut Log out' })).toBeVisible();

        //Verify Account Settings-My Account
        await page.getByRole('button', { name: 'SettingsGear Account settings' }).click();
        await expect(page.getByRole('heading', { name: 'Account settings' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'My account' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Notifications' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Download Upload photo' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Trash Delete photo' })).toBeVisible();
        await expect(page.getByText('Profile details')).toBeVisible();
        await expect(page.getByText('First name')).toBeVisible();
        await expect(page.getByText('Last name')).toBeVisible();
        await expect(page.getByText('DOB')).toBeVisible();
        await expect(page.getByText('Sex assigned at birth')).toBeVisible();
        await expect(page.getByText('Phone number')).toBeVisible();
        await expect(page.getByText('Country')).toBeVisible();
        await expect(page.getByText('State', { exact: true })).toBeVisible();
        await expect(page.getByText('City')).toBeVisible();
        await expect(page.getByText('Zip code')).toBeVisible();
        await expect(page.getByText('Address 1')).toBeVisible();
        await expect(page.getByText('Address 2')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Edit Edit' })).toBeVisible();
        await expect(page.getByText('Application language')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Change language' })).toBeVisible();
        await expect(page.getByText('Time zone', { exact: true })).toBeVisible();
        await expect(page.getByText('Account', { exact: true })).toBeVisible();
        await expect(page.getByText('Delete account')).toBeVisible();

        //Verify Account Settings-Notifications
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

        // Logout
        await page.locator('div:nth-child(2) > .sc-fwzISk').click();
        await page.getByRole('button', { name: 'LogOut Log out' }).click();
        await expect(page.getByText('EnglishLoginWelcome back!Email*Next© 2002-2025 GlobalMed®. All Rights Reserved')).toBeVisible();
    });

    test('Provider - Login/Account Settings - SmokeTest', async ({ page }) => {
        // Login Page
        await page.goto(process.env.BASE_URL);
        await expect(page.getByText('EnglishLoginWelcome back!Email*Next© 2002-2025 GlobalMed®. All Rights Reserved')).toBeVisible();
        await expect(page.getByRole('img', { name: 'welcome' })).toBeVisible();
        await page.getByRole('textbox', { name: 'Enter email' }).click();
        await page.getByRole('textbox', { name: 'Enter email' }).fill(process.env.PROVIDER_USERNAME);
        await page.getByRole('button', { name: 'Next' }).click();

        // Password Page
        await expect(page.getByText('Enter your password*Forgot PasswordLog In')).toBeVisible();
        await expect(page.getByRole('textbox', { name: 'Enter your password' })).toBeVisible();
        await page.getByRole('textbox', { name: 'Enter your password' }).click();
        await page.getByRole('textbox', { name: 'Enter your password' }).fill(process.env.PROVIDER_PASSWORD);
        await page.getByRole('button', { name: 'Log In' }).click();
        
        // Avalible toggle
        await expect(page.getByTestId('switch-div')).toBeVisible();
        await expect(page.getByText('Available')).toBeVisible();

        // Notifications Module - assuming similar to patient view
        await expect(page.getByTestId('toast')).toBeVisible();
        await expect(page.getByTestId('navigation')).toBeVisible();
        await page.getByRole('link', { name: 'Bell' }).click();
        await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();
        await expect(page.getByTestId('card')).toBeVisible();
        await expect(page.getByText('No notifications received')).toBeVisible(); 
        await expect(page.getByRole('link', { name: 'Eraser Clear all' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'XClose' })).toBeVisible();
        await page.getByRole('button', { name: 'XClose' }).click();

        // Profile Icon Module
        await page.locator('div:nth-child(2) > .sc-fwzISk').click();
        await expect(page.getByRole('button', { name: 'SettingsGear Account settings' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'InfoCircle Help' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Policy Privacy policy' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'LogOut Log out' })).toBeVisible();

        // Account Settings - My Account 
        await page.getByRole('button', { name: 'SettingsGear Account settings' }).click();
        await expect(page.getByRole('heading', { name: 'Account settings' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'My account' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Notifications' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Download Upload photo' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Trash Delete photo' })).toBeVisible();
        
        // Account Settings - My Account - Provider Profile details 
        await expect(page.getByText('Profile details')).toBeVisible();
        await expect(page.getByText('First name')).toBeVisible();
        await expect(page.getByText('Last name')).toBeVisible();
        await expect(page.getByText('Phone number')).toBeVisible();
        await expect(page.getByText('Country')).toBeVisible();
        await expect(page.getByText('State', { exact: true })).toBeVisible();
        await expect(page.getByText('Phone number')).toBeVisible();
        
        // Account Settings - My Account - Verify License to practice details
        await expect(page.getByText('License to practice')).toBeVisible(); 
        await expect(page.getByText('Application language')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Change language' })).toBeVisible();
        await expect(page.getByText('Account', { exact: true })).toBeVisible();
        await expect(page.getByText('Delete account')).toBeVisible();

        // Account Settings - Calendar
        await expect(page.getByRole('button', { name: 'Calendar' })).toBeVisible();
        await page.getByRole('button', { name: 'Calendar' }).click();
        await expect(page.getByRole('paragraph').filter({ hasText: 'Calendar' })).toBeVisible();
        await expect(page.getByText('Manage your time zone and')).toBeVisible();
        await expect(page.getByText('Time zone', { exact: true })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Change time zone' })).toBeVisible();
        await expect(page.getByText('Daily availability')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Edit Edit' })).toBeVisible();

        // Account Settings - Notifications
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
        
        // Logout
        await page.locator('div:nth-child(2) > .sc-fwzISk').click();
        await page.getByRole('button', { name: 'LogOut Log out' }).click();
        await expect(page.getByText('EnglishLoginWelcome back!Email*Next© 2002-2025 GlobalMed®. All Rights Reserved')).toBeVisible();
    });

    // smoketest admin 
    test('Admin - Login/Account Settings - SmokeTest', async ({ page }) => {
        // Login Page
        await page.goto(process.env.BASE_URL);
        await expect(page.getByText('EnglishLoginWelcome back!Email*Next© 2002-2025 GlobalMed®. All Rights Reserved')).toBeVisible();
        await expect(page.getByRole('img', { name: 'welcome' })).toBeVisible();
        await page.getByRole('textbox', { name: 'Enter email' }).click();
        await page.getByRole('textbox', { name: 'Enter email' }).fill(process.env.ADMIN_USERNAME);
        await page.getByRole('button', { name: 'Next' }).click();

        // Password Page
        await expect(page.getByText('Enter your password*Forgot PasswordLog In')).toBeVisible();
        await expect(page.getByRole('textbox', { name: 'Enter your password' })).toBeVisible();
        await page.getByRole('textbox', { name: 'Enter your password' }).click();
        await page.getByRole('textbox', { name: 'Enter your password' }).fill(process.env.ADMIN_PASSWORD);
        await page.getByRole('button', { name: 'Log In' }).click();

        // Verify Notifications Module
        await expect(page.getByTestId('toast')).toBeVisible();
        await expect(page.getByTestId('navigation')).toBeVisible();
        await page.getByRole('link', { name: 'Bell' }).click();
        await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();
        await expect(page.getByTestId('card')).toBeVisible();
        await expect(page.getByText('No notifications received')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Eraser Clear all' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'XClose' })).toBeVisible();
        await page.getByRole('button', { name: 'XClose' }).click();

        // Verify Profile Icon Module
        await page.locator('div:nth-child(2) > .sc-fwzISk').click();
        await expect(page.getByRole('button', { name: 'SettingsGear Account settings' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'InfoCircle Help' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Policy Privacy policy' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'LogOut Log out' })).toBeVisible();

        // Verify Account Settings - My Account
        await page.getByRole('button', { name: 'SettingsGear Account settings' }).click();
        await expect(page.getByRole('heading', { name: 'Account settings' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'My account' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Calendar' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Notifications' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Download Upload photo' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Trash Delete photo' })).toBeVisible();
        // My Account - Profile details
        await expect(page.getByText('Profile details')).toBeVisible();
        await expect(page.getByText('First name')).toBeVisible();
        await expect(page.getByText('Last name')).toBeVisible();
        await expect(page.locator('div').filter({ hasText: /^Profile detailsEdit$/ }).getByRole('button')).toBeVisible();
        await expect(page.getByText('License to practice')).toBeVisible();
        await expect(page.locator('div').filter({ hasText: /^License to practiceEdit$/ }).getByRole('button')).toBeVisible();
        await expect(page.getByText('Application language')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Change language' })).toBeVisible();
        await expect(page.getByText('Time zone', { exact: true })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Change time zone' })).toBeVisible();
        await expect(page.getByText('Account', { exact: true })).toBeVisible();
        await expect(page.getByText('Delete account')).toBeVisible();

        // Account Settings - Calendar
        await expect(page.getByRole('button', { name: 'Calendar' })).toBeVisible();
        await page.getByRole('button', { name: 'Calendar' }).click();
        await expect(page.getByRole('paragraph').filter({ hasText: 'Calendar' })).toBeVisible();
        await expect(page.getByText('Manage your time zone and')).toBeVisible();
        await expect(page.getByText('Time zone', { exact: true })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Change time zone' })).toBeVisible();
        await expect(page.getByText('Daily availability')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Edit Edit' })).toBeVisible();

        // Account Settings - Notifications
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
        
        // Logout
        await page.locator('div:nth-child(2) > .sc-fwzISk').click();
        await page.getByRole('button', { name: 'LogOut Log out' }).click();
        await expect(page.getByText('EnglishLoginWelcome back!Email*Next© 2002-2025 GlobalMed®. All Rights Reserved')).toBeVisible();
    });

    test('Coordinator - Login/Account Settings - SmokeTest', async ({ page }) => {
        // Login Page
        await page.goto(process.env.BASE_URL);
        await expect(page.getByText('EnglishLoginWelcome back!Email*Next© 2002-2025 GlobalMed®. All Rights Reserved')).toBeVisible();
        await expect(page.getByRole('img', { name: 'welcome' })).toBeVisible();
        await page.getByRole('textbox', { name: 'Enter email' }).click();
        await page.getByRole('textbox', { name: 'Enter email' }).fill(process.env.COORDINATOR_USERNAME);
        await page.getByRole('button', { name: 'Next' }).click();
        
        // Password Page
        await expect(page.getByText('Enter your password*Forgot PasswordLog In')).toBeVisible();
        await expect(page.getByRole('textbox', { name: 'Enter your password' })).toBeVisible();
        await page.getByRole('textbox', { name: 'Enter your password' }).click();
        await page.getByRole('textbox', { name: 'Enter your password' }).fill(process.env.COORDINATOR_PASSWORD);
        await page.getByRole('button', { name: 'Log In' }).click();

        // Verify Notifications Module
        await expect(page.getByTestId('toast')).toBeVisible();
        await expect(page.getByTestId('navigation')).toBeVisible();
        await page.getByRole('link', { name: 'Bell' }).click();
        await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();
        await expect(page.getByTestId('card')).toBeVisible();
        await expect(page.getByText('No notifications received')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Eraser Clear all' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'XClose' })).toBeVisible();
        await page.getByRole('button', { name: 'XClose' }).click();

        // Verify Profile Icon Module
        await page.locator('div:nth-child(2) > .sc-fwzISk').click();
        await expect(page.getByRole('button', { name: 'SettingsGear Account settings' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'InfoCircle Help' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Policy Privacy policy' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'LogOut Log out' })).toBeVisible();

        // Verify Account Settings - My Account
        await page.getByRole('button', { name: 'SettingsGear Account settings' }).click();
        await expect(page.getByRole('heading', { name: 'Account settings' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'My account' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Calendar' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Notifications' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Download Upload photo' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Trash Delete photo' })).toBeVisible();
        
        // My Account - Profile details
        await expect(page.getByText('Profile details')).toBeVisible();
        await expect(page.getByText('First name')).toBeVisible();
        await expect(page.getByText('Last name')).toBeVisible();
        await expect(page.getByText('Medical specialty')).toBeVisible();
        await expect(page.getByText('Languages spoken')).toBeVisible();
        await expect(page.getByText('Country')).toBeVisible();
        await expect(page.getByText('State', { exact: true })).toBeVisible();
        await expect(page.getByText('Phone number')).toBeVisible();

        // My Account - License to practice, Application Language, Account details
        await expect(page.getByText('License to practice')).toBeVisible();
        await expect(page.getByText('Application language')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Change language' })).toBeVisible();
        await expect(page.getByText('Account', { exact: true })).toBeVisible();
        await expect(page.getByText('Delete account')).toBeVisible();


        // Account Settings - Calendar
        await expect(page.getByRole('button', { name: 'Calendar' })).toBeVisible();
        await page.getByRole('button', { name: 'Calendar' }).click();
        await expect(page.getByRole('paragraph').filter({ hasText: 'Calendar' })).toBeVisible();
        await expect(page.getByText('Manage your time zone and')).toBeVisible();
        await expect(page.getByText('Time zone', { exact: true })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Change time zone' })).toBeVisible();
        await expect(page.getByText('Daily availability')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Edit Edit' })).toBeVisible();

        // Account Settings - Notifications
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
        
        // Logout
        await page.locator('div:nth-child(2) > .sc-fwzISk').click();
        await page.getByRole('button', { name: 'LogOut Log out' }).click();
        await expect(page.getByText('EnglishLoginWelcome back!Email*Next© 2002-2025 GlobalMed®. All Rights Reserved')).toBeVisible();
    });
});