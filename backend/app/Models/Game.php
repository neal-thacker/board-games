<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'player_min',
        'player_max',
        'estimated_time',
        'min_age',
    ];

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
}