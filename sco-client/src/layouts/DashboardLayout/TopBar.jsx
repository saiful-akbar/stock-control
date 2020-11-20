import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import Logo from 'src/components/Logo';
import CustomTooltip from 'src/components/CustomTooltip';
import ThemeMode from './ThemeMode';
import Clock from 'src/components/Clock';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.topBar,
    zIndex: theme.zIndex.drawer + 1
  },
  avatar: {
    width: 60,
    height: 60
  },
  logo: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  clock: {
    color: '#fff',
    border: '1px solid #fff',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  }
}));

const TopBar = ({
  className,
  onMobileNavOpen,
  onDesktopNavOpen,
  openDesktopNav,
  reduxTheme,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <AppBar
      className={clsx(classes.root, className)}
      elevation={reduxTheme === 'light' ? 5 : 3}
    >
      <Toolbar>
        <Hidden mdDown>
          <CustomTooltip title={openDesktopNav ? 'Close menu' : 'Open menu'} placement='bottom'>
            <IconButton onClick={onDesktopNavOpen} color='inherit' >
              {openDesktopNav ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
          </CustomTooltip>
        </Hidden>

        <RouterLink to='/dashboard' className={classes.logo} >
          <Logo height={40} />
        </RouterLink>

        <Box flexGrow={1} />

        <Hidden mdDown>
          <Clock className={classes.clock} />
        </Hidden>

        <ThemeMode color='inherit' />

        <Hidden lgUp>
          <CustomTooltip title='Open menu' placement='bottom'>
            <IconButton onClick={onMobileNavOpen} color='inherit' >
              <MenuIcon />
            </IconButton>
          </CustomTooltip>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func,
  openDesktopNav: PropTypes.bool,
};

const reduxState = (state) => ({
  reduxTheme: state.theme
});

export default connect(reduxState, null)(TopBar);
