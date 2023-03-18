import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import MainScreen from './screens/MainScreen'
 
export default class App extends Component   {
  
  render() {
    return (
      <View style={styles.container}>
        <MainScreen />
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});