import { APIRequestContext } from '@playwright/test';
import { buildUrl } from '../../../utils/apiUrlBuilder';
import { executeRequest } from '../../../utils/apiRequestUtils';
import endpoints from '../../../utils/apiEndpoints';
import methods from '../../../utils/apiMethods';
import { testConfig } from '../../../testConfig';

async function deleteAllBooksByUser(apiContext: APIRequestContext, userId: string) {
    const method = methods.delete;
    const requestOptions = {};
    const requestUrl = buildUrl(endpoints.books.delete, userId); //"https://demoqa.com/BookStore/v1/Books?UserId=84d85106-f5d8-448e-8424-4db4eba4abaa";
    console.log([requestUrl,method,requestOptions])
    const response = await executeRequest(apiContext, requestUrl, method, requestOptions);
  }

async function deleteBookAPIByIsbn(apiContext: APIRequestContext, userId: string, isbn: string) {
  const method = methods.delete;
  const requestOptions = { data: { isbn: isbn, userId: userId }};
  const requestUrl = testConfig.qa+"/BookStore/v1/Book"  //buildUrl(endpoints.books.delete);
  console.log([requestUrl,method,requestOptions])
  const response = await executeRequest(apiContext, requestUrl, method, requestOptions);
}

export default { deleteAllBooksByUser, deleteBookAPIByIsbn };