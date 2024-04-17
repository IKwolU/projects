<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BookingStatusChanged
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $user;
    public $booking;

    public function __construct($booking)
    {
        $this->user = $booking->driver->user;
        $this->booking = $booking;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('user.' . $this->user->id);
    }

    public function broadcastWith()
    {
        return [
            'message' => 'Статус бронирования изменен',
            'booking' => $this->booking
        ];
    }
}

event(new BookingStatusChanged($booking));
