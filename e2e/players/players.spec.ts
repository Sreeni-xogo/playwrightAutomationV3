import { test, expect } from '@playwright/test';
import { PlayersPage } from '../pages/players/PlayersPage';
import { PlayerDetailPage } from '../pages/players/PlayerDetailPage';

// ---------------------------------------------------------------------------
// Players — List Page (UI only, no player creation)
// ---------------------------------------------------------------------------

test.describe('Players — list page', () => {
  test('should display page heading', async ({ page }) => {
    const playersPage = new PlayersPage(page);
    await playersPage.goto();
    await playersPage.verifyOnPlayersPage();
  });

  test('should display Add New button', async ({ page }) => {
    const playersPage = new PlayersPage(page);
    await playersPage.goto();
    await playersPage.verifyAddNewButtonVisible();
  });

  test('should display Sort, Filter, and Select buttons', async ({ page }) => {
    const playersPage = new PlayersPage(page);
    await playersPage.goto();
    await expect(playersPage.sortButton).toBeVisible();
    await expect(playersPage.filterButton).toBeVisible();
    await expect(playersPage.selectButton).toBeVisible();
  });

  test('should display pagination info', async ({ page }) => {
    const playersPage = new PlayersPage(page);
    await playersPage.goto();
    await playersPage.verifyPaginationInfoVisible();
  });

  test('should open Sort dropdown', async ({ page }) => {
    const playersPage = new PlayersPage(page);
    await playersPage.goto();
    await playersPage.clickSort();
    // Sort dropdown opens — verify a sort option is visible
    await expect(page.getByRole('option', { name: 'Date Added: Newest' }).or(
      page.getByRole('menuitem').first()
    )).toBeVisible();
  });

  test('should enter Select mode', async ({ page }) => {
    const playersPage = new PlayersPage(page);
    await playersPage.goto();
    await playersPage.clickSelect();
    // After clicking Select, a cancel/done button or selection checkboxes appear
    await expect(
      page.getByRole('button', { name: 'Cancel' }).or(page.getByRole('button', { name: 'Done' }))
    ).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Player Create Page — UI only (do not actually create a player)
// ---------------------------------------------------------------------------

test.describe('Players — Add New page (UI only)', () => {
  test('should navigate to Add New page via Add New button', async ({ page }) => {
    const playersPage = new PlayersPage(page);
    await playersPage.goto();
    await playersPage.clickAddNew();
    // Add New button opens a dialog, modal, or navigates to an add page
    await expect(
      page.getByRole('heading', { name: 'Add New' }).or(
        page.getByRole('dialog')
      )
    ).toBeVisible({ timeout: 8000 });
  });
});

// ---------------------------------------------------------------------------
// Player Edit Page — UI only (navigate to the first existing player if any)
// ---------------------------------------------------------------------------

test.describe('Players — edit page (UI only)', () => {
  test('should display edit page elements for the first player', async ({ page }) => {
    const playersPage = new PlayersPage(page);
    const playerDetailPage = new PlayerDetailPage(page);
    await playersPage.goto();
    // AIDEV-NOTE: Click first player card link to open its edit page
    const firstPlayerLink = page.getByRole('link').filter({ hasText: '' }).nth(2);
    const playerCards = page.getByRole('heading', { level: 5 });
    const count = await playerCards.count();
    if (count === 0) {
      test.skip();
      return;
    }
    // Navigate via the first player card link
    await page.getByRole('heading', { level: 5 }).first().locator('../../..').getByRole('link').click();
    await playerDetailPage.verifyOnEditPage();
    await playerDetailPage.verifySaveButtonVisible();
    await playerDetailPage.verifyAdvancedConfigButtonVisible();
  });

  test('should display firmware version info row on player edit page', async ({ page }) => {
    const playersPage = new PlayersPage(page);
    const playerDetailPage = new PlayerDetailPage(page);
    await playersPage.goto();
    const playerCards = page.getByRole('heading', { level: 5 });
    if (await playerCards.count() === 0) {
      test.skip();
      return;
    }
    await page.getByRole('heading', { level: 5 }).first().locator('../../..').getByRole('link').click();
    await playerDetailPage.verifyFirmwareVersionVisible();
    await playerDetailPage.verifyOsVersionVisible();
  });

  test('should display dropdown controls on player edit page', async ({ page }) => {
    const playersPage = new PlayersPage(page);
    const playerDetailPage = new PlayerDetailPage(page);
    await playersPage.goto();
    if (await page.getByRole('heading', { level: 5 }).count() === 0) {
      test.skip();
      return;
    }
    await page.getByRole('heading', { level: 5 }).first().locator('../../..').getByRole('link').click();
    await expect(playerDetailPage.timezoneDropdown).toBeVisible();
    await expect(playerDetailPage.licenseDropdown).toBeVisible();
    await expect(playerDetailPage.associatedPlaylistDropdown).toBeVisible();
    await expect(playerDetailPage.displayOrientationDropdown).toBeVisible();
  });

  test('should navigate back to players list from edit page', async ({ page }) => {
    const playersPage = new PlayersPage(page);
    const playerDetailPage = new PlayerDetailPage(page);
    await playersPage.goto();
    if (await page.getByRole('heading', { level: 5 }).count() === 0) {
      test.skip();
      return;
    }
    await page.getByRole('heading', { level: 5 }).first().locator('../../..').getByRole('link').click();
    await playerDetailPage.goBack();
    await expect(page).toHaveURL(/\/en\/players/);
  });
});
