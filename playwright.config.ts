import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const ENV = process.env.TEST_ENV || 'staging';

const baseUrls: Record<string, string> = {
  local: process.env.LOCAL_URL || 'http://localhost:5173',
  staging: process.env.STAGING_URL || 'https://manager-staging.xogo.io',
  'pre-release': process.env.PRE_RELEASE_URL || 'https://manager-node24-slots-manager-node24-preview-gwdaereqgqhtgkhp.westus-01.azurewebsites.net',
  production: process.env.PROD_URL || 'https://manager.xogo.io',
};

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: baseUrls[ENV],
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    // AIDEV-NOTE: staging-setup logs in once and saves .auth/staging-state.json.
    // Authenticated spec files opt in via test.use({ storageState: '.auth/staging-state.json' }).
    // Auth spec files do NOT opt in — they run unauthenticated to test the login/signup flows.
    {
      name: 'staging-setup',
      testMatch: 'e2e/auth/staging.setup.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: baseUrls['staging'],
      },
    },
    {
      name: 'local',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: baseUrls['local'],
      },
    },
    {
      name: 'staging',
      dependencies: ['staging-setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: baseUrls['staging'],
      },
    },
    {
      name: 'pre-release',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: baseUrls['pre-release'],
      },
    },
    {
      name: 'production',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: baseUrls['production'],
      },
    },
  ],
});
