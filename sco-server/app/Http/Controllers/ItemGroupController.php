<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ItemGroupController extends Controller
{
    public function index(Request $request)
    {
        // Cek baris perhalaman
        $per_page = 25;
        if (isset($request->per_page) && !empty($request->per_page)) {
            switch ($request->per_page) {
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
        $sort = "item_g_code";
        if (isset($request->sort) && !empty($request->sort)) {
            switch ($request->sort) {
                case 'item_g_name':
                    $sort = "item_g_name";
                    break;

                default:
                    $sort = "item_g_code";
                    break;
            }
        }

        // Cek order_by
        $order_by = 'asc';
        if (isset($request->order_by) && !empty($request->order_by)) {
            if ($request->order_by === 'asc' || $request->order_by === 'desc') {
                $order_by = htmlspecialchars($request->order_by);
            }
        }

        // Cek search
        $search = '';
        if (isset($request->search) && !empty($request->search)) {
            $search = htmlspecialchars($request->search);
        }

        $data     = [];
        $data = DB::table("item_groups")
            ->select("id", "item_g_code", "item_g_name", "created_at", "updated_at",)
            ->where("item_g_code", "like", "%" . $search . "%")
            ->orWhere("item_g_name", "like", "%" . $search . "%")
            ->orWhere("created_at", "like", "%" . $search . "%")
            ->orWhere("updated_at", "like", "%" . $search . "%")
            ->orderBy($sort, $order_by)
            ->paginate($per_page);

        return response()->json([
            "item_groups" => $data,
            "search"      => $search,
            "sort"        => $sort,
            "order_by"    => $order_by
        ], 200);
    }
}
