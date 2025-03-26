import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Helper functions for common actions
const navigateToUsersTab = async (page) => {
  await page.goto('/users-table');
  // Wait for navigation and main content to load
  await expect(async () => {
    await page.waitForSelector('[data-testid="navigation"]', { timeout: 500 });
    await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
  }).toPass();
  
  await page.locator('a').filter({ hasText: 'Users' }).click();
};

const openInviteUserModal = async (page) => {
  await page.getByRole('button', { name: 'UserAdd Invite users' }).click();
  await expect(page.getByTestId('modal')).toBeVisible();
  await expect(page.getByTestId('modal').getByText('Invite user')).toBeVisible();
};

const verifyInviteUserModalElements = async (page) => {
  const expectedElements = [
    { selector: page.getByText('First name*'), name: 'First Name Label' },
    { selector: page.getByRole('textbox', { name: 'John' }), name: 'First Name Input' },
    { selector: page.getByText('Last name*'), name: 'Last Name Label' },
    { selector: page.getByRole('textbox', { name: 'Doe' }), name: 'Last Name Input' },
    { selector: page.getByText('Email*'), name: 'Email Label' },
    { selector: page.getByRole('textbox', { name: 'example@mail.com' }), name: 'Email Input' },
    { selector: page.getByTestId('modal').getByText('Institution'), name: 'Institution Label' },
    { selector: page.getByRole('textbox', { name: 'GlobalMed' }), name: 'Institution Input' },
    { selector: page.getByTestId('modal').getByText('Role'), name: 'Role Label' },
    { selector: page.getByRole('textbox', { name: 'Patient, Provider...' }), name: 'Role Input' },
    { selector: page.getByRole('button', { name: 'Cancel' }), name: 'Cancel Button' },
    { selector: page.getByRole('button', { name: 'Send invite' }), name: 'Send Invite Button' },
    { selector: page.getByRole('button', { name: 'XClose' }), name: 'Close Button' }
  ];

  for (const element of expectedElements) {
    await expect(element.selector, `${element.name} should be visible`).toBeVisible();
  }
};

// Use the Patients stored authentication state
test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin User Management', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToUsersTab(page);
  });

  test('Verify navigation to "Users" table', async ({ page }) => {
    // 1. (Pre-conditions) Verify admin user is logged in
    await expect(page.locator('div').filter({ hasText: 'UsersInvite usersSearch by' }).nth(3)).toBeVisible();

    // 2. Open "Users" tab from Admin panel
    const expectedTableColumns = [
      'User Name', 'Email', 'Assigned Roles', 'Active?', 'Last updated'
    ];

    for (const column of expectedTableColumns) {
      await expect(page.getByText(column)).toBeVisible();
    }

    // 3. Verify the "Users" table columns and elements
    await expect(page.getByRole('row', { name: 'Greg PatA drmgreg+pat1@gmail.' }).getByTestId('switch-div')).toBeVisible();
    await expect(page.getByRole('button', { name: 'UserAdd Invite users' })).toBeVisible();
  });

  test('Verify "Search" functionality on User Tab', async ({ page }) => {
    // 1. (Pre-conditions) Verify admin user is logged in
    await expect(page.locator('div').filter({ hasText: 'UsersInvite usersSearch by' }).nth(3)).toBeVisible();

    const searchInput = page.getByRole('textbox', { name: 'John Doe' });
    const expectedUsers = [
      { name: 'Hatsune Miku', full: true },
      { name: 'Hatsune', partial: true },
      { name: 'Hatsune-haters', nonexistent: true }
    ];

    for (const user of expectedUsers) {
      await searchInput.click();
      await searchInput.fill(user.name);

      if (user.full) {
        await expect(page.getByRole('cell', { name: 'UserBig Hatsune Miku' })).toBeVisible();
      } else if (user.partial) {
        await expect(page.getByRole('cell', { name: 'UserBig Hatsune Miku' })).toBeVisible();
      } else if (user.nonexistent) {
        await expect(page.getByRole('cell', { name: 'UserBig Hatsune Miku' })).not.toBeVisible();
      }
    }
  });

  test('Verify Role Filtering on User Tab', async ({ page }) => {
    // 1. (Pre-conditions) Verify admin user is logged in
    await expect(page.locator('div').filter({ hasText: 'UsersInvite usersSearch by' }).nth(3)).toBeVisible();

    const roles = ['Coordinator', 'Patient', 'Provider', 'Admin', 'All'];
    const roleDropdown = page.getByTestId('dropdown-field');

    for (const role of roles) {
      await roleDropdown.click();
      await page.getByTestId(`item ${role}`).click();

      if (role !== 'All') {
        await expect(page.locator('tbody')).toContainText(role.toLowerCase());
      } else {
        await expect(page.getByText('Search by nameFilter by roleAllUser NameEmailAssigned RolesActive?Last')).toBeVisible();
      }
    }
  });

  test('Verify "Assigned Roles" management on User Tab', async ({ page }) => {
    // 1. (Pre-conditions) Verify admin user is logged in
    await expect(page.locator('div').filter({ hasText: 'UsersInvite usersSearch by' }).nth(3)).toBeVisible();
  
    // 2: Click the "Assigned Roles" link for the "Assigned Roles" column
    await page.getByRole('textbox', { name: 'John Doe' }).click();
    await page.getByRole('textbox', { name: 'John Doe' }).fill('co');
    const userRow = page.getByRole('row', { name: 'Cody Huls chuls+prov1@' });
    await userRow.getByRole('link').click();
  
    // 3. Add a new role to the user
    const rolesToAdd = ['Admin'];
    for (const role of rolesToAdd) {
      await page.getByRole('button', { name: role }).click();
      await expect(page.getByTestId('toast').first()).toContainText('Role is added');
    }
  
    // 4. Remove an existing role from the user
    await page.locator('div').filter({ hasText: /^admin$/ }).getByRole('button').click();
    await expect(page.getByTestId('toast').first()).toContainText('Role is removed');
  });

  test('Verify Active toggle behavior on User Tab', async ({ page }) => {
    // 1. (Pre-conditions) Verify admin user is logged in
    await expect(page.locator('div').filter({ hasText: 'UsersInvite usersSearch by' }).nth(3)).toBeVisible();

    // 2: Locate a user in the table with active toggle
    const userRow = page.getByRole('row', { name: 'Greg PatA drmgreg+pat1@gmail.' });
    const toggleButton = userRow.getByTestId('switch-div');
    await expect(toggleButton).toBeVisible();

    // 3. Toggle the "Active"? switch
    const toggleStates = [
      { expectedText: 'User is now inactive', name: 'Off' },
      { expectedText: 'User is now active', name: 'On' }
    ];

    for (const state of toggleStates) {
      await toggleButton.click();
      await expect(page.getByTestId('toast').first()).toBeVisible();
      await expect(page.getByText(state.expectedText)).toBeVisible();
    }
  });

  test('Verify "Last Updated" column filtering on User Tab', async ({ page }) => {
    // 1. (Pre-conditions) Verify admin user is logged in
    await expect(page.locator('div').filter({ hasText: 'UsersInvite usersSearch by' }).nth(3)).toBeVisible();

    const lastUpdatedColumn = page.getByText('Last updated');
    const sortStates = [
      { clickCount: 1, expectedButton: 'ChevronDown' },
      { clickCount: 2, expectedButton: 'ChevronUp' },
      { clickCount: 3, expectedButton: 'ChevronSelectorVertical' }
    ];

    for (const state of sortStates) {
      await lastUpdatedColumn.click();
      await expect(page.getByRole('button', { name: state.expectedButton })).toBeVisible();
    }
  });

  test('Verify pagination in Users tab', async ({ page }) => {
    // 1. (Pre-conditions) Verify admin user is logged in
    await expect(page.locator('div').filter({ hasText: 'UsersInvite usersSearch by' }).nth(3)).toBeVisible();

    // 2. Scroll to the bottom of the user list
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByTestId('pagination')).toMatchAriaSnapshot(`
      - button "ArrowNarrowLeft Previous":
        - img "ArrowNarrowLeft":
          - img
      - text: 1 2 3 4 5
      - button "Next ArrowNarrowRight":
        - img "ArrowNarrowRight":
          - img
      `);

    // 3. Click on the "Next" button in the pagination controls
    await page.getByRole('button', { name: 'Next ArrowNarrowRight' }).click();
    await expect(page.getByRole('button', { name: 'ArrowNarrowLeft Previous' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ArrowNarrowLeft Previous' })).toBeEnabled();

    // 4. Click on the "Previous" button in the pagination controls
    await page.getByRole('button', { name: 'ArrowNarrowLeft Previous' }).click();
    await expect(page.getByRole('button', { name: 'ArrowNarrowLeft Previous' })).not.toBeEnabled();
  });

  test('Verify Display of Invite User Form on User Tab', async ({ page }) => {
    await openInviteUserModal(page);
    await verifyInviteUserModalElements(page);

    // Verify that the "Send invite" button is disabled by default
    const sendInviteButton = page.getByRole('button', { name: 'Send invite' });
    await expect(sendInviteButton).toBeDisabled();

    // Verify that all required fields have a red asterisk
    const requiredFields = [
      'First name', 'Last name', 'Email', 'Institution', 'Role'
    ];

    for (const field of requiredFields) {
      const asteriskLocator = field === 'Institution' || field === 'Role'
        ? page.getByTestId('modal').locator('div').filter({ hasText: field }).nth(3)
        : page.locator('label').filter({ hasText: `${field}*` }).locator('span');
      await expect(asteriskLocator).toBeVisible();
    }
  });

  test('Validate Entering First Name, Last Name, and Email on Invite User Modal', async ({ page }) => {
    // 1. (Pre-conditions) Verify admin user is logged in
    await expect(page.locator('div').filter({ hasText: 'UsersInvite usersSearch by' }).nth(3)).toBeVisible();

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

      // Verify that the "Send invite" button is disabled by default
    const sendInviteButton = page.getByRole('button', { name: 'Send invite' });
    // await expect(sendInviteButton).toBeVisible();
    // if (await sendInviteButton.isEnabled()) {
    //   test.skip('Send invite button is enabled, skipping test.');
    // }
    await expect(sendInviteButton).toBeDisabled();

    // 4. Enter a valid first name, last name
    // ... TODO: Add test steps here

  });

  test('Verify Institution Dropdown Selection on Invite User Modal', async ({ page }) => {
    // 1. (Pre-conditions) Verify admin user is logged in
    await expect(page.locator('div').filter({ hasText: 'UsersInvite usersSearch by' }).nth(3)).toBeVisible();

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
    await page.getByTestId('item GM Healthcare').click();

    // 6. Attempt to select a second institution
    test.skip('Skipping test as multiple institutions do not exist in the dropdown.');

    // 7. Verify the "Send Invite" button state
  });

  test('Verify Role Dropdown Selection on Invite User Modal', async ({ page }) => {
    // 1. (Pre-conditions) Verify admin user is logged in
    await expect(page.locator('div').filter({ hasText: 'UsersInvite usersSearch by' }).nth(3)).toBeVisible();

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
    await openInviteUserModal(page);

    // 4. Enter a valid name
    await page.getByRole('textbox', { name: 'John' }).fill('first-name');
    await page.getByRole('textbox', { name: 'Doe' }).fill('last-name');

    // 5. Click on the cancel button
    await page.getByRole('button', { name: 'Cancel' }).click();

    // 6. Verify the modal is closed
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('Validate Successful Invite Submission on Invite User Modal', async ({ page }) => {
    await openInviteUserModal(page);

    // 4. Fill in fields with valid user information
    await page.getByRole('textbox', { name: 'John' }).click();
    await page.getByRole('textbox', { name: 'John' }).fill('John');

    await page.getByRole('textbox', { name: 'Doe' }).click();
    await page.getByRole('textbox', { name: 'Doe' }).fill('Doe');

    await page.getByRole('textbox', { name: 'example@mail.com' }).click();
    await page.getByRole('textbox', { name: 'example@mail.com' }).fill('john-doe@gmail.com');

    await page.getByTestId('dropdown-field').nth(1).click();
    await page.getByTestId('item GM Healthcare').click();

    await page.getByRole('textbox', { name: 'Patient, Provider...' }).click();
    await page.getByTestId('item Patient').click();

    await page.getByRole('button', { name: 'Send invite' }).click();
    await expect(page.getByTestId('toast')).toBeVisible();
    await expect(page.getByTestId('toast')).toContainText('Invite is send');
  });

  test('Validate error messages on Invite User Modal', async ({ page }) => {
    await openInviteUserModal(page);

    // Leave the form fields empty and click send invite
    const sendInviteButton = page.getByRole('button', { name: 'Send invite' });

    if (await sendInviteButton.isEnabled()) {
      await sendInviteButton.click();
      await expect(page.locator('form')).toContainText('First name is required');
      await expect(page.locator('form')).toContainText('Last name is required');
      await expect(page.locator('form')).toContainText('Email is required');
      await expect(page.locator('form')).toContainText('Select an institution');
      await expect(page.locator('form')).toContainText('Select a role');
    } else {
        test.skip('Send invite button is disabled, skipping test.');
    }
  });
});