const initialState = {
  users: {
    data: null,
    totalData: 0,
    currentPage: 1,
    perPage: 25,
    sort: null,
    orderBy: 'asc',
    search: ''
  },
  userDetail: {
    account: {
      id: '',
      username: '',
      isActive: false,
      createdAt: '',
      updatedAt: ''
    },
    profile: {
      avatar: '',
      name: '',
      division: '',
      email: '',
      phone: '',
      address: '',
      createdAt: '',
      updatedAt: ''
    },
    menuItems: [],
    menuSubItems: [],
    logs: []
  }
};

export const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USERS':
      return {
        ...state,
        users: {
          data: action.value.data,
          currentPage: action.value.currentPage,
          perPage: action.value.perPage,
          sort: action.value.sort,
          orderBy: action.value.orderBy,
          search: action.value.search,
          totalData: action.value.totalData
        }
      };

    case 'SET_USER_DETAIL':
      const { account, profile, menuItems, menuSubItems, logs } = action.value;

      return {
        ...state,
        userDetail: {
          account: {
            id: account.id,
            username: account.username,
            isActive: account.isActive,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt
          },
          profile: {
            avatar: profile.avatar,
            name: profile.name,
            division: profile.division,
            email: profile.email,
            phone: profile.phone,
            address: profile.address,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt
          },
          menuItems: menuItems,
          menuSubItems: menuSubItems,
          logs: logs
        }
      };

    default:
      return state;
  }
};
