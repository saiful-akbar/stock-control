<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ItemGroupController extends Controller
{
    /**
     * Fungsi untuk membersihkan string
     *
     * @param string $type
     * @param string $string
     *
     * @return [type]
     */
    private function clearStr(string $string, string $type = null)
    {
        switch ($type) {
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
     * @return [type]
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
        $data = [];
        $search = "";
        if (isset($request->search) && !empty($request->search)) {
            $search = $this->clearStr($request->search);
            $data = DB::table("item_groups")
                ->where("item_g_code", "like", "%" . $search . "%")
                ->orWhere("item_g_name", "like", "%" . $search . "%")
                ->orWhere("created_at", "like", "%" . $search . "%")
                ->orWhere("updated_at", "like", "%" . $search . "%")
                ->orderBy($sort, $order_by)
                ->paginate($per_page);
        } else {
            $data = DB::table("item_groups")->orderBy($sort, $order_by)->paginate($per_page);
        }


        return response()->json([
            "item_groups" => $data,
            "page"        => $request->page,
            "per_page"    => $per_page,
            "sort"        => $sort,
            "order_by"    => $order_by,
            "search"      => $search,
        ], 200);
    }
}
