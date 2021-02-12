import { api } from './api';

/**
 * Fungsi mengambil data documents dari api
 *
 * @param {number} page
 * @param {number} per_page
 * @param {string} sort
 * @param {string} order_by
 * @param {string} search
 */
export const apiGetDocuments = (
  page = 1,
  per_page = 25,
  sort = 'document_title',
  order_by = 'asc',
  search = ''
) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'get',
      url: '/documents',
      params: {
        page: page,
        per_page: per_page,
        sort: sort,
        order_by: order_by,
        search: search
      }
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

/**
 * Fungsi untuk menambahkan data ke tadabase dengan api
 *
 * @param {object} data
 */
export const apiAddDocument = data => {
  return new Promise((resolve, reject) => {
    api({
      method: 'post',
      url: '/documents',
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};
