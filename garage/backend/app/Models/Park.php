<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Park extends Model
{
    use HasFactory;
    protected $fillable = ['API_key', 'url', "yandex_keys", 'comission', 'telegram_id', 'park_name', 'about', 'working_hours'];

    public function divisions()
    {
        return $this->hasMany(Division::class);
    }
    public function rent_terms()
    {
        return $this->hasMany(RentTerm::class);
    }
    public function tariffs()
    {
        return $this->hasMany(Tariff::class);
    }
    public function cars()
    {
        return $this->hasMany(Car::class);
    }
    public function managers()
    {
        return $this->hasMany(Manager::class);
    }
    public function bookings()
    {
        return $this->hasManyThrough(Booking::class, Car::class);
    }
}
