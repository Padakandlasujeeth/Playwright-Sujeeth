import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { WebActions } from '../lib/WebActions';
import { CommonMethods } from '../lib/commonMethods';

let webActions: WebActions;
let commonMethods: CommonMethods;

export class ElementsPage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly ELEMENTS_LIST: Locator;
    readonly ADD_BUTTON: Locator;
    readonly FIRST_NAME: Locator;
    readonly LAST_NAME: Locator;
    readonly USER_EMAIL: Locator;
    readonly AGE: Locator;
    readonly SALARY: Locator;
    readonly DEPARTMENT: Locator;
    readonly SUBMIT: Locator;
    readonly REGISTRATION_FORM_TITLE;
    readonly BROKEN_IMAGE: Locator;
    readonly DATA_CONFIRMATION_TABLE;
    readonly EDIT_MODEL;


    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        webActions = new WebActions(this.page, this.context);
        commonMethods = new CommonMethods(this.page);
        this.ELEMENTS_LIST = page.locator('div.element-list > ul > li');
        this.ADD_BUTTON = page.locator("#addNewRecordButton")
        this.FIRST_NAME = page.locator("#firstName")
        this.LAST_NAME = page.locator("#lastName")
        this.USER_EMAIL = page.locator("#userEmail")
        this.AGE = page.locator("#age")
        this.SALARY = page.locator("#salary")
        this.DEPARTMENT = page.locator("#department")
        this.SUBMIT = page.locator("#submit")
        this.BROKEN_IMAGE = page.locator("div.row > div:nth-child(2) > div:nth-child(2) > img:nth-child(6)")
        this.REGISTRATION_FORM_TITLE = page.locator("#registration-form-modal")
        this.DATA_CONFIRMATION_TABLE = '.ReactTable.-striped.-highlight'
        this.EDIT_MODEL = ".modal-content"

    }

    async clickElement(requiredElementText, expectedUrl) {
        const elementList = await this.ELEMENTS_LIST.all();
        const requiredElement = await commonMethods.getRequiredLocatorFromList(elementList, requiredElementText);
        if (requiredElement) {
          await requiredElement.click();
          const currentUrl = await this.page.url(); // Get the current URL
          if (currentUrl === expectedUrl) {
            console.log('URL verified:', currentUrl);
          } else {
            console.log('URL does not match the expected URL.');
          }
        } else {
          console.log('Desired element not found.');
        }
      }

    async clickAddBtn(){
      await this.ADD_BUTTON.click()
    }

    async validateFormData(firstName, email, age, salary, department) {
      let errorList: Locator[] = [];
    
      // Validation for First Name (Mandatory, any value)
      if (!firstName) {
        errorList.push(this.FIRST_NAME);
      }
    
      // Validation for Email (Mandatory, email format)
      if (!email) {
        errorList.push(this.USER_EMAIL);
      } else{
        if (!commonMethods.isValidEmail(email)) {
        errorList.push(this.USER_EMAIL);
        }
      }
    
      // Validation for Age (Mandatory, only double-digit allowed)
      if (!age) {
        errorList.push(this.AGE);
      } else if (!/^\d{2}$/.test(age)) {
        errorList.push(this.AGE);
      }
    
      // Validation for Salary (Mandatory, only integer)
      if (!salary) {
        errorList.push(this.SALARY);
      } else if (!/^\d+$/.test(salary)) {
        errorList.push(this.SALARY);
      }
    
      // Validation for Department (Mandatory, any value)
      if (!department) {
        errorList.push(this.DEPARTMENT);
      }
    
      // Return the list of validation errors
      return errorList;
    }

    async getRowDataByFirstName(firstName: string): Promise<{ [key: string]: string }> {
      const tableSelector = this.DATA_CONFIRMATION_TABLE;
      const rows = await this.page.$$(`${tableSelector} .rt-tr.-odd, ${tableSelector} .rt-tr.-even`);
    
      for (const row of rows) {
        const firstNameCell = await row.$('.rt-td');
        const cellText = await firstNameCell?.innerText();
    
        if (cellText === firstName) {
          const cells = await row.$$('.rt-td');
          const rowData: { [key: string]: string } = {};
    
          for (let i = 0; i < cells.length; i++) {
            const headerCell = await this.page.$(`${tableSelector} .rt-th:nth-child(${i + 1})`);
            const headerText = await headerCell?.innerText();
            const cellValue = await cells[i].innerText();
    
            if (headerText) {
              rowData[headerText.trim()] = cellValue;
            }
          }
    
          return rowData;
        }
      }
    
      return {}; // Return an empty object if no matching row is found.
    }

    async editRow(firstName: string) {
      const tableSelector = this.DATA_CONFIRMATION_TABLE;
    
      // Find all the rows in the table
      const rows = await this.page.$$(tableSelector + ' .rt-tr');
      let counter=1
      for (const row of rows) {
        const firstNameCell = await row.$('.rt-td:first-child');
    
        if (firstNameCell) {
          const cellText = await firstNameCell.innerText();
    
          if (cellText === firstName) {
            let selector = "#edit-record-".concat(counter.toString())
            await this.page.waitForSelector(selector);
            await this.page.locator(selector).click()
            return
    
          }
          counter=counter+1
        }
      }
    
      console.log(`No Edit icon found for the row with the first name: ${firstName}`);
    }
    
    async registerUserDetailsAndValidate(data){
      const expectedErrorList = await this.validateFormData(data.firstName,data.email,data.age,data.salary,data.department)
      console.log(expectedErrorList)
      const title = await this.REGISTRATION_FORM_TITLE.textContent()
      expect.soft(await title.trim()).toBe(data.formName)
      await this.FIRST_NAME.fill(data.firstName)
      await this.LAST_NAME.fill(data.lastName)
      await this.USER_EMAIL.fill(data.email)
      await this.AGE.fill(data.age)
      await this.SALARY.fill(data.salary)
      await this.DEPARTMENT.fill(data.department)
      await this.SUBMIT.click()
      await this.page.waitForLoadState("load",{ timeout: 10000 })
      if (expectedErrorList.length==0){
        await this.validateDataInTable(data);
      }
      else{
        console.log("Data was not submitted due to errors in the Registration Form.")
        await this.page.waitForTimeout(3000); //taking some to update the UI
        for (let i = 0; i < expectedErrorList.length; i++) {
          const element = expectedErrorList[i];
          const computedStyle = await element.evaluateHandle((el) => getComputedStyle(el));
          // Get the border color property from the computed style
          const borderColor = await computedStyle.evaluate((style) => style.getPropertyValue('border-color'));
          expect.soft(borderColor).toMatch('rgb(220, 53, 69)');
        }
      }
    }

    async validateDataInTable(expectedData) {
      let actualData = await this.getRowDataByFirstName(expectedData.firstName)
      console.log(actualData)
      const keyMapping = {
        'First Name': 'firstName',
        'Last Name': 'lastName',
        'Age': 'age',
        'Email': 'email',
        'Salary': 'salary',
        'Department': 'department',
      };
    
      let errorCount = 0

      // Compare the expected data with actual data
      for (const key in actualData) {
        if (key!="Action"){
          if (actualData[key] !== expectedData[keyMapping[key]]) {
            errorCount=errorCount+1
          }
        }
          
      }
      expect(errorCount).toBe(0)
    }

    async editUserDetials(testData){
      let actualDataBeforeEdit = await this.getRowDataByFirstName(testData.firstName)
      this.editRow(testData.firstName)
      await this.page.waitForSelector(this.EDIT_MODEL)
      await this.FIRST_NAME.fill(testData.newFirstName)
      await this.LAST_NAME.fill(testData.newLastName)
      await this.SUBMIT.click()
      await this.page.waitForTimeout(3000)
      let actualDataAfterEdit = await this.getRowDataByFirstName(testData.newFirstName)
      expect.soft(actualDataBeforeEdit["First Name"]).not.toEqual(actualDataAfterEdit["First Name"])
      expect.soft(actualDataBeforeEdit["Last Name"]).not.toEqual(actualDataAfterEdit["Last Name"])
      expect.soft(actualDataAfterEdit["First Name"]).toEqual(testData.newFirstName)
      expect.soft(actualDataAfterEdit["Last Name"]).toEqual(testData.newLastName)
      expect.soft(actualDataBeforeEdit["Age"]).toEqual(actualDataAfterEdit["Age"])
      expect.soft(actualDataBeforeEdit["Email"]).toEqual(actualDataAfterEdit["Email"])
      expect.soft(actualDataBeforeEdit["Salary"]).toEqual(actualDataAfterEdit["Salary"])
      expect.soft(actualDataBeforeEdit["Department"]).toEqual(actualDataAfterEdit["Department"])

    }

    async validateBrokenImage() {
      const imageSrc = await this.BROKEN_IMAGE.getAttribute('src');
      //Check if image src exist
      expect.soft(imageSrc?.length).toBeGreaterThan(1);

      //Check if image is broken
      const isBroken = await this.BROKEN_IMAGE.evaluate((img) => {
        const htmlImage = img as HTMLImageElement;
        return htmlImage.naturalWidth === 0 || htmlImage.naturalHeight === 0;
      });
      if (isBroken) {
        console.log('Broken image detected:', imageSrc);
      } else {
        console.log('Image is valid:', imageSrc);
      }
      expect.soft(isBroken).toBeTruthy()

    }
}

