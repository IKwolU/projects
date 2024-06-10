<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();
        $products = $user->products;
        return Inertia::render('profile/profile', compact('user', 'products'));
    }
}
