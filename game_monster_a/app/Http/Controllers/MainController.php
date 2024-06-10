<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\News;
use App\Models\NewsCategory;
use App\Models\NewsPosition;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class MainController extends Controller
{
  public function indexPage(): Response
  {
    foreach ($news = News::all() as $key => $n) {
      $news[$key]['content'] = json_decode($n['content']);
      $news[$key]['image'] = json_decode($n['image']);
      $news[$key]['categories'] = json_decode($n['categories']);
    }
    $positions = NewsPosition::all();
    $positions = $positions[0]['positions'];
    $news = $news->all();
    $news = array_map(function ($value) {
      $x = $value;
      $x['content'] = json_decode(json_encode($value['content']));
      return $x;
    }, $news);

    $categories = NewsCategory::all();
    $news = array_reverse($news);
    $games = Game::all();
    foreach ($games as $key => $game) {
      $games[$key]['name'] = json_decode($game['name'], true);
      $game = Game::find($games[$key]['id']);
      $game = $game->products()->get();
      $games[$key]['lowPrice'] = $game->min('price');
      $games[$key]['avgPrice'] = $game->median('price');
    }
    return Inertia::render('index', compact(
      'news',
      'positions',
      'categories',
      'games'
    ));
  }

}
