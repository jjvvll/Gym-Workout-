<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use Illuminate\Http\Request;

class ExerciseController extends Controller
{
    public function updateRestTime(Request $request, int $exerciseId)
    {
        $request->validate([
            'restTime' => 'required|integer|min:0',
        ]);

        $exercise = Exercise::findOrFail($exerciseId);

        $exercise->restTime = $request->input('restTime');
        $exercise->save();

        return response()->json([
            'success' => true,
            'message' => "Rest time updated for $exercise->name",
        ]);
    }
}
