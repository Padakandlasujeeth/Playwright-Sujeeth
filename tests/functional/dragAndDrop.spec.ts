import test from '../../lib/BaseTest';
const fs = require('fs');

test(`@smoke TC06 - Verify user can drag and drop`, async ({homePage, elementsPage, interactionsPage }) => {
    const testData = JSON.parse(fs.readFileSync('/Users/apple/Desktop/sujeeth-playwright-test/utils/test_data/dragDrop.json', 'utf8'));
    await homePage.navigateToURL();
    await homePage.clickCategoryCard(testData.interactionsCategory, testData.interactionsUrl);
    await elementsPage.clickElement(testData.droppableinteractions, testData.droppableUrl);
    await interactionsPage.dragAndDrop()
});