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
  makeStyles
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import CustomTooltip from 'src/components/CustomTooltip';
import Clock from 'src/components/Clock';
import Logo from 'src/components/Logo';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.topBar,
    zIndex: theme.zIndex.drawer + 1
  },
  avatar: {
    width: 60,
    height: 60
  },
  clock: {
    color: '#fff',
    border: '1px solid #999999',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  skeletonClock: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  title: {
    flexGrow: 1
  }
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
      elevation={reduxTheme === 'dark' ? 3 : 5}
    >
      <Toolbar>
        {/* Toogle menu */}
        <Hidden mdDown>
          <CustomTooltip
            title={openDesktopNav ? 'Close menu' : 'Open menu'}
            placement="bottom"
          >
            <IconButton onClick={onDesktopNavOpen} color="inherit">
              {openDesktopNav ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
          </CustomTooltip>
        </Hidden>

        <Hidden lgUp>
          <CustomTooltip title="Open menu" placement="bottom">
            <IconButton onClick={onMobileNavOpen} color="inherit">
              <MenuIcon />
            </IconButton>
          </CustomTooltip>
        </Hidden>
        {/* End toggle menu */}

        {/* Logo */}
        <RouterLink to="/">
          <Logo />
        </RouterLink>

        <Box flexGrow={1} />

        {/* Clock */}
        <Hidden xsDown>
          <Clock className={classes.clock} />
        </Hidden>

        <CustomTooltip title="Open setting">
          <IconButton color="inherit" onClick={onSettingOpen}>
            <SettingsOutlinedIcon />
          </IconButton>
        </CustomTooltip>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func,
  onSettingOpen: PropTypes.func,
  openDesktopNav: PropTypes.bool
};

/**
 * Redux state
 */
function reduxState(state) {
  return {
    reduxTheme: state.theme,
    reduxUserLogin: state.userLogin
  };
}

export default connect(reduxState, null)(TopBar);
