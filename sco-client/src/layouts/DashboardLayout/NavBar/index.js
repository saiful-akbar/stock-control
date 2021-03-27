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
  SwipeableDrawer
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { useSelector } from 'react-redux';
import NavItem from './NavItem';
import LogoutConfirm from './LogutConfirm';
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
    transition: 'width .3s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundAttachment: 'fixed',
    backgroundImage: `url(${navbarImage})`,
    backgroundPosition: 'left 0 bottom 0',
    backgroundRepeat: 'no-repeat',
    backgroundZize: '256px 556px'
  },
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
    overflowY: 'auto'
  },
  textPrimary: {
    color: '#fff'
  },
  textSecondary: {
    color: 'rgba(255, 255, 255, 0.7)'
  },
  divider: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)'
  }
}));

// Main component
const NavBar = ({ onMobileToggle, openMobile, openDesktop }) => {
  const classes = useStyles();
  const location = useLocation();
  const { userLogin } = useSelector(state => state.authReducer);
  const [collapseIsActive, setCollapseIsActive] = useState(null);

  useEffect(() => {
    if (openMobile && onMobileToggle) {
      onMobileToggle(false);
    }
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
            component={RouterLink}
            to="/"
            className={classes.textPrimary}
            variant="h6"
            noWrap
          >
            Stock Control
          </Typography>
        </Grid>
      </Grid>

      <Divider className={classes.divider} />
      <Box flexGrow={1} />

      <Box className={classes.menu}>
        {userLogin.menuItems.length <= 0 ? (
          <Skeleton variant="rect" height="100%" />
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
        <LogoutConfirm />
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <SwipeableDrawer
          elevation={3}
          anchor="left"
          variant="temporary"
          open={openMobile}
          onClose={() => onMobileToggle(false)}
          onOpen={() => onMobileToggle(true)}
          classes={{ paper: classes.drawer }}
        >
          {content}
        </SwipeableDrawer>
      </Hidden>

      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.drawer }}
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
