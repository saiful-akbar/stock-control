import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import CloseIcon from '@material-ui/icons/Close';
import Cookies from 'universal-cookie';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useMediaQuery,
  SwipeableDrawer
} from '@material-ui/core';


// Style
const useStyles = makeStyles((theme) => ({
  root: {
    width: 300,
    overflow: 'hidden',
    fontWeight: 500,
  },
  header: {
    padding: '8px 10px',
    backgroundColor: theme.palette.background.topBar,
    color: '#FFFFFF',
  },
  list: {
    height: 'calc(100% - 80px)',
    overflowX: 'hidden',
    padding: '8px 10px',
  },
  toggleGroup: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  toggleTheme: {
    width: 'calc(100% / 3)',
  },
  title: {
    fontWeight: 500,
  },
}));


// Komponen utama
function NavSetting({
  onToggle,
  open,
  setReduxTheme,
  reduxTheme,
  ...props
}) {
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
  }, [prefersDarkMode])


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
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    cookie.set('theme', newTheme, { path: '/', expires: date })

    // ubah class pada tag body
    if (newTheme === 'dark') {
      document.querySelector("body").classList.add("bg-dark");
    } else {
      if (newTheme === 'system' && prefersDarkMode) {
        document.querySelector("body").classList.add("bg-dark");
      } else {
        document.querySelector("body").classList.remove("bg-dark");
      }
    }
  }


  // Render
  return (
    <SwipeableDrawer
      anchor='right'
      open={open}
      onClose={() => onToggle(false)}
      onOpen={() => onToggle(true)}
      classes={{ paper: classes.root }}
    >
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        boxShadow={reduxTheme === 'dark' ? 0 : 5}
        className={classes.header}
      >
        <Typography variant='h5'>Setting</Typography>
        <IconButton color='inherit' onClick={() => onToggle(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box className={classes.list} >
        <Box mb={3}>
          <Typography
            noWrap
            variant='subtitle1'
            component='span'
            className={classes.title}
          >
            Appearance
          </Typography>
          <ToggleButtonGroup
            exclusive
            size='medium'
            value={themeValue}
            onChange={handleChangeTheme}
            className={classes.toggleGroup}
          >
            <ToggleButton className={classes.toggleTheme} value='light'>Light</ToggleButton>
            <ToggleButton className={classes.toggleTheme} value='system'>System</ToggleButton>
            <ToggleButton className={classes.toggleTheme} value='dark'>Dark</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
}


// Redux reducer
const reduxReducer = (dispatch) => ({
  setReduxTheme: (value) => dispatch({ type: 'SET_THEME', value: value }),
})


// Redux state
const reduxState = (state) => ({
  reduxTheme: state.theme,
})


export default connect(reduxState, reduxReducer)(NavSetting);