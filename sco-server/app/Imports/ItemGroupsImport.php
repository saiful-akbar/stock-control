<?php

namespace App\Imports;

use App\Models\ItemGroup;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class ItemGroupsImport implements ToModel, WithValidation, WithHeadingRow
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        return new ItemGroup([
            "id" => Str::random(32),
            "item_g_code" => $row["item_group_code"],
            "item_g_name" => $row["item_group_name"],
            "created_at" => now(),
            "updated_at" => now(),
        ]);
    }

    public function rules(): array
    {
        return [
            'item_group_code' => "required|unique:item_groups,item_g_code|max:64",
        ];
    }
}
