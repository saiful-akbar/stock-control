const initialState = {
  documents: {
    data: null,
    totalData: 0,
    currentPage: 1,
    perPage: 25,
    sort: null,
    orderBy: 'asc',
    search: ''
  }
};

export const documentsReducer = (state = initialState, actions) => {
  const { type, value } = actions;

  switch (type) {
    case 'SET_DOCUMENTS':
      return {
        ...state,
        documents: {
          data: value.data,
          currentPage: value.currentPage,
          perPage: value.perPage,
          sort: value.sort,
          orderBy: value.orderBy,
          search: value.search,
          totalData: value.totalData
        }
      };

    default:
      return state;
  }
};
