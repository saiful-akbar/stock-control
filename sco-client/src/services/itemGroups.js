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
  page = 1,
  per_page = 25,
  sort = 'item_g_code',
  order_by = 'asc',
  search = ''
) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: '/item-groups',
      params: {
        page,
        per_page,
        sort,
        order_by,
        search
      }
    })
      .then(res => resolve(res))
      .catch(err => {
        reject(err.response);
      });
  });
};

/**
 * Fungsi api untuk menambahkan data baru
 *
 * @param {obj} data
 */
export const apiAddItemGroup = data => {
  return new Promise((resolve, reject) => {
    api({
      method: 'POST',
      url: '/item-groups',
      data: data
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

/**
 * Fungsi api untuk merubah item group
 *
 * @param {obj} data
 */
export const apiUpdateItemGroup = (id, data) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'PATCH',
      url: `/item-groups/${id}`,
      data: data
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

/**
 * Fungsi api untuk menghapus item group
 *
 * @param {obj} data
 */
export const apiDeleteItemGroup = data => {
  return new Promise((resolve, reject) => {
    api({
      method: 'DELETE',
      url: `/item-groups`,
      data: data
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
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
export const apiImportItemGroup = file => {
  return new Promise((resolve, reject) => {
    api({
      method: 'POST',
      url: `/item-groups/import`,
      data: file,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};
