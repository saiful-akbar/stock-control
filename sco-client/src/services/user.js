import { api } from './api';

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
  per_page = 10,
  search = '',
  sort = 'id',
  order_by = 'asc'
) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: '/users',
      params: {
        page,
        per_page,
        search,
        sort,
        order_by
      }
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

/**
 * Fungsi api untuk mengambil semua menu untuk halaman user
 */
export const apiGetDataUserCreate = () => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: '/users/create'
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

/**
 * Fungsi api untuk menambahkan user baru
 * @param {array} formData
 */
export const apiCreateUserAccountProfile = formData => {
  return new Promise((resolve, reject) => {
    api({
      method: 'POST',
      url: '/users',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
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
      url: `/users/menu-access`,
      data: {
        user_menu_item: menuItems,
        user_menu_sub_item: menuSubItems
      }
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

/**
 * Fungsi api untuk mereset ulang table personal_access_tokens
 */
export const apiTruncateTokens = () => {
  return new Promise((resolve, reject) => {
    api({
      method: 'DELETE',
      url: '/users/truncate-tokens'
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

/**
 * Fungsi api untuk menghapus user
 * @param {string} id
 */
export const apiDeleteUser = id => {
  return new Promise((resolve, reject) => {
    api({
      method: 'DELETE',
      url: `/users/${id}`
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
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
      url: `/users/${id}/password`
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

/**
 * Fungsi api untuk mengambil data detail user
 * @param {string} id
 */
export const apiGetUserDetail = id => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: `/users/${id}`
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

/**
 * Fungsi api untuk menghapus log dari user
 * @param {String} id
 */
export const apiClearUserLogs = id => {
  return new Promise((resolve, reject) => {
    api({
      method: 'delete',
      url: `users/${id}/logs`
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

/**
 * -----------------------------------------------
 * Fungsi yang belum di cek
 * -----------------------------------------------
 */

/**
 * Fungsi api untuk mengambil semua data akses menu item pada user yang dipilih
 * @param {string} id
 */
export const apiGetUserMenuItems = id => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: `/users/menu/${id}`
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

/**
 * Fungsi api untuk menambahkan akses menu item pada user
 * @param {String} id
 * @param {Array} data
 */
export const apiAddUserMenuItem = (id, data) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'POST',
      data: data,
      url: `/users/menu/${id}`
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

/**
 * Fungsi api untuk menghapus user menu item
 * @param {string} id
 */
export const apiDeleteUserMenuItem = (id, data) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'DELETE',
      data: data,
      url: `/users/menu/${id}`
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

/**
 * Fungsi api untuk mengambil semua data akses menu sub item pada user yang dipilih
 * @param {string} id
 */
export const apiGetUserMenuSubItems = id => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: `/users/submenu/${id}`
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

/**
 * Fungsi api untuk menambahkan akses menu sub item pada user
 * @param {String} id
 * @param {Array} data
 */
export const apiAddUserMenuSubItem = (id, data) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'POST',
      data: data,
      url: `/users/submenu/${id}`
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

/**
 * Fungsi api untuk menghapus user menu item
 * @param {string} id
 */
export const apiDeleteUserMenuSubItems = (id, data) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'DELETE',
      data: data,
      url: `/users/submenu/${id}`
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

/**
 * Fungsi api untuk mengambil data profile user yang akan diedit
 * @param {string} id
 */
export const apiEditUserProfile = id => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: `/users/${id}/edit`
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

/**
 * Fungsi api untuk update user profile
 * @param {string|id} id
 * @param {obj|request form} data
 */
export const apiUpdateUserProfile = (id, data) => {
  return new Promise((resolve, reject) => {
    api({
      data: data,
      method: 'POST',
      url: `/users/${id}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

/**
 * Fungsi api untuk mengambil data account user yang akan diedit
 * @param {string} id
 */
export const apiEditUserAccount = id => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: `/users/${id}/account`
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

/**
 * Fungsi api untuk update user account
 * @param {string|id} id
 * @param {obj|request form} data
 */
export const apiUpdateUserAccount = (id, data) => {
  return new Promise((resolve, reject) => {
    api({
      data: data,
      method: 'PATCH',
      url: `/users/${id}/account`
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};
