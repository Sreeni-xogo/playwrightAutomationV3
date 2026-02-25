import { expect, type Page, type Locator } from '@playwright/test';

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

  async waitForLoadAndElement(locator: Locator): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await expect(locator).toBeVisible();
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
    // AIDEV-NOTE: networkidle required — Vue event listeners for altcha must be bound before click
    await this.page.waitForLoadState('networkidle');
    await captchaLabel.click();
    // AIDEV-NOTE: Wait for Altcha proof-of-work to complete — polls until data-state="verified"
    // Use 'attached' state — the div may not be 'visible' in all environments after verification
    await this.page.waitForSelector('.altcha[data-state="verified"]', { state: 'attached', timeout: 15000 });
  }
}
