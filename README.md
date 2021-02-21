<p align="center">
  <img src="https://raw.githubusercontent.com/saiful-akbar/stock-control/main/sco-client/public/static/images/logo/logo-dark-1.png" width="200">
</p>

# Stock Control

**Aplikasi Stock Control** merupakan aplikasi berbasis web dengan proses pengembangannya menggunakan framework laravel dan library react js. Aplikasi ini dibuat untuk mempermudah dalam mengontrol serta mengelola data stok barang.

## Teknologi Yang Digunakan

#### Backend

- **[Laravel V8](https://laravel.com/docs/8.x)**
- **[Laravel Sanctum](https://laravel.com/docs/8.x/sanctum)**
- **[Laravel Excel](https://laravel-excel.com/)**

#### Frontend

- **[React js](https://reactjs.org/)**
- **[Material-ui](https://material-ui.com/)**

## Fitur

- Pengaturan
  - Tema
    - Dapat dirubah menjadi mode gelap, terang atau sesuai tema os
- Otentikasi pengguna
- Document
  - Berisi format template file excel untuk diimport dan dokumen lainnya
  - Menambahkan document baru
  - Memperbarui
  - Menghapus
- Manajemen menu
  - Menambahkan data menu baru
  - Merubah data menu
  - Menghapus data menu
- Pengguna / User
  - Menambahkan pengguna baru
  - Menggapus semua token pengguna
  - Memperbarui akses menu pada setiap pengguna
    - Menambah akses menu pada pengguna
    - menghapus akses menu pada pengguna
  - Memperbarui password pengguna
  - Menghapus permanen data pengguna
  - Memperbarui data profil setiap pengguna
  - Melihat detail profil pengguna
- Data Master
  - Items
    - Item Groups
      - Melihat data item groups,
      - Membuat data baru
      - Memperbarui,
      - Menghapus,
      - Import dari file excel,
      - Export kedalam bentuk file excel
    - Item Sub Groups
      - Melihat data item sub groups,
      - Membuat data baru
      - Memperbarui,
      - Menghapus,
      - Import dari file excel,
      - Export kedalam bentuk file excel

## Instalasi

- Buka terminal atau git bash jika sudah menginstal git pada repository/folder poject stock-control.
- Ketikan `cd sco-client` untuk masuk ke direktori sco-client yang merupakan folder frontend.
- Ketikan `npm install` jika menggunakan npm, atau `yarn` jika menggunakan yarn. tunggu hingga proses instalasi selesai.
- Ketikan `cd ../sco-server` untuk masuk ke folder sco-server yang merupahan folder backend.
- Ketikan `composer install`. tunggu hingga proses instalasi selesai.
- ketikan `cp .env.example .env` untuk menyalin file `.env.example` menjadi file `.env`.
- Ketikan `php artisan key:generate` untuk men-generate unique key pada file .env.
- Buat databse pada mysql atau dari phpMyAdmin.
- Buka file `.env` dengan text editor cari `DB_DATABASE=DB_NAME` lalu ubah value-nya dengan nama database yang telah dibuat, `contoh: DB_DATABASE=db_stock_control`. lalu simpan.
- Kembali ke terminal atau git bash dan ketikan `php artisan migrate:fresh --seed` untuk migrasi table beserta seeder-nya pada database.
- Ketikan `php artisan serve` untuk menjalankan local server laravel.
- Buka terminal atau git bash pada jendela baru lalu ketikan `npm start` jika menggukan npm atau `yarn start` jika menggukan yarn untuk menjalankan local server pada react js.
