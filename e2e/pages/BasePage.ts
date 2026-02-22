import { type Page, type Locator } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getUrl(): Promise<string> {
    return this.page.url();
  }

  // AIDEV-NOTE: Altcha proof-of-work captcha solver — used on login, forgot password, and signup step 2
  async solveCaptcha(): Promise<void> {
    const captchaLabel: Locator = this.page.locator('label.altcha-label');
    await captchaLabel.waitFor({ state: 'visible', timeout: 15000 });
    await captchaLabel.click();
    // AIDEV-NOTE: Wait for Altcha proof-of-work computation to complete before form submission
    await this.page.waitForTimeout(4000);
  }
}
