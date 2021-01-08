<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class UserAccess
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
        $menu = DB::table('menu_items')->where('menu_i_url', '/user')->first();
        $user_access = User::find(Auth::user()->id)
            ->menuItem()
            ->where('menu_item_id', $menu->id)
            ->first();

        if (!empty($user_access)) {
            if ($access == 'read') {
                if ($user_access->pivot->user_m_i_read == 1) {
                    return $next($request);
                }
            } else if ($access == 'create') {
                if ($user_access->pivot->user_m_i_create == 1) {
                    return $next($request);
                }
            } else if ($access == 'update') {
                if ($user_access->pivot->user_m_i_update == 1) {
                    return $next($request);
                }
            } else if ($access == 'delete') {
                if ($user_access->pivot->user_m_i_delete == 1) {
                    return $next($request);
                }
            }
        }

        return response()->json(["message" => "Access is denied"], 403);
    }
}