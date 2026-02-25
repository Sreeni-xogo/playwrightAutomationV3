import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: Playlist edit/detail page — accessible at /en/playlists/:id
// Contains playlist name field, item list with drag-reorder, duration edit, visibility toggle, delete per item
export class PlaylistEditPage extends BasePage {
  readonly pageHeading: Locator;
  readonly goBackButton: Locator;
  readonly saveButton: Locator;
  readonly playlistNameInput: Locator;
  readonly scheduleLink: Locator;
  readonly addItemsButton: Locator;
  // AIDEV-NOTE: The items table header columns
  readonly resolutionColumnHeader: Locator;
  readonly durationColumnHeader: Locator;
  readonly autoDeleteColumnHeader: Locator;
  readonly visibilityColumnHeader: Locator;
  readonly actionsColumnHeader: Locator;

  constructor(page: Page) {
    super(page);
    // AIDEV-NOTE: Heading is 'Create Playlist' on /add and 'Edit Playlist' on /:id
    // filter({ hasText }) matches both without regex
    this.pageHeading = page.getByRole('heading', { level: 1 }).filter({ hasText: 'Playlist' });
    this.goBackButton = page.getByRole('button', { name: 'Go back' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.playlistNameInput = page.getByRole('textbox', { name: 'Enter playlist name' });
    // AIDEV-NOTE: Schedule link navigates to /en/playlists/:id/schedule
    this.scheduleLink = page.getByRole('link', { name: 'Schedule' });
    this.addItemsButton = page.getByRole('button', { name: 'Add Items' });
    this.resolutionColumnHeader = page.getByText('Resolution');
    this.durationColumnHeader = page.getByText('Duration');
    this.autoDeleteColumnHeader = page.getByText('Auto-Delete');
    this.visibilityColumnHeader = page.getByText('Visibility');
    this.actionsColumnHeader = page.getByText('Actions');
  }

  async goto(playlistId: string): Promise<void> {
    await this.navigate(`/en/playlists/${playlistId}`);
    await this.waitForLoadAndElement(this.pageHeading);
  }

  async goBack(): Promise<void> {
    await this.goBackButton.click();
    // AIDEV-NOTE: SPA nav back to playlists list (PATTERN-002)
    await this.page.waitForURL((url) => url.pathname.includes('/en/playlists'), { timeout: 10000 });
  }

  async setPlaylistName(name: string): Promise<void> {
    // AIDEV-NOTE: networkidle before fill() — Vue v-model binding (PATTERN-001)
    await this.page.waitForLoadState('networkidle');
    await this.playlistNameInput.clear();
    await this.playlistNameInput.fill(name);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async clickAddItems(): Promise<void> {
    await this.addItemsButton.click();
  }

  // AIDEV-NOTE: App blocks saving empty playlists — must add at least one item first (PATTERN-009)
  // Opens the Add Items dialog, switches to URLs tab, adds the first URL item, confirms
  async addOneItemFromLibrary(): Promise<void> {
    await this.addItemsButton.click();
    const dialog = this.page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 10000 });
    // URLs tab — deterministic items, no file uploads required
    await dialog.getByRole('tab', { name: 'URLs' }).click();
    await this.page.waitForLoadState('networkidle');
    // Click first URL item's per-row Add button (stages it for addition)
    await dialog.getByRole('heading', { level: 4 }).first().locator('../..').getByRole('button', { name: 'Add' }).click();
    // Top-level Add button (dialog header) is enabled once an item is staged
    const confirmBtn = dialog.getByRole('button', { name: 'Add' }).first();
    await expect(confirmBtn).toBeEnabled({ timeout: 5000 });
    await confirmBtn.click();
    await dialog.waitFor({ state: 'hidden', timeout: 10000 });
  }

  async clickScheduleLink(): Promise<void> {
    await this.scheduleLink.click();
    await this.waitForLoad();
  }

  // AIDEV-NOTE: Returns the row container for a specific media item by its filename/alt text
  getItemRow(fileName: string): Locator {
    return this.page.getByText(fileName).locator('../..');
  }

  // AIDEV-NOTE: The drag-to-reorder handle for a specific item
  getDragHandleForItem(fileName: string): Locator {
    return this.getItemRow(fileName).getByRole('button', { name: 'Drag to reorder' });
  }

  getEditDurationButtonForItem(fileName: string): Locator {
    // AIDEV-NOTE: Duration button text shows current duration value e.g. "15s"
    return this.getItemRow(fileName).getByRole('button', { name: 'Edit duration' });
  }

  getAutoDeleteSwitchForItem(fileName: string): Locator {
    return this.getItemRow(fileName).getByRole('switch', { name: 'Auto-Delete' });
  }

  getVisibilityButtonForItem(fileName: string): Locator {
    return this.getItemRow(fileName).getByRole('button', { name: 'Visible' });
  }

  getDeleteButtonForItem(fileName: string): Locator {
    return this.getItemRow(fileName).getByRole('button', { name: 'Delete' });
  }

  async deleteItem(fileName: string): Promise<void> {
    await this.getDeleteButtonForItem(fileName).click();
  }

  async verifyOnEditPage(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
  }

  async verifyPlaylistName(expectedName: string): Promise<void> {
    await expect(this.playlistNameInput).toHaveValue(expectedName);
  }

  async verifySaveButtonVisible(): Promise<void> {
    await expect(this.saveButton).toBeVisible();
  }

  async verifyItemVisible(fileName: string): Promise<void> {
    await expect(this.page.getByText(fileName)).toBeVisible();
  }

  async verifyScheduleLinkVisible(): Promise<void> {
    await expect(this.scheduleLink).toBeVisible();
  }
}
