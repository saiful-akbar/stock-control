import React from 'react';
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
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import { useTheme } from '@material-ui/core/styles';

const navBarWidth = 256;

const useStyles = makeStyles(theme => ({
  topBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  topBarShift: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    [theme.breakpoints.up('lg')]: {
      marginLeft: navBarWidth,
      width: `calc(100% - ${navBarWidth}px)`
    }
  },
  clock: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

/* Elevation scroll */
function ElevationScroll(props) {
  const { children, window } = props;
  const theme = useTheme();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined
  });

  return React.cloneElement(children, {
    elevation: trigger ? 3 : 0,
    style: {
      transition: '0.5s',
      backgroundColor: trigger
        ? theme.palette.type === 'dark'
          ? theme.palette.background.dark
          : theme.palette.background.paper
        : 'transparent'
    }
  });
}

/* props types elevation scroll */
ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func
};

/* Komponen utama */
const TopBar = ({
  className,
  onMobileNavOpen,
  onDesktopNavOpen,
  onSettingOpen,
  openDesktopNav,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <ElevationScroll {...rest}>
      <AppBar
        className={clsx(classes.topBar, {
          [classes.topBarShift]: openDesktopNav
        })}
      >
        <Toolbar variant="dense">
          <Hidden mdDown>
            <CustomTooltip
              title={openDesktopNav ? 'Close menu' : 'Open menu'}
              placement="bottom"
            >
              <IconButton onClick={onDesktopNavOpen} color="default">
                {openDesktopNav ? (
                  <MenuOpenIcon fontSize="small" />
                ) : (
                  <MenuIcon fontSize="small" />
                )}
              </IconButton>
            </CustomTooltip>
          </Hidden>

          <Hidden lgUp>
            <CustomTooltip title="Open menu" placement="bottom">
              <IconButton onClick={onMobileNavOpen} color="default">
                <MenuIcon fontSize="small" />
              </IconButton>
            </CustomTooltip>
          </Hidden>

          <Box flexGrow={1} />

          <Hidden xsDown>
            <Clock className={classes.clock} />
          </Hidden>

          <CustomTooltip title="Open setting">
            <IconButton color="default" onClick={onSettingOpen}>
              <SettingsOutlinedIcon fontSize="small" />
            </IconButton>
          </CustomTooltip>
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func,
  onSettingOpen: PropTypes.func,
  openDesktopNav: PropTypes.bool
};

export default TopBar;
