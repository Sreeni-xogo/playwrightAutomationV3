import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: Profile page at /en/account — shows personal details and account security sections.
// Accessed via the SS avatar button > Profile & Settings > Profile link in the settings nav.
export class ProfilePage extends BasePage {
  // Settings sidebar nav links
  readonly settingsSidebarHeading: Locator;
  readonly profileNavLink: Locator;
  readonly membersNavLink: Locator;
  readonly teamsGroupingNavLink: Locator;
  readonly licensesNavLink: Locator;
  readonly paymentNavLink: Locator;

  // Page heading
  readonly pageHeading: Locator;
  readonly pageDescription: Locator;

  // Profile card
  readonly profileName: Locator;
  readonly profileRole: Locator;
  readonly saveButton: Locator;

  // Personal Details section
  readonly personalDetailsSectionHeading: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly titleInput: Locator;

  // Account Security section
  readonly accountSecuritySectionHeading: Locator;
  readonly emailInput: Locator;
  readonly changeEmailButton: Locator;
  readonly passwordInput: Locator;
  readonly changePasswordButton: Locator;

  constructor(page: Page) {
    super(page);

    this.settingsSidebarHeading = page.getByRole('heading', { name: 'Settings', level: 2 });
    this.profileNavLink = page.getByRole('link', { name: 'Profile' });
    this.membersNavLink = page.getByRole('link', { name: 'Members' });
    this.teamsGroupingNavLink = page.getByRole('link', { name: 'Teams & Grouping' });
    this.licensesNavLink = page.getByRole('link', { name: 'Licenses' });
    this.paymentNavLink = page.getByRole('link', { name: 'Payment' });

    this.pageHeading = page.getByRole('heading', { name: 'Profile', level: 1 });
    this.pageDescription = page.getByText('Update your personal information and keep your account details current.');

    // AIDEV-NOTE: Profile card shows full name (h2) and role/team label
    this.profileName = page.getByRole('heading', { level: 2 }).first();
    this.profileRole = page.locator('p').filter({ hasText: 'Admin' }).first();
    this.saveButton = page.getByRole('button', { name: 'Save' });

    this.personalDetailsSectionHeading = page.getByRole('heading', { name: 'Personal Details', level: 3 });
    this.firstNameInput = page.getByRole('textbox', { name: 'First name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last name' });
    this.titleInput = page.getByRole('textbox', { name: 'Title' });

    this.accountSecuritySectionHeading = page.getByRole('heading', { name: 'Account Security', level: 3 });
    // AIDEV-NOTE: Email and Password inputs are disabled — they cannot be directly edited, only via the change buttons
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.changeEmailButton = page.getByRole('button', { name: 'Change Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.changePasswordButton = page.getByRole('button', { name: 'Change Password' });
  }

  async goto(): Promise<void> {
    await this.navigate('/en/account');
    await this.waitForLoadAndElement(this.pageHeading);
  }

  async fillFirstName(value: string): Promise<void> {
    await this.firstNameInput.clear();
    await this.firstNameInput.fill(value);
  }

  async fillLastName(value: string): Promise<void> {
    await this.lastNameInput.clear();
    await this.lastNameInput.fill(value);
  }

  async fillTitle(value: string): Promise<void> {
    await this.titleInput.clear();
    await this.titleInput.fill(value);
  }

  async saveProfile(): Promise<void> {
    await this.saveButton.click();
  }

  async clickChangeEmail(): Promise<void> {
    await this.changeEmailButton.click();
  }

  async clickChangePassword(): Promise<void> {
    await this.changePasswordButton.click();
  }

  async verifyPageLoaded(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.personalDetailsSectionHeading).toBeVisible();
    await expect(this.accountSecuritySectionHeading).toBeVisible();
  }

  async verifyFirstNameValue(expected: string): Promise<void> {
    await expect(this.firstNameInput).toHaveValue(expected);
  }

  async verifyLastNameValue(expected: string): Promise<void> {
    await expect(this.lastNameInput).toHaveValue(expected);
  }

  async verifyEmailIsDisabled(): Promise<void> {
    await expect(this.emailInput).toBeDisabled();
  }

  async verifyPasswordIsDisabled(): Promise<void> {
    await expect(this.passwordInput).toBeDisabled();
  }
}
