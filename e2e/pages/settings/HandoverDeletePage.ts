import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: This page handles two destructive actions — admin handover and full company deletion.
// Both actions are irreversible. Tests should use isolated test accounts only.
export class HandoverDeletePage extends BasePage {
  readonly heading: Locator;

  // Administrative Handover section
  readonly handoverHeading: Locator;
  readonly handoverEmailInput: Locator;
  readonly findButton: Locator;

  // Delete Company section
  readonly deleteHeading: Locator;
  readonly deleteEmailInput: Locator;
  readonly deleteCompanyButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Administrative Handover & Delete Account', level: 1 });
    this.handoverHeading = page.getByRole('heading', { name: 'Administrative Handover', level: 2 });
    this.handoverEmailInput = page.getByPlaceholder('Enter user email address');
    this.findButton = page.getByRole('button', { name: 'Find' });
    this.deleteHeading = page.getByRole('heading', { name: 'Delete Your Company', level: 2 });
    this.deleteEmailInput = page.getByPlaceholder('Your email address');
    // AIDEV-NOTE: Button is disabled until email is entered — do not click without confirmation
    this.deleteCompanyButton = page.getByRole('button', { name: 'Delete Your Company' });
  }

  async goto(): Promise<void> {
    await this.navigate('/en/account/handover-delete');
    await this.waitForLoadAndElement(this.heading);
  }

  async findHandoverUser(email: string): Promise<void> {
    await this.handoverEmailInput.fill(email);
    await this.findButton.click();
  }

  async verifyPageElements(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.handoverHeading).toBeVisible();
    await expect(this.handoverEmailInput).toBeVisible();
    await expect(this.findButton).toBeVisible();
    await expect(this.deleteHeading).toBeVisible();
    await expect(this.deleteEmailInput).toBeVisible();
    await expect(this.deleteCompanyButton).toBeVisible();
  }

  async verifyDeleteButtonDisabled(): Promise<void> {
    await expect(this.deleteCompanyButton).toBeDisabled();
  }
}
