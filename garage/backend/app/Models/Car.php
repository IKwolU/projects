<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    use HasFactory;

    protected $fillable = ['division_id', 'tariff_id', 'mileage', 'license_plate', 'old_status_id', 'status_id', 'rent_term_id', 'fuel_type', 'transmission_type', 'brand', 'model', 'year_produced', 'car_id', 'images', 'booking_time', 'user_booked_id', 'status'];

    public function division()
    {
        return $this->belongsTo(Division::class);
    }
    public function park()
    {
        return $this->hasOneThrough(Division::class, Park::class);
    }
    public function tariff()
    {
        return $this->belongsTo(Tariff::class);
    }
    public function rentTerm()
    {
        return $this->belongsTo(RentTerm::class);
    }
    public function booking()
    {
        return $this->hasMany(Booking::class);
    }
    public function status()
    {
        return $this->belongsTo(Status::class);
    }
}
