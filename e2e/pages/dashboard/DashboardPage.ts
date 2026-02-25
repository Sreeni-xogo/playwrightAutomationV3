import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: DashboardPage represents /en (Home) — the landing page after login.
// The page shows summary widgets for Library, Playlists, and Players with item counts
// and thumbnail previews. Each section has a "View All" link.
export class DashboardPage extends BasePage {
  // --- Page heading ---
  readonly pageHeading: Locator;

  // --- Add New button (opens dropdown for Media / URL / Widget) ---
  readonly addNewButton: Locator;

  // --- Navigation sidebar links ---
  readonly navHomeLink: Locator;
  readonly navLibraryLink: Locator;
  readonly navPlaylistsLink: Locator;
  readonly navPlayersLink: Locator;
  readonly navPlannerLink: Locator;
  readonly navOverlaysLink: Locator;
  readonly navWidgetsLink: Locator;
  readonly navTeamsLink: Locator;

  // --- Dashboard summary sections ---
  readonly librarySectionHeading: Locator;
  readonly libraryItemCount: Locator;
  readonly libraryViewAllLink: Locator;

  readonly playlistsSectionHeading: Locator;
  readonly playlistsItemCount: Locator;
  readonly playlistsViewAllLink: Locator;

  readonly playersSectionHeading: Locator;
  readonly playersItemCount: Locator;
  readonly playersViewAllLink: Locator;

  // --- Top-bar elements ---
  // AIDEV-NOTE: The account button shows the user initials (e.g. "SS") and opens account menu
  readonly accountButton: Locator;
  readonly organizationButton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.getByRole('heading', { name: 'Dashboard', level: 1 });

    this.addNewButton = page.getByRole('button', { name: 'Add New' });

    this.navHomeLink = page.getByRole('link', { name: 'Home' });
    this.navLibraryLink = page.getByRole('link', { name: 'Library' }).first();
    this.navPlaylistsLink = page.getByRole('link', { name: 'Playlists' }).first();
    this.navPlayersLink = page.getByRole('link', { name: 'Players' }).first();
    this.navPlannerLink = page.getByRole('link', { name: 'Planner' });
    this.navOverlaysLink = page.getByRole('link', { name: 'Overlays' });
    this.navWidgetsLink = page.getByRole('link', { name: 'Widgets' }).first();
    this.navTeamsLink = page.getByRole('link', { name: 'Teams' });

    // AIDEV-NOTE: Summary section headings are h2 inside the dashboard content area
    this.librarySectionHeading = page.getByRole('heading', { name: 'Library', level: 2 });
    this.libraryViewAllLink = page
      .locator('a[href="/en/library"]')
      .filter({ hasText: 'View All' });

    this.playlistsSectionHeading = page.getByRole('heading', { name: 'Playlists', level: 2 });
    this.playlistsViewAllLink = page
      .locator('a[href="/en/playlists"]')
      .filter({ hasText: 'View All' });

    this.playersSectionHeading = page.getByRole('heading', { name: 'Players', level: 2 });
    this.playersViewAllLink = page
      .locator('a[href="/en/players"]')
      .filter({ hasText: 'View All' });

    // AIDEV-NOTE: Item counts are sibling generic elements next to each h2.
    // Using nth-based locators relative to section headings is brittle; instead
    // rely on text content assertions in verify methods when needed.
    this.libraryItemCount = page.locator('h2:has-text("Library") + *');
    this.playlistsItemCount = page.locator('h2:has-text("Playlists") + *');
    this.playersItemCount = page.locator('h2:has-text("Players") + *');

    this.accountButton = page.getByRole('button', { name: 'SS' });
    this.organizationButton = page.getByRole('button', { name: 'Default' });
  }

  // --- Navigation ---

  async goto(): Promise<void> {
    await this.navigate('/en');
    await this.waitForLoadAndElement(this.pageHeading);
  }

  async clickNavLibrary(): Promise<void> {
    await this.navLibraryLink.click();
    await this.waitForLoad();
  }

  async clickNavPlaylists(): Promise<void> {
    await this.navPlaylistsLink.click();
    await this.waitForLoad();
  }

  async clickNavPlayers(): Promise<void> {
    await this.navPlayersLink.click();
    await this.waitForLoad();
  }

  async clickNavPlanner(): Promise<void> {
    await this.navPlannerLink.click();
    await this.waitForLoad();
  }

  async clickNavOverlays(): Promise<void> {
    await this.navOverlaysLink.click();
    await this.waitForLoad();
  }

  async clickNavWidgets(): Promise<void> {
    await this.navWidgetsLink.click();
    await this.waitForLoad();
  }

  async clickNavTeams(): Promise<void> {
    await this.navTeamsLink.click();
    await this.waitForLoad();
  }

  async clickAddNew(): Promise<void> {
    await this.addNewButton.click();
  }

  async clickLibraryViewAll(): Promise<void> {
    await this.libraryViewAllLink.click();
    await this.waitForLoad();
  }

  async clickPlaylistsViewAll(): Promise<void> {
    await this.playlistsViewAllLink.click();
    await this.waitForLoad();
  }

  async clickPlayersViewAll(): Promise<void> {
    await this.playersViewAllLink.click();
    await this.waitForLoad();
  }

  // --- Verify methods ---

  async verifyPageLoaded(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.addNewButton).toBeVisible();
  }

  async verifyNavLinksVisible(): Promise<void> {
    await expect(this.navHomeLink).toBeVisible();
    await expect(this.navLibraryLink).toBeVisible();
    await expect(this.navPlaylistsLink).toBeVisible();
    await expect(this.navPlayersLink).toBeVisible();
    await expect(this.navPlannerLink).toBeVisible();
    await expect(this.navOverlaysLink).toBeVisible();
    await expect(this.navWidgetsLink).toBeVisible();
    await expect(this.navTeamsLink).toBeVisible();
  }

  async verifyLibrarySectionVisible(): Promise<void> {
    await expect(this.librarySectionHeading).toBeVisible();
    await expect(this.libraryViewAllLink).toBeVisible();
  }

  async verifyPlaylistsSectionVisible(): Promise<void> {
    await expect(this.playlistsSectionHeading).toBeVisible();
    await expect(this.playlistsViewAllLink).toBeVisible();
  }

  async verifyPlayersSectionVisible(): Promise<void> {
    await expect(this.playersSectionHeading).toBeVisible();
    await expect(this.playersViewAllLink).toBeVisible();
  }
}
