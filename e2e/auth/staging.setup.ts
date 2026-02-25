import { test as setup } from '@playwright/test';
import { SignInPage } from '../pages/auth/SignInPage';

// AIDEV-NOTE: Runs once before all staging tests that declare test.use({ storageState }).
// Saves the authenticated browser session to .auth/staging-state.json so tests
// that need a logged-in state can reuse it without repeating the login flow.
setup('authenticate for staging', async ({ page }) => {
  const signInPage = new SignInPage(page);
  await signInPage.goto();
  await signInPage.login(
    process.env['TEST_EMAIL'] ?? '',
    process.env['TEST_PASSWORD'] ?? ''
  );
  await page.context().storageState({ path: '.auth/staging-state.json' });
});
