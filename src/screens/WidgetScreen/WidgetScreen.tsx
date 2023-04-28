import React from 'react';
import TabScreenSafeAreaWrapper from '../../components/TabScreenSafeAreaWrapper';
import WebView from 'react-native-webview';

const TOKEN =
  'eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiVVNFUl9BQ0NFU1MiLCJpYXQiOjE2ODI2NzEyMDEsIm5iZiI6MTY4MjY3MTIwMSwiaXNzIjoibGYiLCJzdWIiOiIxIiwiZXhwIjoxNjgyNzU3NjAxLCJhdWQiOltdfQ.u6Cn6-agPY-dxezBFs4CIElKLGb6Q615rmtIfazTglPbRj4KiM-3GgFaN7L5Ou5G2OnE2J8tGTVssitJGDqioBY_DDeQaeFsUsI2yID4znLaAKimlWcs_IfyYrODCxEpeCpLTRieIj55aiX_DUSKD-jy7l9xT8qYYXwE5o8HMCBjORGHT68ECe28fe_mSqLWDY5sbC6hZYBmb2Jr-4g3asQH1kWLRcAtCQYTm-tpi-P0_oMyv5B738KjLgT3Xo0gr_lsOkpiJyCNy2-2vT8pL_g84ZvTdtxQ5wtjeFvMWpk-4hzY2FBm0r9DLYdh1gKZz4KZfan_jBqFsR9FeVs2wQ';

const WidgetScreen = () => {
  return (
    <TabScreenSafeAreaWrapper>
      <WebView
        source={{
          uri: `https://coinflip.apps.scrimmage.co/?token=${TOKEN}`,
        }}
      />
    </TabScreenSafeAreaWrapper>
  );
};

export default WidgetScreen;
