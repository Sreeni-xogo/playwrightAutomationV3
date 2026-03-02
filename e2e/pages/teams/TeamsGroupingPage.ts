import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: Teams & Grouping settings page at /en/company/teams-grouping — page title is "Teams and Player Grouping".
// This page explains the Teams and Grouping feature and shows an opt-in toggle.
// AIDEV-NOTE: For this staging account the feature is in "Request Pending" state — the toggle button is disabled.
// The feature must be enabled by the XOGO support team before Teams/Grouping are fully accessible.
export class TeamsGroupingPage extends BasePage {
  // Page heading and description
  readonly pageHeading: Locator;
  readonly pageDescription: Locator;

  // Feature explanation sections
  readonly teamsFeatureHeading: Locator;
  readonly groupingFeatureHeading: Locator;
  readonly suitabilityHeading: Locator;

  // Toggle section
  readonly toggleSectionHeading: Locator;
  // AIDEV-NOTE: Button label changes based on state: "Enable Teams and Grouping", "Request Pending", "Disable"
  readonly featureToggleButton: Locator;
  readonly pendingNote: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.getByRole('heading', { name: 'Teams and Player Grouping', level: 1 });
    this.pageDescription = page.getByText('We\'re thrilled to introduce Teams and Grouping on XOGO Manager');

    this.teamsFeatureHeading = page.getByRole('heading', { name: 'Teams', level: 3 });
    this.groupingFeatureHeading = page.getByRole('heading', { name: 'Grouping', level: 3 });
    this.suitabilityHeading = page.getByRole('heading', { name: 'Is This Right for You?', level: 3 });

    this.toggleSectionHeading = page.getByRole('heading', { name: 'Teams and Grouping - ON', level: 2 });
    // AIDEV-NOTE: The button text varies: "Enable Teams and Grouping" when off, "Request Pending" when submitted, "Disable" when active.
    // Using a broad locator scoped to the toggle section. Call the specific state method for precise assertions.
    // AIDEV-NOTE: DIFF-09 — pre-prod shows "Request Reset to Basic Mode" when Teams is fully active
    this.featureToggleButton = page.locator('button').filter({ hasText: 'Teams and Grouping' }).or(
      page.getByRole('button', { name: 'Request Pending' })
    ).or(page.getByRole('button', { name: 'Request Reset to Basic Mode' }));
    this.pendingNote = page.getByText('Please allow time for your request to be reviewed by our support team.');
  }

  async goto(): Promise<void> {
    await this.navigate('/en/company/teams-grouping');
    await this.waitForLoadAndElement(this.pageHeading);
  }

  async clickFeatureToggle(): Promise<void> {
    await this.featureToggleButton.click();
  }

  async verifyPageLoaded(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.teamsFeatureHeading).toBeVisible();
    await expect(this.groupingFeatureHeading).toBeVisible();
  }

  async verifyToggleButtonVisible(): Promise<void> {
    await expect(this.featureToggleButton).toBeVisible();
  }

  async verifyRequestPendingState(): Promise<void> {
    await expect(this.page.getByRole('button', { name: 'Request Pending' })).toBeDisabled();
    await expect(this.pendingNote).toBeVisible();
  }
}
