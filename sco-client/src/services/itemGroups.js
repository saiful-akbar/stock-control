import { api } from './api';

/**
 * Fungsi api untuk mengambil data item groups
 *
 * @param {integer} page
 * @param {integer} per_page
 * @param {string} sort
 * @param {string} order_by
 * @param {string} search
 */
export const apiGetItemGroups = (
  data = {
    page: 1, // halaman pada tabel
    perPage: 25, // jumah baris perhamalan pada tabel
    sort: 'item_g_code', // sortir tabel
    orderBy: 'asc', // urutan pada tabel secara ascending atau descending
    search: '' // pencarian pada tabel
  }
) => dispatch => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: '/item-groups',
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
          type: 'SET_ITEM_GROUPS',
          value: {
            data: res.data.item_groups.data,
            currentPage: res.data.item_groups.current_page,
            perPage: res.data.item_groups.per_page,
            totalData: res.data.item_groups.total,
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
 * Fungsi api untuk menambahkan data baru
 *
 * @param {obj} data
 */
export const apiAddItemGroup = data => dispatch => {
  return new Promise((resolve, reject) => {
    api({
      method: 'POST',
      url: '/item-groups',
      data: data
    })
      .then(res => {
        const { result } = res.data;
        resolve(res);
        dispatch({
          type: 'SET_ITEM_GROUPS',
          value: {
            data: result.item_groups.data,
            currentPage: result.item_groups.current_page,
            perPage: result.item_groups.per_page,
            totalData: result.item_groups.total,
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
 * Fungsi api untuk merubah item group
 *
 * @param {obj} data
 */
export const apiUpdateItemGroup = (id, data) => dispatch => {
  return new Promise((resolve, reject) => {
    api({
      method: 'PATCH',
      url: `/item-groups/${id}`,
      data: data
    })
      .then(res => {
        const { result } = res.data;
        resolve(res);
        dispatch({
          type: 'SET_ITEM_GROUPS',
          value: {
            data: result.item_groups.data,
            currentPage: result.item_groups.current_page,
            perPage: result.item_groups.per_page,
            totalData: result.item_groups.total,
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
          if (err.response) {
            reject(err.response);
          } else if (err.request) {
            reject(err.request);
          }
        }
      });
  });
};

/**
 * Fungsi api untuk menghapus item group
 *
 * @param {obj} data
 */
export const apiDeleteItemGroup = selected => dispatch => {
  return new Promise((resolve, reject) => {
    api({
      method: 'DELETE',
      url: `/item-groups`,
      data: selected
    })
      .then(res => {
        const { result } = res.data;
        resolve(res);
        dispatch({
          type: 'SET_ITEM_GROUPS',
          value: {
            data: result.item_groups.data,
            currentPage: result.item_groups.current_page,
            perPage: result.item_groups.per_page,
            totalData: result.item_groups.total,
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
 * Fungsi api untuk export excel item group
 *
 * @param {string} search
 */
export const apiExportItemGroup = (search = '') => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: `/item-groups/export`,
      responseType: 'blob', //important
      params: {
        search: search
      }
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

/**
 * Fungsi api untuk import excel item group
 *
 * @param {string} search
 */
export const apiImportItemGroup = file => dispatch => {
  return new Promise((resolve, reject) => {
    api({
      method: 'POST',
      url: `/item-groups/import`,
      data: file,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => {
        const { result } = res.data;
        resolve(res);
        dispatch({
          type: 'SET_ITEM_GROUPS',
          value: {
            data: result.item_groups.data,
            currentPage: result.item_groups.current_page,
            perPage: result.item_groups.per_page,
            totalData: result.item_groups.total,
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
