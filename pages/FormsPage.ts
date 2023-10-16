import { Page, BrowserContext, Locator, expect, Keyboard } from '@playwright/test';
import { WebActions } from '../lib/WebActions';
import * as path from 'path';

let webActions: WebActions;

export class FormsPage {
  readonly page: Page;
  readonly context: BrowserContext;
  readonly FORM_TITLE_TEXT: Locator;
  readonly FIRST_NAME_INPUT: Locator;
  readonly LAST_NAME_INPUT: Locator;
  readonly USER_EMAIL_INPUT: Locator;
  readonly GENDER_RADIO_BUTTON: Locator;
  readonly USER_NUMBER_INPUT: Locator;
  readonly DATE_OF_BIRTH_INPUT: Locator;
  readonly SUBJECTS_MULTI_INPUT: Locator;
  readonly HOBBIES_CHECK_BOX_LIST: Locator;
  readonly PICTURE_UPLOAD: string;
  readonly CURRENT_ADDRESS_TEXT_BOX: Locator;
  readonly STATE_DROPDOWN: string;
  readonly CITY_DROPDOWN: string;
  readonly SUBMIT_BUTTON: Locator;
  readonly SUBJECT_SELECTION_LIST: Locator;
  readonly SUBJECT_INPUT: Locator;
  readonly SUBJECTS_MENU: Locator;
  readonly SUBMISSION_MODEL: Locator;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
    this.FORM_TITLE_TEXT = page.locator(".practice-form-wrapper");
    this.FIRST_NAME_INPUT = page.locator("#firstName");
    this.LAST_NAME_INPUT = page.locator("#lastName");
    this.USER_EMAIL_INPUT = page.locator("#userEmail");
    this.GENDER_RADIO_BUTTON = page.locator("[type='radio']");
    this.USER_NUMBER_INPUT = page.locator("#userNumber");
    this.DATE_OF_BIRTH_INPUT = page.locator("#dateOfBirthInput");
    this.SUBJECTS_MULTI_INPUT = page.locator("#subjectsContainer");
    this.HOBBIES_CHECK_BOX_LIST = page.locator("[type='checkbox']");
    this.PICTURE_UPLOAD = "#uploadPicture";
    this.SUBJECT_SELECTION_LIST = this.page.locator(".subjects-auto-complete__value-container")
    this.SUBJECT_INPUT = this.page.locator("#subjectsInput")
    this.SUBJECTS_MENU = this.page.locator(".subjects-auto-complete__menu")
    this.SUBMISSION_MODEL = this.page.locator(".modal-title.h4")
    this.CURRENT_ADDRESS_TEXT_BOX = page.locator("#currentAddress");
    this.STATE_DROPDOWN = "#state";
    this.CITY_DROPDOWN = "#city";
    this.SUBMIT_BUTTON = page.locator("#submit");

    webActions = new WebActions(this.page, this.context);
  }

  async postSubmitValidation(testUserData): Promise<void> {
    // Wait for the modal to appear after form submission
    //await this.page.waitForSelector(".modal-content");

    const modalData = await this.page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll(".table tbody tr"));
      const data = {};

      rows.forEach((row) => {
        const label =
          row.querySelector("td:first-child")?.textContent?.trim() || "";
        const value =
          row.querySelector("td:last-child")?.textContent?.trim() || "";
        data[label] = value;
      });

      return data;
    });
    const differences = this.checkObjectDifferences(testUserData,modalData)
    expect.soft((await differences).length).toBe(0)
    expect.soft(await this.FIRST_NAME_INPUT.textContent()).toBe("")
  }

  async checkObjectDifferences(obj1: Record<string, any>, obj2: Record<string, any>): Promise<string[]> {
    let differences: string[] = [];
  
    for (const key in obj1) {
      if (obj1[key].trim() !== obj2[key].trim()) {
        differences.push(`${key}: Expected '${obj1[key]}' but got '${obj2[key]}'`);
      }
    }
    console.log("Differences: ",differences)
  
    return differences;
  }

  async registerForm(testData) {
    const keyboard: Keyboard = this.page.keyboard;
    await this.FIRST_NAME_INPUT.fill(testData.firstName);
    await this.LAST_NAME_INPUT.fill(testData.lastName);
    await this.USER_EMAIL_INPUT.fill(testData.email);
    await this.page.getByText(testData.gender, { exact: true }).click();
    await this.USER_NUMBER_INPUT.fill(testData.mobileNumber);
    await this.DATE_OF_BIRTH_INPUT.fill(testData.dateOfBirth);
    await this.SUBJECT_SELECTION_LIST.click();
    for (const subject of testData.subjects) {
      await this.SUBJECT_INPUT.fill(subject);
      await this.page.waitForTimeout(2000)
      if(!await this.SUBJECTS_MENU.isVisible()){
        testData.subjects = testData.subjects.filter(subject => subject !== subject);
        console.log(testData)
      }
      else{
        await keyboard.press("Enter");
      }

      
    }
    for (const hobby of testData.hobbies) {
      await this.page.getByText(hobby).click();
    }
    await this.page.setInputFiles(this.PICTURE_UPLOAD, testData.picturePath);
    await this.CURRENT_ADDRESS_TEXT_BOX.fill(testData.currentAddress);
    await this.page.evaluate(() => {
      const element = document.getElementById('fixedban');
      if (element) {
        element.remove();
      }
    });
    await this.page.locator('div').filter({ hasText: /^Select State$/ }).nth(3).click();
    await this.page.getByText(testData.state, { exact: true }).click();
    await this.page.getByText('Select City').click();
    await this.page.getByText(testData.city, { exact: true }).click();
    await this.page.evaluate(() => {
      const submitButton = document.querySelector("#submit") as HTMLElement;
      if (submitButton) {
        submitButton.click();
      }
    });
    const validationData = {
      'Student Name': testData.firstName+" "+testData.lastName,
      'Student Email': testData.email,
      'Gender': testData.gender,
      'Mobile': testData.mobileNumber,
      'Date of Birth': testData.dateOfBirth,
      'Subjects': testData.subjects.join(', '),
      'Hobbies': testData.hobbies.join(', '),
      'Picture': path.basename(testData.picturePath),
      'Address': testData.currentAddress,
      'State and City': testData.state+" "+testData.city,
    };
    expect(await this.SUBMISSION_MODEL.textContent()).toBe("Thanks for submitting the form")
    this.postSubmitValidation(validationData);
  }
}
