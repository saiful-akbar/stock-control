import React from 'react';
import {
  Snackbar,
  Slide
} from '@material-ui/core';
import {
  Alert,
  // AlertTitle
} from '@material-ui/lab';

/**
 * Aniimasi slide
 */
function SlideTransition(props) {
  return <Slide {...props} direction="down" timeout={300} />;
}

/**
 * Main component
 */
const Toast = ({ open, handleClose, type, message }) => {
  const handleCloseToast = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    handleClose();
  };

  return (
    <Snackbar
      open={open}
      onClose={handleCloseToast}
      autoHideDuration={15000}
      TransitionComponent={SlideTransition}
      key={SlideTransition.name}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
    >
      <Alert
        elevation={5}
        variant='filled'
        onClose={handleCloseToast}
        severity={type}
      >{message}</Alert>
    </Snackbar>
  );
}

export default Toast;
