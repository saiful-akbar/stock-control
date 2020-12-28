<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class MenuItemController extends Controller
{
    /**
     * @param string $accsess_type
     *
     * @return boolean
     */
    private function userAccess(string $accsess_type)
    {
        $user_login = Auth::user();
        $menu = MenuItem::select("id")->where("menu_i_url", "/menu")->first();
        $user_menu = DB::table("user_menu_item")->where([
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

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if ($this->userAccess("read")) {

            // Cek baris perhalaman
            $per_page = 25;
            if (isset($request->perpage) && !empty($request->perpage)) {
                switch ($request->perpage) {
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
            $sort = "menu_i_title";
            if (isset($request->sort) && !empty($request->sort)) {
                switch ($request->sort) {
                    case 'menu_i_url':
                        $sort = "menu_i_url";
                        break;

                    case 'menu_i_icon':
                        $sort = "menu_i_icon";
                        break;

                    case 'menu_i_children':
                        $sort = "menu_i_children";
                        break;

                    case 'created_at':
                        $sort = "created_at";
                        break;

                    case 'updated_at':
                        $sort = "updated_at";
                        break;

                    default:
                        $sort = "menu_i_title";
                        break;
                }
            }

            // Cek orderby
            $order_by = 'asc';
            if (isset($request->orderby) && !empty($request->orderby)) {
                if ($request->orderby === 'asc' || $request->orderby === 'desc') {
                    $order_by = htmlspecialchars($request->orderby);
                }
            }

            // Cek search
            $search = '';
            if (isset($request->search) && !empty($request->search)) {
                $search = htmlspecialchars($request->search);
            }

            $data = [];
            if (isset($search) && !empty($search)) {
                $data = DB::table("menu_items")
                    ->where("menu_i_title", "like", "%" . $search . "%")
                    ->orWhere("menu_i_url", "like", "%" . $search . "%")
                    ->orWhere("menu_i_icon", "like", "%" . $search . "%")
                    ->orWhere("created_at", "like", "%" . $search . "%")
                    ->orWhere("updated_at", "like", "%" . $search . "%")
                    ->orderBy($sort, $order_by)
                    ->paginate($per_page);
            } else {
                $data = DB::table("menu_items")->orderBy($sort, $order_by)->paginate($per_page);
            }

            return response()->json([
                "menu_items" => $data,
                "search" => $search,
                "sort" => $sort,
                "order_by" => $order_by
            ], 200);
        } else {
            return response()->json([
                "message" => "Access is denied",
            ], 403);
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
        if ($this->userAccess("create")) {
            // validasi form
            $request->validate([
                "title"    => "required|max:128|unique:menu_items,menu_i_title",
                "icon"     => "required|max:128",
                "children" => "required|boolean",
            ]);

            // menambahkan "/" pada awal url dan merubah spasi menjadi "/"
            $url = str_replace(" ", "/", $request->url);
            $substr_url = substr($url, 0, 1);
            if ($substr_url != "/") {
                $url = "/" . $url;
            }

            // cek url
            if (MenuItem::where("menu_i_url", $url)->count() >= 1) {
                return response()->json([
                    "errors" => ["url" => ["The url has already been taken."]],
                    "message" => "The given data was invalid."
                ], 422);
            } else {
                // tambah kan menu item
                MenuItem::create([
                    "menu_i_title"    => htmlspecialchars(ucwords($request->title)),
                    "menu_i_url"      => htmlspecialchars(strtolower($url)),
                    "menu_i_icon"     => htmlspecialchars($request->icon),
                    "menu_i_children" => htmlspecialchars($request->children),
                ]);

                // hasil kembali
                return response()->json([
                    "message"    => "Menus created successfully"
                ], 200);
            }
        } else {
            return response()->json([
                "message" => "Access is denied",
            ], 403);
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
        if ($this->userAccess("update")) {
            // validasi form
            $request->validate([
                "title"    => "required|max:128",
                "url"      => "required|max:128",
                "icon"     => "required|max:128",
                "children" => "required|boolean",
            ]);

            // menambahkan "/" pada awal url dan merubah spasi menjadi "/"
            $url = str_replace(" ", "/", $request->url);
            $substr_url = substr($url, 0, 1);
            if ($substr_url != "/") {
                $url = "/" . $url;
            }

            // Cek url
            if ($url != $menuItem->menu_i_url) {
                if (MenuItem::where("menu_i_url", $url)->count() >= 1) {
                    return response()->json([
                        "errors" => ["url" => ["The url has already been taken."]],
                        "message" => "The given data was invalid."
                    ], 422);
                }
            }

            // Cek title
            if ($request->title != $menuItem->menu_i_title) {
                $title = MenuItem::where("menu_i_title", $request->title)->first();
                if (!empty($title)) {
                    $request->validate([
                        "title" => "unique:menu_items,menu_i_title"
                    ]);
                }
            }

            // Update menu item
            $update = MenuItem::where("id", $menuItem->id)->update([
                "menu_i_title"    => htmlspecialchars(ucwords($request->title)),
                "menu_i_url"      => htmlspecialchars(strtolower($url)),
                "menu_i_icon"     => htmlspecialchars($request->icon),
                "menu_i_children" => htmlspecialchars($request->children),
            ]);

            // hasil
            return response()->json([
                "message" => "{$update} Menus updated successfully",
            ], 200);
        } else {
            return response()->json([
                "message" => "Access is denied",
            ], 403);
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
        if ($this->userAccess("delete")) {
            $delete = MenuItem::destroy($menuItem->id);
            return response()->json([
                "message" => "{$delete} Menus deleted successfully",
            ], 200);
        } else {
            return response()->json([
                "message" => "Access is denied",
            ], 403);
        }
    }
}
