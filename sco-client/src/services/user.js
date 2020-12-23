import {
  api,
} from './api';

/**
 * Fungsi api untuk mengambil semua data user dari api
 * @param {int} page 
 * @param {int} perPage 
 * @param {string} query 
 * @param {string} sort 
 * @param {string "asc/desc"} orderBy
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


/**
 * Fungsi api untuk mengambil semua menu untuk halaman user
 */
export const apiGetAllMenus = () => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: '/user/menu',
    }).then(res => resolve(res)).catch(err => reject(err.response));
  });
};


/**
 * Fungsi api untuk cek form user dengan server
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
 * Fungsi api untuk cek form profile dengan server
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


/**
 * Fungsi api untuk menambahkan user baru
 * @param {array} formData 
 */
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


/**
 * Fungsi api untuk menambahkan akses menu pada user
 * @param {array} menuItems 
 * @param {array} menuSubItems 
 */
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


/**
 * Fungsi api untuk mereset ulang table personal_access_tokens
 */
export const apiTruncateTokens = () => {
  return new Promise((resolve, reject) => {
    api({
      method: 'DELETE',
      url: '/user/truncate-tokens'
    }).then(res => resolve(res)).catch(err => reject(err.response));
  });
};


/**
 * Fungsi api untuk menghapus user
 * @param {string} id 
 */
export const apiDeleteUser = (id) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'DELETE',
      url: `/user/${id}`
    }).then(res => resolve(res)).catch(err => reject(err.response));
  });
};


/**
 * Fungsi api untuk mengambil semua data akses menu item pada user yang dipilih
 * @param {string} id 
 */
export const apiGetUserMenuItems = (id) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: `/user/menu-items/${id}`
    }).then(res => resolve(res)).catch(err => reject(err.response));
  });
};


/**
 * Fungsi api untuk menambahkan akses menu item pada user
 * @param {String} uuid 
 * @param {Array} data 
 */
export const apiAddUserMenuItem = (uuid, data) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'POST',
      data: data,
      url: `/user/menu-items/${uuid}`,
    }).then(res => resolve(res)).catch(err => reject(err.response));
  });
};


/**
 * Fungsi api untuk menghapus user menu item
 * @param {string} uuid 
 */
export const apiDeleteUserMenuItem = (id, data) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'DELETE',
      data: data,
      url: `/user/menu-items/${id}`,
    }).then(res => resolve(res)).catch(err => reject(err.response));
  });
};


/**
 * Fungsi api untuk mengambil semua data akses menu sub item pada user yang dipilih
 * @param {string} id 
 */
export const apiGetUserMenuSubItems = (id) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: `/user/menu-sub-items/${id}`
    }).then(res => resolve(res)).catch(err => reject(err.response));
  });
};


/**
 * Fungsi api untuk menambahkan akses menu sub item pada user
 * @param {String} uuid 
 * @param {Array} data 
 */
export const apiAddUserMenuSubItem = (uuid, data) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'POST',
      data: data,
      url: `/user/menu-sub-items/${uuid}`,
    }).then(res => resolve(res)).catch(err => reject(err.response));
  });
};


/**
 * Fungsi api untuk menghapus user menu item
 * @param {string} uuid 
 */
export const apiDeleteUserMenuSubItems = (id, data) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'DELETE',
      data: data,
      url: `/user/menu-sub-items/${id}`,
    }).then(res => resolve(res)).catch(err => reject(err.response));
  });
};


/**
 * Fungsi api untuk merubah password user
 * @param {string} id 
 * @param {obj} data 
 */
export const apiUpdateUserPassword = (id, data) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'PATCH',
      data: data,
      url: `/user/password/${id}`
    }).then(res => resolve(res)).catch(err => reject(err.response));
  });
};


/**
 * Fungsi api untuk mengambil data user yang akan diedit
 * @param {string} id 
 */
export const apiEditUser = (id) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: `/user/${id}/edit`
    }).then(res => resolve(res)).catch(err => reject(err));
  });
};
