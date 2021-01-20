import {
  createMuiTheme,
  colors
} from '@material-ui/core';
import {
  darkShadows,
  lightShadows,
} from './shadows';

const themeLight = createMuiTheme({
  palette: {
    type: 'light',
    background: {
      default: colors.common.white,
      paper: colors.common.white,
      topBar: '#3E446B',
      dark: '#F4F5FD',
    },
    primary: {
      main: '#5383FF',
    },
    secondary: {
      main: '#3E446B',
    },
    info: {
      main: '#2196F3'
    },
    error: {
      main: '#F44336',
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#FF9800',
    },
    text: {
      primary: colors.blueGrey[900],
      secondary: colors.blueGrey[600]
    },
  },
  shadows: darkShadows
});


const themeDark = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      default: '#262D31',
      paper: '#131C21',
      topBar: '#2A2F32',
      dark: '#0D1418',
    },
    primary: {
      main: '#0097a7',
    },
    secondary: {
      main: '#00695c',
    },
    info: {
      main: '#2196F3'
    },
    error: {
      main: '#F44336',
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#FF9800',
    },
    text: {
      primary: colors.grey[200],
      secondary: colors.grey[500]
    },
  },
  shadows: lightShadows
});

export {
  themeLight,
  themeDark
};
