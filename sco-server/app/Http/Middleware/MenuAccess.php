<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class MenuAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $access)
    {
        $menu = DB::table('menu_sub_items')->where('menu_s_i_url', '/menu-management')->first();
        $user_access = User::find(Auth::user()->id)
            ->menuSubItem()
            ->where('menu_sub_item_id', $menu->id)
            ->first();

        if (!empty($user_access)) {
            if ($access == 'read') {
                if ($user_access->pivot->read == 1) {
                    return $next($request);
                }
            } else if ($access == 'create') {
                if ($user_access->pivot->create == 1) {
                    return $next($request);
                }
            } else if ($access == 'update') {
                if ($user_access->pivot->update == 1) {
                    return $next($request);
                }
            } else if ($access == 'delete') {
                if ($user_access->pivot->delete == 1) {
                    return $next($request);
                }
            }
        }

        return response()->json(["message" => "Access is denied"], 403);
    }
}
