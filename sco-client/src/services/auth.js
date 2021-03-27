import { api, cache } from './api';
import csrf from './csrf';

/**
 * Fungsi untuk login user
 * @param {username & password} data
 */
export const apiLogin = data => dispatch => {
  return new Promise((resolve, reject) => {
    csrf()
      .then(() => {
        api({
          method: 'post',
          url: '/login',
          data: data
        })
          .then(res => {
            resolve(res);
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
      })
      .catch(errorCsrf => {
        if (errorCsrf.response) {
          reject(errorCsrf.response);
        } else if (errorCsrf.request) {
          reject(errorCsrf.request);
        }
      });
  });
};

/**
 * ambil data user yang sedang login
 */
export const apiGetDataUserLogin = () => dispatch => {
  return new Promise((resolve, reject) => {
    csrf()
      .then(() => {
        api({
          method: 'get',
          url: '/login/user',
          adapter: cache.adapter
        })
          .then(res => {
            resolve(res);
            dispatch({
              type: 'SET_USER_LOGIN',
              value: {
                account: res.data.data,
                profile: res.data.profile,
                menuItems: res.data.menu_items,
                menuSubItems: res.data.menu_sub_items
              }
            });
          })
          .catch(err => {
            if (err.response) {
              reject(err.response);
            } else if (err.request) {
              reject(err.request);
            }
          });
      })
      .catch(errorCsrf => {
        if (errorCsrf.response) {
          reject(errorCsrf.response);
        } else if (errorCsrf.request) {
          reject(errorCsrf.request);
        }
      });
  });
};

/**
 * logout
 */
export const apiLogout = () => {
  return new Promise((resolve, reject) => {
    api({
      method: 'get',
      url: '/logout'
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};
