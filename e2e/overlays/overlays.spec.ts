import { test, expect } from '@playwright/test';
import { OverlaysPage } from '../pages/overlays/OverlaysPage';
import { OverlayEditPage } from '../pages/overlays/OverlayEditPage';

const OVERLAY_NAME = `AutoTest Overlay ${Date.now()}`;
const OVERLAY_UPDATED_NAME = `AutoTest Overlay Updated ${Date.now()}`;

// ---------------------------------------------------------------------------
// Overlays — List
// ---------------------------------------------------------------------------

test.describe('Overlays — list page', () => {
  test('should display page heading', async ({ page }) => {
    const overlaysPage = new OverlaysPage(page);
    await overlaysPage.goto();
    await overlaysPage.verifyOnOverlaysPage();
  });

  test('should display Add New link', async ({ page }) => {
    const overlaysPage = new OverlaysPage(page);
    await overlaysPage.goto();
    await overlaysPage.verifyAddNewLinkVisible();
  });

  test('should display pagination info', async ({ page }) => {
    const overlaysPage = new OverlaysPage(page);
    await overlaysPage.goto();
    await overlaysPage.verifyPaginationVisible();
  });

  test('should navigate to Add New overlay page', async ({ page }) => {
    const overlaysPage = new OverlaysPage(page);
    await overlaysPage.goto();
    await overlaysPage.clickAddNew();
    await expect(page).toHaveURL(/\/en\/overlays\/add/);
  });
});

// ---------------------------------------------------------------------------
// Overlays — CRUD
// ---------------------------------------------------------------------------

test.describe('Overlays — CRUD', () => {
  test('create: should display Add New overlay page elements', async ({ page }) => {
    const overlayEditPage = new OverlayEditPage(page);
    await overlayEditPage.gotoAddNew();
    await overlayEditPage.verifyOnAddNewPage();
    await overlayEditPage.verifySaveButtonVisible();
    await overlayEditPage.verifyQuickStartTemplatesVisible();
    await overlayEditPage.verifyAspectRatioInfoVisible();
  });

  test('create: should create a new overlay using Full Screen template', async ({ page }) => {
    const overlayEditPage = new OverlayEditPage(page);
    await overlayEditPage.gotoAddNew();
    await overlayEditPage.setOverlayName(OVERLAY_NAME);
    await overlayEditPage.clickFullScreenTemplate();
    await overlayEditPage.save();
    await expect(page).toHaveURL(/\/en\/overlays/, { timeout: 10000 });
  });

  test('edit: should rename the created overlay', async ({ page }) => {
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
    const overlaysPage = new OverlaysPage(page);
    await overlaysPage.goto();
    const optionsBtn = overlaysPage.getOptionsButtonForOverlay(OVERLAY_UPDATED_NAME);
    await optionsBtn.click();
    const deleteOption = page.getByRole('menuitem', { name: 'Delete' }).or(
      page.getByRole('button', { name: 'Delete' })
    );
    await deleteOption.click();
    const confirmButton = page.getByRole('button', { name: 'Delete' }).last();
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }
    await expect(page.getByRole('heading', { name: OVERLAY_UPDATED_NAME, level: 5 })).not.toBeVisible({ timeout: 10000 });
  });
});
