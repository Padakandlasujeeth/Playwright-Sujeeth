import { APIRequestContext } from '@playwright/test';
import { executeRequest } from '../../../utils/apiRequestUtils';
import methods from '../../../utils/apiMethods';
import { testConfig } from '../../../testConfig';

async function createUser(apiContext: APIRequestContext, userName: string, password: string) {
  const method = methods.post;
  const requestOptions = {data: {userName:userName,password:password}};
  const requestUrl = testConfig.qa+"Account/v1/User";
  const response = await executeRequest(apiContext, requestUrl, method, requestOptions);
}

export default { createUser };