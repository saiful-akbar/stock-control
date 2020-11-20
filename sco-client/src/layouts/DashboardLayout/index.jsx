import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import NavBar from './NavBar';
import TopBar from './TopBar';
import { userLogin } from '../../services/auth';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import Toast from 'src/components/Toast';
import { reduxAction } from 'src/config/redux/state';

const drawerWidth = 256;
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: drawerWidth
    },
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('lg')]: {
      marginLeft: -drawerWidth,
    },
  },
  contentContainerShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.up('lg')]: {
      marginLeft: 0,
    },
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  }
}));

const DashboardLayout = ({
  cookies,
  reduxUserLogin,
  setReduxUserLogin,
  reduxToast,
  setReduxToast
}) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [isDesktopNavOpen, setDesktopNavOpen] = useState(true);


  // Cek apakah user sudah login atau belum
  React.useEffect(() => {
    if (cookies.get('auth_token') !== undefined) {
      if (reduxUserLogin === null) {
        const getUserIsLogin = async () => {
          try {
            await setReduxUserLogin();
          }
          catch (err) {
            if (err.status === 401) {
              cookies.remove('auth_token');
              window.location.href = '/login';
            }
          }
        }
        getUserIsLogin();
      }
    }
    else {
      navigate('/login');
    }
    // eslint-disable-next-line
  }, []);


  return (
    <div className={classes.root}>
      <TopBar
        onMobileNavOpen={() => setMobileNavOpen(true)}
        onDesktopNavOpen={() => setDesktopNavOpen(!isDesktopNavOpen)}
        openDesktopNav={isDesktopNavOpen}
      />
      <NavBar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
        openDesktop={isDesktopNavOpen}
      />

      <div className={classes.wrapper} >
        <div
          className={clsx(classes.contentContainer, {
            [classes.contentContainerShift]: isDesktopNavOpen,
          })}
        >
          <div className={classes.content} >
            <Outlet />
          </div>
        </div>
      </div>

      <Toast
        open={reduxToast.show}
        type={reduxToast.type}
        message={reduxToast.message}
        handleClose={() => setReduxToast(false, reduxToast.type, reduxToast.message)}
      />
    </div>
  );
};

const reduxDispatch = (dispatch) => ({
  setReduxUserLogin: () => dispatch(userLogin()),
  setReduxToast: (show, type, message) => dispatch({
    type: reduxAction.toast,
    value: {
      show: show,
      type: type,
      message: message,
    }
  })
});

const reduxState = (state) => ({
  reduxUserLogin: state.userLogin,
  reduxToast: state.toast
});

export default connect(reduxState, reduxDispatch)(withCookies(DashboardLayout));
