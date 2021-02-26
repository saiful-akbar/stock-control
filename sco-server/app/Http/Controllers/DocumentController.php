<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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

    /**
     * @param Request $request
     *
     * @return Json
     */
    public function store(Request $request)
    {
        $request->validate([
            "document_file" => "required|file|max:5000|mimes:xlsx,xls,csv,pdf,docx,doc",
            "document_title" => "required|string|max:100",
            "document_description" => "string|max:200"
        ]);

        // Cek document fie
        $title = $this->clearStr($request->document_title, "lower"); // ambil title dari request
        $file_extension = $request->file('document_file')->extension(); // ambil extensi original file
        $file_name = str_replace(" ", "_", $title) . "_" . date('ymdHis'); // buat nama file
        $file_name .= ".{$file_extension}"; // tambahkan extensi file
        $request->file('document_file')->storeAs('documents', $file_name); // simpan ke storage

        // simpan documnet
        Document::create([
            'document_title'       => $this->clearStr($request->document_title, "proper"),
            'document_description' => $this->clearStr($request->document_description, "lower"),
            'document_path'        => $file_name
        ]);

        // Response berhasil
        return response()->json([
            "message" => "Document added successfully"
        ], 200);
    }

    public function update(Request $request, Document $document)
    {
        $request->validate([
            "document_file" => "nullable|file|max:5000|mimes:xlsx,xls,csv,pdf,docx,doc",
            "document_title" => "required|string|max:100",
            "document_description" => "string|max:200"
        ]);

        $file_name = $request->document_title; // simpan nama file semula pada variable

        // Cek apakah file diisi atau tidak
        if ($request->hasFile("document_file")) {
            Storage::delete("documents/{$document->document_path}"); // hapus file dari storage
            $title = $this->clearStr($request->document_title, "lower"); // ambil title dari request
            $file_extension = $request->file('document_file')->extension(); // ambil extensi
            $file_name = str_replace(" ", "_", $title) . "_" . date('ymdHis'); // buat nama file baru
            $file_name .= ".{$file_extension}"; // tambahkan extensi file
            $request->file('document_file')->storeAs('documents', $file_name); // simpan file baru pada storage
        }

        // simpan ke database
        Document::where("id", $document->id)->update([
            'document_title'       => $this->clearStr($request->document_title, "proper"),
            'document_description' => $this->clearStr($request->document_description, "lower"),
            'document_path'        => $file_name
        ]);

        // response berhasil
        return response()->json([
            "message" => "document updated successfully"
        ], 200);
    }

    /**
     * Multiple delete document
     *
     * @param Request $request
     *
     * @return Json
     */
    public function delete(Request $request)
    {
        // Ambil data document berdasarkan id yang dipilih
        $documents = DB::table('documents')
            ->whereIn('id', $request->all())
            ->get();

        // hapus file dari storage
        foreach ($documents as $document) {
            Storage::delete("documents/{$document->document_path}");
        }

        // hapus dari database
        $deleted = Document::destroy($request->all());

        // response berhasil
        return response()->json([
            "message" => "{$deleted} Documents deleted successfully",
        ], 200);
    }

    /**
     * Method untuk mendownload file document
     *
     * @param Document $document
     */
    public function download(Document $document)
    {
        return Storage::download("documents/{$document->document_path}");
    }
}