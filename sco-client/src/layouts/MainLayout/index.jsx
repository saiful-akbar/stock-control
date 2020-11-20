import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import {
  makeStyles,
  Backdrop,
  LinearProgress
} from '@material-ui/core';
import { connect } from 'react-redux';
import Toast from 'src/components/Toast';
import { reduxAction } from 'src/config/redux/state';

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
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.dark
  },
}));

const MainLayout = ({ reduxToast, setReduxToast }) => {
  const classes = useStyles();
  const [backdrop, setBackdrop] = useState(true);

  useEffect(() => {
    setBackdrop(false);
  }, [setBackdrop]);

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <Outlet />
          </div>
        </div>
      </div>

      <Backdrop className={classes.backdrop} open={backdrop}>
        <LinearProgress color="primary" style={{ width: '50%' }} />
      </Backdrop>

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
  reduxToast: state.toast
});


export default connect(reduxState, reduxDispatch)(MainLayout);
