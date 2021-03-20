import React from 'react';
import { Snackbar, Slide } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

/**
 * Aniimasi slide
 */
function SlideTransition(props) {
  return <Slide {...props} direction="up" timeout={300} />;
}

/**
 * Main component
 */
const Toast = ({ open, handleClose, type, message }) => {
  const handleCloseToast = reason => {
    if (reason === 'clickaway') {
      return;
    }
    handleClose();
  };

  return (
    <Snackbar
      open={open}
      onClose={handleCloseToast}
      autoHideDuration={10000}
      TransitionComponent={SlideTransition}
      key={SlideTransition.name}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
    >
      <Alert
        elevation={5}
        variant="filled"
        onClose={handleCloseToast}
        severity={type}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
