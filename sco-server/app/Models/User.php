<?php

namespace App\Models;

use App\Traits\Uuid;
use App\Models\Profile;
use App\Models\UserLog;
use App\Models\MenuItem;
use App\Models\MenuSubItem;
use \Laravel\Sanctum\HasApiTokens;
use \Illuminate\Notifications\Notifiable;
use \Illuminate\Database\Eloquent\Factories\HasFactory;
use \Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, Uuid;

    /**
     * Get the value indicating whether the IDs are incrementing.
     *
     * @return bool
     */
    public function getIncrementing()
    {
        return false;
    }

    /**
     * Get the auto-incrementing key type.
     *
     * @return string
     */
    public function getKeyType()
    {
        return 'string';
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id', 'username', 'password', 'is_active'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
    ];

    public function profile()
    {
        return $this->hasOne(Profile::class, 'user_id', 'id');
    }

    public function userLog()
    {
        return $this->hasOne(UserLog::class, 'user_id', 'id');
    }

    public function menuItem()
    {
        return $this->belongsToMany(MenuItem::class, 'user_menu_item', 'user_id', 'menu_item_id')
            ->withPivot('user_m_i_create', 'user_m_i_read', 'user_m_i_update', 'user_m_i_delete');
    }

    public function menuSubItem()
    {
        return $this->belongsToMany(MenuSubItem::class, 'user_menu_sub_item', 'user_id', 'menu_sub_item_id')
            ->withPivot('user_m_s_i_create', 'user_m_s_i_read', 'user_m_s_i_update', 'user_m_s_i_delete');
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
