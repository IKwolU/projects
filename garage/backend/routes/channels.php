<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('ParkKanban.{ParkId}', function ($user, $parkId) {
    $user = Auth::guard('sanctum')->user();
    return (int) $user->manager->park_id === (int) $parkId;
});
