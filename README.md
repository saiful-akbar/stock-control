<p align="center">
  <img src="https://github.com/saiful-akbar/stock-control/blob/main/sco-client/src/assets/images/logo/logo-light.png?raw=true" alt="SCO Logo" width="200">
</p>

# Stock Control

**Aplikasi Stock Control** merupakan aplikasi berbasis web dengan proses pengembangannya menggunakan framework laravel dan library react js. Aplikasi ini dibuat untuk mempermudah dalam mengontrol serta mengelola data stok barang.

## Teknologi Yang Digunakan

#### Backend

- **[Laravel v8](https://laravel.com/docs/8.x)**
- **[Laravel Sanctum](https://laravel.com/docs/8.x/sanctum)**
- **[Laravel Excel](https://laravel-excel.com/)**

#### Frontend

- **[React js](https://reactjs.org/)**
- **[Redux](https://redux.js.org/)**
- **[Material-ui](https://material-ui.com/)**

## Fitur

- [x] Otentikasi pengguna
- [x] Tema gelap atau terang
- [x] `create, read, update & delete` data document
- [x] `create, read, update, delete, import excel & export excel` data items
- [x] `create, read, update & delete` data menu
- [x] `create, read, update & delete` data user

## Instalasi

#### Backend || sco-server
- `$ cd sco-server`
- `$ composer install`
- `$ cp .env.example .env`
- ubah value DB_DATABASE= dengan nama database pada file .env
- `$ php artisan key:generate`
- `$ php artisan migrate:fresh --seed`
- `$ php artisan serve`

#### Frontend || sco-client
- `$ cd sco-client`
- `$ npm install` atau `$ yarn`
- `$ npm run start` atau `$ yarn start`
