const initialState = {
  itemGroups: {
    data: null,
    totalData: 0,
    currentPage: 1,
    perPage: 25,
    sort: null,
    orderBy: 'asc',
    search: ''
  }
};

export const itemGroupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ITEM_GROUPS':
      return {
        ...state,
        itemGroups: {
          data: action.value.data,
          currentPage: action.value.currentPage,
          perPage: action.value.perPage,
          sort: action.value.sort,
          orderBy: action.value.orderBy,
          search: action.value.search,
          totalData: action.value.totalData
        }
      };

    default:
      return state;
  }
};
