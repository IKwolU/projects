<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\APIController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\CarsController;
use App\Http\Controllers\ManagerController;
use PHPUnit\Framework\Attributes\Group;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::post('auth/cars/booking', [CarsController::class, 'Book']);
    Route::post('auth/cars/cancel-booking', [CarsController::class, 'cancelBooking']);
    Route::post('user/logout', [AuthController::class, 'logout']);
    Route::delete('user', [AuthController::class, 'DeleteUser']);
    Route::get('user', [AuthController::class, 'GetUser']);
    Route::post('driver/upload-file', [DriverController::class, 'uploadDocs']);
    Route::get('admin/parks', [AdminController::class, 'getParks']);
    Route::get('admin/users', [AdminController::class, 'getUsers']);
    Route::get('admin/park', [AdminController::class, 'getParkWithDetails']);
    Route::put('admin/parks', [AdminController::class, 'changePark']);
    Route::post('admin/parks', [AdminController::class, 'createPark']);
});
Route::post('cars/search', [CarsController::class, 'SearchCars']);
Route::post('cars/brand-park-list', [CarsController::class, 'getFinderFilterData']);
Route::get('car', [CarsController::class, 'GetCar']);
Route::post('user/login', [AuthController::class, 'loginOrRegister']);
Route::post('user/code', [AuthController::class, 'CreateAndSendCode']);

Route::group(['middleware' => ['auth:sanctum', 'check.manager']], function () {
    Route::get('manager/park', [ManagerController::class, 'getParkManager']);
    Route::get('manager/park/key', [ManagerController::class, 'getParkKey']);
});

Route::group(['middleware' => 'api.key'], function () {
    Route::post('manager/cars', [ManagerController::class, 'pushCarsManager']);
    Route::put('manager/cars', [ManagerController::class, 'updateCarManager']);
    Route::put('manager/cars/rent-term', [ManagerController::class, 'updateCarRentTermManager']);
    Route::put('manager/cars/status', [ManagerController::class, 'updateCarStatusManager']);
    Route::post('manager/parks/rent-terms', [ManagerController::class, 'createOrUpdateRentTermManager']);
    Route::put('manager/parks', [ManagerController::class, 'updateParkInfoManager']);
    Route::post('manager/parks/division', [ManagerController::class, 'createParkDivisionManager']);
    Route::post('manager/parks/tariff', [ManagerController::class, 'createTariffManager']);
    Route::put('manager/parks/tariff', [ManagerController::class, 'updateTariffManager']);
    Route::put('manager/parks/division', [ManagerController::class, 'updateParkDivisionManager']);
    Route::put('manager/cars/booking', [ManagerController::class, 'updateCarBookingStatusManager']);
    Route::put('manager/cars/booking/prolongation', [ManagerController::class, 'BookProlongationManager']);
    Route::put('manager/cars/booking/replace', [ManagerController::class, 'BookReplaceManager']);
});
