import {
  api
} from './api';


/**
 * Fungsi api untuk mengambil data item groups
 * 
 * @param {integer} page 
 * @param {integer} per_page 
 * @param {string} sort 
 * @param {string} order_by 
 * @param {string} search 
 */
export const apiGetItemGroups = (
  page = 1,
  per_page = 25,
  sort = 'item_g_code',
  order_by = 'asc',
  search = '',
) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: '/master/item-groups',
      params: {
        page: page,
        per_page: per_page,
        sort: sort,
        order_by: order_by,
        search: search,
      }
    }).then(res => resolve(res)).catch(err => reject(err.response));
  });
}