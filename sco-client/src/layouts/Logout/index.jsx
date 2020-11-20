import React from 'react';
import { withCookies } from 'react-cookie';
import {
  makeStyles,
  Backdrop,
  CircularProgress
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { logout } from 'src/services/auth';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: 1,
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.default
  },
}));

const Logout = ({ cookies }) => {
  const classes = useStyles();
  const navigate = useNavigate();


  React.useEffect(() => {
    handleLogout();

    // eslint-disable-next-line
  }, []);


  const handleLogout = async () => {
    try {
      await logout();
      cookies.remove('auth_token');
      navigate('/login');
    }
    catch (err) {
      cookies.remove('auth_token');
      navigate('/login');
    }
  }


  return (
    <Backdrop className={classes.backdrop} open={true}>
      <CircularProgress color="primary" size={50} />
    </Backdrop>
  );
};

export default withCookies(Logout);
