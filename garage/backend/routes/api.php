<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\APIController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\CarsController;
use App\Http\Controllers\KanbanController;
use App\Http\Controllers\ManagerController;
use App\Http\Controllers\SuperManagerController;
use App\Http\Controllers\TestController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Broadcast;
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
    Route::post('auth/cars/booking', [DriverController::class, 'Book']);
    Route::post('auth/cars/cancel-booking', [DriverController::class, 'cancelBooking']);
    Route::post('user/logout', [AuthController::class, 'logout']);
    Route::delete('user', [AuthController::class, 'DeleteUser']);
    Route::get('user', [AuthController::class, 'GetUser']);
    Route::post('driver/upload-file', [DriverController::class, 'uploadDocs']);

    Route::get('admin/parks', [AdminController::class, 'getParks']);
    Route::get('admin/users', [AdminController::class, 'getUsers']);
    Route::get('admin/park', [AdminController::class, 'getParkWithDetails']);
    Route::post('admin/park', [AdminController::class, 'createPark']);
    Route::post('driver/booking/check', [DriverController::class, 'checkActiveBookingDriver']);

    Broadcast::routes();
});

// создание заявки без авторизации!
Route::post('driver/application', [DriverController::class, 'createApplicationDriver']);

Route::post('cars/search', [CarsController::class, 'SearchCars']);
Route::post('cars/app-data', [DriverController::class, 'getFinderFilterData']);
Route::get('car', [CarsController::class, 'GetCar']);
Route::post('user/login', [AuthController::class, 'loginOrRegister']);
Route::post('user/code', [AuthController::class, 'CreateAndSendCode']);


Route::prefix('manager')->group(function () {
    Route::middleware(['auth:sanctum', 'check.manager'])->group(function () {

        Route::prefix('cars')->group(function () {
            Route::post('', [ManagerController::class, 'pushCarsManager']);
            Route::put('', [ManagerController::class, 'updateCarManager']);
            Route::put('rent-term', [ManagerController::class, 'updateCarRentTermManager']);
            Route::put('status', [ManagerController::class, 'updateCarStatusManager']);
            Route::put('booking', [ManagerController::class, 'updateCarBookingStatusManager']);
            Route::put('booking/prolongation', [ManagerController::class, 'BookProlongationManager']);
            Route::put('booking/replace', [ManagerController::class, 'BookReplaceManager']);
            Route::post('client', [ManagerController::class, 'pushCarsFromParkClientManager']);
            Route::post('photos', [ManagerController::class, 'pushPhotosToCarsManager']);
            Route::post('division', [ManagerController::class, 'assignCarsToDivisionManager']);
            Route::post('rent-term', [ManagerController::class, 'assignCarsToRentTermManager']);
            Route::post('tariff', [ManagerController::class, 'assignCarsToTariffManager']);
            Route::get('statuses/client', [ManagerController::class, 'getCarsCurrentStatusesFromClientManager']);
        });

        Route::prefix('park')->group(function () {
            Route::get('', [ManagerController::class, 'getParkManager']);
            Route::get('key', [ManagerController::class, 'getParkKeyManager']);
            Route::get('inventory-lists', [ManagerController::class, 'getParkInventoryListsManager']);
            Route::put('inventory-list', [ManagerController::class, 'changeParkInventoryListItemManager']);
            Route::post('inventory-list', [ManagerController::class, 'createParkInventoryListItemManager']);
            Route::delete('inventory-list', [ManagerController::class, 'deleteParkInventoryListItemManager']);
        });

        Route::prefix('parks')->group(function () {
            Route::post('rent-terms', [ManagerController::class, 'createOrUpdateRentTermManager']);
            Route::put('', [ManagerController::class, 'updateParkInfoManager']);
            Route::post('division', [ManagerController::class, 'createParkDivisionManager']);
            Route::post('tariff', [ManagerController::class, 'createTariffManager']);
            Route::put('tariff', [ManagerController::class, 'updateTariffManager']);
            Route::put('division', [ManagerController::class, 'updateParkDivisionManager']);
            Route::get('data', [ManagerController::class, 'getParksInitDataSuperManager']);
        });

        Route::post('statuses/client', [ManagerController::class, 'pushStatusesFromParkClientManager']);
        Route::get('statuses', [ManagerController::class, 'getParkStatusesForCarsManager']);
        Route::put('status', [ManagerController::class, 'changeParkStatusManager']);
        Route::put('auth/data', [ManagerController::class, 'pushAuthDataManager']);
        Route::get('bookings', [ManagerController::class, 'getParkBookingsManager']);
        Route::delete('schema', [ManagerController::class, 'deleteSchemaManager']);
        Route::post('test', [ManagerController::class, 'test']);
        Route::post('applications', [ManagerController::class, 'getParkApplicationsManager']);
        Route::post('notification', [ManagerController::class, 'createNotificationManager']);
        Route::get('notifications', [ManagerController::class, 'getNotificationsManager']);
        Route::get('notifications/all', [ManagerController::class, 'getAllNotificationsManager']);
        Route::put('notification', [ManagerController::class, 'updateNotificationManager']);
        Route::post('application', [ManagerController::class, 'createApplicationManager']);
        Route::post('application/comment', [ManagerController::class, 'createApplicationCommentManager']);
        Route::put('application', [ManagerController::class, 'updateApplicationManager']);
        Route::post('application/log', [ManagerController::class, 'getParkApplicationsLogItemsManager']);

        Route::middleware(['check.super.manager'])->group(function () {
            Route::prefix('super')->group(function () {
                Route::prefix('park')->group(function () {
                    Route::post('select', [SuperManagerController::class, 'selectParkForSuperManager']);
                    Route::post('block', [SuperManagerController::class, 'blockParkSuperManager']);
                    Route::post('unblock', [SuperManagerController::class, 'unblockParkSuperManager']);
                });
            });
        });
    });
});
