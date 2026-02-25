import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class ForgotPasswordPage extends BasePage {
  readonly logoElmt: Locator;
  readonly heading: Locator;
  readonly emailInput: Locator;
  readonly resetPasswordButton: Locator;
  readonly captchaCheckbox: Locator;
  readonly backToLoginLink: Locator;

  constructor(page: Page) {
    super(page);

    this.logoElmt = page.locator('img[alt="XOGO"]');
    this.heading = page.getByRole('heading', { name: 'Forgot Password', level: 1 });
    this.emailInput = page.getByRole('textbox', { name: 'Enter your email' });
    this.resetPasswordButton = page.getByRole('button', { name: 'Reset Password' });
    // AIDEV-NOTE: Altcha captcha label — same pattern as sign in page
    this.captchaCheckbox = page.locator('label.altcha-label');
    this.backToLoginLink = page.getByRole('link', { name: 'Log In' });
  }

  async goto(): Promise<void> {
    await this.navigate('/en/auth/forgot-password');
    await this.waitForLoadAndElement(this.heading);
  }

  async fillEmail(email: string): Promise<void> {
    // AIDEV-NOTE: networkidle ensures Vue v-model bindings hydrated before fill()
    await this.page.waitForLoadState('networkidle');
    await this.emailInput.fill(email);
  }

  async clickResetPassword(): Promise<void> {
    await this.resetPasswordButton.click();
  }

  // AIDEV-NOTE: Full reset flow — fills email, solves captcha, submits, waits for DOM stable
  async submitResetRequest(email: string): Promise<void> {
    await this.fillEmail(email);
    await this.solveCaptcha();
    await this.clickResetPassword();
    await this.waitForLoad();
  }

  async navigateToLogin(): Promise<void> {
    await this.backToLoginLink.click();
    await this.waitForLoad();
  }

  async verifyPageElements(): Promise<void> {
    await expect(this.logoElmt).toBeVisible();
    await expect(this.heading).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.resetPasswordButton).toBeVisible();
    await expect(this.captchaCheckbox).toBeVisible();
    await expect(this.backToLoginLink).toBeVisible();
  }
}
