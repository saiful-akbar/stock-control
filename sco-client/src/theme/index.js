import { createMuiTheme, colors } from '@material-ui/core';
import { darkShadows } from './shadows';

const themeLight = createMuiTheme({
  palette: {
    type: 'light',
    background: {
      default: colors.common.white,
      paper: colors.common.white,
      topBar: '#3E446B',
      dark: '#F4F5FD'
    },
    primary: {
      main: '#5383FF'
    },
    secondary: {
      main: '#3E446B'
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
      primary: colors.blueGrey[900],
      secondary: colors.blueGrey[600]
    }
  },
  shadows: darkShadows
});

const themeDark = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      default: '#1C2025',
      paper: '#282C34',
      topBar: '#282C34',
      dark: '#1C2025'
    },
    primary: {
      main: '#8A85FF'
    },
    secondary: {
      main: '#f50057'
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
      primary: colors.grey[200],
      secondary: colors.grey[500]
    }
  }
});

export { themeLight, themeDark };
