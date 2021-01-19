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
        'menu_i_url',
        'menu_i_icon',
        'menu_i_children',
    ];

    public function user()
    {
        return $this->belongsToMany(\App\Models\User::class, 'user_menu_item', 'menu_item_id', 'user_id')
            ->withPivot('user_m_i_create', 'user_m_i_read', 'user_m_i_update', 'user_m_i_delete');
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
