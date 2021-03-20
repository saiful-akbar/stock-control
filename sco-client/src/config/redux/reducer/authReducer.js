const initialState = {
  userLogin: {
    account: null,
    profile: null,
    menuItems: [],
    menuSubItems: []
  }
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER_LOGIN':
      return {
        ...state,
        userLogin: {
          account: action.value.account,
          profile: action.value.profile,
          menuItems: action.value.menuItems,
          menuSubItems: action.value.menuSubItems
        }
      };

    default:
      return state;
  }
};
