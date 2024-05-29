<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    use HasFactory;

    protected $fillable = ['park_id', 'status_name', 'status_value', 'custom_status_name'];

    public function park()
    {
        return $this->belongsTo(Park::class);
    }
}
