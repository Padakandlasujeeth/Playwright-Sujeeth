import test from '../../lib/BaseTest';
const fs = require('fs');

test (`@smoke TC04 - Verify the progress bar`, async ({homePage, elementsPage, widgetsPage }) => {
    const testData = JSON.parse(fs.readFileSync('/Users/apple/Desktop/sujeeth-playwright-test/utils/test_data/progressBar.json', 'utf8'));
    await homePage.navigateToURL();
    await homePage.clickCategoryCard(testData.widgetCategory, testData.widgetUrl);
    await elementsPage.clickElement(testData.progressBarWidget, testData.progressBarUrl);
    await widgetsPage.testProgressBar()
});
