import test from '../../lib/BaseTest';
const fs = require('fs');


test(`@smoke TC03 - Verify user can submit the form.`, async ({homePage, elementsPage, formsPage }) => {
    const testData = JSON.parse(fs.readFileSync('/Users/apple/Desktop/sujeeth-playwright-test/utils/test_data/submitForm.json', 'utf8'));
    await homePage.navigateToURL();
    await homePage.clickCategoryCard(testData.FormsCategory, testData.FormsUrl);
    await elementsPage.clickElement(testData.practiceFormWidget, testData.practiceFormUrl);
    await formsPage.registerForm(testData)
    
});