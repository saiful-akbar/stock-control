<?php

namespace App\Http\Controllers;

use \Illuminate\Http\Request;
use \Illuminate\Support\Facades\Auth;
use \Illuminate\Support\Facades\Crypt;
use \Illuminate\Support\Facades\DB;
use \Illuminate\Support\Facades\Storage;
use \App\Http\Resources\UserResource;
use \App\Models\User;


class AuthController extends Controller
{
    /*
    * Login user
    */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        if (Auth::attempt(['username' => $request->username, 'password' => $request->password])) {
            if (Auth::user()->is_active == 1) {
                Auth::user()->tokens()->delete();
                $auth_token = Auth::user()->createToken('auth_token')->plainTextToken;
                return response()->json([
                    'auth_token' => $auth_token
                ], 200);
            } else {
                return response()->json([
                    'errors'  => ['username' => ['Your account is inactive']],
                    'message' => 'Your account is inactive'
                ], 422);
            }
        } else {
            return response()->json([
                'errors'  => ['username' => ['Incorrect username or password']],
                'message' => 'Incorrect username or password'
            ], 422);
        }
    }

    /**
     * Logout
     */
    public function logout()
    {
        if (!empty(Auth::user())) {
            Auth::user()->tokens()->delete();
        }
        return response()->json(['message' => 'logout'], 200);
    }

    /*
    * Get avatar user is login
    */
    public function userAvatar($avatar)
    {
        $file     = Storage::get('img/avatars/' . $avatar);
        $mimeType = Storage::mimeType('img/avatars/' . $avatar);
        return response($file, 200)->header('Content-Type', $mimeType);
    }

    // cek apakah token sesuai dengan data user yang ada
    public function userIsLogin()
    {
        $user    = Auth::user();
        $profile = User::find($user->id)->profile()->first();
        return (new UserResource($user))->additional([
            'user'           => Auth::user(),
            'profile'        => $profile,
            'menu_items'     => User::find($user->id)->menuItem()->orderBy('menu_i_title', 'asc')->get(),
            'menu_sub_items' => User::find($user->id)->menuSubItem()->orderBy('menu_s_i_title', 'asc')->get(),
        ]);
    }

    // Fungsi untuk decrypt string
    public function decrypt($str)
    {
        return Crypt::decryptString($str);
    }
}
