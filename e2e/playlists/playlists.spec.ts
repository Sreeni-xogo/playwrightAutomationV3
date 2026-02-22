import { test, expect } from '@playwright/test';
import { PlaylistsPage } from '../pages/playlists/PlaylistsPage';
import { PlaylistEditPage } from '../pages/playlists/PlaylistEditPage';

const PLAYLIST_NAME = `AutoTest Playlist ${Date.now()}`;
const PLAYLIST_UPDATED_NAME = `AutoTest Playlist Updated ${Date.now()}`;

// ---------------------------------------------------------------------------
// Playlists List
// ---------------------------------------------------------------------------

test.describe('Playlists — list page', () => {
  test('should display page heading', async ({ page }) => {
    const playlistsPage = new PlaylistsPage(page);
    await playlistsPage.goto();
    await playlistsPage.verifyOnPlaylistsPage();
  });

  test('should display Add New link', async ({ page }) => {
    const playlistsPage = new PlaylistsPage(page);
    await playlistsPage.goto();
    await playlistsPage.verifyAddNewLinkVisible();
  });

  test('should navigate to Add New page', async ({ page }) => {
    const playlistsPage = new PlaylistsPage(page);
    await playlistsPage.goto();
    await playlistsPage.clickAddNew();
    await expect(page).toHaveURL(/\/en\/playlists\/add/);
  });
});

// ---------------------------------------------------------------------------
// Playlist CRUD — Create → Edit → Delete
// ---------------------------------------------------------------------------

test.describe('Playlists — CRUD', () => {
  test('create: should create a new playlist', async ({ page }) => {
    const playlistEditPage = new PlaylistEditPage(page);
    await page.goto('/en/playlists/add');
    await playlistEditPage.verifyOnEditPage();
    await playlistEditPage.setPlaylistName(PLAYLIST_NAME);
    await playlistEditPage.save();
    // After save, redirected to the playlists list or edit page for the new playlist
    await expect(page).toHaveURL(/\/en\/playlists/, { timeout: 10000 });
  });

  test('edit: should rename the created playlist', async ({ page }) => {
    const playlistsPage = new PlaylistsPage(page);
    const playlistEditPage = new PlaylistEditPage(page);
    await playlistsPage.goto();
    await playlistsPage.verifyPlaylistVisible(PLAYLIST_NAME);
    await playlistsPage.clickPlaylist(PLAYLIST_NAME);
    await playlistEditPage.verifyOnEditPage();
    await playlistEditPage.setPlaylistName(PLAYLIST_UPDATED_NAME);
    await playlistEditPage.save();
    await playlistsPage.goto();
    await playlistsPage.verifyPlaylistVisible(PLAYLIST_UPDATED_NAME);
  });

  test('edit: should display Schedule, Add Items, and column headers on edit page', async ({ page }) => {
    const playlistsPage = new PlaylistsPage(page);
    const playlistEditPage = new PlaylistEditPage(page);
    await playlistsPage.goto();
    await playlistsPage.clickPlaylist(PLAYLIST_UPDATED_NAME);
    await playlistEditPage.verifyOnEditPage();
    await playlistEditPage.verifySaveButtonVisible();
    await playlistEditPage.verifyScheduleLinkVisible();
    await expect(playlistEditPage.addItemsButton).toBeVisible();
  });

  test('delete: should delete the playlist', async ({ page }) => {
    const playlistsPage = new PlaylistsPage(page);
    await playlistsPage.goto();
    await playlistsPage.deletePlaylist(PLAYLIST_UPDATED_NAME);
    // Confirm dialog if present
    const confirmButton = page.getByRole('button', { name: 'Delete' }).last();
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }
    await expect(page.getByRole('heading', { name: PLAYLIST_UPDATED_NAME, level: 5 })).not.toBeVisible({ timeout: 10000 });
  });
});
