<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\MenuItem;
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
        $menu = MenuItem::select('id')->where('menu_i_url', '/user')->first();

        if (!empty($menu)) {
            return DB::table('user_menu_item')->where([
                ['user_id', $user_login->id],
                ['menu_item_id', $menu->id]
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
                'message' => 'Access denied',
            ], 403);
        } else {
            $menu_items = DB::table('menu_items')
                ->select('id', 'menu_i_title', 'menu_i_children')
                ->orderBy('menu_i_title', 'asc')
                ->get();

            $menu_sub_items =  DB::table('menu_sub_items')
                ->leftJoin('menu_items', 'menu_sub_items.menu_item_id', '=', 'menu_items.id')
                ->select(
                    'menu_items.menu_i_title',
                    'menu_sub_items.id',
                    'menu_sub_items.menu_item_id',
                    'menu_sub_items.menu_s_i_title'
                )
                ->orderBy('menu_sub_items.menu_s_i_title', 'asc')
                ->get();

            return response()->json([
                'menu_items' => $menu_items,
                'menu_sub_items' => $menu_sub_items,
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
                'message' => 'Access denied',
            ], 403);
        } else {
            $data     = [];
            $per_page = htmlspecialchars($request->per_page);
            $search   = htmlspecialchars($request->search);
            $sort     = htmlspecialchars($request->sort);
            $order_by = htmlspecialchars($request->order_by);

            $data = DB::table('users')
                ->leftJoin('profiles', 'users.id', '=', 'profiles.user_id')
                ->leftJoin('personal_access_tokens', 'users.id', '=', 'personal_access_tokens.tokenable_id')
                ->select(
                    'users.id',
                    'users.username',
                    'users.is_active',
                    'users.created_at',
                    'users.updated_at',
                    'profiles.profile_avatar',
                    'profiles.profile_name',
                    'profiles.profile_email',
                    'profiles.profile_division',
                    'profiles.profile_phone',
                    'profiles.profile_address',
                    'personal_access_tokens.token',
                )
                ->where('users.username', 'like', '%' . $search . '%')
                ->orWhere('users.is_active', 'like', '%' . $search . '%')
                ->orWhere('users.created_at', 'like', '%' . $search . '%')
                ->orWhere('users.updated_at', 'like', '%' . $search . '%')
                ->orWhere('profiles.profile_name', 'like', '%' . $search . '%')
                ->orWhere('profiles.profile_email', 'like', '%' . $search . '%')
                ->orWhere('profiles.profile_division', 'like', '%' . $search . '%')
                ->orWhere('profiles.profile_phone', 'like', '%' . $search . '%')
                ->orWhere('profiles.profile_address', 'like', '%' . $search . '%')
                ->orderBy($sort, $order_by)
                ->paginate($per_page);

            return response()->json([
                'users'    => $data,
                'search'   => $search,
                'sort'     => $sort,
                'order_by' => $order_by
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
                'message' => 'Access denied',
            ], 403);
        } else {
            $request->validate([
                'username'  => 'required|string|unique:users,username|max:255',
                'password'  => 'required|string|min:4|max:255',
                'is_active' => 'required|boolean'
            ]);

            return response()->json([
                'message' => 'success',
                'form_data' => [
                    'username'  => htmlspecialchars($request->username),
                    'password'  => htmlspecialchars($request->password),
                    'is_active' => $request->is_active ? '1' : '0',
                    'id'        => Str::uuid(),
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
                'message' => 'Access denied',
            ], 403);
        } else {
            $request->validate([
                'user_id'          => 'required|string',
                'profile_avatar'   => 'nullable|image|mimes:jpeg,jpg,png|max:1000',
                'profile_name'     => 'required|string|max:200',
                'profile_division' => 'nullable|string|max:128',
                'profile_email'    => 'nullable|email:rfc,dns,filter|unique:profiles,profile_email|max:200',
                'profile_phone'    => 'nullable|string|max:32',
                'profile_address'  => 'nullable|string',
            ]);

            $avatar = false;
            if ($request->hasFile('profile_avatar')) {
                $avatar = true;
            }

            return response()->json([
                'message' => 'success',
                'form_data' => [
                    'user_id'          => htmlspecialchars($request->user_id),
                    'profile_avatar'   => $avatar,
                    'profile_name'     => htmlspecialchars(ucwords($request->profile_name)),
                    'profile_division' => htmlspecialchars(ucwords($request->profile_division)),
                    'profile_email'    => htmlspecialchars($request->profile_email),
                    'profile_phone'    => htmlspecialchars($request->profile_phone),
                    'profile_address'  => htmlspecialchars($request->profile_address),
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
                'message' => 'Access denied',
            ], 403);
        } else {
            // validasi form
            $request->validate([
                'username'         => 'required|string|unique:users,username|max:255',
                'password'         => 'required|string|min:4|max:255',
                'is_active'        => 'required|boolean',
                'profile_name'     => 'required|string|max:200',
                'profile_avatar'   => 'nullable|image|mimes:jpeg,jpg,png|max:1000',
                'profile_division' => 'nullable|string|max:128',
                'profile_email'    => 'nullable|email:rfc,dns,filter|unique:profiles,profile_email|max:200',
                'profile_phone'    => 'nullable|string|max:32',
                'profile_address'  => 'nullable|string',
            ]);

            // Menambahkan user baru
            $user = User::create([
                'id'        => htmlspecialchars($request->id),
                'username'  => htmlspecialchars($request->username),
                'password'  => htmlspecialchars(bcrypt($request->password)),
                'is_active' => htmlspecialchars($request->is_active),
            ]);

            /**
             * Cek apakah avatar di upload atau tidak
             * Jika tidak gudakan avatar default.jpg
             * Jika ya simpan di storage
             */
            $avatar = null;
            if ($request->hasFile('profile_avatar')) {
                $extension = $request->profile_avatar->extension();
                $avatar    = 'user-' . $user->id . '.' . $extension;
                $request->profile_avatar->storeAs('img/avatars', $avatar);
            }

            // Menambahkan profile sesuai dengan user yang baru dibuat
            $profile = $user->profile()->create([
                'user_id'          => $user->id,
                'profile_avatar'   => $avatar,
                'profile_name'     => htmlspecialchars(ucwords($request->profile_name)),
                'profile_division' => $request->profile_division == '' ? null : htmlspecialchars(ucwords($request->profile_division)),
                'profile_email'    => $request->profile_email == '' ? null : htmlspecialchars($request->profile_email),
                'profile_phone'    => $request->profile_phone == '' ? null : htmlspecialchars($request->profile_phone),
                'profile_address'  => $request->profile_address == '' ? null : htmlspecialchars($request->profile_address),
            ]);

            // response
            return response()->json([
                'user'    => $user,
                'profile' => $profile,
            ], 200);
        }
    }

    public function createUserMenuAccess(Request $request)
    {
        if (empty($this->userAccess()) || $this->userAccess()->user_m_i_create != 1) {
            return response()->json([
                'message' => 'Access denied',
            ], 403);
        } else {
            $user_menu_item = DB::table('user_menu_item')->insert($request->user_menu_item);
            $user_menu_sub_item = DB::table('user_menu_sub_item')->insert($request->user_menu_sub_item);
            return response()->json([
                'user_menu_item' => $user_menu_item,
                'user_menu_sub_item' => $user_menu_sub_item,
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
                'message' => 'Access denied',
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
                'message' => 'Access denied',
            ], 403);
        } else {
            $avatar = User::find($id)->profile()->select('profile_avatar')->first();
            if ($avatar->profile_avatar !== null) {
                Storage::delete('img/avatars/' . $avatar->profile_avatar);
            }
            User::destroy($id);
            return response()->json(['message' => 'User deleted successfuly',], 200);
        }
    }

    /**
     * Mengosongkan token semua user
     */
    public function truncateTokens()
    {
        if (!empty($this->userAccess()) && $this->userAccess()->user_m_i_create == 1 && $this->userAccess()->user_m_i_read == 1 && $this->userAccess()->user_m_i_update == 1 && $this->userAccess()->user_m_i_delete == 1) {
            DB::table('personal_access_tokens')->truncate();
            return response()->json([
                'message' => 'Truncate successfully'
            ], 200);
        } else {
            return response()->json([
                'message' => 'Access denied',
            ], 403);
        }
    }


    /**
     * Mengambil akses data menu item berdasarkan id user
     * Mengambil semua data menu items
     */
    public function getMenuItems($id)
    {
        if (!empty($this->userAccess()) && $this->userAccess()->user_m_i_update == 1) {
            $menu_items = DB::table('menu_items')
                ->select('id', 'menu_i_title')
                ->get();

            $user = User::find($id);

            $user_menu_items = $user->menuItem()->get();

            return response()->json([
                'menu_items' => $menu_items,
                'user_menu_items' => $user_menu_items,
            ], 200);
        } else {
            return response()->json([
                'message' => 'Access denied',
            ], 403);
        }
    }
}
