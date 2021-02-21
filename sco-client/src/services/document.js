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

/**
 * Fungsi untuk merubah data ke tadabase dengan api
 *
 * @param {object} data
 */
export const apiUpdateDocument = (id, data) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'post',
      url: `/documents/${id}`,
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

/**
 * Fungsi untuk menghapus data di tadabase dengan api
 *
 * @param {object} data
 */
export const apiDeleteDocument = data => {
  return new Promise((resolve, reject) => {
    api({
      method: 'delete',
      url: `/documents`,
      data: data
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

/**
 * Fungsi download file document
 *
 * @param {string} search
 */
export const apiDownloadDocument = id => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: `/documents/${id}/download`,
      responseType: 'blob' //important
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};
