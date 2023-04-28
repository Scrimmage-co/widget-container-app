import React from 'react';
import TabScreenSafeAreaWrapper from '../../components/TabScreenSafeAreaWrapper';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Input} from '@rneui/themed';
import {useForm, Controller, useFieldArray} from 'react-hook-form';
import MinusIcon from '../../components/MinusIcon';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {
  setRewarderKeys,
  setToken,
  setUserId,
} from '../../store/features/appConfigSlice';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProp} from '../../RootNavigation';
import Api from '../../api';
import Clipboard from '@react-native-clipboard/clipboard';

interface FormValues {
  username: string;
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
  const {control, handleSubmit} = useForm<FormValues, any>({
    defaultValues: {
      username: appConfig.userId || '',
      rewarderKeys:
        appConfig.rewarderKeys.length > 0
          ? appConfig.rewarderKeys.map((key, index) => ({
              id: index,
              value: key,
            }))
          : [
              {
                id: 0,
                value: '',
              },
            ],
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
      .map(key => key.value)
      .filter(key => key.length > 0);
    dispatch(setRewarderKeys(keys));
    const result = await Api.auth.createUserToken(data.username, keys);
    dispatch(setToken(result.token));
    navigation.navigate('Main');
  };

  const refresh = async () => {
    const result = await Api.auth.createUserToken(
      appConfig.userId,
      appConfig.rewarderKeys,
    );
    dispatch(setToken(result.token));
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
        {fields.map((field, index) => (
          <Controller
            key={field.id}
            control={control}
            render={({field: renderField}) => {
              const canRenderMinusIcon =
                fields.length > 1 &&
                (renderField.value !== '' || fields.length - 1 !== index);
              return (
                <View>
                  <Input
                    label={`Rewarder key #${index + 1}`}
                    onChangeText={value => {
                      renderField.onChange(value);
                      if (index === fields.length - 1) {
                        append({id: index + 1, value: ''});
                      }
                    }}
                    value={renderField.value}
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
            <Button onPress={refresh}>Refresh token</Button>
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
