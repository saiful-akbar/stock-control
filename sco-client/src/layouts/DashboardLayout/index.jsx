import React from 'react';
import {
  Outlet,
  useNavigate
} from 'react-router-dom';
import {
  withCookies
} from 'react-cookie';
import {
  connect
} from 'react-redux';
import { userLogin } from '../../services/auth';
import {
  makeStyles,
  CircularProgress
} from '@material-ui/core';
import { reduxAction } from 'src/config/redux/state';
import Toast from 'src/components/Toast';
import TopBar from './TopBar';
import NavBar from './NavBar';
import clsx from 'clsx';
import ErrorBoundary from 'src/components/ErrorBoundary';


/* Style untuk komponen lodingSuspense */
const fallbackStyle = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }
}));


/* Komponent untuk fallback suspense */
function Fallback() {
  const classes = fallbackStyle();

  return (
    <div className={classes.root}>
      <CircularProgress color='primary' size={50} />
    </div>
  )
}


/* Style untuk komponen DashboardLayout  */
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
  const [isMobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [isDesktopNavOpen, setDesktopNavOpen] = React.useState(true);


  /**
   * Menghapus preloader
   */
  React.useEffect(() => {
    window.onload = () => {
      const preloader = document.getElementById("preloader");
      preloader.remove();
    }
  });


  // Cek apakah user sudah login atau belum
  React.useEffect(() => {
    getUserIsLogin();

    // eslint-disable-next-line
  }, []);


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

      <div className={classes.wrapper} >
        <div
          className={clsx(classes.contentContainer, {
            [classes.contentContainerShift]: isDesktopNavOpen,
          })}
        >
          <div className={classes.content} >
            <ErrorBoundary>
              <React.Suspense fallback={<Fallback />} >
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
