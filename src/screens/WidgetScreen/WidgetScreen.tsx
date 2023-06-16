import React from 'react';
import TabScreenSafeAreaWrapper from '../../components/TabScreenSafeAreaWrapper';
import WebView from 'react-native-webview';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import {Button, Text} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';

const WidgetScreen = () => {
  const token = useSelector<RootState, string>(state => state.appConfig.token);
  const showDebugActions = useSelector<RootState, boolean>(
    state => state.appConfig.showDebugActions,
  );
  const serverUrl = useSelector<RootState, string>(
    state => state.appConfig.serverUrl,
  );
  const webViewRef = React.useRef<WebView>(null);

  return (
    <TabScreenSafeAreaWrapper edges={['left', 'right', 'top']}>
      {showDebugActions ? (
        <View style={styles.actions}>
          <Button
            onPress={() => {
              webViewRef.current?.goBack();
            }}>
            Back
          </Button>
          <Button
            onPress={() => {
              webViewRef.current?.goForward();
            }}>
            Forward
          </Button>
          <Button
            onPress={() => {
              webViewRef.current?.reload();
            }}>
            Reload
          </Button>
        </View>
      ) : (
        <View style={styles.title}>
          <Text style={styles.titleLabel}>Rewards</Text>
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{
          uri: `${serverUrl}/?token=${token}`,
        }}
        style={{
          backgroundColor: 'transparent',
          flex: 1,
        }}
        cacheMode="LOAD_NO_CACHE"
      />
    </TabScreenSafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    height: 46,
    alignItems: 'center',
  },
  titleLabel: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default WidgetScreen;
