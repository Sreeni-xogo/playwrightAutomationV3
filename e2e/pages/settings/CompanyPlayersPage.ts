import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: Company Players page — admin view of all players across the company with license management
export class CompanyPlayersPage extends BasePage {
  readonly heading: Locator;
  readonly exportCsvButton: Locator;
  readonly playersTable: Locator;
  readonly paginationInfo: Locator;
  readonly firstPageButton: Locator;
  readonly previousPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly lastPageButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Players', level: 1 });
    this.exportCsvButton = page.getByRole('button', { name: 'Export to CSV' });
    this.playersTable = page.getByRole('table');
    // AIDEV-NOTE: Pagination shows "Showing X-Y of Z" format
    this.paginationInfo = page.locator('div').filter({ hasText: 'Showing' }).first();
    this.firstPageButton = page.getByRole('button', { name: 'First Page' });
    this.previousPageButton = page.getByRole('button', { name: 'Previous Page' });
    this.nextPageButton = page.getByRole('button', { name: 'Next Page' });
    this.lastPageButton = page.getByRole('button', { name: 'Last Page' });
  }

  async goto(): Promise<void> {
    await this.navigate('/en/company/players');
    await this.waitForLoadAndElement(this.heading);
  }

  async clickExportCsv(): Promise<void> {
    await this.exportCsvButton.click();
  }

  async clickNextPage(): Promise<void> {
    await this.nextPageButton.click();
    await this.waitForLoad();
  }

  async clickPreviousPage(): Promise<void> {
    await this.previousPageButton.click();
    await this.waitForLoad();
  }

  async clickPageButton(pageNumber: number): Promise<void> {
    await this.page.getByRole('button', { name: `Page ${pageNumber}` }).click();
    await this.waitForLoad();
  }

  async verifyPageElements(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.exportCsvButton).toBeVisible();
    await expect(this.playersTable).toBeVisible();
  }
}
