import React from 'react';
import { apiLogout } from 'src/services/auth';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';

/**
 * Componen utama
 * @param {*} param0
 */
function Logout({ cookies, ...props }) {
  const isMounted = React.useRef(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cookie = new Cookies();

  React.useEffect(() => {
    handleLogout();

    return () => {
      isMounted.current = false;
    };

    // eslint-disable-next-line
  }, []);

  /* Request logout */
  const handleLogout = () => {
    apiLogout()
      .then(() => {
        if (isMounted.current) {
          removeToken();
        }
      })
      .catch(() => {
        if (isMounted.current) {
          removeToken();
        }
      });
  };

  /* remove cookie auth_token */
  const removeToken = () => {
    cookie.remove('auth_token');
    dispatch({
      type: 'SET_USER_LOGIN',
      value: {
        account: null,
        profile: null,
        menuItems: [],
        menuSubItems: []
      }
    });
    navigate('/login');
  };

  /* Render component utama */
  return <div />;
}

export default Logout;
