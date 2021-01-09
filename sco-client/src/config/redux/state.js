import Cookies from 'universal-cookie';

// cookie
const cookie = new Cookies();

export const reduxState = {
  loading: true,
  theme: cookie.get('auth_token') === 'dark' ? 'dark' : 'light',
  userLogin: null,
  toast: {
    show: false,
    type: 'info',
    message: ''
  }
};

export const reduxAction = {
  loading: 'set_loading',
  theme: 'set_theme',
  userLogin: 'set_user_login',
  toast: 'set_toast'
};
