<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\WorkoutSetResrource;
use App\Models\WorkoutSet;
use Illuminate\Http\Request;

class WorkoutSetController extends Controller
{
    public function index()
    {
        // Returns all workout sets with exercises
        return WorkoutSetResrource::collection(WorkoutSet::with('exercises')->get());
    }

    public function show($id)
    {
        return WorkoutSet::with('exercises')->findOrFail($id);
    }
}
