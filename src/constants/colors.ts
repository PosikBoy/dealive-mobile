export const palette = {
  purple: '#9747FF',
  purpleHover: '#872CFE',
  purpleLight: '#FAE3FF',
  purpleLightHover: '#F7E8FF',

  red: '#EE2400',
  redHover: '#FF0000',
  redLight: '#D95A5A',

  green: '#D0FF84',
  greenDark: 'rgb(0, 112, 24)',

  gray: '#808080',
  grayLight: '#D9D9D9',
  grayInput: '#999999',

  black: '#000000',
  white: '#ffffff',
  whiteDark: 'rgb(48, 46, 46)',

  overlay: 'rgba(0, 0, 0, 0.05)',
};

const lightTheme = {
  primary: palette.purple,
  primaryHover: palette.purpleHover,
  primaryLight: palette.purpleLight,
  primaryLightHover: palette.purpleLightHover,

  success: palette.green,
  error: palette.red,
  errorHover: palette.redHover,
  errorLight: palette.redLight,

  background: palette.white,
  backgroundSecondary: palette.overlay,
  surface: palette.white,

  text: palette.black,
  textSecondary: palette.gray,
  textOnPrimary: palette.white,

  border: palette.grayLight,
  borderLight: palette.grayLight,

  input: palette.white,
  inputBorder: palette.grayLight,
  inputPlaceholder: palette.grayInput,

  statusBar: palette.white,

  tint: palette.black,
};

const darkTheme = {
  primary: palette.purple,
  primaryHover: palette.purpleHover,
  primaryLight: palette.purpleHover,
  primaryLightHover: palette.purpleHover,

  success: palette.greenDark,
  error: palette.red,
  errorHover: palette.redHover,
  errorLight: palette.redLight,

  background: palette.whiteDark,
  backgroundSecondary: palette.overlay,
  surface: palette.whiteDark,

  text: palette.white,
  textSecondary: palette.gray,
  textOnPrimary: palette.white,

  border: palette.gray,
  borderLight: palette.gray,

  input: palette.whiteDark,
  inputBorder: palette.gray,
  inputPlaceholder: palette.grayInput,

  statusBar: palette.whiteDark,

  tint: palette.white,
};

export const colors = {
  black: palette.black,
  white: palette.white,
  purple: palette.purple,
  lightPurple: palette.purpleLight,
  hoverLightPurple: palette.purpleLightHover,
  gray: palette.gray,
  inputGray: palette.grayInput,
  lightGray: palette.grayLight,
  red: palette.red,
  hoverPurple: palette.purpleHover,
  hoverRed: palette.redHover,
  green: palette.green,
  lightRed: palette.redLight,
  backgroundColor: palette.overlay,

  light: lightTheme,
  dark: darkTheme,

  palette,
};

export type ThemeColors = typeof lightTheme;
export type Palette = typeof palette;
