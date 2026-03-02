import { test, expect } from '@playwright/test';
import { PlaylistsPage } from '../pages/playlists/PlaylistsPage';
import { PlaylistEditPage } from '../pages/playlists/PlaylistEditPage';
import { isFree } from '../utils/tierGuard';

// AIDEV-NOTE: Requires authenticated session — setup saves .auth/state.json, consumed here
test.use({ storageState: '.auth/state.json' });

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
    await expect(page).toHaveURL('/en/playlists/add');
  });
});

// ---------------------------------------------------------------------------
// Playlist CRUD — Create → Edit → Delete
// ---------------------------------------------------------------------------

// AIDEV-NOTE: CRUD tests share state (create → edit → delete same playlist) — must run serially
test.describe('Playlists — CRUD', () => {
  test.describe.configure({ mode: 'serial' });

  test('create: should create a new playlist', async ({ page }) => {
    // AIDEV-NOTE: Free tier — addOneItemFromLibrary() requires URL assets; Free account has no URL items
    test.skip(isFree(), 'Playlist CRUD skipped on Free — no URL assets available in library');
    const playlistEditPage = new PlaylistEditPage(page);
    await page.goto('/en/playlists/add');
    await playlistEditPage.verifyOnEditPage();
    await playlistEditPage.setPlaylistName(PLAYLIST_NAME);
    // AIDEV-NOTE: App blocks saving empty playlists — must add one item first (PATTERN-009)
    await playlistEditPage.addOneItemFromLibrary();
    await playlistEditPage.save();
    // AIDEV-NOTE: After save with items, app navigates away from /add to /en/playlists/:id
    await page.waitForURL(url => !url.pathname.endsWith('/add'), { timeout: 15000 });
    expect(page.url()).toContain('/en/playlists/');
  });

  test('edit: should rename the created playlist', async ({ page }) => {
    test.skip(isFree(), 'Playlist CRUD skipped on Free — no URL assets available in library');
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
    test.skip(isFree(), 'Playlist CRUD skipped on Free — no URL assets available in library');
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
    test.skip(isFree(), 'Playlist CRUD skipped on Free — no URL assets available in library');
    const playlistsPage = new PlaylistsPage(page);
    await playlistsPage.goto();
    await playlistsPage.deletePlaylist(PLAYLIST_UPDATED_NAME);
    // AIDEV-NOTE: Confirmation dialog always appears — waitFor before click (PATTERN-008)
    const confirmDeleteButton = page.getByRole('dialog').getByRole('button', { name: 'Delete' });
    await confirmDeleteButton.waitFor({ state: 'visible', timeout: 10000 });
    await confirmDeleteButton.click();
    await expect(page.locator('h5', { hasText: PLAYLIST_UPDATED_NAME })).not.toBeVisible({ timeout: 10000 });
  });
});
