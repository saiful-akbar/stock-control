export const reduxState = {
  loading: false,
  theme: 'light',
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
