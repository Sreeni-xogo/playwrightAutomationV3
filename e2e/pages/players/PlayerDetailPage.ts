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
    // AIDEV-NOTE: Dropdown buttons have aria-label="Show popup" which overrides <label for> association.
    // getByLabel('Timezone') resolves to 0 — the button's accessible name is "Show popup", not the label text.
    // Fix: scope via [data-slot="root"] filter — each dropdown row uses this as root wrapper.
    // Structure: [data-slot="root"] > [...label...] + [div.relative > button[aria-label="Show popup"]]
    // Associated Playlist label wraps a <span> + <a> — filter still works via hasText substring match.
    this.timezoneDropdown = page.locator('[data-slot="root"]').filter({ has: page.locator('label', { hasText: 'Timezone' }) }).locator('button[aria-label="Show popup"]');
    this.licenseDropdown = page.locator('[data-slot="root"]').filter({ has: page.locator('label', { hasText: 'License' }) }).locator('button[aria-label="Show popup"]');
    this.associatedPlaylistDropdown = page.locator('[data-slot="root"]').filter({ has: page.locator('label', { hasText: 'Associated Playlist' }) }).locator('button[aria-label="Show popup"]');
    this.displayOrientationDropdown = page.locator('[data-slot="root"]').filter({ has: page.locator('label', { hasText: 'Display Orientation' }) }).locator('button[aria-label="Show popup"]');
    this.viewPlaylistLink = page.getByRole('link', { name: 'View playlist' });
  }

  async goto(playerId: string): Promise<void> {
    await this.navigate(`/en/players/${playerId}`);
    await this.waitForLoadAndElement(this.pageHeading);
  }

  async goBack(): Promise<void> {
    await this.goBackButton.click();
    // AIDEV-NOTE: SPA nav back to players list (PATTERN-002) — waitForURL polls until arrival
    await this.page.waitForURL((url) => url.pathname.includes('/en/players') && !url.pathname.includes('/en/players/'), { timeout: 10000 });
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
