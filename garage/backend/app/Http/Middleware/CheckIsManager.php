<?php

namespace App\Http\Middleware;

use App\Enums\UserType;
use App\Models\Manager;
use App\Models\Park;
use Closure;
use Illuminate\Support\Facades\Auth;

class CheckIsManager
{
    public function handle($request, Closure $next)
    {
        $user = Auth::guard('sanctum')->user();

        if ($user->user_type !== UserType::Manager->value) {
            return response()->json(['Нет прав доступа'], 409);
        }

        $manager = Manager::where('user_id', $user->id)->first();
        if (!$manager) {
            return response()->json(['Менеджер не найден'], 404);
        }
        $key = Park::where('id', $manager->park_id)->select('API_key')->first()->API_key;
        $request->park_id = $manager->park_id;
        $request->API_key = $key;

        return $next($request);
    }
}
