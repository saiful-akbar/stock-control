<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Profile extends Model
{
    use HasFactory, Uuid;

    protected $fillable = [
        'user_id',
        'profile_avatar',
        'profile_name',
        'profile_division',
        'profile_email',
        'profile_phone',
        'profile_address',
    ];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id', 'id');
    }
}
