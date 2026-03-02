import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: License Plans page at /en/billing/plans.
// Tier behaviour:
//   Pro        → heading "License Plans" h1, buttons "Purchase Licenses"
//   Free       → heading "Upgrade to XOGO Pro" h1, buttons "Upgrade to Pro"
//   Both tiers → Annual and Monthly plan cards, Buy at Amazon / Buy at XOGO Store links present
export class BillingPlansPage extends BasePage {
  // Pro tier heading
  readonly heading: Locator;
  // Free tier heading
  readonly freeHeading: Locator;

  readonly annualPlanCard: Locator;
  readonly monthlyPlanCard: Locator;

  // Pro tier purchase buttons
  readonly annualPurchaseButton: Locator;
  readonly monthlyPurchaseButton: Locator;

  // Free tier upgrade buttons (replace "Purchase Licenses" on Free)
  readonly annualUpgradeButton: Locator;
  readonly monthlyUpgradeButton: Locator;

  readonly buyAtAmazonLink: Locator;
  readonly buyAtXogoStoreLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'License Plans', level: 1 });
    this.freeHeading = page.getByRole('heading', { name: 'Upgrade to XOGO Pro', level: 1 });

    this.annualPlanCard = page.getByRole('article').filter({ hasText: 'Annual' });
    this.monthlyPlanCard = page.getByRole('article').filter({ hasText: 'Monthly' });

    // AIDEV-NOTE: Two Purchase Licenses buttons exist on Pro — one per plan card
    this.annualPurchaseButton = this.annualPlanCard.getByRole('button', { name: 'Purchase Licenses' });
    this.monthlyPurchaseButton = this.monthlyPlanCard.getByRole('button', { name: 'Purchase Licenses' });

    // AIDEV-NOTE: Two Upgrade to Pro buttons on Free — one per plan card
    this.annualUpgradeButton = this.annualPlanCard.getByRole('button', { name: 'Upgrade to Pro' });
    this.monthlyUpgradeButton = this.monthlyPlanCard.getByRole('button', { name: 'Upgrade to Pro' });

    this.buyAtAmazonLink = page.getByRole('link', { name: 'Buy at Amazon' });
    this.buyAtXogoStoreLink = page.getByRole('link', { name: 'Buy at XOGO Store' });
  }

  // Pro tier — standard navigation
  async goto(): Promise<void> {
    await this.navigate('/en/billing/plans');
    await this.waitForLoadAndElement(this.heading);
  }

  // Free tier — same route, different heading
  async gotoFree(): Promise<void> {
    await this.navigate('/en/billing/plans');
    await this.waitForLoadAndElement(this.freeHeading);
  }

  async clickPurchaseAnnual(): Promise<void> {
    await this.annualPurchaseButton.click();
  }

  async clickPurchaseMonthly(): Promise<void> {
    await this.monthlyPurchaseButton.click();
  }

  async verifyPageElements(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.annualPlanCard).toBeVisible();
    await expect(this.monthlyPlanCard).toBeVisible();
    await expect(this.annualPurchaseButton).toBeVisible();
    await expect(this.monthlyPurchaseButton).toBeVisible();
  }

  async verifyFreePageElements(): Promise<void> {
    await expect(this.freeHeading).toBeVisible();
    await expect(this.annualPlanCard).toBeVisible();
    await expect(this.monthlyPlanCard).toBeVisible();
    await expect(this.annualUpgradeButton).toBeVisible();
    await expect(this.monthlyUpgradeButton).toBeVisible();
  }
}
