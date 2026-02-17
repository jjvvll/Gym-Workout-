<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exercise extends Model
{
    use HasFactory;

    protected $casts = [
        'is_bodyweight_exercise' => 'boolean',
    ];
    protected $fillable = ['workout_set_id', 'name', 'is_bodyweight_exercise', 'description',   'restTime',];

    public function workoutSet()
    {
        return $this->belongsTo(WorkoutSet::class);
    }

    public function instances()
    {
        return $this->hasMany(ExerciseInstance::class);
    }
}
