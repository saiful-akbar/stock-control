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
            'Item Group Code',
            'Item Group Name',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $styleArray = [
            'font' => [
                'bold' => true,
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT,
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                'rotation' => 90,
                'startColor' => [
                    'argb' => 'b7b7b7',
                ],
                'endColor' => [
                    'argb' => 'FFFFFF',
                ],
            ],
        ];
        $sheet->getStyle('A1:B1')->applyFromArray($styleArray);
    }

    public function columnWidths(): array
    {
        return [
            'A' => 20,
            'B' => 40,
        ];
    }
}
