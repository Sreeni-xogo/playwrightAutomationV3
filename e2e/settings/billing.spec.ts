import { test, expect } from '@playwright/test';
import { BillingPage } from '../pages/settings/BillingPage';
import { isFree, isPro, isEnterprise } from '../utils/tierGuard';

// AIDEV-NOTE: Requires authenticated session — setup saves .auth/state.json, consumed here
test.use({ storageState: '.auth/state.json' });

// AIDEV-NOTE: Billing tests are UI verification only — no card updates or invoice downloads are performed
// AIDEV-NOTE: DIFF-08 — Pre-prod account is Enterprise Tier; standard billing sections absent. Skipped on pre-prod.
// Tier behaviour:
//   Pro        → standard billing page with all sections
//   Enterprise → same route shows "Enterprise Tier" heading + "Contact Support" button
//   Free       → /en/billing/payment redirects to /en/upgrade ("Unlock the Full Power of XOGO")

test.describe.skip('Billing — Payment & Billing page (UI only)', () => {
  test('should display page heading and description', async ({ page }) => {
    const billingPage = new BillingPage(page);
    if (isPro()) {
      await billingPage.goto();
      await billingPage.verifyPageLoaded();
    } else if (isEnterprise()) {
      await billingPage.gotoEnterprise();
      await billingPage.verifyEnterpriseTierUI();
    } else {
      await billingPage.gotoFree();
      await billingPage.verifyFreeUpgradeUI();
    }
  });

  test('should display Billing Info section', async ({ page }) => {
    const billingPage = new BillingPage(page);
    if (isPro()) {
      await billingPage.goto();
      await billingPage.verifyBillingInfoVisible();
    } else if (isEnterprise()) {
      await billingPage.gotoEnterprise();
      await billingPage.verifyEnterpriseTierUI();
    } else {
      await billingPage.gotoFree();
      await billingPage.verifyFreeUpgradeUI();
    }
  });

  test('should display Card Details section with Update Billing button', async ({ page }) => {
    const billingPage = new BillingPage(page);
    if (isPro()) {
      await billingPage.goto();
      await expect(billingPage.cardDetailsHeading).toBeVisible();
      await expect(billingPage.updateBillingButton).toBeVisible();
    } else if (isEnterprise()) {
      await billingPage.gotoEnterprise();
      await billingPage.verifyEnterpriseTierUI();
    } else {
      await billingPage.gotoFree();
      await billingPage.verifyFreeUpgradeUI();
    }
  });

  test('should display Credit Codes section and Enter Reseller Code button', async ({ page }) => {
    const billingPage = new BillingPage(page);
    if (isPro()) {
      await billingPage.goto();
      await billingPage.verifyCreditCodesTableVisible();
      await expect(billingPage.enterResellerCodeButton).toBeVisible();
    } else if (isEnterprise()) {
      await billingPage.gotoEnterprise();
      await billingPage.verifyEnterpriseTierUI();
    } else {
      await billingPage.gotoFree();
      await billingPage.verifyFreeUpgradeUI();
    }
  });

  test('should display Recent Invoices section', async ({ page }) => {
    const billingPage = new BillingPage(page);
    if (isPro()) {
      await billingPage.goto();
      await billingPage.verifyRecentInvoicesTableVisible();
    } else if (isEnterprise()) {
      await billingPage.gotoEnterprise();
      await billingPage.verifyEnterpriseTierUI();
    } else {
      await billingPage.gotoFree();
      await billingPage.verifyFreeUpgradeUI();
    }
  });

  test('should display Transaction History section', async ({ page }) => {
    const billingPage = new BillingPage(page);
    if (isPro()) {
      await billingPage.goto();
      await billingPage.verifyTransactionHistoryTableVisible();
    } else if (isEnterprise()) {
      await billingPage.gotoEnterprise();
      await billingPage.verifyEnterpriseTierUI();
    } else {
      await billingPage.gotoFree();
      await billingPage.verifyFreeUpgradeUI();
    }
  });

  test('should open Update Billing dialog or flow on button click', async ({ page }) => {
    const billingPage = new BillingPage(page);
    if (isPro()) {
      await billingPage.goto();
      await billingPage.clickUpdateBilling();
      // AIDEV-NOTE: Update Billing navigates to Stripe checkout (external payment page, not inline dialog)
      await page.waitForURL((url) => url.hostname.includes('stripe'), { timeout: 10000 });
      expect(page.url()).toContain('stripe');
    } else if (isEnterprise()) {
      await billingPage.gotoEnterprise();
      await billingPage.verifyEnterpriseTierUI();
    } else {
      await billingPage.gotoFree();
      await billingPage.verifyFreeUpgradeUI();
    }
  });
});
