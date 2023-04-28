import React from 'react';
import TabScreenSafeAreaWrapper from '../../components/TabScreenSafeAreaWrapper';
import {Text, View} from 'react-native';

const BetConfigScreen = () => {
  return (
    <TabScreenSafeAreaWrapper edges={['left', 'right']}>
      <View>
        <Text>Bet Config Screen</Text>
      </View>
    </TabScreenSafeAreaWrapper>
  );
};

export default BetConfigScreen;
