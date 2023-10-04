import React, {useState} from 'react';
import TabScreenSafeAreaWrapper from '../../components/TabScreenSafeAreaWrapper';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import {Button, Text, Input} from '@rneui/themed';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import Scrimmage from '@scrimmage/rewards';
import Toast from 'react-native-toast-message';
import InlineSelect from '../../components/InlineSelect';

interface BaseCustomProperty {
  id: number;
  name: string;
}

interface CustomPropertyString extends BaseCustomProperty {
  type: 'string';
  value: string;
}

interface CustomPropertyNumber extends BaseCustomProperty {
  type: 'number';
  value: number;
}

interface CustomPropertyBoolean extends BaseCustomProperty {
  type: 'boolean';
  value: boolean;
}

type CustomProperty =
  | CustomPropertyString
  | CustomPropertyNumber
  | CustomPropertyBoolean;

interface FormValues {
  rewardableType: string;
  customProperties: CustomProperty[];
}

const CustomRewardableScreen = () => {
  const userId = useSelector<RootState, string>(
    state => state.appConfig.userId,
  );
  const [lastSubmitted, setLastSubmitted] = useState<string>(null);
  const {control, handleSubmit, formState, watch, setValue} =
    useForm<FormValues>({
      defaultValues: {
        rewardableType: 'referral',
        customProperties: [
          {
            id: 1,
            type: 'number',
            name: 'amount',
            value: 1000,
          },
        ],
      },
    });

  const customProperties = watch('customProperties');

  const {fields, append, remove} = useFieldArray<FormValues>({
    control,
    name: 'customProperties',
    keyName: 'id',
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const eventId = `coinflip_${(Math.random() * 10000000000000).toString()}`;
      const rewardable: any = {};
      data.customProperties.forEach(customProperty => {
        rewardable[customProperty.name] = customProperty.value;
      });
      await Scrimmage.reward.trackRewardableOnce<any>(
        userId,
        data.rewardableType,
        eventId,
        rewardable,
      );
      setLastSubmitted(
        `
        userId: ${userId}
        rewardableType: ${data.rewardableType}
        eventId: ${eventId}
        rewardable: ${JSON.stringify(rewardable)}
        `.replace(/\s+/g, ' '),
      );
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
          name="rewardableType"
          control={control}
          rules={{required: true}}
          render={({field: {onChange, value}, formState: {errors}}) => (
            <View>
              <Text h4 style={errors.rewardableType && styles.errorText}>
                Data Type
              </Text>
              <Input
                placeholder="Data Type"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.rewardableType?.message}
                renderErrorMessage={Boolean(errors.rewardableType)}
              />
            </View>
          )}
        />
        {fields.map((field, index) => (
          <View key={field.id}>
            <Text>Custom Property #{index + 1}</Text>
            <Controller
              name={`customProperties.${index}.name` as const}
              control={control}
              rules={{required: true}}
              render={({field: {onChange, value}, fieldState}) => (
                <View>
                  <Text h4 style={fieldState.error && styles.errorText}>
                    Name:
                  </Text>
                  <Input
                    placeholder="Name"
                    onChangeText={onChange}
                    value={value}
                    errorMessage={fieldState.error?.message}
                    renderErrorMessage={Boolean(fieldState.error)}
                  />
                </View>
              )}
            />
            <Controller
              control={control}
              name={`customProperties.${index}.type` as const}
              render={({field: {onChange, value}, fieldState}) => (
                <View>
                  <Text h4 style={fieldState.error && styles.errorText}>
                    Type:
                  </Text>
                  <InlineSelect
                    items={[
                      {
                        label: 'String',
                        value: 'string',
                      },
                      {
                        label: 'Number',
                        value: 'number',
                      },
                      {
                        label: 'Boolean',
                        value: 'boolean',
                      },
                    ]}
                    selected={value}
                    onSelect={newValue => {
                      onChange(newValue);
                      setValue(
                        `customProperties.${index}.value`,
                        {
                          string: '',
                          number: 0,
                          boolean: false,
                        }[newValue],
                      );
                    }}
                    canUnselect={false}
                  />
                </View>
              )}
            />
            <Controller
              name={`customProperties.${index}.value` as const}
              control={control}
              rules={{required: true}}
              render={({field: {onChange, value}, fieldState}) => {
                if (customProperties[index].type === 'string') {
                  return (
                    <View>
                      <Text h4 style={fieldState.error && styles.errorText}>
                        Value:
                      </Text>
                      <Input
                        placeholder="Value"
                        onChangeText={onChange}
                        value={value as string}
                        errorMessage={fieldState.error?.message}
                        renderErrorMessage={Boolean(fieldState.error)}
                      />
                    </View>
                  );
                }
                if (customProperties[index].type === 'boolean') {
                  return (
                    <View>
                      <Text h4 style={fieldState.error && styles.errorText}>
                        Value:
                      </Text>
                      <InlineSelect
                        items={[
                          {
                            label: 'True',
                            value: 'true',
                          },
                          {
                            label: 'False',
                            value: 'false',
                          },
                        ]}
                        selected={value ? 'true' : 'false'}
                        onSelect={_value => onChange(_value === 'true')}
                        canUnselect={false}
                      />
                    </View>
                  );
                }
                return (
                  <View>
                    <Text h4 style={fieldState.error && styles.errorText}>
                      Value:
                    </Text>
                    <Input
                      placeholder="Value"
                      keyboardType="numeric"
                      onChangeText={valueText =>
                        onChange(parseFloat(valueText))
                      }
                      value={value.toString()}
                      errorMessage={fieldState.error?.message}
                      renderErrorMessage={Boolean(fieldState.error)}
                    />
                  </View>
                );
              }}
            />
            <Button
              title={`Remove #${index + 1}`}
              onPress={() => remove(index)}
              color="warning"
            />
          </View>
        ))}
        <Button
          title="Add Custom Property"
          onPress={() => {
            append({
              id: Date.now(),
              name: '',
              type: 'number',
              value: 0,
            });
          }}
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
