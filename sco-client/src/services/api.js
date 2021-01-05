import Axios from 'axios';
import {
  setupCache
} from 'axios-cache-adapter';
import Cookies from 'universal-cookie';

/**
 * cookie
 */
const cookie = new Cookies();

/**
 * Http cache
 */
const cache = setupCache({
  maxAge: 15 * 60 * 1000
});


/**
 * Inisialisasi default untuk request api
 */
const api = Axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    Authorization: `Bearer ${cookie.get('auth_token')}`
  },
});

api.defaults.withCredentials = true;

export {
  cache,
  api,
};
