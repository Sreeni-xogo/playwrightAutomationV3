import { test as setup } from '@playwright/test';
import { SignInPage } from '../pages/auth/SignInPage';
import { getCredentials, getTier } from '../utils/tierGuard';

// AIDEV-NOTE: Runs once before all tests that declare test.use({ storageState }).
// Saves the authenticated browser session to .auth/state.json so tests
// that need a logged-in state can reuse it without repeating the login flow.
// Credentials are resolved by ACCOUNT_TIER env var (free | pro | enterprise — default: pro).
setup('authenticate', async ({ page }) => {
  const { email, password } = getCredentials();
  console.log(`[auth.setup] Authenticating as tier: ${getTier()} (${email})`);

  const signInPage = new SignInPage(page);
  await signInPage.goto();
  await signInPage.login(email, password);
  await page.context().storageState({ path: '.auth/state.json' });
});
