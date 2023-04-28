import React from 'react';
import {View, StyleSheet} from 'react-native';

export default function MinusIcon() {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: '100%',
    height: 2,
    backgroundColor: 'black',
  },
});
