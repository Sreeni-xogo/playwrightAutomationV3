import { test, expect } from '@playwright/test';
import { ProfilePage } from '../pages/profile/ProfilePage';

test.describe('Profile', () => {
  test('should display page heading and both sections', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await profilePage.verifyPageLoaded();
  });

  test('should display Settings sidebar navigation links', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await expect(profilePage.settingsSidebarHeading).toBeVisible();
    await expect(profilePage.profileNavLink).toBeVisible();
    await expect(profilePage.membersNavLink).toBeVisible();
    await expect(profilePage.licensesNavLink).toBeVisible();
    await expect(profilePage.paymentNavLink).toBeVisible();
  });

  test('should display editable first name, last name, and title fields', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await expect(profilePage.firstNameInput).toBeVisible();
    await expect(profilePage.lastNameInput).toBeVisible();
    await expect(profilePage.titleInput).toBeVisible();
  });

  test('should display disabled email and password fields', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await profilePage.verifyEmailIsDisabled();
    await profilePage.verifyPasswordIsDisabled();
  });

  test('should display Change Email and Change Password buttons', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await expect(profilePage.changeEmailButton).toBeVisible();
    await expect(profilePage.changePasswordButton).toBeVisible();
  });

  test('should update first name and save successfully', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    // Get current value to restore after test
    const original = await profilePage.firstNameInput.inputValue();
    await profilePage.fillFirstName('TestFirst');
    await profilePage.saveProfile();
    // Verify value persists after reload
    await profilePage.goto();
    await profilePage.verifyFirstNameValue('TestFirst');
    // Restore original
    await profilePage.fillFirstName(original);
    await profilePage.saveProfile();
  });

  test('should open Change Email dialog on button click', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await profilePage.clickChangeEmail();
    await expect(page.getByRole('dialog').or(page.getByRole('heading', { name: 'Change Email' }))).toBeVisible();
  });

  test('should open Change Password dialog on button click', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await profilePage.clickChangePassword();
    await expect(page.getByRole('dialog').or(page.getByRole('heading', { name: 'Change Password' }))).toBeVisible();
  });
});
