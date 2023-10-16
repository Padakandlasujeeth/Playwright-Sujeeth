import { APIRequestContext, Page, test } from '@playwright/test';
import deleteBookAPIRequest from '../../api/requests/delete-books-collection';
import addBookAPIRequest from '../../api/requests/create-books-collection';
import { testConfig } from '../../../testConfig';
import { login } from '../setup/auth.setup';
import * as path from 'path';

const fs = require('fs');
const cwd = process.cwd();

test.describe.configure({ mode: 'serial' });

let apiContext: APIRequestContext;
// const env = process.env.ENV!;
// const password = process.env.PASSWORD!;
// let userId = process.env.USERID!;
// const userName = process.env.USERNAME!;

test.beforeAll(async ({ playwright,request}) => {
    const username = testConfig.apiUser;
    const password = testConfig.apiPassword;
    const token= await login(request,username, password);
    console.log(token)
    apiContext = await playwright.request.newContext({
        baseURL: testConfig.qa,
        extraHTTPHeaders: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
    });
});

const testData = JSON.parse(fs.readFileSync(path.join(cwd, '/utils/test_data/addBooks.json'), 'utf8'));
for (let bookData of testData["test_cases"]){
    test(`@api @smoke Add brand new book - ${bookData.test_case}`, async () => { 
        await cleanBooks(bookData,bookData.input.userId);
        for(let isbn of bookData.input.isbn){
            await addBook(bookData,bookData.input.userId,isbn)
        }
    });
}


const deleteTestData = JSON.parse(fs.readFileSync(path.join(cwd, '/utils/test_data/deleteBook.json'), 'utf8'));
for (let bookData of deleteTestData["test_cases"]){
    test(`@api @smoke Delete a book - ${bookData.test_case}`, async () => { 
        if (bookData.test_case=="Positive - Delete Book"){
            try{
                await addBook(bookData,bookData.input.userId,bookData.input.isbn)
            }
            catch (error){
                console.log("Book is already present so we can delete it.")
            }
            
        }

        await deleteBook(bookData,bookData.input.userId,bookData.input.isbn)
    
    });
}

async function cleanBooks(bookData,userId: string) {
    try{
        await deleteBookAPIRequest.deleteAllBooksByUser(apiContext, userId);
    }
    catch (error) {
        const errorString = error.toString()
        if (errorString.includes(bookData.expectedResponse.toString())) {
            console.log('Error message contains the response JSON string.');
          } else {
            throw new Error(
                error
              );
          }
    }
    
};

async function addBook(bookData,userId: string,isbn: string) {
    try{
        await addBookAPIRequest.addBookToCollection(apiContext,userId,isbn)
    }
    catch (error) {
        const errorString = error.toString()
        if (errorString.includes(bookData.expectedResponse.toString())) {
            console.log('Error message contains the response JSON string.');
          } else {
            throw new Error(
                error
              );
          }
    }
    
    
}

async function deleteBook(bookData,userId: string,isbn: string) {
    try{
        await deleteBookAPIRequest.deleteBookAPIByIsbn(apiContext,userId,isbn)
    }
    catch (error) {
        const errorString = error.toString()
        if (errorString.includes(bookData.expectedResponse.toString())) {
            console.log('Error message contains the response JSON string.');
          } else {
            throw new Error(
                error
              );
          }
    }
    
    
}