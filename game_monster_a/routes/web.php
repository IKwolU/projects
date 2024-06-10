<?php

use App\Http\Controllers\admin\news\NewsCategoriesController;
use App\Http\Controllers\admin\news\NewsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\settingsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserNewsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use \App\Http\Controllers\ChatController;

Route::get('/', [MainController::class, 'indexPage'])->name('home');
Route::get('/news', [UserNewsController::class, 'index']);
Route::get('/news/{id}', [UserNewsController::class, 'show']);
Route::post('/subscription', [UserNewsController::class, 'email_newsletter']);
Route::get('/games', [GameController::class, 'IndexUserPage']);
Route::get('/game/{id}', [ProductController::class, 'showByGameId']);
Route::get('/product/{id}', [ProductController::class, 'show']);

Route::get('/about', function () {
  return Inertia::render('about');
});

Route::get('/persmiss', function () {
    return Inertia::render('persmiss');
});

Route::prefix('chat')->middleware('auth')->group(function () {
  Route::get('/messages', [ChatController::class, 'fetchMessages']);
  Route::post('/message', [ChatController::class, 'sendMessage']);
});


Route::prefix('profile')->middleware('auth')->group(function () {
  Route::get('/', [ProfileController::class, 'index'])->name('profile');
  Route::post('/update/{id}', [UserController::class, 'update']);
  Route::post('/updatePassword/{id}', [UserController::class, 'updatePassword']);
  Route::post('/deleteSocial/{id}', [UserController::class, 'deleteSocial']);

  Route::get('/create-product', [ProductController::class, 'create']);
  Route::post('/create-product', [ProductController::class, 'store']);

  Route::get('/editProduct/{id}', [ProductController::class, 'edit']);
  Route::post('/productUpdate/{id}', [ProductController::class, 'update']);

  Route::post('/deleteProduct/{id}', [ProductController::class, 'destroy']);
});


//Авторизация
Route::post('/registration', [AuthController::class, 'CreateUser']);
Route::post('/login', [AuthController::class, 'Login']);
Route::get('/logout', [AuthController::class, 'Logout']);

//Авторизация Через соц. сети
Route::get('/login/vk', [AuthController::class, 'Vk']);
Route::get('/login/vkRollBack', [AuthController::class, 'VkRollBack']);

Route::get('/login/steam', [AuthController::class, 'Steam']);
Route::get('/login/steamRollBack', [AuthController::class, 'SteamRollBack']);

Route::get('/login/google', [AuthController::class, 'Google']);
Route::get('/login/googleRollBack', [AuthController::class, 'GoogleRollBack']);


Route::get('/login/facebook', [AuthController::class, 'Facebook']);
Route::get('/login/facebookRollBack', [AuthController::class, 'FacebookRollBack']);


//АДМИНКА
Route::prefix('admin')->middleware('role:SuperAdmin')->group(function () {
    Route::get('/', function () {
        return Inertia::render('admin/index');
    });
    Route::get('/settings', [settingsController::class, 'index']);
    Route::post('/settings/update/{id}', [settingsController::class, 'update']);


    Route::prefix('games')->group(function () {
      Route::get('/', [GameController::class, 'index'])->name('adminGames');

      Route::get('/create', [GameController::class, 'create']);
      Route::post('/create', [GameController::class, 'store']);

      Route::get('/edit/{id}', [GameController::class, 'edit']);
      Route::post('/update/{id}', [GameController::class, 'update']);

      Route::post('/delete/{id}', [GameController::class, 'destroy']);
    });

    Route::prefix('news')->group(function () {
        Route::get('/', [NewsController::class, 'index'])->name('adminNews');
        Route::get('/create', [NewsController::class, 'indexCreate']);
        Route::get('/edit/{id}', [NewsController::class, 'edit']);
        Route::post('/create', [NewsController::class, 'store']);
        Route::post('/destroy/{id}', [NewsController::class, 'destroy']);
        Route::post('/update/{id}', [NewsController::class, 'update']);

        Route::get('/editpostions', [NewsController::class, 'indexEditPositions']);
        Route::post('/editpostions', [NewsController::class, 'newsSavePositions']);

        Route::prefix('categories')->group(function () {
            Route::get('/', [NewsCategoriesController::class, 'index']);

            Route::post('/create', [NewsCategoriesController::class, 'store'])->name('AdminNewsCategories');
            Route::post('/delete/{id}', [NewsCategoriesController::class, 'destroy']);
            Route::post('/update/{id}', [NewsCategoriesController::class, 'update']);
        });
    });
});





//Ошибка 404

Route::get('/{any}', function () {
  return Inertia::render('404');
})->where('any', '.*');
