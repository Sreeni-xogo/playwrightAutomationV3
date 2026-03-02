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
  readonly googleSignInButton: Locator;
  readonly facebookSignInButton: Locator;
  readonly appleSignInButton: Locator;
  readonly languageSelector: Locator;
  readonly captchaCheckbox: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;

  constructor(page: Page) {
    super(page);

    this.logoElmt = page.locator('img[alt="XOGO"]');
    // AIDEV-NOTE: Using direct DOM selectors — getByRole unreliable for Vue-reactive email/password inputs
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.passwordToggle = page.locator('span[data-slot="trailing"] button');
    this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password' });
    // AIDEV-NOTE: Sign Up link lives in the side panel on the login page
    this.signUpLink = page.getByRole('link', { name: 'Sign Up for Free' });
    // AIDEV-NOTE: DIFF-01 — pre-prod button text changed to "Sign in with Microsoft"
    this.microsoftSignInButton = page.getByRole('button', { name: 'Sign in with Microsoft' });
    // AIDEV-NOTE: DIFF-02 — Google/Facebook/Apple SSO buttons absent on pre-prod
    this.googleSignInButton = page.getByRole('button', { name: 'Login with Google' });
    this.facebookSignInButton = page.getByRole('button', { name: 'Login with Facebook' });
    this.appleSignInButton = page.getByRole('button', { name: 'Login with Apple' });
    this.languageSelector = page.getByRole('button', { name: 'Show popup' });
    // AIDEV-NOTE: Altcha captcha label — clicking triggers proof-of-work
    this.captchaCheckbox = page.locator('label.altcha-label');

    this.emailError = page.locator('div[data-slot="error"]').filter({ hasText: 'Invalid email address' });
    this.passwordError = page.locator('div[data-slot="error"]').filter({ hasText: 'Password must be at least 6 characters' });
  }

  async goto(): Promise<void> {
    await this.navigate('/en/auth/login');
    await this.waitForLoadAndElement(this.logoElmt);
  }

  async fillEmail(email: string): Promise<void> {
    // AIDEV-NOTE: networkidle ensures Vue v-model bindings are fully hydrated before fill()
    // Without this, fill() sets the native DOM value but does not update Vue's reactive state.
    await this.page.waitForLoadState('networkidle');
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.passwordInput.fill(password);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  // AIDEV-NOTE: Full login flow — fills credentials, solves captcha, submits, waits for redirect
  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.solveCaptcha();
    await this.clickLoginButton();
    // AIDEV-NOTE: SPA login doesn't trigger domcontentloaded — wait for URL to leave the auth/login page
    await this.page.waitForURL((url) => !url.pathname.includes('/auth/login'), { timeout: 15000 });
  }

  async clearAllFields(): Promise<void> {
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }

  async navigateToForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
    await this.waitForLoad();
  }

  async navigateToSignUp(): Promise<void> {
    await this.signUpLink.click();
    await this.waitForLoad();
  }

  async waitForSuccessfulLogin(expectedUrl: string): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl, { timeout: 15000 });
  }

  async verifyEmailError(expected: string = 'Invalid email address'): Promise<void> {
    await this.page.keyboard.press('Tab');
    await expect(this.emailError).toBeVisible({ timeout: 10000 });
    await expect(this.emailError).toContainText(expected);
  }

  async verifyPasswordError(expected: string = 'Password must be at least 6 characters'): Promise<void> {
    await this.page.keyboard.press('Tab');
    await expect(this.passwordError).toBeVisible({ timeout: 10000 });
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
    // AIDEV-NOTE: DIFF-02 — Google/Facebook/Apple SSO buttons absent on pre-prod; not asserted
    await expect(this.languageSelector).toBeVisible();
    await expect(this.captchaCheckbox).toBeVisible();
  }
}
