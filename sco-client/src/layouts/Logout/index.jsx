import React from 'react';
import { withCookies } from 'react-cookie';
import {
  makeStyles,
  Backdrop,
  CircularProgress
} from '@material-ui/core';
import { logout } from 'src/services/auth';

/**
 * Style
 */
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: 1,
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.default
  },
}));

/**
 * Componen utama
 * @param {*} param0 
 */
function Logout({ cookies }) {
  const classes = useStyles();

  React.useEffect(() => {
    handleLogout();
    // eslint-disable-next-line
  }, []);

  /**
   * Request logout
   */
  const handleLogout = async () => {
    await logout();
    cookies.remove('auth_token');
    window.location.href = '/login';
  }

  /**
   * Render component utama
   */
  return (
    <Backdrop className={classes.backdrop} open={true}>
      <CircularProgress color="primary" size={50} />
    </Backdrop>
  );
};

export default withCookies(Logout);
