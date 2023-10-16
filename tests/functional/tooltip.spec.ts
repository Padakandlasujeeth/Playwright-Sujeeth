import test from '../../lib/BaseTest';
const fs = require('fs');

test(`@smoke TC05 - Verify the tooltip`, async ({homePage, elementsPage, widgetsPage }) => {
    const testData = JSON.parse(fs.readFileSync('/Users/apple/Desktop/sujeeth-playwright-test/utils/test_data/tooltip.json', 'utf8'));
    await homePage.navigateToURL();
    await homePage.clickCategoryCard(testData.widgetCategory, testData.widgetUrl);
    await elementsPage.clickElement(testData.toolTipWidget, testData.toolTipUrl);
    await widgetsPage.verifyTooltip(testData.toolTipText)
});