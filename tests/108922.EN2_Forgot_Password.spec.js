import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

// Reusable helper functions
const navigateToPasswordPage = async (page) => {
    await page.goto(process.env.BASE_URL);
    await page.getByRole('textbox', { name: 'Enter email' }).fill(process.env.PATIENT_USERNAME);
    await page.getByRole('button', { name: 'Next' }).click();
};

const navigateToForgotPasswordPage = async (page) => {
    await navigateToPasswordPage(page);
    const passwordLink = page.getByRole('link', { name: 'Forgot Password' });
    await passwordLink.click();
    await expect(page).toHaveURL(/.*\/forgot-password/);
    await expect(page.getByRole('heading', { name: 'Forgot Password' })).toBeVisible();
};

test.describe('Forgot Password Functionality', () => {
    test('Verify "Forgot Password" Link Visibility and Redirection', async ({ page }) => {    
        // 1. Navigate to Password Page
        await navigateToPasswordPage(page);

        // 2. Verify visibility of "Forgot Password" link
        const passwordLink = page.getByRole('link', { name: 'Forgot Password' });
        await expect(passwordLink).toBeVisible();

        // 3. Click on the "Forgot Password" link
        await passwordLink.click();
        
        // 4. The user is redirected to the Forgot Password page
        await expect(page).toHaveURL(/.*\/forgot-password/);
        await expect(page.getByRole('heading', { name: 'Forgot Password' })).toBeVisible();
    });

    test('Verify "Back to Password Page" Link', async ({ page }) => {    
        // 1. Navigate to Forgot Password Page
        await navigateToForgotPasswordPage(page);

        // 2. Verify the visibility of "Back to Password Page" link
        const backToPasswordLink = page.getByRole('link', { name: 'Back to password page' });
        await expect(backToPasswordLink).toBeVisible();

        // 3. Click on the "Back to Password Page" link
        await backToPasswordLink.click();
        await expect(page).toHaveURL(/.*\/sign-in/);
    });

    test('Verify Send Email Submission on Forgot Password Page', async ({ page }) => {
        // 1. Navigate to Forgot Password Page
        await navigateToForgotPasswordPage(page);

        // 2. Check the email in the text box & verify it is non-editable
        const emailDisplay = page.locator('span._text_dd5cl_13');
        
        // Verify the email displayed matches the username
        await expect(emailDisplay).toHaveText(process.env.PATIENT_USERNAME);

        // 3. Click on the 'Send email' button
        const sendEmailButton = page.getByRole('button', { name: 'Send email' });
        await expect(sendEmailButton).toBeEnabled(); // Ensure the button is clickable
        await sendEmailButton.click();

        // 4. Verify navigation to password reset confirmation page
        await expect(page).toHaveURL(/.*\/password-reset-confirmation/);
        await expect(page.getByRole('heading', { name: 'Your reset password link was sent' })).toBeVisible();
    });

    test('Verify Resend Link Functionality', async ({ page }) => {
        // 1. Navigate to Forgot Password Page
        await navigateToForgotPasswordPage(page);

        // 2. Click on the 'Send Email' button
        const sendEmailButton = page.getByRole('button', { name: 'Send email' });
        await sendEmailButton.click();

        // 3. Verify the Screen Content
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

    test.skip('Verify Creation of a New Password that matches old password', async ({ page }) => {
        // Placeholder for future implementation
        test.skip(true, 'Requires complex setup for password reset flow');
    });
});