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
  data = {
    page: 1,
    perPage: 25,
    sort: 'document_title',
    orderBy: 'asc',
    search: ''
  }
) => dispatch => {
  return new Promise((resolve, reject) => {
    api({
      method: 'get',
      url: '/documents',
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
          type: 'SET_DOCUMENTS',
          value: {
            data: res.data.documents.data,
            totalData: res.data.documents.total,
            currentPage: res.data.documents.current_page,
            perPage: res.data.documents.per_page,
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
 * Fungsi untuk menambahkan data ke tadabase dengan api
 *
 * @param {object} data
 */
export const apiAddDocument = data => dispatch => {
  return new Promise((resolve, reject) => {
    api({
      method: 'post',
      url: '/documents',
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => {
        const { result } = res.data;
        resolve(res);
        dispatch({
          type: 'SET_DOCUMENTS',
          value: {
            data: result.documents.data,
            currentPage: result.documents.current_page,
            perPage: result.documents.per_page,
            totalData: result.documents.total,
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
 * Fungsi untuk merubah data ke tadabase dengan api
 *
 * @param {object} data
 */
export const apiUpdateDocument = (id, data) => dispatch => {
  return new Promise((resolve, reject) => {
    api({
      method: 'post',
      url: `/documents/${id}`,
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => {
        const { result } = res.data;
        resolve(res);
        dispatch({
          type: 'SET_DOCUMENTS',
          value: {
            data: result.documents.data,
            currentPage: result.documents.current_page,
            perPage: result.documents.per_page,
            totalData: result.documents.total,
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
 * Fungsi untuk menghapus data di tadabase dengan api
 *
 * @param {object} data
 */
export const apiDeleteDocument = data => dispatch => {
  return new Promise((resolve, reject) => {
    api({
      method: 'delete',
      url: `/documents`,
      data: data
    })
      .then(res => {
        const { result } = res.data;
        resolve(res);
        dispatch({
          type: 'SET_DOCUMENTS',
          value: {
            data: result.documents.data,
            currentPage: result.documents.current_page,
            perPage: result.documents.per_page,
            totalData: result.documents.total,
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
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        if (err.response) reject(err.response);
      });
  });
};
