<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\WorkoutSetResource;
use App\Models\WorkoutSet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WorkoutSetController extends Controller
{
    public function index()
    {
        // Returns all workout sets with exercises
        return WorkoutSetResource::collection(WorkoutSet::with('exercises.instances')->get());
    }

    public function show($id)
    {
        return WorkoutSet::with('exercises.instances')->findOrFail($id);
    }

    public function store(Request $request)
    {
        try {
            // Validate incoming JSON
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'description' => ['nullable', 'string'],
            ]);

            // // Get the authenticated user's ID
            // $userId = Auth::id();  // Returns the user ID

            // // Add user_id to the data
            // $validated['user_id'] = $userId;

            //  Save to database
            $workoutSet = WorkoutSet::create($validated);

            //  Success response
            return response()->json([
                'success' => true,
                'message' => 'Workout set created successfully',
                'data' => new WorkoutSetResource($workoutSet),
            ], 201);
        } catch (\Throwable $e) {
            // Failure response (unexpected errors)
            return response()->json([
                'success' => false,
                'message' => 'Failed to create workout set',
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            // Validate incoming JSON
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'description' => ['nullable', 'string'],
            ]);

            // Find the workout set or fail
            $workoutSet = WorkoutSet::findOrFail($id);

            // Update the database
            $workoutSet->update($validated);

            // Success response
            return response()->json([
                'success' => true,
                'message' => 'Workout set updated successfully',
                'data' => new WorkoutSetResource($workoutSet),
            ], 200);
        } catch (\Throwable $e) {
            // Failure response (unexpected errors)
            return response()->json([
                'success' => false,
                'message' => 'Failed to update workout set',
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            // Find the workout set or fail
            $workoutSet = WorkoutSet::findOrFail($id);

            // Delete it
            $workoutSet->delete();

            // Success response
            return response()->json([
                'success' => true,
                'message' => 'Workout set deleted successfully',
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // If not found
            return response()->json([
                'success' => false,
                'message' => 'Workout set not found',
            ], 404);
        } catch (\Throwable $e) {
            // Any other errors
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete workout set',
            ], 500);
        }
    }
}
