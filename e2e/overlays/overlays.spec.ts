import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import { OverlaysPage } from '../pages/overlays/OverlaysPage';
import { OverlayEditPage } from '../pages/overlays/OverlayEditPage';
import { isFree } from '../utils/tierGuard';
// AIDEV-NOTE: Free tier — /en/overlays redirects to /en/upgrade. All tests skipped on Free.

// AIDEV-NOTE: PATTERN-013 — overlay save requires a background image or web surface
// A minimal 1x1 PNG is used as the canvas background to satisfy the validation
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_IMAGE = path.join(__dirname, '../fixtures/test-image.png');

// AIDEV-NOTE: Requires authenticated session — setup saves .auth/state.json, consumed here
test.use({ storageState: '.auth/state.json' });

const OVERLAY_NAME = `AutoTest Overlay ${Date.now()}`;
const OVERLAY_UPDATED_NAME = `AutoTest Overlay Updated ${Date.now()}`;

// ---------------------------------------------------------------------------
// Overlays — List
// ---------------------------------------------------------------------------

test.describe('Overlays — list page', () => {
  test('should display page heading', async ({ page }) => {
    test.skip(isFree(), 'Overlays page redirects to /en/upgrade on Free tier');
    const overlaysPage = new OverlaysPage(page);
    await overlaysPage.goto();
    await overlaysPage.verifyOnOverlaysPage();
  });

  test('should display Add New link', async ({ page }) => {
    test.skip(isFree(), 'Overlays page redirects to /en/upgrade on Free tier');
    const overlaysPage = new OverlaysPage(page);
    await overlaysPage.goto();
    await overlaysPage.verifyAddNewLinkVisible();
  });

  test('should display pagination info', async ({ page }) => {
    test.skip(isFree(), 'Overlays page redirects to /en/upgrade on Free tier');
    const overlaysPage = new OverlaysPage(page);
    await overlaysPage.goto();
    await overlaysPage.verifyPaginationVisible();
  });

  test('should navigate to Add New overlay page', async ({ page }) => {
    test.skip(isFree(), 'Overlays page redirects to /en/upgrade on Free tier');
    const overlaysPage = new OverlaysPage(page);
    await overlaysPage.goto();
    await overlaysPage.clickAddNew();
    await expect(page).toHaveURL('/en/overlays/add');
  });
});

// ---------------------------------------------------------------------------
// Overlays — CRUD
// ---------------------------------------------------------------------------

// AIDEV-NOTE: Serial required — CRUD tests share OVERLAY_NAME/OVERLAY_UPDATED_NAME and depend on prior test state
test.describe.serial('Overlays — CRUD', () => {
  test('create: should display Add New overlay page elements', async ({ page }) => {
    test.skip(isFree(), 'Overlays page redirects to /en/upgrade on Free tier');
    const overlayEditPage = new OverlayEditPage(page);
    await overlayEditPage.gotoAddNew();
    await overlayEditPage.verifyOnAddNewPage();
    await overlayEditPage.verifySaveButtonVisible();
    await overlayEditPage.verifyQuickStartTemplatesVisible();
    await overlayEditPage.verifyAspectRatioInfoVisible();
  });

  test('create: should create a new overlay using Full Screen template', async ({ page }) => {
    test.skip(isFree(), 'Overlays page redirects to /en/upgrade on Free tier');
    const overlayEditPage = new OverlayEditPage(page);
    await overlayEditPage.gotoAddNew();
    await overlayEditPage.setOverlayName(OVERLAY_NAME);
    await overlayEditPage.clickFullScreenTemplate();
    // AIDEV-NOTE: PATTERN-013 — upload a background image to satisfy canvas validation before saving
    await overlayEditPage.uploadCanvasBackground(TEST_IMAGE);
    // AIDEV-NOTE: Template zone has no URL — "Web Surfaces Missing URLs" dialog may appear; confirm to proceed
    await overlayEditPage.saveAndConfirm();
    // AIDEV-NOTE: Save navigates to edit page at /en/overlays/:id (PATTERN-002)
    await page.waitForURL((url) => url.pathname.includes('/en/overlays/') && !url.pathname.endsWith('/add'), { timeout: 15000 });
    expect(page.url()).toContain('/en/overlays');
  });

  test('edit: should rename the created overlay', async ({ page }) => {
    test.skip(isFree(), 'Overlays page redirects to /en/upgrade on Free tier');
    const overlaysPage = new OverlaysPage(page);
    const overlayEditPage = new OverlayEditPage(page);
    await overlaysPage.goto();
    await overlaysPage.verifyOverlayVisible(OVERLAY_NAME);
    await overlaysPage.clickOverlay(OVERLAY_NAME);
    await overlayEditPage.verifyOnEditPage();
    await overlayEditPage.setOverlayName(OVERLAY_UPDATED_NAME);
    await overlayEditPage.save();
    await overlaysPage.goto();
    await overlaysPage.verifyOverlayVisible(OVERLAY_UPDATED_NAME);
  });

  test('delete: should delete the overlay', async ({ page }) => {
    test.skip(isFree(), 'Overlays page redirects to /en/upgrade on Free tier');
    const overlaysPage = new OverlaysPage(page);
    await overlaysPage.goto();
    await page.waitForLoadState('networkidle');
    const optionsBtn = overlaysPage.getOptionsButtonForOverlay(OVERLAY_UPDATED_NAME);
    await optionsBtn.click();
    // AIDEV-NOTE: Trash icon opens confirmation dialog — scope Delete to dialog to avoid matching other buttons
    const dialog = page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 10000 });
    await dialog.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('heading', { name: OVERLAY_UPDATED_NAME, level: 5 })).not.toBeVisible({ timeout: 10000 });
  });
});
