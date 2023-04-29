import React from 'react';
import TabScreenSafeAreaWrapper from '../../components/TabScreenSafeAreaWrapper';
import WebView from 'react-native-webview';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';

const WidgetScreen = () => {
  const token = useSelector<RootState, string>(state => state.appConfig.token);
  const serverUrl = useSelector<RootState, string>(
    state => state.appConfig.serverUrl,
  );

  return (
    <TabScreenSafeAreaWrapper edges={['left', 'right']}>
      <WebView
        source={{
          uri: `${serverUrl}/?token=${token}`,
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
