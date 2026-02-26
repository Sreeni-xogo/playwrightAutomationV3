import { test, expect } from '@playwright/test';
import { PlayersPage } from '../pages/players/PlayersPage';
import { PlayerDetailPage } from '../pages/players/PlayerDetailPage';

// AIDEV-NOTE: Requires authenticated session — staging-setup saves state, consumed here
test.use({ storageState: '.auth/staging-state.json' });

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
    // AIDEV-NOTE: Add New navigates to Create Player full page at /en/players/add (not a dialog)
    await expect(page.getByRole('heading', { level: 1 }).filter({ hasText: 'Player' })).toBeVisible({ timeout: 8000 });
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
    // AIDEV-NOTE: networkidle ensures player cards (API-fetched) are rendered before count check
    await page.waitForLoadState('networkidle');
    const playerCards = page.getByRole('heading', { level: 5 });
    const count = await playerCards.count();
    if (count === 0) {
      test.skip();
      return;
    }
    // AIDEV-NOTE: Player card link — .tile > a.card (PATTERN-010: link is sibling to card-footer)
    // AIDEV-NOTE: Player card link is a.absolute inside div.card, sibling of div.card-footer with h5
    await page.getByRole('heading', { level: 5 }).first().locator('../../../..').locator('div.card a').click();
    await page.waitForURL((url) => url.pathname.includes('/en/players/'), { timeout: 10000 });
    await playerDetailPage.verifyOnEditPage();
    await playerDetailPage.verifySaveButtonVisible();
    await playerDetailPage.verifyAdvancedConfigButtonVisible();
  });

  test('should display firmware version info row on player edit page', async ({ page }) => {
    const playersPage = new PlayersPage(page);
    const playerDetailPage = new PlayerDetailPage(page);
    await playersPage.goto();
    await page.waitForLoadState('networkidle');
    if (await page.getByRole('heading', { level: 5 }).count() === 0) {
      test.skip();
      return;
    }
    // AIDEV-NOTE: Player card link is a.absolute inside div.card, sibling of div.card-footer with h5
    await page.getByRole('heading', { level: 5 }).first().locator('../../../..').locator('div.card a').click();
    await page.waitForURL((url) => url.pathname.includes('/en/players/'), { timeout: 10000 });
    await playerDetailPage.verifyFirmwareVersionVisible();
    await playerDetailPage.verifyOsVersionVisible();
  });

  test('should display dropdown controls on player edit page', async ({ page }) => {
    const playersPage = new PlayersPage(page);
    const playerDetailPage = new PlayerDetailPage(page);
    await playersPage.goto();
    await page.waitForLoadState('networkidle');
    if (await page.getByRole('heading', { level: 5 }).count() === 0) {
      test.skip();
      return;
    }
    // AIDEV-NOTE: Player card link is a.absolute inside div.card, sibling of div.card-footer with h5
    await page.getByRole('heading', { level: 5 }).first().locator('../../../..').locator('div.card a').click();
    await page.waitForURL((url) => url.pathname.includes('/en/players/'), { timeout: 10000 });
    await expect(playerDetailPage.timezoneDropdown).toBeVisible();
    await expect(playerDetailPage.licenseDropdown).toBeVisible();
    await expect(playerDetailPage.associatedPlaylistDropdown).toBeVisible();
    await expect(playerDetailPage.displayOrientationDropdown).toBeVisible();
  });

  test('should navigate back to players list from edit page', async ({ page }) => {
    const playersPage = new PlayersPage(page);
    const playerDetailPage = new PlayerDetailPage(page);
    await playersPage.goto();
    await page.waitForLoadState('networkidle');
    if (await page.getByRole('heading', { level: 5 }).count() === 0) {
      test.skip();
      return;
    }
    // AIDEV-NOTE: Player card link is a.absolute inside div.card, sibling of div.card-footer with h5
    await page.getByRole('heading', { level: 5 }).first().locator('../../../..').locator('div.card a').click();
    await page.waitForURL((url) => url.pathname.includes('/en/players/'), { timeout: 10000 });
    await playerDetailPage.goBack();
    // AIDEV-NOTE: goBack() already awaits waitForURL — just verify final URL (PATTERN-002)
    expect(page.url()).toContain('/en/players');
    expect(page.url()).not.toContain('/en/players/');
  });
});
