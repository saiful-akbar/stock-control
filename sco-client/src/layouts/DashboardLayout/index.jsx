import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { userIsLogin } from 'src/services/auth';
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
    height: 'calc(100vh - 48px)'
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
    minHeight: '100%',
    width: '100%'
  },
  wrapper: {
    paddingTop: 48,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: drawerWidth
    }
  },
  contentContainer: {
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
    height: '100%'
  }
}));

const DashboardLayout = ({
  cookies,
  setReduxUserIsLogin,
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
    window.onload = () => {
      const preloader = document.getElementById('preloader');
      preloader.remove();
    };

    // eslint-disable-next-line
  }, []);

  /* Cek apakah user sudah login atau belum */
  React.useEffect(() => {
    getUserIsLogin();

    // eslint-disable-next-line
  }, []);

  /* Mengambil data user yang sedang login */
  const getUserIsLogin = async () => {
    if (Boolean(cookies.get('auth_token'))) {
      try {
        await setReduxUserIsLogin();
      } catch (error) {
        if (error.status === 401) {
          window.location.href = '/logout';
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
  setReduxUserIsLogin: () => dispatch(userIsLogin()),
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
  reduxToast: state.toast
});

export default connect(reduxState, reduxReducer)(withCookies(DashboardLayout));
