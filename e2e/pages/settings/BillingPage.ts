import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: Billing / Payment page at /en/billing/payment — page title is "Payment & Billing".
// Sections: Billing Info, Card Details (with Update Billing button), Credit Codes table,
// Recent Invoices table, and Transaction History table.
// Tier behaviour:
//   Pro        → standard billing page (/en/billing/payment)
//   Enterprise → same route but shows "Enterprise Tier" h4 + "Contact Support" button; standard sections absent
//   Free       → redirects to /en/upgrade with "Unlock the Full Power of XOGO" heading
export class BillingPage extends BasePage {
  // Page heading — Pro tier
  readonly pageHeading: Locator;
  readonly pageDescription: Locator;

  // Billing Info section — Pro tier
  readonly billingInfoHeading: Locator;

  // Card Details section — Pro tier
  readonly cardDetailsHeading: Locator;
  readonly updateBillingButton: Locator;

  // Credit Codes section — Pro tier
  readonly creditCodesHeading: Locator;
  readonly enterResellerCodeButton: Locator;
  readonly creditCodesTable: Locator;

  // Recent Invoices section — Pro tier
  readonly recentInvoicesHeading: Locator;
  readonly recentInvoicesTable: Locator;

  // Transaction History section — Pro tier
  readonly transactionHistoryHeading: Locator;
  readonly transactionHistoryTable: Locator;

  // Enterprise tier locators
  // AIDEV-NOTE: Enterprise billing page shows only these two elements — all standard sections are absent
  readonly enterpriseTierHeading: Locator;
  readonly contactSupportButton: Locator;

  // Free tier locators — redirects to /en/upgrade
  // AIDEV-NOTE: Free tier navigating to /en/billing/payment redirects to /en/upgrade
  readonly upgradePageHeading: Locator;
  readonly viewPricingButton: Locator;

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

    // Enterprise tier
    this.enterpriseTierHeading = page.getByRole('heading', { name: 'Enterprise Tier', level: 4 });
    this.contactSupportButton = page.getByRole('button', { name: 'Contact Support' });

    // Free tier — upgrade page
    this.upgradePageHeading = page.getByRole('heading', { name: 'Unlock the Full Power of XOGO', level: 1 });
    this.viewPricingButton = page.getByRole('button', { name: 'View pricing' });
  }

  // Pro tier — standard navigation
  async goto(): Promise<void> {
    await this.navigate('/en/billing/payment');
    await this.waitForLoadAndElement(this.pageHeading);
  }

  // Enterprise tier — same route, different content
  async gotoEnterprise(): Promise<void> {
    await this.navigate('/en/billing/payment');
    await this.waitForLoadAndElement(this.enterpriseTierHeading);
  }

  // Free tier — navigates to /en/billing/payment and waits for /en/upgrade redirect
  async gotoFree(): Promise<void> {
    await this.navigate('/en/billing/payment');
    await this.page.waitForURL((url) => url.pathname.includes('/upgrade'), { timeout: 10000 });
    await this.waitForLoadAndElement(this.upgradePageHeading);
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

  async verifyEnterpriseTierUI(): Promise<void> {
    await expect(this.enterpriseTierHeading).toBeVisible();
    await expect(this.contactSupportButton).toBeVisible();
  }

  async verifyFreeUpgradeUI(): Promise<void> {
    await expect(this.upgradePageHeading).toBeVisible();
    await expect(this.viewPricingButton).toBeVisible();
  }
}
