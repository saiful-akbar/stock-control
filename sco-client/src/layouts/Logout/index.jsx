import React from 'react';
import { withCookies } from 'react-cookie';
import {
  makeStyles,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import { logout } from 'src/services/auth';

/**
 * Style
 */
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: 9999,
    backgroundColor: theme.palette.background.dark
  },
}));

/**
 * Componen utama
 * @param {*} param0 
 */
function Logout({ cookies, ...props }) {
  const classes = useStyles();
  const is_mounted = React.useRef(true);

  React.useEffect(() => {
    handleLogout();

    return () => {
      is_mounted.current = false;
    }
    // eslint-disable-next-line
  }, []);

  /**
   * Request logout
   */
  const handleLogout = async () => {
    try {
      await logout();
      if (is_mounted.current) {
        removeToken();
      }
    } catch (err) {
      if (is_mounted.current) {
        removeToken();
      }
    }
  }

  /**
   * remove cookie auth_token
   */
  const removeToken = () => {
    cookies.remove('auth_token');
    window.location.href = '/login';
  }

  /**
   * Render component utama
   */
  return (
    <Backdrop className={classes.backdrop} open={true}>
      <CircularProgress size={70} />
    </Backdrop>
  );
};

export default withCookies(Logout);
