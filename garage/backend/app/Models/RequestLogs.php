<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RequestLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'manager_id',
        'request_id',
        'type',
        'content',
    ];

    public function manager()
    {
        return $this->belongsTo(Manager::class);
    }

    public function request()
    {
        return $this->belongsTo(Request::class);
    }
}
