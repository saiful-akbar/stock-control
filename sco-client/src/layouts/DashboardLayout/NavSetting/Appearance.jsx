import React from 'react';
import { connect } from 'react-redux';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Cookies from 'universal-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, useMediaQuery } from '@material-ui/core';

// Style
const useStyles = makeStyles(theme => ({
  toggleGroup: {
    width: '100%',
    marginTop: theme.spacing(1)
  },
  toggleTheme: {
    width: 'calc(100% / 3)'
  },
  title: {
    fontWeight: 500
  }
}));

const Appearance = ({ setReduxTheme, reduxTheme, ...props }) => {
  const cookie = new Cookies();
  const classes = useStyles();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // State
  const [themeValue, setThemeValue] = React.useState('system');

  /**
   * Cek tema saat pertama kali komponen dipasang
   * Set themevalue
   */
  React.useEffect(() => {
    const theme = cookie.get('theme');
    if (Boolean(theme)) {
      if (theme === 'dark' || theme === 'light') {
        setThemeValue(theme);
      }
    }

    // eslint-disable-next-line
  }, [prefersDarkMode]);

  /**
   * Handle saat tomol tema di ubah
   * @param {Object} event
   * @param {String} newTheme
   */
  const handleChangeTheme = (event, newTheme) => {
    // set theme value
    setThemeValue(newTheme);

    // set Redux
    if (newTheme === 'system') {
      setReduxTheme(prefersDarkMode ? 'dark' : 'light');
    } else {
      setReduxTheme(newTheme);
    }

    // Set cookie theme
    const date = new Date();
    date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
    cookie.set('theme', newTheme, { path: '/', expires: date });

    // ubah class pada tag body
    if (newTheme === 'dark') {
      document.querySelector('body').classList.add('bg-dark');
    } else {
      if (newTheme === 'system' && prefersDarkMode) {
        document.querySelector('body').classList.add('bg-dark');
      } else {
        document.querySelector('body').classList.remove('bg-dark');
      }
    }
  };
  return (
    <Box mb={3}>
      <Typography
        noWrap
        variant="subtitle1"
        component="span"
        color="textSecondary"
        className={classes.title}
      >
        Appearance
      </Typography>

      <ToggleButtonGroup
        exclusive
        size="medium"
        value={themeValue}
        onChange={handleChangeTheme}
        className={classes.toggleGroup}
      >
        <ToggleButton className={classes.toggleTheme} value="light">
          Light
        </ToggleButton>
        <ToggleButton className={classes.toggleTheme} value="system">
          System
        </ToggleButton>
        <ToggleButton className={classes.toggleTheme} value="dark">
          Dark
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
// Redux state
const reduxState = state => ({
  reduxTheme: state.theme
});

// Redux reducer
const reduxReducer = dispatch => ({
  setReduxTheme: value => dispatch({ type: 'SET_THEME', value: value })
});

export default connect(reduxState, reduxReducer)(Appearance);
