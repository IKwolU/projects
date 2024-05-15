<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'manager_id',
        'division_id',
        'advertising_source',
        'booking_id',
        'planned_arrival',
        'reason_for_rejection',
        'current_stage',
        'user_id',
    ];

    public function manager()
    {
        return $this->belongsTo(Manager::class);
    }

    public function division()
    {
        return $this->belongsTo(Division::class);
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
