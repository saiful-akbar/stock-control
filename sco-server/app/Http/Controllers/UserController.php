<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile;
use App\Models\MenuItem;
use App\Models\UserMenuItem;
use App\Models\UserMenuSubItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{

    /**
     * User menu access
     */
    private function userAccess(string $accsess_type)
    {
        $user_login = Auth::user();
        $menu       = MenuItem::select("id")->where("menu_i_url", "/user")->first();
        $user_menu  = DB::table("user_menu_item")->where([
            ["user_id", $user_login->id],
            ["menu_item_id", $menu->id]
        ])->first();

        if (!empty($user_menu)) {
            if ($accsess_type == "read" && $user_menu->user_m_i_read == 1) {
                return true;
            } else if ($accsess_type == "create" && $user_menu->user_m_i_create == 1) {
                return true;
            } else if ($accsess_type == "update" && $user_menu->user_m_i_update == 1) {
                return true;
            } else if ($accsess_type == "delete" && $user_menu->user_m_i_delete == 1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    // Ambil semua menu
    public function getMenus()
    {
        if (!$this->userAccess("read")) {
            return response()->json(["message" => "Access is denied"], 403);
        } else {
            $menu_items = DB::table("menu_items")
                ->select("id", "menu_i_title", "menu_i_children")
                ->orderBy("menu_i_title", "asc")
                ->get();

            $menu_sub_items =  DB::table("menu_sub_items")
                ->leftJoin("menu_items", "menu_sub_items.menu_item_id", "=", "menu_items.id")
                ->select(
                    "menu_items.menu_i_title",
                    "menu_sub_items.id",
                    "menu_sub_items.menu_item_id",
                    "menu_sub_items.menu_s_i_title"
                )
                ->orderBy("menu_sub_items.menu_s_i_title", "asc")
                ->get();

            return response()->json([
                "menu_items" => $menu_items,
                "menu_sub_items" => $menu_sub_items,
            ], 200);
        }
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if (!$this->userAccess("read")) {
            return response()->json(["message" => "Access is denied"], 403);
        } else {
            $data     = [];
            $per_page = isset($request->per_page) && !empty($request->per_page) ? htmlspecialchars($request->per_page) : 25;
            $search   = isset($request->search) && !empty($request->search) ? htmlspecialchars($request->search) : "";
            $sort     = isset($request->sort) && !empty($request->sort) ? htmlspecialchars($request->sort) : "username";
            $order_by = isset($request->order_by) && !empty($request->order_by) ? htmlspecialchars($request->order_by) : "asc";

            $data = DB::table("users")
                ->leftJoin("profiles", "users.id", "=", "profiles.user_id")
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
                ->orWhere("users.is_active", "like", "%" . $search . "%")
                ->orWhere("users.created_at", "like", "%" . $search . "%")
                ->orWhere("users.updated_at", "like", "%" . $search . "%")
                ->orWhere("profiles.profile_name", "like", "%" . $search . "%")
                ->orWhere("profiles.profile_division", "like", "%" . $search . "%")
                ->orderBy($sort, $order_by)
                ->paginate($per_page);

            return response()->json([
                "users"    => $data,
                "search"   => $search,
                "sort"     => $sort,
                "order_by" => $order_by
            ], 200);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function cekUserForm(Request $request)
    {
        if (!$this->userAccess("create")) {
            return response()->json(["message" => "Access is denied"], 403);
        } else {
            $request->validate([
                "username"  => "required|string|unique:users,username|max:200",
                "password"  => "required|string|min:4|max:200",
                "is_active" => "required|boolean"
            ]);

            return response()->json([
                "message" => "success",
                "form_data" => [
                    "username"  => htmlspecialchars($request->username),
                    "password"  => htmlspecialchars($request->password),
                    "is_active" => $request->is_active ? "1" : "0",
                    "id"        => Str::random(32),
                ]
            ], 200);
        }
    }

    /**
     * Cek form user profile
     */
    public function cekProfileForm(Request $request)
    {
        if (!$this->userAccess("create")) {
            return response()->json(["message" => "Access is denied"], 403);
        } else {
            $request->validate([
                "user_id"          => "required|string",
                "profile_avatar"   => "nullable|image|mimes:jpeg,jpg,png|max:1000",
                "profile_name"     => "required|string|max:200",
                "profile_division" => "nullable|string|max:128",
                "profile_email"    => "nullable|email:rfc,dns,filter|unique:profiles,profile_email|max:200",
                "profile_phone"    => "nullable|string|max:32",
                "profile_address"  => "nullable|string",
            ]);

            $avatar = false;
            if ($request->hasFile("profile_avatar")) {
                $avatar = true;
            }

            return response()->json([
                "message" => "success",
                "form_data" => [
                    "user_id"          => htmlspecialchars($request->user_id),
                    "profile_avatar"   => $avatar,
                    "profile_name"     => htmlspecialchars(ucwords($request->profile_name)),
                    "profile_division" => htmlspecialchars(ucwords($request->profile_division)),
                    "profile_email"    => htmlspecialchars($request->profile_email),
                    "profile_phone"    => htmlspecialchars($request->profile_phone),
                    "profile_address"  => htmlspecialchars($request->profile_address),
                ]
            ], 200);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if (!$this->userAccess("create")) {
            return response()->json(["message" => "Access is denied"], 403);
        } else {
            // validasi form
            $request->validate([
                "username"         => "required|string|unique:users,username|max:255",
                "password"         => "required|string|min:4|max:255",
                "is_active"        => "required|boolean",
                "profile_name"     => "required|string|max:200",
                "profile_avatar"   => "nullable|image|mimes:jpeg,jpg,png|max:1000",
                "profile_division" => "nullable|string|max:128",
                "profile_email"    => "nullable|email:rfc,dns,filter|unique:profiles,profile_email|max:200",
                "profile_phone"    => "nullable|string|max:32",
                "profile_address"  => "nullable|string",
            ]);

            // Menambahkan user baru
            $user = User::create([
                "id"        => htmlspecialchars($request->id),
                "username"  => htmlspecialchars($request->username),
                "password"  => htmlspecialchars(bcrypt($request->password)),
                "is_active" => htmlspecialchars($request->is_active),
            ]);

            /**
             * Cek apakah avatar di upload atau tidak
             * Jika tidak gudakan avatar default.jpg
             * Jika ya simpan di storage
             */
            $avatar = null;
            if ($request->hasFile("profile_avatar")) {
                $extension = $request->profile_avatar->extension();
                $avatar    = "{$user->id}.{$extension}";
                $request->profile_avatar->storeAs("img/avatars", $avatar);
            }

            // Menambahkan profile sesuai dengan user yang baru dibuat
            $profile = $user->profile()->create([
                "user_id"          => $user->id,
                "profile_avatar"   => $avatar,
                "profile_name"     => htmlspecialchars(ucwords($request->profile_name)),
                "profile_division" => empty($request->profile_division) ? null : htmlspecialchars(ucwords($request->profile_division)),
                "profile_email"    => empty($request->profile_email) ? null : htmlspecialchars(strtolower($request->profile_email)),
                "profile_phone"    => empty($request->profile_phone) ? null : htmlspecialchars(strtolower($request->profile_phone)),
                "profile_address"  => empty($request->profile_address) ? null : htmlspecialchars($request->profile_address),
            ]);

            // response
            return response()->json([
                "user"    => $user,
                "profile" => $profile,
            ], 200);
        }
    }

    public function createUserMenuAccess(Request $request)
    {
        if (!$this->userAccess("create")) {
            return response()->json(["message" => "Access is denied"], 403);
        } else {
            $menu_items = [];
            foreach ($request->user_menu_item as $key => $value) {
                $menu_items[$key] = [
                    "id"              => Str::random(32),
                    "user_id"         => $value["user_id"],
                    "menu_item_id"    => $value["menu_item_id"],
                    "user_m_i_read"   => $value["user_m_i_read"],
                    "user_m_i_create" => $value["user_m_i_create"],
                    "user_m_i_update" => $value["user_m_i_update"],
                    "user_m_i_delete" => $value["user_m_i_delete"],
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
                    "user_m_s_i_read"   => $sub_item["user_m_s_i_read"],
                    "user_m_s_i_create" => $sub_item["user_m_s_i_create"],
                    "user_m_s_i_update" => $sub_item["user_m_s_i_update"],
                    "user_m_s_i_delete" => $sub_item["user_m_s_i_delete"],
                    "created_at"        => now(),
                    "updated_at"        => now(),
                ];
            }

            DB::table("user_menu_item")->insert($menu_items);
            DB::table("user_menu_sub_item")->insert($menu_sub_items);

            return response()->json([
                "message" => "Created succcessfully",
            ], 200);
        }
    }


    /**
     * @param User $user
     *
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, User $user)
    {
        if ($this->userAccess("read")) {

            // Ambil data user account
            $account = User::find($user->id);

            // Ambil data user profile
            $profile = Profile::where("user_id", "=", $user->id)->first();

            // Ambil data user menu items
            $menu_items = DB::table("user_menu_item")
                ->leftJoin("menu_items", "menu_items.id", "=", "user_menu_item.menu_item_id")
                ->where("user_menu_item.user_id", "=", $user->id)
                ->select(
                    "menu_items.id",
                    "menu_items.menu_i_title",
                    "menu_items.menu_i_url",
                    "menu_items.menu_i_icon",
                    "menu_items.menu_i_children",
                    "user_menu_item.user_m_i_create",
                    "user_menu_item.user_m_i_read",
                    "user_menu_item.user_m_i_update",
                    "user_menu_item.user_m_i_delete",
                    "user_menu_item.created_at",
                    "user_menu_item.updated_at",
                )
                ->orderBy("menu_items.menu_i_title", "asc")
                ->get();

            $result_menus = [];
            foreach ($menu_items as $key => $value) {
                $result_menus[$key] = [
                    "id"              => $value->id,
                    "menu_i_title"    => $value->menu_i_title,
                    "menu_i_url"      => $value->menu_i_url,
                    "menu_i_icon"     => $value->menu_i_icon,
                    "menu_i_children" => $value->menu_i_children,
                    "user_m_i_create" => $value->user_m_i_create,
                    "user_m_i_read"   => $value->user_m_i_read,
                    "user_m_i_update" => $value->user_m_i_update,
                    "user_m_i_delete" => $value->user_m_i_delete,
                    "created_at"      => $value->created_at,
                    "updated_at"      => $value->updated_at,
                    "sub_menus"       => DB::table("menu_sub_items")
                        ->leftJoin("user_menu_sub_item", "menu_sub_items.id", "=", "user_menu_sub_item.menu_sub_item_id")
                        ->where([
                            ["menu_sub_items.menu_item_id", "=", $value->id],
                            ["user_menu_sub_item.user_id", "=", $user->id]
                        ])
                        ->select(
                            "menu_sub_items.id",
                            "menu_sub_items.menu_item_id",
                            "menu_sub_items.menu_s_i_title",
                            "menu_sub_items.menu_s_i_url",
                            "user_menu_sub_item.user_m_s_i_create",
                            "user_menu_sub_item.user_m_s_i_read",
                            "user_menu_sub_item.user_m_s_i_update",
                            "user_menu_sub_item.user_m_s_i_delete",
                            "user_menu_sub_item.created_at",
                            "user_menu_sub_item.updated_at",
                        )
                        ->orderBy("menu_sub_items.menu_s_i_title", "asc")
                        ->get(),
                ];
            }

            // response
            return response()->json([
                "user"    => $account,
                "profile" => $profile,
                "menus"   => $result_menus,
            ], 200);
        } else {
            return response()->json(["message" => "Access is denied"], 403);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function editProfile($id)
    {
        if ($this->userAccess("update")) {
            $data = DB::table("profiles")
                ->select("profile_avatar", "profile_name", "profile_division", "profile_email", "profile_phone", "profile_address")
                ->where("user_id", $id)
                ->first();

            return response()->json([
                "user_data" => $data,
            ], 200);
        } else {
            return response()->json(["message" => "Access is denied"], 403);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateProfile(Request $request, $id)
    {
        if ($this->userAccess("update")) {

            //  validasi request
            $request->validate([
                "profile_avatar"   => "nullable|image|mimes:jpeg,jpg,png|max:1000",
                "profile_name"     => "required|string|max:128",
                "profile_division" => "nullable|string|max:128",
                "profile_email"    => "nullable|email:rfc,dns,filter|max:128",
                "profile_phone"    => "nullable|string|max:15",
                "profile_address"  => "nullable|string",
            ]);


            // Ambil data awal user yang ingin dirubah
            $user = DB::table("profiles")->where("user_id", $id)->first();


            // Cek apakah avatar dirubah atau tidak
            $avatar = $user->profile_avatar;
            if ($request->hasFile("profile_avatar")) {
                if ($avatar != null) {
                    Storage::delete("img/avatars/{$avatar}");
                }

                $extension = $request->profile_avatar->extension();
                $avatar    = "{$id}.{$extension}";
                $request->profile_avatar->storeAs("img/avatars", $avatar);
            }


            // Validasi jika email dirubah
            if ($request->profile_email != $user->profile_email) {
                $email = DB::table("profiles")
                    ->select("profile_email")
                    ->where([["user_id", "!=", $id], ["profile_email", "=", $request->profile_email]])
                    ->first();

                if (!empty($email->profile_email)) {
                    $request->validate([
                        "profile_email" => "unique:profiles,profile_email"
                    ]);
                }
            }

            // Simpan data perubahannya
            DB::table("profiles")
                ->where("user_id", $id)
                ->update([
                    "profile_avatar"   => htmlspecialchars($avatar),
                    "profile_name"     => htmlspecialchars(ucwords($request->profile_name)),
                    "profile_division" => empty($request->profile_division) ? null : htmlspecialchars(ucwords($request->profile_division)),
                    "profile_email"    => empty($request->profile_email) ? null : htmlspecialchars(strtolower($request->profile_email)),
                    "profile_phone"    => empty($request->profile_phone) ? null : htmlspecialchars(strtolower($request->profile_phone)),
                    "profile_address"  => empty($request->profile_address) ? null : htmlspecialchars($request->profile_address),
                    "updated_at"       => now(),
                ]);

            return response()->json([
                "message"   => "User profile updated successfully",
                "user_data" => DB::table("profiles")
                    ->select("profile_avatar", "profile_name", "profile_division", "profile_email", "profile_phone", "profile_address")
                    ->where("user_id", $id)
                    ->first(),
            ], 200);
        } else {
            return response()->json(["message" => "Access is denied"], 403);
        }
    }

    /**
     * @param User $user
     *
     * @return [type]
     */
    public function editAccount(User $user)
    {
        if ($this->userAccess("update")) {
            return response()->json([
                "user_data" => $user
            ]);
        } else {
            return response()->json(["message" => "Access is denied"], 403);
        }
    }

    /**
     * @param Request $request
     * @param User $user
     *
     * @return [type]
     */
    public function updateAccount(Request $request, User $user)
    {
        if ($this->userAccess("update")) {

            // Validasi request
            $request->validate([
                "username"  => "required|string|max:200",
                "password"  => "nullable|string|min:4|max:200",
                "is_active" => "required|boolean"
            ]);

            /**
             * Cek request username
             * Cek apakah username diubah atau tidak
             */
            if ($request->username != $user->username) {
                $username = User::where([["username", "=", $request->username], ["id", '!=', $user->id]])->first();
                if (!empty($username)) {
                    $request->validate([
                        "username"  => "unique:users,username",
                    ]);
                }
            }

            // Cek request password
            $password = $user->password;
            if (!empty($request->password)) {
                $password = bcrypt(htmlspecialchars($request->password));
            }

            // Simpan perubahan
            User::where("id", $user->id)->update([
                "username"   => htmlspecialchars($request->username),
                "password"   => $password,
                "is_active"  => $request->is_active,
                "updated_at" => now(),
            ]);

            // Response
            return response()->json([
                "message"   => "User account updated successfully",
                "user_data" => User::find($user->id),
            ], 200);
        } else {
            return response()->json(["message" => "Access is denied"], 403);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if (!$this->userAccess("read")) {
            return response()->json(["message" => "Access is denied"], 403);
        } else {
            $avatar = User::find($id)->profile()->select("profile_avatar")->first();
            if ($avatar->profile_avatar !== null) {
                Storage::delete("img/avatars/" . $avatar->profile_avatar);
            }
            User::destroy($id);
            return response()->json(["message" => "User deleted successfuly",], 200);
        }
    }

    /**
     * Mengosongkan token semua user
     */
    public function truncateTokens()
    {
        if ($this->userAccess("create") && $this->userAccess("read") && $this->userAccess("update") && $this->userAccess("delete")) {
            DB::table("personal_access_tokens")->truncate();
            return response()->json([
                "message" => "Truncate successfully"
            ], 200);
        } else {
            return response()->json(["message" => "Access is denied"], 403);
        }
    }


    /**
     * @param string $id
     *
     * @return \Illuminate\Http\Response
     */
    public function getUserMenuItems($id)
    {
        if ($this->userAccess("update")) {
            $user_menu_items = DB::table("user_menu_item")
                ->leftJoin("menu_items", "user_menu_item.menu_item_id", "=", "menu_items.id")
                ->select(
                    "user_menu_item.id",
                    "user_menu_item.user_m_i_create",
                    "user_menu_item.user_m_i_read",
                    "user_menu_item.user_m_i_update",
                    "user_menu_item.user_m_i_delete",
                    "menu_items.menu_i_title"
                )
                ->where("user_menu_item.user_id", $id)
                ->orderBy("user_menu_item.created_at", "desc")
                ->get();

            $menu_items = DB::table("menu_items")
                ->select("id", "menu_i_title")
                ->orderBy("menu_i_title", "asc")
                ->get();

            return response()->json([
                "menu_items" => $menu_items,
                "user_menu_items" => $user_menu_items,
            ], 200);
        } else {
            return response()->json(["message" => "Access is denied"], 403);
        }
    }



    /**
     * @param Request $request
     * @param string $id
     *
     * @return \Illuminate\Http\Response
     */
    public function addUserMenuItem(Request $request, string $id)
    {
        // Cek apakan user memeiliki akses update atau tidak
        if ($this->userAccess("update")) {
            $request->validate([
                "user_id"         => "required|string|max:36|exists:users,id",
                "menu_item_id"    => "required|string|max:36|exists:menu_items,id",
                "user_m_i_read"   => "required|boolean",
                "user_m_i_create" => "required|boolean",
                "user_m_i_update" => "required|boolean",
                "user_m_i_delete" => "required|boolean",
            ]);

            /**
             * Ambil data menu berdasarkan user id & menu item id
             * Lalu siman kedalam variabel $user_menu_item
             */
            $user_menu_item = DB::table("user_menu_item")->where([
                ["user_id", $id],
                ["menu_item_id", $request->menu_item_id],
            ])->first();

            // cek apakan menu ada atau tidak
            if (!empty($user_menu_item)) {

                /**
                 * kondisi jika menu yang dipilih sudah ada pada tabel
                 * Kembalikan response 422
                 */
                return response()->json([
                    "message" => "The menus is already on the list",
                ], 422);
            } else {

                /**
                 * Kondisi jika menu yang dipilih belum ada pada tabel sebelumnya
                 * tambahkan data ke tabel user_menu_item
                 */
                DB::table("user_menu_item")->insert([
                    "id"              => Str::random(32),
                    "user_id"         => htmlspecialchars($id),
                    "menu_item_id"    => htmlspecialchars($request->menu_item_id),
                    "user_m_i_read"   => htmlspecialchars($request->user_m_i_read),
                    "user_m_i_create" => htmlspecialchars($request->user_m_i_create),
                    "user_m_i_update" => htmlspecialchars($request->user_m_i_update),
                    "user_m_i_delete" => htmlspecialchars($request->user_m_i_delete),
                    "created_at"      => now(),
                    "updated_at"      => now(),
                ]);

                return response()->json([
                    "message"  => "1 menus added successfully",
                    "response" => $this->getUserMenuItems($id),
                ], 201);
            }
        } else {

            // Kondisi jika user tidak memiliki akses update
            return response()->json(["message" => "Access is denied"], 403);
        }
    }


    /**
     * @param string $id
     *
     * @return Response
     */
    public function deleteUserMenuItem(Request $request, string $id)
    {
        if ($this->userAccess("update")) {
            $delete = UserMenuItem::destroy($request->all());
            return response()->json([
                "message"  => "{$delete} Menus deleted successfully",
                "response" => $this->getUserMenuItems($id),
            ]);
        } else {
            return response()->json(["message" => "Access is denied"], 403);
        }
    }

    /**
     * @param string $id
     *
     * @return \Illuminate\Http\Response
     */
    public function getUserMenuSUbItems($id)
    {
        if ($this->userAccess("update")) {
            $user_msi = DB::table("user_menu_sub_item")
                ->leftJoin("menu_sub_items", "user_menu_sub_item.menu_sub_item_id", "=", "menu_sub_items.id")
                ->leftJoin("menu_items", "menu_sub_items.menu_item_id", "=", "menu_items.id")
                ->select(
                    "user_menu_sub_item.id",
                    "user_menu_sub_item.user_m_s_i_create",
                    "user_menu_sub_item.user_m_s_i_read",
                    "user_menu_sub_item.user_m_s_i_update",
                    "user_menu_sub_item.user_m_s_i_delete",
                    "menu_items.menu_i_title",
                    "menu_sub_items.menu_s_i_title"
                )
                ->where("user_menu_sub_item.user_id", $id)
                ->orderBy("user_menu_sub_item.created_at", "desc")
                ->get();

            $menu_items = DB::table("menu_items")
                ->leftJoin("user_menu_item", "menu_items.id", "=", "user_menu_item.menu_item_id")
                ->select("menu_items.id", "menu_items.menu_i_title", "menu_items.menu_i_children",)
                ->where([
                    ["user_menu_item.user_id", $id],
                    ["menu_items.menu_i_children", 1]
                ])
                ->orderBy("menu_i_title", "asc")
                ->get();

            $result_menus = [];
            foreach ($menu_items as $key => $value) {
                $result_menus[$key] = [
                    "id"              => $value->id,
                    "menu_i_title"    => $value->menu_i_title,
                    "menu_i_children" => $value->menu_i_children,
                    "menu_sub_items"  => DB::table("menu_sub_items")
                        ->select("id", "menu_s_i_title")
                        ->where("menu_item_id", $value->id)
                        ->orderBy("menu_s_i_title", "asc")
                        ->get(),
                ];
            }

            return response()->json([
                "menus" => $result_menus,
                "user_menu_sub_items" => $user_msi,
            ], 200);
        } else {
            return response()->json(["message" => "Access is denied"], 403);
        }
    }


    /**
     * @param Request $request
     * @param string $id
     *
     * @return \Illuminate\Http\Response
     */
    public function addUserMenuSubItems(Request $request, string $id)
    {
        if ($this->userAccess("update")) {

            // Validasi request
            $request->validate([
                "user_id"           => "required|string|max:36|exists:users,id",
                "menu_sub_item_id"  => "required|string|max:36|exists:menu_sub_items,id",
                "user_m_s_i_read"   => "required|boolean",
                "user_m_s_i_create" => "required|boolean",
                "user_m_s_i_update" => "required|boolean",
                "user_m_s_i_delete" => "required|boolean",
            ]);

            /**
             * Ambil data user menu sub item berdasarakan user id dam menu usb item id dari request
             */
            $user_msi = UserMenuSubItem::where([
                ["user_id", $id],
                ["menu_sub_item_id", htmlspecialchars($request->menu_sub_item_id)]
            ])->first();

            /**
             * Cek apakah menu yang dipilih sudah ada atau belum
             * Jika meu yang dilih kosong tambahkan data baru
             * Jika sudah ada kembalkan pesan kesalahan
             */
            if (empty($user_msi)) {

                // Tambahkan data baru
                DB::table("user_menu_sub_item")->insert([
                    "id"                => Str::random(32),
                    "user_id"           => htmlspecialchars($id),
                    "menu_sub_item_id"  => htmlspecialchars($request->menu_sub_item_id),
                    "user_m_s_i_read"   => htmlspecialchars($request->user_m_s_i_read),
                    "user_m_s_i_create" => htmlspecialchars($request->user_m_s_i_create),
                    "user_m_s_i_update" => htmlspecialchars($request->user_m_s_i_update),
                    "user_m_s_i_delete" => htmlspecialchars($request->user_m_s_i_delete),
                    "created_at"        => now(),
                    "updated_at"        => now(),
                ]);

                return response()->json([
                    "message"  => "1 sub menus added successfully",
                    "response" => $this->getUserMenuSubItems($id),
                ], 200);
            } else {
                return response()->json([
                    "message" => "The sub menus is already on the list",
                ], 422);
            }
        } else {
            return response()->json([
                "message" => "Access is denied"
            ], 403);
        }
    }


    /**
     * @param string $id
     *
     * @return Response
     */
    public function deleteUserMenuSubItems(Request $request, string $id)
    {
        if ($request->isMethod("delete")) {
            if ($this->userAccess("update")) {
                $delete = UserMenuSubItem::destroy($request->all());
                return response()->json([
                    "message"  => "{$delete} Sub menus deleted successfully",
                    "response" => $this->getUserMenuSubItems($id),
                ]);
            } else {
                return response()->json([
                    "message" => "Access is denied",
                ], 403);
            }
        } else {
            return response()->json([
                "message" => "Method not allowed"
            ], 405);
        }
    }


    /**
     * @param Request $request
     * @param string $id
     *
     * @return Response
     */
    public function updatePassword(Request $request, string $id)
    {
        // Cek akses user
        if ($this->userAccess("update")) {

            // cek method yang dikirim
            if ($request->isMethod("patch")) {

                // validasi request
                $request->validate([
                    "password" => "required|string|max:128"
                ]);

                // update password
                User::where("id", htmlspecialchars($id))->update([
                    "password" => bcrypt(htmlspecialchars($request->password))
                ]);

                // response password berhasil di update
                return response()->json([
                    "message" => "Password updated successfully"
                ], 200);
            } else {

                // response method tidak sesuai permintaan
                return response()->json([
                    "message" => "Method not allowed"
                ], 405);
            }
        } else {

            // response akses user ditolak
            return response()->json(["message" => "Access is denied"], 403);
        }
    }
}
