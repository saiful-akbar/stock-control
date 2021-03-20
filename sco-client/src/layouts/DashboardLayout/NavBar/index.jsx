import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles,
  Grid,
  SwipeableDrawer,
  ButtonBase
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { useSelector } from 'react-redux';
import apiUrl from 'src/utils/apiUrl';
import NavItem from './NavItem';
import LogoutConfirm from './LogutConfirm';
import NavItemDashboard from './NavItemDashboard';

// Style
const useStyles = makeStyles(theme => ({
  mobileDrawer: {
    backgroundColor: theme.palette.background.paper,
    width: 256,
    overflow: 'hidden'
  },
  desktopDrawer: {
    width: 256,
    top: 48,
    height: 'calc(100% - 48px)',
    backgroundColor: theme.palette.background.dark,
    border: 'none',
    overflow: 'hidden'
  },
  avatar: {
    borderRadius: '50%',
    width: theme.spacing(7),
    height: theme.spacing(7)
  },
  profile: {
    padding: theme.spacing(2)
  },
  menu: {
    width: 256, // lebar menu
    height: 'calc(100% - 150px)',
    overflowY: 'auto'
  }
}));

// Main component
const NavBar = ({ onMobileToggle, openMobile, openDesktop }) => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const { userLogin } = useSelector(state => state.authReducer);
  const [collapseIsActive, setCollapseIsActive] = useState(null);

  useEffect(() => {
    if (openMobile && onMobileToggle) {
      onMobileToggle(false);
    }
    // eslint-disable-next-line
  }, [location.pathname]);

  /* Fungsi untuk mengambil avatar dari api url */
  const getAvatar = avatarUrl => {
    return avatarUrl !== null ? apiUrl(`/avatar/${avatarUrl}`) : '';
  };

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        wrap="nowrap"
        spacing={2}
        className={classes.profile}
      >
        <Grid item>
          {userLogin !== null ? (
            <ButtonBase
              className={classes.avatar}
              onClick={() => navigate('/account')}
            >
              <Avatar
                className={classes.avatar}
                src={
                  userLogin.profile.profile_avatar === null
                    ? '/static/images/svg/default_avatar.svg'
                    : getAvatar(userLogin.profile.profile_avatar)
                }
              />
            </ButtonBase>
          ) : (
            <Skeleton variant="circle" className={classes.avatar} />
          )}
        </Grid>

        <Grid item xs zeroMinWidth>
          {userLogin !== null ? (
            <>
              <Typography color="textPrimary" variant="h6" noWrap>
                {userLogin.profile.profile_name}
              </Typography>
              <Typography color="textSecondary" variant="body2" noWrap>
                {userLogin.profile.profile_division}
              </Typography>
            </>
          ) : (
            <>
              <Skeleton variant="text" width="100%">
                <Typography variant="h6">{'...'}</Typography>
              </Skeleton>
              <Skeleton variant="text" width="90%">
                <Typography variant="body2">{'...'}</Typography>
              </Skeleton>
            </>
          )}
        </Grid>
      </Grid>

      <Divider />
      <Box flexGrow={1} />

      <Box className={classes.menu}>
        {userLogin === null ? (
          <Skeleton variant="rect" height="100%" />
        ) : (
          <List component="div" disablePadding>
            <NavItemDashboard />

            {userLogin.menu_items.map((item, key) => (
              <NavItem
                key={key}
                data={item}
                collapse={collapseIsActive}
                collapseActive={url => setCollapseIsActive(url)}
              />
            ))}
          </List>
        )}
      </Box>

      <Box flexGrow={1} />
      <Divider />

      <Box p={2} display="flex" justifyContent="center">
        <LogoutConfirm />
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <SwipeableDrawer
          anchor="left"
          variant="temporary"
          open={openMobile}
          onClose={() => onMobileToggle(false)}
          onOpen={() => onMobileToggle(true)}
          classes={{ paper: classes.mobileDrawer }}
        >
          {content}
        </SwipeableDrawer>
      </Hidden>

      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open={openDesktop}
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileToggle: PropTypes.func,
  openMobile: PropTypes.bool,
  openDesktop: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileToggle: () => {},
  openMobile: false
};

export default NavBar;
