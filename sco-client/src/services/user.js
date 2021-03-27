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
  data = {
    page: 1, // halaman pada tabel
    perPage: 25, // jumah baris perhamalan pada tabel
    sort: 'profile_name', // sortir tabel
    orderBy: 'asc', // urutan pada tabel secara ascending atau descending
    search: '' // pencarian pada tabel
  }
) => dispatch => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: '/users',
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

        // Set redux users
        dispatch({
          type: 'SET_USERS',
          value: {
            data: res.data.users.data,
            currentPage: res.data.users.current_page,
            perPage: res.data.users.per_page,
            totalData: res.data.users.total,
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
        } else {
          dispatch({
            type: 'SET_TOAST',
            value: {
              show: true,
              type: 'error',
              message: `An error occurred upon request`
            }
          });
        }
      });
  });
};

/**
 * Fungsi api untuk mengambil semua menu untuk halaman user
 */
export const apiGetDataUserCreate = () => dispatch => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: '/users/create'
    })
      .then(res => {
        resolve(res);

        // Destructuring response
        const { menu_items, menu_sub_items } = res.data.menus;

        // Set redux menu items
        dispatch({
          type: 'SET_MENU_ITEMS',
          value: {
            data: menu_items.result.data,
            currentPage: menu_items.result.current_page,
            perPage: menu_items.result.per_page,
            totalData: menu_items.result.total,
            sort: menu_items.sort,
            orderBy: menu_items.order_by,
            search: menu_items.search
          }
        });

        // Set redux menu sub items
        dispatch({
          type: 'SET_MENU_SUB_ITEMS',
          value: {
            data: menu_sub_items.result.data,
            currentPage: menu_sub_items.result.current_page,
            perPage: menu_sub_items.result.per_page,
            totalData: menu_sub_items.result.total,
            sort: menu_sub_items.sort,
            orderBy: menu_sub_items.order_by,
            search: menu_sub_items.search
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
 * Fungsi api untuk menambahkan user baru
 * @param {array} formData
 */
export const apiCreateUserAccountProfile = formData => dispatch => {
  return new Promise((resolve, reject) => {
    api({
      method: 'POST',
      url: '/users',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => {
        resolve(res);

        // Tampilkan toast
        dispatch({
          type: 'SET_TOAST',
          value: {
            show: true,
            type: 'success',
            message: res.data.message
          }
        });

        // Set redux users
        const { result } = res.data;
        dispatch({
          type: 'SET_USERS',
          value: {
            data: result.users.data,
            currentPage: result.users.current_page,
            perPage: result.users.per_page,
            totalData: result.users.total,
            sort: result.sort,
            orderBy: result.order_by,
            search: result.search
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
 * Fungsi api untuk menambahkan akses menu pada user
 * @param {array} menuItems
 * @param {array} menuSubItems
 */
export const apiCreateUserMenuAccess = (
  menuItems,
  menuSubItems
) => dispatch => {
  return new Promise((resolve, reject) => {
    api({
      method: 'POST',
      url: `/users/menu-access`,
      data: {
        user_menu_item: menuItems,
        user_menu_sub_item: menuSubItems
      }
    })
      .then(res => {
        resolve(res);

        // Tampilkan toast
        dispatch({
          type: 'SET_TOAST',
          value: {
            show: true,
            type: 'success',
            message: res.data.message
          }
        });

        // Set redux users
        const { result } = res.data;
        dispatch({
          type: 'SET_USERS',
          value: {
            data: result.users.data,
            currentPage: result.users.current_page,
            perPage: result.users.per_page,
            totalData: result.users.total,
            sort: result.sort,
            orderBy: result.order_by,
            search: result.search
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
export const apiDeleteUser = id => dispatch => {
  return new Promise((resolve, reject) => {
    api({
      method: 'DELETE',
      url: `/users/${id}`
    })
      .then(res => {
        resolve(res);
        const { result } = res.data;

        // Set redux users
        dispatch({
          type: 'SET_USERS',
          value: {
            data: result.users.data,
            currentPage: result.users.current_page,
            perPage: result.users.per_page,
            totalData: result.users.total,
            sort: result.sort,
            orderBy: result.order_by,
            search: result.search
          }
        });

        // Tampilkan toast
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
 * Fungsi api untuk merubah password user
 * @param {string} id
 * @param {obj} data
 */
export const apiUpdateUserPassword = (id, data) => dispatch => {
  return new Promise((resolve, reject) => {
    api({
      method: 'PATCH',
      data: data,
      url: `/users/${id}/password`
    })
      .then(res => {
        resolve(res);
        const { result } = res.data;

        // Set redux users
        dispatch({
          type: 'SET_USERS',
          value: {
            data: result.users.data,
            currentPage: result.users.current_page,
            perPage: result.users.per_page,
            totalData: result.users.total,
            sort: result.sort,
            orderBy: result.order_by,
            search: result.search
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
 * Fungsi api untuk mengambil data detail user
 * @param {string} id
 */
export const apiGetUserDetail = id => dispatch => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: `/users/${id}`
    })
      .then(res => {
        resolve(res);

        // Set redux user detail
        const { account, profile, menu_items, menu_sub_items, logs } = res.data;
        dispatch({
          type: 'SET_USER_DETAIL',
          value: {
            account: {
              id: account.id,
              username: account.username,
              isActive: account.is_active,
              createdAt: account.created_at,
              updatedAt: account.updated_at
            },
            profile: {
              avatar: profile.profile_avatar,
              name: profile.profile_name,
              division: profile.profile_division,
              email: profile.profile_email,
              phone: profile.profile_phone,
              address: profile.profile_address,
              createdAt: profile.created_at,
              updatedAt: profile.updated_at
            },
            menuItems: menu_items,
            menuSubItems: menu_sub_items,
            logs: logs
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
 * Fungsi api untuk menghapus log dari user
 * @param {String} id
 */
export const apiClearUserLogs = id => dispatch => {
  return new Promise((resolve, reject) => {
    api({
      method: 'delete',
      url: `users/${id}/logs`
    })
      .then(res => {
        resolve(res);
        const { result } = res.data;

        // Set redux users
        dispatch({
          type: 'SET_USERS',
          value: {
            data: result.users.data,
            currentPage: result.users.current_page,
            perPage: result.users.per_page,
            totalData: result.users.total,
            sort: result.sort,
            orderBy: result.order_by,
            search: result.search
          }
        });

        // Tampilkan toast
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
 * -----------------------------------------------
 * -----------------------------------------------
 *
 * Fungsi yang belum di cek
 *
 * -----------------------------------------------
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
