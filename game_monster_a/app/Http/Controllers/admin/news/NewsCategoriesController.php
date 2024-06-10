<?php

namespace App\Http\Controllers\admin\news;

use App\Http\Controllers\Controller;
use App\Http\Requests\NewsCategoriesRequest;
use App\Models\NewsCategory;
use Inertia\Inertia;

class NewsCategoriesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = NewsCategory::all();
        return Inertia::render('admin/news/newsCaregories', compact('categories'));
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
    public function store(NewsCategoriesRequest $request)
    {
        $data = $request->all();
        NewsCategory::create($data);

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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(NewsCategoriesRequest $request, string $id)
    {
        $model = NewsCategory::find($id);
        $model->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        NewsCategory::destroy($id);
    }
}
