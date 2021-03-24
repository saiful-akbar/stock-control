<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Uuid;

class UserMenuItem extends Model
{
    use HasFactory, Uuid;

    protected $table = 'user_menu_item';
    protected $fillable = ['user_id', 'menu_item_id',];
}
