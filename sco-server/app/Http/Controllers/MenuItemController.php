<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use App\Traits\ClearStrTrait;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class MenuItemController extends Controller
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
            switch ($this->clearStr($request->sort, "lower")) {
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
            if ($this->clearStr($request->orderby, "lower") === 'asc' || $this->clearStr($request->orderby, "lower") === 'desc') {
                $order_by = $this->clearStr($request->orderby, "lower");
            }
        }

        // Cek search
        $search = isset($request->search) ? $this->clearStr($request->search) : "";

        // Ambil data dari database
        $data = MenuItem::where("menu_i_title", "like", "%" . $this->clearStr($search) . "%")
            ->orWhere("created_at", "like", "%" . $this->clearStr($search) . "%")
            ->orWhere("updated_at", "like", "%" . $this->clearStr($search) . "%")
            ->orderBy($this->clearStr($sort, "lower"), $this->clearStr($order_by, "lower"))
            ->paginate($per_page);

        // response berhasil
        return response()->json([
            "menu_items" => $data,
            "search"     => $search,
            "sort"       => $sort,
            "order_by"   => $order_by
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
        // validasi form
        $request->validate([
            "title" => "required|max:128|unique:menu_items,menu_i_title",
        ]);

        // Simpan ke database
        $new_menu_item = MenuItem::create([
            "menu_i_title" => $this->clearStr($request->title, "proper"),
        ]);

        // Buat user log
        User::find(Auth::user()->id)
            ->userLog()
            ->create(["log_desc" => "Create a new menu ({$new_menu_item->menu_i_title})"]);

        // hasil kembali
        return response()->json([
            "message" => "Menus created successfully"
        ], 200);
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
        // validasi form
        $request->validate([
            "title"    => "required|max:128",
        ]);

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
        MenuItem::where("id", $menuItem->id)->update([
            "menu_i_title"    => $this->clearStr($request->title, "proper"),
        ]);

        // Buat user log
        User::find(Auth::user()->id)
            ->userLog()
            ->create(["log_desc" => "Update menu (" . $menuItem->menu_i_title . " => " . $this->clearStr($request->title, "proper") . ")"]);

        // hasil
        return response()->json([
            "message" => "Menus updated successfully",
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\MenuItem  $menuItem
     * @return \Illuminate\Http\Response
     */
    public function destroy(MenuItem $menuItem)
    {
        $delete = MenuItem::destroy($menuItem->id);

        // Buat user log
        User::find(Auth::user()->id)
            ->userLog()
            ->create(["log_desc" => "Delete menu ({$menuItem->menu_i_title})"]);

        return response()->json([
            "message" => "{$delete} Menus deleted successfully",
        ], 200);
    }
}
