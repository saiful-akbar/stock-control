import { api } from './api';

/**
 * Fungsi api untuk mengambil semua data menu items
 *
 * @param {Object} data
 */
export const apiGetAllMenuItem = (
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
      url: '/menu',
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
          type: 'SET_MENU_ITEMS',
          value: {
            data: res.data.menu_items.data,
            totalData: res.data.menu_items.total,
            currentPage: res.data.menu_items.current_page,
            perPage: res.data.menu_items.per_page,
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
 * Fungsi api untuk membuat data menu item baru
 *
 * @param {Object} data
 */
export const apiCreateMenuItem = data => dispatch => {
  return new Promise((resolve, reject) => {
    api({
      method: 'POST',
      url: '/menu',
      data: data
    })
      .then(res => {
        const { result } = res.data;
        resolve(res);
        dispatch({
          type: 'SET_MENU_ITEMS',
          value: {
            data: result.menu_items.data,
            currentPage: result.menu_items.current_page,
            perPage: result.menu_items.per_page,
            totalData: result.menu_items.total,
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
        if (err.response) reject(err.response);
      });
  });
};

/**
 * Fungsi api untuk menghapus data menu item
 *
 * @param {String} id
 */
export const apiDeleteMenuItem = id => dispatch => {
  return new Promise((resolve, reject) => {
    api({
      method: 'DELETE',
      url: `/menu/${id}`
    })
      .then(res => {
        const { result } = res.data;
        resolve(res);
        dispatch({
          type: 'SET_MENU_ITEMS',
          value: {
            data: result.menu_items.data,
            currentPage: result.menu_items.current_page,
            perPage: result.menu_items.per_page,
            totalData: result.menu_items.total,
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
 * Fungsi api untuk merubah data menu item
 *
 * @param {String} id
 * @param {Object} data
 */
export const apiUpdateMenuItem = (id, data) => dispatch => {
  return new Promise((resolve, reject) => {
    api({
      method: 'PUT',
      url: `/menu/${id}`,
      data: data
    })
      .then(res => {
        const { result } = res.data;
        resolve(res);
        dispatch({
          type: 'SET_MENU_ITEMS',
          value: {
            data: result.menu_items.data,
            currentPage: result.menu_items.current_page,
            perPage: result.menu_items.per_page,
            totalData: result.menu_items.total,
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
        if (err.response) reject(err.response);
      });
  });
};
