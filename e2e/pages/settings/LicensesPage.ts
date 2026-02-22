import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: Licenses page at /en/licenses — shows license list with ID, Type, Renewal Date, End Date, Status columns.
// Top summary cards show total licenses in use and current balance.
// Filter checkboxes allow narrowing by unassigned or end-dated licenses.
export class LicensesPage extends BasePage {
  // Page heading
  readonly pageHeading: Locator;

  // Summary cards
  readonly licensesCountHeading: Locator;
  readonly licensesInUseText: Locator;
  readonly buyMoreLink: Locator;
  readonly balanceHeading: Locator;
  readonly balanceAmount: Locator;
  readonly enterCreditCodeButton: Locator;

  // Filter checkboxes
  readonly showUnassignedCheckbox: Locator;
  readonly showWithEndDateCheckbox: Locator;

  // Licenses table
  readonly licensesTable: Locator;
  readonly tableIdColumnHeader: Locator;
  readonly tableTypeColumnHeader: Locator;
  readonly tableRenewalDateColumnHeader: Locator;
  readonly tableEndDateColumnHeader: Locator;
  readonly tableStatusColumnHeader: Locator;

  // Pagination
  readonly paginationNav: Locator;
  readonly paginationInfoText: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.getByRole('heading', { name: 'Licenses', level: 1 });

    // AIDEV-NOTE: Summary section has two cards — Licenses count and Balance
    this.licensesCountHeading = page.getByRole('heading', { name: 'Licenses', level: 2 });
    this.licensesInUseText = page.getByText('in use');
    this.buyMoreLink = page.getByRole('link', { name: 'Buy More' });
    this.balanceHeading = page.getByRole('heading', { name: 'Balance', level: 2 });
    this.balanceAmount = page.locator('h2').filter({ hasText: 'Balance' }).locator('..').locator('p').first();
    this.enterCreditCodeButton = page.getByRole('button', { name: 'Enter Credit Code' });

    this.showUnassignedCheckbox = page.getByRole('checkbox', { name: 'Display only unassigned licenses' });
    this.showWithEndDateCheckbox = page.getByRole('checkbox', { name: 'Display only licenses with end date' });

    this.licensesTable = page.getByRole('table');
    this.tableIdColumnHeader = page.getByRole('columnheader', { name: 'ID' });
    this.tableTypeColumnHeader = page.getByRole('columnheader', { name: 'Type' });
    this.tableRenewalDateColumnHeader = page.getByRole('columnheader', { name: 'Renewal Date' });
    this.tableEndDateColumnHeader = page.getByRole('columnheader', { name: 'End Date' });
    this.tableStatusColumnHeader = page.getByRole('columnheader', { name: 'Status' });

    this.paginationNav = page.getByRole('navigation').filter({ hasText: 'First Page' });
    this.paginationInfoText = page.getByText('Showing');
  }

  async goto(): Promise<void> {
    await this.navigate('/en/licenses');
    await this.waitForLoad();
  }

  async toggleShowUnassigned(): Promise<void> {
    await this.showUnassignedCheckbox.click();
  }

  async toggleShowWithEndDate(): Promise<void> {
    await this.showWithEndDateCheckbox.click();
  }

  async clickEnterCreditCode(): Promise<void> {
    await this.enterCreditCodeButton.click();
  }

  async clickBuyMore(): Promise<void> {
    await this.buyMoreLink.click();
  }

  // AIDEV-NOTE: Each row has an action button (likely expand/manage). Using row index or license ID text to target.
  async clickRowActionByLicenseId(licenseId: string): Promise<void> {
    const row = this.licensesTable.getByRole('row').filter({ hasText: licenseId });
    await row.getByRole('button').click();
  }

  async goToNextPage(): Promise<void> {
    await this.paginationNav.getByRole('button', { name: 'Next Page' }).click();
  }

  async goToPreviousPage(): Promise<void> {
    await this.paginationNav.getByRole('button', { name: 'Previous Page' }).click();
  }

  async verifyPageLoaded(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.licensesTable).toBeVisible();
    await expect(this.tableIdColumnHeader).toBeVisible();
  }

  async verifyLicenseVisible(licenseId: string): Promise<void> {
    await expect(this.licensesTable.getByText(licenseId)).toBeVisible();
  }

  async verifyUnassignedFilterChecked(): Promise<void> {
    await expect(this.showUnassignedCheckbox).toBeChecked();
  }

  async verifyWithEndDateFilterChecked(): Promise<void> {
    await expect(this.showWithEndDateCheckbox).toBeChecked();
  }
}
