import React from 'react';
import { connect } from 'react-redux';
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
import SettingsIcon from '@material-ui/icons/Settings';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import CustomTooltip from 'src/components/CustomTooltip';
import Clock from 'src/components/Clock';
import Logo from 'src/components/Logo';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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
    border: '1px solid #999999',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  skeletonClock: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

const TopBar = ({
  className,
  onMobileNavOpen,
  onDesktopNavOpen,
  onSettingOpen,
  openDesktopNav,
  reduxTheme,
  reduxUserLogin,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <AppBar
      className={clsx(classes.root, className)}
      elevation={reduxTheme === 'dark' ? 0 : 5}
    >
      <Toolbar>
        <Hidden mdDown>
          <CustomTooltip
            title={openDesktopNav ? 'Close menu' : 'Open menu'}
            placement='bottom'
          >
            <IconButton onClick={onDesktopNavOpen} className={classes.menuButton} color='inherit' >
              {openDesktopNav ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
          </CustomTooltip>
        </Hidden>

        <Hidden lgUp>
          <CustomTooltip title='Open menu' placement='bottom' >
            <IconButton onClick={onMobileNavOpen} className={classes.menuButton} color='inherit' >
              <MenuIcon />
            </IconButton>
          </CustomTooltip>
        </Hidden>

        <Hidden smUp>
          <Box flexGrow={1} />
          <Box display="flex" justifyContent="center" alignItems="center" >
            <RouterLink to="/">
              <Logo />
            </RouterLink>
          </Box>
          <Box flexGrow={1} />
        </Hidden>

        <Hidden xsDown>
          <RouterLink to="/">
            <Logo />
          </RouterLink>

          <Box flexGrow={1} />
          <Clock className={classes.clock} />
        </Hidden>

        <CustomTooltip title='Open setting' >
          <IconButton color='inherit' onClick={onSettingOpen} >
            <SettingsIcon />
          </IconButton>
        </CustomTooltip>
      </Toolbar>
    </AppBar >
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func,
  onSettingOpen: PropTypes.func,
  openDesktopNav: PropTypes.bool,
};


/**
 * Redux state
 */
function reduxState(state) {
  return {
    reduxTheme: state.theme,
    reduxUserLogin: state.userLogin,
  }
}

export default connect(reduxState, null)(TopBar);
