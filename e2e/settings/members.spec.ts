import { test, expect } from '@playwright/test';
import { MembersPage } from '../pages/settings/MembersPage';

// AIDEV-NOTE: Requires authenticated session — setup saves .auth/state.json, consumed here
test.use({ storageState: '.auth/state.json' });

// AIDEV-NOTE: Test invite email — using a public disposable-style address for staging only
const INVITE_EMAIL = `xogo-test-invite-${Date.now()}@mailinator.com`;

// AIDEV-NOTE: send invite and revoke invite tests depend on each other — must run serially
test.describe.serial('Members', () => {
  test('should display page heading and sections', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();
    await membersPage.verifyPageLoaded();
  });

  test('should display Add New button', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();
    await expect(membersPage.addNewButton).toBeVisible();
  });

  test('should display Sent Invites, Pending Users, and All Members tables', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();
    await expect(membersPage.sentInvitesSectionHeading).toBeVisible();
    await expect(membersPage.pendingUsersSectionHeading).toBeVisible();
    await expect(membersPage.allMembersSectionHeading).toBeVisible();
    await expect(membersPage.allMembersTable).toBeVisible();
  });

  test('should open invite dialog when Add New is clicked', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();
    await membersPage.openInviteDialog();
    await membersPage.verifyInviteDialogVisible();
    await expect(membersPage.inviteFirstNameInput).toBeVisible();
    await expect(membersPage.inviteLastNameInput).toBeVisible();
    await expect(membersPage.inviteEmailInput).toBeVisible();
    await expect(membersPage.inviteTitleInput).toBeVisible();
    await expect(membersPage.inviteUserButton).toBeVisible();
    await expect(membersPage.inviteCancelButton).toBeVisible();
  });

  test('should close invite dialog when Cancel is clicked', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();
    await membersPage.openInviteDialog();
    await membersPage.cancelInvite();
    await membersPage.verifyInviteDialogClosed();
  });

  // AIDEV-NOTE: Send + revoke combined in one test — avoids fresh page reload between steps.
  // After a reload, the table loads from API oldest-first + paginated, pushing the new invite
  // to a later page. Live DOM update after send always shows the invite without a reload.
  test('should send an invite, verify it appears, then revoke it', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();
    await membersPage.openInviteDialog();
    await membersPage.fillInviteForm('AutoTest', 'User', INVITE_EMAIL, 'Tester');
    await membersPage.submitInvite();
    // Dialog should close after sending
    await membersPage.verifyInviteDialogClosed();
    // Invite appears immediately via live DOM update (no reload — avoids pagination issue)
    await expect(membersPage.sentInvitesTable.getByText(INVITE_EMAIL)).toBeVisible({ timeout: 10000 });
    // Revoke in the same page context while invite is still visible
    await membersPage.revokeInviteForEmail(INVITE_EMAIL);
    await expect(membersPage.sentInvitesTable.getByText(INVITE_EMAIL)).not.toBeVisible({ timeout: 10000 });
  });
});
