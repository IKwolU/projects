<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParkInventory extends Model
{
    use HasFactory;

    protected $fillable = ['type', 'park_id', 'content'];

    public function park()
    {
        return $this->belongsTo(Park::class);
    }
}
