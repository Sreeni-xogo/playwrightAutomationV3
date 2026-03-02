import { test, expect } from '@playwright/test';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { isFree } from '../utils/tierGuard';

// AIDEV-NOTE: Requires authenticated session — setup saves .auth/state.json, consumed here
test.use({ storageState: '.auth/state.json' });

test.describe('Profile', () => {
  test('should display page heading and both sections', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await profilePage.verifyPageLoaded();
  });

  test('should display Settings sidebar navigation links', async ({ page }) => {
    // AIDEV-NOTE: Free tier — sidebar shows "Upgrade to Pro" instead of "Payment" nav link
    test.skip(isFree(), 'Settings sidebar differs on Free tier — Payment link replaced by Upgrade to Pro');
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
    // AIDEV-NOTE: PATTERN-006 — .or() causes strict mode violation when dialog+heading both visible; use dialog only
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('should open Change Password dialog on button click', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await profilePage.clickChangePassword();
    // AIDEV-NOTE: PATTERN-006 — .or() causes strict mode violation when dialog+heading both visible; use dialog only
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
