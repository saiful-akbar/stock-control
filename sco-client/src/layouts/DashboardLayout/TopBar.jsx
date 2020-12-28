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
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import CustomTooltip from 'src/components/CustomTooltip';
import ThemeMode from './ThemeMode';
import Clock from 'src/components/Clock';
import { Skeleton } from '@material-ui/lab';


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
          {reduxUserLogin === null
            ? (
              <Skeleton variant='circle' className={classes.menuButton} width={50} height={50} />
            ) : (
              <CustomTooltip
                title={openDesktopNav ? 'Close menu' : 'Open menu'}
                placement='bottom'
              >
                <IconButton
                  onClick={onDesktopNavOpen}
                  className={classes.menuButton}
                  color='inherit'
                >
                  {openDesktopNav ? <MenuOpenIcon /> : <MenuIcon />}
                </IconButton>
              </CustomTooltip>
            )}
        </Hidden>

        <Hidden lgUp>
          {reduxUserLogin === null
            ? (
              <Skeleton
                variant='circle'
                width={50}
                height={50}
                className={classes.menuButton}
              />
            ) : (
              <CustomTooltip
                title='Open menu'
                placement='bottom'
              >
                <IconButton
                  onClick={onMobileNavOpen}
                  className={classes.menuButton}
                  color='inherit'
                >
                  <MenuIcon />
                </IconButton>
              </CustomTooltip>
            )}
        </Hidden>

        {reduxUserLogin === null
          ? (
            <Skeleton variant='text'>
              <Typography variant="h6" >
                {'Stock Control'}
              </Typography>
            </Skeleton>
          ) : (
            <Typography
              variant="h6"
              color='inherit'
              className={classes.title}
              component={RouterLink}
              to='/dashboard'
            >
              {'Stock Control'}
            </Typography>
          )
        }


        <Box flexGrow={1} />

        <Hidden xsDown>
          {reduxUserLogin === null
            ? <Skeleton variant='rect' className={classes.skeletonClock} width={150} height={30} />
            : <Clock className={classes.clock} />
          }
        </Hidden>

        {reduxUserLogin === null
          ? <Skeleton variant='circle' width={50} height={50} />
          : <ThemeMode color='inherit' />
        }

      </Toolbar>
    </AppBar >
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func,
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
