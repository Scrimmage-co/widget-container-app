import React from 'react';
import TabScreenSafeAreaWrapper from '../../components/TabScreenSafeAreaWrapper';
import WebView from 'react-native-webview';

const WidgetScreen = () => {
  return (
    <TabScreenSafeAreaWrapper>
      <WebView source={{uri: 'https://rewards.scrimmage.co'}} />
    </TabScreenSafeAreaWrapper>
  );
};

export default WidgetScreen;
