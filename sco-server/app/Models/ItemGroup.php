<?php

namespace App\Models;

use App\Traits\Uuid;
use App\Models\ItemSubGroup;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ItemGroup extends Model
{
    use HasFactory, Uuid;

    protected $fillabale = ['item_g_code', 'item_g_name'];

    /**
     * Relasi one to many dengan model ItemSubGroup
     */
    public function itemSubGroup()
    {
        return $this->hasMany(ItemSubGroup::class, 'item_g_code', 'item_g_code');
    }
}
