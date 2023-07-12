import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import Scrimmage from '@scrimmage/rewards';

const ScrimmageRewardsContext = React.createContext<null>(null);

export interface ScrimmageRewardsProviderProps {
  children: React.ReactNode;
}

export const ScrimmageRewardsProvider: React.FC<
  ScrimmageRewardsProviderProps
> = ({children}) => {
  const appConfig = useSelector<RootState, RootState['appConfig']>(
    state => state.appConfig,
  );

  useEffect(() => {
    console.log(
      'ScrimmageRewardsProvider',
      appConfig.serverUrl,
      appConfig.privateKeys,
    );
    if (appConfig.serverUrl && appConfig.privateKeys.length > 0) {
      Scrimmage.initRewarder({
        apiServerEndpoint: appConfig.serverUrl,
        privateKey: appConfig.privateKeys[0].key,
      });
    }
  }, [appConfig]);

  return (
    <ScrimmageRewardsContext.Provider value={null}>
      {children}
    </ScrimmageRewardsContext.Provider>
  );
};
