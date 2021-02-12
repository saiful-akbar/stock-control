<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    /**
     * @param Request $request
     */
    public function index(Request $request)
    {
        // Cek baris perhalaman
        $per_page = 25;
        if (isset($request->per_page) && !empty($request->per_page)) {
            if ($request->per_page >= 250) {
                $per_page = 250;
            } else if ($request->per_page >= 100 && $request->per_page < 250) {
                $per_page = 100;
            } else if ($request->per_page >= 50 && $request->per_page < 100) {
                $per_page = 50;
            }
        }

        // Cek sort
        $sort = "document_title";
        if (isset($request->sort) && !empty($request->sort)) {
            switch ($this->clearStr($request->sort, "lower")) {
                case "document_title":
                    $sort = "document_title";
                    break;

                case "document_description":
                    $sort = "document_description";
                    break;

                case "created_at":
                    $sort = "created_at";
                    break;

                case "updated_at":
                    $sort = "updated_at";
                    break;

                default:
                    $sort = "document_title";
                    break;
            }
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

        // Ambil data item group dari database
        $data = Document::where("document_title", "like", "%" . $search . "%")
            ->orWhere("document_description", "like", "%" . $search . "%")
            ->orWhere("created_at", "like", "%" . $search . "%")
            ->orWhere("updated_at", "like", "%" . $search . "%")
            ->orderBy($sort, $order_by)
            ->paginate($per_page);

        // Respose berhasil
        return response()->json([
            "documents" => $data,
            "page"      => $request->page,
            "sort"      => $sort,
            "order_by"  => $order_by,
            "search"    => $search,
        ], 200);
    }

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
            case "upper":
                return htmlspecialchars(trim(strtoupper($string)));
                break;

            case "proper":
                return htmlspecialchars(trim(ucwords($string)));
                break;

            case "lower":
                return htmlspecialchars(trim(strtolower($string)));
                break;

            default:
                return htmlspecialchars(trim($string));
                break;
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            "document_file" => "required|file|max:5000",
            "document_title" => "required|string|max:100",
            "document_description" => "string|max:200"
        ]);

        return response()->json([
            "request" => $request->all(),
        ], 200);
    }
}
