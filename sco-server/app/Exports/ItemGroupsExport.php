<?php

namespace App\Exports;

use App\Models\ItemGroup;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\FromCollection;

class ItemGroupsExport implements FromCollection, WithHeadings, WithStyles, WithColumnWidths
{
    use Exportable;

    protected $search = "";

    public function __construct($search)
    {
        $this->search = $search;
    }


    public function collection()
    {
        return DB::table("item_groups")
            ->select("item_g_code", "item_g_name")
            ->where("item_g_code", "like", "%" . $this->search . "%")
            ->orWhere("item_g_name", "like", "%" . $this->search . "%")
            ->get();
    }

    public function headings(): array
    {
        return [
            "ITEM GROUP CODE",
            "ITEM GROUP NAME",
        ];
    }

    public function columnWidths(): array
    {
        return [
            "A" => 20,
            "B" => 45,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $count = DB::table("item_groups")
            ->select("item_g_code", "item_g_name")
            ->where("item_g_code", "like", "%" . $this->search . "%")
            ->orWhere("item_g_name", "like", "%" . $this->search . "%")
            ->count();

        $count = $count + 1;

        $styleHeader = [
            "font" => [
                "bold" => true,
                "color" => ["argb" => "FFFFFF"]
            ],
            "alignment" => [
                "horizontal" => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                "vertical" => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
            ],
            "borders" => [
                "allBorders" => [
                    "borderStyle" => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    "color" => ["argb" => "FFFFFF"],
                ],
            ],
            "fill" => [
                "fillType" => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                "color" => [
                    "argb" => "4f81bd",
                ],
            ],
        ];

        $styleBody = [
            "alignment" => [
                "horizontal" => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT,
            ],
            "borders" => [
                "allBorders" => [
                    "borderStyle" => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    "color" => ["argb" => "FFFFFF"]
                ],
            ],
            "fill" => [
                "fillType" => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                "color" => ["argb" => "dce6f1",],
            ]
        ];

        $sheet->getStyle("A1:B1")->applyFromArray($styleHeader);
        $sheet->getStyle("A2:B{$count}")->applyFromArray($styleBody);
    }
}
