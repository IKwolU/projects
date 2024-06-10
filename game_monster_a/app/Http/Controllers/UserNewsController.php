<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\NewsCategory;
use App\Models\NewsPosition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserNewsController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    $news = News::all();
    foreach ($news as $key => $n) {
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

    $news = array_reverse($news);

    $categories = NewsCategory::all();
    return Inertia::render('news', compact('news', 'positions', 'categories'));
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    //
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    //
  }

  /**
   * Display the specified resource.
   */
  public function show(string $id)
  {
    $news = News::find($id);
    $news->content = json_decode($news->content);
    $news->categories = json_decode($news->categories);
    $nextNews = News::where('id', '>', $news->id)->oldest('id')->first();
    if ($nextNews) {
      $nextNews->image = json_decode($nextNews->image);
    }
    $previousNews = News::where('id', '<', $news->id)->latest('id')->first();
    if ($previousNews) {
      $previousNews->image = json_decode($previousNews->image);
    }

    $categories = NewsCategory::all();

    $allNews = News::all();

    $relatedNews = [];

    foreach ($news->categories as $category1) {
      foreach ($allNews as $n) {
        foreach (json_decode($n->categories) as $category2) {
          if ($category1 == $category2) {
            array_push($relatedNews, $n);
          }
        }
      }
    }
    $relatedNews = array_unique($relatedNews);
    $relatedNews = array_map(function ($value) {
      $x = $value;
      $x['content'] = json_decode($value['content']);
      $x['image'] = json_decode($value['image']);
      $x['categories'] = json_decode($value['categories']);
      return $x;
    }, $relatedNews);
    $relatedNews = array_slice($relatedNews, 0, 4);
    return Inertia::render('viewingNews', compact('news', 'categories', 'nextNews', 'previousNews', 'relatedNews'));
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function email_newsletter(Request $request): void
  {
    DB::table('email_newsletter')->insert([
      'email' => $request->email,
    ]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, string $id)
  {
    //
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(string $id)
  {
    //
  }
}
