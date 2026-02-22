import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: Players list page — shows all registered players in a grid with filter, sort, add new, and status badges
export class PlayersPage extends BasePage {
  readonly pageHeading: Locator;
  readonly playerCount: Locator;
  readonly addNewButton: Locator;
  readonly sortButton: Locator;
  readonly filterButton: Locator;
  readonly selectButton: Locator;
  readonly paginationInfo: Locator;
  readonly firstPageButton: Locator;
  readonly previousPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly lastPageButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Players', level: 1 });
    // AIDEV-NOTE: Player count badge is adjacent to the heading — shows total player count
    this.playerCount = page.getByRole('heading', { name: 'Players', level: 1 }).locator('../../..').getByText('18');
    this.addNewButton = page.getByRole('button', { name: 'Add New' });
    // AIDEV-NOTE: Sort dropdown button shows current sort mode e.g. "Date Added: Newest"
    this.sortButton = page.getByRole('button', { name: 'Date Added: Newest' });
    this.filterButton = page.getByRole('button', { name: 'Filter' });
    this.selectButton = page.getByRole('button', { name: 'Select' });
    this.paginationInfo = page.getByText('Showing');
    this.firstPageButton = page.getByRole('button', { name: 'First Page' });
    this.previousPageButton = page.getByRole('button', { name: 'Previous Page' });
    this.nextPageButton = page.getByRole('button', { name: 'Next Page' });
    this.lastPageButton = page.getByRole('button', { name: 'Last Page' });
  }

  async goto(): Promise<void> {
    await this.navigate('/en/players');
    await this.waitForLoad();
  }

  // AIDEV-NOTE: Returns the card container for a player by its heading name
  getPlayerCard(name: string): Locator {
    return this.page.getByRole('heading', { name, level: 5 }).locator('../../../..');
  }

  // AIDEV-NOTE: Returns the clickable link for a player card — navigates to /en/players/:id
  getPlayerLink(name: string): Locator {
    return this.page.getByRole('heading', { name, level: 5 }).locator('../../..').getByRole('link');
  }

  async clickAddNew(): Promise<void> {
    await this.addNewButton.click();
  }

  async clickPlayer(name: string): Promise<void> {
    await this.getPlayerLink(name).click();
  }

  async clickFilter(): Promise<void> {
    await this.filterButton.click();
  }

  async clickSort(): Promise<void> {
    await this.sortButton.click();
  }

  async clickSelect(): Promise<void> {
    await this.selectButton.click();
  }

  async clickPageButton(pageNumber: number): Promise<void> {
    await this.page.getByRole('button', { name: `Page ${pageNumber}` }).click();
  }

  async verifyOnPlayersPage(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
  }

  async verifyAddNewButtonVisible(): Promise<void> {
    await expect(this.addNewButton).toBeVisible();
  }

  async verifyPlayerVisible(name: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name, level: 5 })).toBeVisible();
  }

  async verifyPaginationInfoVisible(): Promise<void> {
    await expect(this.paginationInfo).toBeVisible();
  }
}
