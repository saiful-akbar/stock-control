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
            ->where("item_g_code", "like", "%" . $this->search . "%")
            ->orWhere("item_g_name", "like", "%" . $this->search . "%")
            ->orWhere("created_at", "like", "%" . $this->search . "%")
            ->orWhere("updated_at", "like", "%" . $this->search . "%")
            ->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Item Group Code',
            'Item Group Name',
            'Created At',
            'Updated At',
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
        $sheet->getStyle('A1:E1')->applyFromArray($styleArray);
    }

    public function columnWidths(): array
    {
        return [
            'A' => 40,
            'B' => 20,
            'C' => 40,
            'D' => 30,
            'E' => 30,
        ];
    }
}
