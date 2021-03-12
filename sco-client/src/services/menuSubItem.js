import { api } from './api';

/**
 * Mengambil semua data menu sub item
 * @param {Halaman pada tabel} page
 * @param {Jumlah baris perhalaman} perPage
 * @param {Kata yang inding dicari atau pencarian pada tabel} query
 * @param {field tabel yang ingin si sortir} sort
 * @param {Urutan data pada tabel "asc/desc"} orderBy
 */
export const apiGetAllMenuSubItem = (
  page = 1,
  per_page = 10,
  search = '',
  sort = 'id',
  order_by = 'asc'
) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'GET',
      url: '/submenu',
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
 * Menambahkan menu sub item baru
 * @param {data form baru yang akan ditambahkan} data
 */
export const apiCreateMenuSubItem = data => {
  return new Promise((resolve, reject) => {
    api({
      method: 'POST',
      url: '/submenu',
      data: data
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

/**
 * Hapus menu sub item
 * @param {nilai sebagai index data yang akan dihapus} id
 */
export const apiDeleteMenuSubItem = id => {
  return new Promise((resolve, reject) => {
    api({
      method: 'DELETE',
      url: `/submenu/${id}`
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};

/**
 * Ubah menu sub item
 * @param {nilai indes data yang akan diubah} id
 * @param {data baru dari form untuk merubah menu sub item} data
 */
export const apiUpdateMenuSubItem = (id, data) => {
  return new Promise((resolve, reject) => {
    api({
      method: 'PUT',
      url: `/submenu/${id}`,
      data: data
    })
      .then(res => resolve(res))
      .catch(err => reject(err.response));
  });
};
