import 'react-perfect-scrollbar/dist/css/styles.css';
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import { connect } from 'react-redux';

import { useCookies } from 'react-cookie';
import GlobalStyles from './components/GlobalStyles';
import routes from './routes';
import { themeLight, themeDark } from './theme';
import { reduxAction } from './config/redux/state';

import './assets/css/main.css';

const App = (props) => {
  const { reduxTheme, setReduxTheme } = props;
  const routing = useRoutes(routes);
  const [cookies, setCookie] = useCookies();

  React.useEffect(() => {
    const date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    if (cookies.theme === undefined) {
      setCookie('theme', 'light', {
        expires: date,
        path: '/'
      });
    }
    setReduxTheme(cookies.theme);
  }, [setReduxTheme, cookies.theme, setCookie]);

  return (
    <ThemeProvider theme={reduxTheme === 'dark' ? themeDark : themeLight}>
      <GlobalStyles />
      {routing}
    </ThemeProvider>
  );
};

const reduxState = (state) => ({
  reduxTheme: state.theme,
});

const reduxReducer = (reducer) => ({
  setReduxTheme: (value) => reducer({ type: reduxAction.theme, value }),
});

export default connect(reduxState, reduxReducer)(App);
