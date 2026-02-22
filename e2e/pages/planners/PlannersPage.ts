import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: Planners list page — shows paginated grid of all planners at /en/planners
// Each card links to /en/planners/:id with a heading (level 5) for the planner name
export class PlannersPage extends BasePage {
  readonly pageHeading: Locator;
  readonly plannerCount: Locator;
  readonly addNewLink: Locator;
  readonly sortButton: Locator;
  readonly plannerGrid: Locator;
  readonly paginationNav: Locator;
  readonly firstPageButton: Locator;
  readonly previousPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly lastPageButton: Locator;
  readonly paginationInfo: Locator;

  constructor(page: Page) {
    super(page);
    // AIDEV-NOTE: Page heading is an h1 inside the content area (not sidebar)
    this.pageHeading = page.getByRole('heading', { name: 'Planners', level: 1 });
    // AIDEV-NOTE: The count badge sits as a sibling next to the h1 heading
    this.plannerCount = page.locator('h1').locator('..').locator('> *').nth(1);
    // AIDEV-NOTE: "Add New" is a link routing to /en/planners/add
    this.addNewLink = page.getByRole('link', { name: 'Add New' });
    this.sortButton = page.getByRole('button', { name: 'Date Added: Newest' });
    // AIDEV-NOTE: The grid container wrapping all planner card items
    this.plannerGrid = page.getByRole('link', { name: 'Add New' }).locator('../../..').locator('> *').nth(2);
    this.paginationNav = page.getByRole('navigation').filter({ has: page.getByRole('button', { name: 'First Page' }) });
    this.firstPageButton = page.getByRole('button', { name: 'First Page' });
    this.previousPageButton = page.getByRole('button', { name: 'Previous Page' });
    this.nextPageButton = page.getByRole('button', { name: 'Next Page' });
    this.lastPageButton = page.getByRole('button', { name: 'Last Page' });
    // AIDEV-NOTE: Shows "Showing X-Y of Z" summary text
    this.paginationInfo = page.locator('main').getByText('Showing');
  }

  async goto(): Promise<void> {
    await this.navigate('/en/planners');
    await this.waitForLoad();
  }

  // AIDEV-NOTE: Returns the full card container for a planner by its exact name
  getPlannerCard(name: string): Locator {
    return this.page.getByRole('heading', { name, level: 5 }).locator('../../../..');
  }

  // AIDEV-NOTE: Returns the clickable link for a planner item by heading name
  getPlannerLink(name: string): Locator {
    return this.page.getByRole('heading', { name, level: 5 }).locator('../../..').getByRole('link');
  }

  // AIDEV-NOTE: Each card has an options/action button (unlabelled) beside the heading
  getOptionsButtonForPlanner(name: string): Locator {
    return this.page.getByRole('heading', { name, level: 5 }).locator('../..').getByRole('button');
  }

  async clickAddNew(): Promise<void> {
    await this.addNewLink.click();
  }

  async clickPlanner(name: string): Promise<void> {
    await this.getPlannerLink(name).click();
  }

  async clickSortButton(): Promise<void> {
    await this.sortButton.click();
  }

  async clickPageButton(pageNumber: number): Promise<void> {
    await this.page.getByRole('button', { name: `Page ${pageNumber}` }).click();
  }

  async verifyOnPlannersPage(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
  }

  async verifyAddNewLinkVisible(): Promise<void> {
    await expect(this.addNewLink).toBeVisible();
  }

  async verifyPaginationVisible(): Promise<void> {
    await expect(this.paginationInfo).toBeVisible();
  }

  async verifyPlannerVisible(name: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name, level: 5 })).toBeVisible();
  }
}
