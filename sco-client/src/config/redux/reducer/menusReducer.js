const initialState = {
  menuItems: {
    data: null,
    totalData: 0,
    currentPage: 1,
    perPage: 25,
    sort: null,
    orderBy: 'asc',
    search: ''
  },
  menuSubItems: {
    data: null,
    totalData: 0,
    currentPage: 1,
    perPage: 25,
    sort: null,
    orderBy: 'asc',
    search: ''
  }
};

export const menusReducer = (state = initialState, action) => {
  const { type, value } = action;

  switch (type) {
    case 'SET_MENU_ITEMS':
      return {
        ...state,
        menuItems: {
          data: value.data,
          totalData: value.totalData,
          currentPage: value.currentPage,
          perPage: value.perPage,
          sort: value.sort,
          orderBy: value.orderBy,
          search: value.search
        }
      };

    case 'SET_MENU_SUB_ITEMS':
      return {
        ...state,
        menuSubItems: {
          data: value.data,
          totalData: value.totalData,
          currentPage: value.currentPage,
          perPage: value.perPage,
          sort: value.sort,
          orderBy: value.orderBy,
          search: value.search
        }
      };

    default:
      return state;
  }
};
