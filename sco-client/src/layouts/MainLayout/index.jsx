import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { makeStyles, CircularProgress } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import Toast from 'src/components/Toast';
import ErrorBoundary from 'src/components/ErrorBoundary';

/* Style untuk komponen lodingSuspense */
const fallbackStyle = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
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

const MainLayout = () => {
  const classes = useStyles();
  const { toast } = useSelector(state => state.globalReducer);
  const dispatch = useDispatch();

  /**
   * Menghapus preloader
   */
  useEffect(() => {
    window.onload = () => {
      document.getElementById('preloader').remove();
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
        open={toast.show}
        type={toast.type}
        message={toast.message}
        handleClose={() =>
          dispatch({
            type: 'SET_TOAST',
            value: {
              show: false,
              type: toast.type,
              message: toast.message
            }
          })
        }
      />
    </div>
  );
};

export default MainLayout;
