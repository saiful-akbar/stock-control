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
const App = (props) => {
  const routing = useRoutes(routes);
  const cookie = new Cookies();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const { reduxTheme, setReduxTheme } = props;


  React.useEffect(() => {
    const theme = cookie.get('theme');
    if (Boolean(theme)) {
      if (theme !== 'dark' && theme !== 'light') {
        setReduxTheme(prefersDarkMode ? 'dark' : 'light');
      }
    } else {
      setReduxTheme(prefersDarkMode ? 'dark' : 'light');
    }

    if (theme === 'dark') {
      document.querySelector("body").classList.add("bg-dark");
    } else {
      if (theme !== 'light' && prefersDarkMode) {
        document.querySelector("body").classList.add("bg-dark");
      } else {
        document.querySelector("body").classList.remove("bg-dark");
      }
    }

    // eslint-disable-next-line
  }, [prefersDarkMode])


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
const reduxState = (state) => ({
  reduxTheme: state.theme,
});


// Redux reducer
const reduxReducer = (dispatch) => ({
  setReduxTheme: (value) => dispatch({ type: reduxAction.theme, value: value }),
})


export default connect(reduxState, reduxReducer)(App);
