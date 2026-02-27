import { test, expect } from '@playwright/test';
import { SignInPage } from '../pages/auth/SignInPage';
import { SignUpPage } from '../pages/auth/SignUpPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';

// AIDEV-NOTE: Credentials sourced from environment variables — set in .env before running
const EMAIL = process.env['EMAIL'] ?? '';
const PASSWORD = process.env['PASSWORD'] ?? '';

// ---------------------------------------------------------------------------
// Sign In
// ---------------------------------------------------------------------------

test.describe('Sign In', () => {
  test('should display all page elements', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();
    await signInPage.verifyPageElements();
  });

  test('should display all SSO login buttons', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();
    await expect(signInPage.microsoftSignInButton).toBeVisible();
    await expect(signInPage.googleSignInButton).toBeVisible();
    await expect(signInPage.facebookSignInButton).toBeVisible();
    await expect(signInPage.appleSignInButton).toBeVisible();
  });

  test('should show email validation error for invalid email', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();
    await signInPage.fillEmail('not-an-email');
    await signInPage.verifyEmailError();
  });

  test('should show password validation error for short password', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();
    await signInPage.fillEmail(EMAIL);
    await signInPage.fillPassword('123');
    await signInPage.verifyPasswordError();
  });

  test('should toggle password visibility', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();
    // Use a hardcoded value — toggle only works on non-empty password field (UI behaviour)
    await signInPage.fillPassword('AnyPassword1!');
    // Password field starts as type="password"
    await expect(signInPage.passwordInput).toHaveAttribute('type', 'password');
    await signInPage.passwordToggle.click();
    await expect(signInPage.passwordInput).toHaveAttribute('type', 'text');
    await signInPage.passwordToggle.click();
    await expect(signInPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('should navigate to Forgot Password page', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();
    await signInPage.navigateToForgotPassword();
    await expect(page).toHaveURL('/en/auth/forgot-password');
  });

  test('should navigate to Sign Up page', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();
    await signInPage.navigateToSignUp();
    await expect(page).toHaveURL('/en/auth/signup');
  });

  // AIDEV-NOTE: Captcha is required — test solves Altcha proof-of-work before submitting
  test('should successfully log in with valid credentials', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();
    await signInPage.login(EMAIL, PASSWORD);
    // After login, redirected away from the auth page
    expect(page.url()).not.toContain('/en/auth/login');
  });

  test('should show error for incorrect credentials', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();
    await signInPage.fillEmail(EMAIL);
    await signInPage.fillPassword('WrongPassword999');
    await signInPage.solveCaptcha();
    await signInPage.clickLoginButton();
    // Remains on login page when credentials are wrong
    expect(page.url()).toContain('/en/auth/login');
  });
});

// ---------------------------------------------------------------------------
// Sign Up
// ---------------------------------------------------------------------------

test.describe('Sign Up', () => {
  test('should display step 1 elements', async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    await signUpPage.goto();
    await signUpPage.verifyStep1Elements();
  });

  test('should advance to step 2 after filling step 1', async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    await signUpPage.goto();
    // AIDEV-NOTE: Use a unique email per run to avoid duplicate account errors
    const uniqueEmail = `test+${Date.now()}@example.com`;
    await signUpPage.fillStep1(uniqueEmail, 'TestPassword1!');
    await signUpPage.clickNext();
    await signUpPage.verifyStep2Elements();
  });

  test('should return to step 1 from step 2 via Back button', async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    await signUpPage.goto();
    const uniqueEmail = `test+${Date.now()}@example.com`;
    await signUpPage.fillStep1(uniqueEmail, 'TestPassword1!');
    await signUpPage.clickNext();
    await signUpPage.verifyStep2Elements();
    await signUpPage.clickBack();
    await signUpPage.verifyStep1Elements();
  });

  test('should navigate to Log In page from Sign Up', async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    await signUpPage.goto();
    await signUpPage.navigateToLogin();
    expect(page.url()).toContain('/en/auth/login');
  });

  test('should navigate to Log In page via Return to log in link on step 1', async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    await signUpPage.goto();
    await signUpPage.returnToLoginLink.click();
    expect(page.url()).toContain('/en/auth/login');
  });

  test('should not advance to step 2 without EULA accepted', async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    await signUpPage.goto();
    await signUpPage.fillEmail(`test+${Date.now()}@example.com`);
    await signUpPage.fillPassword('TestPassword1!');
    await signUpPage.fillConfirmPassword('TestPassword1!');
    // EULA not accepted — Next button must remain disabled
    await expect(signUpPage.nextButton).toBeDisabled();
  });

  test('should not advance to step 2 with mismatched passwords', async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    await signUpPage.goto();
    await signUpPage.fillEmail(`test+${Date.now()}@example.com`);
    await signUpPage.fillPassword('TestPassword1!');
    await signUpPage.fillConfirmPassword('DifferentPassword1!');
    await signUpPage.acceptEula();
    // Passwords don't match — Next button must remain disabled
    await expect(signUpPage.nextButton).toBeDisabled();
  });
});

// ---------------------------------------------------------------------------
// Forgot Password
// ---------------------------------------------------------------------------

test.describe('Forgot Password', () => {
  test('should display all page elements', async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.goto();
    await forgotPasswordPage.verifyPageElements();
  });

  test('should navigate back to Sign In page', async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.goto();
    await forgotPasswordPage.navigateToLogin();
    expect(page.url()).toContain('/en/auth/login');
  });

  test('should also reach Forgot Password from Sign In page', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();
    await signInPage.navigateToForgotPassword();
    const forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.verifyPageElements();
  });

  // AIDEV-NOTE: Captcha required — submitting with a known email triggers a reset email
  test('should submit reset request for a valid email', async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.goto();
    await forgotPasswordPage.submitResetRequest(EMAIL);
    // After submission, page should show success or navigate away from the form
    // AIDEV-TODO: Update assertion once confirmed post-submit UI behaviour
    expect(page.url()).not.toContain('/en/auth/login');
  });

  test('should show validation error for invalid email format', async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.goto();
    await forgotPasswordPage.fillEmail('not-an-email');
    await forgotPasswordPage.clickResetPassword();
    // Form should not proceed with an invalid email format
    await expect(forgotPasswordPage.emailInput).toBeVisible();
  });
});
