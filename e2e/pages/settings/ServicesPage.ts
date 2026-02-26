import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: Internal Services page — shows health status of Media Processor and Screenshot Processor
export class ServicesPage extends BasePage {
  readonly heading: Locator;
  readonly refreshButton: Locator;
  readonly mediaProcessorHeading: Locator;
  readonly screenshotProcessorHeading: Locator;
  readonly mediaProcessorStatus: Locator;
  readonly screenshotProcessorStatus: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Services', level: 1 });
    // AIDEV-NOTE: Refresh button is unlabeled — sits as sibling to heading/description in page header section
    this.refreshButton = page.getByRole('heading', { name: 'Services', level: 1 }).locator('../..').getByRole('button');
    this.mediaProcessorHeading = page.getByRole('heading', { name: 'Media Processor', level: 3 });
    this.screenshotProcessorHeading = page.getByRole('heading', { name: 'Screenshot Processor', level: 3 });
    // AIDEV-NOTE: Status text is sibling to heading — "Healthy & Ready" or error state
    // AIDEV-NOTE: PATTERN-006 — use .first() to avoid strict mode violation when both processors show same status text
    this.mediaProcessorStatus = page.locator('div').filter({ hasText: 'Media Processor' }).locator('..').getByText('Healthy & Ready').first();
    this.screenshotProcessorStatus = page.locator('div').filter({ hasText: 'Screenshot Processor' }).locator('..').getByText('Healthy & Ready').first();
  }

  async goto(): Promise<void> {
    await this.navigate('/en/company/services');
    await this.waitForLoadAndElement(this.heading);
  }

  async clickRefresh(): Promise<void> {
    await this.refreshButton.click();
  }

  async verifyPageElements(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.mediaProcessorHeading).toBeVisible();
    await expect(this.screenshotProcessorHeading).toBeVisible();
  }

  async verifyMediaProcessorHealthy(): Promise<void> {
    await expect(this.mediaProcessorStatus).toBeVisible();
  }

  async verifyScreenshotProcessorHealthy(): Promise<void> {
    await expect(this.screenshotProcessorStatus).toBeVisible();
  }
}
