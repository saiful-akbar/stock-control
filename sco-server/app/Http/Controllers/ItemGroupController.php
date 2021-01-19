<?php

namespace App\Http\Controllers;

use App\Exports\ItemGroupsExport;
use App\Models\ItemGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class ItemGroupController extends Controller
{
    /**
     * Fungsi untuk membersihkan string
     *
     * @param string $type
     * @param string $string
     *
     * @return String
     */
    private function clearStr(string $string, string $type = null)
    {
        switch (strtolower($type)) {
            case 'upper':
                return htmlspecialchars(trim(strtoupper($string)));
                break;

            case 'proper':
                return htmlspecialchars(trim(ucwords($string)));
                break;

            case 'lower':
                return htmlspecialchars(trim(strtolower($string)));
                break;

            default:
                return htmlspecialchars(trim($string));
                break;
        }
    }

    /**
     * Fungsi unutk mengambil semua data item groups dari database
     *
     * @param Request $request
     *
     * @return Json|Array
     */
    public function index(Request $request)
    {
        // Cek baris perhalaman
        $per_page = 25;
        switch ($request->per_page) {
            case $request->per_page >= 250:
                $per_page = 250;
                break;

            case $request->per_page >= 100:
                $per_page = 100;
                break;

            case $request->per_page >= 50:
                $per_page = 50;
                break;

            default:
                $per_page = 25;
                break;
        }

        // Cek sort
        $sort = "item_g_code";
        switch ($this->clearStr($request->sort, "lower")) {
            case "item_g_name":
                $sort = "item_g_name";
                break;

            case "created_at":
                $sort = "created_at";
                break;

            case "updated_at":
                $sort = "updated_at";
                break;

            default:
                $sort = "item_g_code";
                break;
        }

        // Cek order_by
        $order_by = "asc";
        if (isset($request->order_by) && !empty($request->order_by)) {
            if ($request->order_by === "asc" || $request->order_by === "desc") {
                $order_by = $this->clearStr($request->order_by, "lower");
            }
        }

        // Cek search
        $search = (isset($request->search)) ? $this->clearStr($request->search) : "";

        // Amil data item group dari database
        $data = ItemGroup::where("item_g_code", "like", "%" . $search . "%")
            ->orWhere("item_g_name", "like", "%" . $search . "%")
            ->orWhere("created_at", "like", "%" . $search . "%")
            ->orWhere("updated_at", "like", "%" . $search . "%")
            ->orderBy($sort, $order_by)
            ->paginate($per_page);

        // Respose berhasil
        return response()->json([
            "item_groups" => $data,
            "page"        => $request->page,
            "per_page"    => $per_page,
            "sort"        => $sort,
            "order_by"    => $order_by,
            "search"      => $search,
        ], 200);
    }


    /**
     * Method menambahkan item group baru
     *
     * @param Request $request
     */
    public function create(Request $request)
    {
        // validasi request
        $request->validate([
            "group_code" => "required|string|unique:item_groups,item_g_code|max:64",
            "group_name" => "required|string"
        ]);

        // proses menambah data baru
        ItemGroup::create([
            "item_g_code" => $this->clearStr($request->group_code, "upper"),
            "item_g_name" => $this->clearStr($request->group_name),
        ]);

        // response berhasil
        return response()->json([
            "message" => "Item group added successfully"
        ], 200);
    }


    /**
     * Update item groups
     *
     * @param Request $request
     * @param ItemGroup $item_group
     *
     * @return Json
     */
    public function update(Request $request, ItemGroup $item_group)
    {
        // validasi request
        $request->validate([
            "group_code" => "required|string|max:64",
            "group_name" => "required|string"
        ]);

        // Cek apakah group code dirubah, & apakan group code sudah digunakan atau belum
        if ($request->group_code != $item_group->group_code) {
            $group_code = ItemGroup::where([
                ["item_g_code", "=", $this->clearStr($request->group_code, "upper")],
                ["id", "!=", $item_group->id]
            ])->first();

            if (!empty($group_code)) {
                $request->validate([
                    "group_code" => "unique:item_groups,item_g_code"
                ]);
            }
        }

        // Simpan perubahan
        ItemGroup::where("id", $item_group->id)->update([
            "item_g_code" => $this->clearStr($request->group_code, "upper"),
            "item_g_name" => $this->clearStr($request->group_name),
        ]);

        // response berhasil
        return response()->json([
            "message" => "Item group updated successfully"
        ], 200);
    }


    /**
     * Multiple delete item groups
     *
     * @param Request $request
     *
     * @return Json
     */
    public function delete(Request $request)
    {
        $deleted = ItemGroup::destroy($request->all());
        return response()->json([
            "message" => "{$deleted} Item group deleted successfully",
            "request" => $request->all()
        ], 200);
    }

    public function export(Request $request)
    {
        $search = (isset($request->search)) ? $this->clearStr($request->search) : "";

        return (new ItemGroupsExport($search))->download('item-group-' . now() . '.xlsx');
    }
}
