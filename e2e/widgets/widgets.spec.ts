import { test, expect } from '@playwright/test';
import { WidgetsPage } from '../pages/widgets/WidgetsPage';
import { WidgetEditPage } from '../pages/widgets/WidgetEditPage';

const WIDGET_NAME = `AutoTest Widget ${Date.now()}`;
const WIDGET_UPDATED_NAME = `AutoTest Widget Updated ${Date.now()}`;

// ---------------------------------------------------------------------------
// Widgets — List
// ---------------------------------------------------------------------------

test.describe('Widgets — list page', () => {
  test('should display page heading', async ({ page }) => {
    const widgetsPage = new WidgetsPage(page);
    await widgetsPage.goto();
    await widgetsPage.verifyOnWidgetsPage();
  });

  test('should display Add New button', async ({ page }) => {
    const widgetsPage = new WidgetsPage(page);
    await widgetsPage.goto();
    await widgetsPage.verifyAddNewButtonVisible();
  });

  test('should display all type filter tabs', async ({ page }) => {
    const widgetsPage = new WidgetsPage(page);
    await widgetsPage.goto();
    for (const tab of ['All', 'Clock', 'Weather', 'Timer', 'Note', 'JetSet', 'Programmatic Ads']) {
      await widgetsPage.verifyTabVisible(tab);
    }
  });

  test('should switch to Clock tab', async ({ page }) => {
    const widgetsPage = new WidgetsPage(page);
    await widgetsPage.goto();
    await widgetsPage.clickTab('Clock');
    await expect(widgetsPage.clockTab).toHaveAttribute('aria-selected', 'true');
  });

  test('should switch to Weather tab', async ({ page }) => {
    const widgetsPage = new WidgetsPage(page);
    await widgetsPage.goto();
    await widgetsPage.clickTab('Weather');
    await expect(widgetsPage.weatherTab).toHaveAttribute('aria-selected', 'true');
  });

  test('should switch to Timer tab', async ({ page }) => {
    const widgetsPage = new WidgetsPage(page);
    await widgetsPage.goto();
    await widgetsPage.clickTab('Timer');
    await expect(widgetsPage.timerTab).toHaveAttribute('aria-selected', 'true');
  });
});

// ---------------------------------------------------------------------------
// Widgets — CRUD
// AIDEV-NOTE: Widget creation opens a type-picker dialog before the edit page
// ---------------------------------------------------------------------------

test.describe('Widgets — CRUD', () => {
  test('create: should open Add New widget dialog', async ({ page }) => {
    const widgetsPage = new WidgetsPage(page);
    await widgetsPage.goto();
    await widgetsPage.clickAddNew();
    // A type picker or modal should appear
    await expect(
      page.getByRole('dialog').or(page.getByRole('heading', { name: 'Add New Widget' }))
    ).toBeVisible({ timeout: 8000 });
  });

  test('create: should create a Clock widget', async ({ page }) => {
    const widgetsPage = new WidgetsPage(page);
    const widgetEditPage = new WidgetEditPage(page);
    await widgetsPage.goto();
    await widgetsPage.clickAddNew();
    // Pick Clock type from the dialog
    await page.getByRole('button', { name: 'Clock' }).click();
    // Should land on the edit page for the new widget
    await widgetEditPage.verifyOnEditPage();
    await widgetEditPage.setWidgetName(WIDGET_NAME);
    await widgetEditPage.save();
    expect(page.url()).toContain('/en/widgets');
  });

  test('edit: should rename the created widget', async ({ page }) => {
    const widgetsPage = new WidgetsPage(page);
    const widgetEditPage = new WidgetEditPage(page);
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
    await widgetsPage.goto();
    await widgetsPage.clickWidget(WIDGET_UPDATED_NAME);
    await widgetEditPage.verifyDetailsSectionVisible();
    await widgetEditPage.verifyThemeSectionVisible();
    await expect(widgetEditPage.usedInPlaylistsSectionHeading).toBeVisible();
  });

  test('delete: should delete the widget', async ({ page }) => {
    const widgetsPage = new WidgetsPage(page);
    await widgetsPage.goto();
    const card = widgetsPage.getWidgetCard(WIDGET_UPDATED_NAME);
    // Widgets have two unlabelled action buttons — second is typically Delete
    await card.getByRole('button').last().click();
    const confirmButton = page.getByRole('button', { name: 'Delete' }).last();
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }
    await expect(page.getByRole('heading', { name: WIDGET_UPDATED_NAME, level: 5 })).not.toBeVisible({ timeout: 10000 });
  });
});
