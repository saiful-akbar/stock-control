import api from './api';

// Fungsi api untuk mengambil semua data menu items
export const apiGetAllMenuItem = (page = 1, perPage = 10, query = '', sort = 'id', orderBy = 'asc') => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: '/menu/menu-item',
      params: {
        page: page,
        per_page: perPage,
        search: query,
        sort: sort,
        order_by: orderBy,
      }
    }).then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err.response);
    });
  });
};


// Fungsi api untuk membuat data menu item baru
export const apiCreateMenuItem = (data) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'POST',
      url: '/menu/menu-item',
      data: data
    }).then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err.response);
    });
  });
};


// Fungsi api untuk menghapus menu item
export const apiDeleteMenuItem = (id) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'DELETE',
      url: `/menu/menu-item/${id}`,
    }).then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err.response);
    });
  });
};


// Fungsi api untuk merubah menu item
export const apiUpdateMenuItem = (id, data) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'PUT',
      url: `/menu/menu-item/${id}`,
      data: data,
    }).then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err.response);
    });
  });
};
