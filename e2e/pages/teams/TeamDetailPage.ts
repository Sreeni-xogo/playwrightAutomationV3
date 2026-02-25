import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: Team detail page at /en/teams/:id — shows team name, Members tab and Player Groups tab.
// Members tab: Team Members table with columns Name, Email, Role, Actions (Edit/Delete buttons per row).
// Accessed via "Manage Team" link on the Teams list page.
export class TeamDetailPage extends BasePage {
  // Page header
  readonly goBackButton: Locator;
  readonly teamNameHeading: Locator;
  readonly editTeamButton: Locator;

  // Tabs
  readonly membersTab: Locator;
  readonly playerGroupsTab: Locator;
  readonly membersTabPanel: Locator;

  // Team Members table
  readonly teamMembersSectionHeading: Locator;
  readonly teamMembersTable: Locator;
  readonly nameColumnHeader: Locator;
  readonly emailColumnHeader: Locator;
  readonly roleColumnHeader: Locator;
  readonly actionsColumnHeader: Locator;

  constructor(page: Page) {
    super(page);

    this.goBackButton = page.getByRole('button', { name: 'Go back' });
    // AIDEV-NOTE: Team name is the h1 heading; it changes per team (e.g. "Backend", "QA-Team")
    this.teamNameHeading = page.getByRole('heading', { level: 1 });
    this.editTeamButton = page.getByRole('button', { name: 'Edit Team' });

    this.membersTab = page.getByRole('tab', { name: 'Members' });
    this.playerGroupsTab = page.getByRole('tab', { name: 'Player Groups' });
    this.membersTabPanel = page.getByRole('tabpanel', { name: 'Members' });

    this.teamMembersSectionHeading = page.getByRole('heading', { name: 'Team Members', level: 2 });
    this.teamMembersTable = page.getByRole('table');
    this.nameColumnHeader = page.getByRole('columnheader', { name: 'Name' });
    this.emailColumnHeader = page.getByRole('columnheader', { name: 'Email' });
    this.roleColumnHeader = page.getByRole('columnheader', { name: 'Role' });
    this.actionsColumnHeader = page.getByRole('columnheader', { name: 'Actions' });
  }

  async gotoById(teamId: number): Promise<void> {
    await this.navigate(`/en/teams/${teamId}`);
    await this.waitForLoadAndElement(this.teamNameHeading);
  }

  async goBack(): Promise<void> {
    await this.goBackButton.click();
    await this.waitForLoad();
  }

  async clickEditTeam(): Promise<void> {
    await this.editTeamButton.click();
  }

  async switchToPlayerGroups(): Promise<void> {
    await this.playerGroupsTab.click();
  }

  async switchToMembers(): Promise<void> {
    await this.membersTab.click();
  }

  // AIDEV-NOTE: Edit and Delete buttons appear in each member row under the Actions column
  async editMemberByEmail(email: string): Promise<void> {
    const row = this.teamMembersTable.getByRole('row').filter({ hasText: email });
    await row.getByRole('button', { name: 'Edit' }).click();
  }

  async deleteMemberByEmail(email: string): Promise<void> {
    const row = this.teamMembersTable.getByRole('row').filter({ hasText: email });
    await row.getByRole('button', { name: 'Delete' }).click();
  }

  async verifyPageLoaded(): Promise<void> {
    await expect(this.teamNameHeading).toBeVisible();
    await expect(this.membersTab).toBeVisible();
    await expect(this.playerGroupsTab).toBeVisible();
  }

  async verifyMemberVisible(name: string): Promise<void> {
    await expect(this.teamMembersTable.getByText(name)).toBeVisible();
  }

  async verifyMemberRole(email: string, role: string): Promise<void> {
    const row = this.teamMembersTable.getByRole('row').filter({ hasText: email });
    await expect(row.getByText(role)).toBeVisible();
  }

  async getTeamName(): Promise<string> {
    return this.teamNameHeading.innerText();
  }
}
