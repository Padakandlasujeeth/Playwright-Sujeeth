import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { WebActions } from '../lib/WebActions';
import { CommonMethods } from '../lib/commonMethods';

let webActions: WebActions;
let commonMethods: CommonMethods;

export class HomePage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly CATEGORY_CARDS_LIST: Locator;


    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        webActions = new WebActions(this.page, this.context);
        commonMethods = new CommonMethods(this.page);
        this.CATEGORY_CARDS_LIST = page.locator('.card');
    }

    async navigateToURL(): Promise<void> {
        await this.page.goto("/");
    }

    async clickCategoryCard(requiredCategory, expectedUrl) {
        const cardList = await this.CATEGORY_CARDS_LIST.all();
        const requiredCategoryElement = await commonMethods.getRequiredLocatorFromList(cardList, requiredCategory);
        if (requiredCategoryElement) {
          await requiredCategoryElement.click();
          const currentUrl = await this.page.url(); // Get the current URL
          if (currentUrl === expectedUrl) {
            console.log('URL verified:', currentUrl);
          } else {
            console.log('URL does not match the expected URL.');
          }
        } else {
          console.log('Desired card not found.');
        }
      }
}