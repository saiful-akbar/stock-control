<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ItemGroup;
use Illuminate\Http\Request;
use App\Traits\ClearStrTrait;
use App\Exports\ItemGroupsExport;
use App\Imports\ItemGroupsImport;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;

class ItemGroupController extends Controller
{
    use ClearStrTrait;

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
        $sort = "item_g_code";
        if (isset($request->sort)) {
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
        }

        // Cek order_by
        $order_by = "asc";
        if (isset($request->order_by)) {
            if ($this->clearStr($request->order_by, "lower") === "desc") {
                $order_by = "desc";
            }
        }

        // Cek search
        $search = (isset($request->search)) ? $this->clearStr($request->search) : "";

        // Ambil data item group dari database
        $data = ItemGroup::where("item_g_code", "like", "%{$search}%")
            ->orWhere("item_g_name", "like", "%{$search}%")
            ->orWhere("created_at", "like", "%{$search}%")
            ->orWhere("updated_at", "like", "%{$search}%")
            ->orderBy($sort, $order_by)
            ->paginate($per_page);

        // Respose berhasil
        return response()->json([
            "item_groups" => $data,
            "sort"        => $sort,
            "order_by"    => $order_by,
            "search"      => $search,
        ], 200);
    }

    /**
     * Method untuk mengambil data item groups setelah action
     *
     * @param String $sort
     * @param String $order_by
     *
     * @return Array
     */
    private function getDataItemGroups(String $sort = "item_g_code", String $order_by = 'asc')
    {
        return [
            "item_groups" => ItemGroup::orderBy(strtolower($sort), strtolower($order_by))->paginate(25),
            "sort"        => strtolower($sort),
            "order_by"    => strtolower($order_by),
            "search"      => "",
        ];
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
        $item_group = ItemGroup::create([
            "item_g_code" => $this->clearStr($request->group_code, "upper"),
            "item_g_name" => $this->clearStr($request->group_name),
        ]);

        // Buat user log
        User::find(Auth::user()->id)
            ->userLog()
            ->create(["log_desc" => "Create a new item group ({$item_group->item_g_code})"]);

        // response berhasil
        return response()->json([
            "message" => "Item group added successfully",
            "result"  => $this->getDataitemGroups("created_at", "desc"),

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

        // Buat user log
        User::find(Auth::user()->id)
            ->userLog()
            ->create([
                "log_desc" => "Update item group (" . $item_group->item_g_code . " => " . $this->clearStr($request->group_code, "proper") . ")"
            ]);

        // response berhasil
        return response()->json([
            "message" => "Item group updated successfully",
            "result"  => $this->getDataitemGroups("updated_at", "desc"),
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

        // Buat user log
        User::find(Auth::user()->id)
            ->userLog()
            ->create(["log_desc" => "Delete {$deleted} item groups"]);

        return response()->json([
            "message" => "{$deleted} Item group deleted successfully",
            "result"  => $this->getDataitemGroups(),
        ], 200);
    }

    /**
     * Method export item groups
     *
     * @param Request $request
     * @return Response
     */
    public function export(Request $request)
    {
        $search = (isset($request->search)) ? $this->clearStr($request->search) : "";

        return (new ItemGroupsExport($search))->download("item-group.xlsx");
    }

    /**
     * Method import excel item group
     *
     * @param Request $request
     * @return Response
     */
    public function import(Request $request)
    {
        $request->validate([
            "file" => "required|file|filled|mimetypes:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel|mimes:xlsx,xls|max:1000"
        ]);

        Excel::import(new ItemGroupsImport, $request->file("file"));

        // Buat user log
        User::find(Auth::user()->id)
            ->userLog()
            ->create(["log_desc" => "Import a new item groups"]);

        return response()->json([
            "message" => "Item group successfully imported",
            "result"  => $this->getDataitemGroups("created_at", "desc"),
        ]);
    }
}
