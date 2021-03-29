import { createMuiTheme, colors } from '@material-ui/core';
import { darkShadows } from './shadows';

const themeLight = createMuiTheme({
  palette: {
    type: 'light',
    background: {
      default: colors.common.white,
      paper: colors.common.white,
      dark: '#F2F3F5',
      navBar: '#051e34',
      topBar: 'rgba(242, 243, 245, 0.7)'
    },
    primary: {
      main: '#1976D2'
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
      topBar: 'rgba(22, 28, 36, 0.7)',
      dark: '#171C24',
      default: '#222B36',
      navBar: '#222B36',
      paper: '#222B36'
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
