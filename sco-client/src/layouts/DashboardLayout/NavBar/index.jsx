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
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { connect } from 'react-redux';
import apiUrl from 'src/apiUrl';
import NavItem from './NavItem';

// Style
const useStyles = makeStyles((theme) => ({
  mobileDrawer: {
    width: 256,
    backgroundColor: theme.palette.background.dark
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)',
    backgroundColor: theme.palette.background.dark,
    borderRight: 'none',
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  },
  profile: {
    padding: theme.spacing(2)
  },
  mainMenu: {
    width: 'calc(255px - 15px)',
  },
  menu: {
    paddingRight: '5px',
    height: 'calc(100% - 206px)',
    overflow: 'hidden',
    '&:hover': {
      overflowY: 'auto'
    }
  },
  skeletonMenu: {
    marginRight: '-5px',
    height: '100%',
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
      {reduxUserLogin !== null
        ? (
          <Grid
            container
            direction='column'
            justify='center'
            alignItems='center'
            wrap='nowrap'
            className={classes.profile}
          >
            <Grid item xs={12}>
              <Avatar
                className={classes.avatar}
                component={RouterLink}
                src={reduxUserLogin.profile.profile_avatar === null ? '' : apiUrl(`/avatar/${reduxUserLogin.profile.profile_avatar}`)}
                to='/account'
              />
            </Grid>

            <Grid item xs={12} zeroMinWidth>
              <Typography color='textPrimary'
                variant='subtitle1'
                noWrap
              >
                {reduxUserLogin.profile.profile_name}
              </Typography>
            </Grid>

            <Grid item xs={12} zeroMinWidth>
              <Typography
                color='textSecondary'
                variant='body2'
                noWrap
              >
                {reduxUserLogin.profile.profile_division}
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Box
            alignItems='center'
            display='flex'
            flexDirection='column'
            p={2}
          >
            <Skeleton variant='circle' className={classes.avatar} />
            <Skeleton variant='text' width='80%' >
              <Typography variant='subtitle1'>...</Typography>
            </Skeleton>
            <Skeleton variant='text' width='60%' >
              <Typography variant='body2'>...</Typography>
            </Skeleton>
          </Box>
        )
      }

      <Divider />
      <Box flexGrow={1} />

      <Box className={classes.menu}>
        {reduxUserLogin === null
          ? (
            <Skeleton variant='rect' className={classes.skeletonMenu} />
          ) : (
            <Box className={classes.mainMenu}>
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
          <Button
            fullWidth
            color='secondary'
            size='small'
            variant='contained'
            onClick={() => window.location.href = '/logout'}
            startIcon={<ExitToAppIcon />}
          >
            Logout
          </Button>
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
