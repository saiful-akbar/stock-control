<p align="center"><img src="https://raw.githubusercontent.com/saiful-akbar/stock-control/main/sco-client/public/static/images/logo/logo-light-1.png?token=ARIS262XDQ3A7L5GH3UJTQLAC3QI6" width="200"></p>

# Stock Control
Aplikasi web untuk mengontrol data stok barang

## Instalasi
- Buka terminal pada repository poject / folder stock-control.
- Ketikan `cd sco-client` untuk masuk ke direktori sco-client.
- Ketikan `npm install` jika menggunakan npm, atau `yarn` jika menggunakan yarn. tunggu hingga proses instalasi selesai.
- Ketikan `cd ../sco-server` untuk masuk ke folder sco-server.
- Ketikan `composer install`. tunggu hingga proses instalasi selesai.
- ketikan `cp .env.example .env` untuk menyalin file `.env.example` menjadi file `.env`.
- Ketikan `php artisan key:generate` untuk men-generate unique key pada file .env
- Buka file `.env` dengan text editor cari `DB_DATABASE=DB_NAME` lalu ubah value-nya dengan nama database, contoh: `DB_DATABASE=db_stock_control`. lalu simpan.
- Ketikan `php artisan serve` untuk menjalankan server local.

## Teknologi Yang Digunakan
#### Backend
- **[Laravel V8](https://laravel.com/docs/8.x)**
- **[Laravel Sanctum](https://laravel.com/docs/8.x/sanctum)** 
#### Frontend
- **[React js](https://reactjs.org/)**
- **[Material-ui](https://material-ui.com/)**

## Fitur
- Autentikasi pengguna
- Manajemen menu
  - Menambahkan data menu baru
  - Merubah data menu
  - Menghapus data menu
- Mengelola data pengguna
  - Menambahkan pengguna baru
  - Menggapus semua token pengguna
  - Memperbarui akses menu pada setiap pengguna
    - Menambah akses menu pada pengguna
    - menghapus akses menu pada pengguna  
  - Memperbarui password pengguna
  - Menghapus permanen data pengguna
  - Memperbarui data profil setiap pengguna
  - Melihat detail profil pengguna
- Mengelola data items
  - Item groups
    - Create
    - Read,
    - Update,
    - Delete,
    - Import from excel,
    - Export to excel
