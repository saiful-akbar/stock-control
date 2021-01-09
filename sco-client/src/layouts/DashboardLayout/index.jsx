import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import NavBar from './NavBar';
import TopBar from './TopBar';
import { userLogin } from '../../services/auth';
import { makeStyles, Backdrop } from '@material-ui/core';
import clsx from 'clsx';
import Toast from 'src/components/Toast';
import { reduxAction } from 'src/config/redux/state';
import Progress from 'src/components/Progress';

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
  },
  backdrop: {
    zIndex: 9999,
    backgroundColor: theme.palette.background.dark
  },
}));

const DashboardLayout = ({
  cookies,
  reduxUserLogin,
  setReduxUserLogin,
  reduxToast,
  setReduxToast,
}) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [isDesktopNavOpen, setDesktopNavOpen] = useState(true);
  const [isBackdropOpen, setBackdropOpen] = useState(true);


  // Cek apakah user sudah login atau belum
  React.useEffect(() => {
    getUserIsLogin();

    // eslint-disable-next-line
  }, []);



  // Cek apakah data user yang sedang login ada tau tidak
  React.useEffect(() => {
    if (reduxUserLogin !== null) {
      setTimeout(() => {
        setBackdropOpen(false);
      }, 1000);
    } else {
      setBackdropOpen(true);
    }
  }, [reduxUserLogin, setBackdropOpen]);



  // Mengambil data user yang sedang login
  const getUserIsLogin = async () => {
    if (cookies.get('auth_token') !== undefined) {
      if (reduxUserLogin === null) {
        try {
          await setReduxUserLogin();
        }
        catch (err) {
          if (err.status === 401) {
            window.location.href = '/logout';
          }
        }
      }
    }
    else {
      navigate('/login');
    }
  }


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

      <Backdrop
        className={classes.backdrop}
        open={isBackdropOpen}
      >
        <Progress
          type='circular'
          size={70}
          show={true}
        />
      </Backdrop>

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
  reduxToast: state.toast,
});

export default connect(reduxState, reduxDispatch)(withCookies(DashboardLayout));
