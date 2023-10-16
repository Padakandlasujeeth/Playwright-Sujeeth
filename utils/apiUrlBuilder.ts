import apiPath from './apiPaths';
import endpoints from './apiEndpoints';
import { testConfig } from '../testConfig';

function bindUrl(endpoint: string, env: string, userId?: string, isbn?: string) {
  const parts = endpoint.replace(/\/.+$/, '').split('.');
  
  const endpointParts = parts.map((part) => {
    switch (part) {
      case 'api':
        return testConfig.qa;
      default:
          return apiPath[part] ?? '/';
    }
  });
        
  if (endpoint === endpoints.account.get) {
    endpointParts.push(userId);
  }
  if (endpoint === endpoints.books.put) {
    endpointParts.push(isbn);
  }

  return endpointParts.join('/');
}

function searchParamsForUrl(page: string, userId?: string) {
  let queryParams;

  switch (page) {
    case endpoints.books.delete:
      if (userId){
        queryParams = { UserId: userId };
      }
      break;
    default:
      queryParams = {};
  }

  return new URLSearchParams(queryParams).toString();
}

export function buildUrl(endpoint: string, userId?: string, isbn?: string) {
  const env = process.env.ENV!;
  const url = [
    bindUrl(endpoint, env, userId, isbn),
    searchParamsForUrl(endpoint, userId),
  ]
  .filter(Boolean)
  .join('?');
  
  return url;
}