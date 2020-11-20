import api from './api';

function csrf() {
  return api({
    method: 'GET',
    url: '/csrf-cookie'
  });
}
export default csrf;
