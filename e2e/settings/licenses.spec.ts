import { test, expect } from '@playwright/test';
import { LicensesPage } from '../pages/settings/LicensesPage';
import { BillingPlansPage } from '../pages/settings/BillingPlansPage';
import { isFree, isEnterprise } from '../utils/tierGuard';

// AIDEV-NOTE: Requires authenticated session — setup saves .auth/state.json, consumed here
test.use({ storageState: '.auth/state.json' });

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

  test('should display Buy More or Upgrade link and Enter Credit Code button', async ({ page }) => {
    const licensesPage = new LicensesPage(page);
    await licensesPage.goto();
    // AIDEV-NOTE: Free tier shows "Upgrade to Pro" link instead of "Buy More" in the Licenses summary card.
    if (isFree()) {
      await expect(licensesPage.freeUpgradeToProLink).toBeVisible();
    } else {
      await expect(licensesPage.buyMoreLink).toBeVisible();
    }
    // AIDEV-NOTE: Credit/reseller code button: Enterprise = DISABLED; Free + Pro = enabled.
    // Free = upgrade-only use; Pro = unlimited use.
    await expect(licensesPage.enterCreditCodeButton).toBeVisible();
    if (isEnterprise()) {
      await expect(licensesPage.enterCreditCodeButton).toBeDisabled();
    } else {
      await expect(licensesPage.enterCreditCodeButton).toBeEnabled();
    }
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

  test('should navigate to License Plans page via Buy More or Upgrade link (UI only)', async ({ page }) => {
    const licensesPage = new LicensesPage(page);
    await licensesPage.goto();
    // AIDEV-NOTE: Free tier uses "Upgrade to Pro" link; Pro uses "Buy More" link — both navigate to /en/billing/plans.
    if (isFree()) {
      await licensesPage.freeUpgradeToProLink.click();
      await licensesPage.waitForLoad();
    } else {
      await licensesPage.clickBuyMore();
    }
    await expect(page).toHaveURL('/en/billing/plans');
  });
});

// ---------------------------------------------------------------------------
// License Plans — UI only (no purchase)
// ---------------------------------------------------------------------------

// AIDEV-NOTE: License Plans page heading differs by tier:
//   Pro  → "License Plans" h1, buttons "Purchase Licenses"
//   Free → "Upgrade to XOGO Pro" h1, buttons "Upgrade to Pro"
test.describe('License Plans (UI only)', () => {
  test('should display page heading', async ({ page }) => {
    const billingPlansPage = new BillingPlansPage(page);
    if (isFree()) {
      await billingPlansPage.gotoFree();
      await expect(billingPlansPage.freeHeading).toBeVisible();
    } else {
      await billingPlansPage.goto();
      await expect(billingPlansPage.heading).toBeVisible();
    }
  });

  test('should display Annual and Monthly plan cards', async ({ page }) => {
    const billingPlansPage = new BillingPlansPage(page);
    if (isFree()) {
      await billingPlansPage.gotoFree();
    } else {
      await billingPlansPage.goto();
    }
    await expect(billingPlansPage.annualPlanCard).toBeVisible();
    await expect(billingPlansPage.monthlyPlanCard).toBeVisible();
  });

  test('should display Purchase Licenses or Upgrade buttons (not clicked)', async ({ page }) => {
    const billingPlansPage = new BillingPlansPage(page);
    if (isFree()) {
      await billingPlansPage.gotoFree();
      await expect(billingPlansPage.annualUpgradeButton).toBeVisible();
      await expect(billingPlansPage.monthlyUpgradeButton).toBeVisible();
    } else {
      await billingPlansPage.goto();
      await expect(billingPlansPage.annualPurchaseButton).toBeVisible();
      await expect(billingPlansPage.monthlyPurchaseButton).toBeVisible();
    }
  });

  test('should display Buy at Amazon and Buy at XOGO Store links', async ({ page }) => {
    const billingPlansPage = new BillingPlansPage(page);
    if (isFree()) {
      await billingPlansPage.gotoFree();
    } else {
      await billingPlansPage.goto();
    }
    await expect(billingPlansPage.buyAtAmazonLink).toBeVisible();
    await expect(billingPlansPage.buyAtXogoStoreLink).toBeVisible();
  });
});
