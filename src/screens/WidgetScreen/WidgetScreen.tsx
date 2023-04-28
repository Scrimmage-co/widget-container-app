import React from 'react';
import TabScreenSafeAreaWrapper from '../../components/TabScreenSafeAreaWrapper';
import WebView from 'react-native-webview';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';

const WidgetScreen = () => {
  const token = useSelector<RootState, string>(state => state.appConfig.token);

  return (
    <TabScreenSafeAreaWrapper edges={['left', 'right']}>
      <WebView
        source={{
          uri: `https://coinflip.apps.scrimmage.co/?token=${token}`,
        }}
        style={{
          backgroundColor: 'transparent',
          flex: 1,
        }}
      />
    </TabScreenSafeAreaWrapper>
  );
};

export default WidgetScreen;
