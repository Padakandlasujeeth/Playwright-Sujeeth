import test from '../../lib/BaseTest';
const fs = require('fs');

test(`@smoke TC02 - Verify broken image`, async ({homePage, elementsPage }) => {
    const testData = JSON.parse(fs.readFileSync('/Users/apple/Desktop/sujeeth-playwright-test/utils/test_data/brokenImage.json', 'utf8'));
    await homePage.navigateToURL();
    await homePage.clickCategoryCard(testData.elementCategory, testData.elementsUrl);
    await elementsPage.clickElement(testData.brokenImageElement, testData.brokenUrl);
    await elementsPage.validateBrokenImage();
});
