import { defineConfig, devices } from '@playwright/test';
import { testConfig } from './testConfig';
const ENV = process.env.npm_config_ENV;

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    headless: true
    
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: `Chrome`,
      use: {
        // Configure the browser to use.
        browserName: `chromium`,

        //Chrome Browser Config
        channel: `chrome`,

        //Picks Base Url based on User input
        baseURL: testConfig.qa,

        //Browser Mode
        headless: true,

        //Browser height and width
        //viewport: { width: 1500, height: 730 },
        ignoreHTTPSErrors: true,

        //Enable File Downloads in Chrome
        acceptDownloads: true,

        //Artifacts
        screenshot: `only-on-failure`,
        video: `retain-on-failure`,
        trace: `retain-on-failure`,

        //Slows down execution by ms
        launchOptions: {
          slowMo: 0
        }
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'],
      
      baseURL: testConfig.qa,//Browser Mode

      headless: true,

      ignoreHTTPSErrors: true,

      //Enable File Downloads in Chrome
      acceptDownloads: true,

      //Artifacts
      screenshot: `only-on-failure`,
      video: `retain-on-failure`,
      trace: `retain-on-failure`,

      //Slows down execution by ms
      launchOptions: {
        slowMo: 0
      } },

      timeout: 100000,
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'],
      
      baseURL: testConfig.qa, 

      headless: true,

      ignoreHTTPSErrors: true,

      //Enable File Downloads in Chrome
      acceptDownloads: true,

      //Artifacts
      screenshot: `only-on-failure`,
      video: `retain-on-failure`,
      trace: `retain-on-failure`,

      //Slows down execution by ms
      launchOptions: {
        slowMo: 0
      } },
      timeout: 100000,
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
