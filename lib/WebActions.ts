import type { Page } from '@playwright/test';
import { BrowserContext, expect } from '@playwright/test';

export class WebActions {
    readonly page: Page;
    readonly context: BrowserContext;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
    }

    async delay(time: number): Promise<void> {
        return new Promise(function (resolve) {
            setTimeout(resolve, time);
        });
    }

    async clickByText(text: string): Promise<void> {
        await this.page.getByText(text, { exact: true }).click();
    }

    async clickElementJS(locator: string): Promise<void> {
        await this.page.$eval(locator, (element: HTMLElement) => element.click());
    }

    async readTestDataFromJSON(path: string) {
        const testData = require(path);
        return testData;
      }

    async hoverOverElement(page, targetLocator) {
        await page.hover(targetLocator);
      }


    async getTooltipText(page, selector) {
        return page.evaluate((selector) => {
          const element = document.querySelector(selector);
          return element ? element.textContent : null;
        }, selector);
    }

    
}