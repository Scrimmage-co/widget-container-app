import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Badge} from '@rneui/base';

export interface BadgeCloudProps {
  items: string[];
  selected: string;
  onSelect: (value: string) => void;
  canUnselect?: boolean;
}

const BadgeCloud = ({
  items,
  selected,
  onSelect,
  canUnselect,
}: BadgeCloudProps) => {
  return (
    <View style={styles.container}>
      {items.map(item => (
        <Badge
          key={item}
          value={item}
          status={item === selected ? 'primary' : 'success'}
          onPress={() => {
            if (canUnselect) {
              onSelect(selected === item ? '' : item);
            } else {
              onSelect(item);
            }
          }}
          badgeStyle={styles.badge}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    margin: 4,
    paddingHorizontal: 8,
  },
});

export default BadgeCloud;
