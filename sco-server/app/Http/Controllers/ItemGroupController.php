<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ItemGroupController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }
}
