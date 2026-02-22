import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: Planner edit/create page — /en/planners/:id for edit, /en/planners/add for new
// Contains: name field, playlist section with "Manage Playlists" button, and a calendar grid
// The calendar shows month navigation and day/week checkboxes for schedule assignment
export class PlannerEditPage extends BasePage {
  readonly pageHeading: Locator;
  readonly addNewPageHeading: Locator;
  readonly goBackButton: Locator;
  readonly saveButton: Locator;
  readonly plannerNameInput: Locator;
  // AIDEV-NOTE: Playlist section heading within the form
  readonly playlistsSectionHeading: Locator;
  readonly managePlaylists: Locator;
  // AIDEV-NOTE: Calendar navigation — previous/next month buttons flank the current month heading
  readonly calendarHeading: Locator;
  readonly calendarPrevButton: Locator;
  readonly calendarNextButton: Locator;
  readonly selectAllDaysCheckbox: Locator;
  // AIDEV-NOTE: Day-of-week checkboxes are labelled Mon–Sun
  readonly mondayCheckbox: Locator;
  readonly tuesdayCheckbox: Locator;
  readonly wednesdayCheckbox: Locator;
  readonly thursdayCheckbox: Locator;
  readonly fridayCheckbox: Locator;
  readonly saturdayCheckbox: Locator;
  readonly sundayCheckbox: Locator;
  // AIDEV-NOTE: Shown only on the "Add New" page when no playlists are assigned yet
  readonly noPlaylistsText: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Edit Planner', level: 1 });
    this.addNewPageHeading = page.getByRole('heading', { name: 'Add New Planner', level: 1 });
    this.goBackButton = page.getByRole('button', { name: 'Go back' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.plannerNameInput = page.getByRole('textbox', { name: 'Enter planner name' });
    this.playlistsSectionHeading = page.getByRole('heading', { name: 'Playlists', level: 3 });
    this.managePlaylists = page.getByRole('button', { name: 'Manage Playlists' });
    // AIDEV-NOTE: Calendar heading shows month and year e.g. "February 2026"
    this.calendarHeading = page.getByRole('heading', { level: 3 }).filter({ hasText: '2026' });
    this.calendarPrevButton = page.getByRole('button').nth(1);
    this.calendarNextButton = page.getByRole('button').nth(2);
    this.selectAllDaysCheckbox = page.getByRole('checkbox', { name: 'Select All Days' });
    this.mondayCheckbox = page.getByText('Mon').locator('..').getByRole('checkbox');
    this.tuesdayCheckbox = page.getByText('Tue').locator('..').getByRole('checkbox');
    this.wednesdayCheckbox = page.getByText('Wed').locator('..').getByRole('checkbox');
    this.thursdayCheckbox = page.getByText('Thu').locator('..').getByRole('checkbox');
    this.fridayCheckbox = page.getByText('Fri').locator('..').getByRole('checkbox');
    this.saturdayCheckbox = page.getByText('Sat').locator('..').getByRole('checkbox');
    this.sundayCheckbox = page.getByText('Sun').locator('..').getByRole('checkbox');
    this.noPlaylistsText = page.getByText('No playlists selected');
  }

  async goto(plannerId: string): Promise<void> {
    await this.navigate(`/en/planners/${plannerId}`);
    await this.waitForLoad();
  }

  async gotoAddNew(): Promise<void> {
    await this.navigate('/en/planners/add');
    await this.waitForLoad();
  }

  async goBack(): Promise<void> {
    await this.goBackButton.click();
  }

  async setPlannerName(name: string): Promise<void> {
    await this.plannerNameInput.clear();
    await this.plannerNameInput.fill(name);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async clickManagePlaylists(): Promise<void> {
    await this.managePlaylists.click();
  }

  async toggleSelectAllDays(): Promise<void> {
    await this.selectAllDaysCheckbox.click();
  }

  // AIDEV-NOTE: Clicks the checkbox for a specific calendar date cell (by visible day number text)
  async toggleCalendarDay(dayNumber: string): Promise<void> {
    await this.page.getByText(dayNumber, { exact: true }).locator('..').getByRole('checkbox').click();
  }

  async verifyOnEditPage(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
  }

  async verifyOnAddNewPage(): Promise<void> {
    await expect(this.addNewPageHeading).toBeVisible();
  }

  async verifyPlannerName(expectedName: string): Promise<void> {
    await expect(this.plannerNameInput).toHaveValue(expectedName);
  }

  async verifySaveButtonVisible(): Promise<void> {
    await expect(this.saveButton).toBeVisible();
  }

  async verifyManagePlaylistsVisible(): Promise<void> {
    await expect(this.managePlaylists).toBeVisible();
  }

  async verifyNoPlaylistsText(): Promise<void> {
    await expect(this.noPlaylistsText).toBeVisible();
  }
}
