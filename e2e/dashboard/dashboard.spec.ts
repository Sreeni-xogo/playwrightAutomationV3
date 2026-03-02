import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { isFree } from '../utils/tierGuard';

// AIDEV-NOTE: Requires authenticated session — setup saves .auth/state.json, consumed here
test.use({ storageState: '.auth/state.json' });

test.describe('Dashboard', () => {
  test('should display page heading and Add New button', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await dashboardPage.verifyPageLoaded();
  });

  test('should display all sidebar navigation links', async ({ page }) => {
    // AIDEV-NOTE: Free tier — Planner/Overlays/Widgets are upgrade buttons, Teams not shown
    test.skip(isFree(), 'Sidebar nav links differ on Free tier — Planner/Overlays/Widgets are buttons, Teams absent');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await dashboardPage.verifyNavLinksVisible();
  });

  test('should display Library summary section', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await dashboardPage.verifyLibrarySectionVisible();
  });

  test('should display Playlists summary section', async ({ page }) => {
    // AIDEV-NOTE: Free tier — Playlists section exists but has no "View All" link
    test.skip(isFree(), 'Playlists View All link absent on Free tier dashboard');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await dashboardPage.verifyPlaylistsSectionVisible();
  });

  test('should display Players summary section', async ({ page }) => {
    // AIDEV-NOTE: Free tier — Players section exists but has no "View All" link
    test.skip(isFree(), 'Players View All link absent on Free tier dashboard');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await dashboardPage.verifyPlayersSectionVisible();
  });

  test('should navigate to Library via sidebar link', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await dashboardPage.clickNavLibrary();
    expect(page.url()).toContain('/en/library');
  });

  test('should navigate to Playlists via sidebar link', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await dashboardPage.clickNavPlaylists();
    expect(page.url()).toContain('/en/playlists');
  });

  test('should navigate to Players via sidebar link', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await dashboardPage.clickNavPlayers();
    expect(page.url()).toContain('/en/players');
  });

  test('should navigate to Library via View All link', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await dashboardPage.clickLibraryViewAll();
    expect(page.url()).toContain('/en/library');
  });

  test('should navigate to Playlists via View All link', async ({ page }) => {
    test.skip(isFree(), 'Playlists View All link absent on Free tier dashboard');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await dashboardPage.clickPlaylistsViewAll();
    expect(page.url()).toContain('/en/playlists');
  });

  test('should navigate to Players via View All link', async ({ page }) => {
    test.skip(isFree(), 'Players View All link absent on Free tier dashboard');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await dashboardPage.clickPlayersViewAll();
    expect(page.url()).toContain('/en/players');
  });
});
