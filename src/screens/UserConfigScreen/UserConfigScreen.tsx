import React from 'react';
import TabScreenSafeAreaWrapper from '../../components/TabScreenSafeAreaWrapper';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Input, Text} from '@rneui/themed';
import {useForm, Controller, useFieldArray} from 'react-hook-form';
import MinusIcon from '../../components/MinusIcon';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {
  setRewarderKeys,
  setServerUrl,
  setToken,
  setUserId,
} from '../../store/features/appConfigSlice';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProp} from '../../RootNavigation';
import Clipboard from '@react-native-clipboard/clipboard';
import Scrimmage from 'scrimmage-rewards';

interface FormValues {
  username: string;
  serverUrl: string;
  rewarderKeys: {
    id: number;
    value: string;
  }[];
}

const UserConfigScreen = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const dispatch = useDispatch();
  const appConfig = useSelector<RootState, RootState['appConfig']>(
    state => state.appConfig,
  );
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const {control, handleSubmit} = useForm<FormValues, any>({
    defaultValues: {
      username: appConfig.userId || '',
      rewarderKeys:
        appConfig.privateKeys.length > 0
          ? [
              ...appConfig.privateKeys.map((key, index) => ({
                id: index,
                value: JSON.stringify({
                  name: key.name || '',
                  key: key.key,
                }),
              })),
            ]
          : [
              {
                id: 0,
                value: JSON.stringify({
                  name: 'coinflip',
                  key: 'AYeqBMEEeewDZM1rng_nIwXyKRJT0xjmuSNzFAxK2loAy9FLZoqSMzQJEjDdLbw-Px7fKudU',
                }),
              },
            ],
      serverUrl: appConfig.serverUrl || 'https://coinflip.apps.scrimmage.co',
    },
  });
  const {fields, append, remove} = useFieldArray({
    control: control,
    name: 'rewarderKeys',
    keyName: 'id',
  });

  const submit = async (data: FormValues) => {
    dispatch(setUserId(data.username));
    const keys = data.rewarderKeys
      .map(rewarderKey => {
        const rewarderValue = JSON.parse(rewarderKey.value);
        return {key: rewarderValue.key, name: rewarderValue.name};
      })
      .filter(key => key.key?.length > 0);
    console.log('submit', keys, data);
    dispatch(setRewarderKeys(keys));
    dispatch(setServerUrl(data.serverUrl));
    const aliases = keys.map(key => key.name);
    setTimeout(async () => {
      const token = await Scrimmage.user.getUserToken(data.username, aliases);
      dispatch(setToken(token));
      navigation.navigate('Main');
    }, 1000);
  };

  const refresh = async () => {
    const aliases = appConfig.privateKeys.map(key => key.name);
    const token = await Scrimmage.user.getUserToken(appConfig.userId, aliases);
    dispatch(setToken(token));
  };

  return (
    <TabScreenSafeAreaWrapper edges={['left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
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
                  placeholder="Server URL"
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
            {fields.map((field, index) => (
              <Controller
                key={field.id}
                control={control}
                render={({field: renderField}) => {
                  const canRenderMinusIcon =
                    fields.length > 1 &&
                    (renderField.value !== '' || fields.length - 1 !== index);
                  const {key, name} = JSON.parse(renderField.value);
                  return (
                    <View>
                      <Input
                        label={`Rewarder name #${index + 1}`}
                        onChangeText={value => {
                          renderField.onChange(
                            JSON.stringify({
                              name: value,
                              key,
                            }),
                          );
                        }}
                        value={name}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <Input
                        label={`Rewarder key #${index + 1}`}
                        onChangeText={value => {
                          renderField.onChange(
                            JSON.stringify({name, key: value}),
                          );
                        }}
                        value={key}
                        autoCapitalize="none"
                        autoCorrect={false}
                        rightIcon={
                          canRenderMinusIcon && (
                            <TouchableOpacity onPress={() => remove(index)}>
                              <MinusIcon />
                            </TouchableOpacity>
                          )
                        }
                      />
                    </View>
                  );
                }}
                name={`rewarderKeys.${index}.value`}
              />
            ))}
          </View>
        )}
        <Button onPress={handleSubmit(data => submit(data))}>Save</Button>
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
      </ScrollView>
    </TabScreenSafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
});

export default UserConfigScreen;
