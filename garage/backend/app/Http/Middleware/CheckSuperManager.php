<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Support\Facades\Auth;

class CheckSuperManager
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
    {
        $user = Auth::guard('sanctum')->user();

        if ($user->role_id !== UserRole::Admin->value) {
            return response()->json(['success' => false], 401);
        }
        return $next($request);
    }
}
