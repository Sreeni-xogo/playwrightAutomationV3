import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: Teams page at /en/teams — lists company teams with My Teams / All Teams tabs.
// "Add New" dropdown has three options: Team, User, Player Group.
// Each team card shows team name and a "Manage Team" link to /en/teams/:id
export class TeamsPage extends BasePage {
  // Page heading
  readonly pageHeading: Locator;
  readonly addNewButton: Locator;

  // Tabs
  readonly myTeamsTab: Locator;
  readonly allTeamsTab: Locator;
  readonly myTeamsTabPanel: Locator;

  // Add New dropdown menu items
  readonly addTeamMenuItem: Locator;
  readonly addUserMenuItem: Locator;
  readonly addPlayerGroupMenuItem: Locator;

  // New Team dialog elements
  readonly newTeamDialogHeading: Locator;
  readonly teamNameInput: Locator;
  readonly usersAllRadio: Locator;
  readonly usersSelectedRadio: Locator;
  readonly searchUserInput: Locator;
  readonly createTeamButton: Locator;
  readonly cancelTeamButton: Locator;

  // Pagination
  readonly paginationNav: Locator;
  readonly paginationInfoText: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.getByRole('heading', { name: 'Company Teams', level: 1 });
    this.addNewButton = page.getByRole('button', { name: 'Add New' });

    this.myTeamsTab = page.getByRole('tab', { name: 'My Teams' });
    this.allTeamsTab = page.getByRole('tab', { name: 'All Teams' });
    this.myTeamsTabPanel = page.getByRole('tabpanel', { name: 'My Teams' });

    // AIDEV-NOTE: Dropdown menu items appear after clicking the Add New button
    this.addTeamMenuItem = page.getByRole('menuitem', { name: 'Team' });
    this.addUserMenuItem = page.getByRole('menuitem', { name: 'User' });
    this.addPlayerGroupMenuItem = page.getByRole('menuitem', { name: 'Player Group' });

    // AIDEV-NOTE: New Team dialog fields — Users section has All/Selected radio options and a user search box
    this.newTeamDialogHeading = page.getByRole('heading', { name: 'New Team', level: 2 });
    this.teamNameInput = page.getByRole('textbox', { name: 'Name' });
    this.usersAllRadio = page.getByRole('radio', { name: 'All' });
    this.usersSelectedRadio = page.getByRole('radio', { name: 'Selected' });
    this.searchUserInput = page.getByRole('textbox', { name: 'Search User' });
    this.createTeamButton = page.getByRole('button', { name: 'Create Team' });
    this.cancelTeamButton = page.getByRole('button', { name: 'Cancel' });

    this.paginationNav = page.getByRole('navigation').filter({ hasText: 'First Page' });
    this.paginationInfoText = page.getByText('Showing');
  }

  async goto(): Promise<void> {
    await this.navigate('/en/teams');
    await this.waitForLoad();
  }

  async switchToAllTeams(): Promise<void> {
    await this.allTeamsTab.click();
  }

  async switchToMyTeams(): Promise<void> {
    await this.myTeamsTab.click();
  }

  async openAddNewDropdown(): Promise<void> {
    await this.addNewButton.click();
  }

  async openNewTeamDialog(): Promise<void> {
    await this.openAddNewDropdown();
    await this.addTeamMenuItem.click();
    await expect(this.newTeamDialogHeading).toBeVisible();
  }

  async fillNewTeamName(name: string): Promise<void> {
    await this.teamNameInput.fill(name);
  }

  async selectUsersAll(): Promise<void> {
    await this.usersAllRadio.click();
  }

  async selectUsersSelected(): Promise<void> {
    await this.usersSelectedRadio.click();
  }

  async searchUser(name: string): Promise<void> {
    await this.searchUserInput.fill(name);
  }

  async submitCreateTeam(): Promise<void> {
    await this.createTeamButton.click();
  }

  async cancelCreateTeam(): Promise<void> {
    await this.cancelTeamButton.click();
  }

  // AIDEV-NOTE: Each team card has a "Manage Team" link that navigates to /en/teams/:id
  async clickManageTeam(teamName: string): Promise<void> {
    const teamCard = this.page.locator('h3').filter({ hasText: teamName }).locator('../..');
    await teamCard.getByRole('link', { name: 'Manage Team' }).click();
  }

  async goToNextPage(): Promise<void> {
    await this.paginationNav.getByRole('button', { name: 'Next Page' }).click();
  }

  async goToPreviousPage(): Promise<void> {
    await this.paginationNav.getByRole('button', { name: 'Previous Page' }).click();
  }

  async verifyPageLoaded(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.myTeamsTab).toBeVisible();
    await expect(this.allTeamsTab).toBeVisible();
  }

  async verifyTeamVisible(teamName: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: teamName, level: 3 })).toBeVisible();
  }

  async verifyNewTeamDialogVisible(): Promise<void> {
    await expect(this.newTeamDialogHeading).toBeVisible();
  }

  async verifyNewTeamDialogClosed(): Promise<void> {
    await expect(this.newTeamDialogHeading).not.toBeVisible();
  }
}
