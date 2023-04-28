import React from 'react';
import TabScreenSafeAreaWrapper from '../../components/TabScreenSafeAreaWrapper';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Input} from '@rneui/themed';
import {useForm, Controller, useFieldArray} from 'react-hook-form';
import MinusIcon from '../../components/MinusIcon';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {setRewarderKeys, setUserId} from '../../store/features/appConfigSlice';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProp} from '../../RootNavigation';

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
        <Button
          onPress={handleSubmit(data => {
            dispatch(setUserId(data.username));
            dispatch(setRewarderKeys(data.rewarderKeys.map(key => key.value)));
            navigation.navigate('Main');
          })}>
          Save
        </Button>
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
