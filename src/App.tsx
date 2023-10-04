/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import RootNavigation from './RootNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {persistor, store} from './store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Scrimmage from '@scrimmage/rewards';
import {ScrimmageRewardsProvider} from './providers/ScrimmageRewardsProvider';
import {createTheme, ThemeProvider} from '@rneui/themed';
import ToastConfigurator from './components/ToastConfigurator';

Scrimmage.initRewarder({
  apiServerEndpoint: 'https://coinflip.apps.scrimmage.co',
  privateKey:
    'AYeqBMEEeewDZM1rng_nIwXyKRJT0xjmuSNzFAxK2loAy9FLZoqSMzQJEjDdLbw-Px7fKudU',
  namespace: 'production',
});

const theme = createTheme({});

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ScrimmageRewardsProvider>
          <ThemeProvider theme={theme}>
            <SafeAreaProvider>
              <RootNavigation />
              <ToastConfigurator />
            </SafeAreaProvider>
          </ThemeProvider>
        </ScrimmageRewardsProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
