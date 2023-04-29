import React, {useMemo} from 'react';
import Toast, {
  ErrorToast,
  InfoToast,
  SuccessToast,
} from 'react-native-toast-message';
import {useTheme} from '@rneui/themed';
import {StyleSheet} from 'react-native';
import {WIDTH} from 'react-native-toast-message/lib/src/components/BaseToast.styles';

const ToastConfigurator = () => {
  const {theme} = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        background: {
          backgroundColor: theme.colors.grey5,
        },
        text1: {
          color: theme.colors.black,
        },
        text2: {
          color: theme.colors.grey1,
        },
      }),
    [theme],
  );

  return (
    <Toast
      config={{
        success: props => (
          <SuccessToast
            {...props}
            style={[
              styles.background,
              {borderLeftColor: theme.colors.success},
              {width: WIDTH},
            ]}
            text1Style={[styles.text1]}
            text2Style={[styles.text2]}
          />
        ),
        info: props => (
          <InfoToast
            {...props}
            style={[
              styles.background,
              {borderLeftColor: theme.colors.primary},
              {width: WIDTH},
            ]}
            text1Style={[styles.text1]}
            text2Style={[styles.text2]}
          />
        ),
        error: props => (
          <ErrorToast
            {...props}
            style={[
              styles.background,
              {borderLeftColor: theme.colors.error},
              {width: WIDTH},
            ]}
            text1Style={[styles.text1]}
            text2Style={[styles.text2]}
          />
        ),
      }}
    />
  );
};

export default ToastConfigurator;
