import { api, cache } from './api';
import { reduxAction } from 'src/config/redux/state';
import csrf from './csrf';

/**
 * Fungsi untuk login user
 * @param {username & password} data
 */
export const login = data => dispatch => {
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
            dispatch({
              type: reduxAction.userLogin,
              value: res.data
            });
          })
          .catch(err => {
            reject(err.response);
          });
      })
      .catch(csrfErr => {
        reject(csrfErr.response);
      });
  });
};

/**
 * ambil data user yang sedang login
 */
export const userIsLogin = () => dispatch => {
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
              type: reduxAction.userLogin,
              value: res.data
            });
            dispatch({
              type: reduxAction.loading,
              value: false
            });
          })
          .catch(err => {
            reject(err.response);
          });
      })
      .catch(csrfErr => {
        reject(csrfErr.response);
      });
  });
};

/**
 * logout
 */
export const logout = () => {
  return new Promise((resolve, reject) => {
    api({
      method: 'get',
      url: '/logout'
    })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err.response);
      });
  });
};
