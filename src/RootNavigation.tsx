import React, {useEffect} from 'react';
import {
  createNavigationContainerRef,
  NavigationContainer,
  Theme as ReactNavigationTheme,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import MainScreen from './screens/MainScreen';
import WidgetScreen from './screens/WidgetScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, StatusBar, StyleSheet, useColorScheme} from 'react-native';
import {colors} from './Styles/base';
import BetConfigScreen from './screens/BetConfigScreen';
import {useSelector} from 'react-redux';
import {RootState} from './store';
import UserConfigScreen from './screens/UserConfigScreen';
import {useThemeMode} from '@rneui/themed';

export type RootStackParamList = {
  UserConfig: undefined;
  Home: undefined;
  Main: undefined;
  Rewards: undefined;
  BetConfig: undefined;
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const RootStack = createNativeStackNavigator<RootStackParamList>();

const TabStack = createBottomTabNavigator();

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const darkNavigationTheme: ReactNavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#111216',
  },
};

const lightNavigationTheme: ReactNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
  },
};

const RootNavigation = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {setMode} = useThemeMode();

  useEffect(() => {
    setMode(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer
        ref={navigationRef}
        theme={isDarkMode ? darkNavigationTheme : lightNavigationTheme}>
        <RootStack.Navigator
          screenOptions={{
            // Remove the header
            headerShown: false,
          }}>
          <RootStack.Screen name="Home" component={TabNavigation} />
        </RootStack.Navigator>
      </NavigationContainer>
    </>
  );
};

const TabNavigation = () => {
  const appConfig = useSelector<RootState, RootState['appConfig']>(
    state => state.appConfig,
  );

  const isUserConfigured =
    Boolean(appConfig.userId) &&
    appConfig.privateKeys.length > 0 &&
    Boolean(appConfig.serverUrl);

  return (
    <TabStack.Navigator>
      {isUserConfigured && (
        <>
          <TabStack.Screen
            name="Main"
            component={MainScreen}
            options={{
              headerTitle: 'Coin Flipper',
              tabBarLabel: 'Flip',
              tabBarIcon: createTabIcon(
                require('./assets/tabs/coinflip-tab-icon.png'),
              ),
              headerShown: false,
            }}
          />
          <TabStack.Screen
            name="BetConfig"
            component={BetConfigScreen}
            options={{
              headerTitle: 'Custom bet',
              tabBarLabel: 'Create',
              tabBarIcon: createTabIcon(
                require('./assets/tabs/configure-bet-tab-icon.png'),
              ),
            }}
          />
          <TabStack.Screen
            name="Rewards"
            component={WidgetScreen}
            options={{
              tabBarIcon: createTabIcon(
                require('./assets/tabs/rewards-tab-icon.png'),
              ),
              tabBarLabel: 'Rewards',
              headerTitle: 'Rewards',
              headerShown: false,
            }}
          />
        </>
      )}
      <TabStack.Screen
        name="UserConfig"
        component={UserConfigScreen}
        options={{
          headerTitle: isUserConfigured ? 'Settings' : 'Welcome',
          tabBarLabel: isUserConfigured ? 'Settings' : '',
          tabBarIcon: createTabIcon(
            require('./assets/tabs/settings-tab-icon.png'),
          ),
        }}
      />
    </TabStack.Navigator>
  );
};

const createTabIcon = (source: any) => {
  return ({focused}: {focused: boolean}) => {
    const dynamicStyles = {
      tintColor: focused ? undefined : '#999',
    };
    return <Image source={source} style={[dynamicStyles, styles.tabIcon]} />;
  };
};

const styles = StyleSheet.create({
  tabIcon: {
    width: 24,
    height: 24,
  },
});

export default RootNavigation;
