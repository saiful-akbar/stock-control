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

                // Ambil data user
                $user = User::find(Auth::user()->id);

                // Jika ada token sebelumnya hapus tokennya
                if (!empty($user->tokens())) {
                    $user->tokens()->delete();
                }

                // Buat token baru
                $auth_token = $user->createToken("auth_token", ['server:auth']);

                // buat log login user
                $user->userLog()->create(["log_desc" => "Login"]);

                // Response login berhasil
                return response()->json(["auth_token" => $auth_token->plainTextToken], 200);
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
    public function userAvatar(Request $request, $avatar)
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
        // Ambil data user yang sedang login
        $user = User::find(Auth::user()->id);

        // Ambil data profile user,
        $profile = $user->profile()->first();

        // Ambil data menu items user
        $menu_items = $user->menuItem()->orderBy("menu_i_title", "asc")->get();

        // Ambil data menu sub items user
        $menu_sub_items = $user->menuSubItem()->orderBy("menu_s_i_title", "asc")->get();

        // Response berhasil
        return (new UserResource($user))->additional([
            "profile"        => $profile,
            "menu_items"     => $menu_items,
            "menu_sub_items" => $menu_sub_items,
        ]);
    }
}
