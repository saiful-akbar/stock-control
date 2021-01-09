import {
  api,
  cache,
} from './api';

function csrf() {
  return api({
    method: 'GET',
    url: '/csrf-cookie',
    adapter: cache.adapter,
  });
}
export default csrf;
