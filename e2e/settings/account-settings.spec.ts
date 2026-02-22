import { test, expect } from '@playwright/test';
import { ReferralPage } from '../pages/settings/ReferralPage';
import { HandoverDeletePage } from '../pages/settings/HandoverDeletePage';
import { IntegrationPage } from '../pages/settings/IntegrationPage';
import { ServicesPage } from '../pages/settings/ServicesPage';
import { CompanyPlayersPage } from '../pages/settings/CompanyPlayersPage';

// ---------------------------------------------------------------------------
// Referral Page
// ---------------------------------------------------------------------------

test.describe('Referral', () => {
  test('should display page elements', async ({ page }) => {
    const referralPage = new ReferralPage(page);
    await referralPage.goto();
    await referralPage.verifyPageElements();
  });

  test('should display copy referral code button', async ({ page }) => {
    const referralPage = new ReferralPage(page);
    await referralPage.goto();
    await expect(referralPage.copyCodeButton).toBeVisible();
  });

  test('should display copy referral link button', async ({ page }) => {
    const referralPage = new ReferralPage(page);
    await referralPage.goto();
    await expect(referralPage.copyLinkButton).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Integration Page
// ---------------------------------------------------------------------------

test.describe('Integration', () => {
  test('should display page elements', async ({ page }) => {
    const integrationPage = new IntegrationPage(page);
    await integrationPage.goto();
    await integrationPage.verifyPageElements();
  });

  test('should display Integration Tokens table', async ({ page }) => {
    const integrationPage = new IntegrationPage(page);
    await integrationPage.goto();
    await expect(integrationPage.tokensTableHeading).toBeVisible();
    await expect(integrationPage.tokensTable).toBeVisible();
  });

  test('should display Generate Integration ID button', async ({ page }) => {
    const integrationPage = new IntegrationPage(page);
    await integrationPage.goto();
    await expect(integrationPage.generateButton).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Services Page
// ---------------------------------------------------------------------------

test.describe('Services', () => {
  test('should display page elements', async ({ page }) => {
    const servicesPage = new ServicesPage(page);
    await servicesPage.goto();
    await servicesPage.verifyPageElements();
  });

  test('should display Media Processor and Screenshot Processor headings', async ({ page }) => {
    const servicesPage = new ServicesPage(page);
    await servicesPage.goto();
    await expect(servicesPage.mediaProcessorHeading).toBeVisible();
    await expect(servicesPage.screenshotProcessorHeading).toBeVisible();
  });

  test('should display Refresh button', async ({ page }) => {
    const servicesPage = new ServicesPage(page);
    await servicesPage.goto();
    await expect(servicesPage.refreshButton).toBeVisible();
  });

  test('should show healthy status for Media Processor', async ({ page }) => {
    const servicesPage = new ServicesPage(page);
    await servicesPage.goto();
    await servicesPage.verifyMediaProcessorHealthy();
  });

  test('should show healthy status for Screenshot Processor', async ({ page }) => {
    const servicesPage = new ServicesPage(page);
    await servicesPage.goto();
    await servicesPage.verifyScreenshotProcessorHealthy();
  });

  test('should refresh service status on Refresh button click', async ({ page }) => {
    const servicesPage = new ServicesPage(page);
    await servicesPage.goto();
    await servicesPage.clickRefresh();
    // After refresh, status headings should still be visible
    await servicesPage.verifyPageElements();
  });
});

// ---------------------------------------------------------------------------
// Company Players Page
// ---------------------------------------------------------------------------

test.describe('Company Players', () => {
  test('should display page elements', async ({ page }) => {
    const companyPlayersPage = new CompanyPlayersPage(page);
    await companyPlayersPage.goto();
    await companyPlayersPage.verifyPageElements();
  });

  test('should display Export to CSV button', async ({ page }) => {
    const companyPlayersPage = new CompanyPlayersPage(page);
    await companyPlayersPage.goto();
    await expect(companyPlayersPage.exportCsvButton).toBeVisible();
  });

  test('should display players table', async ({ page }) => {
    const companyPlayersPage = new CompanyPlayersPage(page);
    await companyPlayersPage.goto();
    await expect(companyPlayersPage.playersTable).toBeVisible();
  });

  test('should display pagination controls', async ({ page }) => {
    const companyPlayersPage = new CompanyPlayersPage(page);
    await companyPlayersPage.goto();
    await expect(companyPlayersPage.paginationInfo).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Handover & Delete Account Page — UI ONLY (no destructive actions)
// ---------------------------------------------------------------------------

test.describe('Handover & Delete Account (UI only)', () => {
  test('should display page elements', async ({ page }) => {
    const handoverPage = new HandoverDeletePage(page);
    await handoverPage.goto();
    await handoverPage.verifyPageElements();
  });

  test('should display Administrative Handover section', async ({ page }) => {
    const handoverPage = new HandoverDeletePage(page);
    await handoverPage.goto();
    await expect(handoverPage.handoverHeading).toBeVisible();
    await expect(handoverPage.handoverEmailInput).toBeVisible();
    await expect(handoverPage.findButton).toBeVisible();
  });

  test('should display Delete Your Company section', async ({ page }) => {
    const handoverPage = new HandoverDeletePage(page);
    await handoverPage.goto();
    await expect(handoverPage.deleteHeading).toBeVisible();
    await expect(handoverPage.deleteEmailInput).toBeVisible();
    await expect(handoverPage.deleteCompanyButton).toBeVisible();
  });

  // AIDEV-NOTE: Delete button must remain disabled until email is entered
  test('should show Delete Your Company button as disabled initially', async ({ page }) => {
    const handoverPage = new HandoverDeletePage(page);
    await handoverPage.goto();
    await handoverPage.verifyDeleteButtonDisabled();
  });
});
