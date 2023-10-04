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
    console.warn(
      'ScrimmageRewardsProvider',
      appConfig.serverUrl,
      appConfig.privateKey,
      appConfig.namespace,
    );
    if (appConfig.serverUrl && appConfig.privateKey && appConfig.namespace) {
      Scrimmage.initRewarder({
        apiServerEndpoint: appConfig.serverUrl,
        privateKey: appConfig.privateKey,
        namespace: appConfig.namespace,
      });
    }
  }, [appConfig]);

  return (
    <ScrimmageRewardsContext.Provider value={null}>
      {children}
    </ScrimmageRewardsContext.Provider>
  );
};
