import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: Widget edit page — accessible at /en/widgets/:id
// Layout varies by widget type (Clock, Timer, Weather, Note, JetSet, Programmatic Ads)
// All types share: name field, iframe preview, Details section, Theme section, "Used in These Playlists" section
// Snapshot was captured for a Timer-type widget; fields like "Title", "End Date", "End Time" are Timer-specific
export class WidgetEditPage extends BasePage {
  readonly pageHeading: Locator;
  readonly goBackButton: Locator;
  readonly saveButton: Locator;
  // AIDEV-NOTE: Widget name field — always present regardless of widget type
  readonly widgetNameInput: Locator;
  // AIDEV-NOTE: Details section heading groups the type-specific configuration fields
  readonly detailsSectionHeading: Locator;
  // AIDEV-NOTE: Theme section groups visual styling fields
  readonly themeSectionHeading: Locator;
  // AIDEV-NOTE: Used in These Playlists section at the bottom of the form
  readonly usedInPlaylistsSectionHeading: Locator;
  // AIDEV-NOTE: Shown when the widget is not assigned to any playlist yet
  readonly noPlaylistsFoundText: Locator;
  // AIDEV-NOTE: iframe contains the live widget preview rendered inside the edit page
  readonly previewIframe: Locator;

  constructor(page: Page) {
    super(page);
    // AIDEV-NOTE: Heading is 'Edit Widget' on existing widgets, 'Create Widget' on new ones
    this.pageHeading = page.getByRole('heading', { name: 'Edit Widget', level: 1 }).or(
      page.getByRole('heading', { name: 'Create Widget', level: 1 })
    );
    this.goBackButton = page.getByRole('button', { name: 'Go back' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    // AIDEV-NOTE: Name input uses placeholder "Enter widget name"
    this.widgetNameInput = page.getByRole('textbox', { name: 'Name' });
    this.detailsSectionHeading = page.getByRole('heading', { name: 'Details', level: 3 });
    this.themeSectionHeading = page.getByRole('heading', { name: 'Theme', level: 3 });
    this.usedInPlaylistsSectionHeading = page.getByRole('heading', { name: 'Used in These Playlists', level: 3 });
    this.noPlaylistsFoundText = page.getByText('No playlists found');
    this.previewIframe = page.locator('iframe');
  }

  async goto(widgetId: string): Promise<void> {
    await this.navigate(`/en/widgets/${widgetId}`);
    await this.waitForLoadAndElement(this.pageHeading);
  }

  async goBack(): Promise<void> {
    await this.goBackButton.click();
    await this.waitForLoad();
  }

  async setWidgetName(name: string): Promise<void> {
    // AIDEV-NOTE: PATTERN-001 — Vue v-model requires networkidle before fill()
    await this.page.waitForLoadState('networkidle');
    await this.widgetNameInput.clear();
    await this.widgetNameInput.fill(name);
  }

  async save(): Promise<void> {
    const isCreatePage = this.page.url().includes('/add');
    await this.saveButton.click();
    if (isCreatePage) {
      // AIDEV-NOTE: PATTERN-002 — Create pages navigate to /en/widgets/:id after save
      await this.page.waitForURL(
        (url) => url.pathname.includes('/en/widgets/') && !url.pathname.includes('/add'),
        { timeout: 15000 }
      );
    } else {
      await this.page.waitForLoadState('networkidle');
    }
  }

  // AIDEV-NOTE: Timer-specific field — returns the title textbox by its label
  getTitleInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Title*' });
  }

  // AIDEV-NOTE: Timer-specific field — End Date textbox labelled "End Date *"
  getEndDateInput(): Locator {
    return this.page.getByRole('textbox', { name: 'End Date *' });
  }

  // AIDEV-NOTE: Timer-specific field — End Time textbox labelled "End Time*"
  getEndTimeInput(): Locator {
    return this.page.getByRole('textbox', { name: 'End Time*' });
  }

  // AIDEV-NOTE: Theme — Background Color swatch (clickable to open color picker)
  getBackgroundColorSwatch(): Locator {
    return this.page.getByText('Background Color').locator('..').getByText('#');
  }

  // AIDEV-NOTE: Theme — Font Color swatch (clickable to open color picker)
  getFontColorSwatch(): Locator {
    return this.page.getByText('Font Color').locator('..').getByText('#');
  }

  // AIDEV-NOTE: Overlay Color radio buttons — "Dark" or "Light"
  getOverlayColorRadio(value: string): Locator {
    return this.page.getByRole('radio', { name: value });
  }

  async verifyOnEditPage(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
  }

  async verifyWidgetName(expectedName: string): Promise<void> {
    await expect(this.widgetNameInput).toHaveValue(expectedName);
  }

  async verifySaveButtonVisible(): Promise<void> {
    await expect(this.saveButton).toBeVisible();
  }

  async verifyDetailsSectionVisible(): Promise<void> {
    await expect(this.detailsSectionHeading).toBeVisible();
  }

  async verifyThemeSectionVisible(): Promise<void> {
    await expect(this.themeSectionHeading).toBeVisible();
  }

  async verifyNoPlaylistsFound(): Promise<void> {
    await expect(this.noPlaylistsFoundText).toBeVisible();
  }
}
