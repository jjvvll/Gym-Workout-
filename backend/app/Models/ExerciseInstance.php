<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExerciseInstance extends Model
{
    use HasFactory;

    protected $fillable = [
        'exercise_id',
        'weight',
        'weight_unit',
        'reps',
        'sets',
    ];

    public function exercise()
    {
        return $this->belongsTo(Exercise::class);
    }
}
