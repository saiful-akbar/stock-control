<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserLog extends Model
{
    use HasFactory, Uuid;
    protected $fillable = ['user_id', 'ip', 'ip2', 'browser', 'device', 'os', 'logged_at'];

    /**
     * Relasi one to one dengan model user
     *
     * @return User
     */
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id', 'id');
    }

    /**
     * Merubah format waktu created at
     *
     * @return Carbon
     */
    public function getCreatedAtAttribute()
    {
        return \Carbon\Carbon::parse($this->attributes['created_at'])->format('d M Y H:i');
    }

    /**
     * Merubah format waktu updated at
     *
     * @return Carbon
     */
    public function getUpdatedAtAttribute()
    {
        return \Carbon\Carbon::parse($this->attributes['updated_at'])->format('d M Y H:i');
    }

    /**
     * Merubah format waktu logged at
     *
     * @return Carbon
     */
    public function getLoggedAtAttribute()
    {
        return \Carbon\Carbon::parse($this->attributes['logged_at'])->format('d M Y H:i');
    }
}
