import 'react-perfect-scrollbar/dist/css/styles.css';

import React from 'react';
import GlobalStyles from './components/GlobalStyles';
import routes from './routes';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import { connect } from 'react-redux';
import { useCookies } from 'react-cookie';
import { themeLight, themeDark } from './theme';
import apiUrl from './utils/apiUrl';



/**
 * Komponen utama
 * 
 * @param {*} props 
 */
const App = (props) => {
  const routing = useRoutes(routes);
  const [cookies, setCookie] = useCookies();


  React.useEffect(() => {
    const date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    setCookie('theme', cookies.theme === 'dark' ? 'dark' : 'light', {
      expires: date,
      path: '/'

    });

    // eslint-disable-next-line
  }, []);


  React.useEffect(() => {
    const params = [
      { page: 1 },
      { search: "nama        " },
      { api_token: "token" },
    ];

    apiUrl("test/url", params);
  })


  return (
    <ThemeProvider theme={props.reduxTheme === 'dark' ? themeDark : themeLight}>
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


export default connect(reduxState, null)(App);
