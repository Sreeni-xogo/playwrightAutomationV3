import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class SignInPage extends BasePage {
  readonly logoElmt: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordToggle: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signUpLink: Locator;
  readonly microsoftSignInButton: Locator;
  readonly languageSelector: Locator;
  readonly captchaCheckbox: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;

  constructor(page: Page) {
    super(page);

    this.logoElmt = page.locator('img[alt="XOGO"]');
    this.emailInput = page.getByRole('textbox', { name: 'Enter your email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Enter your password' });
    this.passwordToggle = page.locator('div').filter({ hasText: 'Enter your password' }).getByRole('button');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password' });
    // AIDEV-NOTE: Sign Up link lives in the side panel on the login page
    this.signUpLink = page.getByRole('link', { name: 'Sign Up for Free' });
    this.microsoftSignInButton = page.getByRole('button', { name: 'Sign in with Microsoft' });
    this.languageSelector = page.getByRole('button', { name: 'Show popup' });
    // AIDEV-NOTE: Altcha captcha label — clicking triggers proof-of-work
    this.captchaCheckbox = page.locator('label.altcha-label');

    this.emailError = page.locator('div[data-slot="error"]').filter({ hasText: 'Invalid email address' });
    this.passwordError = page.locator('div[data-slot="error"]').filter({ hasText: 'Password must be at least 6 characters' });
  }

  async goto(): Promise<void> {
    await this.navigate('/en/auth/login');
    await this.waitForLoad();
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  // AIDEV-NOTE: Full login flow — fills credentials, solves captcha, submits
  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.solveCaptcha();
    await this.clickLoginButton();
  }

  async clearAllFields(): Promise<void> {
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }

  async navigateToForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  async navigateToSignUp(): Promise<void> {
    await this.signUpLink.click();
  }

  async waitForSuccessfulLogin(expectedUrl: string): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl, { timeout: 15000 });
  }

  async verifyEmailError(expected: string = 'Invalid email address'): Promise<void> {
    await this.passwordInput.click();
    await expect(this.emailError).toBeVisible({ timeout: 5000 });
    await expect(this.emailError).toContainText(expected);
  }

  async verifyPasswordError(expected: string = 'Password must be at least 6 characters'): Promise<void> {
    await this.emailInput.click();
    await expect(this.passwordError).toBeVisible({ timeout: 5000 });
    await expect(this.passwordError).toContainText(expected);
  }

  async verifyPageElements(): Promise<void> {
    await expect(this.logoElmt).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.forgotPasswordLink).toBeVisible();
    await expect(this.signUpLink).toBeVisible();
    await expect(this.microsoftSignInButton).toBeVisible();
    await expect(this.languageSelector).toBeVisible();
    await expect(this.captchaCheckbox).toBeVisible();
  }
}
