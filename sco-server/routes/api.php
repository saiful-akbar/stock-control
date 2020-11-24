<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\MenuSubItemController;
use App\Http\Controllers\UserController;

// Route untuk login user
Route::post('/login', [AuthController::class, 'login']);
Route::get('/avatar/{avatar}', [AuthController::class, 'userAvatar']);

Route::group(['middleware' => ['auth:sanctum']], function () {

    // Route logout dan data user yang sedang login
    Route::get('/logout', [AuthController::class, 'logout']);
    Route::get('/login/user', [AuthController::class, 'userIsLogin']);

    // Route group untuk menu item
    Route::group(['prefix' => 'menu/menu-item'], function () {
        Route::get('/', [MenuItemController::class, 'index']);
        Route::post('/', [MenuItemController::class, 'store']);
        Route::put('/{menuItem}', [MenuItemController::class, 'update']);
        Route::delete('/{menuItem}', [MenuItemController::class, 'destroy']);
    });

    // Route group untuk menu item
    Route::group(['prefix' => 'menu/menu-sub-item'], function () {
        Route::get('/', [MenuSubItemController::class, 'index']);
        Route::post('/', [MenuSubItemController::class, 'store']);
        Route::put('/{menuSubItem}', [MenuSubItemController::class, 'update']);
        Route::delete('/{menuSubItem}', [MenuSubItemController::class, 'destroy']);
    });

    // Route group untuk user
    Route::group(['prefix' => 'user'], function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/menu', [UserController::class, 'getMenus']);
        Route::post('/cek/user-form', [UserController::class, 'cekUserForm']);
        Route::post('/cek/profile-form', [UserController::class, 'cekProfileForm']);
        Route::post('/', [UserController::class, 'store']);
        Route::post('/menu-access', [UserController::class, 'createUserMenuAccess']);
        Route::get('/{id}/edit', [UserController::class, 'edit']);
        Route::delete('/truncate-tokens', [UserController::class, 'truncateTokens']);
        Route::delete('/{id}', [UserController::class, 'destroy']);

        // Route edit user menu item akses
        Route::get('/{id}/menuItems', [UserController::class, 'getMenuItems']);
    });
});
