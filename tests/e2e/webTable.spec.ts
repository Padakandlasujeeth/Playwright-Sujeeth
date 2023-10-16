import test from '../../lib/BaseTest';
const fs = require('fs');
import * as path from 'path';
const cwd = process.cwd();



const testData = JSON.parse(fs.readFileSync(path.join(cwd, '/utils/test_data/registerUser.json'), 'utf8'));
for (const userData of testData) {
    test (`@smoke TC01 - Scenario A - Verify user can enter new data into the table - ${userData.description}`, async ({ homePage, elementsPage }) => {
      await homePage.navigateToURL();
      await homePage.clickCategoryCard(userData.elementCategory, userData.elementsUrl);
      await elementsPage.clickElement(userData.webTableElement, userData.webTableUrl);
      await elementsPage.clickAddBtn();
      await elementsPage.registerUserDetailsAndValidate(userData);
    });
  }

  test(`@smoke TC01- Scenario B - Verify user can edit the row in a table`, async ({homePage, elementsPage }) => {
    const testData = JSON.parse(fs.readFileSync('/Users/apple/Desktop/sujeeth-playwright-test/utils/test_data/editUser.json', 'utf8'));
    await homePage.navigateToURL();
    await homePage.clickCategoryCard(testData.elementCategory, testData.elementsUrl);
    await elementsPage.clickElement(testData.webTableElement, testData.webTableUrl);
    await elementsPage.editUserDetials(testData);
});