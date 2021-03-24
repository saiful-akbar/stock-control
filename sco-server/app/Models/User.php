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

    protected $fillable = ['username', 'password', 'is_active'];
    protected $hidden = ['password'];

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
     * Relasi dengan table profile
     */
    public function profile()
    {
        return $this->hasOne(Profile::class, 'user_id', 'id');
    }

    /**
     * Relasi dengan table user_log
     */
    public function userLog()
    {
        return $this->hasOne(UserLog::class, 'user_id', 'id');
    }

    /**
     * Relasi dengan table user_menu_item
     */
    public function menuItem()
    {
        return $this->belongsToMany(MenuItem::class, 'user_menu_item', 'user_id', 'menu_item_id');
    }

    /**
     * Relasi dengan table user_menu_sub_item
     */
    public function menuSubItem()
    {
        return $this->belongsToMany(MenuSubItem::class, 'user_menu_sub_item', 'user_id', 'menu_sub_item_id')
            ->withPivot('create', 'read', 'update', 'delete');
    }

    /**
     * Merubah format created_at
     */
    public function getCreatedAtAttribute()
    {
        return \Carbon\Carbon::parse($this->attributes['created_at'])->format('d M Y H:i');
    }

    /**
     * Merubah format updated_at
     */
    public function getUpdatedAtAttribute()
    {
        return \Carbon\Carbon::parse($this->attributes['updated_at'])->format('d M Y H:i');
    }
}
