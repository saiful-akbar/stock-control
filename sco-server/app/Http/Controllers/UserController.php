<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile;
use App\Models\UserLog;
use Illuminate\Support\Str;
use App\Models\UserMenuItem;
use Illuminate\Http\Request;
use App\Models\UserMenuSubItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    // Ambil semua menu
    public function getMenus()
    {
        $menu_items = DB::table("menu_items")
            ->select("id", "menu_i_title", "menu_i_children")
            ->orderBy("menu_i_title", "asc")
            ->get();

        $menu_sub_items =  DB::table("menu_sub_items")
            ->leftJoin("menu_items", "menu_sub_items.menu_item_id", "=", "menu_items.id")
            ->orderBy("menu_sub_items.menu_s_i_title", "asc")
            ->get();

        return response()->json([
            "menu_items" => $menu_items,
            "menu_sub_items" => $menu_sub_items,
        ], 200);
    }

    /**
     * Fungsi untuk membersihkan string
     *
     * @param string $type
     * @param string $string
     *
     * @return String
     */
    private function clearStr(string $string, string $type = null)
    {
        switch (strtolower($type)) {
            case "upper":
                return htmlspecialchars(trim(strtoupper($string)));
                break;

            case "proper":
                return htmlspecialchars(trim(ucwords($string)));
                break;

            case "lower":
                return htmlspecialchars(trim(strtolower($string)));
                break;

            default:
                return htmlspecialchars(trim($string));
                break;
        }
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // Cek baris perhalaman
        $per_page = 25;
        if (isset($request->perpage) && !empty($request->perpage)) {
            switch ($this->clearStr($request->perpage)) {
                case 250:
                    $per_page = 250;
                    break;

                case 100:
                    $per_page = 100;
                    break;

                case 50:
                    $per_page = 50;
                    break;

                default:
                    $per_page = 25;
                    break;
            }
        }

        // Cek sort
        $sort = "profile_name";
        if (isset($request->sort) && !empty($request->sort)) {
            switch ($this->clearStr($request->sort)) {
                case 'profile_name':
                    $sort = "profile_name";
                    break;

                case 'username':
                    $sort = "username";
                    break;

                case 'is_active':
                    $sort = "is_active";
                    break;

                case 'created_at':
                    $sort = "created_at";
                    break;

                case 'updated_at':
                    $sort = "updated_at";
                    break;

                default:
                    $sort = "profile_name";
                    break;
            }
        }

        // Cek orderby
        $order_by = 'asc';
        if (isset($request->orderby) && !empty($request->orderby)) {
            if ($this->clearStr($request->orderby, "lower") === 'asc' || $this->clearStr($request->orderby, "lower") === 'desc') {
                $order_by = $this->clearStr($request->orderby, "lower");
            }
        }

        // Cek search
        $search = isset($request->search) ?  $this->clearStr($request->search) : '';

        // Ambil data user dari database
        $data = User::leftJoin("profiles", "users.id", "=", "profiles.user_id")
            ->leftJoin("personal_access_tokens", "users.id", "=", "personal_access_tokens.tokenable_id")
            ->select(
                "users.id",
                "users.username",
                "users.is_active",
                "users.created_at",
                "users.updated_at",
                "profiles.profile_avatar",
                "profiles.profile_name",
                "profiles.profile_division",
                "personal_access_tokens.token",
            )
            ->where("users.username", "like", "%" . $search . "%")
            ->orWhere("profiles.profile_name", "like", "%" . $search . "%")
            ->orWhere("profiles.profile_division", "like", "%" . $search . "%")
            ->orderBy($sort, $order_by)
            ->paginate($per_page);

        // response berhasil
        return response()->json([
            "users"    => $data,
            "search"   => $search,
            "sort"     => $sort,
            "order_by" => $order_by
        ], 200);
    }

    /**
     * Method create
     * Method untuk mengambil data untuk kebutuhan create new user
     */
    public function create()
    {
        $menu_items = DB::table("menu_items")->orderBy("menu_i_title", "asc")->get();
        $menu_sub_items = DB::table('menu_sub_items')->orderBy("menu_s_i_title", "asc")->get();

        return response()->json([
            "menu_items" => $menu_items,
            "menu_sub_items" => $menu_sub_items
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeUserProfile(Request $request)
    {
        // validasi form
        $request->validate([
            "username"  => "required|string|unique:users,username|max:100",
            "password"  => "required|string|min:6|max:200",
            "is_active" => "required|boolean",
            "name"      => "required|string|max:100",
            "avatar"    => "nullable|image|mimes:jpeg,jpg,png|max:1000",
            "division"  => "nullable|string|max:100",
            "email"     => "nullable|email:filter|unique:profiles,profile_email|max:200",
            "phone"     => "nullable|string|max:16",
            "address"   => "nullable|string|max:400",
        ]);

        // Menambahkan user baru
        $user = User::create([
            "username"  => $this->clearStr($request->username),
            "password"  => $this->clearStr(bcrypt($request->password)),
            "is_active" => $this->clearStr($request->is_active),
        ]);

        // Jika avatar di upload simpan pada storage
        $avatar = null;
        if ($request->hasFile("avatar")) {
            $extension = $request->avatar->extension();
            $avatar    = "{$user->id}.{$extension}";
            $request->avatar->storeAs("img/avatars", $avatar);
        }

        // Menambahkan profile sesuai dengan user yang baru dibuat
        $user->profile()->create([
            "profile_avatar"   => $avatar,
            "profile_name"     => $this->clearStr($request->name, "proper"),
            "profile_division" => !empty($request->division) ? $this->clearStr($request->division, "proper") : null,
            "profile_email"    => !empty($request->email) ? $this->clearStr($request->email, "lower") : null,
            "profile_phone"    => !empty($request->phone) ? $this->clearStr($request->phone, "lower") : null,
            "profile_address"  => !empty($request->address) ? $this->clearStr($request->address) : null,
        ]);

        // response berhasil
        return response()->json([
            "request" => $request->all(),
            "user_id" => $user->id,
            "message" => "User account & profile created successfully",
        ], 200);
    }

    /**
     * Method untuk membuat menu akses user
     *
     * @param Request $request
     */
    public function storeUserMenuAccess(Request $request)
    {
        $menu_items = [];
        foreach ($request->user_menu_item as $key => $value) {
            $menu_items[$key] = [
                "id"              => Str::random(32),
                "user_id"         => $value["user_id"],
                "menu_item_id"    => $value["menu_item_id"],
                "user_m_i_read"   => $value["read"],
                "created_at"      => now(),
                "updated_at"      => now(),
            ];
        }

        $menu_sub_items = [];
        foreach ($request->user_menu_sub_item as $key_sub_item => $sub_item) {
            $menu_sub_items[$key_sub_item] = [
                "id"                => Str::random(32),
                "user_id"           => $sub_item["user_id"],
                "menu_sub_item_id"  => $sub_item["menu_sub_item_id"],
                "user_m_s_i_read"   => $sub_item["read"],
                "user_m_s_i_create" => $sub_item["create"],
                "user_m_s_i_update" => $sub_item["update"],
                "user_m_s_i_delete" => $sub_item["delete"],
                "created_at"        => now(),
                "updated_at"        => now(),
            ];
        }

        DB::table("user_menu_item")->insert($menu_items);
        DB::table("user_menu_sub_item")->insert($menu_sub_items);

        return response()->json([
            "message" => "1 User created succcessfully",
        ], 200);
    }


    // /**
    //  * @param User $user
    //  *
    //  * @return \Illuminate\Http\Response
    //  */
    // public function show(Request $request, User $user)
    // {
    //     // Ambil data user account
    //     $account = User::find($user->id);

    //     // Ambil data user profile
    //     $profile = Profile::where("user_id", "=", $user->id)->first();

    //     // Ambil data user menu items
    //     $menu_items = DB::table("user_menu_item")
    //         ->leftJoin("menu_items", "menu_items.id", "=", "user_menu_item.menu_item_id")
    //         ->where("user_menu_item.user_id", "=", $user->id)
    //         ->select(
    //             "menu_items.id",
    //             "menu_items.menu_i_title",
    //             "menu_items.menu_i_url",
    //             "menu_items.menu_i_icon",
    //             "menu_items.menu_i_children",
    //             "user_menu_item.user_m_i_create",
    //             "user_menu_item.user_m_i_read",
    //             "user_menu_item.user_m_i_update",
    //             "user_menu_item.user_m_i_delete",
    //             "user_menu_item.created_at",
    //             "user_menu_item.updated_at",
    //         )
    //         ->orderBy("menu_items.menu_i_title", "asc")
    //         ->get();

    //     $result_menus = [];
    //     foreach ($menu_items as $key => $value) {
    //         $result_menus[$key] = [
    //             "id"              => $value->id,
    //             "menu_i_title"    => $value->menu_i_title,
    //             "menu_i_url"      => $value->menu_i_url,
    //             "menu_i_icon"     => $value->menu_i_icon,
    //             "menu_i_children" => $value->menu_i_children,
    //             "user_m_i_create" => $value->user_m_i_create,
    //             "user_m_i_read"   => $value->user_m_i_read,
    //             "user_m_i_update" => $value->user_m_i_update,
    //             "user_m_i_delete" => $value->user_m_i_delete,
    //             "created_at"      => $value->created_at,
    //             "updated_at"      => $value->updated_at,
    //             "sub_menus"       => DB::table("menu_sub_items")
    //                 ->leftJoin("user_menu_sub_item", "menu_sub_items.id", "=", "user_menu_sub_item.menu_sub_item_id")
    //                 ->where([
    //                     ["menu_sub_items.menu_item_id", "=", $value->id],
    //                     ["user_menu_sub_item.user_id", "=", $user->id]
    //                 ])
    //                 ->select(
    //                     "menu_sub_items.id",
    //                     "menu_sub_items.menu_item_id",
    //                     "menu_sub_items.menu_s_i_title",
    //                     "menu_sub_items.menu_s_i_url",
    //                     "user_menu_sub_item.user_m_s_i_create",
    //                     "user_menu_sub_item.user_m_s_i_read",
    //                     "user_menu_sub_item.user_m_s_i_update",
    //                     "user_menu_sub_item.user_m_s_i_delete",
    //                     "user_menu_sub_item.created_at",
    //                     "user_menu_sub_item.updated_at",
    //                 )
    //                 ->orderBy("menu_sub_items.menu_s_i_title", "asc")
    //                 ->get(),
    //         ];
    //     }

    //     $logs = UserLog::where('user_id', $user->id)->limit(10)->orderBy('logged_at', 'desc')->get();

    //     // response
    //     return response()->json([
    //         "user"    => $account,
    //         "profile" => $profile,
    //         "menus"   => $result_menus,
    //         "logs"    => $logs,
    //     ], 200);
    // }

    // /**
    //  * Show the form for editing the specified resource.
    //  *
    //  * @param  int  $id
    //  * @return \Illuminate\Http\Response
    //  */
    // public function editProfile($id)
    // {
    //     $data = DB::table("profiles")
    //         ->select("profile_avatar", "profile_name", "profile_division", "profile_email", "profile_phone", "profile_address")
    //         ->where("user_id", $id)
    //         ->first();

    //     return response()->json([
    //         "user_data" => $data,
    //     ], 200);
    // }

    // /**
    //  * Update the specified resource in storage.
    //  *
    //  * @param  \Illuminate\Http\Request  $request
    //  * @param  int  $id
    //  * @return \Illuminate\Http\Response
    //  */
    // public function updateProfile(Request $request, $id)
    // {
    //     //  validasi request
    //     $request->validate([
    //         "profile_avatar"   => "nullable|image|mimes:jpeg,jpg,png|max:1000",
    //         "profile_name"     => "required|string|max:128",
    //         "profile_division" => "nullable|string|max:128",
    //         "profile_email"    => "nullable|email:filter|max:128",
    //         "profile_phone"    => "nullable|string|max:15",
    //         "profile_address"  => "nullable|string",
    //     ]);


    //     // Ambil data awal user yang ingin dirubah
    //     $user = DB::table("profiles")->where("user_id", $id)->first();


    //     // Cek apakah avatar dirubah atau tidak
    //     $avatar = $user->profile_avatar;
    //     if ($request->hasFile("profile_avatar")) {
    //         if ($avatar != null) {
    //             Storage::delete("img/avatars/{$avatar}");
    //         }

    //         $extension = $request->profile_avatar->extension();
    //         $avatar    = "{$id}.{$extension}";
    //         $request->profile_avatar->storeAs("img/avatars", $avatar);
    //     }


    //     // Validasi jika email dirubah
    //     if ($request->profile_email != $user->profile_email) {
    //         $email = DB::table("profiles")
    //             ->select("profile_email")
    //             ->where([["user_id", "!=", $id], ["profile_email", "=", $request->profile_email]])
    //             ->first();

    //         if (!empty($email->profile_email)) {
    //             $request->validate([
    //                 "profile_email" => "unique:profiles,profile_email"
    //             ]);
    //         }
    //     }

    //     // Simpan data perubahannya
    //     DB::table("profiles")
    //         ->where("user_id", $id)
    //         ->update([
    //             "profile_avatar"   => htmlspecialchars($avatar),
    //             "profile_name"     => htmlspecialchars(ucwords($request->profile_name)),
    //             "profile_division" => empty($request->profile_division) ? null : htmlspecialchars(ucwords($request->profile_division)),
    //             "profile_email"    => empty($request->profile_email) ? null : htmlspecialchars(strtolower($request->profile_email)),
    //             "profile_phone"    => empty($request->profile_phone) ? null : htmlspecialchars(strtolower($request->profile_phone)),
    //             "profile_address"  => empty($request->profile_address) ? null : htmlspecialchars($request->profile_address),
    //             "updated_at"       => now(),
    //         ]);

    //     return response()->json([
    //         "message"   => "User profile updated successfully",
    //         "user_data" => DB::table("profiles")
    //             ->select("profile_avatar", "profile_name", "profile_division", "profile_email", "profile_phone", "profile_address")
    //             ->where("user_id", $id)
    //             ->first(),
    //     ], 200);
    // }

    // /**
    //  * @param User $user
    //  *
    //  * @return [type]
    //  */
    // public function editAccount(User $user)
    // {
    //     return response()->json([
    //         "user_data" => $user
    //     ]);
    // }

    // /**
    //  * @param Request $request
    //  * @param User $user
    //  *
    //  * @return [type]
    //  */
    // public function updateAccount(Request $request, User $user)
    // {
    //     // Validasi request
    //     $request->validate([
    //         "username"  => "required|string|max:200",
    //         "password"  => "nullable|string|min:4|max:200",
    //         "is_active" => "required|boolean"
    //     ]);

    //     /**
    //      * Cek request username
    //      * Cek apakah username diubah atau tidak
    //      */
    //     if ($request->username != $user->username) {
    //         $username = User::where([["username", "=", $request->username], ["id", '!=', $user->id]])->first();
    //         if (!empty($username)) {
    //             $request->validate([
    //                 "username"  => "unique:users,username",
    //             ]);
    //         }
    //     }

    //     // Cek request password
    //     $password = $user->password;
    //     if (!empty($request->password)) {
    //         $password = bcrypt(htmlspecialchars($request->password));
    //     }

    //     // Simpan perubahan
    //     User::where("id", $user->id)->update([
    //         "username"   => htmlspecialchars($request->username),
    //         "password"   => $password,
    //         "is_active"  => $request->is_active,
    //         "updated_at" => now(),
    //     ]);

    //     // Response
    //     return response()->json([
    //         "message"   => "User account updated successfully",
    //         "user_data" => User::find($user->id),
    //     ], 200);
    // }

    // /**
    //  * Remove the specified resource from storage.
    //  *
    //  * @param  int  $id
    //  * @return \Illuminate\Http\Response
    //  */
    // public function destroy($id)
    // {
    //     $avatar = User::find($id)->profile()->first();
    //     if ($avatar->profile_avatar !== null) {
    //         Storage::delete("img/avatars/" . $avatar->profile_avatar);
    //     }

    //     User::destroy($id);
    //     return response()->json(["message" => "User deleted successfuly",], 200);
    // }

    // /**
    //  * Mengosongkan token semua user
    //  */
    // public function truncateTokens()
    // {
    //     DB::table("personal_access_tokens")->truncate();
    //     return response()->json([
    //         "message" => "Truncate successfully"
    //     ], 200);
    // }


    // /**
    //  * @param string $id
    //  *
    //  * @return \Illuminate\Http\Response
    //  */
    // public function getUserMenuItems($id)
    // {
    //     $user_menu_items = DB::table("user_menu_item")
    //         ->leftJoin("menu_items", "user_menu_item.menu_item_id", "=", "menu_items.id")
    //         ->select(
    //             "user_menu_item.id",
    //             "user_menu_item.user_m_i_create",
    //             "user_menu_item.user_m_i_read",
    //             "user_menu_item.user_m_i_update",
    //             "user_menu_item.user_m_i_delete",
    //             "menu_items.menu_i_title"
    //         )
    //         ->where("user_menu_item.user_id", $id)
    //         ->orderBy("user_menu_item.created_at", "desc")
    //         ->get();

    //     $menu_items = DB::table("menu_items")
    //         ->select("id", "menu_i_title")
    //         ->orderBy("menu_i_title", "asc")
    //         ->get();

    //     return response()->json([
    //         "menu_items" => $menu_items,
    //         "user_menu_items" => $user_menu_items,
    //     ], 200);
    // }



    // /**
    //  * @param Request $request
    //  * @param string $id
    //  *
    //  * @return \Illuminate\Http\Response
    //  */
    // public function addUserMenuItem(Request $request, string $id)
    // {
    //     $request->validate([
    //         "user_id"         => "required|string|max:36|exists:users,id",
    //         "menu_item_id"    => "required|string|max:36|exists:menu_items,id",
    //         "user_m_i_read"   => "required|boolean",
    //         "user_m_i_create" => "required|boolean",
    //         "user_m_i_update" => "required|boolean",
    //         "user_m_i_delete" => "required|boolean",
    //     ]);

    //     /**
    //      * Ambil data menu berdasarkan user id & menu item id
    //      * Lalu siman kedalam variabel $user_menu_item
    //      */
    //     $user_menu_item = DB::table("user_menu_item")->where([
    //         ["user_id", $id],
    //         ["menu_item_id", $request->menu_item_id],
    //     ])->first();

    //     // cek apakan menu ada atau tidak
    //     if (!empty($user_menu_item)) {

    //         /**
    //          * kondisi jika menu yang dipilih sudah ada pada tabel
    //          * Kembalikan response 422
    //          */
    //         return response()->json([
    //             "message" => "The menus is already on the list",
    //         ], 422);
    //     } else {

    //         /**
    //          * Kondisi jika menu yang dipilih belum ada pada tabel sebelumnya
    //          * tambahkan data ke tabel user_menu_item
    //          */
    //         DB::table("user_menu_item")->insert([
    //             "id"              => Str::random(32),
    //             "user_id"         => htmlspecialchars($id),
    //             "menu_item_id"    => htmlspecialchars($request->menu_item_id),
    //             "user_m_i_read"   => htmlspecialchars($request->user_m_i_read),
    //             "user_m_i_create" => htmlspecialchars($request->user_m_i_create),
    //             "user_m_i_update" => htmlspecialchars($request->user_m_i_update),
    //             "user_m_i_delete" => htmlspecialchars($request->user_m_i_delete),
    //             "created_at"      => now(),
    //             "updated_at"      => now(),
    //         ]);

    //         return response()->json([
    //             "message"  => "1 menus added successfully",
    //             "response" => $this->getUserMenuItems($id),
    //         ], 201);
    //     }
    // }


    // /**
    //  * @param string $id
    //  *
    //  * @return Response
    //  */
    // public function deleteUserMenuItem(Request $request, string $id)
    // {
    //     $delete = UserMenuItem::destroy($request->all());
    //     return response()->json([
    //         "message"  => "{$delete} Menus deleted successfully",
    //         "response" => $this->getUserMenuItems($id),
    //     ]);
    // }

    // /**
    //  * @param string $id
    //  *
    //  * @return \Illuminate\Http\Response
    //  */
    // public function getUserMenuSUbItems($id)
    // {
    //     $user_msi = DB::table("user_menu_sub_item")
    //         ->leftJoin("menu_sub_items", "user_menu_sub_item.menu_sub_item_id", "=", "menu_sub_items.id")
    //         ->leftJoin("menu_items", "menu_sub_items.menu_item_id", "=", "menu_items.id")
    //         ->select(
    //             "user_menu_sub_item.id",
    //             "user_menu_sub_item.user_m_s_i_create",
    //             "user_menu_sub_item.user_m_s_i_read",
    //             "user_menu_sub_item.user_m_s_i_update",
    //             "user_menu_sub_item.user_m_s_i_delete",
    //             "menu_items.menu_i_title",
    //             "menu_sub_items.menu_s_i_title"
    //         )
    //         ->where("user_menu_sub_item.user_id", $id)
    //         ->orderBy("user_menu_sub_item.created_at", "desc")
    //         ->get();

    //     $menu_items = DB::table("menu_items")
    //         ->leftJoin("user_menu_item", "menu_items.id", "=", "user_menu_item.menu_item_id")
    //         ->select("menu_items.id", "menu_items.menu_i_title", "menu_items.menu_i_children",)
    //         ->where([
    //             ["user_menu_item.user_id", $id],
    //             ["menu_items.menu_i_children", 1]
    //         ])
    //         ->orderBy("menu_i_title", "asc")
    //         ->get();

    //     $result_menus = [];
    //     foreach ($menu_items as $key => $value) {
    //         $result_menus[$key] = [
    //             "id"              => $value->id,
    //             "menu_i_title"    => $value->menu_i_title,
    //             "menu_i_children" => $value->menu_i_children,
    //             "menu_sub_items"  => DB::table("menu_sub_items")
    //                 ->select("id", "menu_s_i_title")
    //                 ->where("menu_item_id", $value->id)
    //                 ->orderBy("menu_s_i_title", "asc")
    //                 ->get(),
    //         ];
    //     }

    //     return response()->json([
    //         "menus" => $result_menus,
    //         "user_menu_sub_items" => $user_msi,
    //     ], 200);
    // }


    // /**
    //  * @param Request $request
    //  * @param string $id
    //  *
    //  * @return \Illuminate\Http\Response
    //  */
    // public function addUserMenuSubItems(Request $request, string $id)
    // {
    //     // Validasi request
    //     $request->validate([
    //         "user_id"           => "required|string|max:36|exists:users,id",
    //         "menu_sub_item_id"  => "required|string|max:36|exists:menu_sub_items,id",
    //         "user_m_s_i_read"   => "required|boolean",
    //         "user_m_s_i_create" => "required|boolean",
    //         "user_m_s_i_update" => "required|boolean",
    //         "user_m_s_i_delete" => "required|boolean",
    //     ]);

    //     /**
    //      * Ambil data user menu sub item berdasarakan user id dam menu usb item id dari request
    //      */
    //     $user_msi = UserMenuSubItem::where([
    //         ["user_id", $id],
    //         ["menu_sub_item_id", htmlspecialchars($request->menu_sub_item_id)]
    //     ])->first();

    //     /**
    //      * Cek apakah menu yang dipilih sudah ada atau belum
    //      * Jika meu yang dilih kosong tambahkan data baru
    //      * Jika sudah ada kembalkan pesan kesalahan
    //      */
    //     if (empty($user_msi)) {

    //         // Tambahkan data baru
    //         DB::table("user_menu_sub_item")->insert([
    //             "id"                => Str::random(32),
    //             "user_id"           => htmlspecialchars($id),
    //             "menu_sub_item_id"  => htmlspecialchars($request->menu_sub_item_id),
    //             "user_m_s_i_read"   => htmlspecialchars($request->user_m_s_i_read),
    //             "user_m_s_i_create" => htmlspecialchars($request->user_m_s_i_create),
    //             "user_m_s_i_update" => htmlspecialchars($request->user_m_s_i_update),
    //             "user_m_s_i_delete" => htmlspecialchars($request->user_m_s_i_delete),
    //             "created_at"        => now(),
    //             "updated_at"        => now(),
    //         ]);

    //         return response()->json([
    //             "message"  => "1 sub menus added successfully",
    //             "response" => $this->getUserMenuSubItems($id),
    //         ], 200);
    //     } else {
    //         return response()->json([
    //             "message" => "The sub menus is already on the list",
    //         ], 422);
    //     }
    // }


    // /**
    //  * @param string $id
    //  *
    //  * @return Response
    //  */
    // public function deleteUserMenuSubItems(Request $request, string $id)
    // {
    //     $delete = UserMenuSubItem::destroy($request->all());
    //     return response()->json([
    //         "message"  => "{$delete} Sub menus deleted successfully",
    //         "response" => $this->getUserMenuSubItems($id),
    //     ]);
    // }


    // /**
    //  * @param Request $request
    //  * @param string $id
    //  *
    //  * @return Response
    //  */
    // public function updatePassword(Request $request, string $id)
    // {
    //     // cek method yang dikirim
    //     if ($request->isMethod("patch")) {

    //         // validasi request
    //         $request->validate([
    //             "password" => "required|string|max:128"
    //         ]);

    //         // update password
    //         User::where("id", htmlspecialchars($id))->update([
    //             "password" => bcrypt(htmlspecialchars($request->password))
    //         ]);

    //         // response password berhasil di update
    //         return response()->json([
    //             "message" => "Password updated successfully"
    //         ], 200);
    //     } else {

    //         // response method tidak sesuai permintaan
    //         return response()->json([
    //             "message" => "Method not allowed"
    //         ], 405);
    //     }
    // }
}
