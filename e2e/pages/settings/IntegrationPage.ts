import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: Integration page manages Microsoft Teams Rooms device pairing via integration tokens
export class IntegrationPage extends BasePage {
  readonly heading: Locator;
  readonly generateButton: Locator;
  readonly tokensTable: Locator;
  readonly tokensTableHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Integration', level: 1 });
    this.generateButton = page.getByRole('button', { name: 'Generate Integration ID' });
    this.tokensTableHeading = page.getByRole('heading', { name: 'Integration Tokens', level: 3 });
    this.tokensTable = page.getByRole('table');
  }

  async goto(): Promise<void> {
    await this.navigate('/en/integrations');
    await this.waitForLoadAndElement(this.heading);
  }

  async generateIntegrationId(): Promise<void> {
    await this.generateButton.click();
  }

  async verifyPageElements(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.generateButton).toBeVisible();
    await expect(this.tokensTableHeading).toBeVisible();
    await expect(this.tokensTable).toBeVisible();
  }
}
