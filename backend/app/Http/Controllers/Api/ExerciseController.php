<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExerciseResrource;
use App\Models\Exercise;
use App\Models\WorkoutSet;
use Illuminate\Http\Request;

class ExerciseController extends Controller
{

    public function store($workoutSetId, Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'is_bodyweight_exercise' => ['nullable', 'boolean'],
                'description' => ['nullable', 'string'],
                'restTime' => ['required', 'integer', 'min:0'],
            ]);

            $exercise = Exercise::create([
                'workout_set_id' => $workoutSetId,
                ...$validated,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Exercise created successfully',
                'data' => new ExerciseResrource($exercise),
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed: ' . $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create exercise',
            ], 500);
        }
    }

    public function destroy($exerciseId)
    {
        try {
            // Find the workout set or fail
            $exercise = Exercise::findOrFail($exerciseId);

            // Delete it
            $exercise->delete();

            // Success response
            return response()->json([
                'success' => true,
                'message' => 'Exercise deleted successfully',
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // If not found
            return response()->json([
                'success' => false,
                'message' => 'Exercise not found',
            ], 404);
        } catch (\Throwable $e) {
            // Any other errors
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete Exercise',
            ], 500);
        }
    }
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

    public function updateMemo(Request $request, $id)
    {
        $validated = $request->validate([
            'memo' => 'nullable|string',
        ]);

        $exercise = Exercise::findOrFail($id);

        $exercise->update([
            'memo' => $validated['memo'] ?? null,
        ]);

        // Re-fetch with relationships
        $exercise = $exercise->fresh(['instances']);
        return response()->json([
            'success' => true,
            'message' => 'Memo updated successfully.',
            'data' => new ExerciseResrource($exercise),
        ], 201);
    }
}
