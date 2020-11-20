<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class MenuItemController extends Controller
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
            $data = [];
            $search = htmlspecialchars($request->search);
            $per_page = htmlspecialchars($request->per_page);
            $sort = htmlspecialchars($request->sort);
            $order_by = htmlspecialchars($request->order_by);

            if (isset($search) && !empty($search)) {
                $data = DB::table('menu_items')
                    ->where('menu_i_title', 'like', '%' . $search . '%')
                    ->orWhere('menu_i_url', 'like', '%' . $search . '%')
                    ->orWhere('menu_i_icon', 'like', '%' . $search . '%')
                    ->orWhere('created_at', 'like', '%' . $search . '%')
                    ->orWhere('updated_at', 'like', '%' . $search . '%')
                    ->orderBy($sort, $order_by)
                    ->paginate($per_page);
            } else {
                $data = DB::table('menu_items')->orderBy($sort, $order_by)->paginate($per_page);
            }
            return response()->json([
                'menu_items' => $data,
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
                'message' => 'Access denied',
            ], 403);
        } else {
            // validasi form
            $request->validate([
                'title'    => 'required|max:128|unique:menu_items,menu_i_title',
                'icon'     => 'required|max:128',
                'children' => 'required|boolean',
            ]);

            // menambahkan "/" pada awal url dan merubah spasi menjadi "/"
            $url = str_replace(' ', '/', $request->url);
            $substr_url = substr($url, 0, 1);
            if ($substr_url != '/') {
                $url = '/' . $url;
            }

            // cek url
            if (MenuItem::where('menu_i_url', $url)->count() >= 1) {
                return response()->json([
                    'errors' => ['url' => ['The url has already been taken.']],
                    'message' => 'The given data was invalid.'
                ], 422);
            }

            // tambah kan menu item
            MenuItem::create([
                'menu_i_title'    => htmlspecialchars(ucwords($request->title)),
                'menu_i_url'      => htmlspecialchars(strtolower($url)),
                'menu_i_icon'     => htmlspecialchars($request->icon),
                'menu_i_children' => htmlspecialchars($request->children),
            ]);

            // hasil kembali
            return response()->json([
                'message'    => 'Menu item created successfully'
            ], 200);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\MenuItem  $menuItem
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, MenuItem $menuItem)
    {
        if (empty($this->userAccess()) || $this->userAccess()->user_m_i_update != 1) {
            return response()->json([
                'message' => 'Access denied',
            ], 403);
        } else {
            // validasi form
            $request->validate([
                'title'    => 'required|max:128',
                'url'      => 'required|max:128',
                'icon'     => 'required|max:128',
                'children' => 'required|boolean',
            ]);

            // menambahkan "/" pada awal url dan merubah spasi menjadi "/"
            $url = str_replace(' ', '/', $request->url);
            $substr_url = substr($url, 0, 1);
            if ($substr_url != '/') {
                $url = '/' . $url;
            }

            // Cek url
            if ($url != $menuItem->menu_i_url) {
                if (MenuItem::where('menu_i_url', $url)->count() >= 1) {
                    return response()->json([
                        'errors' => ['url' => ['The url has already been taken.']],
                        'message' => 'The given data was invalid.'
                    ], 422);
                }
            }

            // Cek title
            if ($request->title != $menuItem->menu_i_title) {
                $title = MenuItem::where('menu_i_title', $request->title)->first();
                if (!empty($title)) {
                    $request->validate(['title' => 'unique:menu_items,menu_i_title']);
                }
            }

            // Update menu item
            $update = MenuItem::where('id', $menuItem->id)->update([
                'menu_i_title'    => htmlspecialchars(ucwords($request->title)),
                'menu_i_url'      => htmlspecialchars(strtolower($url)),
                'menu_i_icon'     => htmlspecialchars($request->icon),
                'menu_i_children' => htmlspecialchars($request->children),
            ]);

            // hasil
            return response()->json([
                'message' => 'Menu Item updated successfully',
            ], 200);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\MenuItem  $menuItem
     * @return \Illuminate\Http\Response
     */
    public function destroy(MenuItem $menuItem)
    {
        if (empty($this->userAccess()) || $this->userAccess()->user_m_i_delete != 1) {
            return response()->json([
                'message' => 'Access denied',
            ], 403);
        } else {
            MenuItem::destroy($menuItem->id);
            return response()->json([
                'message' => 'Menu item deleted successfully',
            ], 200);
        }
    }
}
