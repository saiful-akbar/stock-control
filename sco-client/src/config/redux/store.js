import {
  createStore,
  applyMiddleware
} from 'redux';
import thunk from 'redux-thunk';
import {
  reduxState,
  reduxAction
} from './state';

const reducer = (state = reduxState, action) => {
  switch (action.type) {
    // Merubah value loading
    case reduxAction.loading:
      return {
        ...state,
        loading: action.value,
      };

      // Merubah value user login
    case reduxAction.userLogin:
      return {
        ...state,
        userLogin: action.value,
      };

      // Merubah value theme 
    case reduxAction.theme:
      return {
        ...state,
        theme: action.value,
      };

      // Merubah value theme 
    case reduxAction.toast:
      return {
        ...state,
        toast: {
          show: action.value.show,
          type: action.value.type,
          message: action.value.message,
        },
      };

    default:
      return state;
  }
};

const reduxStore = createStore(reducer, applyMiddleware(thunk));
export default reduxStore;
