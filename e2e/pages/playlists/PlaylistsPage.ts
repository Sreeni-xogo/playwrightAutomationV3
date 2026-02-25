import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: Playlists list page — shows paginated grid of all playlists with sort, create, duplicate and delete actions
export class PlaylistsPage extends BasePage {
  readonly pageHeading: Locator;
  readonly playlistCount: Locator;
  readonly addNewLink: Locator;
  readonly sortButton: Locator;
  readonly playlistGrid: Locator;
  readonly paginationNav: Locator;
  readonly firstPageButton: Locator;
  readonly previousPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly lastPageButton: Locator;
  readonly paginationInfo: Locator;

  constructor(page: Page) {
    super(page);
    // AIDEV-NOTE: Page heading and count badge sit inside the content area header
    this.pageHeading = page.getByRole('heading', { name: 'Playlists', level: 1 });
    this.playlistCount = page.locator('h1').locator('..').locator('> *').nth(1);
    // AIDEV-NOTE: "Add New" is a link (not button) that routes to /en/playlists/add
    this.addNewLink = page.getByRole('link', { name: 'Add New' });
    this.sortButton = page.getByRole('button', { name: 'Date Added: Newest' });
    // AIDEV-NOTE: The grid containing all playlist card items
    this.playlistGrid = page.locator('main').getByRole('link', { name: 'Add New' }).locator('../../..').locator('> *').nth(2);
    this.paginationNav = page.getByRole('navigation').filter({ has: page.getByRole('button', { name: 'First Page' }) });
    this.firstPageButton = page.getByRole('button', { name: 'First Page' });
    this.previousPageButton = page.getByRole('button', { name: 'Previous Page' });
    this.nextPageButton = page.getByRole('button', { name: 'Next Page' });
    this.lastPageButton = page.getByRole('button', { name: 'Last Page' });
    // AIDEV-NOTE: Shows "Showing X-Y of Z" summary text
    this.paginationInfo = page.locator('main').getByText('Showing');
  }

  async goto(): Promise<void> {
    await this.navigate('/en/playlists');
    await this.waitForLoadAndElement(this.pageHeading);
  }

  // AIDEV-NOTE: Locates a playlist card by its exact heading name
  getPlaylistCard(name: string): Locator {
    return this.page.getByRole('heading', { name, level: 5 }).locator('../../../..');
  }

  // AIDEV-NOTE: Returns the clickable link for a playlist item by heading name
  getPlaylistLink(name: string): Locator {
    return this.page.getByRole('heading', { name, level: 5 }).locator('../../..').getByRole('link');
  }

  getDuplicateButtonForPlaylist(name: string): Locator {
    return this.page.getByRole('heading', { name, level: 5 }).locator('../..').getByRole('button', { name: 'Duplicate Playlist' });
  }

  getDeleteButtonForPlaylist(name: string): Locator {
    return this.page.getByRole('heading', { name, level: 5 }).locator('../..').getByRole('button', { name: 'Delete' });
  }

  async clickAddNew(): Promise<void> {
    await this.addNewLink.click();
    await this.waitForLoad();
  }

  async clickPlaylist(name: string): Promise<void> {
    await this.getPlaylistLink(name).click();
    await this.waitForLoad();
  }

  async duplicatePlaylist(name: string): Promise<void> {
    await this.getDuplicateButtonForPlaylist(name).click();
  }

  async deletePlaylist(name: string): Promise<void> {
    await this.getDeleteButtonForPlaylist(name).click();
  }

  async clickSortButton(): Promise<void> {
    await this.sortButton.click();
  }

  async clickPageButton(pageNumber: number): Promise<void> {
    await this.page.getByRole('button', { name: `Page ${pageNumber}` }).click();
  }

  async verifyOnPlaylistsPage(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
  }

  async verifyAddNewLinkVisible(): Promise<void> {
    await expect(this.addNewLink).toBeVisible();
  }

  async verifyPaginationVisible(): Promise<void> {
    await expect(this.paginationInfo).toBeVisible();
  }

  async verifyPlaylistVisible(name: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name, level: 5 })).toBeVisible();
  }
}
