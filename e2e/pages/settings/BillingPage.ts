import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: Billing / Payment page at /en/billing/payment — page title is "Payment & Billing".
// Sections: Billing Info, Card Details (with Update Billing button), Credit Codes table,
// Recent Invoices table, and Transaction History table.
export class BillingPage extends BasePage {
  // Page heading
  readonly pageHeading: Locator;
  readonly pageDescription: Locator;

  // Billing Info section
  readonly billingInfoHeading: Locator;

  // Card Details section
  readonly cardDetailsHeading: Locator;
  readonly updateBillingButton: Locator;

  // Credit Codes section
  readonly creditCodesHeading: Locator;
  readonly enterResellerCodeButton: Locator;
  readonly creditCodesTable: Locator;

  // Recent Invoices section
  readonly recentInvoicesHeading: Locator;
  readonly recentInvoicesTable: Locator;

  // Transaction History section
  readonly transactionHistoryHeading: Locator;
  readonly transactionHistoryTable: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.getByRole('heading', { name: 'Payment & Billing', level: 1 });
    this.pageDescription = page.getByText('Manage your billing information, credit codes, invoices, and review transaction history all in one place.');

    this.billingInfoHeading = page.getByRole('heading', { name: 'Billing Info', level: 2 });

    this.cardDetailsHeading = page.getByRole('heading', { name: 'Card Details', level: 2 });
    this.updateBillingButton = page.getByRole('button', { name: 'Update Billing' });

    this.creditCodesHeading = page.getByRole('heading', { name: 'Credit Codes', level: 2 });
    this.enterResellerCodeButton = page.getByRole('button', { name: 'Enter Reseller Code' });
    // AIDEV-NOTE: Multiple tables on this page; Credit Codes is the first table
    this.creditCodesTable = page.getByRole('table').nth(0);

    this.recentInvoicesHeading = page.getByRole('heading', { name: 'Recent Invoices', level: 2 });
    // AIDEV-NOTE: Recent Invoices is the second table — columns: Description, Amount, Status, Date, Invoice
    this.recentInvoicesTable = page.getByRole('table').nth(1);

    this.transactionHistoryHeading = page.getByRole('heading', { name: 'Transaction History', level: 2 });
    // AIDEV-NOTE: Transaction History is the third table — columns: Invoice name, Amount, Date, download button
    this.transactionHistoryTable = page.getByRole('table').nth(2);
  }

  async goto(): Promise<void> {
    await this.navigate('/en/billing/payment');
    await this.waitForLoadAndElement(this.pageHeading);
  }

  async clickUpdateBilling(): Promise<void> {
    await this.updateBillingButton.click();
  }

  async clickEnterResellerCode(): Promise<void> {
    await this.enterResellerCodeButton.click();
  }

  // AIDEV-NOTE: Each invoice row has a download button (no label text). Target by row description text.
  async downloadInvoiceByDescription(description: string): Promise<void> {
    const row = this.recentInvoicesTable.getByRole('row').filter({ hasText: description });
    await row.getByRole('button').click();
  }

  async downloadTransactionInvoiceByName(invoiceName: string): Promise<void> {
    const row = this.transactionHistoryTable.getByRole('row').filter({ hasText: invoiceName });
    await row.getByRole('button').last().click();
  }

  async verifyPageLoaded(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.billingInfoHeading).toBeVisible();
    await expect(this.cardDetailsHeading).toBeVisible();
  }

  async verifyBillingInfoVisible(): Promise<void> {
    await expect(this.billingInfoHeading).toBeVisible();
  }

  async verifyCreditCodesTableVisible(): Promise<void> {
    await expect(this.creditCodesHeading).toBeVisible();
    await expect(this.creditCodesTable).toBeVisible();
  }

  async verifyRecentInvoicesTableVisible(): Promise<void> {
    await expect(this.recentInvoicesHeading).toBeVisible();
    await expect(this.recentInvoicesTable).toBeVisible();
  }

  async verifyTransactionHistoryTableVisible(): Promise<void> {
    await expect(this.transactionHistoryHeading).toBeVisible();
    await expect(this.transactionHistoryTable).toBeVisible();
  }
}
