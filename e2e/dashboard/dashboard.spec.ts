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
    // AIDEV-NOTE: Free tier — Planner/Overlays/Widgets are upgrade buttons (not links), Teams not shown
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    if (isFree()) {
      await expect(page.getByRole('button', { name: 'Planner' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Overlays' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Widgets' })).toBeVisible();
    } else {
      await dashboardPage.verifyNavLinksVisible();
    }
  });

  test('should display Library summary section', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await dashboardPage.verifyLibrarySectionVisible();
  });

  test('should display Playlists summary section', async ({ page }) => {
    // AIDEV-NOTE: Free tier — Playlists section heading exists but has no "View All" link
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await expect(dashboardPage.playlistsSectionHeading).toBeVisible();
    if (!isFree()) {
      await expect(dashboardPage.playlistsViewAllLink).toBeVisible();
    }
  });

  test('should display Players summary section', async ({ page }) => {
    // AIDEV-NOTE: Free tier — Players section heading exists but has no "View All" link
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await expect(dashboardPage.playersSectionHeading).toBeVisible();
    if (!isFree()) {
      await expect(dashboardPage.playersViewAllLink).toBeVisible();
    }
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
    // AIDEV-NOTE: Free tier — Playlists View All link absent; assert heading visible + link absent
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    if (isFree()) {
      await expect(dashboardPage.playlistsSectionHeading).toBeVisible();
      await expect(dashboardPage.playlistsViewAllLink).not.toBeVisible();
    } else {
      await dashboardPage.clickPlaylistsViewAll();
      expect(page.url()).toContain('/en/playlists');
    }
  });

  test('should navigate to Players via View All link', async ({ page }) => {
    // AIDEV-NOTE: Free tier — Players View All link absent; assert heading visible + link absent
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    if (isFree()) {
      await expect(dashboardPage.playersSectionHeading).toBeVisible();
      await expect(dashboardPage.playersViewAllLink).not.toBeVisible();
    } else {
      await dashboardPage.clickPlayersViewAll();
      expect(page.url()).toContain('/en/players');
    }
  });
});
