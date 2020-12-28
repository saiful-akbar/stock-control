<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\MenuSubItemController;

/**
 * Route yang tidak perlu login
 * Route untuk login user dan mengambil avatar user
 */
Route::any('/login', [AuthController::class, 'login']);
Route::any('/avatar/{avatar}', [AuthController::class, 'userAvatar']);

/**
 * Route group middleware untuk user yang sudah login
 */
Route::group(['middleware' => ['auth:sanctum']], function () {

    /**
     * Route logout dan data user yang sedang login
     */
    Route::get('/logout', [AuthController::class, 'logout']);
    Route::get('/login/user', [AuthController::class, 'userIsLogin']);

    /**
     * Route group untuk menu item
     */
    Route::group(['prefix' => 'menu'], function () {
        Route::get('/', [MenuItemController::class, 'index']);
        Route::post('/', [MenuItemController::class, 'store']);
        Route::put('/{menuItem}', [MenuItemController::class, 'update']);
        Route::delete('/{menuItem}', [MenuItemController::class, 'destroy']);
    });

    /**
     * Route group untuk menu item
     */
    Route::group(['prefix' => 'submenu'], function () {
        Route::get('/', [MenuSubItemController::class, 'index']);
        Route::post('/', [MenuSubItemController::class, 'store']);
        Route::put('/{menuSubItem}', [MenuSubItemController::class, 'update']);
        Route::delete('/{menuSubItem}', [MenuSubItemController::class, 'destroy']);
    });

    /**
     * Route group untuk user
     */
    Route::group(['prefix' => 'user'], function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/menu', [UserController::class, 'getMenus']);
        Route::get('/{user}', [UserController::class, 'show']);
        Route::get('/{id}/edit', [UserController::class, 'editProfile']);
        Route::get('/{user}/account', [UserController::class, 'editAccount']);

        Route::post('/cek/user-form', [UserController::class, 'cekUserForm']);
        Route::post('/cek/profile-form', [UserController::class, 'cekProfileForm']);
        Route::post('/', [UserController::class, 'store']);
        Route::post('/menu-access', [UserController::class, 'createUserMenuAccess']);

        Route::delete('/truncate-tokens', [UserController::class, 'truncateTokens']);
        Route::delete('/{id}', [UserController::class, 'destroy']);

        Route::patch('/{id}', [UserController::class, 'updateProfile']);
        Route::patch('/{user}/account', [UserController::class, 'updateAccount']);

        /**
         * Route edit user menu item akses
         */
        Route::get('/menu/{id}', [UserController::class, 'getUserMenuItems']);
        Route::post('/menu/{id}', [UserController::class, 'addUserMenuItem']);
        Route::delete('/menu/{id}', [UserController::class, 'deleteUserMenuItem']);

        /**
         * Route edit user menu sub item akses
         */
        Route::get('/submenu/{id}', [UserController::class, 'getUserMenuSubItems']);
        Route::post('/submenu/{id}', [UserController::class, 'addUserMenuSubItems']);
        Route::delete('/submenu/{id}', [UserController::class, 'deleteUserMenuSubItems']);

        /**
         * Route untuk merubah password user
         */
        Route::patch('/password/{id}', [UserController::class, 'updatePassword']);
    });
});
