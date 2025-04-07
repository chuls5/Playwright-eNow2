import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use the Admins stored authentication state
test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin User Managment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/users-table');
    // Wait for main content to load
    await expect(async () => {
      await page.waitForSelector('[data-testid="navigation"]', { timeout: 500 });
      await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
    }).toPass();
    // 1. (Pre-conditions) Verify admin user is logged in
    await expect(page.locator('div').filter({ hasText: 'UsersInvite usersSearch by' }).nth(3)).toBeVisible();
  });

  test('Verify navigation to "Users" table', async ({ page }) => {
    // 2. Open "Users" tab from Admin panel
    await page.locator('a').filter({ hasText: 'Users' }).click();
    await expect(page.getByText('Search by name')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'John Doe' })).toBeVisible();
    await expect(page.getByText('Filter by role')).toBeVisible();
    await expect(page.getByTestId('dropdown-field')).toBeVisible();
    await expect(page.getByRole('button', { name: 'UserAdd Invite users' })).toBeVisible();
    await expect(page.locator('#root')).toContainText('Invite users');
    await expect(page.getByRole('row', { name: 'Greg PatA drmgreg+pat1@gmail.' }).getByTestId('switch-div')).toBeVisible();

    // 3. Verify the "Users" table columns 
    await expect(page.getByText('User Name')).toBeVisible();
    await expect(page.getByText('Email')).toBeVisible();
    await expect(page.getByText('Assigned Roles')).toBeVisible();
    await expect(page.getByText('Active?')).toBeVisible();
    await expect(page.getByText('Last updated')).toBeVisible();
  });

  test('Verify "Search" functionality on User Tab', async ({ page }) => {
    // 2: Search for a full username
    await page.getByRole('textbox', { name: 'John Doe' }).click();
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Hatsune Miku');
    const userCell = page.getByRole('cell', { name: 'UserBig Hatsune Miku' });
    await expect(userCell).toBeVisible();

    // 3. Enter a partial username
    await page.getByRole('textbox', { name: 'John Doe' }).click();
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Hatsune');
    await expect(page.getByRole('cell', { name: 'UserBig Hatsune Miku' })).toBeVisible();

    // 4. Enter an invalid username and click the search icon
    await page.getByRole('textbox', { name: 'John Doe' }).click();
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Hatsune-haters');
    await expect(page.getByRole('cell', { name: 'UserBig Hatsune Miku' })).not.toBeVisible();

  });

  test('Verify Role Filtering on User Tab', async ({ page }) => {
    // 2: Click filter dropdown and select a role
    await page.getByTestId('dropdown-field').click();
    await page.getByTestId('item Coordinator').click();
    await expect(page.locator('tbody')).toContainText('coordinator');

    await page.getByTestId('dropdown-field').click();
    await page.getByTestId('item Patient').click();
    await expect(page.locator('tbody')).toContainText('patient');

    await page.getByTestId('dropdown-field').click();
    await page.getByTestId('item Provider').click();
    await expect(page.locator('tbody')).toContainText('provider');

    await page.getByTestId('dropdown-field').click();
    await page.getByTestId('item Admin').click();
    await expect(page.locator('tbody')).toContainText('admin');

    await page.getByTestId('dropdown-field').click();
    await page.getByTestId('item All').click();
    await expect(page.getByText('Search by nameFilter by roleAllUser NameEmailAssigned RolesActive?Last')).toBeVisible();
    await page.getByTestId('dropdown-field').click();
    await page.getByTestId('dropdown-field').locator('div').nth(3).click();
  });

  test('Verify "Assigned Roles" management on User Tab', async ({ page }) => {
    // 2: Click the "Assigned Roles" link for the "Assigned Roles" column
    await page.getByRole('textbox', { name: 'John Doe' }).click();
    await page.getByRole('textbox', { name: 'John Doe' }).fill('co');
    await page.getByRole('row', { name: 'Cody Huls chuls+prov1@' }).getByRole('link').click();

    // 3. Add a new role to the user
    await page.getByRole('button', { name: 'Admin' }).click();
    await expect(page.getByTestId('toast').first()).toBeVisible();
    await page.getByRole('row', { name: 'Cody Huls chuls+prov1@' }).getByRole('link').click();
    await page.getByRole('button', { name: 'Coordinator' }).click();
    await expect(page.getByTestId('toast').first()).toBeVisible();

    // 4. Remove an existing role from the user
    await page.locator('div').filter({ hasText: /^admin$/ }).getByRole('button').click();
    await expect(page.getByTestId('toast').first()).toBeVisible();
    await page.getByRole('button', { name: 'XClose' }).nth(1).click();
    await expect(page.getByTestId('toast').first()).toBeVisible();
  });


  test('Verify Active toggle behavior on User Tab', async ({ page }) => {
    // 2: Locate a user in the table with active toggle "On"
    const toggleButtonOFF = page.getByRole('row', { name: 'Greg PatA drmgreg+pat1@gmail.' }).getByTestId('switch-div');
    await expect(toggleButtonOFF).toBeVisible();

    // 3. Toggle the "Active"? switch for a user from "On" to "Off"
    await toggleButtonOFF.click();
    await expect(page.getByTestId('toast').first()).toBeVisible();
    await expect(page.getByText('User is now inactive')).toBeVisible();

    // 4. Toggle the "Active"? switch for a user from "Off" to "On"
    const toggleButtonON = page.getByRole('row', { name: 'Greg PatA drmgreg+pat1@gmail.' }).getByTestId('switch-div');
    await expect(toggleButtonON).toBeVisible();
    await toggleButtonON.click();
    await expect(page.getByTestId('toast').first()).toBeVisible();
    await expect(page.getByText('User is now active')).toBeVisible();
  });

  test('Verify "Last Updated" column filtering on User Tab', async ({ page }) => {
    const lastupdatedButton = page.getByRole('button', { name: 'ChevronSelectorVertical' });
    await lastupdatedButton.click(); 
    await expect(page.getByRole('button', { name: 'ChevronDown' })).toBeVisible();

    const lastupdatedButton2 = page.getByRole('button', { name: 'ChevronDown' });
    await lastupdatedButton2.click();
    await expect(page.getByRole('button', { name: 'ChevronUp' })).toBeVisible();

    const lastupdatedButton3 = page.getByRole('button', { name: 'ChevronUp' });
    await lastupdatedButton3.click(); 
    await expect(page.getByRole('button', { name: 'ChevronSelectorVertical' })).toBeVisible();
  });

  test('Verify pagination in Users tab', async ({ page }) => {
    // 2. Navigate to the Users tab
    await page.locator('a').filter({ hasText: 'Users' }).click();

    // 4. Verify the pagination controls are visible
    await expect(page.getByRole('button', { name: 'ArrowNarrowLeft Previous' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next ArrowNarrowRight' })).toBeVisible();


    // 5. Click on the "Next" button in the pagination controls
    await page.getByRole('button', { name: 'Next ArrowNarrowRight' }).click();
    await expect(page.getByRole('button', { name: 'ArrowNarrowLeft Previous' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ArrowNarrowLeft Previous' })).toBeEnabled();

    // 6. Click on the "Previous" button in the pagination controls
    await page.getByRole('button', { name: 'ArrowNarrowLeft Previous' }).click();
    await expect(page.getByRole('button', { name: 'ArrowNarrowLeft Previous' })).not.toBeEnabled();
  });

  test('Verify Display of Invite User Form on User Tab', async ({ page }) => {
    // 2. Open "Users" tab from admin panel
    await page.locator('a').filter({ hasText: 'Users' }).click();

    // 3. Click "Invite Users" from Admin Panel 
    await page.getByRole('button', { name: 'UserAdd Invite users' }).click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Invite user')).toBeVisible();
    await expect(page.getByText('First name*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'John' })).toBeVisible();
    await expect(page.getByText('Last name*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Doe' })).toBeVisible();
    await expect(page.getByText('Email*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'example@mail.com' })).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Institution')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'GlobalMed' })).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Role')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Patient, Provider...' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send invite' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'XClose' })).toBeVisible();

    // Verify that the "Send invite" button is disabled by default
    const sendInviteButton = page.getByRole('button', { name: 'Send invite' });
    await expect(sendInviteButton).toBeVisible();
    await expect(sendInviteButton).toBeDisabled();

    // 3: Verify that all required fields have a red astrisk(*) next to them
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'First name*' }).locator('span')).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Last name*' }).locator('span')).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Email*' }).locator('span')).toBeVisible();
    const institutionAstrisk = page.getByTestId('modal').locator('div').filter({ hasText: 'Institution' }).nth(3);
    await expect(institutionAstrisk).toBeVisible();
    const roleAstrisk = page.getByTestId('modal').locator('div').filter({ hasText: 'Role' }).nth(3);
    await expect(roleAstrisk).toBeVisible();
  });

  test('Validate Entering First Name, Last Name, and Email on Invite User Modal', async ({ page }) => {
    // 2. Open "Users" tab from Admin panel
    await page.locator('a').filter({ hasText: 'Users' }).click();

    // 3. Click "Invite Users" from Admin Panel
    const sendInviteButton = page.getByRole('button', { name: 'Send invite' });
    await expect(sendInviteButton).toBeDisabled();

    await page.getByRole('button', { name: 'UserAdd Invite users' }).click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Invite user')).toBeVisible();
    await expect(page.getByText('First name*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'John' })).toBeVisible();
    await expect(page.getByText('Last name*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Doe' })).toBeVisible();
    await expect(page.getByText('Email*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'example@mail.com' })).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Institution')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'GlobalMed' })).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Role')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Patient, Provider...' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send invite' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'XClose' })).toBeVisible();

    // Verify that the "Send invite" button remains disabled until all required fields are filled
    await expect(sendInviteButton).toBeEnabled();

  });

  test('Verify Institution Dropdown Selection on Invite User Modal', async ({ page }) => {
    // 2. Open "Users" tab from Admin panel
    await page.locator('a').filter({ hasText: 'Users' }).click();

    // 3. Click "Invite Users" from Admin Panel 
    await page.getByRole('button', { name: 'UserAdd Invite users' }).click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Invite user')).toBeVisible();
    await expect(page.getByText('First name*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'John' })).toBeVisible();
    await expect(page.getByText('Last name*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Doe' })).toBeVisible();
    await expect(page.getByText('Email*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'example@mail.com' })).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Institution')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'GlobalMed' })).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Role')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Patient, Provider...' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send invite' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'XClose' })).toBeVisible();

    // 4. Click on the "Institution" dropdown
    await page.getByTestId('dropdown-field').nth(1).click();
    await expect(page.getByTestId('items-wrapper')).toBeVisible();

    // 5. Select an institution from the dropdown
    await page.getByTestId('items-wrapper').click();

    // Verify the 'Send invite' button state
    const sendInviteButton = page.getByRole('button', { name: 'Send invite' });
    await expect(sendInviteButton).toBeVisible();
    await expect(sendInviteButton).toBeEnabled();
    await expect(page.getByTestId('modal').getByText('GM Healthcare:')).toBeVisible();
  });

  test('Verify Role Dropdown Selection on Invite User Modal', async ({ page }) => {
    // 2. Open "Users" tab from Admin panel
    await page.locator('a').filter({ hasText: 'Users' }).click();

    // 3. Click "Invite Users" from Admin Panel 
    await page.getByRole('button', { name: 'UserAdd Invite users' }).click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Invite user')).toBeVisible();
    await expect(page.getByText('First name*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'John' })).toBeVisible();
    await expect(page.getByText('Last name*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Doe' })).toBeVisible();
    await expect(page.getByText('Email*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'example@mail.com' })).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Institution')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'GlobalMed' })).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Role')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Patient, Provider...' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send invite' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'XClose' })).toBeVisible();

    // 4. Click on the "Role" dropdown
    await page.getByTestId('dropdown-field').nth(2).click();
    await expect(page.getByTestId('items-wrapper')).toBeVisible();
    await expect(page.getByTestId('item Admin')).toContainText('Admin');
    await expect(page.getByTestId('item Coordinator')).toContainText('Coordinator');
    await expect(page.getByTestId('item Patient')).toContainText('Patient');
    await expect(page.getByTestId('item Provider')).toContainText('Provider');
    
    // 5. Select a role from the list
    await page.getByTestId('item Admin').click();
    await expect(page.locator('form')).toContainText('Admin');
    await page.locator('div').filter({ hasText: /^RoleAdmin$/ }).getByTestId('dropdown-field').click();
    await page.getByTestId('item Coordinator').click();
    await expect(page.locator('form')).toContainText('Coordinator');
    await page.locator('div').filter({ hasText: /^RoleCoordinator$/ }).getByTestId('dropdown-field').click();
    await page.getByTestId('item Provider').click();
    await expect(page.locator('form')).toContainText('Provider');
    await page.locator('div').filter({ hasText: /^RoleProvider$/ }).getByTestId('dropdown-field').click();
    await page.getByTestId('item Patient').click();
    await expect(page.locator('form')).toContainText('Patient');
  });

  test('Validate Clicking Cancel Button on Invite User Modal', async ({ page }) => {
    // 2. Open "Users" tab from Admin panel
    await page.locator('a').filter({ hasText: 'Users' }).click();

    // 3. Click "Invite Users" from Admin Panel 
    await page.getByRole('button', { name: 'UserAdd Invite users' }).click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Invite user')).toBeVisible();
    await expect(page.getByText('First name*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'John' })).toBeVisible();
    await expect(page.getByText('Last name*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Doe' })).toBeVisible();
    await expect(page.getByText('Email*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'example@mail.com' })).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Institution')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'GlobalMed' })).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Role')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Patient, Provider...' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send invite' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'XClose' })).toBeVisible();

    // 4. Enter a valid name
    await page.getByRole('textbox', { name: 'John' }).fill('first-name');
    await page.getByRole('textbox', { name: 'Doe' }).fill('last-name');

    // 5. Click on the cancel button
    await page.getByRole('button', { name: 'Cancel' }).click();

    // 6. Verify the modal is closed
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('Validate Successful Invite Submission on Invite User Modal', async ({ page }) => {
    // 2. Open "Users" tab from Admin panel
    await page.locator('a').filter({ hasText: 'Users' }).click();

    // 3. Click "Invite Users" from Admin Panel 
    await page.getByRole('button', { name: 'UserAdd Invite users' }).click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Invite user')).toBeVisible();
    await expect(page.getByText('First name*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'John' })).toBeVisible();
    await expect(page.getByText('Last name*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Doe' })).toBeVisible();
    await expect(page.getByText('Email*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'example@mail.com' })).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Institution')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'GlobalMed' })).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Role')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Patient, Provider...' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send invite' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'XClose' })).toBeVisible();

    // 4. Fill in fields with valid user information
    await page.getByRole('textbox', { name: 'John' }).click();
    await page.getByRole('textbox', { name: 'John' }).fill('John');

    await page.getByRole('textbox', { name: 'Doe' }).click();
    await page.getByRole('textbox', { name: 'Doe' }).fill('Doe');

    await page.getByRole('textbox', { name: 'example@mail.com' }).click();
    await page.getByRole('textbox', { name: 'example@mail.com' }).fill('john-doe@gmail.com');

    await page.getByTestId('dropdown-field').nth(1).click();
    const gmHealthcareElement = await page.getByTestId('items-wrapper').locator('div').filter({ hasText: /^GM Healthcare:/ }).first();
    await gmHealthcareElement.click();

    await page.getByRole('textbox', { name: 'Patient, Provider...' }).click();
    await page.getByTestId('item Patient').click();

    await page.getByRole('button', { name: 'Send invite' }).click();
    await expect(page.getByTestId('toast')).toBeVisible();
    await expect(page.getByTestId('toast')).toContainText('Invite is send');
  });

});