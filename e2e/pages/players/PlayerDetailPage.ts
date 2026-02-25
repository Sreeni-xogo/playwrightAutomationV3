import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: Player detail/edit page — accessible at /en/players/:id
// Contains player info table (firmware, OS, last online), name, timezone, license, playlist, orientation, notes and tags
export class PlayerDetailPage extends BasePage {
  readonly pageHeading: Locator;
  readonly goBackButton: Locator;
  readonly saveButton: Locator;
  readonly playerNameInput: Locator;
  readonly advancedConfigButton: Locator;
  readonly notesTextarea: Locator;
  readonly showAdvancedTagsSwitch: Locator;
  // AIDEV-NOTE: Info table rows — firmware, OS version, last online timestamp
  readonly firmwareVersionCell: Locator;
  readonly osVersionCell: Locator;
  readonly lastOnlineCell: Locator;
  // AIDEV-NOTE: Dropdown trigger buttons for popup selectors
  readonly timezoneDropdown: Locator;
  readonly licenseDropdown: Locator;
  readonly associatedPlaylistDropdown: Locator;
  readonly displayOrientationDropdown: Locator;
  // AIDEV-NOTE: Link to view the currently associated playlist
  readonly viewPlaylistLink: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Edit Player', level: 1 });
    this.goBackButton = page.getByRole('button', { name: 'Go back' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.playerNameInput = page.getByRole('textbox', { name: 'Enter player name' });
    // AIDEV-NOTE: "Advanced Configuration" expands extra settings section
    this.advancedConfigButton = page.getByRole('button', { name: 'Advanced Configuration' });
    this.notesTextarea = page.getByRole('textbox', { name: 'Notes' });
    this.showAdvancedTagsSwitch = page.getByRole('switch', { name: 'Show Advanced Tags' });
    // AIDEV-NOTE: Info table cells use cell role — values are read-only device metadata
    this.firmwareVersionCell = page.getByRole('cell', { name: 'Firmware version:' });
    this.osVersionCell = page.getByRole('cell', { name: 'OS Version:' });
    this.lastOnlineCell = page.getByRole('cell', { name: 'Last online on:' });
    // AIDEV-NOTE: Each dropdown opens a popup picker — the button text shows current selected value
    this.timezoneDropdown = page.getByText('Timezone').locator('..').getByRole('button', { name: 'Show popup' });
    this.licenseDropdown = page.getByText('License').locator('..').getByRole('button', { name: 'Show popup' });
    this.associatedPlaylistDropdown = page.getByText('Associated Playlist').locator('..').getByRole('button', { name: 'Show popup' });
    this.displayOrientationDropdown = page.getByText('Display Orientation').locator('..').getByRole('button', { name: 'Show popup' });
    this.viewPlaylistLink = page.getByRole('link', { name: 'View playlist' });
  }

  async goto(playerId: string): Promise<void> {
    await this.navigate(`/en/players/${playerId}`);
    await this.waitForLoadAndElement(this.pageHeading);
  }

  async goBack(): Promise<void> {
    await this.goBackButton.click();
    await this.waitForLoad();
  }

  async setPlayerName(name: string): Promise<void> {
    await this.playerNameInput.clear();
    await this.playerNameInput.fill(name);
  }

  async setNotes(notes: string): Promise<void> {
    await this.notesTextarea.clear();
    await this.notesTextarea.fill(notes);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async openAdvancedConfiguration(): Promise<void> {
    await this.advancedConfigButton.click();
  }

  async openTimezoneDropdown(): Promise<void> {
    await this.timezoneDropdown.click();
  }

  async openLicenseDropdown(): Promise<void> {
    await this.licenseDropdown.click();
  }

  async openAssociatedPlaylistDropdown(): Promise<void> {
    await this.associatedPlaylistDropdown.click();
  }

  async openDisplayOrientationDropdown(): Promise<void> {
    await this.displayOrientationDropdown.click();
  }

  async clickViewPlaylist(): Promise<void> {
    await this.viewPlaylistLink.click();
    await this.waitForLoad();
  }

  async toggleShowAdvancedTags(): Promise<void> {
    await this.showAdvancedTagsSwitch.click();
  }

  async verifyOnEditPage(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
  }

  async verifyPlayerName(expectedName: string): Promise<void> {
    await expect(this.playerNameInput).toHaveValue(expectedName);
  }

  async verifySaveButtonVisible(): Promise<void> {
    await expect(this.saveButton).toBeVisible();
  }

  async verifyFirmwareVersionVisible(): Promise<void> {
    await expect(this.firmwareVersionCell).toBeVisible();
  }

  async verifyOsVersionVisible(): Promise<void> {
    await expect(this.osVersionCell).toBeVisible();
  }

  async verifyAdvancedConfigButtonVisible(): Promise<void> {
    await expect(this.advancedConfigButton).toBeVisible();
  }
}
