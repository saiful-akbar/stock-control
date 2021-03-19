<p align="center">
  <img src="https://github.com/saiful-akbar/stock-control/blob/main/sco-client/src/assets/images/logo/logo-light.png?raw=true" alt="SCO Logo" width="200">
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

- **Otentikasi pengguna**
- **Panel Setting**
  - Dapat mengatur tema manjadi mode terang dan gelap
- **Halaman Document**
  - Dapat melihat dan mendownload file document
  - Membuat/menambahkan, merubah dan menghapus data dokumen
- **Halaman Menu manajemen**
  - Dapat melihat, menambahkan, merubah serta menghapus data menu
- **Halaman Pengguna/Users**
  - Menambahkan pengguna baru
  - Menggapus semua token pengguna
  - Memperbarui password pengguna
  - Menghapus data pengguna
  - Menghapus log pengguna
  - Memperbarui data setiap pengguna
  - Melihat detail pengguna  
 - **Halaman Items**
   - **Tab Item Groups**
     - Dapat melihat, membuat/manambahkan, memperbarui serta menghapus data item groups
     - Import dari file excel,
     - Export menjadi file excel

## Instalasi

- Buka terminal atau git bash jika sudah menginstal git pada repository/folder poject stock-control.
- Ketikan `cd sco-client` untuk masuk ke direktori sco-client yang merupakan folder frontend.
- Ketikan `npm install` jika menggunakan npm, atau `yarn` jika menggunakan yarn. tunggu hingga proses instalasi selesai.
- ketikan `npm run start` jika menggukan npm atau `yarn start` jika menggukan yarn untuk menjalankan local server pada react js.
- Buka terminal atau git bash pada jendela baru dan arahkan pada folder `stock-control/sco-server` untuk masuk ke folder sco-server yang merupahan folder backend.
- Ketikan `composer install`. tunggu hingga proses instalasi selesai.
- ketikan `cp .env.example .env` untuk menyalin file `.env.example` menjadi file `.env`.
- Ketikan `php artisan key:generate` untuk men-generate unique key pada file .env.
- Buat databse pada mysql atau dari phpMyAdmin.
- Buka file `.env` dengan text editor cari `DB_DATABASE=DB_NAME` lalu ubah value-nya dengan nama database yang telah dibuat, `contoh: DB_DATABASE=db_stock_control`. lalu simpan.
- Kembali ke terminal atau git bash dan ketikan `php artisan migrate:fresh --seed` untuk migrasi table beserta seeder-nya pada database.
- Ketikan `php artisan serve` untuk menjalankan local server laravel.
