import { api } from './api';

// Fungsi api untuk mengambil semua data menu items
export const apiGetAllMenuItem = (
  page = 1,
  perpage = 10,
  search = '',
  sort = 'id',
  orderby = 'asc'
) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: '/menu',
      params: {
        page: page,
        perpage: perpage,
        sort: sort,
        orderby: orderby,
        search: search
      }
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

// Fungsi api untuk membuat data menu item baru
export const apiCreateMenuItem = data => {
  return new Promise((resolve, reject) => {
    api({
      method: 'POST',
      url: '/menu',
      data: data
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

// Fungsi api untuk menghapus menu item
export const apiDeleteMenuItem = id => {
  return new Promise((resolve, reject) => {
    api({
      method: 'DELETE',
      url: `/menu/${id}`
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

// Fungsi api untuk merubah menu item
export const apiUpdateMenuItem = (id, data) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'PUT',
      url: `/menu/${id}`,
      data: data
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};
