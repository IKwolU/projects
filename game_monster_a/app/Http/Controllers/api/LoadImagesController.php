<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

class LoadImagesController extends Controller
{
    public function LoadImage(Request $request){
        $image = $request->upload;
        $name = md5(Carbon::now() . '_' . $image->getClientOriginalName()) . '.' . $image->getClientOriginalExtension();
        $filepath = Storage::disk('public')->putFileAs('/newsImages/inArticle', $image, $name);
        return response()->json(["url" => '/storage/'.$filepath]);
    }
}
