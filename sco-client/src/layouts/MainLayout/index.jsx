import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { makeStyles, CircularProgress } from '@material-ui/core';
import { connect } from 'react-redux';
import Toast from 'src/components/Toast';
import { reduxAction } from 'src/config/redux/state';
import ErrorBoundary from 'src/components/ErrorBoundary';

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

/* Style untuk komponen MainLayout */
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    width: '100%'
  },
  content: {
    height: '100%'
  }
}));

const MainLayout = ({ reduxToast, setReduxToast }) => {
  const classes = useStyles();

  /**
   * Menghapus preloader
   */
  useEffect(() => {
    window.onload = () => {
      const preloader = document.getElementById('preloader');
      preloader.remove();
    };

    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <ErrorBoundary>
          <React.Suspense fallback={<Fallback />}>
            <Outlet />
          </React.Suspense>
        </ErrorBoundary>
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

const reduxDispatch = dispatch => ({
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

const reduxState = state => ({
  reduxToast: state.toast
});

export default connect(reduxState, reduxDispatch)(MainLayout);
