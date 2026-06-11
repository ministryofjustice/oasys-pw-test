import { defineConfig, devices } from '@playwright/test'
import { userSuffixes } from 'localSettings'

export default defineConfig({
  testDir: 'tests',
  testMatch: '**/*.test.ts',
  fullyParallel: true,
  workers: userSuffixes.length,
  timeout: 600_000,

  reporter: [['html', { open: 'never', noSnippets: true }]],

  use: {
    trace: 'on-first-retry',
    screenshot: { mode: 'on-first-failure', fullPage: true },
    headless: true,
    actionTimeout: 10_000,
    navigationTimeout: 10_000,
    launchOptions: {
      downloadsPath: './test-results/downloads',
      args: ['--disable-pdf-viewer'],
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },

    },
  ],
})
