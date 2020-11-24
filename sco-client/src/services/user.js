import api from './api';

/**
 * Mengambil semua data user dari api
 * @param {Halaman pada tabel} page 
 * @param {Jumlah baris perhalaman} perPage 
 * @param {Kata yang ingin dicari atau pencarian pada tabel} query 
 * @param {field tabel yang ingin si sortir} sort 
 * @param {Urutan data pada tabel "asc/desc"} orderBy
 */
export const apiGetAllUser = (
  page = 1,
  perPage = 10,
  query = '',
  sort = 'id',
  orderBy = 'asc'
) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: '/user',
      params: {
        page: page,
        per_page: perPage,
        search: query,
        sort: sort,
        order_by: orderBy,
      }
    }).then(res => resolve(res)).catch(err => reject(err.response));
  });
};


// Ambil semua menu unruk halaman user
export const apiGetAllMenus = () => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: '/user/menu',
    }).then(res => resolve(res)).catch(err => reject(err.response));
  });
};


/**
 * Cek form user dengan server
 * @param {value dari form user} data 
 */
export const apiCekUserFrom = (data) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'POST',
      url: '/user/cek/user-form',
      data: data,
    }).then(res => resolve(res)).catch(err => reject(err.response));
  });
};


/**
 * Cek form profile dengan server
 * @param {value dari form profile} data 
 */
export const apiCekProfileFrom = (data) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'POST',
      url: '/user/cek/profile-form',
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => resolve(res)).catch(err => reject(err.response));
  });
};


// Menambahkan user baru
export const apiCreateUser = (formData) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'POST',
      url: '/user',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => resolve(res)).catch(err => reject(err.response));
  });
};


// Menambahkan akses menu pada user
export const apiCreateUserMenuAccess = (menuItems, menuSubItems) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'POST',
      url: `/user/menu-access`,
      data: {
        user_menu_item: menuItems,
        user_menu_sub_item: menuSubItems
      },
    }).then(res => resolve(res)).catch(err => reject(err.response));
  });
};


// Mereset ulang table personal_access_tokens
export const apiTruncateTokens = () => {
  return new Promise((resolve, reject) => {
    api({
      method: 'DELETE',
      url: '/user/truncate-tokens'
    }).then(res => resolve(res)).catch(err => reject(err.response));
  });
};


// Menghapus data user 
export const apiDeleteUser = (id) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'DELETE',
      url: `/user/${id}`
    }).then(res => resolve(res)).catch(err => reject(err.response));
  });
};


// Mengambil data menu berdasarkan user id
export const apiGetUserMenuItems = (id) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: `/user/${id}/menuItems`
    }).then(res => resolve(res)).catch(err => reject(err.response));
  });
}
