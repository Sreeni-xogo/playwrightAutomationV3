import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: Members page at /en/members — manages team members, sent invites, and pending users.
// Three sections: Sent Invites table, Pending Users table, All Members table.
export class MembersPage extends BasePage {
  // Page header
  readonly pageHeading: Locator;
  readonly pageDescription: Locator;
  readonly addNewButton: Locator;

  // Sent Invites section
  readonly sentInvitesSectionHeading: Locator;
  readonly sentInvitesTable: Locator;

  // Pending Users section
  readonly pendingUsersSectionHeading: Locator;
  readonly pendingUsersTable: Locator;

  // All Members section
  readonly allMembersSectionHeading: Locator;
  readonly allMembersTable: Locator;

  // Invite dialog elements — only visible after clicking Add New
  readonly inviteDialogHeading: Locator;
  readonly inviteFirstNameInput: Locator;
  readonly inviteLastNameInput: Locator;
  readonly inviteEmailInput: Locator;
  readonly inviteTitleInput: Locator;
  readonly inviteUserButton: Locator;
  readonly inviteCancelButton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.getByRole('heading', { name: 'Members', level: 1 });
    this.pageDescription = page.getByText('Manage team members, review pending requests, and send invitations.');
    this.addNewButton = page.getByRole('button', { name: 'Add New' });

    this.sentInvitesSectionHeading = page.getByRole('heading', { name: 'Sent Invites', level: 2 });
    this.sentInvitesTable = page.getByRole('table').nth(0);

    this.pendingUsersSectionHeading = page.getByRole('heading', { name: 'Pending Users', level: 2 });
    this.pendingUsersTable = page.getByRole('table').nth(1);

    this.allMembersSectionHeading = page.getByRole('heading', { name: 'All Members', level: 2 });
    this.allMembersTable = page.getByRole('table').nth(2);

    // AIDEV-NOTE: Invite dialog is rendered as a modal dialog; only accessible after clicking Add New
    this.inviteDialogHeading = page.getByRole('heading', { name: 'Invite New User', level: 2 });
    this.inviteFirstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.inviteLastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.inviteEmailInput = page.getByRole('textbox', { name: 'Email' });
    this.inviteTitleInput = page.getByRole('textbox', { name: 'Title' });
    this.inviteUserButton = page.getByRole('button', { name: 'Invite User' });
    this.inviteCancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async goto(): Promise<void> {
    await this.navigate('/en/members');
    await this.waitForLoad();
  }

  async openInviteDialog(): Promise<void> {
    await this.addNewButton.click();
    await expect(this.inviteDialogHeading).toBeVisible();
  }

  async fillInviteForm(firstName: string, lastName: string, email: string, title: string): Promise<void> {
    await this.inviteFirstNameInput.fill(firstName);
    await this.inviteLastNameInput.fill(lastName);
    await this.inviteEmailInput.fill(email);
    await this.inviteTitleInput.fill(title);
  }

  async submitInvite(): Promise<void> {
    await this.inviteUserButton.click();
  }

  async cancelInvite(): Promise<void> {
    await this.inviteCancelButton.click();
  }

  // AIDEV-NOTE: Resend and Revoke buttons appear per row in the Sent Invites table
  async resendInviteForEmail(email: string): Promise<void> {
    const row = this.sentInvitesTable.getByRole('row').filter({ hasText: email });
    await row.getByRole('button', { name: 'Resend' }).click();
  }

  async revokeInviteForEmail(email: string): Promise<void> {
    const row = this.sentInvitesTable.getByRole('row').filter({ hasText: email });
    await row.getByRole('button', { name: 'Revoke' }).click();
  }

  async verifyPageLoaded(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.sentInvitesSectionHeading).toBeVisible();
    await expect(this.allMembersSectionHeading).toBeVisible();
  }

  async verifyMemberVisible(name: string): Promise<void> {
    await expect(this.allMembersTable.getByText(name)).toBeVisible();
  }

  async verifyInviteDialogVisible(): Promise<void> {
    await expect(this.inviteDialogHeading).toBeVisible();
  }

  async verifyInviteDialogClosed(): Promise<void> {
    await expect(this.inviteDialogHeading).not.toBeVisible();
  }
}
