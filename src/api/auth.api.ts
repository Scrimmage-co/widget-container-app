import httpClient, {composeServerUrl} from './httpClient';

export interface LoginDTO {
  id: string;
  token: string;
}

export const createUserToken = (
  username: string,
  rewarderKeys: string[],
): Promise<LoginDTO> => {
  return httpClient
    .post(composeServerUrl('/api/integrations/users'), {
      id: username,
      rewarderKeys: rewarderKeys,
    })
    .then(response => {
      const data = response.data;
      return {
        id: data.id,
        token: data.token,
      };
    });
};
