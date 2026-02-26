import { test, expect } from '@playwright/test';
import { LicensesPage } from '../pages/settings/LicensesPage';
import { BillingPlansPage } from '../pages/settings/BillingPlansPage';

// AIDEV-NOTE: Requires authenticated session — staging-setup saves state, consumed here
test.use({ storageState: '.auth/staging-state.json' });

test.describe('Licenses', () => {
  test('should display page heading and table', async ({ page }) => {
    const licensesPage = new LicensesPage(page);
    await licensesPage.goto();
    await licensesPage.verifyPageLoaded();
  });

  test('should display Licenses and Balance summary cards', async ({ page }) => {
    const licensesPage = new LicensesPage(page);
    await licensesPage.goto();
    await expect(licensesPage.licensesCountHeading).toBeVisible();
    await expect(licensesPage.balanceHeading).toBeVisible();
    await expect(licensesPage.licensesInUseText).toBeVisible();
  });

  test('should display Buy More link and Enter Credit Code button', async ({ page }) => {
    const licensesPage = new LicensesPage(page);
    await licensesPage.goto();
    await expect(licensesPage.buyMoreLink).toBeVisible();
    await expect(licensesPage.enterCreditCodeButton).toBeVisible();
  });

  test('should display all table column headers', async ({ page }) => {
    const licensesPage = new LicensesPage(page);
    await licensesPage.goto();
    await expect(licensesPage.tableIdColumnHeader).toBeVisible();
    await expect(licensesPage.tableTypeColumnHeader).toBeVisible();
    await expect(licensesPage.tableRenewalDateColumnHeader).toBeVisible();
    await expect(licensesPage.tableEndDateColumnHeader).toBeVisible();
    await expect(licensesPage.tableStatusColumnHeader).toBeVisible();
  });

  test('should display filter checkboxes', async ({ page }) => {
    const licensesPage = new LicensesPage(page);
    await licensesPage.goto();
    await expect(licensesPage.showUnassignedCheckbox).toBeVisible();
    await expect(licensesPage.showWithEndDateCheckbox).toBeVisible();
  });

  test('should toggle Show Unassigned filter', async ({ page }) => {
    const licensesPage = new LicensesPage(page);
    await licensesPage.goto();
    await licensesPage.toggleShowUnassigned();
    await licensesPage.verifyUnassignedFilterChecked();
    await licensesPage.toggleShowUnassigned();
    await expect(licensesPage.showUnassignedCheckbox).not.toBeChecked();
  });

  test('should toggle Show With End Date filter', async ({ page }) => {
    const licensesPage = new LicensesPage(page);
    await licensesPage.goto();
    await licensesPage.toggleShowWithEndDate();
    await licensesPage.verifyWithEndDateFilterChecked();
    await licensesPage.toggleShowWithEndDate();
    await expect(licensesPage.showWithEndDateCheckbox).not.toBeChecked();
  });

  test('should navigate to License Plans page via Buy More link (UI only)', async ({ page }) => {
    const licensesPage = new LicensesPage(page);
    await licensesPage.goto();
    await licensesPage.clickBuyMore();
    await expect(page).toHaveURL('/en/billing/plans');
  });
});

// ---------------------------------------------------------------------------
// License Plans — UI only (no purchase)
// ---------------------------------------------------------------------------

test.describe('License Plans (UI only)', () => {
  test('should display page heading', async ({ page }) => {
    const billingPlansPage = new BillingPlansPage(page);
    await billingPlansPage.goto();
    await billingPlansPage.verifyPageElements();
  });

  test('should display Annual and Monthly plan cards', async ({ page }) => {
    const billingPlansPage = new BillingPlansPage(page);
    await billingPlansPage.goto();
    await expect(billingPlansPage.annualPlanCard).toBeVisible();
    await expect(billingPlansPage.monthlyPlanCard).toBeVisible();
  });

  test('should display Purchase Licenses buttons (not clicked)', async ({ page }) => {
    const billingPlansPage = new BillingPlansPage(page);
    await billingPlansPage.goto();
    await expect(billingPlansPage.annualPurchaseButton).toBeVisible();
    await expect(billingPlansPage.monthlyPurchaseButton).toBeVisible();
  });

  test('should display Buy at Amazon and Buy at XOGO Store links', async ({ page }) => {
    const billingPlansPage = new BillingPlansPage(page);
    await billingPlansPage.goto();
    await expect(billingPlansPage.buyAtAmazonLink).toBeVisible();
    await expect(billingPlansPage.buyAtXogoStoreLink).toBeVisible();
  });
});
