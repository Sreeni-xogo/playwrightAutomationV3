import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class BillingPlansPage extends BasePage {
  readonly heading: Locator;
  readonly annualPlanCard: Locator;
  readonly monthlyPlanCard: Locator;
  readonly annualPurchaseButton: Locator;
  readonly monthlyPurchaseButton: Locator;
  readonly buyAtAmazonLink: Locator;
  readonly buyAtXogoStoreLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'License Plans', level: 1 });
    this.annualPlanCard = page.getByRole('article').filter({ hasText: 'Annual' });
    this.monthlyPlanCard = page.getByRole('article').filter({ hasText: 'Monthly' });
    // AIDEV-NOTE: Two Purchase Licenses buttons exist — one per plan card
    this.annualPurchaseButton = this.annualPlanCard.getByRole('button', { name: 'Purchase Licenses' });
    this.monthlyPurchaseButton = this.monthlyPlanCard.getByRole('button', { name: 'Purchase Licenses' });
    this.buyAtAmazonLink = page.getByRole('link', { name: 'Buy at Amazon' });
    this.buyAtXogoStoreLink = page.getByRole('link', { name: 'Buy at XOGO Store' });
  }

  async goto(): Promise<void> {
    await this.navigate('/en/billing/plans');
    await this.waitForLoad();
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
}
