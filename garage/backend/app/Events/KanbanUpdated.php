<?php

namespace App\Events;

use App\Enums\UserType;
use App\Models\Park;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Auth;

class KanbanUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $user = Auth::guard('sanctum')->user();
        if ($user->user_type!==UserType::Manager->value) {
            return [];
        }
        $parkId = Park::where('id',$user->manager->park_id);

    if ($parkId) {
        return [
            new PrivateChannel('ParkKanban.'.$parkId),
        ];
    }

    return [];
    }
}
