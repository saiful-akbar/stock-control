<?php

namespace App\Models;

use App\Traits\Uuid;
use App\Models\ItemSubGroup;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ItemGroup extends Model
{
    use HasFactory, Uuid;

    protected $fillable = ['item_g_code', 'item_g_name'];

    /**
     * Relasi one to many dengan model ItemSubGroup
     */
    public function itemSubGroup()
    {
        return $this->hasMany(ItemSubGroup::class, 'item_g_code', 'item_g_code');
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
