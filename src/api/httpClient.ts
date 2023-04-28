import axios, {AxiosInstance} from 'axios';
import environment from '../configuration/environment';
import axiosRetry from 'axios-retry';
import {Platform} from 'react-native';

const appName = 'Coinflip';
const appVersion = '1.0.0';
const appUserAgent = `${appName}/${appVersion} (${Platform.OS})`;

const httpClient: AxiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Scrimmage-Agent': appUserAgent,
    [environment.API_VERSION_HEADER]: environment.API_VERSION,
  },
});

// Retry logic
axiosRetry(httpClient, {
  retries: 5,
  retryDelay: (retryNumber = 0) => {
    const delay = Math.pow(2, retryNumber) * 1000;
    const randomSum = delay * 0.2 * Math.random(); // 0-20% of the delay
    return delay + randomSum;
  },
  retryCondition: axiosRetry.isNetworkOrIdempotentRequestError,
  onRetry: (retryCount, error, requestConfig) => {
    console.warn(retryCount, error, requestConfig);
  },
});

const getServiceUrls = (service: string): string => {
  return {
    p2e: environment.P2E_SERVICE_URL,
    api: environment.API_SERVICE_URL,
  }[service];
};

export const composeServerUrl = (
  path: string,
  queryParams?: {[key: string]: string},
) => {
  const match = path.match(/^\/?(?<service>p2e|api)\/(?<servicePath>.+)$/);
  if (!match) {
    throw new Error('Unsupported service url');
  }
  const {
    groups: {service, servicePath},
  } = match;

  const query = Object.entries(queryParams || {})
    .map(
      ([key, value]) =>
        encodeURIComponent(key) +
        '=' +
        (value ? encodeURIComponent(value) : ''),
    )
    .join('&');

  return (
    getServiceUrls(service) + '/' + servicePath + (query ? '?' + query : '')
  );
};

export const setHttpAuth = (authorizationHeader: string) => {
  if (authorizationHeader) {
    httpClient.defaults.headers.common.Authorization = authorizationHeader;
  } else {
    delete httpClient.defaults.headers.common.Authorization;
  }
};

export default httpClient;
