import 'react-perfect-scrollbar/dist/css/styles.css';

import React from 'react';
import GlobalStyles from './components/GlobalStyles';
import routes from './routes';
import Cookies from 'universal-cookie';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider, useMediaQuery } from '@material-ui/core';
import { connect } from 'react-redux';
import { themeLight, themeDark } from './theme';
import { reduxAction } from './config/redux/state';

/**
 * Komponen utama
 *
 * @param {*} props
 */
const App = props => {
  const routing = useRoutes(routes);
  const cookie = new Cookies();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const { reduxTheme, setReduxTheme } = props;

  React.useEffect(() => {
    const theme = cookie.get('theme');
    const body = document.querySelector('body');

    if (theme !== undefined) {
      switch (theme) {
        case 'dark':
          setReduxTheme('dark');
          body.classList.add('dark');
          break;

        case 'light':
          setReduxTheme('light');
          body.classList.remove('dark');
          break;

        default:
          setReduxTheme(prefersDarkMode ? 'dark' : 'light');
          prefersDarkMode
            ? body.classList.add('dark')
            : body.classList.remove('dark');
          break;
      }
    } else {
      setReduxTheme(prefersDarkMode ? 'dark' : 'light');
      prefersDarkMode
        ? body.classList.add('dark')
        : body.classList.remove('dark');
    }

    // eslint-disable-next-line
  }, [prefersDarkMode]);

  return (
    <ThemeProvider theme={reduxTheme === 'dark' ? themeDark : themeLight}>
      <GlobalStyles />
      {routing}
    </ThemeProvider>
  );
};

/**
 * Redux state
 *
 * @param {*} state
 */
const reduxState = state => ({
  reduxTheme: state.theme
});

// Redux reducer
const reduxReducer = dispatch => ({
  setReduxTheme: value => dispatch({ type: reduxAction.theme, value: value })
});

export default connect(reduxState, reduxReducer)(App);
