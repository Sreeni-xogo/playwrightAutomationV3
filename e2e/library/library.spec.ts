import { test, expect } from '@playwright/test';
import { LibraryPage } from '../pages/library/LibraryPage';
import { UploadPage } from '../pages/library/UploadPage';

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

test.describe('Library — URL CRUD', () => {
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
    // Click the asset to open the edit view
    await page.getByText(TEST_URL_NAME).click();
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
    // Open context menu on the card and click Delete
    const card = page.getByRole('heading', { name: TEST_URL_UPDATED_NAME, level: 5 }).locator('../../../..');
    await card.getByRole('button', { name: 'Delete' }).click();
    // Confirm deletion in the dialog if one appears
    const confirmButton = page.getByRole('button', { name: 'Delete' }).last();
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }
    await expect(page.getByText(TEST_URL_UPDATED_NAME)).not.toBeVisible({ timeout: 10000 });
  });
});
