import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { userLogin } from '../../services/auth';
import { makeStyles, CircularProgress } from '@material-ui/core';
import { reduxAction } from 'src/config/redux/state';
import Toast from 'src/components/Toast';
import TopBar from './TopBar';
import NavBar from './NavBar';
import clsx from 'clsx';
import ErrorBoundary from 'src/components/ErrorBoundary';
import NavSetting from './NavSetting';

/* Style untuk komponen lodingSuspense */
const fallbackStyle = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  }
}));

/* Komponent untuk fallback suspense */
function Fallback() {
  const classes = fallbackStyle();

  return (
    <div className={classes.root}>
      <CircularProgress color="primary" size={50} />
    </div>
  );
}

/* Style untuk komponen DashboardLayout  */
const drawerWidth = 256;
const useStyles = makeStyles(theme => ({
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
    }
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    [theme.breakpoints.up('lg')]: {
      marginLeft: -drawerWidth
    }
  },
  contentContainerShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    [theme.breakpoints.up('lg')]: {
      marginLeft: 0
    }
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

  /* State */
  const [isMobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [isDesktopNavOpen, setDesktopNavOpen] = React.useState(true);
  const [isSettingOpen, setSettingOpen] = React.useState(false);

  /* Menghapus preloader */
  React.useEffect(() => {
    const preloader = document.getElementById('preloader');
    if (reduxUserLogin !== null && Boolean(preloader)) {
      preloader.remove();
    }
  }, [reduxUserLogin]);

  /* Cek apakah user sudah login atau belum */
  React.useEffect(() => {
    getUserIsLogin();

    // eslint-disable-next-line
  }, []);

  /* Mengambil data user yang sedang login */
  const getUserIsLogin = async () => {
    if (cookies.get('auth_token') !== undefined) {
      if (reduxUserLogin === null) {
        try {
          await setReduxUserLogin();
        } catch (err) {
          if (err.status === 401) {
            window.location.href = '/logout';
          }
        }
      }
    } else {
      navigate('/login');
    }
  };

  /* Render */
  return (
    <div className={classes.root}>
      <TopBar
        onMobileNavOpen={() => setMobileNavOpen(true)}
        onDesktopNavOpen={() => setDesktopNavOpen(!isDesktopNavOpen)}
        onSettingOpen={() => setSettingOpen(true)}
        openDesktopNav={isDesktopNavOpen}
      />

      <NavBar
        onMobileToggle={value => setMobileNavOpen(value)}
        openMobile={isMobileNavOpen}
        openDesktop={isDesktopNavOpen}
      />

      <NavSetting
        open={isSettingOpen}
        onToggle={value => setSettingOpen(value)}
      />

      <div className={classes.wrapper}>
        <div
          className={clsx(classes.contentContainer, {
            [classes.contentContainerShift]: isDesktopNavOpen
          })}
        >
          <div className={classes.content}>
            <ErrorBoundary>
              <React.Suspense fallback={<Fallback />}>
                <Outlet />
              </React.Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>

      <Toast
        open={reduxToast.show}
        type={reduxToast.type}
        message={reduxToast.message}
        handleClose={() =>
          setReduxToast(false, reduxToast.type, reduxToast.message)
        }
      />
    </div>
  );
};

/* Redux reducer */
const reduxReducer = dispatch => ({
  setReduxUserLogin: () => dispatch(userLogin()),
  setReduxToast: (show, type, message) =>
    dispatch({
      type: reduxAction.toast,
      value: {
        show: show,
        type: type,
        message: message
      }
    })
});

/* Redux state */
const reduxState = state => ({
  reduxUserLogin: state.userLogin,
  reduxToast: state.toast
});

export default connect(reduxState, reduxReducer)(withCookies(DashboardLayout));
