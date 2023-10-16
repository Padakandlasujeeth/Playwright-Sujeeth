import { APIRequestContext, test } from '@playwright/test';
import createUserAPIRequest from '../../api/requests/user-account-collection';
import { testConfig } from '../../../testConfig';
const fs = require('fs');
import * as path from 'path';
const cwd = process.cwd();

test.describe.configure({ mode: 'serial' });

let apiContext: APIRequestContext;
// const env = process.env.ENV!;
// const password = process.env.PASSWORD!;
// const userId = process.env.USERID!;
// const userName = process.env.USERNAME!;

test.beforeAll(async ({ playwright,request}) => {
    apiContext = await playwright.request.newContext({
        baseURL: testConfig.qa,
        extraHTTPHeaders: {
            Accept: 'application/json',
        },
    });
});



const testData = JSON.parse(fs.readFileSync(path.join(cwd, '/utils/test_data/createUser.json'), 'utf8'));
for (let userData of testData["test_cases"]) {
    test(`@api @smoke Create User - ${userData.test_case}`, async () => { 
        
        if (userData.input.userName=="valid-username"){
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().replace(/[:T-]/g, '').slice(0, -5);
            userData.input.userName = `user-${formattedDate}`
        }
        await createNewUser(userData,userData.input.userName,userData.input.password);
    });
}
async function createNewUser(userData, userName: string, password: string) {
    try{
        await createUserAPIRequest.createUser(apiContext,userName,password)
    }
    catch (error) {
        const errorString = error.toString()
        if (errorString.includes(userData.expectedResponse.toString())) {
            console.log('Error message contains the response JSON string.');
          } else {
            console.log(errorString)
            console.log(userData.expectedResponse)
            throw new Error(
                error
              );
          }
    }
    
}