<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkoutLogs extends Model
{
    protected $fillable = ['user_id', 'target_area', 'weight', 'sets', 'total_reps',  'volume', 'rest_time', 'performed_on'];
}
