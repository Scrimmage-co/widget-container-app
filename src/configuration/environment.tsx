export interface EnvironmentConfig {
  P2E_SERVICE_URL: string;
  API_SERVICE_URL: string;
  API_VERSION: number;
  API_VERSION_HEADER: string;
}

// Apply new values here
const environment: EnvironmentConfig = {
  P2E_SERVICE_URL: 'https://coinflip.apps.scrimmage.co/p2e',
  API_SERVICE_URL: 'https://coinflip.apps.scrimmage.co/api',
  API_VERSION: 1,
  API_VERSION_HEADER: 'Scrimmage-Version',
};

export default environment;
