<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Referral extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'coins'];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function inviter()
    {
        return $this->belongsTo(User::class, 'invited_id');
    }
}
