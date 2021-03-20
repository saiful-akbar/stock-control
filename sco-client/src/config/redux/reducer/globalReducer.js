import Cookies from 'universal-cookie';

const cookie = new Cookies();

const inittialGlobalState = {
  loading: true,
  theme: cookie.get('theme') === 'dark' ? 'dark' : 'light',
  toast: {
    show: false,
    type: 'info',
    message: ''
  }
};

export const globalReducer = (state = inittialGlobalState, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.value
      };

    case 'SET_THEME':
      return {
        ...state,
        theme: action.value
      };

    case 'SET_TOAST':
      return {
        ...state,
        toast: {
          show: action.value.show,
          type: action.value.type,
          message: action.value.message
        }
      };

    default:
      return state;
  }
};
