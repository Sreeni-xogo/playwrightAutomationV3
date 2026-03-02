import { test, expect } from '@playwright/test';
import { WidgetsPage } from '../pages/widgets/WidgetsPage';
import { WidgetEditPage } from '../pages/widgets/WidgetEditPage';
import { isFree } from '../utils/tierGuard';

// AIDEV-NOTE: Requires authenticated session — setup saves .auth/state.json, consumed here
test.use({ storageState: '.auth/state.json' });
// AIDEV-NOTE: Free tier — /en/widgets redirects to /en/upgrade. Tests assert redirect; Pro runs full CRUD.

const WIDGET_NAME = `AutoTest Widget ${Date.now()}`;
const WIDGET_UPDATED_NAME = `AutoTest Widget Updated ${Date.now()}`;

// ---------------------------------------------------------------------------
// Widgets — List
// ---------------------------------------------------------------------------

test.describe('Widgets — list page', () => {
  test('should display page heading', async ({ page }) => {
    const widgetsPage = new WidgetsPage(page);
    if (isFree()) {
      await page.goto('/en/widgets');
      await expect(page).toHaveURL('/en/upgrade');
      return;
    }
    await widgetsPage.goto();
    await widgetsPage.verifyOnWidgetsPage();
  });

  test('should display Add New button', async ({ page }) => {
    const widgetsPage = new WidgetsPage(page);
    if (isFree()) {
      await page.goto('/en/widgets');
      await expect(page).toHaveURL('/en/upgrade');
      return;
    }
    await widgetsPage.goto();
    await widgetsPage.verifyAddNewButtonVisible();
  });

  test('should display all type filter tabs', async ({ page }) => {
    const widgetsPage = new WidgetsPage(page);
    if (isFree()) {
      await page.goto('/en/widgets');
      await expect(page).toHaveURL('/en/upgrade');
      return;
    }
    await widgetsPage.goto();
    for (const tab of ['All', 'Clock', 'Weather', 'Timer', 'Note', 'JetSet', 'Programmatic Ads']) {
      await widgetsPage.verifyTabVisible(tab);
    }
  });

  test('should switch to Clock tab', async ({ page }) => {
    const widgetsPage = new WidgetsPage(page);
    if (isFree()) {
      await page.goto('/en/widgets');
      await expect(page).toHaveURL('/en/upgrade');
      return;
    }
    await widgetsPage.goto();
    await widgetsPage.clickTab('Clock');
    await expect(widgetsPage.clockTab).toHaveAttribute('aria-selected', 'true');
  });

  test('should switch to Weather tab', async ({ page }) => {
    const widgetsPage = new WidgetsPage(page);
    if (isFree()) {
      await page.goto('/en/widgets');
      await expect(page).toHaveURL('/en/upgrade');
      return;
    }
    await widgetsPage.goto();
    await widgetsPage.clickTab('Weather');
    await expect(widgetsPage.weatherTab).toHaveAttribute('aria-selected', 'true');
  });

  test('should switch to Timer tab', async ({ page }) => {
    const widgetsPage = new WidgetsPage(page);
    if (isFree()) {
      await page.goto('/en/widgets');
      await expect(page).toHaveURL('/en/upgrade');
      return;
    }
    await widgetsPage.goto();
    await widgetsPage.clickTab('Timer');
    await expect(widgetsPage.timerTab).toHaveAttribute('aria-selected', 'true');
  });
});

// ---------------------------------------------------------------------------
// Widgets — CRUD
// AIDEV-NOTE: Add New opens a dropdown menu (not dialog) with type options
// AIDEV-NOTE: Clock menuitem navigates to /en/widgets/add?type=WidgetClock ("Create Widget" heading)
// ---------------------------------------------------------------------------

// AIDEV-NOTE: CRUD tests share module-level name constants — must run serially
test.describe.serial('Widgets — CRUD', () => {
  test('create: should open Add New widget menu', async ({ page }) => {
    const widgetsPage = new WidgetsPage(page);
    if (isFree()) {
      await page.goto('/en/widgets');
      await expect(page).toHaveURL('/en/upgrade');
      return;
    }
    await widgetsPage.goto();
    await widgetsPage.clickAddNew();
    // AIDEV-NOTE: Add New opens a dropdown menu with Clock/Timer/Weather/Note/JetSet/Programmatic Ads options
    await expect(page.getByRole('menu', { name: 'Add New' })).toBeVisible({ timeout: 8000 });
  });

  test('create: should create a Clock widget', async ({ page }) => {
    const widgetsPage = new WidgetsPage(page);
    const widgetEditPage = new WidgetEditPage(page);
    if (isFree()) {
      await page.goto('/en/widgets');
      await expect(page).toHaveURL('/en/upgrade');
      return;
    }
    await widgetsPage.goto();
    await widgetsPage.clickAddNew();
    // AIDEV-NOTE: Type picker is a dropdown menu — use menuitem role (not button)
    await page.getByRole('menuitem', { name: 'Clock' }).click();
    // AIDEV-NOTE: Navigates to /en/widgets/add?type=WidgetClock with heading 'Create Widget'
    await widgetEditPage.verifyOnEditPage();
    await widgetEditPage.setWidgetName(WIDGET_NAME);
    await widgetEditPage.save();
    // AIDEV-NOTE: save() waits for navigation from /add to /en/widgets/:id
    expect(page.url()).toContain('/en/widgets');
  });

  test('edit: should rename the created widget', async ({ page }) => {
    const widgetsPage = new WidgetsPage(page);
    const widgetEditPage = new WidgetEditPage(page);
    if (isFree()) {
      await page.goto('/en/widgets');
      await expect(page).toHaveURL('/en/upgrade');
      return;
    }
    await widgetsPage.goto();
    await widgetsPage.verifyWidgetVisible(WIDGET_NAME);
    await widgetsPage.clickWidget(WIDGET_NAME);
    await widgetEditPage.verifyOnEditPage();
    await widgetEditPage.setWidgetName(WIDGET_UPDATED_NAME);
    await widgetEditPage.save();
    await widgetsPage.goto();
    await widgetsPage.verifyWidgetVisible(WIDGET_UPDATED_NAME);
  });

  test('edit: should display Details, Theme, and Used in Playlists sections', async ({ page }) => {
    const widgetsPage = new WidgetsPage(page);
    const widgetEditPage = new WidgetEditPage(page);
    if (isFree()) {
      await page.goto('/en/widgets');
      await expect(page).toHaveURL('/en/upgrade');
      return;
    }
    await widgetsPage.goto();
    await widgetsPage.clickWidget(WIDGET_UPDATED_NAME);
    await widgetEditPage.verifyDetailsSectionVisible();
    await widgetEditPage.verifyThemeSectionVisible();
    await expect(widgetEditPage.usedInPlaylistsSectionHeading).toBeVisible();
  });

  test('delete: should delete the widget', async ({ page }) => {
    const widgetsPage = new WidgetsPage(page);
    if (isFree()) {
      await page.goto('/en/widgets');
      await expect(page).toHaveURL('/en/upgrade');
      return;
    }
    await widgetsPage.goto();
    const card = widgetsPage.getWidgetCard(WIDGET_UPDATED_NAME);
    // AIDEV-NOTE: Two unlabelled action buttons — last is typically Delete
    await card.getByRole('button').last().click();
    // AIDEV-NOTE: Confirmation dialog may appear — scope Delete button to dialog
    const dialog = page.getByRole('dialog');
    try {
      await dialog.waitFor({ state: 'visible', timeout: 10000 });
      await dialog.getByRole('button', { name: 'Delete' }).click();
    } catch {
      // No dialog — direct delete without confirmation
      const confirmButton = page.getByRole('button', { name: 'Delete' }).last();
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
      }
    }
    await expect(page.getByRole('heading', { name: WIDGET_UPDATED_NAME, level: 5 })).not.toBeVisible({ timeout: 10000 });
  });
});
