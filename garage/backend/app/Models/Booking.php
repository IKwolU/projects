<?php

namespace App\Models;

use App\Enums\BookingStatus;
use App\Events\BookingStatusChanged;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{


    use HasFactory;
    protected $fillable = ['car_id', 'driver_id', 'booked_at', 'booked_until', 'cancellation_reason', 'cancellation_source', 'park_id'];

    public function car()
    {
        return $this->belongsTo(Car::class);
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    public function schema()
    {
        return $this->belongsTo(Schema::class);
    }
}
