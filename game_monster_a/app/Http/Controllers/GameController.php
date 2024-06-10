<?php

namespace App\Http\Controllers;

use App\Http\Requests\GameRequest;
use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class GameController extends Controller
{
  public function Index(): Response
  {
    $games = Game::all();
    foreach ($games as $key => $game) {
      $games[$key]['name'] = json_decode($game['name'], true);
    }
    return Inertia::render('admin/games/games', compact('games'));
  }

  public function IndexUserPage(): Response
  {
      $games = Game::all();
      foreach ($games as $key => $game) {
          $games[$key]['name'] = json_decode($game['name'], true);
          $game = Game::find($games[$key]['id']);
          $game = $game->products()->get();
          $games[$key]['lowPrice'] = $game->min('price');
          $games[$key]['avgPrice'] = $game->median('price');
      }

      return Inertia::render('games', compact('games'));
  }

  public function create(): Response
  {
    return Inertia::render('admin/games/gameCreate');
  }

  public function store(GameRequest $request): void
  {
    $image = $request->img;
    $nameImg = md5(Carbon::now() . '_' . $image->getClientOriginalName()) . '.' . $image->getClientOriginalExtension();
    $filepathImg = Storage::disk('public')->putFileAs('/gameImages/img', $image, $nameImg);

    $image2 = $request->imgLong;
    $nameImgLong = md5(Carbon::now() . '_' . $image2->getClientOriginalName()) . '.' . $image2->getClientOriginalExtension();
    $filepathImgLong = Storage::disk('public')->putFileAs('/gameImages/imgLong', $image2, $nameImgLong);

    Game::create([
      'name' => json_encode($request->name),
      'categories' => json_encode($request->categories),
      'image' => '/storage/' . $filepathImg,
      'longImage' => '/storage/' . $filepathImgLong,
    ]);
  }

  public function destroy(string $id): void
  {
    Game::destroy($id);
  }

  public function edit(string $id): Response
  {
    $game = Game::find($id);
    $game->name = json_decode($game->name);
    $game->categories = json_decode($game->categories);
    return Inertia::render('admin/games/gameEdit', compact('game'));
  }

  public function update(Request $request, string $id): void
  {
    $filepathImg = null;
    if($request->img){
      $image = $request->img;
      $nameImg = md5(Carbon::now() . '_' . $image->getClientOriginalName()) . '.' . $image->getClientOriginalExtension();
      $filepathImg = Storage::disk('public')->putFileAs('/gameImages/img', $image, $nameImg);
      $filepathImg = "/storage/" . $filepathImg;
    }
    $filepathImgLong = null;
    if($request->imgLong){
      $image2 = $request->imgLong;
      $nameImgLong = md5(Carbon::now() . '_' . $image2->getClientOriginalName()) . '.' . $image2->getClientOriginalExtension();
      $filepathImgLong = Storage::disk('public')->putFileAs('/gameImages/imgLong', $image2, $nameImgLong);
      $filepathImgLong = "/storage/" . $filepathImgLong;
    }

    $game = Game::find($id);


    $game->update([
      'name' => json_encode($request->name),
      'image' => $filepathImg != null ? $filepathImg : $game->image,
      'longImage' => $filepathImgLong != null ? $filepathImgLong : $game->longImage,
      'categories' => json_encode($request->categories)
    ]);
  }
}
