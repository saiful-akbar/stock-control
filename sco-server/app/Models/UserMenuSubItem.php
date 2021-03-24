<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserMenuSubItem extends Model
{
    use HasFactory, Uuid;

    protected $table = "user_menu_sub_item";
    protected $fillable = [
        "user_id",
        "menu_sub_item_id",
        "read",
        "create",
        "update",
        "delete",
    ];
}
