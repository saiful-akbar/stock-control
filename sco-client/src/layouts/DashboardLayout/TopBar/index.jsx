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
  makeStyles
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import CustomTooltip from 'src/components/CustomTooltip';
import Clock from 'src/components/Clock';
import Logo from 'src/components/Logo';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import { useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    zIndex: theme.zIndex.drawer + 1
  },
  avatar: {
    width: 60,
    height: 60
  },
  clock: {
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
    elevation: trigger ? (Boolean(theme.palette.type === 'light') ? 5 : 4) : 0,
    style: {
      backgroundColor: trigger ? theme.palette.background.paper : 'transparent',
      transition: '0.5s'
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
    <React.Fragment>
      <ElevationScroll {...rest}>
        <AppBar className={clsx(classes.root, className)}>
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

            <RouterLink to="/">
              <Logo />
            </RouterLink>

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
    </React.Fragment>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func,
  onSettingOpen: PropTypes.func,
  openDesktopNav: PropTypes.bool
};

export default TopBar;
