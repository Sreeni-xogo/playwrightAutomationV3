import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: Widgets list page — shows paginated grid of all widgets at /en/widgets
// Each card links to /en/widgets/:id with a heading (level 5) for the widget name
// Has type filter tabs: All, Clock, Weather, Timer, Note, JetSet, Programmatic Ads
// Each card has two unlabelled action buttons (e.g. duplicate/delete)
export class WidgetsPage extends BasePage {
  readonly pageHeading: Locator;
  readonly widgetCount: Locator;
  readonly addNewButton: Locator;
  readonly sortButton: Locator;
  readonly selectButton: Locator;
  readonly widgetGrid: Locator;
  readonly paginationNav: Locator;
  readonly firstPageButton: Locator;
  readonly previousPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly lastPageButton: Locator;
  readonly paginationInfo: Locator;
  // AIDEV-NOTE: Type filter tabs for narrowing widgets by category
  readonly allTab: Locator;
  readonly clockTab: Locator;
  readonly weatherTab: Locator;
  readonly timerTab: Locator;
  readonly noteTab: Locator;
  readonly jetSetTab: Locator;
  readonly programmaticAdsTab: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Widgets', level: 1 });
    // AIDEV-NOTE: The count badge sits as a sibling element beside the h1
    this.widgetCount = page.locator('h1').locator('..').locator('> *').nth(1);
    // AIDEV-NOTE: "Add New" is a button (not a link) on the Widgets page — differs from Planners/Overlays
    this.addNewButton = page.getByRole('button', { name: 'Add New' });
    this.sortButton = page.getByRole('button', { name: 'Date Added: Newest' });
    this.selectButton = page.getByRole('button', { name: 'Select' });
    // AIDEV-NOTE: The grid wrapping all widget card items
    this.widgetGrid = page.getByRole('tabpanel', { name: 'All' }).locator('..');
    this.paginationNav = page.getByRole('navigation').filter({ has: page.getByRole('button', { name: 'First Page' }) });
    this.firstPageButton = page.getByRole('button', { name: 'First Page' });
    this.previousPageButton = page.getByRole('button', { name: 'Previous Page' });
    this.nextPageButton = page.getByRole('button', { name: 'Next Page' });
    this.lastPageButton = page.getByRole('button', { name: 'Last Page' });
    // AIDEV-NOTE: Shows "Showing X-Y of Z" summary text
    this.paginationInfo = page.locator('main').getByText('Showing');
    this.allTab = page.getByRole('tab', { name: 'All' });
    this.clockTab = page.getByRole('tab', { name: 'Clock' });
    this.weatherTab = page.getByRole('tab', { name: 'Weather' });
    this.timerTab = page.getByRole('tab', { name: 'Timer' });
    this.noteTab = page.getByRole('tab', { name: 'Note' });
    this.jetSetTab = page.getByRole('tab', { name: 'JetSet' });
    this.programmaticAdsTab = page.getByRole('tab', { name: 'Programmatic Ads' });
  }

  async goto(): Promise<void> {
    await this.navigate('/en/widgets');
    await this.waitForLoadAndElement(this.pageHeading);
  }

  // AIDEV-NOTE: Returns the full card container for a widget by its exact name
  getWidgetCard(name: string): Locator {
    return this.page.getByRole('heading', { name, level: 5 }).locator('../../../..');
  }

  // AIDEV-NOTE: Returns the clickable link for a widget item by heading name
  // AIDEV-NOTE: PATTERN-012 — card structure: h5 → 4 levels up = tile wrapper, then a (sibling of card-footer)
  getWidgetLink(name: string): Locator {
    return this.page.getByRole('heading', { name, level: 5 }).locator('../../../..').locator('a');
  }

  async clickAddNew(): Promise<void> {
    await this.addNewButton.click();
    // AIDEV-NOTE: Add New opens a dropdown menu (not a dialog) — wait for menu to be visible
    await this.page.getByRole('menu', { name: 'Add New' }).waitFor({ state: 'visible', timeout: 10000 });
  }

  async clickWidget(name: string): Promise<void> {
    await this.getWidgetLink(name).click();
    // AIDEV-NOTE: PATTERN-002 — SPA nav: waitForURL polls until widget edit URL is reached
    await this.page.waitForURL((url) => url.pathname.includes('/en/widgets/'), { timeout: 10000 });
  }

  async clickTab(tabName: string): Promise<void> {
    await this.page.getByRole('tab', { name: tabName }).click();
  }

  async clickSortButton(): Promise<void> {
    await this.sortButton.click();
  }

  async clickSelectButton(): Promise<void> {
    await this.selectButton.click();
  }

  async clickPageButton(pageNumber: number): Promise<void> {
    await this.page.getByRole('button', { name: `Page ${pageNumber}` }).click();
  }

  async verifyOnWidgetsPage(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
  }

  async verifyAddNewButtonVisible(): Promise<void> {
    await expect(this.addNewButton).toBeVisible();
  }

  async verifyPaginationVisible(): Promise<void> {
    await expect(this.paginationInfo).toBeVisible();
  }

  async verifyWidgetVisible(name: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name, level: 5 })).toBeVisible();
  }

  async verifyTabVisible(tabName: string): Promise<void> {
    await expect(this.page.getByRole('tab', { name: tabName })).toBeVisible();
  }
}
