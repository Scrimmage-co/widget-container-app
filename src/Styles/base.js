import {Dimensions} from 'react-native';

export const dimensions = {
  fullHeight: Dimensions.get('window').height,
  fullWidth: Dimensions.get('window').width,
};

export let colors = {
  bg: '#D9E4E2',
  blob: '#52AE9E',
  coinFill: '#E6AA3D',
  coinBorder: '#4F1433',
  light: '#58B1A2',
  dark: '#5B8F86',
};

export const padding = {
  sm: 10,
  md: 15,
  lg: 24,
  xl: 40,
};

export const fonts = {
  sm: 14,
  md: 16,
  lg: 20,
  primary: 'Cochin',
};

export const multipliers = {
  midSm: 0.25,
};

const original = {
  bg: '#D9E4E2',
  blob: '#52AE9E',
  coinFill: '#E6AA3D',
  coinBorder: '#4F1433',
  light: '#58B1A2',
  dark: '#5B8F86',
};
const blue = {
  bg: '#B9D6F2',
  blob: '#003559',
  coinFill: '#E6AA3D',
  coinBorder: '#4F1433',
  light: '#006DAA',
  dark: '#0353A4',
};
