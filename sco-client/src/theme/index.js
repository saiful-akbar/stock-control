import {
  createMuiTheme,
  colors
} from '@material-ui/core';
import {
  darkShadows
} from './shadows';

const themeLight = createMuiTheme({
  palette: {
    type: 'light',
    background: {
      default: colors.common.white,
      paper: colors.common.white,
      topBar: '#3D4977',
      dark: '#F4F5FD',
    },
    primary: {
      light: '#759bff',
      main: '#5383FF',
      dark: '#3a5bb2',
    },
    secondary: {
      light: '#636d92',
      main: '#3D4977',
      dark: '#2a3353',
    },
    error: {
      light: '#db5858',
      main: '#d32f2f',
      dark: '#932020',
    },
    success: {
      light: '#5fa463',
      main: '#388e3c',
      dark: '#27632a',
    },
    warning: {
      light: '#ffb333',
      main: '#ffa000',
      dark: '#b27000',
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
      default: '#131C21',
      paper: '#1e2428',
      topBar: '#2A2F32',
      dark: '#0D1418',
    },
    primary: {
      light: '#33abb8',
      main: '#0097a7',
      dark: '#006974',
    },
    secondary: {
      light: '#33877c',
      main: '#00695c',
      dark: '#004940',
    },
    error: {
      light: '#db5858',
      main: '#d32f2f',
      dark: '#932020',
    },
    success: {
      light: '#5fa463',
      main: '#388e3c',
      dark: '#27632a',
    },
    warning: {
      light: '#ffb333',
      main: '#ffa000',
      dark: '#b27000',
    },
  }
});

export {
  themeLight,
  themeDark
};
