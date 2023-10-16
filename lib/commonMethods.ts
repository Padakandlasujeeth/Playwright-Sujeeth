import type { Page } from '@playwright/test';
import { BrowserContext, expect } from '@playwright/test';

export class CommonMethods {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async getRequiredLocatorFromList(locatorList, reqiredElementText) {
        for (const element of locatorList) {
          const elementText = await element.textContent();
          if (elementText==reqiredElementText) {
            return element;
          }
        }
        return null;
    }

    async isValidEmail(email) {
        console.log(email)
        // Define a regular expression pattern for a basic email format
        const emailPattern = new RegExp("^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$");
        const isvalidEmail = emailPattern.test(email);
        console.log(isvalidEmail)
        return isvalidEmail
      }

    

      

    

    
}