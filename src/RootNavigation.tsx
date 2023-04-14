import React from 'react';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainScreen from './screens/MainScreen';
import WidgetScreen from './screens/WidgetScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Theme as ReactNavigationTheme,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import {Image, useColorScheme} from 'react-native';
import {colors} from './Styles/base';

export type RootStackParamList = {
  Home: undefined;
  Rewards: undefined;
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const RootStack = createNativeStackNavigator<RootStackParamList>();

const TabStack = createBottomTabNavigator();

const darkNavigationTheme: ReactNavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: 'red',
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

  return (
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
  );
};

const TabNavigation = () => {
  return (
    <TabStack.Navigator>
      <TabStack.Screen name="Main" component={MainScreen} />
      <TabStack.Screen
        name="Rewards"
        component={WidgetScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={require('./assets/tabs/reward-tab-icon.png')}
              style={{
                width: 24,
                height: 24,
                opacity: focused ? 1 : 0.5,
              }}
            />
          ),
        }}
      />
    </TabStack.Navigator>
  );
};

export default RootNavigation;
