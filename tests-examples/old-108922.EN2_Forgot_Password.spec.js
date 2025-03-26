import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('Verify "Forgot Password" Link on Password Page', async ({ page }) => {    
    // 1. Navigate to Password Page
    await page.goto(process.env.BASE_URL);
    await page.getByRole('textbox', { name: 'Enter email' }).click();
    await page.getByRole('textbox', { name: 'Enter email' }).fill(process.env.PATIENT_USERNAME);
    await page.getByRole('button', { name: 'Next' }).click();

    // 2. Verify visibility of "Forgot Password" link
    const passwordLink = page.getByRole('link', { name: 'Forgot Password' });
    await expect(passwordLink).toBeVisible();

    // 3. Click on the "Forgot Password" link
    await passwordLink.click();
    
    // 4. The user is redirected to the Forgot Password page
    await expect(page).toHaveURL(/.*\/forgot-password/);
    await expect(page.getByRole('heading', { name: 'Forgot Password' })).toBeVisible();
});

test('Verify "Back to Password Page" Link on Password Page', async ({ page }) => {    
    // 1. Navigate to Forgot Password Page
    await page.goto(process.env.BASE_URL);
    await page.getByRole('textbox', { name: 'Enter email' }).click();
    await page.getByRole('textbox', { name: 'Enter email' }).fill(process.env.PATIENT_USERNAME);
    await page.getByRole('button', { name: 'Next' }).click();
    const passwordLink = page.getByRole('link', { name: 'Forgot Password' });
    await passwordLink.click();
    await expect(page).toHaveURL(/.*\/forgot-password/);
    await expect(page.getByRole('heading', { name: 'Forgot Password' })).toBeVisible();

    // 2. Verify the visibility of "Back to Password Page" link
    const backToPasswordLink = page.getByRole('link', { name: 'Back to password page' });
    await expect(backToPasswordLink).toBeVisible();

    // 3. Click on the "Back to Password Page" link
    await backToPasswordLink.click();
    await expect(page).toHaveURL(/.*\/sign-in/);
});

test('Verify the submission button on Forgot Password Page', async ({ page }) => {
    // 1. Navigate to Forgot Password Page
    await page.goto(process.env.BASE_URL);
    await page.getByRole('textbox', { name: 'Enter email' }).click();
    await page.getByRole('textbox', { name: 'Enter email' }).fill(process.env.PATIENT_USERNAME);
    await page.getByRole('button', { name: 'Next' }).click();
    const passwordLink = page.getByRole('link', { name: 'Forgot Password' });
    await passwordLink.click();
    await expect(page).toHaveURL(/.*\/forgot-password/);
    await expect(page.getByRole('heading', { name: 'Forgot Password' })).toBeVisible();

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

test('Verify the "Resend Link" on Forgot Password Page', async ({ page }) => {
    // 1. Navigate to Forgot Password Page
    await page.goto(process.env.BASE_URL);
    await page.getByRole('textbox', { name: 'Enter email' }).click();
    await page.getByRole('textbox', { name: 'Enter email' }).fill(process.env.PATIENT_USERNAME);
    await page.getByRole('button', { name: 'Next' }).click();
    const passwordLink = page.getByRole('link', { name: 'Forgot Password' });
    await passwordLink.click();
    await expect(page).toHaveURL(/.*\/forgot-password/);
    await expect(page.getByRole('heading', { name: 'Forgot Password' })).toBeVisible();

    // 2. Click on the 'Send Email' button
    const sendEmailButton = page.getByRole('button', { name: 'Send email' });
    await sendEmailButton.click();

    // 3. Verify the Screen Content
    await expect(page.getByRole('heading', { name: 'Your reset password link was' })).toBeVisible();
    await expect(page.getByText('Use the link that we emailed')).toBeVisible();
    await expect(page.getByText('Didn’t receive a link?')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Resend link' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Resend link' })).toBeEnabled();
    await page.getByRole('link', { name: 'Resend link' }).click();
});

test('Verify the Verification Link in User email', async ({ page }) => {
    // 1. Navigate to Forgot Password Page
    await page.goto(process.env.BASE_URL);
    await page.getByRole('textbox', { name: 'Enter email' }).click();
    await page.getByRole('textbox', { name: 'Enter email' }).fill(process.env.PATIENT_USERNAME);
    await page.getByRole('button', { name: 'Next' }).click();
    
    const passwordLink = page.getByRole('link', { name: 'Forgot Password' });
    await passwordLink.click();
    
    await expect(page).toHaveURL(/.*\/forgot-password/);
    await expect(page.getByRole('heading', { name: 'Forgot Password' })).toBeVisible();

    // send email
    const sendEmailButton = page.getByRole('button', { name: 'Send email' });
    await sendEmailButton.click();
    test.skip(true, 'Skipping due to complexity: ');

    // 2. Click on the verification Link in the Email
    // Here you would add the logic to check for the verification link in the email
    // For example, you might check if the email was sent successfully or if the link is present
    
    // await checkEmailForVerificationLink();
    // This is a placeholder for the actual implementation of the email verification logic
});

test('Verify redirect on "Forgot Password?" link on Password Page', async ({ page }) => {
    // 1. Navigate to Password Page
    await page.goto(process.env.BASE_URL);
    await page.getByRole('textbox', { name: 'Enter email' }).click();
    await page.getByRole('textbox', { name: 'Enter email' }).fill(process.env.PATIENT_USERNAME);
    await page.getByRole('button', { name: 'Next' }).click();

    // 2. Verify visibility of "Forgot Password" link
    const passwordLink = page.getByRole('link', { name: 'Forgot Password' });
    await expect(passwordLink).toBeVisible();

    // 3. Click on the "Forgot Password" link
    await passwordLink.click();
    
    // 4. The user is redirected to the Forgot Password page
    await expect(page).toHaveURL(/.*\/forgot-password/);
    await expect(page.getByRole('heading', { name: 'Forgot Password' })).toBeVisible();
});

test('[Negative] Verify Creation of a New Password that matches old password', async ({ page }) => {
    // 0. Navigate to the Forgot Password Page

    // 1. User is on the Create New Password screen, having clicked on the link in the email

    // 2. Enter the previously used password in the "New Password" text box

    // 3. Re-enter the same password in the "Confirm New Password" text box
    
    // 4. Click on the "Submit" button
    test.skip(true, 'Skipping due to complexity: ');
}
);