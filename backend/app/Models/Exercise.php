<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exercise extends Model
{
    use HasFactory;

    protected $fillable = ['workout_set_id', 'name', 'description',   'restTime',];

    public function workoutSet()
    {
        return $this->belongsTo(WorkoutSet::class);
    }

    public function instances()
    {
        return $this->hasMany(ExerciseInstance::class);
    }
}
