import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { apiGetDataUserLogin } from 'src/services/auth';
import { makeStyles, CircularProgress } from '@material-ui/core';
import Toast from 'src/components/Toast';
import TopBar from './TopBar';
import NavBar from './NavBar';
import clsx from 'clsx';
import ErrorBoundary from 'src/components/ErrorBoundary';
import NavSetting from './NavSetting';
import Cookies from 'universal-cookie';
import LogoutConfirm from 'src/components/LogoutConfirm';

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
      <CircularProgress color="primary" />
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

function DashboardLayout() {
  const classes = useStyles();
  const navigate = useNavigate();
  const cookie = new Cookies();
  const dispatch = useDispatch();
  const { userLogin } = useSelector(state => state.authReducer);
  const { toast } = useSelector(state => state.globalReducer);

  /* State */
  const [isMobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [isDesktopNavOpen, setDesktopNavOpen] = React.useState(true);
  const [isSettingOpen, setSettingOpen] = React.useState(false);
  const preloader = document.getElementById('preloader');

  /* Menghapus preloader */
  React.useEffect(() => {
    // eslint-disable-next-line
  }, []);

  /* Ambil data user login sari server via api */
  React.useEffect(() => {
    if (userLogin.account === null) {
      if (cookie.get('auth_token') !== undefined) {
        getUserIsLogin();
      } else {
        navigate('/login');
      }
    }

    // eslint-disable-next-line
  }, [userLogin]);

  /**
   * Menghilangkan preloader
   */
  React.useEffect(() => {
    if (Boolean(preloader)) preloader.remove();
  }, [preloader]);

  /**
   * Fungsi untuk mengambil data user yang sedang login
   */
  const getUserIsLogin = async () => {
    try {
      await dispatch(apiGetDataUserLogin());
    } catch (error) {
      if (error.status === 401) {
        window.location.href = '/logout';
      }
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

      {/* Logout Confirm */}
      <LogoutConfirm />

      {/* Toast */}
      <Toast
        open={toast.show}
        type={toast.type}
        message={toast.message}
        handleClose={() => {
          dispatch({
            type: 'SET_TOAST',
            value: {
              show: false,
              type: toast.type,
              message: toast.message
            }
          });
        }}
      />
    </div>
  );
}

export default DashboardLayout;
