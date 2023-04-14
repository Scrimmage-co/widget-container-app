import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native';
import {colors, fonts, dimensions, multipliers} from '../Styles/base.js';

class RoundButton extends Component {
  render() {
    let diam = dimensions.fullWidth * multipliers.midSm;

    return (
      <View style={styles.container}>
        <TouchableHighlight
          style={{borderRadius: 120}}
          onPress={this.props.effect}>
          <View
            style={[
              styles.buttonContainer,
              {
                width: diam,
                height: diam,
                borderRadius: dimensions.fullWidth,
              },
            ]}>
            <Text style={styles.buttonText}>{this.props.text}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: colors.coinFill,
    borderWidth: 5,
    borderColor: colors.coinBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: fonts.md,
    flexWrap: 'wrap',
  },
});

RoundButton.defaultProps = {
  backgroundColor: colors.dark,
  text: 'Reset',
};

export default RoundButton;
