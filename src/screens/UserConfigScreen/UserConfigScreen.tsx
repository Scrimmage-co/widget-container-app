import React from 'react';
import TabScreenSafeAreaWrapper from '../../components/TabScreenSafeAreaWrapper';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Input, Switch, Text} from '@rneui/themed';
import {useForm, Controller} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {
  setNamespace,
  setRewarderKey,
  setServerUrl,
  setToken,
  setUserId,
  setUserTags,
  showDebugActions,
} from '../../store/features/appConfigSlice';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProp} from '../../RootNavigation';
import Clipboard from '@react-native-clipboard/clipboard';
import Scrimmage from '@scrimmage/rewards';

interface FormValues {
  username: string;
  serverUrl: string;
  namespace: string;
  rewarderKey: string;
  userTags: string;
}

const UserConfigScreen = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const dispatch = useDispatch();
  const appConfig = useSelector<RootState, RootState['appConfig']>(
    state => state.appConfig,
  );
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const {control, handleSubmit, reset} = useForm<FormValues, any>({
    defaultValues: {
      username: appConfig.userId || '',
      rewarderKey:
        appConfig.privateKey ||
        'AYeqBMEEeewDZM1rng_nIwXyKRJT0xjmuSNzFAxK2loAy9FLZoqSMzQJEjDdLbw-Px7fKudU',
      serverUrl: appConfig.serverUrl || 'https://coinflip.apps.scrimmage.co',
      namespace: appConfig.namespace || 'production',
      userTags: appConfig?.userTags?.join(',') || '',
    },
  });

  const submit = async (data: FormValues) => {
    dispatch(setUserId(data.username));
    dispatch(setRewarderKey(data.rewarderKey));
    dispatch(setServerUrl(data.serverUrl));
    dispatch(setNamespace(data.namespace));
    dispatch(setUserTags(data.userTags.split(',')));
    setTimeout(async () => {
      const token = await Scrimmage.user.getUserToken(data.username);
      dispatch(setToken(token));
      navigation.navigate('Main');
    }, 1000);
  };

  const refresh = async () => {
    const token = await Scrimmage.user.getUserToken(appConfig.userId);
    dispatch(setToken(token));
  };

  return (
    <TabScreenSafeAreaWrapper edges={['left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="never">
        <Controller
          rules={{
            required: true,
            minLength: 1,
          }}
          render={({field, formState}) => (
            <Input
              label="Please, enter your username"
              placeholder="Username"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={field.onChange}
              value={field.value}
              errorMessage={
                formState.errors.username ? 'Username is required' : ''
              }
              onBlur={field.onBlur}
            />
          )}
          name={'username'}
          control={control}
        />
        <Button onPress={() => setShowAdvanced(!showAdvanced)} type="clear">
          {showAdvanced ? 'Hide' : 'Show'} advanced (dev only)
        </Button>
        {showAdvanced && (
          <View>
            <Controller
              name="serverUrl"
              rules={{
                required: true,
                minLength: 1,
              }}
              render={({field, formState}) => (
                <Input
                  label="Server URL"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={field.onChange}
                  value={field.value}
                  errorMessage={
                    formState.errors.serverUrl ? 'Server URL is required' : ''
                  }
                  onBlur={field.onBlur}
                />
              )}
              control={control}
            />
            <Controller
              name="namespace"
              rules={{
                required: true,
                minLength: 1,
              }}
              render={({field, formState}) => (
                <Input
                  label="Namespace"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={field.onChange}
                  value={field.value}
                  errorMessage={
                    formState.errors.serverUrl ? 'Namespace is required' : ''
                  }
                  onBlur={field.onBlur}
                />
              )}
              control={control}
            />
            <Controller
              name="rewarderKey"
              control={control}
              rules={{
                required: true,
                minLength: 1,
              }}
              render={({field: renderField}) => (
                <Input
                  label="Rewarder key"
                  onChangeText={value => renderField.onChange(value)}
                  value={renderField.value}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onBlur={renderField.onBlur}
                />
              )}
            />
            <Controller
              name="userTags"
              control={control}
              rules={{
                required: false,
              }}
              render={({field: renderField}) => (
                <Input
                  label="User tags (comma separated)"
                  onChangeText={value => renderField.onChange(value)}
                  value={renderField.value}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onBlur={renderField.onBlur}
                />
              )}
            />
          </View>
        )}
        <Button onPress={handleSubmit(data => submit(data))}>Save</Button>
        <Button onPress={() => reset()} type="outline">
          Reset
        </Button>
        {Boolean(appConfig.token) && (
          <View>
            <View style={{height: 20}} />
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(appConfig.token);
              }}>
              <Input
                label="User token"
                value={appConfig.token || ''}
                style={{fontSize: 12, fontVariant: ['tabular-nums']}}
                multiline={true}
              />
            </TouchableOpacity>
            <View style={{height: 20}} />
            <Text
              style={{
                textAlign: 'center',
                marginVertical: 10,
              }}>
              If something goes wrong, touch the next button and try again
            </Text>
            <Button onPress={refresh} type="outline">
              Refresh token
            </Button>
          </View>
        )}
        <View style={{height: 20}} />
        <View>
          <Text>Debug actions shown:</Text>
          <Switch
            value={appConfig.showDebugActions}
            onValueChange={value => {
              dispatch(showDebugActions(value));
            }}
          />
        </View>
        <View style={{height: 400}} />
      </ScrollView>
    </TabScreenSafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
});

export default UserConfigScreen;
