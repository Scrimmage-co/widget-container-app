import httpClient, {composeServerUrl} from './httpClient';

export const recordRewardable = (
  rewardable: any,
  rewarderKey: string,
): Promise<any> => {
  return httpClient
    .post(
      composeServerUrl('/api/integrations/rewards'),
      {
        rewardable,
      },
      {
        headers: {
          Authorization: `Token ${rewarderKey}`,
        },
      },
    )
    .then(response => {
      const data = response.data;
      console.log(data);
      return data;
    });
};
