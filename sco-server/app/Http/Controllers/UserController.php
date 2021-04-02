<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile;
use App\Models\MenuItem;
use App\Models\MenuSubItem;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Traits\ClearStrTrait;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    use ClearStrTrait;


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // Cek baris perhalaman
        $per_page = 25;
        if (isset($request->per_page)) {
            if ($request->per_page >= 250) {
                $per_page = 250;
            } else if ($request->per_page >= 100) {
                $per_page = 100;
            } else if ($request->per_page >= 50) {
                $per_page = 50;
            }
        }

        // Cek sort
        $sort = "profile_name";
        if (isset($request->sort)) {
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
        if (isset($request->order_by)) {
            if ($this->clearStr($request->order_by, "lower") === 'desc') {
                $order_by = "desc";
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
            ->where("users.username", "like", "%{$search}%")
            ->orWhere("profiles.profile_name", "like", "%{$search}%")
            ->orWhere("profiles.profile_division", "like", "%{$search}%")
            ->orderBy($sort, $order_by)
            ->paginate($per_page);

        // response berhasil
        return response()->json([
            "users"    => $data,
            "sort"     => $sort,
            "order_by" => $order_by,
            "search"   => $search,
        ], 200);
    }

    /**
     * Method untuk mengambil data user & profile setelah action
     */
    private function getDataUsers(String $sort = "profile_name", String $order_by = 'asc')
    {
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
            ->orderBy($this->clearStr($sort, "lower"), $this->clearStr($order_by, "lower"))
            ->paginate(25);

        return [
            "users"    => $data,
            "sort"     => $this->clearStr($sort, "lower"),
            "order_by" => $this->clearStr($order_by, "lower"),
            "search"   => "",
        ];
    }

    /**
     * Method untuk mengambil data menu sub items setelah action
     */
    private function getDataMenus()
    {
        // Ambil data menu items
        $menu_items = MenuItem::orderBy("menu_i_title", "asc")->paginate(25);

        // Ambil data menu sib items
        $menu_sub_items = MenuSubItem::leftJoin(
            "menu_items",
            "menu_sub_items.menu_item_id",
            "=",
            "menu_items.id"
        )->select(
            "menu_items.menu_i_title",
            "menu_sub_items.id",
            "menu_sub_items.menu_item_id",
            "menu_sub_items.menu_s_i_icon",
            "menu_sub_items.menu_s_i_title",
            "menu_sub_items.menu_s_i_url",
            "menu_sub_items.created_at",
            "menu_sub_items.updated_at"
        )->orderBy("menu_items.menu_i_title", "asc")->paginate(25);

        return [
            "menu_items" => [
                "result" => $menu_items,
                "sort" => "menu_i_title",
                "order_by" => "asc",
                "search" => "",
            ],
            "menu_sub_items" => [
                "result" => $menu_sub_items,
                "sort" => "menu_i_title",
                "order_by" => "asc",
                "search" => "",
            ]
        ];
    }


    /**
     * Method create
     * Method untuk mengambil data untuk kebutuhan create new user
     */
    public function create()
    {
        return response()->json([
            "menus" => $this->getDataMenus()
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
            "division"  => "required|string|max:100",
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
            "profile_email"    => !empty($request->email) ? $this->clearStr($request->email) : null,
            "profile_phone"    => !empty($request->phone) ? $this->clearStr($request->phone, "lower") : null,
            "profile_address"  => !empty($request->address) ? $this->clearStr($request->address) : null,
        ]);


        // Buat user log
        User::find(Auth::user()->id)
            ->userLog()
            ->create(["log_desc" => "Create a new user ({$user->username})"]);

        // response berhasil
        return response()->json([
            "user_id" => $user->id,
            "message" => "User account & profile created successfully",
            "result" => $this->getDataUsers("created_at", "desc")
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
                "created_at"      => now(),
                "updated_at"      => now(),
            ];
        }

        $menu_sub_items = [];
        foreach ($request->user_menu_sub_item as $key_sub_item => $sub_item) {
            $menu_sub_items[$key_sub_item] = [
                "id"               => Str::random(32),
                "user_id"          => $sub_item["user_id"],
                "menu_sub_item_id" => $sub_item["menu_sub_item_id"],
                "read"             => $sub_item["read"],
                "create"           => $sub_item["create"],
                "update"           => $sub_item["update"],
                "delete"           => $sub_item["delete"],
                "created_at"       => now(),
                "updated_at"       => now(),
            ];
        }

        DB::table("user_menu_item")->insert($menu_items);
        DB::table("user_menu_sub_item")->insert($menu_sub_items);

        return response()->json([
            "message" => "1 User created succcessfully",
            "result" => $this->getDataUsers("created_at", "desc")
        ], 200);
    }

    /**
     * Mengosongkan semua token user
     * @return Object
     */
    public function truncateTokens()
    {
        // Hapus dari database
        DB::table("personal_access_tokens")->truncate();

        // Buat user log
        User::find(Auth::user()->id)
            ->userLog()
            ->create(["log_desc" => "Deletes all user tokens"]);

        // Response berhasil
        return response()->json([
            "message" => "Truncate successfully"
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        $avatar = User::find($user->id)->profile()->first(); // Ambil data avatar
        if ($avatar->profile_avatar !== null) { // cek apakah avatar ada atau bernilai null
            Storage::delete("img/avatars/" . $avatar->profile_avatar); // jika ada hapus dari storage
        }

        User::destroy($user->id); // hapus data user beserta selusuh relasinya

        // Buat user log
        User::find(Auth::user()->id)
            ->userLog()
            ->create(["log_desc" => "Delete user ({$user->username})"]);

        // response berhasil
        return response()->json([
            "message" => "User deleted successfuly",
            "result" => $this->getDataUsers()
        ], 200);
    }

    /**
     * @param Request $request
     * @param string $id
     *
     * @return Response
     */
    public function updatePassword(Request $request, User $user)
    {
        // validasi request
        $request->validate(["password"  => "required|string|min:6|max:200"]);

        // update password
        User::where("id", $user->id)->update(["password" => bcrypt($this->clearStr($request->password))]);

        // Buat user log
        User::find(Auth::user()->id)
            ->userLog()
            ->create(["log_desc" => "Update user password ({$user->username})"]);

        // response password berhasil di update
        return response()->json([
            "message" => "Password {$user->username} updated successfully",
            "result" => $this->getDataUsers("updated_at", "desc")
        ], 200);
    }


    /**
     * @param User $user
     *
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        $account = User::findOrFail($user->id); // ambil data user
        $profile = User::findOrFail($user->id)->profile()->first(); // ambil data profile

        // ambil data menu item
        $menu_items = DB::table("user_menu_item")
            ->leftJoin("menu_items", "user_menu_item.menu_item_id", "menu_items.id")
            ->where("user_menu_item.user_id", $user->id)
            ->get();

        // ambil data menu sub item
        $menu_sub_items = DB::table("user_menu_sub_item")
            ->leftJoin("menu_sub_items", "user_menu_sub_item.menu_sub_item_id", "menu_sub_items.id")
            ->where("user_menu_sub_item.user_id", $user->id)
            ->get();

        // ambil data user logs
        $logs = User::findOrFail($user->id)->userLog()
            ->offset(0)
            ->limit(50)
            ->orderBy("created_at", "desc")
            ->get();

        // response berhasil
        return response()->json([
            "account"        => $account,
            "profile"        => $profile,
            "menu_items"     => $menu_items,
            "menu_sub_items" => $menu_sub_items,
            "logs"           => $logs,
        ], 200);
    }

    /**
     * Method untuk menghapus logs user
     *
     * @param User $user
     */
    public function clearUserLogs(User $user)
    {

        // Hapus user log berdasarkan user yang dipilih
        User::findOrFail($user->id)->userLog()->delete();

        // Buat user log
        User::find(Auth::user()->id)
            ->userLog()
            ->create(["log_desc" => "Cleaning up the {$user->username} logs"]);

        // response berhasil
        return response()->json([
            "message" => "All the logs from {$user->username} have been cleared",
            "result" => $this->getDataUsers()
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(User $user)
    {
        $account = User::findOrFail($user->id); // ambil data user
        $profile = User::findOrFail($user->id)->profile()->first(); // ambil data profile

        // ambil data menu item
        $menu_items = DB::table("user_menu_item")
            ->leftJoin("menu_items", "user_menu_item.menu_item_id", "menu_items.id")
            ->where("user_menu_item.user_id", $user->id)
            ->get();

        // ambil data menu sub item
        $menu_sub_items = DB::table("user_menu_sub_item")
            ->leftJoin("menu_sub_items", "user_menu_sub_item.menu_sub_item_id", "menu_sub_items.id")
            ->where("user_menu_sub_item.user_id", $user->id)
            ->get();

        // ambil data user logs
        $logs = User::findOrFail($user->id)->userLog()
            ->offset(0)
            ->limit(50)
            ->orderBy("created_at", "desc")
            ->get();

        // response berhasil
        return response()->json([
            "account"        => $account,
            "profile"        => $profile,
            "menu_items"     => $menu_items,
            "menu_sub_items" => $menu_sub_items,
            "logs"           => $logs,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        // validasi request
        $request->validate([
            "username"  => "required|string|max:100",
            "password"  => "nullable|string",
            "is_active" => "required|boolean",
            "name"      => "required|string|max:100",
            "avatar"    => "nullable",
            "division"  => "required|string|max:100",
            "email"     => "nullable|email:filter|max:200",
            "phone"     => "nullable|string|max:16",
            "address"   => "nullable|string|max:400",
        ]);


        // validasi username
        if ($request->username != $user->username) {
            $request->validate(["username" => "unique:users,username"]);
        }

        // validasi password
        $password = $user->password;
        if (!empty($request->password)) {
            $request->validate(["passowrd" => "min:6|max:200"]);
            $password = $this->clearStr(bcrypt($request->password));
        }

        // ambil data profile
        $profile = User::find($user->id)->profile()->first();

        // validasi avatar
        $avatar = $profile->profile_avatar;
        if ($request->hasFile("avatar")) {
            $request->validate(["avatar" => "image|mimes:jpeg,jpg,png|max:1000"]);

            if ($avatar != null) {
                Storage::delete("img/avatars/{$avatar}");
            }

            $extension = $request->avatar->extension();
            $avatar    = "{$user->id}.{$extension}";
            $request->avatar->storeAs("img/avatars", $avatar);
        }

        // validasi email
        if ($request->email != $profile->profile_email) {
            $request->validate(["email" => "unique:profiles,profile_email"]);
        }

        // ubah data user account
        User::where('id', $user->id)->update([
            "username"  => $this->clearStr($request->username),
            "password"  => $password,
            "is_active" => $request->is_active
        ]);

        // update data profile
        Profile::where("user_id", $user->id)->update([
            "profile_avatar"   => $this->clearStr($avatar),
            "profile_name"     => $this->clearStr($request->name, "proper"),
            "profile_division" => empty($request->division) ? null : $this->clearStr($request->division, "proper"),
            "profile_email"    => empty($request->email) ? null : $this->clearStr($request->email, "lower"),
            "profile_phone"    => empty($request->phone) ? null : $this->clearStr($request->phone),
            "profile_address"  => empty($request->address) ? null : $this->clearStr($request->address),
        ]);

        // Buat user log
        User::find(Auth::user()->id)
            ->userLog()
            ->create(["log_desc" => "Updated {$this->clearStr($request->username)}"]);

        return response()->json([
            "message" => 'User account and profile updated successfully',
            "result" => $this->getDataUsers(),
        ], 200);
    }

    /**
     * Update menu akses user || pengguna
     *
     * @param Request $request
     * @param User $user
     *
     * @return Object
     */
    public function updateMenuAccess(Request $request, User $user)
    {
        $request->validate([
            'user_menu_item' => 'array',
            'user_menu_sub_item' => 'array',
        ]);


        // buat variable dan simpan data request user_menu_item ke dalam variable
        $menu_items = [];
        foreach ($request->user_menu_item as $key => $value) {
            $menu_items[$key] = [
                "id"              => Str::random(32),
                "user_id"         => $value["user_id"],
                "menu_item_id"    => $value["menu_item_id"],
                "created_at"      => now(),
                "updated_at"      => now(),
            ];
        }

        // buat variable dan simpan data request user_menu_sub_item ke dalam variable
        $menu_sub_items = [];
        foreach ($request->user_menu_sub_item as $key_sub_item => $sub_item) {
            $menu_sub_items[$key_sub_item] = [
                "id"               => Str::random(32),
                "user_id"          => $sub_item['user_id'],
                "menu_sub_item_id" => $sub_item['menu_sub_item_id'],
                "read"             => $sub_item['read'],
                "create"           => $sub_item['create'],
                "update"           => $sub_item['update'],
                "delete"           => $sub_item['delete'],
                "created_at"       => now(),
                "updated_at"       => now(),
            ];
        }

        // Hapus data user_menu_item & user_menu_sub_item berdasarkan user yang diedit
        DB::table("user_menu_item")->where("user_id", $user->id)->delete();
        DB::table("user_menu_sub_item")->where("user_id", $user->id)->delete();

        // Simpan data user_menu_item & user_menu_sub_item yang baru ke databse
        DB::table("user_menu_item")->insert($menu_items);
        DB::table("user_menu_sub_item")->insert($menu_sub_items);

        // Buat user log
        User::find(Auth::user()->id)
            ->userLog()
            ->create(["log_desc" => "Update user access menu ({$user->username})"]);

        // Response berhasil
        return response()->json([
            'message' => "User access menu updated successfully",
        ], 200);
    }
}
