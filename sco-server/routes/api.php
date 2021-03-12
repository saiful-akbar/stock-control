<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\ItemGroupController;
use App\Http\Controllers\MenuSubItemController;

/* Login route */

Route::post("/login", [AuthController::class, "login"]);

/* Route untuk mangambil avatar */
Route::get("/avatar/{avatar}", [AuthController::class, "userAvatar"]);

/* Route group middleware untuk user yang sudah login */
Route::group(["middleware" => ["auth:sanctum"]], function () {

    /* Route fungsi logout */
    Route::get("/logout", [AuthController::class, "logout"]);

    /* Route untuk fungsi cek apakah user sudah login dengan benar atau belum */
    Route::get("/login/user", [AuthController::class, "userIsLogin"]);

    /* Route group untuk menu item */
    Route::group(["prefix" => "menu"], function () {
        Route::get("/", [MenuItemController::class, "index"])->middleware("access.menu:read");
        Route::post("/", [MenuItemController::class, "store"])->middleware("access.menu:create");
        Route::put("/{menuItem}", [MenuItemController::class, "update"])->middleware("access.menu:update");
        Route::delete("/{menuItem}", [MenuItemController::class, "destroy"])->middleware("access.menu:delete");
    });

    /* Route group untuk menu sub item */
    Route::group(["prefix" => "submenu"], function () {
        Route::get("/", [MenuSubItemController::class, "index"])->middleware("access.menu:read");
        Route::post("/", [MenuSubItemController::class, "store"])->middleware("access.menu:create");
        Route::put("/{menuSubItem}", [MenuSubItemController::class, "update"])->middleware("access.menu:update");
        Route::delete("/{menuSubItem}", [MenuSubItemController::class, "destroy"])->middleware("access.menu:delete");
    });

    /* Route group items */
    Route::group(["prefix" => "item-groups"], function () {
        Route::get("/", [ItemGroupController::class, "index"])->middleware("access.item:read");
        Route::post("/", [ItemGroupController::class, "create"])->middleware("access.item:create");
        Route::delete("/", [ItemGroupController::class, "delete"])->middleware("access.item:delete");
        Route::patch("/{item_group}", [ItemGroupController::class, "update"])->middleware("access.item:update");
        Route::post("/import", [ItemGroupController::class, "import"])->middleware("access.item:create");
        Route::get("/export", [ItemGroupController::class, "export"])->middleware("access.item:read");
    });

    /* Route group document */
    Route::group(['prefix' => 'documents'], function () {
        Route::get("/", [DocumentController::class, "index"])->middleware("access.document:read");
        Route::post("/", [DocumentController::class, "store"])->middleware("access.document:read");
        Route::delete("/", [DocumentController::class, "delete"])->middleware("access.document:delete");
        Route::patch("/{document}", [DocumentController::class, "update"])->middleware("access.document:update");
        Route::get("/{document}/download", [DocumentController::class, "download"])->middleware("access.document:read");
    });

    /* Route group untuk user */
    Route::group(["prefix" => "user"], function () {
        Route::get("/", [UserController::class, "index"])->middleware("access.user:read");
        Route::get("/create", [UserController::class, "create"])->middleware("access.user:create");
        Route::get("/{user}", [UserController::class, "show"])->middleware("access.user:read");
        // Route::get("/{user}/edit", [UserController::class, "edit"])->middleware("access.user:update");

        Route::post("/", [UserController::class, "storeUserProfile"])->middleware("access.user:create");
        Route::post("/menu-access", [UserController::class, "storeUserMenuAccess"])->middleware("access.user:create");

        // Route::patch("/{user}", [UserController::class, "update"])->middleware("access.user:update");
        Route::patch("/{user}/password", [UserController::class, "updatePassword"])->middleware("access.user:update");
        // Route::patch("/{user}/menu-access", [UserController::class, "updateMenuAccess"])->middleware("access.user:update");

        Route::delete("/{user}", [UserController::class, "destroy"])->middleware("access.user:delete");
        Route::delete("/truncate-tokens", [UserController::class, "truncateTokens"])->middleware("access.user:delete");
    });
});


Route::post('/test', function (Request $request) {
    $input = $request->only(['account.username', 'account.password']);
    $username = $request->input("account.username");
    $password = $request->input("account.password");

    return response()->json([
        "request" => $input,
        "account" => [
            "username" => $username,
            "password" => $password
        ]
    ]);
});
