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

                // simpan log login user
                $user->userLog()->create($this->getClientLogs());

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


    /**
     * Fngsi untuk mengambil data logs pada client
     */
    function getClientLogs(String $log_desc = "Login", String $type = null)
    {
        // Cek dan abil ip menggunakan getenv()
        $ip = "";
        if (getenv("HTTP_CLIENT_IP")) {
            $ip = getenv("HTTP_CLIENT_IP");
        } else if (getenv("HTTP_X_FORWARDED_FOR")) {
            $ip = getenv("HTTP_X_FORWARDED_FOR");
        } else if (getenv("HTTP_X_FORWARDED")) {
            $ip = getenv("HTTP_X_FORWARDED");
        } else if (getenv("HTTP_FORWARDED_FOR")) {
            $ip = getenv("HTTP_FORWARDED_FOR");
        } else if (getenv("HTTP_FORWARDED")) {
            $ip = getenv("HTTP_FORWARDED");
        } else if (getenv("REMOTE_ADDR")) {
            $ip = getenv("REMOTE_ADDR");
        } else {
            $ip = "IP address not recognized";
        }


        // Cek dan ambil ip menggunakan $_SERVER["]
        $ip2 = "";
        if (isset($_SERVER["HTTP_CLIENT_IP"])) {
            $ip2 = $_SERVER["HTTP_CLIENT_IP"];
        } else if (isset($_SERVER["HTTP_X_FORWARDED_FOR"])) {
            $ip2 = $_SERVER["HTTP_X_FORWARDED_FOR"];
        } else if (isset($_SERVER["HTTP_X_FORWARDED"])) {
            $ip2 = $_SERVER["HTTP_X_FORWARDED"];
        } else if (isset($_SERVER["HTTP_FORWARDED_FOR"])) {
            $ip2 = $_SERVER["HTTP_FORWARDED_FOR"];
        } else if (isset($_SERVER["HTTP_FORWARDED"])) {
            $ip2 = $_SERVER["HTTP_FORWARDED"];
        } else if (isset($_SERVER["REMOTE_ADDR"])) {
            $ip2 = $_SERVER["REMOTE_ADDR"];
        } else {
            $ip2 = "IP address not recognized";
        }


        // Cek dan ambil browser
        $browser = "";
        if (strpos($_SERVER["HTTP_USER_AGENT"], "Netscape")) {
            $browser = "Netscape";
        } else if (strpos($_SERVER["HTTP_USER_AGENT"], "Firefox")) {
            $browser = "Firefox";
        } else if (strpos($_SERVER["HTTP_USER_AGENT"], "Chrome")) {
            $browser = "Chrome";
        } else if (strpos($_SERVER["HTTP_USER_AGENT"], "Opera")) {
            $browser = "Opera";
        } else if (strpos($_SERVER["HTTP_USER_AGENT"], "MSIE")) {
            $browser = "Internet Explorer";
        } else if (strpos($_SERVER["HTTP_USER_AGENT"], "Safari")) {
            $browser = "Safari";
        } else {
            $browser = "Another browser";
        }


        // Cek dan ambil device
        $device = "";
        if (strpos($_SERVER["HTTP_USER_AGENT"], "Mobile")) {
            if (strpos($_SERVER["HTTP_USER_AGENT"], "Android")) {
                $device = "Andoid";
            } else if (strpos($_SERVER["HTTP_USER_AGENT"], "iPhone")) {
                $device = "iPhone";
            } else if (strpos($_SERVER["HTTP_USER_AGENT"], "iPad")) {
                $device = "iPad";
            } else if (strpos($_SERVER["HTTP_USER_AGENT"], "Windows Phone")) {
                $device = "Windows Phone";
            }
        } else if (strpos($_SERVER["HTTP_USER_AGENT"], "Windows")) {
            $device = "Windows";
        } else if (strpos($_SERVER["HTTP_USER_AGENT"], "Linux")) {
            $device = "Linux";
        } else if (strpos($_SERVER["HTTP_USER_AGENT"], "Mac OS")) {
            $device = "Mac OS";
        } else {
            $device = "Another device";
        }

        switch ($type) {
            case trim(strtolower('ip')):
                return $ip;
                break;

            case trim(strtolower('ip2')):
                return $ip2;
                break;

            case trim(strtolower('browser')):
                return $browser;
                break;

            case trim(strtolower('device')):
                return $device;
                break;

            case trim(strtolower('os')):
                return $_SERVER["HTTP_USER_AGENT"];
                break;

            case trim(strtolower('logged_at')):
                return $log_desc;
                break;

            default:
                return [
                    "ip"        => $ip,
                    "ip2"       => $ip2,
                    "browser"   => $browser,
                    "device"    => $device,
                    "os"        => $_SERVER["HTTP_USER_AGENT"],
                    "log_desc"  => $log_desc,
                ];
                break;
        }
    }
}
