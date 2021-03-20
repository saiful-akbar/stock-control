const initialState = {
  userLogin: null
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER_LOGIN':
      return {
        ...state,
        userLogin: action.value
      };

    default:
      return state;
  }
};
