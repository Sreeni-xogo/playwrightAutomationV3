import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    // AIDEV-NOTE: JUnit feeds Azure DevOps Tests tab + Test Analytics trending dashboard
    ['junit', { outputFile: 'results/results.xml' }],
  ],
  // AIDEV-NOTE: Timeouts set conservatively — target env can be slow (staging/pre-release/production)
  timeout: 60000,                  // Per-test timeout (default 30s → 60s for multi-step CRUD tests)
  expect: { timeout: 10000 },      // toBeVisible/toHaveText etc. (default 5s → 10s)
  use: {
    baseURL: process.env.URL,
    actionTimeout: 15000,          // How long Playwright waits for element to be actionable before click/fill
    navigationTimeout: 30000,      // How long page.goto() / waitForURL() navigation waits
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    // AIDEV-NOTE: setup logs in once and saves .auth/state.json.
    // Authenticated spec files opt in via test.use({ storageState: '.auth/state.json' }).
    // Auth spec files do NOT opt in — they run unauthenticated to test the login/signup flows.
    {
      name: 'setup',
      testMatch: 'e2e/auth/auth.setup.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
