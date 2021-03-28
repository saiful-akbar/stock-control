<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\UserResource;
use App\Models\User;


class AuthController extends Controller
{
    /*
    * Login user
    */
    public function login(Request $request)
    {
        // validari request form
        $request->validate([
            "username" => "required|exists:users,username",
            "password" => "required",
        ]);

        // Cek apakah username dan password sesuai dengan database atau tidak
        if (Auth::attempt(["username" => $request->username, "password" => $request->password])) {

            // Cek apakah user aktif atau tidak
            if (Auth::user()->is_active == 1) {
                $user = User::find(Auth::user()->id); // Ambil data user

                // Jika ada token sebelumnya hapus tokennya
                if (!empty($user->tokens())) {
                    $user->tokens()->delete();
                }

                $auth_token = $user->createToken("auth_token", ['server:auth']); // Buat token baru

                // Buat user log
                User::find(Auth::user()->id)
                    ->userLog()
                    ->create(["log_desc" => "Logged In"]);

                // Response login berhasil
                return (new UserResource($user))->additional([
                    "auth_token" => $auth_token->plainTextToken
                ]);
            } else {
                // response jika akun tidak aktif
                return response()->json([
                    "errors"  => ["username" => ["Your account is inactive"]],
                    "message" => "Your account is inactive"
                ], 422);
            }
        }
        // Response jika username atau password salah
        return response()->json([
            "errors"  => ["username" => ["Incorrect username or password"]],
            "message" => "Incorrect username or password"
        ], 422);
    }

    /**
     * Method logout
     */
    public function logout()
    {
        // Cek apakah user sudah login sebelumnya atau tidak
        if (!empty(Auth::user())) {
            User::find(Auth::user()->id)->tokens()->delete();
        }

        // Response berhasil
        return response()->json(["message" => "logout"], 200);
    }


    /*
    * Get avatar user is login
    */
    public function userAvatar($avatar)
    {
        $file     = Storage::get("img/avatars/{$avatar}");
        $mimeType = Storage::mimeType("img/avatars/{$avatar}");
        return response($file, 200)->header("Content-Type", $mimeType);
    }


    /**
     * Cek apakah user sudah login dengan benar atau tidak
     * cek apakah token sesuai dengan data user yang ada
     *
     * @return [type]
     */
    public function userIsLogin()
    {
        $user = User::find(Auth::user()->id); // Ambil data user yang sedang login
        $profile = $user->profile()->first(); // Ambil data profile user
        $menu_items = $user->menuItem()->orderBy("menu_i_title", "asc")->get(); // Ambil data menu items user
        $menu_sub_items = $user->menuSubItem()->orderBy("menu_s_i_title", "asc")->get(); // Ambil data menu sub items user

        // Response berhasil
        return (new UserResource($user))->additional([
            "account"        => $user,
            "profile"        => $profile,
            "menu_items"     => $menu_items,
            "menu_sub_items" => $menu_sub_items,
        ]);
    }
}
