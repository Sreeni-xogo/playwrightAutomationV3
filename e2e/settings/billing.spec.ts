import { test, expect } from '@playwright/test';
import { BillingPage } from '../pages/settings/BillingPage';

// AIDEV-NOTE: Requires authenticated session — staging-setup saves state, consumed here
test.use({ storageState: '.auth/staging-state.json' });

// AIDEV-NOTE: Billing tests are UI verification only — no card updates or invoice downloads are performed

test.describe('Billing — Payment & Billing page (UI only)', () => {
  test('should display page heading and description', async ({ page }) => {
    const billingPage = new BillingPage(page);
    await billingPage.goto();
    await billingPage.verifyPageLoaded();
  });

  test('should display Billing Info section', async ({ page }) => {
    const billingPage = new BillingPage(page);
    await billingPage.goto();
    await billingPage.verifyBillingInfoVisible();
  });

  test('should display Card Details section with Update Billing button', async ({ page }) => {
    const billingPage = new BillingPage(page);
    await billingPage.goto();
    await expect(billingPage.cardDetailsHeading).toBeVisible();
    await expect(billingPage.updateBillingButton).toBeVisible();
  });

  test('should display Credit Codes section and Enter Reseller Code button', async ({ page }) => {
    const billingPage = new BillingPage(page);
    await billingPage.goto();
    await billingPage.verifyCreditCodesTableVisible();
    await expect(billingPage.enterResellerCodeButton).toBeVisible();
  });

  test('should display Recent Invoices section', async ({ page }) => {
    const billingPage = new BillingPage(page);
    await billingPage.goto();
    await billingPage.verifyRecentInvoicesTableVisible();
  });

  test('should display Transaction History section', async ({ page }) => {
    const billingPage = new BillingPage(page);
    await billingPage.goto();
    await billingPage.verifyTransactionHistoryTableVisible();
  });

  test('should open Update Billing dialog or flow on button click', async ({ page }) => {
    const billingPage = new BillingPage(page);
    await billingPage.goto();
    await billingPage.clickUpdateBilling();
    // AIDEV-NOTE: Update Billing navigates to Stripe checkout (external payment page, not inline dialog)
    await page.waitForURL((url) => url.hostname.includes('stripe'), { timeout: 10000 });
    expect(page.url()).toContain('stripe');
  });
});
