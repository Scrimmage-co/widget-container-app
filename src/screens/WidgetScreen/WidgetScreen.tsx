import React from 'react';
import TabScreenSafeAreaWrapper from '../../components/TabScreenSafeAreaWrapper';
import WebView from 'react-native-webview';

const WidgetScreen = () => {
  return (
    <TabScreenSafeAreaWrapper>
      <WebView
        source={{
          uri: 'https://coinflip.apps.scrimmage.co/widget/?token=eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiVVNFUl9BQ0NFU1MiLCJpYXQiOjE2ODI2MTY0NjEsIm5iZiI6MTY4MjYxNjQ2MSwiaXNzIjoibGYiLCJzdWIiOiIxIiwiZXhwIjoxNjgyNzAyODYxLCJhdWQiOltdfQ.cGPKMglIITJhMtE4wrrxuPkLxkxbqKC82MRB7gjj-VMy_sluFmXJl8fRo-GeKr2t3CyA0qz_RzZ7sKshrtT5azOFq7MXrvISNJz6HSzywpMCHPz8KwC1385Lhg3_DRVzJ95uFycL2ZVq6xd7ODYJYh6AJAsXTenDfx087f6nJ6LB9ifgCBmbbKMb2oydqRx5dTH01YnzkVUaJ5WWvc_JRCTJESi9En7yVHKfqXxssvkrA4ZRKjzlRNd7szQpqGYPu8O_ITgZodzA7YLUwSznZGdFQWRgsQDGtMtWduW2nW6XDYTMGJ-IcAmOsqbFHrJHBROcIzL18-auDkmp-i04Ew',
        }}
      />
    </TabScreenSafeAreaWrapper>
  );
};

export default WidgetScreen;
