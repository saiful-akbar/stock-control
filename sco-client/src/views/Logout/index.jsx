import React from 'react';
import { withCookies } from 'react-cookie';
import { logout } from 'src/services/auth';

/**
 * Componen utama
 * @param {*} param0
 */
function Logout({ cookies, ...props }) {
  const is_mounted = React.useRef(true);

  React.useEffect(() => {
    handleLogout();

    return () => {
      is_mounted.current = false;
    };

    // eslint-disable-next-line
  }, []);

  /* Request logout */
  const handleLogout = () => {
    logout()
      .then(() => {
        if (is_mounted.current) {
          removeToken();
        }
      })
      .catch(() => {
        if (is_mounted.current) {
          removeToken();
        }
      });
  };

  /* remove cookie auth_token */
  const removeToken = () => {
    cookies.remove('auth_token');
    window.location.href = '/login';
  };

  /* Render component utama */
  return <div />;
}

export default withCookies(Logout);
