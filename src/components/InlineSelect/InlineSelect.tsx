import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';

export interface InlineSelectItem {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface InlineSelectProps extends ViewProps {
  items: InlineSelectItem[];
  selected: string;
  onSelect: (value: string) => void;
  canUnselect?: boolean;
}

const InlineSelect = ({
  items,
  selected,
  onSelect,
  canUnselect = false,
  style,
  ...viewProps
}: InlineSelectProps) => {
  return (
    <View style={StyleSheet.flatten([styles.container, style])} {...viewProps}>
      {items.map(item => (
        <TouchableOpacity
          disabled={item.disabled}
          key={item.value}
          style={[styles.item, item.disabled && styles.itemDisabled]}
          onPress={() => {
            if (canUnselect) {
              onSelect(selected === item.value ? '' : item.value);
            } else {
              onSelect(item.value);
            }
          }}>
          <View>
            <Text>{item.label}</Text>
          </View>
          <View>{item.value === selected && <Text>✓</Text>}</View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  item: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemDisabled: {
    opacity: 0.5,
  },
});

export default InlineSelect;
