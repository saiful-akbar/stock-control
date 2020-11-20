import Axios from 'axios';
// import {
//   setupCache
// } from 'axios-cache-adapter';
import Cookies from 'universal-cookie';

const cookie = new Cookies();

// const cache = setupCache({
//   maxAge: 24 * 60 * 60 * 1000
// });

const api = Axios.create({
  // adapter: cache.adapter,
  baseURL: 'http://localhost:8000/api',
  headers: {
    Authorization: `Bearer ${cookie.get('auth_token')}`
  },
});

api.defaults.withCredentials = true;

export default api;
