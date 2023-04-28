import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Edge} from 'react-native-safe-area-context/src/SafeArea.types';

export interface TabScreenSafeAreaWrapperProps {
  children: React.ReactNode;
  edges?: ReadonlyArray<Edge>;
}

const TabScreenSafeAreaWrapper = ({
  children,
  edges = ['top', 'bottom', 'left', 'right'],
}: TabScreenSafeAreaWrapperProps) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: edges.includes('top') ? insets.top : 0,
          paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
          paddingLeft: edges.includes('left') ? insets.left : 0,
          paddingRight: edges.includes('right') ? insets.right : 0,
        },
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TabScreenSafeAreaWrapper;
