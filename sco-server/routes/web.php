<?php

use Illuminate\Support\Facades\Route;

Route::any('/', function () {
    return redirect('http://localhost:3000');
});
