<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ItemGroupController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\MenuSubItemController;

/**
 * Route yang tidak perlu login
 * Route untuk login user dan mengambil avatar user
 */
Route::any("/login", [AuthController::class, "login"]);
Route::any("/avatar/{avatar}", [AuthController::class, "userAvatar"]);

/**
 * Route group middleware untuk user yang sudah login
 */
Route::group(["middleware" => ["auth:sanctum"]], function () {

    /**
     * Route fungsi logout
     */
    Route::get("/logout", [AuthController::class, "logout"]);

    /**
     * Route untuk fungsi cek apakah user sudah login dengan benar atau belum
     */
    Route::get("/login/user", [AuthController::class, "userIsLogin"]);

    /**
     * Route group untuk menu item
     */
    Route::group(["prefix" => "menu"], function () {
        Route::get("/", [MenuItemController::class, "index"])->middleware("access.menu:read");
        Route::post("/", [MenuItemController::class, "store"])->middleware("access.menu:create");
        Route::put("/{menuItem}", [MenuItemController::class, "update"])->middleware("access.menu:update");
        Route::delete("/{menuItem}", [MenuItemController::class, "destroy"])->middleware("access.menu:delete");
    });

    /**
     * Route group untuk menu sub item
     */
    Route::group(["prefix" => "submenu"], function () {
        Route::get("/", [MenuSubItemController::class, "index"])->middleware("access.menu:read");
        Route::post("/", [MenuSubItemController::class, "store"])->middleware("access.menu:create");
        Route::put("/{menuSubItem}", [MenuSubItemController::class, "update"])->middleware("access.menu:update");
        Route::delete("/{menuSubItem}", [MenuSubItemController::class, "destroy"])->middleware("access.menu:delete");
    });

    /**
     * Route group untuk user
     */
    Route::group(["prefix" => "user"], function () {

        /**
         * Route middleware menu user untuk akses read
         */
        Route::group(["middleware" => ["access.user:read"]], function () {
            Route::get("/", [UserController::class, "index"]);
            Route::get("/menu", [UserController::class, "getMenus"]);
            Route::get("/{user}", [UserController::class, "show"]);
        });

        /**
         * Route middleware menu user untuk akses create
         */
        Route::group(["middleware" => ["access.user:create"]], function () {
            Route::post("/cek/user-form", [UserController::class, "cekUserForm"]);
            Route::post("/cek/profile-form", [UserController::class, "cekProfileForm"]);
            Route::post("/", [UserController::class, "store"]);
            Route::post("/menu-access", [UserController::class, "createUserMenuAccess"]);
        });

        /**
         * Route middleware menu user untuk akses update
         */
        Route::group(["middleware" => ["access.user:update"]], function () {
            Route::get("/{id}/edit", [UserController::class, "editProfile"]);
            Route::get("/{user}/account", [UserController::class, "editAccount"]);
            Route::patch("/{id}", [UserController::class, "updateProfile"]);
            Route::patch("/{user}/account", [UserController::class, "updateAccount"]);
            Route::get("/menu/{id}", [UserController::class, "getUserMenuItems"]);
            Route::post("/menu/{id}", [UserController::class, "addUserMenuItem"]);
            Route::delete("/menu/{id}", [UserController::class, "deleteUserMenuItem"]);
            Route::get("/submenu/{id}", [UserController::class, "getUserMenuSubItems"]);
            Route::post("/submenu/{id}", [UserController::class, "addUserMenuSubItems"]);
            Route::delete("/submenu/{id}", [UserController::class, "deleteUserMenuSubItems"]);
            Route::patch("/password/{id}", [UserController::class, "updatePassword"]);
        });

        /**
         * Route middleware menu user untuk akses delete
         */
        Route::group(["middleware" => ["access.user:delete"]], function () {
            Route::delete("/truncate-tokens", [UserController::class, "truncateTokens"]);
            Route::delete("/{id}/delete", [UserController::class, "destroy"]);
        });
    });

    /**
     * Route group halaman master
     */
    Route::group(["prefix" => "master"], function () {

        /**
         * Route group halaman master items
         */
        Route::group(["prefix" => "item-groups"], function () {
            Route::get("/", [ItemGroupController::class, "index"])->middleware("access.item:read");
            Route::get("/export", [ItemGroupController::class, "export"])->middleware("access.item:read");
            Route::post("/", [ItemGroupController::class, "create"])->middleware("access.item:create");
            Route::post("/import", [ItemGroupController::class, "import"])->middleware("access.item:create");
            Route::delete("/", [ItemGroupController::class, "delete"])->middleware("access.item:delete");
            Route::patch("/{item_group}", [ItemGroupController::class, "update"])->middleware("access.item:update");
        });
    });
});
