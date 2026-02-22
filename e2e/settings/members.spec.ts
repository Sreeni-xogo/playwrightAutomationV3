import { test, expect } from '@playwright/test';
import { MembersPage } from '../pages/settings/MembersPage';

// AIDEV-NOTE: Test invite email — using a public disposable-style address for staging only
const INVITE_EMAIL = `xogo-test-invite-${Date.now()}@mailinator.com`;

test.describe('Members', () => {
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

  test('should send an invite and verify it appears in Sent Invites table', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();
    await membersPage.openInviteDialog();
    await membersPage.fillInviteForm('AutoTest', 'User', INVITE_EMAIL, 'Tester');
    await membersPage.submitInvite();
    // Dialog should close after sending
    await membersPage.verifyInviteDialogClosed();
    // Invited email should appear in the Sent Invites table
    await expect(membersPage.sentInvitesTable.getByText(INVITE_EMAIL)).toBeVisible({ timeout: 10000 });
  });

  test('should revoke the sent invite', async ({ page }) => {
    const membersPage = new MembersPage(page);
    await membersPage.goto();
    // Confirm the invite is still in the table then revoke it
    await expect(membersPage.sentInvitesTable.getByText(INVITE_EMAIL)).toBeVisible({ timeout: 5000 });
    await membersPage.revokeInviteForEmail(INVITE_EMAIL);
    await expect(membersPage.sentInvitesTable.getByText(INVITE_EMAIL)).not.toBeVisible({ timeout: 10000 });
  });
});
