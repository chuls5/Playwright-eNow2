import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Forgot Password Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(process.env.BASE_URL);
        await page.getByRole('textbox', { name: 'Enter email' }).fill(process.env.PATIENT_USERNAME);
        await page.getByRole('button', { name: 'Next' }).click();
    });

    test('Verify "Forgot Password" Link on Passord Page', async ({ page }) => {    
        const passwordLink = page.getByRole('link', { name: 'Forgot Password' });
        await expect(passwordLink).toBeVisible();
    });

    test('Verify "Back to Password Page" Link on Forgot Password Page', async ({ page }) => {  
        // Verify the visibility of "Back to Password Page" link
        const backToPasswordLink = page.getByRole('link', { name: 'Back to password page' });
        await expect(backToPasswordLink).toBeVisible();

        // Click on the "Back to Password Page" link
        await backToPasswordLink.click();
        await expect(page).toHaveURL(/.*\/sign-in/);
    });

    test('Verify the Submission Button on Forgot Password Page', async ({ page }) => {
        const passwordLink = page.getByRole('link', { name: 'Forgot Password' });
        await expect(passwordLink).toBeVisible();
        await passwordLink.click();

        // Verify the email displayed matches the username
        const emailDisplay = page.locator('span._text_dd5cl_13');
        await expect(emailDisplay).toHaveText(process.env.PATIENT_USERNAME);

        // Click on the 'Send email' button
        const sendEmailButton = page.getByRole('button', { name: 'Send email' });
        await expect(sendEmailButton).toBeEnabled(); // Ensure the button is clickable
        await sendEmailButton.click();

        // Verify navigation to password reset confirmation page
        await expect(page).toHaveURL(/.*\/password-reset-confirmation/);
        await expect(page.getByRole('heading', { name: 'Your reset password link was sent' })).toBeVisible();
    });

    test('Verify Resend Link on Forgot Password Page', async ({ page }) => {
        const passwordLink = page.getByRole('link', { name: 'Forgot Password' });
        await expect(passwordLink).toBeVisible();
        await passwordLink.click();

        // Click on the 'Send Email' button
        const sendEmailButton = page.getByRole('button', { name: 'Send email' });
        await sendEmailButton.click();

        // Verify the Screen Content
        await expect(page.getByRole('heading', { name: 'Your reset password link was' })).toBeVisible();
        const resendLink = page.getByRole('link', { name: 'Resend link' });
        await expect(resendLink).toBeVisible();
        await expect(resendLink).toBeEnabled();
        await resendLink.click();
    });

    test.skip('Verify the Verification Link in User email', async ({ page }) => {
        // Placeholder for future implementation
        test.skip(true, 'Email verification requires additional setup');
    });

    test('Verify redirect on "Forgot Password?" link click on Password Page', async ({ page }) => {
        const passwordLink = page.getByRole('link', { name: 'Forgot Password' });
        await expect(passwordLink).toBeVisible();
        await passwordLink.click();
        await expect(page).toHaveURL(/.*\/forgot-password/);
        await expect(page.getByRole('heading', { name: 'Forgot Password' })).toBeVisible();
    });

    test.skip('[Negative] Verify Creation of a New Password that matches old password', async ({ page }) => {
        // Placeholder for future implementation
        test.skip(true, 'Requires complex setup for password reset flow');
    });
});