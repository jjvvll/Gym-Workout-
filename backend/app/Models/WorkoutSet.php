<?php

namespace App\Models;

use App\Models\Scopes\UserScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkoutSet extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description'];

    protected static function booted()
    {
        static::addGlobalScope(new UserScope());

        // Automatically set user_id when creating
        static::creating(function ($workoutSet) {
            if (auth()->check() && !$workoutSet->user_id) {
                $workoutSet->user_id = auth()->id();
            }
        });
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function exercises()
    {
        return $this->hasMany(Exercise::class);
    }
}
