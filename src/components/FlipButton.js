import React, {Component} from 'react';
import {StyleSheet, Image, TouchableOpacity} from 'react-native';
import {dimensions} from '../Styles/base.js';

class FlipButton extends Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={this.props.effect}
        disabled={this.props.disabled}
        activeOpacity={this.props.activeOpacity}>
        <Image
          style={styles.buttonImage}
          source={this.props.imageSource}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {},
  buttonImage: {
    width: dimensions.fullWidth * 0.25 * 1.2,
    height: dimensions.fullWidth * 0.25 * 1.09,
  },
});

FlipButton.defaultProps = {
  backgroundColor: 'green',
  text: 'Flip',
};

export default FlipButton;
