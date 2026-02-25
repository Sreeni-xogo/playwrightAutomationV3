import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

// AIDEV-NOTE: Sign Up is a 2-step wizard.
// Step 1 (Account Info): email, password, confirm password, EULA toggle, optional reseller/referral codes
// Step 2 (Personal): first name, last name, company, title, how-heard, usage, Altcha captcha, submit

export class SignUpPage extends BasePage {
  readonly logoElmt: Locator;
  readonly heading: Locator;

  // Step indicator
  readonly stepStatus: Locator;

  // Step 1 — Account Info
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordToggle: Locator;
  readonly confirmPasswordInput: Locator;
  readonly confirmPasswordToggle: Locator;
  readonly resellerCodeToggle: Locator;
  readonly referralCodeToggle: Locator;
  readonly eulaToggle: Locator;
  readonly eulaLink: Locator;
  readonly nextButton: Locator;
  readonly returnToLoginLink: Locator;

  // Step 2 — Personal
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyNameInput: Locator;
  readonly titleInput: Locator;
  readonly howHeardCombobox: Locator;
  readonly usageCombobox: Locator;
  readonly captchaCheckbox: Locator;
  readonly backButton: Locator;
  readonly signUpButton: Locator;

  // Side panel
  readonly loginLink: Locator;

  constructor(page: Page) {
    super(page);

    this.logoElmt = page.locator('img[alt="XOGO"]');
    this.heading = page.getByRole('heading', { name: 'Sign Up', level: 1 });
    this.stepStatus = page.getByRole('status');

    // Step 1
    // AIDEV-NOTE: Using direct DOM selectors — getByRole unreliable for Vue-reactive email/password inputs
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.passwordToggle = page.locator('div').filter({ hasText: 'Password' }).nth(1).getByRole('button');
    this.confirmPasswordInput = page.locator('input[name="confirmPassword"]');
    this.confirmPasswordToggle = page.locator('div').filter({ hasText: 'Confirm password' }).getByRole('button');
    this.resellerCodeToggle = page.getByRole('switch', { name: 'I have a reseller code' });
    this.referralCodeToggle = page.getByRole('switch', { name: 'I have a referral code' });
    this.eulaToggle = page.getByRole('switch', { name: 'I have read and accept the End User License Agreement' });
    this.eulaLink = page.getByRole('link', { name: 'Read End User License Agreement (opens in new window)' });
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.returnToLoginLink = page.getByRole('link', { name: 'Return to log in' });

    // Step 2
    this.firstNameInput = page.getByRole('textbox', { name: 'First name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last name' });
    this.companyNameInput = page.getByRole('textbox', { name: 'Company name' });
    this.titleInput = page.getByRole('textbox', { name: 'Title' });
    this.howHeardCombobox = page.getByRole('combobox', { name: 'How did you hear about us?' });
    this.usageCombobox = page.getByRole('combobox', { name: 'What will you be using XOGO for?' });
    // AIDEV-NOTE: Altcha captcha — appears on step 2 only
    this.captchaCheckbox = page.locator('label.altcha-label');
    this.backButton = page.getByRole('button', { name: 'Back' });
    this.signUpButton = page.getByRole('button', { name: 'Sign Up' });

    // Side panel
    this.loginLink = page.getByRole('link', { name: 'Log In', exact: true });
  }

  async goto(): Promise<void> {
    await this.navigate('/en/auth/signup');
    await this.waitForLoadAndElement(this.heading);
  }

  // Step 1 methods
  async fillEmail(email: string): Promise<void> {
    // AIDEV-NOTE: networkidle ensures Vue v-model bindings hydrated before fill()
    await this.page.waitForLoadState('networkidle');
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.passwordInput.fill(password);
  }

  async fillConfirmPassword(password: string): Promise<void> {
    await this.confirmPasswordInput.fill(password);
  }

  async acceptEula(): Promise<void> {
    await this.eulaToggle.click();
  }

  async fillStep1(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillConfirmPassword(password);
    await this.acceptEula();
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click();
    await this.waitForLoad();
  }

  // Step 2 methods
  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  async fillCompanyName(company: string): Promise<void> {
    await this.companyNameInput.fill(company);
  }

  async fillTitle(title: string): Promise<void> {
    await this.titleInput.fill(title);
  }

  async clickBack(): Promise<void> {
    await this.backButton.click();
    await this.waitForLoad();
  }

  async clickSignUp(): Promise<void> {
    await this.signUpButton.click();
  }

  // AIDEV-NOTE: Full signup flow — step 1 + step 2 + captcha + submit
  async signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    company: string,
  ): Promise<void> {
    await this.fillStep1(email, password);
    await this.clickNext();
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillCompanyName(company);
    await this.solveCaptcha();
    await this.clickSignUp();
  }

  async navigateToLogin(): Promise<void> {
    await this.loginLink.click();
    await this.waitForLoad();
  }

  async verifyStep1Elements(): Promise<void> {
    await expect(this.logoElmt).toBeVisible();
    await expect(this.heading).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeVisible();
    await expect(this.eulaToggle).toBeVisible();
    await expect(this.nextButton).toBeVisible();
    await expect(this.returnToLoginLink).toBeVisible();
  }

  async verifyStep2Elements(): Promise<void> {
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.companyNameInput).toBeVisible();
    await expect(this.captchaCheckbox).toBeVisible();
    await expect(this.backButton).toBeVisible();
    await expect(this.signUpButton).toBeVisible();
  }
}
