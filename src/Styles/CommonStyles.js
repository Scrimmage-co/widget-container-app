import {StyleSheet} from 'react-native';
import {colors, fonts, dimensions, multipliers} from './base.js';

let flipPicSize = 0.7;
let coinImageSize = 0.5;

export default StyleSheet.create({
  // MainScreen.js
  mainContainer: {
    flex: 1,
    width: dimensions.fullWidth,
    height: dimensions.fullHeight,
    paddingTop: 24,
    //paddingBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },
  flipPic: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
    paddingTop: dimensions.fullWidth * 0.05,
    width: dimensions.fullWidth * flipPicSize,
    height: dimensions.fullWidth * flipPicSize,
    borderRadius: dimensions.fullWidth * flipPicSize * 2,
    backgroundColor: colors.blob,
  },
  coinImage: {
    height: dimensions.fullWidth * coinImageSize,
    width: dimensions.fullWidth * coinImageSize,
  },
  flipPicTextBox: {
    height: dimensions.fullWidth * 0.15,
    justifyContent: 'center',
  },
  midContainer: {
    flex: 1,
    marginTop: 12,
    marginBottom: 15,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  miniStats: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: colors.light,
    flex: 0.6,
    height: dimensions.fullWidth * multipliers.midSm,
    borderTopRightRadius: dimensions.fullWidth,
    borderBottomRightRadius: dimensions.fullWidth,
  },
  miniStatsText: {
    color: 'white',
    fontSize: fonts.sm,
  },
  midButton: {
    flex: 0.4,
    alignItems: 'center',
  },
});
