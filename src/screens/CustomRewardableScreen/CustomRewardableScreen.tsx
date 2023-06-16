import React, {useState} from 'react';
import TabScreenSafeAreaWrapper from '../../components/TabScreenSafeAreaWrapper';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import InlineSelect from '../../components/InlineSelect';
import {Button, Text, Input} from '@rneui/themed';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import Scrimmage from '@scrimmage/rewards';
import {RewarderKey} from '../../store/features/appConfigSlice';
import Toast from 'react-native-toast-message';

interface FormValues {
  integration: string;
  rewardableType: string;
  customPropertyName: string;
  customPropertyValue: number;
}

const CustomRewardableScreen = () => {
  const privateAliases = useSelector<RootState, RewarderKey[]>(
    state => state.appConfig.privateKeys,
  )?.map(key => key.name);
  const userId = useSelector<RootState, string>(
    state => state.appConfig.userId,
  );
  const [lastSubmitted, setLastSubmitted] = useState<string>(null);
  const {control, handleSubmit, formState} = useForm<FormValues>({
    defaultValues: {
      integration: privateAliases[0],
      rewardableType: 'referral',
      customPropertyName: 'amount',
      customPropertyValue: 1000,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const rewardable = {
        id: `coinflip_${(Math.random() * 1000000000000000000).toString()}`,
        userId: userId,
        type: data.rewardableType,
        [data.customPropertyName]: data.customPropertyValue,
      };
      await Scrimmage.reward.trackRewardable(data.integration, rewardable);
      setLastSubmitted(JSON.stringify(rewardable, null, 2));
      Toast.show({
        text1: 'Rewardable tracked!',
        text2: 'Your rewardable has been tracked successfully.',
      });
    } catch (e) {
      Toast.show({
        text1: 'Error',
        text2: (e as any)?.message,
      });
    }
  };

  return (
    <TabScreenSafeAreaWrapper edges={['left', 'right']}>
      <ScrollView>
        <Controller
          name="integration"
          control={control}
          rules={{required: true}}
          render={({field: {onChange, value}, formState: {errors}}) => (
            <View>
              <Text h4 style={errors.integration && styles.errorText}>
                Integration
              </Text>
              <InlineSelect
                selected={value}
                onSelect={onChange}
                items={privateAliases.map(alias => ({
                  label: alias,
                  value: alias,
                }))}
              />
            </View>
          )}
        />
        <Controller
          name="rewardableType"
          control={control}
          rules={{required: true}}
          render={({field: {onChange, value}, formState: {errors}}) => (
            <View>
              <Text h4 style={errors.rewardableType && styles.errorText}>
                Rewardable Type
              </Text>
              <Input
                placeholder="Rewardable Type"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.rewardableType?.message}
                renderErrorMessage={Boolean(errors.rewardableType)}
              />
            </View>
          )}
        />
        <Controller
          name="customPropertyName"
          control={control}
          rules={{required: true}}
          render={({field: {onChange, value}, formState: {errors}}) => (
            <View>
              <Text h4 style={errors.customPropertyName && styles.errorText}>
                Custom Property Name
              </Text>
              <Input
                placeholder="Custom Property Name"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.customPropertyName?.message}
                renderErrorMessage={Boolean(errors.customPropertyName)}
              />
            </View>
          )}
        />
        <Controller
          name="customPropertyValue"
          control={control}
          rules={{required: true}}
          render={({field: {onChange, value}, formState: {errors}}) => (
            <View>
              <Text h4 style={errors.customPropertyValue && styles.errorText}>
                Custom Property Value
              </Text>
              <Input
                placeholder="Custom Property Value"
                keyboardType="numeric"
                onChangeText={valueText => onChange(parseFloat(valueText))}
                value={value.toString()}
                errorMessage={errors.customPropertyValue?.message}
                renderErrorMessage={Boolean(errors.customPropertyValue)}
              />
            </View>
          )}
        />
        {Object.keys(formState.errors).length > 0 && (
          <Text style={styles.errorText}>Please fill out all fields</Text>
        )}
        <Button title="Submit" onPress={handleSubmit(onSubmit)} />
        {lastSubmitted && (
          <View>
            <Text h4>Last Submitted</Text>
            <Text>{lastSubmitted}</Text>
          </View>
        )}
      </ScrollView>
    </TabScreenSafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  teams: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  team: {
    flex: 1,
  },
  errorText: {
    color: 'red',
  },
});

export default CustomRewardableScreen;
