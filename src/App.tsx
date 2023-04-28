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

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaProvider>
          <RootNavigation />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
