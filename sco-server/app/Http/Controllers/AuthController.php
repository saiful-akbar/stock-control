<?php

namespace App\Http\Controllers;

use \Illuminate\Http\Request;
use \Illuminate\Support\Facades\Auth;
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
        // validari request form
        $request->validate([
            "username" => "required",
            "password" => "required",
        ]);

        // Cek apakah method request berupa post atau tidak
        if ($request->isMethod("post")) {

            // Cek apakah username dan password sesuai dengan database atau tidak
            if (Auth::attempt(["username" => $request->username, "password" => $request->password])) {

                // Cek apakah user aktif atau tidak
                if (Auth::user()->is_active == 1) {

                    // Jika ada token sebelumnya hapus tokennya
                    Auth::user()->tokens()->delete();

                    // Buat token baru
                    $auth_token = Auth::user()->createToken("auth_token")->plainTextToken;

                    // simpan log login user
                    User::find(Auth::user()->id)->userLog()->create($this->getClientLogs());

                    // Response login berhasil
                    return response()->json(["auth_token" => $auth_token], 200);
                } else {

                    // response jika akun tidak aktif
                    return response()->json([
                        "errors"  => ["username" => ["Your account is inactive"]],
                        "message" => "Your account is inactive"
                    ], 422);
                }
            } else {

                // Response jika username atau password salah atau tidak sesuai dengan database
                return response()->json([
                    "errors"  => ["username" => ["Incorrect username or password"]],
                    "message" => "Incorrect username or password"
                ], 422);
            }
        }

        // Response jika request method bukan POST
        return response()->json([
            "message" => "Method not allowed"
        ], 405);
    }

    /**
     * Method logout
     */
    public function logout()
    {
        // Cek apakah user sudah login sebelumnya atau tidak
        if (!empty(Auth::user())) {
            Auth::user()->tokens()->delete();
        }

        // Response berhasil
        return response()->json(["message" => "logout"], 200);
    }


    /*
    * Get avatar user is login
    */
    public function userAvatar(Request $request, $avatar)
    {
        /**
         * Cek apakah method http request GET atau bukan
         * Jika sesuai ambil avatar user dari file storage dan kirimkan
         */
        if ($request->isMethod("get")) {
            $file     = Storage::get("img/avatars/{$avatar}");
            $mimeType = Storage::mimeType("img/avatars/{$avatar}");
            return response($file, 200)->header("Content-Type", $mimeType);
        }

        // Response berhasil
        return response()->json([
            "message" => "Method not allowed"
        ]);
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
        $user    = Auth::user();

        // Ambil data profile user,
        $profile = User::find($user->id)->profile()->first();

        // Ambil data menu items user
        $menu_items = User::find($user->id)->menuItem()->orderBy("menu_i_title", "asc")->get();

        // Ambil data menu sub items user
        $menu_sub_items = User::find($user->id)->menuSubItem()->orderBy("menu_s_i_title", "asc")->get();

        // Response berhasil
        return (new UserResource($user))->additional([
            "profile"        => $profile,
            "menu_items"     => $menu_items,
            "menu_sub_items" => $menu_sub_items,
        ]);
    }


    /**
     * Fngsi untuk mengambil data logs pada client
     *
     * @param null $type
     *
     * @return string
     */
    function getClientLogs($type = null)
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
                return now();
                break;

            default:
                return [
                    "ip"        => $ip,
                    "ip2"       => $ip2,
                    "browser"   => $browser,
                    "device"    => $device,
                    "os"        => $_SERVER["HTTP_USER_AGENT"],
                    "logged_at" => now(),
                ];
                break;
        }
    }
}
