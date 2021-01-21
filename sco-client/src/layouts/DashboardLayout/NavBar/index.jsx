import React, { useEffect, useState } from 'react';
import {
  Link as RouterLink,
  useLocation,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles,
  Grid,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { connect } from 'react-redux';
import apiUrl from 'src/utils/apiUrl';
import NavItem from './NavItem';

// Style
const useStyles = makeStyles((theme) => ({
  mobileDrawer: {
    width: 256,
    backgroundColor: theme.palette.background.dark,
    overflow: 'hidden',
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)',
    backgroundColor: theme.palette.background.dark,
    borderRight: 'none',
    overflow: 'hidden',
  },
  avatar: {
    cursor: 'pointer',
    width: theme.spacing(7),
    height: theme.spacing(7)
  },
  profile: {
    padding: theme.spacing(2)
  },
  menu: {
    width: 256, // lebar menu
    height: 'calc(100% - 88px)',
    overflow: 'hidden',
    '&:hover': {
      overflowY: 'auto'
    }
  },
  menuNavigation: {
    width: `calc(256px - 18px)`, // lebar navigasi menu
  }
}));

// Main component
const NavBar = ({
  onMobileClose,
  openMobile,
  openDesktop,
  reduxUserLogin,
}) => {
  const classes = useStyles();
  const location = useLocation();
  const [collapseIsActive, setCollapseIsActive] = useState(null);

  const menuDashboard = {
    id: 0,
    menu_i_title: 'Dashboard',
    menu_i_url: '/dashboard',
    menu_i_icon: 'dashboard',
    menu_i_children: 0,
    pivot: {
      user_m_i_create: 1,
      user_m_i_read: 1,
      user_m_i_update: 1,
      user_m_i_delete: 1,
    }
  };

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line
  }, [location.pathname]);


  const content = (
    <Box
      height='100%'
      display='flex'
      flexDirection='column'
    >
      <Grid
        container
        direction='row'
        justify='center'
        alignItems='center'
        wrap='nowrap'
        spacing={2}
        className={classes.profile}
      >
        {reduxUserLogin !== null
          ? (
            <>
              <Grid item>
                <Avatar
                  to='/account'
                  className={classes.avatar}
                  component={RouterLink}
                  src={
                    reduxUserLogin.profile.profile_avatar === null
                      ? ''
                      : apiUrl(`/avatar/${reduxUserLogin.profile.profile_avatar}`)
                  }
                />
              </Grid>

              <Grid item xs zeroMinWidth>
                <Typography
                  color='textPrimary'
                  variant='h6'
                  noWrap
                >
                  {reduxUserLogin.profile.profile_name}
                </Typography>

                <Typography
                  color='textSecondary'
                  variant='body2'
                  noWrap
                >
                  {reduxUserLogin.profile.profile_division}
                </Typography>
              </Grid>
            </>
          ) : (
            <>
              <Grid item>
                <Skeleton variant='circle' className={classes.avatar} />
              </Grid>

              <Grid item xs zeroMinWidth>
                <Skeleton variant='text' width='100%' >
                  <Typography variant='h6'>{'...'}</Typography>
                </Skeleton>

                <Skeleton variant='text' width='90%' >
                  <Typography variant='body2'>{'...'}</Typography>
                </Skeleton>
              </Grid>
            </>
          )
        }
      </Grid>

      <Divider />
      <Box flexGrow={1} />

      <Box className={classes.menu}>
        {reduxUserLogin === null
          ? (
            <Skeleton variant='rect' height='100%' />
          ) : (
            <Box className={classes.menuNavigation}>
              <List>
                <NavItem
                  collapse={collapseIsActive}
                  collapseActive={(url) => setCollapseIsActive(url)}
                  data={menuDashboard}
                />
                {reduxUserLogin.menu_items.map((item, key) => (
                  <NavItem
                    key={key}
                    data={item}
                    collapse={collapseIsActive}
                    collapseActive={(url) => setCollapseIsActive(url)}
                  />
                ))}
              </List>
            </Box>
          )
        }
      </Box>

      <Box flexGrow={1} />
      <Divider />

      <Box p={2} >
        <Box display='flex' justifyContent='center' >
          {reduxUserLogin === null
            ? (
              <Skeleton variant='rect' width={224} height={30} />
            ) : (
              <Button
                fullWidth
                color='secondary'
                size='small'
                variant='contained'
                onClick={() => window.location.href = '/logout'}
              >
                {'Logout'}
              </Button>
            )}
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor='left'
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant='temporary'
        >
          {content}
        </Drawer>
      </Hidden>

      <Hidden mdDown>
        <Drawer
          anchor='left'
          classes={{ paper: classes.desktopDrawer }}
          open={openDesktop}
          variant='persistent'
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
  openDesktop: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => { },
  openMobile: false
};

const reduxState = (state) => ({
  reduxUserLogin: state.userLogin,
});

export default connect(reduxState, null)(NavBar);
