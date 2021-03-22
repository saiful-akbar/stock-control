import { api } from './api';

/**
 * Mengambil semua data menu sub item
 * @param {Halaman pada tabel} page
 * @param {Jumlah baris perhalaman} perPage
 * @param {Kata yang inding dicari atau pencarian pada tabel} query
 * @param {field tabel yang ingin si sortir} sort
 * @param {Urutan data pada tabel "asc/desc"} orderBy
 */
export const apiGetAllMenuSubItem = (
  data = {
    page: 1,
    perPage: 25,
    sort: 'menu_i_title',
    orderBy: 'asc',
    search: ''
  }
) => dispatch => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: '/submenu',
      params: {
        page: data.page,
        per_page: data.perPage,
        sort: data.sort,
        order_by: data.orderBy,
        search: data.search
      }
    })
      .then(res => {
        resolve(res);
        dispatch({
          type: 'SET_MENU_SUB_ITEMS',
          value: {
            data: res.data.menu_sub_items.data,
            totalData: res.data.menu_sub_items.total,
            currentPage: res.data.menu_sub_items.current_page,
            perPage: res.data.menu_sub_items.per_page,
            sort: res.data.sort,
            orderBy: res.data.order_by,
            search: res.data.search
          }
        });
      })
      .catch(err => {
        if (err.response) {
          reject(err.response);
          dispatch({
            type: 'SET_TOAST',
            value: {
              show: true,
              type: 'error',
              message: `(#${err.response.status} ${err.response.data.message})`
            }
          });
        }
      });
  });
};

/**
 * Menambahkan menu sub item baru
 * @param {data form baru yang akan ditambahkan} data
 */
export const apiCreateMenuSubItem = data => dispatch => {
  return new Promise((resolve, reject) => {
    api({
      method: 'POST',
      url: '/submenu',
      data: data
    })
      .then(res => {
        const { result } = res.data;
        resolve(res);
        dispatch({
          type: 'SET_MENU_SUB_ITEMS',
          value: {
            data: result.menu_sub_items.data,
            currentPage: result.menu_sub_items.current_page,
            perPage: result.menu_sub_items.per_page,
            totalData: result.menu_sub_items.total,
            sort: result.sort,
            orderBy: result.order_by,
            search: result.search
          }
        });
        dispatch({
          type: 'SET_TOAST',
          value: {
            show: true,
            type: 'success',
            message: res.data.message
          }
        });
      })
      .catch(err => {
        if (err.response) {
          reject(err.response);
        } else if (err.request) {
          reject(err.request);
        }
      });
  });
};

/**
 * Hapus menu sub item
 * @param {nilai sebagai index data yang akan dihapus} id
 */
export const apiDeleteMenuSubItem = id => dispatch => {
  return new Promise((resolve, reject) => {
    api({
      method: 'DELETE',
      url: `/submenu/${id}`
    })
      .then(res => {
        const { result } = res.data;
        resolve(res);
        dispatch({
          type: 'SET_MENU_SUB_ITEMS',
          value: {
            data: result.menu_sub_items.data,
            currentPage: result.menu_sub_items.current_page,
            perPage: result.menu_sub_items.per_page,
            totalData: result.menu_sub_items.total,
            sort: result.sort,
            orderBy: result.order_by,
            search: result.search
          }
        });
        dispatch({
          type: 'SET_TOAST',
          value: {
            show: true,
            type: 'success',
            message: res.data.message
          }
        });
      })
      .catch(err => {
        if (err.response) {
          reject(err.response);
          dispatch({
            type: 'SET_TOAST',
            value: {
              show: true,
              type: 'error',
              message: `(#${err.response.status} ${err.response.data.message})`
            }
          });
        }
      });
  });
};

/**
 * Ubah menu sub item
 * @param {nilai indes data yang akan diubah} id
 * @param {data baru dari form untuk merubah menu sub item} data
 */
export const apiUpdateMenuSubItem = (id, data) => dispatch => {
  return new Promise((resolve, reject) => {
    api({
      method: 'PUT',
      url: `/submenu/${id}`,
      data: data
    })
      .then(res => {
        const { result } = res.data;
        resolve(res);
        dispatch({
          type: 'SET_MENU_SUB_ITEMS',
          value: {
            data: result.menu_sub_items.data,
            currentPage: result.menu_sub_items.current_page,
            perPage: result.menu_sub_items.per_page,
            totalData: result.menu_sub_items.total,
            sort: result.sort,
            orderBy: result.order_by,
            search: result.search
          }
        });
        dispatch({
          type: 'SET_TOAST',
          value: {
            show: true,
            type: 'success',
            message: res.data.message
          }
        });
      })
      .catch(err => {
        if (err.response) {
          reject(err.response);
        } else if (err.request) {
          reject(err.request);
        }
      });
  });
};
