import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: LibraryPage represents /en/library.
// It shows a paginated grid of media assets (images, videos, URLs, widgets).
// Filtering by type is done via tabs. "Add New" opens a dropdown to choose
// Media / URL / Widget. Each card shows a thumbnail, name, Copy button, and a context-menu button.
export class LibraryPage extends BasePage {
  // --- Page heading and count ---
  readonly pageHeading: Locator;
  // AIDEV-NOTE: The item count is a sibling generic next to the h1 "Library" heading
  readonly itemCount: Locator;

  // --- Add New dropdown trigger ---
  readonly addNewButton: Locator;

  // --- Add New dropdown menu items ---
  readonly addNewMediaMenuItem: Locator;
  readonly addNewUrlMenuItem: Locator;
  readonly addNewWidgetMenuItem: Locator;

  // --- Tabs for filtering asset types ---
  readonly tabAll: Locator;
  readonly tabImages: Locator;
  readonly tabVideos: Locator;
  readonly tabUrls: Locator;
  readonly tabWidgets: Locator;

  // --- Sort / Filter / Select / View controls ---
  // AIDEV-NOTE: Sort button label is dynamic (e.g. "Date Added: Newest") so match by partial text
  readonly sortButton: Locator;
  readonly filterButton: Locator;
  readonly selectButton: Locator;

  // --- Pagination controls ---
  readonly paginationInfo: Locator;
  readonly firstPageButton: Locator;
  readonly prevPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly lastPageButton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.getByRole('heading', { name: 'Library', level: 1 });
    // AIDEV-NOTE: item count sits as adjacent sibling to h1 — locate via parent then child text
    this.itemCount = page.locator('h1:has-text("Library") + *');

    this.addNewButton = page.getByRole('button', { name: 'Add New' });

    this.addNewMediaMenuItem = page.getByRole('menuitem', { name: 'Media' });
    this.addNewUrlMenuItem = page.getByRole('menuitem', { name: 'URL' });
    this.addNewWidgetMenuItem = page.getByRole('menuitem', { name: 'Widget' });

    this.tabAll = page.getByRole('tab', { name: 'All' });
    this.tabImages = page.getByRole('tab', { name: 'Images' });
    this.tabVideos = page.getByRole('tab', { name: 'Videos' });
    this.tabUrls = page.getByRole('tab', { name: 'URLs' });
    this.tabWidgets = page.getByRole('tab', { name: 'Widgets' });

    // AIDEV-NOTE: Sort button text includes the current sort option, match with partial text
    this.sortButton = page.getByRole('button', { name: 'Date Added: Newest' });
    this.filterButton = page.getByRole('button', { name: 'Filter' });
    this.selectButton = page.getByRole('button', { name: 'Select' });

    this.paginationInfo = page.getByText('Showing').filter({ hasText: 'of' });
    this.firstPageButton = page.getByRole('button', { name: 'First Page' });
    this.prevPageButton = page.getByRole('button', { name: 'Previous Page' });
    this.nextPageButton = page.getByRole('button', { name: 'Next Page' });
    this.lastPageButton = page.getByRole('button', { name: 'Last Page' });
  }

  // --- Navigation ---

  async goto(): Promise<void> {
    await this.navigate('/en/library');
    await this.waitForLoad();
  }

  // --- Add New actions ---

  async openAddNewMenu(): Promise<void> {
    await this.addNewButton.click();
  }

  async clickAddNewMedia(): Promise<void> {
    await this.openAddNewMenu();
    await this.addNewMediaMenuItem.click();
  }

  async clickAddNewUrl(): Promise<void> {
    await this.openAddNewMenu();
    await this.addNewUrlMenuItem.click();
  }

  async clickAddNewWidget(): Promise<void> {
    await this.openAddNewMenu();
    await this.addNewWidgetMenuItem.click();
  }

  // --- Tab filtering ---

  async filterByAll(): Promise<void> {
    await this.tabAll.click();
  }

  async filterByImages(): Promise<void> {
    await this.tabImages.click();
  }

  async filterByVideos(): Promise<void> {
    await this.tabVideos.click();
  }

  async filterByUrls(): Promise<void> {
    await this.tabUrls.click();
  }

  async filterByWidgets(): Promise<void> {
    await this.tabWidgets.click();
  }

  // --- Item interaction ---

  // AIDEV-NOTE: Clicks the first asset card link to navigate to its edit/detail page
  async clickFirstItem(): Promise<void> {
    await this.page.locator('h5').first().click();
  }

  // Returns the name text of the first visible asset card
  async getFirstItemName(): Promise<string> {
    return this.page.locator('h5').first().innerText();
  }

  // Click copy button on the first card
  async clickCopyOnFirstItem(): Promise<void> {
    await this.page.getByRole('button', { name: 'Copy' }).first().click();
  }

  // --- Pagination ---

  async goToNextPage(): Promise<void> {
    await this.nextPageButton.click();
  }

  async goToPrevPage(): Promise<void> {
    await this.prevPageButton.click();
  }

  async goToFirstPage(): Promise<void> {
    await this.firstPageButton.click();
  }

  async goToLastPage(): Promise<void> {
    await this.lastPageButton.click();
  }

  async goToPage(pageNumber: number): Promise<void> {
    await this.page.getByRole('button', { name: `Page ${pageNumber}` }).click();
  }

  // --- Verify methods ---

  async verifyPageLoaded(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.addNewButton).toBeVisible();
    await expect(this.tabAll).toBeVisible();
  }

  async verifyTabsVisible(): Promise<void> {
    await expect(this.tabAll).toBeVisible();
    await expect(this.tabImages).toBeVisible();
    await expect(this.tabVideos).toBeVisible();
    await expect(this.tabUrls).toBeVisible();
    await expect(this.tabWidgets).toBeVisible();
  }

  async verifyGridHasItems(): Promise<void> {
    await expect(this.page.locator('h5').first()).toBeVisible();
  }

  async verifyPaginationVisible(): Promise<void> {
    await expect(this.paginationInfo).toBeVisible();
  }

  async verifyAddNewMenuItemsVisible(): Promise<void> {
    await this.openAddNewMenu();
    await expect(this.addNewMediaMenuItem).toBeVisible();
    await expect(this.addNewUrlMenuItem).toBeVisible();
    await expect(this.addNewWidgetMenuItem).toBeVisible();
  }
}
