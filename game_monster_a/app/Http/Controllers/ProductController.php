<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Game;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $games = Game::all();
        foreach ($games as $key => $game) {
            $games[$key]['name'] = json_decode($game['name'], true);
            $games[$key]['categories'] = json_decode($game['categories'], true);
        }
        return Inertia::render('profile/createProduct', compact('games'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request)
    {
        $shutdownTime = Carbon::now();
        if ($request->type == 1 && (int)$request->shutdownTime < 1) {
            return Redirect::back()->withErrors(['time' => __('ERROR: Wrong time')]);
        }
        if ($request->type == 0) {
            $request['shutdownTime'] = null;
        } else {
            $date = (int)$request->shutdownTime;
            $request['shutdownTime'] = $shutdownTime->addHour($date)->toDateTimeString();
            
        }

        Product::create($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): Response
    {
      $product = Product::find($id);
      $user = $product->user()->get();
      $user = $user[0];
      return Inertia::render('product', compact('product', 'user'));
    }

  public function showByGameId(int $id): Response
  {
    $products = Product::query()->where('game_id', '=', $id)->get();
    foreach ($products as $key=>$product){
      $user = $product->user()->get();
      $products[$key]['user'] = $user[0];
    }
    $game = Game::find($id);
    $game['name'] = json_decode($game['name']);
    $game['categories'] = json_decode($game['categories']);
    return Inertia::render('game', compact('products', 'game'));
  }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id): Response
    {
        $product = Product::find($id);
        $user = Auth::user();
        $games = Game::all();

        foreach ($games as $key => $game) {
            $games[$key]['name'] = json_decode($game['name'], true);
            $games[$key]['categories'] = json_decode($game['categories'], true);
        }

        if($product->user_id != $user->id){
            return Inertia::render('profile/profile');
        }
        return Inertia::render('profile/editProduct', compact('product', 'games'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $shutdownTime = Carbon::now();
        if ($request->type == 1 && (int)$request->shutdownTime < 1) {
            return Redirect::back()->withErrors(['time' => __('ERROR: Wrong time')]);
        }
        if ($request->type == 0) {
            $request['shutdownTime'] = null;
        } else {
            $request['shutdownTime'] = $shutdownTime->addHour((int)$request->shutdownTime)->toDateTimeString();
        }

        $product = Product::find($id);
        $product->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): void
    {
        Product::destroy($id);
    }
}
