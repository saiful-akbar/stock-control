import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles,
  Zoom,
  Typography
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import CustomTooltip from 'src/components/CustomTooltip';
import Clock from 'src/components/Clock';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import { useSelector } from 'react-redux';
import UserAccount from './UserAccount';
import { useTheme } from '@material-ui/styles';

const navBarWidth = 256;

const useStyles = makeStyles(theme => ({
  topBar: {
    backgroundColor: theme.palette.background.topBar,
    backdropFilter: 'blur(8px)',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  topBarShift: {
    zIndex: theme.zIndex.drawer + 1,
    [theme.breakpoints.up('lg')]: {
      width: `calc(100% - ${navBarWidth}px)`,
      marginLeft: navBarWidth
    },
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  clock: {
    margin: theme.spacing(0, 0.5)
  },
  setting: {
    margin: theme.spacing(0, 0.5)
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
    elevation: trigger ? (theme.palette.type === 'light' ? 3 : 0) : 0
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
  const { pageTitle } = useSelector(state => state.globalReducer);
  const classes = useStyles();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 40
  });

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

          {/* Page title */}
          <Zoom in={trigger}>
            <Box ml={1} mr={1}>
              <Typography variant="subtitle2" color="textPrimary">
                {pageTitle}
              </Typography>
            </Box>
          </Zoom>

          <Box flexGrow={1} />

          {/* Clock */}
          <Hidden xsDown>
            <Clock className={classes.clock} />
          </Hidden>

          {/* Button setting */}
          <CustomTooltip title="Open setting">
            <IconButton
              color="default"
              onClick={onSettingOpen}
              className={classes.setting}
            >
              <SettingsOutlinedIcon fontSize="small" />
            </IconButton>
          </CustomTooltip>

          {/* User account */}
          <UserAccount />
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
