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
    {
      name: 'local',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: baseUrls['local'],
      },
    },
    {
      name: 'staging',
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
