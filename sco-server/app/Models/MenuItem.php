<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MenuItem extends Model
{
    use HasFactory, Uuid;

    protected $fillable = [
        'menu_i_title',
    ];

    public function user()
    {
        return $this->belongsToMany(\App\Models\User::class, 'user_menu_item', 'menu_item_id', 'user_id')->withPivot('user_m_i_read');
    }

    public function menuSubItems()
    {
        return $this->hasMany(\App\Models\MenuSubItem::class, 'menu_item_id', 'id');
    }

    public function getCreatedAtAttribute()
    {
        return \Carbon\Carbon::parse($this->attributes['created_at'])->format('d M Y H:i');
    }

    public function getUpdatedAtAttribute()
    {
        return \Carbon\Carbon::parse($this->attributes['updated_at'])->format('d M Y H:i');
    }
}
