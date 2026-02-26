import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: Overlays list page — shows paginated grid of all overlays at /en/overlays
// Each card links to /en/overlays/:id with a heading (level 5) for the overlay name
// Has 350+ overlays as of snapshotting; pagination shows 32 per page
export class OverlaysPage extends BasePage {
  readonly pageHeading: Locator;
  readonly overlayCount: Locator;
  readonly addNewLink: Locator;
  readonly sortButton: Locator;
  readonly overlayGrid: Locator;
  readonly paginationNav: Locator;
  readonly firstPageButton: Locator;
  readonly previousPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly lastPageButton: Locator;
  readonly paginationInfo: Locator;

  constructor(page: Page) {
    super(page);
    // AIDEV-NOTE: Page heading is an h1 inside the main content area
    this.pageHeading = page.getByRole('heading', { name: 'Overlays', level: 1 });
    // AIDEV-NOTE: The count badge is a sibling element beside the h1
    this.overlayCount = page.locator('h1').locator('..').locator('> *').nth(1);
    // AIDEV-NOTE: "Add New" is a link routing to /en/overlays/add
    this.addNewLink = page.getByRole('link', { name: 'Add New' });
    this.sortButton = page.getByRole('button', { name: 'Date Added: Newest' });
    // AIDEV-NOTE: The grid container holding all overlay card items
    this.overlayGrid = page.getByRole('link', { name: 'Add New' }).locator('../../..').locator('> *').nth(2);
    this.paginationNav = page.getByRole('navigation').filter({ has: page.getByRole('button', { name: 'First Page' }) });
    this.firstPageButton = page.getByRole('button', { name: 'First Page' });
    this.previousPageButton = page.getByRole('button', { name: 'Previous Page' });
    this.nextPageButton = page.getByRole('button', { name: 'Next Page' });
    this.lastPageButton = page.getByRole('button', { name: 'Last Page' });
    // AIDEV-NOTE: Shows "Showing X-Y of Z" summary text
    this.paginationInfo = page.locator('main').getByText('Showing');
  }

  async goto(): Promise<void> {
    await this.navigate('/en/overlays');
    await this.waitForLoadAndElement(this.pageHeading);
  }

  // AIDEV-NOTE: Returns the full card container for an overlay by its exact name
  getOverlayCard(name: string): Locator {
    return this.page.getByRole('heading', { name, level: 5 }).locator('../../../..');
  }

  // AIDEV-NOTE: Overlay card structure (PATTERN-012 — same as players and planners):
  //   tile wrapper: div.flex.min-w-0.flex-col.gap-2
  //   link: a[href] inside div.card (wraps card image)
  //   h5 in div.card-footer > div.group > div.pointer-events-none
  //   Traversal from h5: 4 levels up = tile wrapper, then div.card > a
  getOverlayLink(name: string): Locator {
    return this.page.getByRole('heading', { name, level: 5 }).locator('../../../..').locator('div.card a');
  }

  // AIDEV-NOTE: Delete button is in div.card-footer (3 levels from h5) — outside div.group
  getOptionsButtonForOverlay(name: string): Locator {
    return this.page.getByRole('heading', { name, level: 5 }).locator('../../..').getByRole('button');
  }

  async clickAddNew(): Promise<void> {
    await this.addNewLink.click();
    // AIDEV-NOTE: Add New is a link navigating to /en/overlays/add (PATTERN-002)
    await this.page.waitForURL('**/en/overlays/add', { timeout: 10000 });
  }

  async clickOverlay(name: string): Promise<void> {
    await this.getOverlayLink(name).click();
    // AIDEV-NOTE: SPA nav to overlay detail page (PATTERN-002)
    await this.page.waitForURL((url) => url.pathname.includes('/en/overlays/') && !url.pathname.endsWith('/add'), { timeout: 10000 });
  }

  async clickSortButton(): Promise<void> {
    await this.sortButton.click();
  }

  async clickPageButton(pageNumber: number): Promise<void> {
    await this.page.getByRole('button', { name: `Page ${pageNumber}` }).click();
  }

  async verifyOnOverlaysPage(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
  }

  async verifyAddNewLinkVisible(): Promise<void> {
    await expect(this.addNewLink).toBeVisible();
  }

  async verifyPaginationVisible(): Promise<void> {
    await expect(this.paginationInfo).toBeVisible();
  }

  async verifyOverlayVisible(name: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name, level: 5 })).toBeVisible();
  }
}
