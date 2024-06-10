<?php

namespace App\Http\Controllers\admin\news;

use App\Http\Controllers\Controller;
use App\Http\Requests\NewsRequest;
use App\Models\News;
use App\Models\NewsCategory;
use App\Models\NewsPosition;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function indexCreate()
    {
        $categories = NewsCategory::all();
        return Inertia::render('admin/news/newsCreate', compact('categories'));
    }

    public function index()
    {
        foreach ($news = News::all() as $key => $n) {
            $news[$key]['content'] = json_decode($n['content']);
            $news[$key]['image'] = json_decode($n['image']);
        }
        $positions = NewsPosition::all();
        return Inertia::render('admin/news/news', compact('news', 'positions'));
    }

    public function indexEditPositions()
    {
        foreach ($news = News::all() as $key => $n) {
            $news[$key]['content'] = json_decode($n['content']);
            $news[$key]['image'] = json_decode($n['image']);
        }
        $positions = NewsPosition::all();
        return Inertia::render('admin/news/newsPagePosition', compact('news', 'positions'));
    }

    public function newsSavePositions(Request $request)
    {
        if (!NewsPosition::find(1)) {
            NewsPosition::create([
                'positions' => json_encode($request->all())
            ]);
        } else {
            $news = NewsPosition::find(1);
            $news->positions = $request->all();
            $news->save();
        }
    }

    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(NewsRequest $request)
    {
        $image = $request->image;
        $name = md5(Carbon::now() . '_' . $image->getClientOriginalName()) . '.' . $image->getClientOriginalExtension();
        $filepath = Storage::disk('public')->putFileAs('/newsImages/inTitle', $image, $name);

        News::create([
            'categories' => json_encode($request->categories),
            'image' =>json_encode('/storage/' . $filepath),
            'content' => json_encode($request->content)
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $news = News::find($id);
        $categories = NewsCategory::all();
        $news->categories = json_decode($news->categories);
        $news->categories = array_map(function ($value) {
            return intval($value);
        }, $news->categories);
        $news->image = json_decode($news->image);
        return Inertia::render('admin/news/newsEdit', compact('news', 'categories'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $news = News::find($id);
        if ($image = $request->image) {
            $name = md5(Carbon::now() . '_' . $image->getClientOriginalName()) . '.' . $image->getClientOriginalExtension();
            $filepath = Storage::disk('public')->putFileAs('/newsImages/inTitle', $image, $name);

            $filepath = '/storage/' . $filepath;
        } else {
            $filepath = json_decode($news->image);
        }

        $news->update([
            'categories' => json_encode($request->categories),
            'image' => json_encode($filepath),
            'content' => json_encode($request->content)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        News::destroy($id);
    }
}
