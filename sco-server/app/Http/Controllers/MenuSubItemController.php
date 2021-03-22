<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\MenuItem;
use App\Models\MenuSubItem;
use Illuminate\Http\Request;
use App\Traits\ClearStrTrait;
use Illuminate\Support\Facades\Auth;

class MenuSubItemController extends Controller
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
            if (isset($request->per_page)) {
                if ($request->per_page >= 250) {
                    $per_page = 250;
                } else if ($request->per_page >= 100) {
                    $per_page = 100;
                } else if ($request->per_page >= 50) {
                    $per_page = 50;
                }
            }
        }

        // Cek sort
        $sort = "menu_i_title";
        if (isset($request->sort)) {
            switch ($this->clearStr($request->sort, "lower")) {
                case 'menu_s_i_title':
                    $sort = "menu_s_i_title";
                    break;

                case 'menu_s_i_icon':
                    $sort = "menu_s_i_icon";
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
        if (isset($request->order_by)) {
            if ($this->clearStr($request->order_by, "lower") === 'desc') {
                $order_by = "desc";
            }
        }

        // Cek search
        $search = isset($request->search) ? $this->clearStr($request->search) : '';

        // Ambil data dari database
        $data = MenuSubItem::leftJoin("menu_items", "menu_sub_items.menu_item_id", "=", "menu_items.id")
            ->select(
                "menu_items.menu_i_title",
                "menu_sub_items.id",
                "menu_sub_items.menu_item_id",
                "menu_sub_items.menu_s_i_icon",
                "menu_sub_items.menu_s_i_title",
                "menu_sub_items.menu_s_i_url",
                "menu_sub_items.created_at",
                "menu_sub_items.updated_at"
            )->where("menu_items.menu_i_title", "like", "%{$search}%")
            ->orWhere("menu_sub_items.menu_s_i_title", "like", "%{$search}%")
            ->orWhere("menu_sub_items.menu_s_i_url", "like", "%{$search}%")
            ->orderBy($sort, $order_by)
            ->paginate($per_page);

        // response
        return response()->json([
            "menu_sub_items" => $data,
            "sort"           => $sort,
            "order_by"       => $order_by,
            "search"         => $search,
        ], 200);
    }

    /**
     * Method untuk mengambil data menu sub items setelah action
     */
    private function getDataMenuSubItems(String $sort = "menu_i_title", String $order_by = 'asc')
    {
        $data = MenuSubItem::leftJoin("menu_items", "menu_sub_items.menu_item_id", "=", "menu_items.id")
            ->select(
                "menu_items.menu_i_title",
                "menu_sub_items.id",
                "menu_sub_items.menu_item_id",
                "menu_sub_items.menu_s_i_icon",
                "menu_sub_items.menu_s_i_title",
                "menu_sub_items.menu_s_i_url",
                "menu_sub_items.created_at",
                "menu_sub_items.updated_at"
            )
            ->orderBy(strtolower($sort), strtolower($order_by))
            ->paginate(25);

        return [
            "menu_sub_items" => $data,
            "sort"       => strtolower($sort),
            "order_by"   => strtolower($order_by),
            "search"     => "",
        ];
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
            "menus" => "required|Exists:menu_items,id",
            "title" => "required|max:128|unique:menu_sub_items,menu_s_i_title",
            "url"   => "required|max:128|unique:menu_sub_items,menu_s_i_url",
            "icon"  => "required|max:128",
        ]);

        // Cek request url
        $url = str_replace(" ", "/", $request->url); // mengganti spasi dengan "/"
        if (substr($url, 0, 1) != "/") { // cek apakah karakter pertama "/" atau bukan
            $url = "/{$url}"; // jika bukan tabahkan "/"
        }

        // propses menambahkan data baru
        $menu_sub_item = MenuSubItem::create([
            "menu_item_id"   => $this->clearStr($request->menus),
            "menu_s_i_title" => $this->clearStr($request->title, "proper"),
            "menu_s_i_url"   => $this->clearStr($url, "lower"),
            "menu_s_i_icon"  => $this->clearStr($request->icon, "lower"),
        ]);

        // Buat user log
        User::find(Auth::user()->id)
            ->userLog()
            ->create(["log_desc" => "Create a new sub menu ({$menu_sub_item->menu_s_i_title})"]);

        // Response berhasil
        return response()->json([
            "message" => "Sub menus created successfuly",
            "result" => $this->getDataMenuSubItems("created_at", "desc")
        ], 200);
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
            "menus" => "required|Exists:menu_items,id",
            "title" => "required|max:128",
            "url"   => "required|max:128",
            "icon"  => "required|max:128",
        ]);

        // Cek request url
        $url = str_replace(" ", "/", $request->url); // mengganti spasi dengan "/"
        if (substr($url, 0, 1) != "/") { // cek apakah karakter pertama "/" atau bukan
            $url = "/{$url}"; //jika bukan tabahkan "/"
        }

        /**
         * cek apakah url request != url yang sebelumnya
         * jika tidak. Cek apakah url hasil request sudah pernah dipakai atau belum
         */
        if ($url != $menuSubItem->menu_s_i_url) {
            if (MenuSubItem::where("menu_s_i_url", $url)->count() >= 1) {
                return response()->json([
                    "message" => "The given data was invalid.",
                    "errors"  => ["url" => ["The url has already been taken."]]
                ], 422);
            }
        }

        /**
         * cek apakah title request != title yang sebelumnya
         * jika berbeda. Cek apakah title hasil request sudah digunakan atau belum
         */
        if ($request->title != $menuSubItem->menu_s_i_title) {
            if (MenuSubItem::where("menu_s_i_title", $request->title)->count() >= 1) {
                $request->validate(["title" => "unique:menu_sub_items,menu_s_i_title"]);
            }
        }

        // simpan ke database
        MenuSubItem::where("id", $menuSubItem->id)->update([
            "menu_item_id"   => $this->clearStr($request->menus),
            "menu_s_i_title" => $this->clearStr($request->title, "proper"),
            "menu_s_i_url"   => $this->clearStr($url, "lower"),
            "menu_s_i_icon"  => $this->clearStr($request->icon, "lower"),
        ]);

        User::find(Auth::user()->id)
            ->userLog()
            ->create([
                "log_desc" => "Update sub menu (" . $menuSubItem->menu_s_i_title . " => " . $this->clearStr($request->title, "proper") . ")"
            ]);

        return response()->json([
            "message" => "Sub menus updated successfuly",
            "result" => $this->getDataMenuSubItems("updated_at", "desc")
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\MenuSubItem  $menuSubItem
     * @return \Illuminate\Http\Response
     */
    public function destroy(MenuSubItem $menuSubItem)
    {
        // Hapus dari database
        MenuSubItem::destroy($menuSubItem->id);

        // Buat user log
        User::find(Auth::user()->id)
            ->userLog()
            ->create(["log_desc" => "Delete sub menu ({$menuSubItem->menu_s_i_title})"]);

        // Response berhasil
        return response()->json([
            "message" => "Sub menus deleted successfuly",
            "result" => $this->getDataMenuSubItems()
        ], 200);
    }
}
