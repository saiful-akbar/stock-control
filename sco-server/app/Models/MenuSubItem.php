<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MenuSubItem extends Model
{
    use HasFactory, Uuid;

    protected $fillable = [
        'menu_item_id',
        'menu_s_i_icon',
        'menu_s_i_title',
        'menu_s_i_url',
    ];

    public function user()
    {
        return $this->belongsToMany(\App\User::class, 'user_menu_sub_item', 'menu_sub_item_id', 'user_id')
            ->withPivot('user_m_s_i_create', 'user_m_s_i_read', 'user_m_s_i_update', 'user_m_s_i_delete');
    }

    public function menuItems()
    {
        return $this->belongsTo(\App\Models\MenuItem::class, 'menu_item_id', 'id');
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
