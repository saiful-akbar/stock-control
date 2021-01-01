<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Models\MenuSubItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class MenuSubItemController extends Controller
{

    // Ambil semua data menu item yang children nya true/1
    private function getMenuItems()
    {
        return DB::table("menu_items")
            ->select("id", "menu_i_title")
            ->where("menu_i_children", "=", "1")
            ->get();
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

                case 'menu_s_i_title':
                    $sort = "menu_s_i_title";
                    break;

                case 'menu_s_i_url':
                    $sort = "menu_s_i_url";
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

        // Ambil data dari database
        $data = [];
        if (isset($search) && !empty($search)) {
            $data = DB::table("menu_sub_items")
                ->leftJoin("menu_items", "menu_sub_items.menu_item_id", "=", "menu_items.id")
                ->select(
                    "menu_items.menu_i_title",
                    "menu_sub_items.id",
                    "menu_sub_items.menu_item_id",
                    "menu_sub_items.menu_s_i_title",
                    "menu_sub_items.menu_s_i_url",
                    "menu_sub_items.created_at",
                    "menu_sub_items.updated_at"
                )->where("menu_items.menu_i_title", "like", "%" . $search . "%")
                ->orWhere("menu_sub_items.menu_s_i_title", "like", "%" . $search . "%")
                ->orWhere("menu_sub_items.menu_s_i_url", "like", "%" . $search . "%")
                ->orWhere("menu_sub_items.created_at", "like", "%" . $search . "%")
                ->orWhere("menu_sub_items.updated_at", "like", "%" . $search . "%")
                ->orderBy($sort, $order_by)
                ->paginate($per_page);
        } else {
            $data = DB::table("menu_sub_items")
                ->leftJoin("menu_items", "menu_sub_items.menu_item_id", "=", "menu_items.id")
                ->select(
                    "menu_items.menu_i_title",
                    "menu_sub_items.id",
                    "menu_sub_items.menu_item_id",
                    "menu_sub_items.menu_s_i_title",
                    "menu_sub_items.menu_s_i_url",
                    "menu_sub_items.created_at",
                    "menu_sub_items.updated_at"
                )->orderBy($sort, $order_by)
                ->paginate($per_page);
        }

        // response
        return response()->json([
            "menu_sub_items" => $data,
            "menu_items" => $this->getMenuItems(),
            "search" => $search,
            "sort" => $sort,
            "order_by" => $order_by
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // validasi form inputan
        $request->validate([
            "menu_item" => "required|Exists:menu_items,id",
            "title"     => "required|max:128|unique:menu_sub_items,menu_s_i_title",
            "url"       => "required|max:128|unique:menu_sub_items,menu_s_i_url",
        ]);

        /**
         * mengganti spasi dengan "/"
         * cek apakah karakter pertama "/" atau bukan
         * jika bukan tabahkan "/"
         */
        $url = str_replace(" ", "/", $request->url);
        if (substr($url, 0, 1) != "/") {
            $url = "/" . $url;
        }

        /**
         * cek apakah kata pertama sama dengan url menu item
         * jika bukan gabungkan url menu item dengan url menu sub item yang baru
         */
        $menu_item = DB::table("menu_items")->select("menu_i_url")->where("id", $request->menu_item)->first();
        if ($menu_item->menu_i_url != substr($url, 0, strlen($menu_item->menu_i_url))) {
            $url = $menu_item->menu_i_url . $url;
        }

        /**
         * cek apakan ada url yang sama pada record dengan url hasil request
         * jika ada kembalikan pesan error
         * jika tidak lanjutkan create menu sub item
         */
        if (MenuSubItem::where("menu_s_i_url", $url)->count() >= 1) {
            return response()->json([
                "errors" => ["url" => ["The url has already been taken."]],
                "message" => "The given data was invalid."
            ], 422);
        }

        // propses menambahkan data baru
        MenuSubItem::create([
            "menu_item_id"   => htmlspecialchars($request->menu_item),
            "menu_s_i_title" => htmlspecialchars(ucwords($request->title)),
            "menu_s_i_url"   => htmlspecialchars(strtolower($url)),
        ]);

        return response()->json(["message" => "Sub menus created successfuly"], 200);
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
        // validasi form
        $request->validate([
            "menu_item" => "required|Exists:menu_items,id",
            "title"     => "required|max:128",
            "url"       => "required|max:128",
        ]);

        /**
         * mengganti spasi dengan "/"
         * cek apakah karakter pertama "/" atau bukan
         * jika bukan tabahkan "/"
         */
        $url = str_replace(" ", "/", $request->url);
        if (substr($url, 0, 1) != "/") {
            $url = "/" . $url;
        }

        /**
         * cek apakah kata pertama sama dengan url menu item
         * jika bukan gabungkan url menu item dengan url menu sub item yang baru
         */
        $menu_item = DB::table("menu_items")->select("menu_i_url")->where("id", $request->menu_item)->first();
        if ($menu_item->menu_i_url != substr($url, 0, strlen($menu_item->menu_i_url))) {
            $url = $menu_item->menu_i_url . $url;
        }

        /**
         * cek apakah url request != url yang sebelumnya
         * jika tidak. Cek apakah url hasil request sudah pernah dipakai atau belum
         */
        if ($url != $menuSubItem->menu_s_i_url) {
            if (MenuSubItem::where("menu_s_i_url", $url)->count() >= 1) {
                return response()->json([
                    "errors" => ["url" => ["The url has already been taken."]],
                    "message" => "The given data was invalid."
                ], 422);
            }
        }

        /**
         * cek apakah title request != title yang sebelumnya
         * jika tidak. Cek apakah title hasil request sudah pernah dipakai atau belum
         */
        if ($request->title != $menuSubItem->menu_s_i_title) {
            if (MenuSubItem::where("menu_s_i_title", $request->title)->count() >= 1) {
                $request->validate(["title" => "unique:menu_sub_items,menu_s_i_title"]);
            }
        }

        // Proses Update data
        MenuSubItem::where("id", $menuSubItem->id)->update([
            "menu_item_id"   => htmlspecialchars($request->menu_item),
            "menu_s_i_title" => htmlspecialchars(ucwords($request->title)),
            "menu_s_i_url"   => htmlspecialchars($url),
        ]);

        return response()->json(["message" => "Sub menus updated successfuly"], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\MenuSubItem  $menuSubItem
     * @return \Illuminate\Http\Response
     */
    public function destroy(MenuSubItem $menuSubItem)
    {
        MenuSubItem::destroy($menuSubItem->id);
        return response()->json([
            "message" => "Sub menus deleted successfuly"
        ], 200);
    }
}
