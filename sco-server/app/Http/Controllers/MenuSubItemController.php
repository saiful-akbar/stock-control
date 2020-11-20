<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Models\MenuSubItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class MenuSubItemController extends Controller
{
    /**
     * User menu access
     */
    private function userAccess()
    {
        $user_login = Auth::user();
        $menu = MenuItem::select('id')->where('menu_i_url', '/menu')->first();

        if (!empty($menu)) {
            return DB::table('user_menu_item')->where([
                ['user_id', $user_login->id],
                ['menu_item_id', $menu->id]
            ])->first();
        } else {
            return;
        }
    }

    // Ambil semua data menu item yang children nya true/1
    private function getMenuItems()
    {
        return DB::table('menu_items')
            ->select('id', 'menu_i_title')
            ->where('menu_i_children', '=', '1')
            ->get();
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
                'message' => 'Access forbidden',
            ], 403);
        } else {
            $data = [];
            $per_page = htmlspecialchars($request->per_page);
            $search = htmlspecialchars($request->search);
            $sort = htmlspecialchars($request->sort);
            $order_by = htmlspecialchars($request->order_by);

            if (isset($search) && !empty($search)) {
                $data = DB::table('menu_sub_items')
                    ->leftJoin('menu_items', 'menu_sub_items.menu_item_id', '=', 'menu_items.id')
                    ->select(
                        'menu_items.menu_i_title',
                        'menu_sub_items.id',
                        'menu_sub_items.menu_item_id',
                        'menu_sub_items.menu_s_i_title',
                        'menu_sub_items.menu_s_i_url',
                        'menu_sub_items.created_at',
                        'menu_sub_items.updated_at'
                    )->where('menu_items.menu_i_title', 'like', '%' . $search . '%')
                    ->orWhere('menu_sub_items.menu_s_i_title', 'like', '%' . $search . '%')
                    ->orWhere('menu_sub_items.menu_s_i_url', 'like', '%' . $search . '%')
                    ->orWhere('menu_sub_items.created_at', 'like', '%' . $search . '%')
                    ->orWhere('menu_sub_items.updated_at', 'like', '%' . $search . '%')
                    ->orderBy($sort, $order_by)
                    ->paginate($per_page);
            } else {
                $data = DB::table('menu_sub_items')
                    ->leftJoin('menu_items', 'menu_sub_items.menu_item_id', '=', 'menu_items.id')
                    ->select(
                        'menu_items.menu_i_title',
                        'menu_sub_items.id',
                        'menu_sub_items.menu_item_id',
                        'menu_sub_items.menu_s_i_title',
                        'menu_sub_items.menu_s_i_url',
                        'menu_sub_items.created_at',
                        'menu_sub_items.updated_at'
                    )->orderBy($sort, $order_by)
                    ->paginate($per_page);
            }
            return response()->json([
                'menu_sub_items' => $data,
                'menu_items' => $this->getMenuItems(),
                'search' => $search,
                'sort' => $sort,
                'order_by' => $order_by
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
                'message' => 'Access forbidden',
            ], 403);
        } else {
            // validasi form inputan
            $request->validate([
                'menu_item' => 'required|Exists:menu_items,id',
                'title'     => 'required|max:128|unique:menu_sub_items,menu_s_i_title',
                'url'       => 'required|max:128|unique:menu_sub_items,menu_s_i_url',
            ]);

            /**
             * mengganti spasi dengan "/"
             * cek apakah karakter pertama "/" atau bukan
             * jika bukan tabahkan "/"
             */
            $url = str_replace(' ', '/', $request->url);
            if (substr($url, 0, 1) != '/') {
                $url = '/' . $url;
            }

            /**
             * cek apakah kata pertama sama dengan url menu item
             * jika bukan gabungkan url menu item dengan url menu sub item yang baru
             */
            $menu_item = DB::table('menu_items')->select('menu_i_url')->where('id', $request->menu_item)->first();
            if ($menu_item->menu_i_url != substr($url, 0, strlen($menu_item->menu_i_url))) {
                $url = $menu_item->menu_i_url . $url;
            }

            /**
             * cek apakan ada url yang sama pada record dengan url hasil request
             * jika ada kembalikan pesan error
             * jika tidak lanjutkan create menu sub item
             */
            if (MenuSubItem::where('menu_s_i_url', $url)->count() >= 1) {
                return response()->json([
                    'errors' => ['url' => ['The url has already been taken.']],
                    'message' => 'The given data was invalid.'
                ], 422);
            }

            // propses menambahkan data baru
            MenuSubItem::create([
                'menu_item_id'   => htmlspecialchars($request->menu_item),
                'menu_s_i_title' => htmlspecialchars(ucwords($request->title)),
                'menu_s_i_url'   => htmlspecialchars(strtolower($url)),
            ]);

            return response()->json(['message' => 'Menu sub item created successfuly'], 200);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\MenuSubItem  $menuSubItem
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, MenuSubItem $menuSubItem)
    {
        if (empty($this->userAccess()) || $this->userAccess()->user_m_i_update != 1) {
            return response()->json([
                'message' => 'Access forbidden',
            ], 403);
        } else {
            // validasi form
            $request->validate([
                'menu_item' => 'required|Exists:menu_items,id',
                'title'     => 'required|max:128',
                'url'       => 'required|max:128',
            ]);

            /**
             * mengganti spasi dengan "/"
             * cek apakah karakter pertama "/" atau bukan
             * jika bukan tabahkan "/"
             */
            $url = str_replace(' ', '/', $request->url);
            if (substr($url, 0, 1) != '/') {
                $url = '/' . $url;
            }

            /**
             * cek apakah kata pertama sama dengan url menu item
             * jika bukan gabungkan url menu item dengan url menu sub item yang baru
             */
            $menu_item = DB::table('menu_items')->select('menu_i_url')->where('id', $request->menu_item)->first();
            if ($menu_item->menu_i_url != substr($url, 0, strlen($menu_item->menu_i_url))) {
                $url = $menu_item->menu_i_url . $url;
            }

            /**
             * cek apakah url request != url yang sebelumnya
             * jika tidak. Cek apakah url hasil request sudah pernah dipakai atau belum
             */
            if ($url != $menuSubItem->menu_s_i_url) {
                if (MenuSubItem::where('menu_s_i_url', $url)->count() >= 1) {
                    return response()->json([
                        'errors' => ['url' => ['The url has already been taken.']],
                        'message' => 'The given data was invalid.'
                    ], 422);
                }
            }

            /**
             * cek apakah title request != title yang sebelumnya
             * jika tidak. Cek apakah title hasil request sudah pernah dipakai atau belum
             */
            if ($request->title != $menuSubItem->menu_s_i_title) {
                if (MenuSubItem::where('menu_s_i_title', $request->title)->count() >= 1) {
                    $request->validate(['title' => 'unique:menu_sub_items,menu_s_i_title']);
                }
            }

            // Proses Update data
            MenuSubItem::where('id', $menuSubItem->id)->update([
                'menu_item_id'   => htmlspecialchars($request->menu_item),
                'menu_s_i_title' => htmlspecialchars(ucwords($request->title)),
                'menu_s_i_url'   => htmlspecialchars($url),
            ]);

            return response()->json(['message' => 'Menu sub item updated successfuly'], 200);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\MenuSubItem  $menuSubItem
     * @return \Illuminate\Http\Response
     */
    public function destroy(MenuSubItem $menuSubItem)
    {
        if (empty($this->userAccess()) || $this->userAccess()->user_m_i_delete != 1) {
            return response()->json([
                'message' => 'Access forbidden',
            ], 403);
        } else {
            MenuSubItem::destroy($menuSubItem->id);
            return response()->json(['message' => 'Menu sub item deleted successfuly',], 200);
        }
    }
}
