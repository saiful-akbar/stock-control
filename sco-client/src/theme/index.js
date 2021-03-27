import { createMuiTheme, colors } from '@material-ui/core';
import { darkShadows } from './shadows';

const themeLight = createMuiTheme({
  palette: {
    type: 'light',
    background: {
      default: colors.common.white,
      paper: colors.common.white,
      dark: '#F6F7F9',
      navBar: '#051e34',
      topBar: '#FFF'
    },
    primary: {
      main: '#2196f3'
    },
    secondary: {
      main: '#3ea575'
    },
    info: {
      main: '#2196F3'
    },
    error: {
      main: '#F44336'
    },
    success: {
      main: '#4CAF50'
    },
    warning: {
      main: '#FF9800'
    },
    text: {
      primary: colors.blueGrey[800],
      secondary: colors.blueGrey[600]
    }
  },
  shadows: darkShadows
});

const themeDark = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      default: '#222B36',
      paper: '#222B36',
      dark: '#171C24',
      navBar: '#222B36',
      topBar: '#1D2535'
    },
    primary: {
      main: '#688EFF'
    },
    secondary: {
      main: '#3ea575'
    },
    info: {
      main: '#2196F3'
    },
    error: {
      main: '#ef5350'
    },
    success: {
      main: '#4CAF50'
    },
    warning: {
      main: '#FF9800'
    },
    text: {
      primary: colors.grey[200],
      secondary: colors.grey[500]
    }
  }
});

export { themeLight, themeDark };
