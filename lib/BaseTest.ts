import { test as baseTest,expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CommonMethods } from './commonMethods';
import { ElementsPage } from '../pages/ElementsPage';
import { WidgetsPage } from '../pages/WidgetsPage';
import { InteractionsPage } from '../pages/InteractionsPage';
import { FormsPage } from '../pages/FormsPage';

const test = baseTest.extend<{
    homePage: HomePage;
    commonMethods: CommonMethods;
    elementsPage: ElementsPage;
    widgetsPage: WidgetsPage;
    interactionsPage: InteractionsPage;
    formsPage: FormsPage;
}>({
    homePage: async ({ page, context}, use) => {
        await use(new HomePage(page, context));
    },
    commonMethods: async ({page}, use) => {
        await use(new CommonMethods(page));
    },
    elementsPage: async ({page, context}, use) => {
        await use(new ElementsPage(page, context));
    },
    widgetsPage: async ({page, context}, use) => {
        await use(new WidgetsPage(page, context));
    },
    interactionsPage: async ({page, context}, use) => {
        await use(new InteractionsPage(page, context));
    },
    formsPage: async ({page, context}, use) => {
        await use(new FormsPage(page, context));
    },
})

export default test;