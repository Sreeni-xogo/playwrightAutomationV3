import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class ReferralPage extends BasePage {
  readonly heading: Locator;
  readonly referralCodeText: Locator;
  readonly copyCodeButton: Locator;
  readonly copyLinkButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Refer a Friend and get 50% off', level: 1 });
    // AIDEV-NOTE: referral code is displayed as plain text next to a copy button
    this.referralCodeText = page.locator('p').filter({ hasText: 'Copy your referral code' }).locator('..').locator('p').last();
    this.copyCodeButton = page.locator('p').filter({ hasText: 'Copy your referral code' }).locator('..').getByRole('button');
    this.copyLinkButton = page.getByRole('button', { name: 'Click Here' });
  }

  async goto(): Promise<void> {
    await this.navigate('/en/account/referral');
    await this.waitForLoad();
  }

  async copyReferralCode(): Promise<void> {
    await this.copyCodeButton.click();
  }

  async copyReferralLink(): Promise<void> {
    await this.copyLinkButton.click();
  }

  async verifyPageElements(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.copyLinkButton).toBeVisible();
  }
}
