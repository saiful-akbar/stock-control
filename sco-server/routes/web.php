<?php

use Illuminate\Support\Facades\Route;

Route::any('/login', function () {
    return redirect('http://localhost:3000/login');
})->name('login');

Route::any('/', function () {
    return redirect('http://localhost:3000');
});
