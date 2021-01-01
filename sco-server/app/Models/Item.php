<?php

namespace App\Models;

use App\Traits\Uuid;
use App\Models\ItemSubGroup;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Item extends Model
{
    use HasFactory, Uuid;

    protected $fillable = [
        'item_s_g_code',
        'item_code',
        'item_barcode',
        'item_name',
        'item_unit',
        'item_price_normal',
        'item_price_a',
        'item_price_b',
        'item_price_c',
        'item_price_d',
    ];

    /**
     * Relasi one to many (inverse) dengan model ItemSubGroup
     */
    public function itemSubGroup()
    {
        return $this->belongsTo(ItemSubGroup::class, 'item_s_g_code', 'item_s_g_code');
    }
}
