import Cookies from 'universal-cookie';

// cookie
const cookie = new Cookies();
const cookieTheme = cookie.get('theme');

// Redux state
export const reduxState = {
  loading: true,
  theme: Boolean(cookieTheme === 'dark') ? 'dark' : 'light',
  userLogin: null,
  toast: {
    show: false,
    type: 'info',
    message: ''
  }
};

// Redux action
export const reduxAction = {
  loading: 'SET_LOADING',
  theme: 'SET_THEME',
  userLogin: 'SET_USER_LOGIN',
  toast: 'SET_TOAST',
};
