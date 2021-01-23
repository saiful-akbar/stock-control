<?php

namespace App\Models;

use App\Traits\Uuid;
use App\Models\ItemGroup;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ItemSubGroup extends Model
{
    use HasFactory, Uuid;

    protected $fillable = ['item_group_id', 'item_s_g_code', 'item_s_g_name'];

    /**
     * Relasi one to many (inverse) dengan model ItemGroup
     */
    public function itemGroup()
    {
        return $this->belongsTo(ItemGroup::class, 'item_g_code', 'item_g_code');
    }

    /**
     * Relasi one to many dengan model Item
     */
    public function item()
    {
        return $this->hasMany(Item::class, 'item_s_g_code', 'item_s_g_code');
    }

    /**
     * Merubah format timestime pada field created_at
     *
     * @return String
     */
    public function getCreatedAtAttribute()
    {
        return \Carbon\Carbon::parse($this->attributes['created_at'])->format('d M Y H:i');
    }

    /**
     * Merubah format timestime pada field updated_at
     *
     * @return String
     */
    public function getUpdatedAtAttribute()
    {
        return \Carbon\Carbon::parse($this->attributes['updated_at'])->format('d M Y H:i');
    }
}
