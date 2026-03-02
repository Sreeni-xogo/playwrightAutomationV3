import { test, expect } from '@playwright/test';
import { LibraryPage } from '../pages/library/LibraryPage';
import { UploadPage } from '../pages/library/UploadPage';

// AIDEV-NOTE: Requires authenticated session — setup saves .auth/state.json, consumed here
test.use({ storageState: '.auth/state.json' });

// ---------------------------------------------------------------------------
// Library — URL CRUD test data
// ---------------------------------------------------------------------------
const TEST_URL_NAME = `AutoTest URL ${Date.now()}`;
const TEST_URL_UPDATED_NAME = `AutoTest URL Updated ${Date.now()}`;
// AIDEV-NOTE: Using high-profile public pages as URL assets — always available
const TEST_URL_ADDRESS = 'https://www.apple.com';

// ---------------------------------------------------------------------------
// Library List
// ---------------------------------------------------------------------------

test.describe('Library — list page', () => {
  test('should display page heading and controls', async ({ page }) => {
    const libraryPage = new LibraryPage(page);
    await libraryPage.goto();
    await libraryPage.verifyPageLoaded();
  });

  test('should display all type filter tabs', async ({ page }) => {
    const libraryPage = new LibraryPage(page);
    await libraryPage.goto();
    await libraryPage.verifyTabsVisible();
  });

  test('should display Add New menu with Media, URL, and Widget options', async ({ page }) => {
    const libraryPage = new LibraryPage(page);
    await libraryPage.goto();
    await libraryPage.verifyAddNewMenuItemsVisible();
  });

  test('should switch to Images tab', async ({ page }) => {
    const libraryPage = new LibraryPage(page);
    await libraryPage.goto();
    await libraryPage.filterByImages();
    await expect(libraryPage.tabImages).toHaveAttribute('aria-selected', 'true');
  });

  test('should switch to Videos tab', async ({ page }) => {
    const libraryPage = new LibraryPage(page);
    await libraryPage.goto();
    await libraryPage.filterByVideos();
    await expect(libraryPage.tabVideos).toHaveAttribute('aria-selected', 'true');
  });

  test('should switch to URLs tab', async ({ page }) => {
    const libraryPage = new LibraryPage(page);
    await libraryPage.goto();
    await libraryPage.filterByUrls();
    await expect(libraryPage.tabUrls).toHaveAttribute('aria-selected', 'true');
  });

  test('should switch to Widgets tab', async ({ page }) => {
    const libraryPage = new LibraryPage(page);
    await libraryPage.goto();
    await libraryPage.filterByWidgets();
    await expect(libraryPage.tabWidgets).toHaveAttribute('aria-selected', 'true');
  });

  test('should navigate to Upload page via Add New > Media', async ({ page }) => {
    const libraryPage = new LibraryPage(page);
    await libraryPage.goto();
    await libraryPage.clickAddNewMedia();
    await expect(page).toHaveURL('/en/library/upload');
  });
});

// ---------------------------------------------------------------------------
// Upload Page — elements only, no actual upload
// ---------------------------------------------------------------------------

test.describe('Library — upload page (UI only)', () => {
  test('should display all upload page elements', async ({ page }) => {
    const uploadPage = new UploadPage(page);
    await uploadPage.goto();
    await uploadPage.verifyPageLoaded();
  });

  test('should show Upload button as disabled when no file staged', async ({ page }) => {
    const uploadPage = new UploadPage(page);
    await uploadPage.goto();
    await uploadPage.verifyUploadButtonDisabled();
  });

  test('should display Go Back button', async ({ page }) => {
    const uploadPage = new UploadPage(page);
    await uploadPage.goto();
    await uploadPage.verifyGoBackButtonVisible();
  });

  test('should display allowed file types text', async ({ page }) => {
    const uploadPage = new UploadPage(page);
    await uploadPage.goto();
    await uploadPage.verifyAllowedFileTypesText();
  });

  test('should navigate back to Library via Go Back button', async ({ page }) => {
    const uploadPage = new UploadPage(page);
    await uploadPage.goto();
    await uploadPage.goBack();
    expect(page.url()).toContain('/en/library');
  });
});

// ---------------------------------------------------------------------------
// Library URL — Create → Edit → Delete (CRUD)
// AIDEV-NOTE: URL assets use public websites as content source
// ---------------------------------------------------------------------------

// AIDEV-NOTE: CRUD tests share state (create → edit → delete same asset) — must run serially
test.describe('Library — URL CRUD', () => {
  test.describe.configure({ mode: 'serial' });

  test('create: should add a new URL asset', async ({ page }) => {
    const libraryPage = new LibraryPage(page);
    await libraryPage.goto();
    await libraryPage.clickAddNewUrl();
    // AIDEV-NOTE: URL add opens a modal or inline form — fill name and URL then save
    await page.getByRole('textbox', { name: 'Name' }).fill(TEST_URL_NAME);
    await page.getByRole('textbox', { name: 'URL' }).fill(TEST_URL_ADDRESS);
    await page.getByRole('button', { name: 'Save' }).click();
    // After save, URL asset should appear in the library list
    await libraryPage.filterByUrls();
    await expect(page.getByText(TEST_URL_NAME)).toBeVisible({ timeout: 10000 });
  });

  test('edit: should rename the created URL asset', async ({ page }) => {
    const libraryPage = new LibraryPage(page);
    await libraryPage.goto();
    await libraryPage.filterByUrls();
    // AIDEV-NOTE: The card link is an invisible <a class="absolute inset-0 z-10"> overlay inside div.card.
    // h5 lives in div.card-footer (sibling of div.card) — cannot find link via h5 parent.
    // XPath: go up to ancestor div.card-footer → up one → down to the overlay <a> in sibling div.card.
    const editCardLink = page
      .locator('h5', { hasText: TEST_URL_NAME })
      .locator('xpath=ancestor::div[contains(@class,"card-footer")]/..//a[contains(@href,"/en/library/")]');
    await editCardLink.click();
    // AIDEV-NOTE: networkidle required before fill() — Vue v-model (PATTERN-001)
    await page.waitForLoadState('networkidle');
    const nameInput = page.getByRole('textbox', { name: 'Name' });
    await nameInput.clear();
    await nameInput.fill(TEST_URL_UPDATED_NAME);
    await page.getByRole('button', { name: 'Save' }).click();
    await libraryPage.goto();
    await libraryPage.filterByUrls();
    await expect(page.getByText(TEST_URL_UPDATED_NAME)).toBeVisible({ timeout: 10000 });
  });

  test('delete: should delete the URL asset', async ({ page }) => {
    const libraryPage = new LibraryPage(page);
    await libraryPage.goto();
    await libraryPage.filterByUrls();
    // AIDEV-NOTE: Delete button has no aria-label (trash icon only).
    // div.card-footer contains both the h5 title and the action buttons.
    // Copy button is first (aria-label="Copy"), delete/trash button is last (no label).
    const footer = page.locator('div.card-footer', { has: page.locator('h5', { hasText: TEST_URL_UPDATED_NAME }) });
    await footer.getByRole('button').last().click();
    // AIDEV-NOTE: Deletion always triggers a confirmation dialog — wait for it then confirm.
    // getByRole('dialog') scopes the Delete button to avoid matching the card-footer's trash icon.
    const confirmDeleteButton = page.getByRole('dialog').getByRole('button', { name: 'Delete' });
    await confirmDeleteButton.waitFor({ state: 'visible', timeout: 10000 });
    await confirmDeleteButton.click();
    // AIDEV-NOTE: Use h5 locator (not getByText) to avoid strict-mode violations — dialog also
    // contains the asset name in its <p> body which creates a second match.
    await expect(page.locator('h5', { hasText: TEST_URL_UPDATED_NAME })).not.toBeVisible({ timeout: 10000 });
  });
});
