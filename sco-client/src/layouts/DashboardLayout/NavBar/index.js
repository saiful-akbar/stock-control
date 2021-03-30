import React, { useEffect, useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles,
  Grid,
  SwipeableDrawer,
  Button
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { useSelector, useDispatch } from 'react-redux';
import NavItem from './NavItem';
import NavItemDashboard from './NavItemDashboard';
import Logo from 'src/components/Logo';
import navbarImage from 'src/assets/images/background/navbar_background.png';

// Style
const useStyles = makeStyles(theme => ({
  drawer: {
    overflow: 'hidden',
    backgroundColor: theme.palette.background.navBar,
    height: '100vh',
    width: '256px',
    display: 'flex',
    flexDirection: 'column',
    border: 'none',
    backgroundAttachment: 'fixed',
    backgroundImage: `url(${navbarImage})`,
    backgroundPosition: 'left 0 bottom 0',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '256px auto'
  },
  drawerBgImage: {},
  avatar: {
    borderRadius: '50%',
    width: theme.spacing(5),
    height: theme.spacing(5)
  },
  profile: {
    padding: theme.spacing(1, 3)
  },
  menu: {
    width: 256, // lebar menu
    height: 'calc(100% - 110px)',
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  menuSkeleton: {
    backgroundColor: 'rgba(238, 238, 238, 0.13)'
  },
  logoText: {
    color: '#fff',
    fontSize: 18
  },
  textPrimary: {
    color: '#fff'
  },
  textSecondary: {
    color: 'rgba(255, 255, 255, 0.7)'
  },
  divider: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)'
  },
  btnLogout: {
    background: 'transparent',
    borderRadius: 5,
    color: 'white',
    height: 34,
    padding: '0 30px',
    textTransform: 'capitalize',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.08)'
    }
  }
}));

// Main component
const NavBar = ({ onMobileToggle, openMobile, openDesktop }) => {
  const classes = useStyles();
  const location = useLocation();
  const { userLogin } = useSelector(state => state.authReducer);
  const dispatch = useDispatch();
  const [collapseIsActive, setCollapseIsActive] = useState(null);

  useEffect(() => {
    if (openMobile && onMobileToggle) onMobileToggle(false);

    // eslint-disable-next-line
  }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={2}
        className={classes.profile}
      >
        <Grid item>
          <RouterLink to="/">
            <Logo />
          </RouterLink>
        </Grid>

        <Grid item xs zeroMinWidth>
          <Typography
            noWrap
            variant="h5"
            className={classes.logoText}
            component={RouterLink}
            to="/"
          >
            Stock Control
          </Typography>
        </Grid>
      </Grid>

      <Divider className={classes.divider} />
      <Box flexGrow={1} />

      <Box className={classes.menu} id="navbar-menu">
        {userLogin.menuItems.length <= 0 ? (
          <Skeleton
            variant="rect"
            height="100%"
            className={classes.menuSkeleton}
          />
        ) : (
          <List component="div" disablePadding>
            <NavItemDashboard />

            {userLogin.menuItems.map((item, key) => (
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
      <Divider className={classes.divider} />

      <Box p={2} display="flex" justifyContent="center">
        {userLogin.account === null ? (
          <Skeleton
            variant="rect"
            height={34}
            width="100%"
            className={classes.menuSkeleton}
          />
        ) : (
          <Button
            fullWidth
            className={classes.btnLogout}
            onClick={e => dispatch({ type: 'SET_LOGOUT', value: true })}
          >
            Log out
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <React.Fragment>
      <Hidden lgUp>
        <SwipeableDrawer
          anchor="left"
          variant="temporary"
          elevation={3}
          open={openMobile}
          classes={{ paper: classes.drawer }}
          onClose={() => onMobileToggle(false)}
          onOpen={() => onMobileToggle(true)}
        >
          {content}
        </SwipeableDrawer>
      </Hidden>

      <Hidden mdDown>
        <Drawer
          anchor="left"
          variant="persistent"
          open={openDesktop}
          classes={{ paper: classes.drawer }}
        >
          {content}
        </Drawer>
      </Hidden>
    </React.Fragment>
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
