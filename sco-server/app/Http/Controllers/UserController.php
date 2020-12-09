<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\MenuItem;
use App\Models\UserMenuItem;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{

    /**
     * User menu access
     */
    private function userAccess()
    {
        $user_login = Auth::user();
        $menu = MenuItem::select("id")->where("menu_i_url", "/user")->first();

        if (!empty($menu)) {
            return DB::table("user_menu_item")->where([
                ["user_id", $user_login->id],
                ["menu_item_id", $menu->id]
            ])->first();
        } else {
            return;
        }
    }

    // Ambil semua menu
    public function getMenus()
    {
        if (empty($this->userAccess()) || $this->userAccess()->user_m_i_read != 1) {
            return response()->json([
                "message" => "Access denied",
            ], 403);
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
        if (empty($this->userAccess()) || $this->userAccess()->user_m_i_read != 1) {
            return response()->json([
                "message" => "Access denied",
            ], 403);
        } else {
            $data     = [];
            $per_page = htmlspecialchars($request->per_page);
            $search   = htmlspecialchars($request->search);
            $sort     = htmlspecialchars($request->sort);
            $order_by = htmlspecialchars($request->order_by);

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
                    "profiles.profile_email",
                    "profiles.profile_division",
                    "profiles.profile_phone",
                    "profiles.profile_address",
                    "personal_access_tokens.token",
                )
                ->where("users.username", "like", "%" . $search . "%")
                ->orWhere("users.is_active", "like", "%" . $search . "%")
                ->orWhere("users.created_at", "like", "%" . $search . "%")
                ->orWhere("users.updated_at", "like", "%" . $search . "%")
                ->orWhere("profiles.profile_name", "like", "%" . $search . "%")
                ->orWhere("profiles.profile_email", "like", "%" . $search . "%")
                ->orWhere("profiles.profile_division", "like", "%" . $search . "%")
                ->orWhere("profiles.profile_phone", "like", "%" . $search . "%")
                ->orWhere("profiles.profile_address", "like", "%" . $search . "%")
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
        if (empty($this->userAccess()) || $this->userAccess()->user_m_i_create != 1) {
            return response()->json([
                "message" => "Access denied",
            ], 403);
        } else {
            $request->validate([
                "username"  => "required|string|unique:users,username|max:255",
                "password"  => "required|string|min:4|max:255",
                "is_active" => "required|boolean"
            ]);

            return response()->json([
                "message" => "success",
                "form_data" => [
                    "username"  => htmlspecialchars($request->username),
                    "password"  => htmlspecialchars($request->password),
                    "is_active" => $request->is_active ? "1" : "0",
                    "id"        => Str::uuid(),
                ]
            ], 200);
        }
    }

    /**
     * Cek form user profile
     */
    public function cekProfileForm(Request $request)
    {
        if (empty($this->userAccess()) || $this->userAccess()->user_m_i_create != 1) {
            return response()->json([
                "message" => "Access denied",
            ], 403);
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
        if (empty($this->userAccess()) || $this->userAccess()->user_m_i_create != 1) {
            return response()->json([
                "message" => "Access denied",
            ], 403);
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
                $avatar    = "user-" . $user->id . "." . $extension;
                $request->profile_avatar->storeAs("img/avatars", $avatar);
            }

            // Menambahkan profile sesuai dengan user yang baru dibuat
            $profile = $user->profile()->create([
                "user_id"          => $user->id,
                "profile_avatar"   => $avatar,
                "profile_name"     => htmlspecialchars(ucwords($request->profile_name)),
                "profile_division" => $request->profile_division == "" ? null : htmlspecialchars(ucwords($request->profile_division)),
                "profile_email"    => $request->profile_email == "" ? null : htmlspecialchars($request->profile_email),
                "profile_phone"    => $request->profile_phone == "" ? null : htmlspecialchars($request->profile_phone),
                "profile_address"  => $request->profile_address == "" ? null : htmlspecialchars($request->profile_address),
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
        if (empty($this->userAccess()) || $this->userAccess()->user_m_i_create != 1) {
            return response()->json([
                "message" => "Access denied",
            ], 403);
        } else {
            $menu_items = [];
            foreach ($request->user_menu_item as $key => $value) {
                $menu_items[$key] = [
                    "id"              => Str::uuid(),
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
                    "id"                => Str::uuid(),
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
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        if (empty($this->userAccess()) || $this->userAccess()->user_m_i_update != 1) {
            return response()->json([
                "message" => "Access denied",
            ], 403);
        } else {
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if (empty($this->userAccess()) || $this->userAccess()->user_m_i_delete != 1) {
            return response()->json([
                "message" => "Access denied",
            ], 403);
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
        if (!empty($this->userAccess()) && $this->userAccess()->user_m_i_create == 1 && $this->userAccess()->user_m_i_read == 1 && $this->userAccess()->user_m_i_update == 1 && $this->userAccess()->user_m_i_delete == 1) {
            DB::table("personal_access_tokens")->truncate();
            return response()->json([
                "message" => "Truncate successfully"
            ], 200);
        } else {
            return response()->json([
                "message" => "Access denied",
            ], 403);
        }
    }


    /**
     * @param string $id
     *
     * @return \Illuminate\Http\Response
     */
    public function getUserMenuItems($id)
    {
        if (!empty($this->userAccess()) && $this->userAccess()->user_m_i_update == 1) {
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
            return response()->json([
                "message" => "Access denied",
            ], 403);
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
        if (!empty($this->userAccess()) && $this->userAccess()->user_m_i_update == 1) {
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
                    "message" => "The menu item is already on the list",
                ], 422);
            } else {

                /**
                 * Kondisi jika menu yang dipilih belum ada pada tabel sebelumnya
                 * tambahkan data ke tabel user_menu_item
                 */
                DB::table("user_menu_item")->insert([
                    "id"              => Str::uuid(),
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
                    "message"  => "1 menu item added successfully",
                    "response" => $this->getUserMenuItems($id),
                ], 201);
            }
        } else {

            // Kondisi jika user tidak memiliki akses update
            return response()->json([
                "message" => "Access denied",
            ], 403);
        }
    }


    /**
     * @param string $id
     *
     * @return Response
     */
    public function deleteUserMenuItem(Request $request, string $id)
    {
        if (!empty($this->userAccess()) && $this->userAccess()->user_m_i_update == 1) {
            $delete = UserMenuItem::destroy($request->all());
            return response()->json([
                "message"  => "{$delete} Menu item deleted successfully",
                "response" => $this->getUserMenuItems($id),
            ]);
        } else {
            return response()->json([
                "message" => "Access denied",
            ], 403);
        }
    }

    /**
     * @param string $id
     *
     * @return \Illuminate\Http\Response
     */
    public function getUserMenuSUbItems($id)
    {
        if (!empty($this->userAccess()) && $this->userAccess()->user_m_i_update == 1) {
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
                        ->where('menu_item_id', $value->id)
                        ->orderBy("menu_s_i_title", "asc")
                        ->get(),
                ];
            }

            return response()->json([
                "menus" => $result_menus,
                "user_menu_sub_items" => $user_msi,
            ], 200);
        } else {
            return response()->json([
                "message" => "Access denied",
            ], 403);
        }
    }
}
